define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'nanoscroller',

    './boxModeRow',
    './boxModeEmptyRow',
    'text!templates/worker/actions/picking/boxModeTable.html'
    ], function ($, _, Backbone, Marionette, nanoscroller,

    	Row,
    	EmptyRow,
        layoutTemplate
    ) {

        'use strict';

        return Marionette.CompositeView.extend({

        	itemView:Row,
        	emptyView:EmptyRow,
            template: layoutTemplate,
            itemViewContainer:'tbody',

            initialize:function(){
                this.listenTo(this.collection, 'add', this.onRenderCollection);
            },

            onRender:function(){
                var timeout = setTimeout(_.bind(function(){
                    this.updateScroll();
                }, this),10);
            },

            onRenderCollection:function(){
                //console.log(this.collection.toJSON());
                this.updateScroll();
            },

            updateScroll:function(){
                this.$(".nano").nanoScroller({ destroy: true });
                this.$(".nano").nanoScroller();
            }
        });
});