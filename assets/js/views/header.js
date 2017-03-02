define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/header.html'
], function ($, _, Backbone, Marionette, METRO, Template) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'div',

        template: Template,
        
        serializeData:function(){
            return {section:this.options.section};
        },
        
        initialize : function(){},

        events: {
            'click'   : 'onClick',
            'dblclick': 'onDblclick'
        },

        onClick: function (e) {},

        onDblclick: function () {}
    });
});