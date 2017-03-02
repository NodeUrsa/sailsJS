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
        './calendar/main',
        './monitoring/main',
        '../header',
        '../../widgets/sidebar/main',
        'collections/admin/locationCollection'
        ], function ($, _, Backbone, Marionette, METRO,

                layoutTemplate,
                metro_ui,
                LocationView,
                UserSetupView,
                OrderTypesView,
                Calendar,
                Monitoring,
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
          'calendar' : Calendar,
          'monitoring' : Monitoring
        },

        regions: {
            header : 'header',
            content : '.adminContent',
            menu : 'nav'
        },

        initialize: function () {
            this.collection = new LocationCollection();
            this.collection.fetch({
                success: function(collection){
//                    app.me.set('locationBranchId', collection.get(10).get('branchId'));
                    app.me.set('locationBranchId', collection.get(app.me.get('locationId')).get('branchId'));
                }
            });

            $(window).bind('hashchange', function() {
                $('.window-overlay').click();
            });
        },

        onRender: function () {

            this.showContent();

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
                             type: 'hash',
                             ref: 'locations'
                         }
                    },
                    {
                         name: 'User Setup',
                         link: {
                             type: 'hash',
                             ref: 'user_setup'
                         }
                    },
                    {
                        name: 'Order Types',
                        link: {
                            type: 'hash',
                            ref: 'order_types'
                        }
                   }
                    ,
                    {
                         name: 'Calendar',
                         link: {
                             type: 'hash',
                             ref: 'calendar'
                         }
                    }
                    ,
                    {
                         name: 'Monitoring',
                         link: {
                             type: 'hash',
                             ref: 'monitoring'
                         }
                    },
                    {
                        name: 'Reports',
                        link: {
                            type: 'hash',
                            ref: 'reports'
                        }
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
        
        showContent:function(section, location){

            var section = section || this.options.section;
            
            var id = 0;
            var that = this;
            
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
                locationId: app.me.get('locationId'),
                context: that,
                collection:(section == 'locations') ? this.collection : null
                }));
        }
    });
});