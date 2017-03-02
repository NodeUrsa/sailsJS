define(
    ['jquery', 'underscore', 'views/admin/orderTypes/editView', 'metro_ui'],
    function ($, Underscore, OrderTypeEditView) {
        "use strict";

        function OrderTypeEdit(orderType, title, locations, activities) {
            this.model = orderType;
            this.title = title;
            this.locations = locations;
            this.activities = activities;
        }

        OrderTypeEdit.prototype.show = function (onSave) {
            var self, content, view, dialog;
            self = this;
            view = new OrderTypeEditView({
                model: this.model,
                locations: this.locations,
                activities: this.activities,
                events: {
                    "submit form": function (event) {
                        event.preventDefault();
                        $('.btn-close').click();
                        onSave(this.model);
                    },
                    "click input[value=Cancel]": function (event) {
                        $('.btn-close').click();
                    },
                    "change input:not([type=checkbox])": function (event) {
                        var $input = $(event.target);
                        this.model.set($input.attr("name"), $input.val());
                    },
                    "change input[type=checkbox]:not([data-location-id]):not([data-activity-id])": function (event) {
                        var checked, name, $checkbox = $(event.target);
                        name = $checkbox.attr("name");
                        checked = $checkbox.prop("checked");
                        this.model.set(name, checked);
                    },
                    "change input[data-location-id]": function (event) {
                        var checked, locationId, location, name, $checkbox = $(event.target);
                        checked = $checkbox.prop("checked");
                        locationId = Number($checkbox.attr("data-location-id"));
                        location = this.locations.findWhere({'id': locationId});
                        if (location) {
                            if (checked) {
                                this.model.addLocation(location.toJSON());
                            } else {
                                this.model.removeLocation(location.toJSON());
                            }
                        }
                    },
                    "change input[data-activity-id]": function (event) {
                        var checked, activityId, activity, name, $checkbox = $(event.target);
                        checked = $checkbox.prop("checked");
                        activityId = Number($checkbox.attr("data-activity-id"));
                        activity = this.activities.findWhere({'id': activityId});
                        if (activity) {
                            if (checked) {
                                this.model.addActivity(activity.toJSON());
                            } else {
                                this.model.removeActivity(activity.toJSON());
                            }
                        }
                    }
                }
            });

            dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '<span class="icon-cube"></span>',
                title: self.title,
                padding: 10,
                width: 300,
                content: view.render().$el.html() // Yes it's stupid but it's the only way sizing works
            });
            content = dialog.children(".content");
            content.empty();
            content.append(view.render().$el);
            content.find("[data-role=input-control], .input-control").inputControl();
            content.find("[data-transform=input-control]").inputTransform();
        };

        return OrderTypeEdit;
    }
);
