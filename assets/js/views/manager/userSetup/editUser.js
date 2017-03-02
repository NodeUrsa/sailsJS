define([
        'jquery',
        'underscore',
        'backbone',
        'marionette',
        'metro',
        'timepicker',

        'models/admin/userModel',
        'text!templates/manager/userSetup/editUser.html'
        ], function ($, _, Backbone, Marionette, METRO, timepicker,

        		userModel,
        		template) {

	'use strict';

	return Marionette.Layout.extend({

		template: template,

		events: {
			'click button.success':'save'
		},

		serializeData:function(){
			return {model : this.model.toJSON()};
		},

		initialize: function () {
			if(!this.model)
				this.model = new userModel();
		},

		onRender : function () {
            this.$el.find('[name="hoursStart"]').timepicker();
            this.$el.find('[name="hoursEnd"]').timepicker();
        },

		save:function(e){       
			if(!this.model.has('id')){
				return false;
			}

			var map = {
                    locationId: this.options.locationId,
					userName: this.$('input[name="userName"]').val(),
					firstName: this.$('input[name="firstName"]').val(),
					lastName: this.$('input[name="lastName"]').val(),
					active: this.$('input[name="active"]').is(':checked'),
					operationStartHour: /*new Date("10 10 2013 "+*/this.$('input[name="hoursStart"]').val()/*).valueOf()+''*/,
					operationEndHour: /*new Date("10 10 2013 "+*/this.$('input[name="hoursEnd"]').val()/*).valueOf()+''*/,
					role: +this.$('select[name="type"]').val(),
					willcallPick:this.$('input[name="willcallPick"]').is(':checked'),
					willcallPack:this.$('input[name="willcallPack"]').is(':checked'),
					expressPick:this.$('input[name="expressPick"]').is(':checked'),
					expressPack:this.$('input[name="expressPack"]').is(':checked'),
					truckPick:this.$('input[name="truckPick"]').is(':checked'),
					truckPack:this.$('input[name="truckPack"]').is(':checked'),
					shipRestock:this.$('input[name="shipRestock"]').is(':checked'),
	                workDays: _.extend(this.model.get('workDays'), {
	                    sunday:this.$('input[name="sunday"]').is(':checked'),
	                    monday:this.$('input[name="monday"]').is(':checked'),
	                    tuesday:this.$('input[name="tuesday"]').is(':checked'),
	                    wednesday:this.$('input[name="wednesday"]').is(':checked'),
	                    thursday:this.$('input[name="thursday"]').is(':checked'),
	                    friday:this.$('input[name="friday"]').is(':checked'),
	                    saturday:this.$('input[name="saturday"]').is(':checked')
	                })
			};

			if(     !map.userName||
					!map.firstName||
					!map.lastName||
					!map.operationStartHour||
					!map.operationEndHour
			){
                app.vent.trigger('adminError',{type: "showMessage", message: "First Name, Last Name, UserName, and WorkTime fields can't be blank"});
            }
			else {
				console.log('map', map);
				//TODO not saved work days
				this.model.save(map, {
					success: function (model, response) {
						console.log('response', response);
						app.vent.trigger('user:updated', {userId:model.get('id')});
						$('.window-overlay').click();
					},
					error: function (collection, response) {
                        app.vent.trigger('adminError',{type: "showMessage", message: response.responseJSON.error.text });
                        console.log('response', response);
					},
					wait: true
				});
			}
		}
	});
});