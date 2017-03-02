define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',

        'models/worker/batchHeader',
        'text!templates/worker/home.html'
        ], function ($, _, Backbone, Marionette,

        		BatchHeader,
                layoutTemplate) {

    'use strict';

    return Marionette.Layout.extend({

        id:'home',
        template: layoutTemplate,
        
        events:{
        	'click .menu .item:not(.disabled)':'selectItem',
        	'click .btn-shutdown' : 'close'
        },
        
        serializeData:function(){
        	var types = ['Will Call', 'Express', 'Stock Order'];
        	var type = this.batchHeader.get('orderType') || {};
            if(!type.multiplePackFlag){this.batchHeader.set('packLocation', type.shortName + "1")}

            return {
        		model:(app.me)?app.me.toJSON():{},
        		batchHeader:this.batchHeader.toJSON(),
        		type: types[type.orderType-1],
                transferLocation : (this.batchHeader.get('transfer'))? this.batchHeader.get('transfer'): null
        	};
        },
        
        initialize:function(){
        	this.batchHeader = new BatchHeader();
        	this.batchHeader.fetch();
            this.stopListening(this.batchHeader);
        	this.listenTo(this.batchHeader, 'change', this.render);
        },

        onRender:function(){
            $('body').css({'background-color': '#5265B4'});
        },
        
        selectItem:function(e){
        	var action = $(e.currentTarget).attr('action');
        	if(action)
        		app.router.navigate(action, {trigger: true});
        },
        
        close:function(){
        	app.router.navigate('', {trigger: true});
        }
    });
});