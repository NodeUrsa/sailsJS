define(function (require) {

    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Views
    var ItemView   = require('./views/item');

    // Templates
    var layout      = require('text!./templates/layout.html');

    return Marionette.CompositeView.extend({

        tagName: 'nav',

        template: layout,

        itemView: ItemView,

        itemViewContainer: 'ul',
        
        events:{
            'click a':'dropdown'
        },

        className: function () {
            return 'sidebar ' + this.options.style.theme;
        },

        initialize: function () {
            app.vent.off('sidebar:selectSubNavItem');
        	app.vent.on('sidebar:selectSubNavItem', this.selectSubNavItem, this);

            this.options.style = this.options.style || {};
            this.options.dropDown = this.options.dropDown || {};
        },

        onRender: function(){
            this.showSubMenu();
        },
        
        dropdown:function(e){
            this.$('ul:not(.dropdown-menu)>li>a').next().hide("blind").end().parent().removeClass('stick bg-green');
            $(e.currentTarget).next().show("blind").end().parent().addClass('stick bg-green');
            return false;
        },
        
        selectSubNavItem : function(options){
        	var li = $(options.el).parent();
        	li.parent().find('li').removeClass('active');
        	li.addClass('active');
        },

        showSubMenu: function(){
            var dropDawnColl = this.$('.dropdown-menu');
            _.each(this.options.dropDown,  function(val, key){
                if(val){
                    dropDawnColl.eq(key - 1).show("blind").end().parent().addClass('stick bg-green');
                }
            });
        }

    });

});
