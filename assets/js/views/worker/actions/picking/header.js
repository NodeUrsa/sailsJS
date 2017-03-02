define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    '../alert',
    'text!templates/worker/actions/picking/header.html'
    ], function ($, _, Backbone, Marionette,

        alertWidget,
        layoutTemplate
    ) {

        'use strict';

        return Marionette.ItemView.extend({

            template: layoutTemplate,
            
            serializeData:function(){
            	var types = ['Will Call', 'Express', 'Stock Order'];
            	var type = this.model.get('orderType') || {};
            	
             	return {
             		model:this.model.toJSON(),
             		orderType:types[type.orderType-1]
             	};
            },
            
            initialize: function () {
                this.stopListening(this.model);
                this.listenTo(this.model, 'change', this.render);
                app.vent.off('transfer:accept');
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

            transfer:function(){
                console.log('transfer');
                if(!this.accepted){
                    this.model.transferAccept(this.model.get('masterBatchId')).fetch({'silent':true});
                    this.accepted = true;
                }
            }
        });
});