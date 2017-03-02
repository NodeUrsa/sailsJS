define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/admin/orderTypeModel',
    'text!templates/admin/orderTypes/orderTypeDelete.html'
], function ($, _, Backbone, Marionette, METRO,

        Model,
        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,
        
        events: {
            'click button.success' : 'save',
            'click button.danger' : 'cancel'
        },
        
        initialize: function () {},
        
        serializeData:function(){
        	console.log(this.model.toJSON());
        	return {
        		model:this.model.toJSON()
        	};
        },

        onRender : function () {},
        
        save: function (e) {
        	this.model.destroy({
        		success:function(model,response){
        			console.log('model',model);
        			console.log('response', response);
        			$('.window-overlay').click();
        		},
                error: function(){
                    var message = "can't delete order type";
                    app.vent.trigger('adminError',{type: "showMessage", message: message});
                },
                wait: true
        	});
        },
        
        cancel:function(){
        	$('.window-overlay').click();
        }
    });
});