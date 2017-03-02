define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/admin/security/deleteEquipment.html'
], function ($, _, Backbone, Marionette, METRO,

        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,

        serializeData:function(){
            return {
                model:this.model.toJSON()
            };
        },
        
        events: {
            'click button.success' : 'save',
            'click button.danger' : 'cancel',
            'click button.btn-close' : 'cancel'
        },
        
        save: function (e) {
            this.options.context.deleteEquipment(this.model.get('id'));
            this.cancel();
        },
        
        cancel:function(){
        	$('#deleteModal').parent().remove();
        }
    });
});