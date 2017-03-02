define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/worker/selectWorker/userItem.html'
], function ($, _, Backbone, Marionette, METRO, rowTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'div',
        className: 'tile double-vertical double bg-cyan user',

        template: rowTemplate,

        events: {
            'click'   : 'onClick',
            'dblclick': 'onDblclick'
        },
        
        initialize:function(){},

        onClick: function (e) {
            app.vent.trigger('worker:selectUser', {userId:this.model.get('id')});
        },

        onDblclick: function () {}
    });
});