define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'collections/customerCollection',
    'collections/orderCollection',

    './subviews/footer',

    'text!templates/kiosk/layout.html',
//    'text!templates/kiosk/page5_packingslip.html',
    'libs/jquery-ui/jquery.widget.min',
    'libs/jquery/jquery.cookie',
    'libs/signature_pad/signature_pad.min',
    'metro_ui'
], function ($, _, Backbone, Marionette, METRO,
        CustomerCollection,
        OrderCollection,

        FooterView,
        
        layoutTemplate) {

    'use strict';

    return Marionette.Layout.extend({

        el: $('#page'),

        template: layoutTemplate,

        regions: {
            title   : '.kioskTitle',
            content : '.kiosk_content',
            footer  : '.kiosk_footer_buttons'
        },

        initialize: function () {
            this.customerCollection = new CustomerCollection();
            this.orderCollection    = new OrderCollection();

            this.customerCollection.fetch();
//            this.orderCollection.fetch();

            this.data = {};
            this.data.customer = {
                collection: this.customerCollection
            };
            this.data.order = {
                collection: this.orderCollection
            };

            app.commands.setHandler('kiosk:resize:content', this.resizeContent, this);

            app.vent.on('kiosk:customer:select', this.onSelectCustomer, this);
        },

        resizeContent: function (force) {
            var contentElement = this.$('.data-content'),
                oldHeight = contentElement.height(),
                newHeight = $(window).height() - 230;
            if (oldHeight > newHeight || force) {
                contentElement.height(newHeight);
            }
        },

        onRender: function () {
            this.footer.show(new FooterView({
                ctx: this
            }));
        },

        onSelectCustomer: function (data) {
            this.orderCollection.fetch({
                data: {
                    id: data.customerNumber
                }
            });
            //this.data.order.collection = new Backbone.Collection(this.data.order.collection);
            Backbone.history.navigate('phase/2', { trigger: true });
        }

    });
  
});