define(function (require) {
    'use strict';

    // Libraries
    var $            = require('jquery'),
        Backbone     = require('backbone'),
        Marionette   = require('marionette');

    // Views
    var KioskPage    = require('views/kiosk/main'),
        CustomerView = require('views/kiosk/customer/main'),
        OrderView    = require('views/kiosk/order/main'),
        DriverView   = require('views/kiosk/driver/main'),
        PickingPage  = require('views/picking/main');

    return Backbone.Router.extend({

        routes: {
            ''       : 'customer',
            'home'   : 'customer',
            'phase/1': 'customer',
            'phase/2': 'order',
            'phase/3': 'driver',
            'phase/4': 'printing',
            'picking': 'picking'
        },

        initialize: function () {
            this.page = new KioskPage();
            Backbone.history.start();
        },

        customer: function () {
            this.page.phase = 1;
            this.page.render();
            this.page.content.show(new CustomerView($.extend(this.page.data.customer, {
                ctx: this.page
            })));
            this.page.footer.currentView.render();
            this.page.footer.$el.hide();
        },

        order: function () {
            this.page.phase = 2;
            this.page.content.show(new OrderView($.extend(this.page.data.order, {
                ctx: this.page
            })));
            this.page.footer.currentView.render();
            this.page.footer.$el.show();
        },

        driver: function () {
            this.page.phase = 3;
            this.page.content.show(new DriverView($.extend(this.page.data.order, {
                ctx: this.page
            })));
            this.page.footer.currentView.render();
            this.page.footer.$el.show();
        },

        printing: function () {
            this.page.phase = 4;
            this.page.content.currentView.onPrint();
        },

        picking: function () {
            this.page = new PickingPage();
            this.page.render();
        }

    });

});
