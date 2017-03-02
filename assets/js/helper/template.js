define([
        'jquery'
        ], function($){
	"use strict";
	var managerHomeTileTemplate = function (type,title,titleIconUrl,message,alertUrl,countProcessed,countLeft) {

		var widget_html = "";

		if (type ==1 ) {
			widget_html +=         '<div class="row">';
			widget_html +=         '<div class="col-md-7">';
			widget_html +=         '<div class="row">';

			widget_html +=         '<div class="col-md-12">';
			widget_html +=         '<img style="margin-left:17px; margin-top:10px;" src="'+titleIconUrl+'"/>';
			widget_html +=         '</div>';

			widget_html +=         '<div class="col-md-12">';
			widget_html +=         '<div style="margin-left:0px; margin-top:10px; text-align:center;">'+title+'</div>';
			widget_html +=         '</div>';

			widget_html +=         '</div>';
			widget_html +=         '</div>';
			widget_html +=         '<div class="col-md-5">';
			widget_html +=         '<div style="margin-top:25px;">'+message+'</div>';
			widget_html +=         '</div>	';
			widget_html +=         '</div>';

			widget_html +=         '<div class="row">';
			widget_html +=         '<div class="col-md-7">';

			if (alertUrl) {
				widget_html +=         '<img style="margin-left:10px; margin-top:10px;" src="'+alertUrl+'"/>';
			}

			widget_html +=         '</div>';
			widget_html +=         '<div class="col-md-5">';

			widget_html +=         '<div class="row">';
			widget_html +=         '<div style="background-image:url(\'imgs/custom/cout_processed.png\');  margin-left: 15px; width:30px;height=30px; padding-left:10px; padding-top:5px; padding-bottom:5px">';
			if (countProcessed) widget_html += countProcessed;
			widget_html +=         '</div>';

			widget_html +=         '<div style="background-image:url(\'imgs/custom/cout_left.png\');  margin-top: 10px; margin-left: 15px; width:30px;height=30px; padding-left:10px; padding-top:5px; padding-bottom:5px">';
			if (countLeft) widget_html += countLeft ;
			widget_html +=         '</div>';
			widget_html +=         '</div>';

			widget_html +=         '</div>	';
			widget_html +=         '</div>';
		} else {

			widget_html +=         '<div>';
			widget_html +=         '<div style = "margin-left: 55px; margin-top: 35px;  margin-right: 0px;" >';
			widget_html +=         '<img src="'+titleIconUrl+'"/>';
			widget_html +=         '</div>';
			widget_html +=         '<div >';
			widget_html +=       '<div style = "margin-left: 50px; margin-top: 20px;  margin-right: 0px;" >';
			widget_html +=         title;
			widget_html +=         '</div>';
			widget_html +=         '</div>';
			widget_html +=         '</div>';
		}

		return widget_html;
	};

	return managerHomeTileTemplate;
});