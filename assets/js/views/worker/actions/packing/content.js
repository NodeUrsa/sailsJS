define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'nanoscroller',
    'moment',

    './rowWillCall',
    './emptyRow',
    './binLocation',
    './selectBinLocation',
    '../picking/boxMode',
    './dialogExt',
    './selectQuantity',
    './bigHeader',
    '../alert',
    'models/worker/order',
    'models/worker/batchItem',
    'models/worker/batch',
    'models/worker/binLocation',
    'collections/worker/binLocations',
    'text!templates/worker/actions/packing/content.html'
    ], function ($, _, Backbone, Marionette, nanoscroller, moment,

    	RowWillCall,
    	EmptyRow,
        binLocation,
        selectBinLocation,
        boxMode,
        dialog,
        SelectQuantity,
        BigHeader,
        alertWidget,
        Order,
        BatchItem,
        Batch,
        BinLocationModel,
        binsCollection,
        layoutTemplate
    ) {

        'use strict';

        return Marionette.CompositeView.extend({

        	itemView:RowWillCall,
        	emptyView:EmptyRow,
            template: layoutTemplate,
            itemViewContainer:'tbody',
            rows:[RowWillCall],
            curOrder:0,
            avalOrders: true,
            availableToPack:0,

            events:{
                'click td:last-child' : 'quantityPack'//,
                //'click td:nth-child(2)' : 'devPack'//TODO DO NOT COMMIT WITH THIS
            },
            
            serializeData : function(){
            	return {
            		type:this.type+1,
            		orderModel:this.orderModel.toJSON().orderType,
                    model:(this.model)?this.model.toJSON():{}
            	};
            },
            
            initialize: function(){
            	this.orderModel = this.options.orderModel || new Backbone.Model();

                this.fullCollection = new Backbone.Collection();
                this.collection = new Backbone.Collection();
                this.available = new Backbone.Collection();
                this.batchItem = new BatchItem();
                this.combined = new Backbone.Collection();

            	if(!this.orderModel.has('orderType'))
            		this.listenTo(this.orderModel, 'change', this.setType);
            	else
            		this.setType();

                this.removeHendlers();
                this.setHendlers();
            },

            setHendlers:function(){
                app.vent.on('worker:packing:show_header', this.show_header, this);
                app.vent.on('worker:packing:show_all', this.show_all, this);
                app.vent.on('scanner:data', this.pack, this);
                app.vent.on('scanner:reset', this.scannerReset, this);
                app.vent.on('worker:packing:bin_location', this.binLocation, this);
                app.vent.on('worker:packing:box_mode', this.box_mode, this);
                app.vent.on('worker:packing:binLocation:new', this.newBinLocation, this);
                app.vent.on('worker:packing:collections:chenged', this.filteringCollection, this);
                app.vent.on('worker:packing:bin_location:assigned', this.getOrder, this);
                app.vent.on('worker:packing:bin_location:assign:accept', this.binLocationAccept, this);
                app.vent.on('itemsList:changed', this.changeItemsList, this);
            },

            removeHendlers:function(){
                app.vent.off('worker:packing:show_header');
                app.vent.off('worker:packing:show_all');
                app.vent.off('scanner:data');
                app.vent.off('scanner:reset');
                app.vent.off('worker:packing:bin_location');
                app.vent.off('worker:packing:box_mode');
                app.vent.off('worker:packing:binLocation:new');
                app.vent.off('worker:packing:collections:chenged');
                app.vent.off('worker:packing:bin_location:assigned');
                app.vent.off('worker:packing:bin_location:assign:accept');
                app.vent.off('itemsList:changed');
            },

            scannerReset:function(){
                app.vent.on('scanner:data', this.pack, this);
            },

            beforeRender:function(){
                this.fullCollection.reset();
                this.fullCollection.add(this.model.get('items'));
                this.showAll = false;
                app.vent.trigger('worker:packing:header:count', {curOrder:this.curOrder-1, showAll:this.showAll});
                this.filteringCollection();
            },

            fullSort:function(){
                var items = this.fullCollection.toJSON().slice();
                for(var i = 0; i < items.length; i++){
                    items[i] = _.extend(items[i], items[i].quantity);
                    delete items[i].quantity;
                }
                this.fullCollection.reset();
                this.fullCollection.add(items);
            },

            combining:function(){
                this.fullSort();
                this.combined.reset();
                var items = this.fullCollection.toJSON().slice();


                var combined = null;
                    combined = [];
                for(var i = 0; i < items.length; i++){
                    var pn = items[i].pn;
                    if(combined[pn]){
                        combined[pn].allocated += items[i].allocated;
                        combined[pn].cancelled += items[i].cancelled;
                        combined[pn].packed += items[i].packed;
                        combined[pn].picked += items[i].picked;
                        combined[pn].shortage += items[i].shortage;
                    }
                    else{
                        combined[pn] = items[i];
                    }
                }

                var comItems = [];
                //var count = 1;
                for(var i in combined){
                    //combined[i].line = count;
                    comItems.push(combined[i]);
                    //count++;
                }

                this.combined.add(comItems);
                //console.log(this.combined.toJSON());
            },

            filteringCollection : function(){
                this.combining();
                this.collection.reset();
                //this.available.reset();

                var models = this.combined.toJSON(),
                    picked = [];
                    
                for(var i = 0, l = models.length; i < l; i++){
                    if(!models[i].picked && models[i].shortage < 0) continue;
                    var pack = models[i].packed;
                    var pick = models[i].picked;
                    var allCan = (models[i].allocated - models[i].cancelled);
                        if (pack < pick && pack < allCan)
                            picked.push(models[i]);
                }

                this.availableToPack = picked.length;
                //this.available.add(picked);

                if(this.showAll){
                    this.collection.add(models);
                }
                else{
                    this.collection.add(picked);
                }

                if(!picked.length && !this.sorted){
                    this.render();
                    this.binLocation();
                }
                else{
                    this.sorted = false;
                    this.render();
                }

                this.sorted = false;

                this.updateScroll();
            },
            
            setType:function(e){
                this.ordersCount = this.orderModel.get('ordersCount');
                this.curOrder = this.orderModel.get('currentOrder');
            	var type = this.orderModel.get('orderType') || {};
            	this.type = type.orderType-1;
            	this.itemView = this.rows[this.type || 0];
                this.getOrder();
            },
            
            updateScroll:function(){
            	this.$(".nano").nanoScroller({ destroy: true });
            	this.$(".nano").nanoScroller();
                if(this.availableToPack)
                    $('.bin-location').addClass('disable');
            },

            getOrder:function(){
                if(this.avalOrders && this.curOrder <= this.ordersCount){
                    this.model = new Order({id:this.curOrder});
                    this.stopListening(this.model);
                    this.listenTo(this.model, 'change', this.beforeRender);
                    this.model.fetch();
                    this.curOrder++;
                    if(this.curOrder > this.ordersCount) {
                        this.avalOrders = false;
                    }
                }
                else{
                    this.finish();
                }
            },

            show_header:function(e){
                this.showDialog({title:'Header Info', widget:BigHeader, width:900,height:300, renderData:{model:this.model}});
                /*var e = e.e,
                    btn = $(e.currentTarget),
                    small = this.$('.header.small'),
                    big = this.$('.header.big');
                if(big.hasClass('disnone')){
                    btn.find('.lable').text('Hide Header');
                    big.removeClass('disnone');
                    small.addClass('disnone');
                    small.siblings(".table-wraper").addClass('big');
                }
                else{
                    btn.find('.lable').text('Show Header');
                    big.addClass('disnone');
                    small.removeClass('disnone');
                    small.siblings(".table-wraper").removeClass('big');
                }

                this.updateScroll();*/
            },

            devPack:function(e){
                $('.scanner input').val($(e.currentTarget).text()).parent().submit();
            },

            pack:function(item){
                console.log('main pack', item, this.collection.length, this.blocked);
                if(!this.collection.length || this.blocked) return;
                var that = this;

                var models = this.fullCollection.where({ pn: item.pn });
                var quantity = item.quantity;
                    
                if(models.length){
                    for(var i = 0; i < models.length; i++ ){
                        var picked = models[i].get('picked');
                        var packed = models[i].get('packed');
                        var shortage = picked - packed;
                        if(quantity <= 0) {
                            break;
                        }
                        if(shortage <= 0){
                                continue;
                        }
                        var qty;
                        if(shortage <= quantity){
                            qty = shortage;
                            quantity -= qty;
                        }
                        else{
                            qty = quantity;
                            quantity = 0;
                        }

                        this.blocked = true;
                        this.batchItem.pack({id:models[i].get('id'), quantity: qty }).fetch({
                            success:function(model,response){
                                that.blocked = false;
                                that.fullCollection.get(model.get('id')).set(model.toJSON());
                                that.filteringCollection();
                            }
                        });
                    }

                    if(!shortage){
                    	this.playError();
                    }
                    else if(quantity>0){
                        this.showDialog({title:'Alert', widget:alertWidget, width:300,height:220,renderData:{
                            action:function(){app.vent.trigger('worker:picking:collections:chenged');},
                            text:'Please remove '+ quantity +' additional items from the box!'}});
                    }
                }
                else{
                    this.playError();
                }
            },

            changeItemsList:function(data){
                console.log('data', data);

                var model = this.fullCollection.findWhere({'pn':data.pn});
                model.set({
                    //'shortage':model.get('shortage')-data.qty,
                    'packed':model.get('packed')+data.qty
                });
                this.fullCollection.add(model);
                this.filteringCollection();
            },

            show_all:function(e){
                var e = e.e,
                    el = $(e.currentTarget);
                if(el.find('.lable').text() == 'Show All'){
                    el.find('.lable').text('Hide Processed');
                    this.showAll = true;
                }
                else{
                    el.find('.lable').text('Show All');
                    this.showAll = false;
                }

                //$('.btn.show-header .lable').text('Show Header');
                this.sorted = true;
                this.filteringCollection();
            },

            box_mode:function(e, boxNumber){
                console.log(e, boxNumber);
                this.available.reset();
                this.available.add(this.fullCollection.filter(function(m){
                    return m.get('packed');
                }));

                this.showDialog({title:'Box mode', widget:boxMode, width:500,height:300,
                    renderData:{type:'packed', orderModel:this.model, tobeScanned:this.collection, scanned:this.available, 
                    fullCollection:this.fullCollection, boxNumber:boxNumber || e.pn}
                });
            },

            binLocation:function(){
                this.orderComplite();
                if(this.orderModel.get('orderType') && !this.orderModel.get('orderType').binLocationFlag) {
                    this.getOrder();
                    return;
                }
                var that = this;
                $('.bin-location').removeClass('disable');
                var bins = new binsCollection(this.model.get('customerNumber'));
                bins.fetch({
                    success:function(collection, response){
                        console.log('collection',collection);
                        if(!collection.length){
                            that.newBinLocation();
                        }
                        else{
                            that.showDialog({title:'What Bin Location should be use on this order?', widget:binLocation, width:650,height:100,
                                renderData:{model:that.model, orderModel:that.orderModel, collection:bins}
                            });
                        }
                    }
                });
            },

            newBinLocation:function(){
                this.showDialog({title:'Please Select Bin Location', widget:selectBinLocation, width:700,height:560,
                    renderData:{model:this.model, orderModel:this.orderModel, collection:this.fullCollection}
                });
            },

            binLocationAccept:function(map){
                var that = this;
                this.showDialog({title:'Alert', widget:alertWidget, width:300,height:220,renderData:{
                    action:function(){
                        var model = new BinLocationModel();
                        map.force = true;
                        model.assign(map).fetch({
                            success:function(model, response){
                                $('.window-overlay').click();
                                app.vent.trigger('worker:packing:bin_location:assigned');
                            }
                        });
                    },
                    onClose:_.bind(function(){}, this),
                    onCancel:_.bind(function(){ 
                        $('.window-overlay').click();
                        app.vent.trigger('worker:packing:binLocation:new'); 
                    }, this),
                    buttons:[
                        {'text':'Yes','class':'success'},
                        {'text':'No','class':'danger'}
                    ],
                    text:'Another customer already has an order on that pallet. Do you want to proceed?'
                }});
            },

            quantityPack:function(e){
                var pn = $(e.currentTarget).attr('pn');
                var model = this.fullCollection.findWhere({'pn':pn});
                var picked = model.get('picked');
                var packed = model.get('packed');
                var shortage = picked - packed;
                console.log('model', model.toJSON());
                if(!shortage){
                	//this.playError();
                }
                else{
                	this.showDialog({title:'Input Quantity', widget:SelectQuantity, width:500,height:300,renderData:{pn:pn}});
                }
            },

            orderComplite:function(){
                console.log('orderModel', this.model.get('orderNumber'));
                var batch = new Batch();
                batch.compliteOrder(this.model.get('orderNumber')).fetch({silent:true});
            },

            finish:function(){
                console.log('finish', this.model);
                this.removeHendlers();
                app.commands.execute('scanner:off');
                var batch = new Batch();
                batch.finish(this.orderModel.get('masterBatchId')).fetch({
                    success:function(){
                        app.router.navigate('home',{trigger:true});
                    }
                });
            },

            playError:function(){
                $('#alarm')[0].pause();
                $('#alarm')[0].currentTime = 0;
                $('#alarm')[0].play();
            }
        });
});