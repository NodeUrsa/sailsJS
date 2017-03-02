define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    './transfer',
    'text!templates/manager/monitoring/header.html'
], function ($, _, Backbone, Marionette, METRO, TransferView, Template) {

    'use strict';

    return Marionette.ItemView.extend({

        tagName: 'div',

        template: Template,

        events: {
            'click .add-resource'   : 'resources',
            'click .transfer'   : 'transfer',
            'change [name="radioButton"]'   : 'sortByOverallRank'
        },
        
//        serializeData:function(){
//
//            var model = (this.model)?this.model.toJSON():{};
//            return {model: model};
//        },
        
        initialize:function(){
        },

        resources: function (e) {
            console.log('resources');
        },

        showButton: function(){
            if(this.model.get('batchNumber')) this.$('.transfer').removeClass('hideBlock');
            else this.hideButton();

        },

        hideButton: function(){
            this.$('.transfer').addClass('hideBlock');
        },

        unCheckRadio: function(){
            this.$('[name="radioButton"]').removeAttr('checked');
        },

        sortByOverallRank: function(e){
            if(!$(e.currentTarget).is(':checked')) return false;
            else this.options.context.sortFilterCollection(null, null, 'overallRank');
        },

        transfer: function (e) {
            var id = this.options.locationId;
            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                zIndex: 500,
                icon: '',
//                title: '<span class="capitalize"></span>',
                width: 800,
                height:600,
                padding: 20,
                content: new TransferView({model: this.model}).render().el
//                content: new TransferView({locationId: this.options.locationId, collection:this.collection}).render().el
            });
        }
    });
});