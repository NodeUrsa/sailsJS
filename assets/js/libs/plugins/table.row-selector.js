define([
  'jquery'
], function($){
	"use strict";
	
	function apply(table, multiselect) {
		table.find('tbody tr').click(function() {
			var row = $(this);
			
			if(!multiselect) {
				if(row.attr('data-selected') == "true") return;
				
				table.find('tr').removeClass('selected');
				table.find('tr').attr('data-selected', "");
				
				row.addClass('selected');
				row.attr('data-selected', "true");
			}
			else {
				if(row.attr('data-selected') == "true") {
					row.removeClass('selected');
					row.attr('data-selected', "");
				}
				else {
					row.addClass('selected');
					row.attr('data-selected', "true");
				}
			}
		});
	}
	function get_selected_rows(table) {
		return table.find('tbody tr[data-selected=true]');
	}
	
	return {
		apply: apply,
		get_selected_rows: get_selected_rows
	};
});