define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',
    './editLocation',
    './deleteLocation',
    'collections/admin/locationCollection',
    'text!templates/admin/locations/main.html'
], function ($, _, Backbone, Marionette, METRO,

        RowView,
        EditLocation,
        DeleteLocation,
        LocationCollection,
        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: RowView,

        itemViewContainer: 'tbody',

        events: {
            'click header .btn:not(.disable, .delete-location)': 'headerButtonPress',
            'click .delete-location' : 'showPopUp'
        },

        initialize: function () {
            console.log(this.collection.toJSON());
        },

        onRender : function () {},
        
        headerButtonPress : function (e) {
            var action = $(e.currentTarget).attr('action');
            var id = parseInt(this.$('input[type="radio"]:checked').attr('data-id'), 10);
            
            var model = (action == 'edit_location') ? this.collection.get(id) : null;
            if ((action == 'edit_location') && !id) {
                return;
            }
            
            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">'+action.replace('_', ' ')+'</span>',
                width: 850,
                height: 490,
                padding: 50,
                content: new EditLocation({model:model, collection:this.collection}).render().el
            });
        },
        
        showPopUp : function(){
            var that = this;
            var id = parseInt(this.$('input[type="radio"]:checked').attr('data-id'), 10);

            if(!id) return;
            var model = this.collection.findWhere({'id':id});

            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">Delete Location</span>',
                width: 450,
                height: 150,
                padding: 20,
                content: new DeleteLocation({context: that, model: model}).render().el
            });
        },

        deleteLocation: function(id){
            var that = this;
            this.collection.get(id).destroy({
                success: function (model, response) {
                    that.collection.trigger("change");
                    $('.window-overlay').click();
                },
                error: function(model,respons){
                    $('.window-overlay').click();
                    var message = JSON.parse(respons.responseText).error.text;
                    app.vent.trigger('adminError',{type: "showMessage", message: message});
                },
                wait: true
            });
        }
    });
});