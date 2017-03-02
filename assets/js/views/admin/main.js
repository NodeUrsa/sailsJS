define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'metro',

    'text!templates/admin/layout.html',
    'metro_ui',
    './locations/main',
    './userSetup/main',
    './orderTypes/main',
    './orderMatrix/main',
    './security/main',


    '../header',
    '../../widgets/sidebar/main',
    'collections/admin/locationCollection'
    ], function ($, _, Backbone, Marionette, METRO,

        layoutTemplate,
        metro_ui,
        LocationView,
        UserSetupView,
        OrderTypesView,
        OrderMatrixView,
        SecurityView,

        Header,
        SidebarWidget,
        LocationCollection
    ) {

        'use strict';

        return Marionette.Layout.extend({

            el: $('#page'),

            template: layoutTemplate,
            sections:{
                'locations': LocationView,
                'user_setup' : UserSetupView,
                'order_types' : OrderTypesView,
                'order_matrix' : OrderMatrixView,
                'security' : SecurityView

            },

            regions: {
                header : 'header',
                content : '.adminContent',
                menu : 'nav'
            },


            initialize: function () {
                this.collection = new LocationCollection();
                var that = this;
                this.collection.fetch({
                    success:function(collection,response){
                        that.render();
//                        console.log(collection.toJSON());
                    }
                });
                
                this.listenTo(this.collection, 'change', this.showMenu, this);

                $(window).bind('hashchange', function() {
                    $('.window-overlay').click();
                });


            },


            onRender: function () {

                this.showContent();
                this.showMenu();

            },

            showMenu: function(){
                var submenu = this.collection.toJSON();

                this.menu.show(new SidebarWidget({
                    collection: new Backbone.Collection([
                        {
                            name: 'Home',
                            link: {
                                type: 'hash',
                                ref: 'home'
                            }
                        },
                        {
                            name: 'Location',
                            link: {
                                ref: 'locations'
                            },
                            callback: _.bind(this.changeLocation, this)
                        },
                        {
                            name: 'Security',
                            link: {
                                ref: 'security'
                            },
                            submenu: submenu,
                            callback: _.bind(this.changeLocation, this)
                        },
                        {
                            name: 'User Setup',
                            link: {
                                ref: 'user_setup'
                            },
                            submenu:submenu,
                            callback: _.bind(this.changeLocation, this)
                        },
                        {
                            name: 'Order Types',
                            link: {
                                ref: 'order_types'
                            },
                            submenu:submenu,
                            callback: _.bind(this.changeLocation, this)
                        },
                        {
                            name: 'Order Matrix',
                            link: {
                                ref: 'order_matrix'
                            },
                            submenu:submenu,
                            callback: _.bind(this.changeLocation, this)
                        },
                        {
                            name: 'Reports',
                            link: {
                                ref: 'reports'
                            },
                            submenu:submenu,
                            callback: _.bind(this.changeLocation, this)
                        },
                        {
                            name: 'Logout',
                            link: {
                                type: 'url',
                                ref: '/'
                            }
                        }
                    ]),
                    style: {
                        theme: 'light'
                    }
                }));
            },
            
            changeLocation:function(model, location){
                this.showContent(model.get('link').ref, location);
            },
            
            showContent:function(section, location){
                var section = section || this.options.section;
                
                var location,id = 0;
                
                if(this.collection.length){
                    location = location || this.collection.first().get('shortName');
                    id = (this.collection.findWhere({'shortName':location}))?this.collection.findWhere({'shortName':location}).get('id'):0;
                }
                
                if(!this.sections[section]){
                    var dialog = $.Dialog({
                        shadow: true,
                        overlay: true,
                        flat: true,
                        icon: '',
                        title: "Oops!",
                        width: 100,
                        height:100,
                        padding: 10,
                        content: "<div class='center'>Sorry, but currently we haven't this section.</div>"
                    });
                    return;
                }
                Backbone.history.navigate(section, { trigger: false });
                this.header.show(new Header({section:section}));
                this.content.show(new this.sections[section]({
                    location:location,
                    locationId:id,
                    collection:(section == 'locations') ? this.collection : null
                    }));
            }
        });
});