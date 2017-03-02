define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',
    './addEquipment',
    './updateList',

    'collections/admin/securityCollection',
    'text!templates/admin/security/main.html'
], function ($,  _, Backbone, Marionette, METRO,

        Row,
        addEquipment,
        updateList,
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

        initialize: function () {

            var that = this;
            this.collection = new Collection();
            this.collection.fetch({data:{'locationId':this.options.locationId},

                success: function(collection){
                    that.collection = collection;
//                    that.reRender();
                },
                error: function(){}
            });

            this.listenTo(this.collection, 'change', this.render, this);


        },

        onRender : function(){},

        onShow: function(){},
        
        headerButtonPress : function (e) {
            var action = $(e.currentTarget).attr('action');
            var dialog;
            if (action == 'add') {
                dialog = $.Dialog({
                    shadow: true,
                    overlay: true,
                    flat: true,
                    icon: '',
//                title: '<span class="capitalize"></span>',
                    width: 650,
                    height:400,
                    padding: 20,
                    content: new addEquipment({locationId: this.options.locationId, collection:this.collection}).render().el
                });
            }
            if (action == 'edit') {
                dialog = $.Dialog({
                    shadow: true,
                    overlay: true,
                    flat: true,
                    zIndex: 500,
                    icon: '',
//                title: '<span class="capitalize"></span>',
                    width: 800,
                    height:600,
                    padding: 20,
                    content: new updateList({locationId: this.options.locationId, collection:this.collection}).render().el
                });
            }

        }
    });
});