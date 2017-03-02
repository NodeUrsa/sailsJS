define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    'text!templates/worker/actions/packing/binLocationRow.html'
    ], function ($, _, Backbone, Marionette,

        template
    ) {

        'use strict';

        return Marionette.ItemView.extend({

        	tagName:'tr',
            template: template,

            events:{
                'click'   : 'onClick'
            },
            
            serializeData:function(){
            	//console.log(this.model.toJSON());
            	return {
            		model:this.model.toJSON()
            	};
            },

            onClick: function (e) {
                var checkbox = this.$('td input[type="radio"]');
                if (e.target && e.target.nodeName.toLowerCase() !== 'input') {
                    checkbox.prop('checked', !checkbox.prop('checked'));
                }
            }
        });
});