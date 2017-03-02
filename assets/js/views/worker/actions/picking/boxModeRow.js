define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    'text!templates/worker/actions/picking/boxModeRow.html'
    ], function ($, _, Backbone, Marionette,

        template
    ) {

        'use strict';

        return Marionette.ItemView.extend({

        	tagName:'tr',
            template: template,
            
            serializeData:function(){
                //console.log(this.model.toJSON());
            	return {
            		model:{
                        orderNumber:this.model.get('orderNumber'),
                        itemNumber:this.model.get('itemNumber') || this.model.get('pn'),
                        quantity: this.model.get('notBoxed') || this.model.get('quantity')
                    }
            	};
            }
        });
});