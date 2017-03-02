define(['backbone', 'underscore'], function (Backbone, Underscore) {
    "use strict";
    var View = Backbone.View.extend({
        tagName: "div",
        attributes: {
            "class": "tile double double-vertical location-select-item"
        },
        events: {
            click: function (event) {
                this.onClick(event);
            }
        },
        initialize: function () {
            this.template = Underscore.template(
                '<div class="tile-content icon"><i class="icon-cube"></i></div>' +
                    '<div class="tile-status"><span class="name"><%= name %></span></div>'
            );
        },
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },

        onClick: function () {}
    });
    return View;
});
