define([
    'jquery',
    'jquery_ui',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/admin/orderMatrixModel',
    './deleteEquipment',
    './securityRow',
    'collections/admin/orderMatrixCollection',
    'text!templates/admin/security/updateList.html'
], function ($, jqueryUi,_, Backbone, Marionette, METRO,

        orderMatrixModel,
        DeleteEquipment,
        securityRow,
        Collection,
        template) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: template,

        itemView: securityRow,

        itemViewContainer: 'tbody',

        events: {
            'click button.save':'save',
            'click button.delete':'showPopUp',
            'click button.disable':'disabledEquipment'




//            'click img.rowUp, img.rowDown': 'moveRow'
        },


        initialize: function () {
            this.itemViewOptions = {locationCollection: this.options.locationCollection};

            this.listenTo(this.collection, 'change', this.render, this);
        },

        onRender : function () {},

//        getMap:function($row){
//            var map  = {ranking: +$row.find('td:last').text()};
//            return map;
//        },

        save:function(){
            $('.window-overlay').click();
        },

        disabledEquipment: function(){
            var that = this;
            var row = this.$('tr.selected');
            if(row.length == 0){return false}
            var id = row.find('input[type="radio"]').attr('data-id'),
                model = this.collection.get(id),
                status = model.get('status'),
                newStatus;
            if(status == 0){newStatus = 1}
            if(status == 1){newStatus = 0}

            var data = {status: newStatus};

            this.collection.get(id).save({status: newStatus}, {
                success: function(model){
//                    that.collection.add(model, {merge: true});
//                    that.collection.trigger("change");
                },
                error: function(){
                    var message = "can't change status";
                    app.vent.trigger('adminError',{type: "showMessage", message: message});
                }
            });

        },

        showPopUp : function(){
            var that = this;
            var row = this.$('tr.selected');
            if (row.length == 0) {
                return;
            }
            var id = + row.find('input[type="radio"]').attr('data-id');

            if(!id) return;
            var model = this.collection.findWhere({'id':id});


            var content = new DeleteEquipment({context: that, model: model}).render().el;

            $('body').append(content);

//            var SplitText = "Title";
//            var $dialog = $('<div></div>')
//                .html(content)
//                .dialog({
//                    height: 150,
//                    width: 450,
//                    title: 'Title'});
//
//            $dialog.dialog('open');



//            var dialog = $.Dialog({
//                shadow: true,
//                overlay: true,
//                flat: true,
//                zIndex: 2000,
//                icon: '',
//                title: '<span class="capitalize">Delete Equipment</span>',
//                width: 450,
//                height: 150,
//                padding: 20,
//                content: new DeleteEquipment({context: that, model: model}).render().el
//            });
        },

        deleteEquipment: function(id){


                this.collection.get(id).destroy({
                    success: function () {},
                    error: function () {
                        var message = "can't remove equipment";
                        app.vent.trigger('adminError',{type: "showMessage", message: message});
                    }
                });


        }


    });
});