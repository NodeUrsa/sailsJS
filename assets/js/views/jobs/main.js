define([
    'jquery',
    'jquery_ui',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'collections/jobs/jobCollection',
    './changeJob',
    './row',
    'text!templates/jobs/layout.html',
    'libs/jquery-ui/jquery.widget.min',
    'metro_ui'

], function ($, jquery_ui, _, Backbone, Marionette, METRO,

            Collection,
            ChangeJob,
            RowView,
            layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: RowView,

        itemViewContainer: 'tbody',


        initialize: function () {
            this.collection = new Collection();
            this.collection.fetch({
                success: function(coll){console.log("JOBS", coll.toJSON())},
                error: function(){alert("can't get jobs array")}
            });
        },

        events: {
            'click td': 'changeJob'
        },

        changeJob: function(e){
            var name = $(e.target).closest('tr').find('[name="name"]').text();

            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
//                title: '<span class="capitalize"></span>',
                width: 650,
                height:400,
                padding: 20,
                content: new ChangeJob({name: name}).render().el
            });
        }


    });

});