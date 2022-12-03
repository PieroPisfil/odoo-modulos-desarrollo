odoo.define('kaf-pos-base.PaymentScreen', function (require) {
    'use strict';

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const Registries = require('point_of_sale.Registries');
    const session = require('web.session');
    const core = require('web.core');
    const _t = core._t;
    const QWeb = core.qweb;

    const PaymentScreenVat = PaymentScreen =>
        class extends PaymentScreen {
            toggleIsToInvoiceFactura() {
                // click_invoice
                this.currentOrder.set_to_invoice_factura(!this.currentOrder.is_to_invoice_factura());
                this.render();
            }
            toggleIsToInvoiceBoleta() {
                // click_invoice
                this.currentOrder.set_to_invoice_boleta(!this.currentOrder.is_to_invoice_boleta());
                this.render();
            }
            toggleIsToInvoiceRecibo() {
                // click_invoice
                this.currentOrder.set_to_invoice_recibo(!this.currentOrder.is_to_invoice_recibo());
                this.render();
            }

        }

    Registries.Component.extend(PaymentScreen, PaymentScreenVat);

    return PaymentScreen;
})
