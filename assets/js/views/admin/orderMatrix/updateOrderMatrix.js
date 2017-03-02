define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'models/admin/orderMatrixModel',
    './matrixRow',
    './deleteMatrixItem',
    'collections/admin/orderMatrixCollection',
    'text!templates/admin/orderMatrix/updateOrderMatrix.html'
], function ($, _, Backbone, Marionette, METRO,

        orderMatrixModel,
        matrixRow,
        DeleteMatrixItem,
        Collection,
        template) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: template,

        itemView: matrixRow,

        itemViewContainer: 'tbody',

        events: {
            'click button.save':'save',
            'click button.delete':'showPopUp',



            'click img.rowUp, img.rowDown': 'moveRow'
        },


        initialize: function () {

        },

        onRender : function () {},

        getMap:function($row){
            var map  = {ranking: +$row.find('td:last').text()};
            return map;
        },

        save:function(){
            var that = this,
                collArr = that.collection.toJSON();


            for(var i = 0; i < collArr.length; i++) {
                var id = collArr[i].id,
                    $tboby = this.$('tbody'),
                    $row = $tboby.find('input[data-id="'+ id +'"]').closest('tr');
                if($row.length != 0){
                    var map = that.getMap($row);

                    that.collection.get(id).save(map,{
                        success: function () {},
                        error: function () {
                            console.log("error save matrix order");
                        }
                    });
                }
                else if ($row.length == 0){
                    that.collection.get(id).destroy({
                        success: function () {},
                        error: function () {
                            console.log("error delete matrix item");
                        }
                    });
                }
            }
            $('.window-overlay').click();
        },

        deleteItem: function(){
            var rowColl = this.$('tbody tr'),
                selectedRow = this.$('input[name="orderMatrix"]:checked').closest('tr'),
                selectedRanking = +selectedRow.find('td:last').text();

            if(selectedRow.length == 0){return}
            for(var i = selectedRanking; i < rowColl.length; i++){
                var currRowRankCont = rowColl.eq(i).find('td:last');
                currRowRankCont.text(i);
            }
            selectedRow.remove();

        },

        moveRow: function(e){
            var rowColl = this.$('tbody tr'),
                action = $(e.target).attr('class'),
                selectedRow = rowColl.find('input[name="orderMatrix"]:checked').closest('tr'),
                prevRow = selectedRow.prev(),
                nextRow = selectedRow.next(),
                selectedRanking = selectedRow.find('td:last').text();
            if(action == "rowUp" && prevRow.length != 0){
                this.exchangeRanks(selectedRow, prevRow);
                prevRow.before(selectedRow);
            }
            else if (action == "rowDown" && nextRow.length != 0){
                this.exchangeRanks(selectedRow, nextRow);
                nextRow.after(selectedRow);
            }
        },

        exchangeRanks: function($row1, $row2){
            var rank1Cont = $row1.find('td:last'),
                rank2Cont = $row2.find('td:last');
            var rank1 = $row1.find('td:last').text(),
                rank2 = $row2.find('td:last').text();
            rank1Cont.text(rank2);
            rank2Cont.text(rank1);
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


            var content = new DeleteMatrixItem({context: that, model: model}).render().el;

            $('body').append(content);

        },

        deleteMatrixItem: function(){
            var rowColl = this.$('tbody tr'),
                selectedRow = this.$('input[name="orderMatrix"]:checked').closest('tr'),
                selectedRanking = +selectedRow.find('td:last').text();

            if(selectedRow.length == 0){return}
            for(var i = selectedRanking; i < rowColl.length; i++){
                var currRowRankCont = rowColl.eq(i).find('td:last');
                currRowRankCont.text(i);
            }
            selectedRow.remove();
        }

    });
});