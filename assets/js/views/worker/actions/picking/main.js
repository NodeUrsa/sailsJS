define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',
        //'metro',

        './header',
        './content',
        './footer',
        './pause',
        'models/worker/batchHeader',
        'text!templates/worker/main.html'
        ], function ($, _, Backbone, Marionette,//metro,

        		Header,
        		Content,
        		Footer,
        		pause,
        		Batch,
        		layoutTemplate
        ) {

	'use strict';

	return Marionette.Layout.extend({

		id:'picking',

		template: layoutTemplate,
		asc:'asc',

		events:{
			'click .btn:not(.disable)' : 'action_picking'
		},

		regions: {
			'header':'header',
			'content':'content',
			'footer':'footer'
		},

		initialize: function () {
			console.log('picking init', this.options);
			this.model = new Batch();
			this.model.fetch();
		},

		onRender: function () {
			console.log('picking main render');
			$('#page').removeClass('packPage');

			var header = new Header({model:this.model}),
				content = new Content({orderModel:this.model}),
				footer = new Footer();

			this.header.show(header);
			this.content.show(content);
			this.footer.show(footer);

			app.commands.execute('scanner:off');
			app.commands.execute('scanner:on');
			app.vent.off('worker:picking:pause');
			app.vent.on('worker:picking:pause', this.pause, this);
		},

		action_picking:function(e){
			var action = $(e.currentTarget).attr('action');
			console.log(action, this);
			app.vent.trigger('worker:picking:'+action, {e:e});
		},
		
		pause:function(){
			console.log('pause');
			this.showDialog({title:'Alert', widget:pause, width:500,height:220});
		}
	});
});