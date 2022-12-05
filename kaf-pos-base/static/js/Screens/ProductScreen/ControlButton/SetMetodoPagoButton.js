odoo.define('kaf-pos-base.SetMetodoPagoButton', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');

    class SetMetodoPagoButton extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }
        mounted() {
            this.env.pos.get('orders').on('add remove change', () => this.render(), this);
            this.env.pos.on('change:selectedOrder', () => this.render(), this);
        }
        willUnmount() {
            this.env.pos.get('orders').off('add remove change', null, this);
            this.env.pos.off('change:selectedOrder', null, this);
        }
        get currentOrder() {
            return this.env.pos.get_order();
        }
        get currentMetodoPagoName() {
            return this.currentOrder.forma_de_pago_pe ? this.currentOrder.forma_de_pago_pe.name
                : this.env._t('Método de Pago');
        }
        async onClick() {
            const currentMetodoPago = this.currentOrder.forma_de_pago_pe;
            const metodopagoPosList = [
                {
                    id: this.currentOrder.forma_de_pago_pe_alt[0].id,
                    label: this.currentOrder.forma_de_pago_pe_alt[0].name,
                    isSelected: currentMetodoPago ? this.currentOrder.forma_de_pago_pe_alt[0].id === currentMetodoPago.id
                    : false,
                    item : this.currentOrder.forma_de_pago_pe_alt[0],
                },
                {
                    id: this.currentOrder.forma_de_pago_pe_alt[1].id,
                    label: this.currentOrder.forma_de_pago_pe_alt[1].name,
                    isSelected: currentMetodoPago ? this.currentOrder.forma_de_pago_pe_alt[1].id === currentMetodoPago.id
                    : false,
                    item : this.currentOrder.forma_de_pago_pe_alt[1],
                },
                {
                    id: this.currentOrder.forma_de_pago_pe_alt[2].id,
                    label: this.currentOrder.forma_de_pago_pe_alt[2].name,
                    isSelected: currentMetodoPago ? this.currentOrder.forma_de_pago_pe_alt[2].id === currentMetodoPago.id
                    : false,
                    item : this.currentOrder.forma_de_pago_pe_alt[2],
                },
            ];
            const { confirmed, payload: selectedMetodoPago } = await this.showPopup(
                'SelectionPopup',
                {
                    title: this.env._t('Seleccionar Método de pago'),
                    list: metodopagoPosList,
                }
            );
            if (confirmed) {
                console.log(selectedMetodoPago);
                this.currentOrder.forma_de_pago_pe = this.currentOrder.forma_de_pago_pe_alt[selectedMetodoPago.id];
                this.currentOrder.trigger('change');
            }
        }
    }
    SetMetodoPagoButton.template = 'SetMetodoPagoButton';

    ProductScreen.addControlButton({
        component: SetMetodoPagoButton,
        condition: function() {
            return true;
        },
        position: ['before', 'SetPricelistButton'],
    });

    Registries.Component.add(SetMetodoPagoButton);

    return SetMetodoPagoButton;
});
