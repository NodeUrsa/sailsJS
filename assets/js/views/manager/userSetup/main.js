define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    './row',
    './editUser',
    './resetPassword',
    'collections/admin/userCollection',
    'text!templates/manager/userSetup/main.html'
], function ($, _, Backbone, Marionette, METRO,

        Row,
        editUser,
        resetPassword,
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
            'click header .btn:not(.disable)': 'headerButtonPress'
        },

        initialize: function () {
            this.collection    = new Collection();
            this.collection.fetch({data:{'locationId':this.options.locationId}});
            this.listenTo(this.collection,'change', this.render);
            app.vent.on('user:updated', this.updateCollection, this);
            app.vent.on('manager:user:selected', this.checkRole, this);
        },
        
        updateCollection:function(){
        	this.collection.fetch({data:{'locationId':this.options.locationId}});
        },

        onRender : function () {},
        
        headerButtonPress : function (e) {
            var action = $(e.currentTarget).attr('action');
            var id = parseInt(this.$('input[type="radio"]:checked').attr('data-id'), 10);
            if (!id) return;
            var model = this.collection.findWhere({'id':id});
            
            console.log(model.toJSON());

            var dialog = $.Dialog({
                shadow: true,
                overlay: true,
                flat: true,
                icon: '',
                title: '<span class="capitalize">'+action.replace('_', ' ')+'</span>',
                width: (action == 'reset_password')? 450 : 850,
                height: (action == 'reset_password')? 150 : 200,
                padding: 20,
                content: new this.modals[action]({model:model, collection:this.collection}).render().el
            });
        },

        checkRole: function(data){
            if(data.role == 3){
                this.$('.btn.reset-password').removeClass('disable');
            }
            else{
                this.$('.btn.reset-password').addClass('disable');
            }
        }
    });
});