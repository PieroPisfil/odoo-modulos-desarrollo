odoo.define('kaf-whatsapp-pos.ReceiptScreen', function (require) {
    'use strict';

    const ReceiptScreen = require('point_of_sale.ReceiptScreen');
    const Registries = require('point_of_sale.Registries');
    const { useRef, useContext } = owl.hooks;
    const { Printer } = require('point_of_sale.Printer');
    /* 
    const { is_email } = require('web.utils');
    const { useErrorHandlers, onChangeOrder } = require('point_of_sale.custom_hooks');
    const AbstractReceiptScreen = require('point_of_sale.AbstractReceiptScreen'); */

    const ReceiptScreenKaf = ReceiptScreen => 
        class extends ReceiptScreen  {
            constructor() {
                super(...arguments);
                const order = this.currentOrder;
                const client = order.get_client();
                this.orderUiState = useContext(order.uiState.ReceiptScreen);
                this.orderUiState['inputWhatsapp'] = this.orderUiState.inputWhatsapp || (client && client.phone) || '';
                this.orderReceipt = useRef('order-receipt');
                /* useErrorHandlers();
                onChangeOrder(null, (newOrder) => newOrder && this.render());
                
                const order = this.currentOrder;
                const client = order.get_client();
                this.orderUiState = useContext(order.uiState.ReceiptScreen);
                this.orderUiState.inputEmail = this.orderUiState.inputEmail || (client && client.email) || '';
                this.is_email = is_email; */
            }
            mounted() {
                super.mounted();
            }
            async onSendWhatsapp(){
                if(!this.orderUiState.inputWhatsapp){return;}
                let number_phone = this.orderUiState.inputWhatsapp
                number_phone = number_phone.split(" ").join("").replace('+','');
                const regex = /^[0-9]*$/;
                if(!regex.test(number_phone)){
                    this.orderUiState['whatsappSuccessful'] = false;
                    this.orderUiState['whatsappNotice'] = this.env._t('Error al enviar, teléfono mal escrito.');
                    return
                }
                console.log(number_phone)
                try {
                    this.orderUiState['whatsappNotice'] = this.env._t('Enviando...');
                    await this._sendReceiptToCustomerWhatsapp(number_phone);
                    this.orderUiState['whatsappSuccessful'] = true;
                    this.orderUiState['whatsappNotice'] = this.env._t('Enviando...');
                } catch (error) {
                    this.orderUiState['whatsappSuccessful'] = false;
                    this.orderUiState['whatsappNotice'] = this.env._t('Error al enviar, por favor intente de nuevo.');
                }
            }
            async _sendReceiptToCustomerWhatsapp(number_phone) {
                const printer = new Printer(null, this.env.pos);
                const receiptString = this.orderReceipt.comp.el.outerHTML;
                const ticketImage = await printer.htmlToImg(receiptString);
                const order = this.currentOrder;
                const client = order.get_client();
                const orderName = order.get_name();
                const orderClient = { email: this.orderUiState.inputEmail, name: client ? client.name : this.orderUiState.inputEmail };
                const order_server_id = this.env.pos.validated_orders_name_server_id_map[orderName];
                await this.rpc({
                    model: 'pos.order',
                    method: 'send_ticket_whatsapp',
                    args: [[order_server_id], number_phone, orderName, orderClient, ticketImage],
                });
            }  
        }

    Registries.Component.extend(ReceiptScreen, ReceiptScreenKaf);

    return ReceiptScreen;
});
