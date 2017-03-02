define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',
    'text!templates/kiosk/page5_packingslip.html'
], function ($, _, Backbone, Marionette, METRO, layoutTemplate) {

    'use strict';

    return Marionette.ItemView.extend({

        template: layoutTemplate,

        className: 'printing_form',

        checkLine: function(lineNum, firstPage){
            for (var i = 0; i < 50; i++){
                if(lineNum == firstPage + i*37 ){
                    return true;
                }
            }
            return false;
        },

        firstPagesHeight: {},


        initialize: function () {
            var data = [];
            console.log(this.collection.toJSON());
            for(var i = 0; i < this.collection.length; i++){
                if(this.collection.at(i).get('checked')){
                    data.push({
                        customerNumber: this.collection.at(i).toJSON().customerNumber,
                        deliverNum: this.collection.at(i).toJSON().deliveryNum,
                        orderNumber: this.collection.at(i).toJSON().orderNumber
                    });
                    this.collection.at(i).set('checked', false);
                }
            }
            var that = this;
            $.ajax({
                url:"kiosk/print",
                type: 'post',
                data: {orders: data},
                success: function(printObject){
                    console.log("send get arrToPrint");
                    that.printObject = printObject;

                    that.pageHeightObj();
                    that.render();
//                    window.print();
                },
                error: function(){
                    alert("error get arrToPrint");
                }
            });
        },

        pageHeightObj: function(){
            var that = this;
            _.each(this.printObject, function(arr, key){
                that.firstPagesHeight[key] = 25;
            });
        },

        serializeData: function () {

            this.mainArr = [];
            var that = this;

            _.each(this.printObject, function(arr, key){

                var order = that.collection.findWhere({orderNumber: key}).toJSON(),
                    boxArr = _.reject(arr, function(obj){return obj.boxNumber == ""});
                order.boxCount = boxArr.length;

                that.mainArr.push({
                    order: order,
                    arr: arr,
                    firstPage: that.firstPagesHeight[key]
                });
            });


            return {
                mainArr: this.mainArr,
                checkLine: this.checkLine
            };
        },

        onRender: function(){
            var that = this;

            var isBack = this.checkPagesHeight();
            if(isBack){this.render(); return;}

            this.setPageNumbers();


            var imageCount = 0;
            this.$('.companyName img').load(function(){
                imageCount++;
                if(imageCount == that.mainArr.length){
                    window.print();
                    $(document).find('#printing').remove();
                    location.href = '/kiosk';
                }
            });
        },


        setPageNumbers: function(){
            var pageNumbers = this.$('.pageNum');

            for(var k = 0; k < this.mainArr.length; k++){
                var pageColl = pageNumbers.filter("[data-keyword="+this.mainArr[k].order.orderNumber+"]");
                for(var j = 0; j < pageColl.length; j++){
                    pageColl.eq(j).find('span').text((j+1) + "/" + pageColl.length);
                }
            }
        },

        checkPagesHeight: function(){
            var firstPageColl = this.$('.addressRow').closest('.printingPage');
            var isRender = false;
            for(var i = 0; i < firstPageColl.length; i++){
                if(firstPageColl.eq(i).height() > 790){
                    isRender = true;
                    var orderNumber = firstPageColl.eq(i).find('.pageNum').attr('data-keyword');
                    this.firstPagesHeight[orderNumber]--;
                }
            }
            return isRender;
        }

    });

});