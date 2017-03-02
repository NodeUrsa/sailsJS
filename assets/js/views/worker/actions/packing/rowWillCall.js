define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    'text!templates/worker/actions/packing/rowWillCall.html'
    ], function ($, _, Backbone, Marionette,

        template
    ) {

        'use strict';

        return Marionette.ItemView.extend({

        	tagName:'tr',
            template: template,
            className:'not-empty',
            
            serializeData:function(){
            	//console.log(this.model.toJSON());
            	return {
            		model:this.model.toJSON()
            	};
            }
        });
});