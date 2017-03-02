define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',

        './header',
        './content',
        './footer',
        './pause',
        'models/worker/batchHeader',
        'text!templates/worker/main.html'
        ], function ($, _, Backbone, Marionette,

        		Header,
        		Content,
        		Footer,
        		pause,
        		Batch,
        		layoutTemplate
        ) {

	'use strict';

	return Marionette.Layout.extend({

		id:'packing',

		template: layoutTemplate,

		events:{
			'click .btn:not(.disable)' : 'action'
		},

		regions: {
			'header':'header',
			'content':'content',
			'footer':'footer'
		},

		initialize: function () {
			console.log('packing main init');
			this.model = new Batch();
			this.model.fetch();
		},

		onRender: function () {
			console.log('packing main render');
			$('#page').addClass('packPage');
			$('body').css({'background-color': '#009E0F'});

			this.header.show(new Header({model:this.model}));
			this.content.show(new Content({orderModel:this.model}));
			this.footer.show(new Footer());

			app.commands.execute('scanner:off');
			app.commands.execute('scanner:on');
			app.vent.off('worker:packing:pause');
			app.vent.on('worker:packing:pause', this.pause, this);
		},

		action:function(e){
			var action = $(e.currentTarget).attr('action');
			app.vent.trigger('worker:packing:'+action, {e:e});
		},
		
		pause:function(){
			this.showDialog({title:'Alert', widget:pause, width:500,height:220});
		}
	});
});