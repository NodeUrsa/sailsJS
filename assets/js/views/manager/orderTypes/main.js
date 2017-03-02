define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',
    './editOrderType',
    'collections/admin/orderTypesCollection',
    'text!templates/manager/orderTypes/main.html'
], function ($, _, Backbone, Marionette, METRO,

        Row,
        editOrderType,
        Collection,
        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: Row,

        itemViewContainer: 'tbody',
        
        events: {
            'click header .btn': 'headerButtonPress'
        },

        collectionEvents: {
            'sort': 'render',
            'change': 'render'
        },

        initialize: function () {
            this.collection    = new Collection();
            this.collection.fetch({data:{'locationId':this.options.locationId}});
            this.collection.sort();
        },

        onRender : function () {},
        
        headerButtonPress : function (e) {
            var action = $(e.currentTarget).attr('action');
            var id = parseInt(this.$('input[type="radio"]:checked').attr('data-id'));
            if (!id) {
                return;
            }
            var model = this.collection.findWhere({'id':id}) || null;

            
            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">'+action+' Order Type</span>',
                width: 1110,
                height:250,
                padding: 20,
                content: new editOrderType({model: model}).render().el
            });
        }
    });
});