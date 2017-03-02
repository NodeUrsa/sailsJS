Backbone.View = Backbone.View.extend({
    showDialog:function(options){
        this.__dialogWidget = new options.widget(options.renderData || {});

        this.__dialog = $.Dialog({shadow: true,overlay: true,flat: true,//icon: '',
            title: '<span class="capitalize">'+options.title+'</span>',
            width: options.width || 400,
            height: options.height || 400,
            padding: options.padding || 20,
            content: this.__dialogWidget.render().el
        });

        app.vent.off('dialog:close');
        app.vent.on('dialog:close', this.closeDialog, this);
    },

    closeDialog:function(){
        app.vent.off('dialog:close');
        if(this.__dialogWidget.destroy)
            this.__dialogWidget.destroy();

        delete this.__dialogWidget;
        delete this.__dialog;
    }
}) ;