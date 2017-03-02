define([
    'jquery',
    'jquery_ui',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'collections/manager/exceptionWorkersCollection',
    './processEmptyView',
    './processRow',
    'text!templates/manager/monitoring/exception/process.html'
], function ($, jqueryUi,_, Backbone, Marionette, METRO,
             WorkersCollection,
             EmptyView,
             transferRow,
             template) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: template,

        itemView: transferRow,

        emptyView: EmptyView,

        itemViewContainer: 'tbody',

        selectMethod: "2",

        events: {
            'click button.save':'process',
            'click button.delete':'cancel',
            'click input[name="nextWorker"]':'changeMethod'

        },

        serializeData:function(){
            return {
                model:(this.model)?this.model.toJSON() : {}
            };
        },

        initialize: function () {
            var that = this;
            this.model = this.options.context.model;
            this.collection = new WorkersCollection();
            this.collection.fetch({
                data:{
                    orderNumber: this.model.get('orderNumber'),
                    deliveryNumber: this.model.get('deliveryNum')
                },
                success: function(){
                    console.log('exception workers get success');
                },
                error: function(){
                    alert("can't get exception workers");
                }
            });
        },

        onRender : function () {},

        cancel: function(){
            $('.window-overlay').click();
        },

        changeMethod: function(e){

            var inputColl = this.$('tbody [type="radio"]'),
                trColl =  this.$('tbody tr'),
                select = $(e.target).attr('value');

            inputColl.removeAttr('checked');
            trColl.removeClass('selected');


            if(this.selectMethod != select && select == "1"){
                this.selectMethod = select;
                this.disableTable();

            }else if(this.selectMethod != select && select == "2"){
                this.selectMethod = select;
                this.enabledTable();
            }
        },

        disableTable: function(){
            var $table = this.$('table');
            $table.append('<div class="fence"></div>');
            var $fence = this.$('.fence');
            $fence.offset($table.offset());
            $fence.width($table.width() + 2);
            $fence.height($table.height() + 2);
        },

        enabledTable: function(){
            this.$('.fence').remove();
        },

        process: function(){
            var that = this,
                url,
                userId = this.$('tbody [type="radio"]:checked').attr('data-id'),
                orderNumber = this.model.get('orderNumber'),
                deliveryNumber = this.model.get('deliveryNum');

            if(!userId && that.selectMethod == "2"){
                app.vent.trigger('adminError',{type: "showMessage", message: "Please, select user"});
                return;
            }else if(userId && that.selectMethod == "2"){
                url = "/monitoring/exception/create?userId=" + userId + "&orderNumber=" + orderNumber + "&deliveryNumber=" + deliveryNumber;
            }
            else if(!userId && that.selectMethod == "1"){
                url = "/monitoring/exception/create?orderNumber=" + orderNumber + "&deliveryNumber=" + deliveryNumber;
            }

            $.ajax({
                url: url,
                type: "get",
                success: function(){
                    console.log('exception create batch success');
                    that.options.context.deleteOrder();
                    $('.window-overlay').click();
                },
                error: function(){
                    alert("can't create batch");
                }
            });
        }

    });
});