define(['backbone', 'underscore', 'jquery', 'metro_ui'], function (Backbone, Underscore, $) {
    "use strict";
    var UserView = Backbone.View.extend({
        tagName: "div",
        attributes: {
            "class": "tile double text-center bg-gray location-login-user"
        },
        events: {
            click: "onClick"
        },
        onClick: function () {
            var view, dialog, userTile, form, dialogForm;
            view = new UserView({model: this.model});
            form = $("#login-form-section");
            form.find("input[name=_username]").val(this.model.get('username'));
            userTile = form.find("#user-tile");
            userTile.empty();
            userTile.append(view.render().$el);
            dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '<span class="icon-user"></span>',
                title: "Login",
                width: 250,
                padding: 10,
                content: form.html()
            });
            dialog.find("[data-role=input-control], .input-control").inputControl();
            dialog.find("[data-transform=input-control]").inputTransform();
            dialog.find("#password").focus();
        },
        initialize: function () {
            this.template = Underscore.template(
                '<div class="tile-content icon"><i class="icon-user"></i></div><div class="tile-status"><span class="name"><%= nameFirst %> <%= nameLast %></span></div>'
            );
        },
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
    return UserView;
});
