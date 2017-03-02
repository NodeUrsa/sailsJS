define([
  'jquery',
  'underscore',
  'backbone',
  'metro',
  'libs/plugins/table.row-selector',
  'collections/orderCollection',
  'models/batchModel',
  'text!templates/user/willcall/willcall_header.html',
  'text!templates/user/willcall/footer.html',
  'text!templates/user/willcall/willcall1.html',
  'text!templates/user/willcall/willcall1_detail.html',
  'text!templates/user/willcall/willcall2.html',
  'text!templates/user/willcall/willcall3.html',
  'text!templates/user/willcall/willcall4.html',
  'text!templates/user/willcall/choose_bin.html',
  'libs/jquery-ui/jquery.widget.min',
  'libs/jquery/jquery.cookie',
  'metro_ui'
], function($, _, Backbone, METRO, TableRowSelectorPlugin, OrderCollection, BatchModel, 
	headerTemplate, footerTemplate,
	willCallTemplate1, willCallDetailTemplate, 
	willCallTemplate2,
	willCallTemplate3,
	willCallTemplate4, chooseBinTemplate){
	"use strict";
	
	var willCallActivitiesView = Backbone.View.extend({
		el: $("#page"),
		phase : 0,
		filterBy : null,
		initialize: function() {
			this.phase = 0;
				
			this.loadData();
			
		},
		loadData: function() {
			var that = this;
			switch(this.phase) {
				case 0: {
					this.orderCollections = new OrderCollection();
					this.orderCollections.on('add', this.render, this);
					this.orderCollections.on('change', this.render, this);
					this.orderCollections.fetch();
			
					break;
				}
				case 1: {
					this.batch = new BatchModel(this.batch_id);
					this.batch.on('add', this.render, this);
					this.batch.on('change', this.render, this);
					this.batch.fetch();
					break;
				}
				case 2: {
					this.render();
					
					break;
				}
				case 3: {
					that.render();
					
					break;
				}
			}
		},
		render: function(){
			var that = this;
			
			var html = _.template(headerTemplate, this);
			
			switch(this.phase) {
				case 0 : {
					
					html += _.template(willCallTemplate1, this);
					
					break;
				}
				case 1 : {
					var batch = this.batch.clone();
					
					html += _.template(willCallTemplate2, {batch:batch, filterBy: this.filterBy});
					
					break;
				}
				case 2: {
					html += _.template(willCallTemplate3, this);
					
					break;
				}
				case 3: {
					html += _.template(willCallTemplate4, this);
					
					break;
				}
			}

			this.$el.html(html);
			
			if(this.phase != 0) {
				$('#footer #willcall_footer').remove();
				$('#footer').append(_.template(footerTemplate, this));
				
				$('#button_trackpause').click(function(e) {
					if(confirm('Are you sure you want to pause the Process?')) {
					}
				});
			}
			
			TableRowSelectorPlugin.apply($('.data-content table'), false);
			
			switch(this.phase) {
				case 0 : {
					
					$('#button_show_header').click(function() {
						
						var row = TableRowSelectorPlugin.get_selected_rows($('.data-content table'));
						
						if(row.length == 0) return;
						
						var order_id = row.attr('data-id');
						
						var orderDetail = that.orderCollections.get(order_id);
						
						$.Dialog({
							overlay: true,
							shadow: true,
							flat: true,
							icon: '',
							title: 'Order - ' + orderDetail.get('id'),
							width : '80%',
							height: '80%',
							content: '',
							padding:30,
							onShow: function(_dialog){
								var content = _dialog.children('.content');
								content.html(_.template(willCallDetailTemplate, {orderDetail:orderDetail}));
							}
						});
					});
					
					
					$('#button_start_picking').click(function() {
						
						that.phase = 1;
						
						//process batch
						that.batch_id = "JOE022014_001";
						//
						that.filterBy = "NOT_COMPLETED";
						
						that.loadData();
						
					});
					
					break;
				}
				case 1: {
					$('#button_show_all').click(function() {
						if(that.filterBy == null) {
							that.filterBy = "NOT_COMPLETED";
						}
						else{
							that.filterBy = null;
						}
						that.render();
					});
					$('#button_finish_phase').click(function() {

						if(!confirm('Are you sure you are done Picking? There are items that are not checked yet.')) return;
						
						that.phase = 2;
						
						that.filterBy = null;
						
						that.loadData();
						
					});
					$('.data-content table tr').click(function(e) {
						var id = $(this).attr('data-id');
						
						if(id == '' || typeof id == 'undefined') return;
						
						var ids = id.split('_');
						var orderId = ids[0]; var itemId = ids[1];
						var items = that.batch.get('orders').get(orderId).get('items');
						var i;
						for(i = 0; i < items.length; i++) {
							if(items[i].id == itemId) {
								if(items[i].allocated > items[i].picked) {
									items[i].picked ++;
									that.render();
								}
								break;
							}
						}
					});
					break;
				}
				case 2: {
					$('#button_finish_phase').click(function() {
						var row = TableRowSelectorPlugin.get_selected_rows($('.data-content table'));
					
						var order_id = row.attr('data-id');
						
						that.order = null;
						if(order_id != "") {
							that.order = that.batch.get('orders').get(order_id);
						}
						
						if(that.order == null) {
                            app.vent.trigger('adminError',{type: "showMessage", message: 'Please select order first.'});
                            return;
						}
						
						that.phase = 3;
						
						that.loadData();
					});
					break;
				}
				case 3: {
					$('#button_show_header').click(function() {
						$.Dialog({
							overlay: true,
							shadow: true,
							flat: true,
							icon: '',
							title: 'Order - ' + that.order.get('id'),
							width : '80%',
							height: '80%',
							content: '',
							padding:30,
							onShow: function(_dialog){
								var content = _dialog.children('.content');
								content.html(_.template(willCallDetailTemplate, {orderDetail:that.order}));
							}
						});
					});
					$('#button_finish_phase').click(function() {
						$.Dialog({
							overlay: true,
							shadow: true,
							flat: true,
							icon: '',
							title: 'Select Bin Location',
							width : '400',
							height: '400',
							content: '',
							padding:20,
							onShow: function(_dialog){
								var content = _dialog.children('.content');
								content.html(_.template(chooseBinTemplate, {binCount:15}));
								$("#button_binLocation").buttongroup();
								
								$('#button_location_apply').click(function() {
									var location = $('#button_binLocation button[class=active]').attr('data-id');

									$.Dialog.close();
									
									var orders = that.batch.get('orders');
									
									that.batch.get('orders').remove(that.order);

									if(orders.length == 0) {
										that.phase = 0;
									}
									else {
										that.phase = 2;
									}
									
									that.loadData();
								});
							}
						});
					});
					break;
				}
			}
		}
	});
	
	return willCallActivitiesView;
  
});
