define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',
    './editUser',
    './resetPassword',
    './userDelete',
    'collections/admin/userCollection',
    'text!templates/admin/userSetup/main.html'
], function ($, _, Backbone, Marionette, METRO,

        Row,
        editUser,
        resetPassword,
        userDelete,
        Collection,
        layoutTemplate) {

    'use strict';

    return Marionette.CompositeView.extend({

        template: layoutTemplate,

        itemView: Row,

        itemViewContainer: 'tbody',
        
        modals:{
            'add_user':editUser,
            'edit_user':editUser,
            'reset_password':resetPassword
        },

        events: {
            'click header .btn:not(.disable, .delete-user)': 'headerButtonPress',
            'click .delete-user' : 'deleteUser'
        },
        
        initialize: function () {
            this.collection    = new Collection();
            this.collection.fetch({data:{'locationId':this.options.locationId}});
            this.listenTo(this.collection,'change', this.render);
            app.vent.on('user:updated', this.updateCollection, this);
        },
        
        updateCollection:function(){
        	this.collection.fetch({data:{'locationId':this.options.locationId}});
        },
        
        onRender : function () {},
        
        headerButtonPress : function (e) {
            var action = $(e.currentTarget).attr('action');
            var id = parseInt(this.$('input[type="radio"]:checked').attr('data-id'), 10);
            var data = (action == 'edit_user' || action == 'reset_password') ? this.collection.findWhere({'id':id}) : null;

            if ((action == 'edit_user' || action == 'reset_password') && !id) {
                return;
            }
            
            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">'+action.replace('_', ' ')+'</span>',
                width: (action == 'reset_password')? 450 : 650,
                height: (action == 'reset_password')? 150 : 300,
                padding: 20,
                content: new this.modals[action]({model:data, collection:this.collection, locationId:this.options.locationId}).render().el
            });
        },
        
        deleteUser : function(){
        	var id = parseInt(this.$('input[type="radio"]:checked').attr('data-id'), 10);
        	if (!id) return;
        	var model = this.collection.get(id);
        	
        	var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">Delete User</span>',
                width: 450,
                height: 150,
                padding: 20,
                content: new userDelete({model:model, collection:this.collection, locationId:this.options.locationId}).render().el
            });
        	/*model.destroy({
        		success:function(model,response){
        			console.log('model',model);
        			console.log('response', response);
        		}
        	});*/
            
        }
    });
});