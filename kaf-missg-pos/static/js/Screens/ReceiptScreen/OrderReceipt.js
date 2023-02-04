odoo.define('kaf-pos-base.OrderReceipt', function(require) {
    'use strict';

    const OrderReceipt = require('point_of_sale.OrderReceipt');
    const Registries = require('point_of_sale.Registries');
    const session = require('web.session');
    const core = require('web.core');
    const _t = core._t;
    const QWeb = core.qweb;

    const OrderReceiptCPE = OrderReceipt =>
        class extends OrderReceipt {
	        get order() {
                //console.log(this.receiptEnv.order.orderlines.models)
	            return this.receiptEnv.order;
	        }
        };

    Registries.Component.extend(OrderReceipt, OrderReceiptCPE);

    return OrderReceipt;
});
