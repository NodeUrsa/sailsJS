define(function (require) {

    'use strict';

    // Libraries
    var $           = require('jquery'),
        Backbone    = require('backbone'),
        Marionette  = require('marionette');

    // Templates
    var layout      = require('text!../templates/item.html');

    return Marionette.ItemView.extend({

        tagName: 'li',

        className: ''/*'accordion-frame'*/,

        template: layout,

        events: {
            'click' : 'select',
            'click .dropdown-menu>li' : 'select',
            'click a:not(.dropdown-toggle,.main-menu-item)': 'onClick'
        },
        
        serializeData:function(){
            return {model : this.model.toJSON() };
        },
        
        onRender:function(){
            if(this.model.get('location') == this.model.get('link').ref)
               this.$el.addClass('stick bg-green');
        },
        
        initialize:function(){
            this.model.set({location:Backbone.history.fragment});
        },

        onClick: function (e) {
            if(this.model.has('callback')) 
                this.model.get('callback')(this.model, $(e.currentTarget).text());
            
            app.vent.trigger('sidebar:selectSubNavItem', {text:$(e.currentTarget).text(), el:e.currentTarget});
            var link = this.model.get('link');
            e.preventDefault();
                
            if (link.type === 'hash') {
                Backbone.history.navigate(link.ref, { trigger: true });
            }
                
            if (link.type === 'url') {
                if(link.ref == '/'){
                    $.ajax({
                        url: '/auth/logout',
                        type: 'get',
                        success: function(){location.href = link.ref; console.log("logout success")},
                        error: function(){alert(("logout error"))}
                    });
                }
                else{
                    location.href = link.ref;
                }
            }
                
            return false;
        },
        
        select:function(){
            if(this.model.has('callback'))
                this.model.get('callback')(this.model);console.log(this.model.toJSON());
        }
    });
});