/**
  (https://developer.mozilla.org/en-US/docs/DOM/document.cookie)
  docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
  docCookies.getItem(name)
  docCookies.removeItem(name[, path])
  docCookies.hasItem(name)
*/
var docCookies={getItem:function(a){return!a||!this.hasItem(a)?null:unescape(document.cookie.replace(RegExp("(?:^|.*;\\s*)"+escape(a).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1"))},setItem:function(a,c,b,e,f,g){if(a&&!/^(?:expires|max\-age|path|domain|secure)$/i.test(a)){var d="";if(b)switch(b.constructor){case Number:d=Infinity===b?"; expires=Tue, 19 Jan 2038 03:14:07 GMT":"; max-age="+b;break;case String:d="; expires="+b;break;case Date:d="; expires="+b.toGMTString()}document.cookie=
escape(a)+"="+escape(c)+d+(f?"; domain="+f:"")+(e?"; path="+e:"")+(g?"; secure":"")}},removeItem:function(a,c){a&&this.hasItem(a)&&(document.cookie=escape(a)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(c?"; path="+c:""))},hasItem:function(a){return RegExp("(?:^|;\\s*)"+escape(a).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)}};

/**
    MelonHTML5 - Metro UI
*/
var Metro = {
    window_width                  : 0,         // INT
    window_height                 : 0,         // INT
    scroll_container_width        : 0,         // INT

    widget_preview                : null,      // DOM
    widget_sidebar                : null,      // DOM
    widgets                       : null,      // DOM
    widget_scroll_container       : null,      // DOM
    widget_containers             : null,      // DOM

    widget_open                   : false,     // BOOLEAN
    dragging_x                    : 0,         // INT
    left                          : 60,        // INT

    widget_page_data              : [],        // ARRAY (page cache)

    is_touch_device               : false,     // BOOLEAN
    title_prefix                  : 'Warehouse Manager - ',

    data                          : [],        // Array of container data

    init: function(e) {
        Metro.HTML._build();

        // touch devices
        Metro.is_touch_device = 'ontouchstart' in document.documentElement ? true : false;

        // cache DOM elements
        Metro.cacheElements();
        Metro.Events.onWindowResize();

        // resize window and position widget container
        $(window)
            .bind('resize',     Metro.Events.onWindowResize)
            .bind('hashchange', Metro.Events.onHashChange);

        // attach event listeners
        $(document).click(Metro.Events.onClick);
        Metro.widget_sidebar.children('div').children('div').click(Metro.Events.sidebarClick);

        // enable scrollbar for touch devices
        if (Metro.is_touch_device) {
            $(document.body).addClass('touch');
        } else {
            $(document)
                .mousedown(Metro.Events.onMouseDown)
                .mouseup(Metro.Events.onMouseUp)
                .mousemove(Metro.Events.onMouseMove);
        }

        // open widget when there is a # in URL
        if (window.location.hash !== '') {
            var name = window.location.hash.replace(/[#!\/]/g, '')

            var widget = Metro.widgets.filter('[data-name="' + name + '"]');
            if (widget.length) {
                Metro.openWidget(widget);
            }
        }

        $(document.body).addClass('loaded');

        Metro.widgets.each(function(index) {
            var widget = $(this);

            setTimeout(function() {
                widget.removeClass('unloaded');

                setTimeout(function() {
                    widget.removeClass('animation');
                }, 300);
            }, index * 100);
        });
    },

    // Event Hanlers
    Events: {
        // window
        onWindowResize: function(e) {
            Metro.window_width  = $(window).width();
            Metro.window_height = $(window).height();
        },

        // window
        onHashChange: function(e) {
            var hash = window.location.hash;
            var name = hash.replace(/[#!\/]/g, '');

            var _openWidget = function() {
                var widget = $('div.widget[data-name="' + name + '"]');
                if (widget.length) {
                    Metro.openWidget(widget);
                }
            }

            if (Metro.widget_open) {
                if (hash === '') {
                    Metro.closeWidget(e);
                } else if (Metro.widget_open.data('name') !== name) {
                    _openWidget();
                }
            } else if (hash !== '') {
                _openWidget();
            }
        },

        // document
        onMouseDown: function(e) {
            if (!Metro.widget_open) {
                Metro.dragging_x = e.clientX;
            }
        },

        // document
        onMouseUp: function(e) {
            if (!Metro.widget_open && Metro.dragging_x) {
                $(document).scrollLeft(0);

                Metro.dragging_x = 0;

                var max_left = 60;
                var min_left = (Metro.scroll_container_width - Metro.window_width) * -1;

                var remove_transition = function() {
                    setTimeout(function() {
                        Metro.widget_scroll_container.css('transition', '');
                    }, 400);
                };

                if (Metro.left > max_left || Metro.scroll_container_width + max_left < Metro.window_width) {
                    Metro.widget_scroll_container.css('transition', 'left 0.2s ease-in');
                    Metro.widget_scroll_container.css('left', max_left);
                    Metro.left = max_left;
                    remove_transition();
                } else if (Metro.left < min_left) {
                    Metro.widget_scroll_container.css('transition', 'left 0.2s ease-in');
                    Metro.widget_scroll_container.css('left', min_left);
                    Metro.left = min_left;
                    remove_transition();
                }
            }
        },

        // document
        onMouseMove: function(e) {
            if (!Metro.widget_open && Metro.dragging_x) {
                var left = Metro.left + e.clientX - Metro.dragging_x;

                Metro.widget_scroll_container.css('left', left);
                Metro.dragging_x = e.clientX;
                Metro.left       = left;
            }
        },

        // document
        onClick: function(e) {

            var element_clicked = $(e.target);
            if (element_clicked.hasClass('widget')) {

            } else if (element_clicked.parents('div.widget').length) {
            	element_clicked = element_clicked.parents('div.widget');
            }

			Metro.openWidget(element_clicked);
        },

        // #widget_sidebar
        sidebarClick: function(e) {
            var button = $(e.target).attr('class');

            switch (button) {
                case 'cancel':
                    Metro.closeWidget(e);
                    break;
                case 'refresh':
                    Metro.refreshWidget(e);
                    break;
                case 'download':
                    break;
                case 'back':
                    Metro.previousWidget(e);
                    break;
                case 'next':
                    Metro.nextWidget(e);
                    break;
            }
        }
    },

    HTML: {
        // build html
        _build: function() {
            // styles
            // full : widget width: 90
            // small: widget width: 65 (mobile mode)
            // full container: 12 widgets
            // half container: 4  widgets
            var widget_margin      = 5;
            var widget_width_big   = 90; // 1x1 widget size
            var widget_width_small = 65; // 1x1 widget size (mobile mode)
            var container_margin   = 50;
            var container_padding  = 10;
            var widget_total       = 0;
            $(Metro.data).each(function(index, container_data) {
                if (container_data.size === 'full') {
                    widget_total += 12;
                } else {
                    widget_total += 4;
                }
            });

            var CRLF = '\r\n';
			
			if($('style[data-name="metro-style"]').length == 0) {
				/*var styles = '<style data-name="metro-style">';
				styles += '#widget_scroll_container {' + CRLF;
				styles +=     'width: ' + ((widget_total * (widget_width_big + widget_margin * 2)) + (container_margin * (Metro.data.length - 1)) + (container_padding * 2 * Metro.data.length)) + 'px;' + CRLF;
				styles += '}' + CRLF;
				styles += 'div.widget_container {' + CRLF;
				styles +=     'width: ' + 12 * (widget_width_big + widget_margin * 2) + 'px;' + CRLF;
				styles += '}' + CRLF;
				styles += 'div.widget_container.half {' + CRLF;
				styles +=     'width: ' + 4 * (widget_width_big + widget_margin * 2) + 'px;' + CRLF;
				styles += '}' + CRLF;
				styles += '@media screen and (max-height: 680px) {' + CRLF;
				styles +=     '#widget_scroll_container {' + CRLF;
				styles +=         'width: ' + ((widget_total * (widget_width_small + widget_margin * 2)) + (container_margin * (Metro.data.length - 1)) + (container_padding * 2 * Metro.data.length)) + 'px;' + CRLF;
				styles +=     '}' + CRLF;
				styles +=     'div.widget_container {' + CRLF;
				styles +=         'width: ' + 12 * (widget_width_small + widget_margin * 2) + 'px;' + CRLF;
				styles +=     '}' + CRLF;
				styles +=     'div.widget_container.half {' + CRLF;
				styles +=         'width: ' + 4 * (widget_width_small + widget_margin * 2) + 'px;' + CRLF;
				styles +=     '}' + CRLF;
				styles += '}' + CRLF;
				styles += '</style>';*/
				var styles = '<style data-name="metro-style">';
				styles += '#widget_scroll_container {' + CRLF;
				styles +=     'width: 100%;' + CRLF;
				styles += '}' + CRLF;
				styles += 'div.widget_container {' + CRLF;
				styles +=     'width: 100%;' + CRLF;
				styles += '}' + CRLF;
				styles += 'div.widget_container.half {' + CRLF;
				styles +=     'width: 100%;' + CRLF;
				styles += '}' + CRLF;
				styles += '@media screen and (max-height: 680px) {' + CRLF;
				styles +=     '#widget_scroll_container {' + CRLF;
				styles +=         'width: 100%;' + CRLF;
				styles +=     '}' + CRLF;
				styles +=     'div.widget_container {' + CRLF;
				styles +=         'width: 100%;' + CRLF;
				styles +=     '}' + CRLF;
				styles +=     'div.widget_container.half {' + CRLF;
				styles +=         'width: 100%;' + CRLF;
				styles +=     '}' + CRLF;
				styles += '}' + CRLF;
				styles += '</style>';
				$(styles).appendTo($(document.head));
			}


            // scroll container
            var scroll_container = $('<div>').attr('id', 'widget_scroll_container').appendTo($(document.body));

            // container
            $(Metro.data).each(function(index, container_data) {
                var container = $('<div>').addClass('widget_container ' + container_data.size).data('num', index).appendTo(scroll_container);

                var customFlag = 0;
                 if (container_data["isCustom"] == 1) {
                 	customFlag = 1;
                 }
                 
                 // widget
                 $(container_data.tiles).each(function(widget_index, widget_data) {
                     var widget_html = '';
                     widget_html += '<div class="widget widget' + widget_data.size + ' widget_' + widget_data.theme + (typeof widget_data.link !== 'undefined' ? ' widget_link' : '') + ' animation unloaded"' + (typeof widget_data.colour !== 'undefined' ? ' style="background-color:' + widget_data.colour + ';"' : '') + '  data-url="' + widget_data.url + '" data-theme="' + widget_data.theme + '" data-name="' + widget_data.name + '" data-title="' + widget_data.title + '"' + (typeof widget_data.link !== 'undefined' ? ' data-link="' + widget_data.link +'"' : '') + '>';
                     widget_html +=     '<div class="widget_content">';
                     widget_html +=         '<div class="main"' + (widget_data.thumbnail.length ? ' style="background-image:url(\'' + widget_data.thumbnail + '\');"' : '') + '>';
                     
                     if (!customFlag) {
                     	widget_html +=             '<span>' + widget_data.content + '</span>';
                     } else {
                     	widget_html +=             widget_data.content;
                     }
                     
                     widget_html +=         '</div>';
                     widget_html +=     '</div>';
                     widget_html += '</div>';

                     $(widget_html).appendTo(container);
                 });
            });

            // sidebar
            var sidebar_html = '';
            sidebar_html += '<div id="widget_sidebar">';
            sidebar_html +=     '<div>';
            sidebar_html +=         '<div class="cancel"><span>Close</span></div>';
            sidebar_html +=         '<div class="refresh"><span>Refresh</span></div>';
            sidebar_html +=         '<div class="back"><span>Back</span></div>';
            sidebar_html +=         '<div class="next"><span>Next</span></div>';
            sidebar_html +=     '</div>';
            sidebar_html += '</div>';
            $('<div>').attr('id', 'widget_preview').html(sidebar_html).appendTo($(document.body));
        },

        addContainer: function(container_data) {
            Metro.data.push(container_data);
        }
    },
	//remove tiles
	
	clearTiles: function() {
		$('#widget_scroll_container').fadeOut(400, function() {
			$('#widget_scroll_container').remove();
			$('#widget_preview').remove();
			
			Metro.cacheElements();
		});
	},
    // cache DOM elements
    cacheElements: function() {
        // elements
        Metro.widgets                 = $('div.widget');
        Metro.widget_containers       = $('div.widget_container');
        Metro.widget_scroll_container = $('#widget_scroll_container');
        Metro.widget_preview          = $('#widget_preview');
        Metro.widget_sidebar          = $('#widget_sidebar');
		
        // fixed dimensions
        Metro.scroll_container_width = Metro.widget_scroll_container.width();
    },

    openWidget: function(widget) {
        var widget_name  = widget.data('name');
        var widget_title  = widget.data('title');
        var widget_link  = widget.data('link');
		
        if (widget_link && widget_link !== '') {
			document.location= widget_link;
        } else {
            var widget_url = $.trim(widget.data('url'));
            if (widget_url.length) {
                Metro.widget_open = widget;

                window.location.hash = '#' + widget_name;
                document.title = Metro.title_prefix + widget_title;

                $('#widget_preview_content').remove();

                Metro.widget_preview
                    .addClass('open')
                    .css('background-color', widget.css('background-color'))
                    .css('background-image', widget.find('.main').css('background-image'));

                Metro.widget_scroll_container.hide();
                Metro._loadWidget(widget);
            }
        }

        if (typeof _gaq !== 'undefined') {
            _gaq.push(['_trackPageview', '#' + widget_name]);
        }
    },

    closeWidget: function(e) {
        window.location.hash = '';
        document.title = Metro.title_prefix + 'Metro Framework';

        Metro.widget_scroll_container.show();

        Metro.widget_preview.removeClass('open');
        Metro.widget_open = false;

        setTimeout(function() {
            $('#widget_preview_content').remove();
        }, 300);
    },

    refreshWidget: function() {
        Metro._loadWidget(Metro.widget_open, false);
    },

    previousWidget: function(e) {
        var previous_widget = Metro.widget_open.prev();

        if (!previous_widget.length) {
            previous_widget = Metro.widget_open.parent().children('div.widget').last();
        }

        var widget_url = previous_widget.data('url');
        if (widget_url && widget_url !== '') {
            Metro.openWidget(previous_widget);
        } else {
            Metro.widget_open = previous_widget;
            Metro.previousWidget(e);
        }
    },

    nextWidget: function(e) {
        var next_widget = Metro.widget_open.next();

        if (!next_widget.length) {
            next_widget = Metro.widget_open.parent().children('div.widget').first();
        }

        var widget_url = next_widget.data('url');
        if (widget_url && widget_url !== '') {
            Metro.openWidget(next_widget);
        } else {
            Metro.widget_open = next_widget;
            Metro.nextWidget(e);
        }
    },

    // load widget content via XHR or cache when widget is already open
    _loadWidget: function(widget, use_cache) {
        var widget_name = widget.data('name');

        var loadWidgetData = function(data) {
            Metro.widget_preview.css('background-image', 'none');

            var widget_preview_content = $('#widget_preview_content');
            if (widget_preview_content.length) {
                widget_preview_content.html(data);
            } else {
                widget_preview_content = $('<div>').attr('id', 'widget_preview_content').insertAfter(Metro.widget_sidebar).html(data);
            }

            if (docCookies.getItem('melonhtml5_metro_ui_sidebar_first_time') !== 'true') {
                Metro.widget_sidebar.addClass('open');
                Metro.widget_sidebar.mouseenter(function() {
                    docCookies.setItem('melonhtml5_metro_ui_sidebar_first_time', 'true', Infinity);
                    $(this).removeClass('open');
                });
            }
        }

        var animate_start = (new Date()).getTime();

        Metro.widget_preview.children('div.dot').remove();
        for (var i= 1; i <= 7; i++) {
            var div = $('<div>').addClass('dot').css('transition', 'right ' + (0.6 + i / 10).toFixed(1) + 's ease-out');
            div.prependTo(Metro.widget_preview);
        }

        var animate = function() {
            var dots = $('div.dot');
            if (dots.length) {
                dots.toggleClass('open');

                setTimeout(animate, 1300);
            }
        }

        var stopAnimate = function(callback) {
            var time_passed = (new Date()).getTime() - animate_start;
            if (time_passed > 1300)  {
                Metro.widget_preview.children('div.dot').remove();

                if (typeof callback !== 'undefined') {
                    callback();
                }
            } else {
                setTimeout(function() {
                    Metro.widget_preview.children('div.dot').remove();
                    if (typeof callback !== 'undefined') {
                        callback();
                    }
                }, 1300 - time_passed);
            }
        }

        Metro.widget_preview.width(); // force page reflow
        animate();

        if (typeof use_cache === 'undefined') {
            use_cache = true;
        }

        if (use_cache && Metro.widget_page_data[widget_name] !== undefined) {
            stopAnimate(function() {
                loadWidgetData(Metro.widget_page_data[widget_name]);
            });
        } else {
            var widget_url = $.trim(widget.data('url'));

            if (widget_url.length > 0) {
                $.ajax({
                    url        : widget_url,
                    cache      : false,
                    type       : 'POST',
                    data       : {},
                    beforeSend : function(jqXHR, settings) {
                                 },
                    complete   : function(jqXHR, textStatus) {
                                 },
                    error      : function(jqXHR, textStatus, errorThrown) {
                                 },
                    success    : function(data, textStatus, jqXHR) {
                                     stopAnimate(function() {
                                         Metro.widget_page_data[widget_name] = data;
                                         loadWidgetData(data);
                                     });
                                 }
                });
            }
        }
    }
};