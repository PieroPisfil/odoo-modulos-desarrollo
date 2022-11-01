odoo.define('kaf-contacts-base.ClientListScreen', function(require) {
    'use strict';

    const ClientListScreen = require('point_of_sale.ClientListScreen');
    const Registries = require('point_of_sale.Registries');
    /* const { debounce } = owl.utils;
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');
    const { useListener } = require('web.custom_hooks');
    const { isConnectionError } = require('point_of_sale.utils');
    const { useAsyncLockedMethod } = require('point_of_sale.custom_hooks'); */

   const ClientListScreenVat = ClientListScreen => 

        class extends ClientListScreen {
        constructor() {
            super(...arguments);
        }
        _cretenewCustomerEdit(){
            let valor_vat = $('.searchbox-client input').val()
            let tipo_vat = 1;
            const regex = /^[0-9]*$/;
            if(valor_vat.length == 11 && regex.test(valor_vat) && (valor_vat.substr(0,2) == '20' || valor_vat.substr(0,2) == '10') ) {
                tipo_vat = 4
                //$('.l10n_latam_identification_type_id option[value="4"]').attr('selected', 'selected')
                //this.changes['l10n_latam_identification_type_id'] = '4'
            } else if(valor_vat.length == 8 && regex.test(valor_vat)){
                tipo_vat = 5               
            } else if (valor_vat.length == 0) {
                $('#button-new-customer-original').click()
                return
            }
            $('#button-new-customer-original').click()
            //console.log(valor_busqueda)
            setTimeout(() => {
                $(`.l10n_latam_identification_type_id option[value="${tipo_vat}"]`).attr('selected', 'selected')
                $('#vat').val(`${valor_vat}`)
                $('#busqueda-datos').click()
            },100)
        }
    }

    Registries.Component.extend(ClientListScreen,ClientListScreenVat);

    return ClientListScreen;
});
