define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/admin/locations/deleteLocation.html'
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
            'click button.danger' : 'cancel'
        },
        
        save: function (e) {
            this.options.context.deleteLocation(this.model.get('id'));
        },
        
        cancel:function(){
        	$('.window-overlay').click();
        }
    });
});