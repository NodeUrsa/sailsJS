define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/worker/selectWorker/locationItem.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'div',
        className: 'tile double-vertical double bg-cyan',

        template: rowTemplate,

        events: {
            'click'   : 'onClick',
            'dblclick': 'onDblclick'
        },
        
        initialize:function(){},

        onClick: function (e) {
            $.cookie('locationId', this.model.get('id'), {
            	path: '/',
        	    expires: 100
        	});
            app.vent.trigger('worker:selectLocation', {locationId:this.model.get('id')});
        },

        onDblclick: function () {}
    });
});