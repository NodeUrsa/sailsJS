define(
    [
        'backbone',
        'underscore',
        'text!templates/home.html!strip'],
    function (Backbone, Underscore, template) {
        "use strict";
        var IndexView = Backbone.View.extend({
            el: "#page",
            initialize: function () {
                this.template = Underscore.template(template);
            },
            render: function () {
                var context = {
                    isAdmin: this.model.isAdmin(),
                    isManager: this.model.isManager()
                };
                this.$el.html(this.template(context));
                return this;
            }
        });
        return IndexView;
    }
);
