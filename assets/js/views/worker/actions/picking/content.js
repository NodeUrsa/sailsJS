define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'nanoscroller',

    './row',
    './emptyRow',
    './summary',
    './boxMode',
    './finishPhase',
    '../packing/selectQuantity',

    '../alert',

    'models/worker/batch',
    'models/worker/batchItem',

    'text!templates/worker/actions/picking/content.html'
    ], function ($, _, Backbone, Marionette, nanoscroller,

    	Row,
    	EmptyRow,
        Summary,
        BoxMode,
        FinishPhase,
        SelectQuantity,
        alertWidget,
        Batch,
        BatchItem,
        layoutTemplate
    ) {

        'use strict';

        return Marionette.CompositeView.extend({

        	itemView:Row,
        	emptyView:EmptyRow,
            template: layoutTemplate,
            itemViewContainer:'tbody',
            type: 'asc',
            availableToPick:0,

            events:{
                //'click td:nth-child(2)' : 'devPick',//TODO DO NOT COMMIT WITH THIS
                'click td:last-child' : 'quantityPick',
                'click th:nth-child(2)' : 'sort',
                'click th:nth-child(3)' : 'grupByBox'
            },

            serializeData:function(){
                console.log('serialize', this.type);
                return {
                    type:this.type
                };
            },

            initialize:function(){
                this.model = new Batch();
                
                this.batchItem = new BatchItem();
                this.collection = new Backbone.Collection();
                this.available = new Backbone.Collection();
                this.combined = new Backbone.Collection();
                this.fullCollection = new Backbone.Collection();

                this.combined.comparator = function(m){
                    return m.get('locator');
                };

                this.collection.comparator = function(m){
                    return m.get('locator');
                };

                this.fullCollection.comparator = function(m){
                    return m.get('locator');
                };

                this.stopListening(this.model);
                this.listenTo(this.model, 'change', this.onRenderCollection);
                this.model.fetch();
                
                this.removeHendlers();
                this.setHendlers();
            },

            setHendlers:function(){
                app.vent.on('worker:picking:summary', this.summary, this);
                app.vent.on('worker:picking:finish', this.finish, this);
                app.vent.on('worker:picking:collections:chenged', this.filteringCollection, this);
                app.vent.on('scanner:reset', this.scannerReset, this);
                app.vent.on('scanner:data', this.pick, this);
                app.vent.on('worker:picking:show-all', this.show_all, this);
                app.vent.on('worker:picking:box_mode', this.box_mode, this);
                app.vent.on('worker:picking:finish-phase', this.finishPhase, this);
                app.vent.on('itemsList:changed', this.changeItemsList, this);
            },

            removeHendlers:function(){
                app.vent.off('worker:picking:summary');
                app.vent.off('worker:picking:finish');
                app.vent.off('worker:picking:collections:chenged');
                app.vent.off('scanner:reset');
                app.vent.off('scanner:data');
                app.vent.off('worker:picking:show-all');
                app.vent.off('worker:picking:box_mode');
                app.vent.off('worker:picking:finish-phase');
                app.vent.off('itemsList:changed');
            },

            onRender:function(){
                console.log('!!!!!model', this.model.toJSON());
                this.isBoxModeEnabled();
                this.updateScroll();
            },

            onRenderCollection:function(){
                console.log('!!!!!model', this.model.toJSON());
                this.isBoxModeEnabled();
                this.fullCollection.add(this.model.get('items'));
                this.filteringCollection();
            },

            isBoxModeEnabled:function(){
                if(this.model.get('ordersCount') == 1 && this.model.get('orderType') && this.model.get('orderType').orderType == 1){
                    $('.btn.box-mode').removeClass('disable');
                }
                else{
                    $('.btn.box-mode').addClass('disable');
                }
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
                    combined = {};
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
                
                for(var i in combined){
                    comItems.push(combined[i]);
                }

                this.combined.add(comItems);
            },

            filteringCollection : function(){
                this.combining();
                this.collection.reset();
                
                var models = this.combined.toJSON(),
                    picked = [];
                    
                for(var i = 0, l = models.length; i < l; i++){
                    if(models[i].shortage && models[i].shortage > 0)
                        picked.push(models[i]);
                }

                this.availableToPick = picked.length;

                if(this.showAll){
                    this.collection.add(models, {silent:true});
                }
                else{
                    this.collection.add(picked, {silent:true});
                }

                this.sort();

                console.log('picked.length', picked.length);
                if(!picked.length && !this.sorted) this.summary();
                this.sorted = false;
                this.updateScroll();
            },

            /*devPick:function(e){
                $('.scanner input').val($(e.currentTarget).text()).parent().submit();
            },*/

            pick: function (item) {
                console.log('main pick', item);
                if (!this.collection.length || (!item && !item.pn) || this.blocked) return;
                this.asc = this.$('[name="locator"]').attr('type');
                var that = this;

                if(item.box){
                    this.box_mode(null, item.pn);
                }
                else{
                    var models = this.fullCollection.where({ pn: item.pn });
                    var quantity = item.quantity;
                    
                    if(models.length){
                        for(var i = 0; i < models.length; i++ ){
                            var shortage = models[i].get('shortage');
                            if(quantity <= 0) {
                                break;
                            }
                            if(!shortage){
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
                            this.batchItem.pick({id:models[i].get('id'), quantity: qty }).fetch({
                                success:function(model,response){
                                    that.blocked = false;
                                    model.set(model.get('quantity'));
                                    model.unset('quantity');
                                    that.fullCollection.get(model.get('id')).set(model.toJSON());
                                    that.filteringCollection();
                                },
                                error:function(model,response){
                                    that.blocked = false;
                                }
                            });
                        }
                        
                        console.log('model', quantity, shortage, qty);
                        
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
                }
            },

            changeItemsList:function(data){
                console.log('data', data);

                var model = this.fullCollection.findWhere({'pn':data.pn});
                model.set({
                    'shortage':model.get('shortage')-data.qty,
                    'picked':model.get('picked')+data.qty
                });
                this.fullCollection.add(model);
                this.filteringCollection();
            },

            sort:function(e){
                var el = this.$('[name="locator"]');
                var i = el.find('i');
                i.removeClass('icon-arrow-down-4');
                i.removeClass('icon-arrow-up-4');

                this.collection.sort();
                this.fullCollection.sort();

                if(e){
                    if(el.attr('type')== 'asc'){
                        this.type = '';
                        el.removeAttr('type');
                    }
                    else{
                        this.type = 'asc';
                        el.attr('type', 'asc');
                    }
                }
                    
                if(this.type == 'asc'){
                    i.addClass('icon-arrow-up-4');
                }
                else{
                    i.addClass('icon-arrow-down-4');
                    this.collection.models = this.collection.models.reverse();
                    this.fullCollection.models = this.fullCollection.models.reverse();
                }

                this.collection.trigger('reset');
            },
            
            grupByBox:function(e){
            	var $el = $(e.currentTarget);
            	var grouping = $el.attr('grouping');
            	var that = this;
            	var sort = 1;
            	
            	switch (grouping) {
	            	case 'asc':
	            		$el.attr({'grouping' : 'desc'});
	            		sort = 0;
	            		break;
	            	case 'desk':
	            		$el.attr({'grouping' : 'asc'});
	            		sort = 1;
	            		break;
	            	default:
	            		$el.attr({'grouping' : 'asc'});
            			sort = 1;
            	}
            	
            	var box = new Backbone.Collection();
            	var unbox = new Backbone.Collection();

            	box.comparator = function(m){
            		return m.get('locator');
            	};

            	unbox.comparator = function(m){
            		return m.get('locator');
            	};

            	this.collection.filter(function(m){
            		if((m.get('allocated') - (m.get('allocated') % m.get('stdpk'))) / m.get('stdpk')){
            			box.add(m);
            		}
            		else{
            			unbox.add(m);
            		}
            	});

            	this.collection.reset(null,{silent:true});

            	if(!sort){
            		box.models = box.models.reverse();
            		unbox.models = unbox.models.reverse();
            	}

            	box.each(function(m){
            		that.collection.push(m,{silent:true});
            	});

            	unbox.each(function(m){
            		that.collection.push(m,{silent:true});
            	});

            	this.collection.trigger('reset');
            },

            show_all:function(e){
                console.log('picking show all', this);
                var el = $(e.e.currentTarget);
                if(el.find('.lable').text() == 'Show All'){
                    this.showAll = true;
                    el.find('.lable').text('Hide Processed');
                }
                else{
                    this.showAll = false;
                    el.find('.lable').text('Show All');
                }
                this.sorted = true;
                this.filteringCollection();
            },
            
            finishPhase:function(){
                console.log('finish-phase');
                if(this.availableToPick){
                    this.showDialog({title:'Alert', widget:FinishPhase, width:500,height:220});
                }
                else{
                    this.summary();
                }
            },
            
            summary:function(){
                this.showDialog({title:'Summary', widget:Summary, width:620,height:300,
                    renderData:{model:this.model, collection:this.fullCollection}
                });
            },

            quantityPick:function(e){
                var pn = $(e.currentTarget).attr('pn');
                var model = this.fullCollection.findWhere({'pn':pn});
                console.log('model', model.toJSON());
                if(!model.get('shortage')){
                	//this.playError();
                }
                else{
                	this.showDialog({title:'Input Quantity', widget:SelectQuantity, width:500,height:300,renderData:{pn:pn}});
                }
            },
            
            finish:function(){
                app.commands.execute('scanner:off');
                this.removeHendlers();
                this.model.finish(this.model.get('masterBatchId')).fetch({
                    success:function(){
                        app.router.navigate('home',{trigger:true});
                    },
                    silent:true
                });
            },

            updateScroll:function(){
                this.$(".nano").nanoScroller({ destroy: true });
                this.$(".nano").nanoScroller();
            },

            scannerReset:function(){
                app.vent.off('scanner:data');
                app.vent.on('scanner:data', this.pick, this);
            },

            box_mode:function(e, boxNumber){
                console.log($('.btn.box-mode').hasClass('disable'));
                if($('.btn.box-mode').hasClass('disable')){
                    return;
                }
                this.available.reset();
                this.available.add(this.fullCollection.filter(function(m){
                    return m.get('picked');
                }));

                this.showDialog({title:'Box mode', widget:BoxMode, width:500,height:300,
                    renderData:{type:'picked', 
                    orderModel:new Backbone.Model(this.model.get('orders')[0]), 
                    scanned:this.available, 
                    tobeScanned:this.collection,
                    fullCollection:this.fullCollection,
                    boxNumber:boxNumber
                }});
            },

            playError:function(){
                $('#alarm')[0].pause();
                $('#alarm')[0].currentTime = 0;
                $('#alarm')[0].play();
            }
    });
});