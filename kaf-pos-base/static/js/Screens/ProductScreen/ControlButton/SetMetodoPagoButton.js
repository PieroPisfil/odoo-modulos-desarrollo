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
            return this.currentOrder ? this.currentOrder.forma_de_pago_pe.display_name
                : this.env._t('Método de Pago');
        }
        async onClick() {
            const currentFiscalPosition = this.currentOrder.forma_de_pago_pe;
            const metodopagoPosList = [
                {
                    id: -1,
                    label: this.env._t('None'),
                    isSelected: !currentFiscalPosition,
                },
            ];
            for (let metodopagoPos of this.env.pos.fiscal_positions) {
                metodopagoPosList.push({
                    id: metodopagoPos.id,
                    label: metodopagoPos.name,
                    isSelected: currentFiscalPosition
                        ? metodopagoPos.id === currentFiscalPosition.id
                        : false,
                    item: metodopagoPos,
                });
            }
            const { confirmed, payload: selectedMetodoPago } = await this.showPopup(
                'SelectionPopup',
                {
                    title: this.env._t('Seleccionar Método de pago'),
                    list: metodopagoPosList,
                }
            );
            if (confirmed) {
                this.currentOrder.forma_de_pago_pe = selectedMetodoPago;
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
