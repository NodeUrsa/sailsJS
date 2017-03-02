define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/worker/actions/picking/summary.html'
], function ($, _, Backbone, Marionette, METRO,

        template) {

    'use strict';

    return Marionette.Layout.extend({

        template: template,
        
        events: {
            'click button.success' : 'yes',
            'click button.danger' : 'cancel'
        },
        
        initialize:function(){
        	console.log('init summary', this.model.toJSON());
        },
        
        serializeData:function(){
        	var arr = this.collection.toJSON(),
        		allocated = 0,
        		shortage = 0,
        		picked = 0;
        	for(var i = 0, l = arr.length; i < l; i++){
        		allocated += arr[i].allocated;
        		shortage += arr[i].shortage;
        		picked += arr[i].picked;
        	}
        	
        	return {
        		model : this.model.toJSON(),
        		collection : this.collection.toJSON(),
        		picked:picked,
        		shortage:shortage,
        		allocated:allocated
        	};
        },
        
        yes: function (e) {
        	$('.window-overlay').click();
        	app.vent.trigger('worker:picking:finish');
        },
        
        cancel:function(){
        	$('.window-overlay').click();
        }
    });
});