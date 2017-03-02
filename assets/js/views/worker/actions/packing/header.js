define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    '../alert',
    'text!templates/worker/actions/packing/header.html'
    ], function ($, _, Backbone, Marionette,

        alertWidget,
        layoutTemplate
    ) {

        'use strict';

        return Marionette.ItemView.extend({

            template: layoutTemplate,
            showAll:false,
            
            serializeData:function(){
            	var types = ['Will Call', 'Express', 'Stock Order'];
            	var type = this.model.get('orderType') || {};
             	return {
             		model:this.model.toJSON(),
             		info:type,
             		orderType:types[type.orderType-1],
             		countInfo:this.countInfo || {},
                    showAll:this.showAll
             	};
            },
            
            initialize: function () {
                this.stopListening(this.model);
                this.listenTo(this.model, 'change', this.render);
                app.vent.off('worker:packing:header:count');
                app.vent.off('transfer:accept');
                app.vent.on('worker:packing:header:count', this.changeCount, this);
                app.vent.on('transfer:accept', this.transfer, this);
            },

            onRender:function(){
                console.log('batch preview', this.model.toJSON());

                var location = (this.model.get('transfer'))?this.model.get('transfer').location:'';

                if(this.model.has('transfer') && this.model.get('transfer').show && !this.showed){
                    this.showed = true;
                    this.showDialog({title:'Alert', widget:alertWidget, width:300,height:100,renderData:{
                        action:function(){app.vent.trigger('transfer:accept');},
                            text:'Batch ID: '+this.model.get('masterBatchId')+'</br>Location: '+location
                    }});
                }
            },
            
            changeCount:function(data){
            	this.countInfo = data;
                this.showAll = data.showAll;
            	this.render();
            },

            transfer:function(){
                console.log('transfer');
                if(!this.accepted){
                    this.model.transferAccept(this.model.get('masterBatchId')).fetch({'silent':true});
                    this.accepted = true;
                }
                
            }
        });
});