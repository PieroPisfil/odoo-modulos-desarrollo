odoo.define('solse_vat_pos_pe.ClientDetailsEdit', function(require) {
    'use strict';

    const ClientDetailsEdit = require('point_of_sale.ClientDetailsEdit');
    const Registries = require('point_of_sale.Registries');
//    const session = require('web.session');
//    const core = require('web.core');
//    const _t = core._t;
//    const rpc = require('web.rpc');
//    const QWeb = core.qweb;

    const ClientDetailsEditVat = ClientDetailsEdit =>
        class extends ClientDetailsEdit {
            constructor() {
	            super(...arguments);
				this.intFields = ['country_id', 'state_id', 'property_product_pricelist','l10n_latam_identification_type_id','city_id','l10n_pe_district'];
				const partner = this.props.partner;
				this.changes = {
					'country_id': partner.country_id && partner.country_id[0],
					'state_id': partner.state_id && partner.state_id[0],
					'l10n_latam_identification_type_id': partner.l10n_latam_identification_type_id && partner.l10n_latam_identification_type_id[0],
					'city_id': partner.city_id && partner.city_id[0],
					'l10n_pe_district': partner.l10n_pe_district && partner.l10n_pe_district[0],
				};
				if (!partner.property_product_pricelist)
					this.changes['property_product_pricelist'] = this.env.pos.default_pricelist.id;
	        }
	        mounted() {
	        	super.mounted();
	        	this.iniciarDatos_vat_pe();
	        }
	        iniciarDatos_vat_pe(){
	        	var self = this;

		        let partner = this.props.partner;

		        var contents = $('.client-details.edit');

/*  		        contents.find('.vat').on('change',function(event){
					var doc_type = contents.find("[name='l10n_latam_identification_type_id']").val();
					doc_type = self.env.pos.doc_code_by_id[doc_type];
					var vat = this.value;
				});
		        contents.find("[name='l10n_latam_identification_type_id']").on('change',function(event){
		            var doc_type = self.env.pos.doc_code_by_id[this.value];
		            var vat = contents.find(".vat").val();
		        });  */
		        //---
			}
		}

    Registries.Component.extend(ClientDetailsEdit, ClientDetailsEditVat);

    return ClientDetailsEdit;
});
