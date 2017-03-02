define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'models/worker/batch',
    './boxModeTable',
    'text!templates/worker/actions/picking/boxMode.html'
], function ($, _, Backbone, Marionette, METRO,

        Batch,
        Table,
        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,
        status: 'assign',
        availableType:'tobeScanned',
        
        events: {
            'click .remove' : 'remove',
            'click .exit' : 'exitMode',
            'click .remove-all' : 'removeAll',
            'click .button-set button:not(.disable)' : 'changeType'
        },

        regions:{
            available:'.available',
            assigned:'.assigned'
        },

        serializeData:function(){
            console.log('this.boxNumber',this.boxNumber);
            return {
                boxNumber : this.boxNumber || '',
                status : this.status
            };
        },
        
        initialize:function(){
            console.log('boxMode options', this.options);
            this.scanned = this.options.scanned;
            this.tobeScanned = this.options.tobeScanned;
            this.fullCollection = this.options.fullCollection;


            this.model = new Batch();
            this.listenTo(this.model, 'change', this.setBox);

            if(this.options.boxNumber){
                //this.boxNumber = this.options.boxNumber;
                this.box_mode(this.options.boxNumber);
            }
            
            this.availableList = new Backbone.Collection();
            this.assignedList = new Backbone.Collection();
            this.removedItems = new Backbone.Collection();

            app.vent.off('scanner:data');
            app.vent.on('scanner:data', this.assign, this);
        },

        onRender:function(){
            this.removedItems.reset();
            this.available.show(new Table({collection:(this.status == 'assign')?this.availableList:this.assignedList}));
            this.assigned.show(new Table({collection:(this.status == 'assign')?this.assignedList:this.removedItems}));
        },

        remove : function(){
            this.status = 'remove';
            this.render(); 
        },

        changeType:function(e){
            this.$('.button-set button').removeClass('active');
            this.availableType = $(e.currentTarget).attr('name');
            //$(e.currentTarget).addClass('active');
            this.filterCollections();
            //this.render();
        },

        exitMode : function(){
            if(this.status == 'remove'){
                this.status = 'assign';
                this.render();
                this.$('.button-set button').removeClass('disable');
                this.$('.button-set button[name="'+this.availableType+'"]').addClass('active');
            }
            else{
                $('.window-overlay').click();
            }
        },

        setBox:function(){
            this.assignedList.reset();
            this.assignedList.add(this.model.get('items'));
            var that = this;
            /*this.scanned.each(function(m){
                var model = that.assignedList.findWhere({'itemNumber':m.get('pn')});
                if(model){
                    var p = model.get('quantity');
                    var i = m.get(that.options.type);
                    if(that.options.type == 'picked'){
                        //m.set({'picked':p+i});
                    }
                    else{
                        //m.set({'packed':p+i});
                    }
                }
            });*/
            this.filterCollections();
            this.$('[name="boxNumber"]').val(this.boxNumber);
        },

        filterCollections:function(){
        	var selector = '.button-set button[name="'+this.availableType+'"]';
        	//console.log('type', selector, this.$(selector));
            if(this.status == 'assign'){
                this.$('.button-set button').removeClass('disable');
                this.$('.button-set button[name="'+this.availableType+'"]').addClass('active');
            }
            var that = this;
            this.availableList.reset();
            console.log('!filter', this.availableType, this[this.availableType]);
            this.availableList.add(this[this.availableType].filter(function(m){

                var i = (that.assignedList.findWhere({itemNumber:m.get('pn')}))?
                        that.assignedList.findWhere({itemNumber:m.get('pn')}).get('quantity') : 0;

                if(that.options.type == 'picked'){
                    if(that.availableType == 'scanned'){
                    	console.log('picked - scaned', m.get(that.options.type), 'i', i, m.toJSON());
                        m.set({ 'notBoxed' : m.get(that.options.type) - i });
                        return (m.get(that.options.type) - i > 0) ;
                    }
                    else{
                        m.set({ 'notBoxed' : m.get('shortage') });
                        return (m.get('shortage') > 0);
                    }
                }
                else{
                    if(that.availableType == 'scanned'){
                        m.set({ 'notBoxed' : m.get(that.options.type) - i });
                        return (m.get(that.options.type) - i > 0);
                    }
                    else{
                        m.set({ 'notBoxed' : m.get('picked') - i });
                        return (m.get('picked') - i > 0);
                    }
                }


            }));
        },

        removeAll:function(){
            var that = this;
            this.model.removeAll(this.boxNumber).fetch({
                success:function(model,response){
                    that.removedItems.add(that.assignedList.models);
                    that.model.set({items:[]});
                    that.setBox();
                },
                silent:true
            });
        },

        scan:function(item){
            this[this.status](item);
        },
        
        assign: function (item) {
            var that = this;
            var quantity = item.quantity;
            console.log('scann item:', JSON.stringify(item));
            if(item.box){
                this.box_mode(item.pn);
            }
            else{
                if (/*!this[this.availableType].length ||*/ !item) {
                	console.log('alrm 1');
                    $('#alarm')[0].play();
                    return;
                }
                if((this.availableList.findWhere({itemNumber:item.pn}) && this.status == 'assign') ||
                 (!this.assignedList.findWhere({itemNumber:item.pn}) && this.status == 'remove')) {
                	console.log('alrm 2');
                    $('#alarm')[0].play();
                    return;
                }

                if(this.status == 'assign'){
                	var str = item.pn + '';
                    var models = (this.fullCollection.where({ pn: item.pn }).length)?this.fullCollection.where({ pn: item.pn }) : this.fullCollection.where({ pn: (item.pn + '') });
                    var maxAvailQty = (this[this.availableType].where({ pn: item.pn })[0]) ? 
                    		this[this.availableType].where({ pn: item.pn })[0].get('notBoxed') : 0;
                }
                else{
                    var models = that.assignedList.where({itemNumber:item.pn});
                    var maxAvailQty = (this.assignedList.where({ itemNumber: item.pn })[0]) ? 
                    		this.assignedList.where({ itemNumber: item.pn })[0].get('quantity') : 0;
                }

                //console.log('models length', models.length);
                if(models.length){
                    
                    for(var i = 0; i < models.length; i++){
                        
                        var type = 0;
                        var itemQtytoBox = 0;

                        if(that.options.type == 'picked'){
                        	
                            if(that.availableType == 'scanned'){
                                type=3;
                                itemQtytoBox = models[i].get('picked');
                            }
                            else{
                                type=1;
                                itemQtytoBox = models[i].get('shortage');
                            }
                        }
                        else{
                            if(that.availableType == 'scanned'){
                                type=4;
                                itemQtytoBox = models[i].get('packed');
                            }
                            else{
                                type=2;
                                itemQtytoBox = models[i].get('picked') - models[i].get('packed');
                            }
                        }

                        console.log('maxAvailQty', maxAvailQty, 'itemQtytoBox', itemQtytoBox);
                        
                        if(itemQtytoBox <= 0 || maxAvailQty <= 0){
                            continue;
                        }
                        
                        var qty;
                        
                        if(maxAvailQty >= itemQtytoBox){
                        	if(itemQtytoBox >= quantity){
                        		qty = quantity;
                        		maxAvailQty -= quantity;
                        	}
                        	else{
                        		qty = itemQtytoBox;
                        		maxAvailQty -= itemQtytoBox;
                        	}
                        }
                        else{
                        	if(maxAvailQty >= quantity){
                        		qty = quantity;
                        		maxAvailQty -= quantity;
                        	}
                        	else{
                        		qty = maxAvailQty;
                        		maxAvailQty = 0;
                        	}
                        }
                        
                        var map = {
                            label:this.boxNumber,
                            pn:item.pn,
                            qty:qty,
                            orderNumber:models[i].get('orderNumber'),
                            type:type,
                            deliveryNum :this.options.orderModel.get('deliveryNum')
                        };

                        this.sentRequest(map, item, qty);
                    }
                }
                else{
                	console.log('alrm 3');
                    $('#alarm')[0].play();
                }
            }
        },

        sentRequest: function(map, item, qty){
            this.model[this.status](map).fetch({
                success: _.bind(function(model,response){
                    //console.log('response', response);
                    if(this.status == 'assign'){
                        this.assignItems(response, item, map, qty);
                    }
                    else{
                        this.removeItems(response, item, map, qty);
                    }
                    this.filterCollections();
                }, this),
                silent:true
            });
        },

        assignItems: function(response, item, map, qty){
            if ( this.assignedList.findWhere({ itemNumber : response.itemNumber })){
                this.assignedList.findWhere({ itemNumber : response.itemNumber }).set( response );
            }
            else{
                this.assignedList.add(response);
            }

            var scm = this.scanned.findWhere({ pn : response.itemNumber });
            var tbscm = this.tobeScanned.findWhere({ pn : response.itemNumber });

            if( scm && tbscm && this.availableType == 'tobeScanned' ){

                if(this.options.type == 'picked'){
                    tbscm.set({ shortage : tbscm.get('shortage')-response.assigned });
                }
                else{}
                 
                this.scanned.add( scm );
                    
            }
            else if( tbscm && this.availableType == 'tobeScanned' && this.options.type == 'picked'){
                tbscm.set({ shortage : tbscm.get('shortage') - response.assigned });
            }
            
            this.tobeScanned.add( tbscm );
            if(this.availableType == 'tobeScanned'){
            	app.vent.trigger('itemsList:changed', _.extend(map, { qty : response.assigned }));
            }
            this.assignedList.trigger('reset');
        },

        removeItems: function(response, item, map, qty){
            if(response.quantity >= 0){
                this.assignedList.findWhere({ itemNumber : response.itemNumber }).set( response );
                if(!response.quantity){
                	this.assignedList.remove(this.assignedList.findWhere({ itemNumber : response.itemNumber }));
                	//console.log(that.assignedList.toJSON());
                }
                response.quantity = qty;

                if(this.removedItems.findWhere({ itemNumber : response.itemNumber })){
                	var qua = this.removedItems.findWhere({ itemNumber : response.itemNumber }).get('quantity');
                	this.removedItems.findWhere({ itemNumber : response.itemNumber }).set({
                		quantity : qua + qty
                	});
                }
                else{
                	this.removedItems.add(response);
                }

                var scm = this.scanned.findWhere({ pn : response.itemNumber });
                if(scm){
                	if(this.options.type == 'picked'){
                		//scm.set({ 'picked' : scm.get( 'picked' ) + response.removed });
                	}
                	else{
                		//scm.set({ 'packed' : scm.get( 'packed' ) + response.removed });
                	}

                	this.scanned.add( scm );
                }
                else{
                	if(this.options.type == 'picked'){
                		this.scanned.add( { pn : response.itemNumber, picked : response.removed, orderNumber: response.orderNumber } );
                	}
                	else{
                		this.scanned.add( { pn : response.itemNumber, packed : response.removed, orderNumber: response.orderNumber, picked:0 } );
                	}
                }
                console.log('scanned', this.scanned.toJSON());
            }
            else{
                this.assignedList.remove( this.assignedList.findWhere({ itemNumber:response.itemNumber }));
                this.removedItems.add(response);
            }

            this.assignedList.trigger('reset');
            this.removedItems.trigger('reset');
        },

        box_mode:function(boxNumber){
            console.log(this.boxNumber, ' - ', boxNumber);
            if(this.boxNumber == boxNumber){
                $('.window-overlay').click();
                return;
            }
            this.boxNumber = boxNumber;
            this.model.getBox(this.boxNumber).fetch();
            this.$('[name="boxNumber"]').val(this.boxNumber);
        },

        destroy:function(){
            app.vent.off('scanner:data');
            app.vent.trigger('scanner:reset');
        }
    });
});