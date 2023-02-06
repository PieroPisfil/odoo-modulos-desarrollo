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

            get jsonDatos(){
                var data_order = this.currentOrder.orderlines.models;
                var json_datos = []
                var index = 0 
                for (var i=0;i<data_order.length;i++){
                    for (var j=0;j<data_order[i].quantity;j++){
                        json_datos[index]=[index,data_order[i].product.display_name,data_order[i].price]
                        index++;
                    }
                }
                console.log(json_datos) 

                return json_datos;
            }

            async buttonImg() {
                var ordder = this.currentOrder
                this.id_order = ordder.pos.validated_orders_name_server_id_map[ordder.name]
                var response2 = await this.order_two()
                //console.log(response2['numero_doc_relacionado'])
                this.currentOrder.numero_doc_relacionado = response2['numero_doc_relacionado']
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
    