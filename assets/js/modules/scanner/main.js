define(function (require) {

    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    return Marionette.ItemView.extend({

        tagName: 'form',

        events: {
            'blur input': 'keepFocused',
            'submit'    : 'onChange'
        },

        template: _.template('<input type="text" name="label" autocomplete="off">'),

        initialize: function () {
            this.working = false;
            this.needsFocus = false;

            app.commands.setHandler('scanner:on', this.turnOn, this);
            app.commands.setHandler('scanner:off', this.turnOff, this);
        },

        turnOn: function () {
            var self = this;
            this.working = true;
            this.$('input').focus().val('');
            document.body.addEventListener('pointerout', function () {
                if (self.needsFocus) {
                    self.$('input').focus();
                    self.needsFocus = false;
                }
            });
        },

        turnOff: function () {
            this.working = false;
            this.$('input').blur().val('');
            $('body').off('mouseup');
        },

        keepFocused: function (e) {
            if (this.working) {
                this.needsFocus = true;
                this.$('input').click();
            }
        },

        mouseUp:function(e){
            this.keepFocused();
        },

        onChange: function (e) {
            var data = this.$('input').val();

            if (data && this.working) {
                this.$('input').val('');
                app.vent.trigger('scanner:data', this.parse(data));
            }
            return false;
        },

        parse: function (value) {
            var str = value.trim().toUpperCase().split(' '),
                qty = 1,
                pn  = '';

            if (str[str.length - 1] && /^\d+$/.test(str[str.length - 1])) {
                if(str.length > 1){
                	qty = +str[str.length - 1];
                	pn  = str.slice(0, str.length - 1).join(' ');
                }
                else{
                	pn  = str[0];
                }
            } else {
                pn  = value;
            }

            return {
                box: /^BOX\-/.test(str[0]),
                pn: pn,
                quantity: qty
            };
        }

    });

});
