odoo.define('solse_vat_pos_pe.ClientDetailsEdit', function(require) {
    'use strict';

    const ClientDetailsEdit = require('point_of_sale.ClientDetailsEdit');
    const Registries = require('point_of_sale.Registries');
	const rpc = require('web.rpc');
//    const session = require('web.session');
//    const core = require('web.core');
//    const _t = core._t;
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
				//let div2 = $(".l10n_latam_identification_type_id").val();
				let div2 = $(".l10n_latam_identification_type_id")[0];
				let tipo_doc = '';
/*                 for (let i = 0; i < div2.options.length; i ++){
                	if(div2.options[i].selected){
                		tipo_doc = div2.options[i].text;
    				}
                } */
				tipo_doc = div2.options[div2.selectedIndex].text
				$('#busqueda-boton').show();
				//if (div2 == 4){
				if (tipo_doc == 'RUC'){
					$('#state-sunat-class').show();
					$('#condition-sunat-class').show();
				}
				else{
					if(tipo_doc != 'DNI'){
						$('#busqueda-boton').hide();
					}
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
				const regex = /^[0-9]*$/;
				if(tipo_doc == 'RUC'){
					if(vat.length != 11 || !regex.test(vat) || (vat.substr(0,2) != '20' && vat.substr(0,2) != '10') ) {
						self.showPopup('ErrorTracebackPopup', {
	                        'title': 'Alerta RUC!',
	                        'body': 'El RUC debe tener 11 dígitos, debe tener solo números y debe comenzar con 10 o 20',
	                    });
						return;
					}
				}
				else if(tipo_doc == 'DNI'){
					if(vat.length != 8 || !regex.test(vat)) {
						self.showPopup('ErrorTracebackPopup', {
	                        'title': 'Alerta DNI!',
	                        'body': 'El DNI debe tener 8 dígitos y debe tener solo números.',
	                    });
						return;
					}
				}				
				let parametros = [tipo_doc == "DNI" ? "dni" : "ruc", vat]
		        let contents = $('.client-details');
		        rpc.query({
		            model: 'res.partner',
		            method: 'consulta_datos',
		            args: parametros,
		        }).then(function (datos) {
					if (datos.error) {
	                    self.showPopup('ErrorTracebackPopup', {
	                        'title': 'Alerta!',
	                        'body': datos.message,
	                    });
	                } else if (datos.data) {
						if(!datos.data.success) {
	                        self.showPopup('ErrorTracebackPopup', {
	                            'title': 'Alerta!',
	                            'body': datos.data.message,
	                        });
	                        return;
	                    }
	                    var respuesta = datos.data.data;
						contents.find('input[name="name"]').val(respuesta.name);
						self.changes['name'] = respuesta.name;
						//console.log(respuesta.name)
						//console.log(respuesta.company_type)
					}

				});
				//console.log(`Se seleccionó ${tipo_doc} ${vat}`)
			}
		}

    Registries.Component.extend(ClientDetailsEdit, ClientDetailsEditVat);

    return ClientDetailsEdit;
});
