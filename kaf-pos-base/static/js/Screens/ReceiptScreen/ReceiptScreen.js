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
                this.flag = false;
                this.id_order = false;
            }
            mounted() {
                super.mounted();
            }

            async buttonImg() {
                //if (!this.actualcurrentOrder()) return;
                //this.currentOrder.finalize();
                //this.showScreen('ReceiptScreen', { order: this.actualcurrentOrder() });
                this.flag = true
                var ordder = this.currentOrder
                this.id_order = ordder.pos.validated_orders_name_server_id_map[ordder.name]
                this.currentOrder.numero_doc_relacionado = await this.order_two().numero_doc_relacionado
                console.log(this.currentOrder)
                console.log(this.order_two())
                this.render();
            }
           
            async actualcurrentOrder() {
                //console.log(this.currentOrder)
                
                //console.log(this._state.syncedOrders.cache[number_id])
                //return this.currentOrder
            }
            async order_two() {
                await this._fetchSyncedOrders(this.id_order);
                //console.log(this.id_order)
                //console.log(this._state.syncedOrders.cache[this.id_order])
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
            get currentOrder() {
                return this.env.pos.get_order();
            }
            get currentOrderTwo(){
                if(!this.flag){
                    return this.env.pos.get_order();
                }
                return this.order_two()
            }
        }
    Registries.Component.extend(ReceiptScreen, ReceiptScreenKaf);

    return ReceiptScreen;
});
    