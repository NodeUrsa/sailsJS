define([
    'jquery',
    'jquery_ui',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './transferEmptyView',
    './transferRow',
    'collections/manager/transferCollection',
    'text!templates/manager/monitoring/transfer.html'
], function ($, jqueryUi,_, Backbone, Marionette, METRO,
        EmptyView,
        transferRow,
        Collection,
        template) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: template,

        itemView: transferRow,

        emptyView: EmptyView,

        itemViewContainer: 'tbody',
        selectMethod: "1",

        events: {
            'click button.save':'process',
            'click button.delete':'cancel',
            'click input[name="nextWorker"]':'changeMethod'

        },

        serializeData:function(){
            console.log("modelOrder", this.model.toJSON());
            return {
                model:(this.model)?this.model.toJSON() : {}
            };
        },

        initialize: function () {
            var that = this;
            this.collection = new Collection();
            this.collection.fetch({
                data:{'locationId':app.me.get('locationId')},
//                data:{locationId: 46},
                success: function(collection){
                    if(that.model.get('user')){
                        var model = that.collection.get(that.model.get('user').id);
                        if(model){that.collection.remove(model)}
                    }
                },
                error: function(){alert("can't get workers")}
            });

//            this.listenTo(this.collection, 'change', this.render, this);

        },

        onRender : function () {},

        cancel: function(){
            $('.window-overlay').click();
        },

        changeMethod: function(e){

            var inputColl = this.$('tbody [type="radio"]'),
                select = $(e.target).attr('value');

            inputColl.removeAttr('checked');


            if(this.selectMethod != select && select == "1"){
                this.selectMethod = select;
                this.$('table').append('<div class="fence"></div>');

            }else if(this.selectMethod != select && select == "2"){
                this.selectMethod = select;
                this.$('.fence').remove();
            }
        },

        process: function(){
            var that = this,
                url,
                userId = this.$('tbody [type="radio"]:checked').attr('data-id'),
                logOff = this.$('[name="logOff"]').is(':checked'),
                location = this.$('[name="position"]').val(),
                masterBatchId = this.model.get('batchNumber');

            if(!userId && that.selectMethod == "2"){
                app.vent.trigger('adminError',{type: "showMessage", message: "Please, select user"});
                return;
            }else if(userId && that.selectMethod == "2"){
                url = "/batch/transfer?userId=" + userId + "&masterBatchId=" + masterBatchId + "&logOff=" + logOff + "&location=" + location;
            }
            else if(!userId && that.selectMethod == "1"){
                url = "/batch/transfer?masterBatchId=" + masterBatchId  + "&logOff=" + logOff + "&location=" + location;
            }

            $.ajax({
                url: url,
                type: "get",
                success: function(){
                    if(that.selectMethod == "2"){
                        app.vent.trigger('batch:worker:change', {user: that.collection.get(userId).toJSON(), batchNumber: masterBatchId});
                    }else{
                        app.vent.trigger('batch:worker:change', {user: false, batchNumber: masterBatchId});
                    }
                    $('.transfer').addClass('hideBlock');
                    $('.window-overlay').click()
                },
                error: function(){
                    app.vent.trigger('adminError',{type: "showMessage", message: "can't save"});
                }
            });
        }

    });
});