define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './header',
    'widgets/tables/main',
    'collections/manager/monitoring',
    'text!templates/manager/monitoring/tabView.html',
    'text!templates/manager/monitoring/tabs.html'

], function ($, _, Backbone, Marionette, METRO,

             Header,
             TableView,
             Monitoring,
             tabView,
             tabsTemplate) {

    'use strict';

    return Marionette.Layout.extend({

        template: tabView,
        className:'tab-control',
        subTypes:['UPS','Fedex','OnTrac','LoneStar','SpeeDee','BBExpress','MGC','Others'],
        subtype:0,
        filteredCollection: null,

        regions:{
            header:'header',
            content:'.table-box'
        },

        ui: {
            "tabs": ".tabs"
        },

        events:{
            'click ul.tabs li' : 'filterSubTypes',
            'click .theadMain th' : 'sortTable'
        },

        collectionEvents:{
            'change': 'showTable'
        },

        initialize:function(){
            console.log("Tab View", this.options);

            if(this.options.tab == 1){
                this.subtype = 1;
            }
            app.vent.off('batch:worker:change');
            app.vent.on('batch:worker:change', this.changeBatchWorker, this);

            this.collection = new Monitoring();
        },

        onRender:function(){
            this.showContent();
            this.showHeader();
            this.showTabs();
        },

        showHeader: function(){
            this.headerView = new Header({context: this});
            this.header.show(this.headerView);
        },

        showContent: function(){
            var that = this;
            this.collection = new Monitoring();
            this.showTable(this.collection);
            this.collection.fetch({
                data:{
                    type: this.options.orderType,
                    subtype: this.subtype
                },
                success: function(collection){
                    console.log('collection', collection);
                }
            });
        },

        showTabs: function(){
            var types = ["Will Call", "Express", "Stock Order"];

            if(this.options.orderType == 2){
                var tabsArr = [];
                for(var i = 1; i <= 8; i++){
                    if(this.collection.where({orderSubType: i}).length){tabsArr.push({subType: this.subTypes[i], subTypeIndex: i});}
                }
                this.ui.tabs.html(_.template(tabsTemplate, {arr: tabsArr, title: "Express"}));
                if(tabsArr.length != 0){
                    this.sortFilterCollection(null, {orderSubType: tabsArr[0].subTypeIndex}, "overallRank")
                }
            }
            else{
                this.ui.tabs.html(_.template(tabsTemplate, {arr: [], title: types[this.options.orderType - 1]}));
            }
        },

        showTable: function(collection){
            collection = collection || this.collection;
            this.filteredCollection = collection;
            this.content.show(new TableView({
                name: 'monitoring',
                id: 'id',
                columns: {
//                    'OverallRank': 'overallRank',
                    'Order': 'orderNumber',
                    'Customer Name': 'customerName',
                    'City': 'shipToCity',
                    'State': 'shipToState',
                    'Order Date': 'orderDate',
                    'Release Date': 'releasedDate',
                    'Sub Type': 'orderSubType',
                    'Stage': 'batchStage',
                    'Employee': 'user'
                },
                radio: true,
                sort: true,
                height: 430,
                callback: _.bind(this.orderSelected, this),

                collection: collection
            }));
        },

        orderSelected:function(model){
            this.model = model;
            this.headerView.model = model;
            this.headerView.showButton();
        },

        // sort_filter
        sortFilterCollection: function(collection, filter, sort){
            collection = collection || this.filteredCollection;
            if(filter) collection = new Monitoring(collection.where(filter));
            if(sort) {collection.comparator = function(model){return model.get(sort)};
                collection.sort();
            }
            this.showTable(collection);
        },


        sortTable: function(){this.headerView.unCheckRadio()},

        filterSubTypes: function(e){
            this.headerView.hideButton();
            var subIndex = + $(e.currentTarget).attr('data-id');
            if(isNaN(subIndex)){return}
            this.$('.tabs li [data-id='+ subIndex +']').addClass('active').siblings().removeClass('active');
            this.sortFilterCollection(null, {orderSubType: subIndex}, "overallRank")
        },



        changeBatchWorker: function(options){
            var coll = this.collection.where({'batchNumber': options.batchNumber});
            for(var i =0; i < coll.length; i++){
                if(options.user){coll[i].set('user', options.user);}
                else{coll[i].unset('user')}
            }
            this.collection.add(coll, {merge: true});
            this.showTable();
        }


    });
});