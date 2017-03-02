var app = app || {};

define(
    ['jquery', 'views/admin/users/editView', 'metro_ui'],
    function ($, UserEditView) {
        "use strict";

        function UserEditDialog(user, title, locations, orderTypes) {
            this.model = user;
            this.title = title;
            this.locations = locations;
            this.orderTypes = orderTypes;
        }

        UserEditDialog.prototype.show = function (onSave) {
            var self, content, view, dialog;
            self = this;
            view = new UserEditView({
                model: this.model,
                locations: this.locations,
                orderTypes: this.orderTypes,
                events: {
                    "submit form": function (event) {
                        event.preventDefault();
                        $('.btn-close').click();
                        onSave(this.model);
                    },
                    "click input[value=Cancel]": function (event) {
                        $('.btn-close').click();
                    },
                    "change input": function (event) {
                        var $input = $(event.target);
                        this.model.set($input.attr("name"), $input.val());
                    },
                    "change select[name=location]": function (event) {
                        var location, $select = $(event.target);
                        location = this.locations.get($select.val());
                        this.model.set("location", location);
                    },
                    "change select[name=orderType]": function (event) {
                        var orderType, $select = $(event.target);
                        orderType = this.orderTypes.get($select.val());
                        this.model.set("orderType", orderType);
                    },
                    "change select[name=role]": function (event) {
                        var role, $select = $(event.target);
                        role = $select.val();
                        this.model.set("roles", [role]);
                    },
                    "change input[type=checkbox]": function (event) {
                        var checked, name, $checkbox = $(event.target);
                        name = $checkbox.attr("name");
                        checked = $checkbox.prop("checked");
                        this.model.set(name, checked);
                    }
                }
            });

            dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '<span class="icon-user"></span>',
                title: self.title,
                padding: 10,
                width: 600,
                content: view.render().$el.html() // Yes it's stupid but it's the only way sizing works
            });
            content = dialog.children(".content");
            content.empty();
            content.append(view.render().$el);
            content.find("[data-role=input-control], .input-control").inputControl();
            content.find("[data-transform=input-control]").inputTransform();
        };

        return UserEditDialog;
    }
);
