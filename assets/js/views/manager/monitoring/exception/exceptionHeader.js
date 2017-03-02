define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/manager/monitoring/exception/exceptionHeader.html'
], function ($, _, Backbone, Marionette, METRO,  Template) { //TransferView,

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'div',

        template: Template,

        events: {
            'click .filterAll, .filterWillCall, .filterExpress, .filterTruck': 'filterOrders',
            'click .process' : 'buttonPress',
            'change [name="radioButton"]'   : 'sortByOverallRank'
        },

        onRender:  function(){
            this.markFilteredButton({currentTarget: '.filterAll'});
            this.hideButton();
        },

        resources: function (e) {
        },

        unCheckRadio: function(){
            this.$('[name="radioButton"]').removeAttr('checked');
        },

        checkRadio: function(){
            this.$('[name="radioButton"]').prop('checked', true);
        },

        sortByOverallRank: function(e){
            if(!$(e.currentTarget).is(':checked')) return false;
            else this.options.context.sortByOverallRank();
        },

        filterOrders: function(e){
            this.checkRadio();
            this.markFilteredButton(e);
            this.options.context.filterOrders({type: $(e.currentTarget).attr('data-keyword')});
        },

        buttonPress: function(e){
            this.options.context.process();
        },

        showButton: function(){
            this.$('.process').removeClass('hideBlock');
        },

        hideButton: function(){
            this.$('.process').addClass('hideBlock');
        },

        markFilteredButton: function(e){
            this.$(e.currentTarget).css({'background-color': 'rgb(226, 226, 226)'}).siblings().css({'background-color': 'inherit'});
        }

    });
});
