define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    'text!templates/worker/actions/picking/row.html'
    ], function ($, _, Backbone, Marionette,

        template
    ) {

        'use strict';

        return Marionette.ItemView.extend({

        	tagName:'tr',
            template: template,
            className:'not-empty',
            
            serializeData:function(){
            	return {
            		model:this.model.toJSON()
            	};
            }
        });
});