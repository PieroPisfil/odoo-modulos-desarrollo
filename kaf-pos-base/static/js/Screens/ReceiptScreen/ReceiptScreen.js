odoo.define('kaf-pos-base.ReceiptScreen', function (require) {
    'use strict';
    const ReceiptScreen = require('point_of_sale.ReceiptScreen');
    const { OrderReceipt } = require('point_of_sale.OrderReceipt');
    const Registries = require('point_of_sale.Registries');
    const models = require('point_of_sale.models');
    const { useRef, useContext } = owl.hooks;
    const { Printer } = require('point_of_sale.Printer');

    const ReceiptScreenKaf = ReceiptScreen => 
        class extends ReceiptScreen  {
            constructor() {
                super(...arguments);
                this._state = this.env.pos.TICKET_SCREEN_STATE;
                this.id_order = false;
            }
            mounted() {
                super.mounted();
            }

            async buttonImg() {
                var ordder = this.currentOrder
                this.id_order = ordder.pos.validated_orders_name_server_id_map[ordder.name]
                var response2 = await this.order_two()
                //console.log(response2['numero_doc_relacionado'])
                this.currentOrder.numero_doc_relacionado = response2['numero_doc_relacionado']
                this.currentOrder.amount_text = response2['amount_text']
                this.currentOrder.sunat_qr_code_char = response2['sunat_qr_code_char']
                this.render();
            }

            async order_two() {
                await this._fetchSyncedOrders(this.id_order);
                return this._state.syncedOrders.cache[this.id_order];
            }

            async _fetchSyncedOrders(number_id) {
                const fetchedOrders = await this.rpc({
                    model: 'pos.order',
                    method: 'export_for_ui',
                    args: [number_id],
                    context: this.env.session.user_context,
                });
                fetchedOrders.forEach((order) => {
                    this._state.syncedOrders.cache[order.id] = new models.Order({}, { pos: this.env.pos, json: order });
                });
            }
        }
    Registries.Component.extend(ReceiptScreen, ReceiptScreenKaf);

    return ReceiptScreen;
});
    