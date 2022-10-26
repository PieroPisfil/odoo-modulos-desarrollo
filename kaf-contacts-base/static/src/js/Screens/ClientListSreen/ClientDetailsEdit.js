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
				$('.busqueda-datos').off('click', '');
		        $('.busqueda-datos').on('click', self._busquedaContacto.bind(self));
				this._changeCountry();
				this._changeState();
				this._changeProvincia()
		        //$('.client-address-country').off('change', '');
		        $('.client-address-country').on('change', self._changeCountry.bind(self));
				//$('.client-address-states').off('change', '');
		        $('.client-address-states').on('change', self._changeState.bind(self));
				//$('.client-address-provincia').off('change', '');
		        $('.client-address-provincia').on('change', self._changeProvincia.bind(self));
				$('.l10n_latam_identification_type_id').on('change', self._changeTypeIdentification.bind(self));

			}
			_changeCountry() {
		        if (!$(".client-address-country").val()) {
		            return;
		        }
				this.id_pais = $('.client-address-country').val();
				let div = $(".client-address-country")[0];
				if(div.options[div.selectedIndex].text == 'Perú'){
		          $('#client-address-provincia').show();
		          $('#client-address-distrito').show();
				  $('#client-address-external-city').hide();
		        } else {
		          $('#client-address-provincia').hide();
		          $('#client-address-distrito').hide();
				  $('#client-address-external-city').show();
		        }
				this.render();
		    }
			obtener_id_pais() {	
				return this.id_pais
			}
			_changeState() {
				this.id_departamento = this.changes.state_id;
				this.render();
		    }
			get obtener_id_state() {
				return this.id_departamento;
			}
			_changeProvincia() {	
				this.id_provincia = this.changes.city_id;
				this.render();
		    }
			get obtener_id_provincia() {
				return this.id_provincia
			}
			_changeTypeIdentification(){
				let div2 = $(".l10n_latam_identification_type_id").val();
				//let div = $(".state-sunat-class").val();
				if (div2 == 4){
					$('#state-sunat-class').show();
					$('#condition-sunat-class').show();
				}
				else{
					$('#state-sunat-class').hide();
					$('#condition-sunat-class').hide();
				}
				this.render();
			}
			_busquedaContacto(){
				var self = this;
		        if (!$("#vat").val()) {return;}
				let div = $(".l10n_latam_identification_type_id")[0];
		        let tipo_doc = '';
				let vat = $("#vat").val();
                for (let i = 0; i < div.options.length; i ++){
                	if(div.options[i].selected){
                		tipo_doc = div.options[i].text;
    				}
                }
                if(tipo_doc != 'DNI' && tipo_doc !='RUC'){
                	return;
                }
				if(tipo_doc == 'RUC'){
					const regex = /^[0-9]*$/;
					if(vat.length != 11 || !regex.test(vat) || (vat.substr(0,2) != '20' && vat.substr(0,2) != '10') ) {
						self.showPopup('ErrorTracebackPopup', {
	                        'title': 'Alerta RUC!',
	                        'body': 'El RUC debe tener 11 dígitos, debe tener solo números y debe comenzar con 10 o 20',
	                    });
						return;
					}
				}
				console.log(`Se seleccionó ${tipo_doc} ${vat}`)
			}
		}

    Registries.Component.extend(ClientDetailsEdit, ClientDetailsEditVat);

    return ClientDetailsEdit;
});
