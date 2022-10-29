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
				/* $('.busqueda-2').off('click', '');
		        $('.busqueda-2').on('click', self._busquedaCo2.bind(self)); */
				this._changeCountry();
				this.id_departamento = this.changes.state_id;
				this.id_provincia = this.changes.city_id;
				this._changeTypeIdentification();
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
				$('.client-address-provincia').val('')
				this.changes['city_id'] = ""
				$('.client-address-distrito').val('')
				this.changes['l10n_pe_district'] = ""
				//this.render.bind(this)
				this.render();
		    }
			get obtener_id_state() {
				return this.id_departamento;
			}
			_changeProvincia() {	
				this.id_provincia = this.changes.city_id;
				$('.client-address-distrito').val('')
				this.changes['l10n_pe_district'] = ""
				//this.render.bind(this)
				this.render();
		    }
			get obtener_id_provincia() {
				return this.id_provincia
			}
			_changeTypeIdentification(){
				let div2 = $(".l10n_latam_identification_type_id")[0];
				let tipo_doc = div2.options[div2.selectedIndex].text
				$('#busqueda-boton').show();
				if (tipo_doc == 'RUC'){
					$('#state-sunat-div').show();
					$('#condition-sunat-div').show();
				}
				else{
					if(tipo_doc != 'DNI'){
						$('#busqueda-boton').hide();
					}
					$('#state-sunat-div').hide();
					$('#condition-sunat-div').hide();
				}
				this.render();
			}
			_busquedaCo2(){
				console.log('segundo click')
				//this.id_provincia = this.changes.city_id;
				let a = this.changes.city_id
				//console.log(a)
				$(`.client-address-provincia option[value="${a}"]`).attr('selected', 'selected')
				//this.id_distrito = this.changes.l10n_pe_district;
				let b = this.changes.l10n_pe_district;
				//console.log(b)
				$(`.client-address-distrito option[value="${b}"]`).attr('selected', 'selected')
				//this.render();
			}
			_busquedaContacto(){
				var self = this;
		        if (!$("#vat").val()) {return;}
				let vat = $("#vat").val();
				let div2 = $(".l10n_latam_identification_type_id")[0];
				let tipo_doc = div2.options[div2.selectedIndex].text
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
				let flag_busqueda = false ;

				let intervalBusqueda = setInterval(() =>{
					if(flag_busqueda){
						$('.busqueda-2').click()
						console.log('entra if')
					}else{console.log('fuera if')}
				}, 250);
				
				this.func_busqueda (tipo_doc, vat).then(() => {
					flag_busqueda = true;					
				}).finally(() => {
					setTimeout(() => {
						clearInterval(intervalBusqueda)
					},250)
				})
				
				
/* 				this.func_busqueda (tipo_doc, vat).finally(()=>{
					$('.busqueda-2').click()
				}) */
				/* let parametros = [tipo_doc == "DNI" ? "dni" : "ruc", vat]
		        let contents = $('.client-details');
				$('#mensajecc').hide()
		        rpc.query({
		            model: 'res.partner',
		            method: 'consulta_datos',
		            args: parametros,
		        }).then(function (datos) {
					if (datos.error) {
	                    self.showPopup('ErrorTracebackPopup', {
	                        'title': 'Alerta 1!',
	                        'body': datos.message,
	                    });
	                } else if (datos.data) {
						if(!datos.data.success) {
	                        self.showPopup('ErrorTracebackPopup', {
	                            'title': 'Alerta 2!',
	                            'body': datos.data.message,
	                        });
	                        return;
	                    }
	                    var respuesta = datos.data.data;
						self.rr = respuesta
						//console.log(self.rr)
						contents.find('input[name="name"]').val(respuesta.name);
						self.changes['name'] = respuesta.name;
						contents.find('input[name="company_type"]').val(respuesta.company_type);
						self.changes['company_type'] = respuesta.company_type;
						if (tipo_doc === 'RUC') {
							contents.find('input[name="state_sunat"]').val(respuesta.state_sunat);
							self.changes['state_sunat'] = respuesta.state_sunat;
							contents.find('input[name="condition_sunat"]').val(respuesta.condition_sunat);
							self.changes['condition_sunat'] = respuesta.condition_sunat;
	                        contents.find('input[name="street"]').val(respuesta.street);
							self.changes['street'] = respuesta.street;
							if (respuesta.zip){
								contents.find('input[name="zip"]').val(respuesta.zip);
								self.changes['zip'] = respuesta.zip;

								contents.find('select[name="state_id"]').val(respuesta.state_id);
								self.changes['state_id'] = respuesta.state_id;
								self._changeState();
								//self.id_departamento = self.changes.city_id;	
								//self.render();
								
								contents.find('select[name="city_id"]').val(respuesta.city_id);
								self.changes['city_id'] = respuesta.city_id;
								//self._changeProvincia();		
								self.id_provincia = self.changes.city_id;					
								self.render();
								
								//contents.find('select[name="l10n_pe_district"]').val(respuesta.l10n_pe_district);
								self.changes['l10n_pe_district'] = respuesta.l10n_pe_district;
								self.render();
							}
							//console.log(respuesta.zip)
							//console.log(respuesta.city_id)
							//console.log(contents.find('select[name="l10n_pe_district"]').val())
							//Algunas advertencias
							let state_sunat = self.changes['state_sunat']
							if(state_sunat == 'ACTIVO') {
								$('#alerta-state-sunat').attr("hidden",true)
								$('.state-sunat-class').css("background", "#22e944c7")
							}
							else{
								$('#alerta-state-sunat').attr("hidden",false)
								$('.state-sunat-class').css("background", "#d96161c7")
							}
							let condition_sunat = self.changes['condition_sunat']
							if(condition_sunat == 'HABIDO') {
								$('#alerta-condition-sunat').attr("hidden",true)
								$('.condition-sunat-class').css("background", "#22e944c7")
							}
							else{
								$('#alerta-condition-sunat').attr("hidden",false)
								$('.state-sunat-class').css("background", "#d96161c7")
							}
						}
					}
				}); */
			}

			async func_busqueda (tipo_doc, vat) {
				var self = this
				let respuesta;
				let contents = $('.client-details');
				let parametros = [tipo_doc == "DNI" ? "dni" : "ruc", vat]
				const response = await rpc.query({
					model: 'res.partner',
					method: 'consulta_datos',
					args: parametros,
				})
				if (response.error) {
					self.showPopup('ErrorTracebackPopup', {
						'title': 'Alerta 1!',
						'body': response.message,
					});
					return;
				} else if (response.data) {
					if(!response.data.success) {
						self.showPopup('ErrorTracebackPopup', {
							'title': 'Alerta 2!',
							'body': response.data.message,
						});
						return;
					}
					//console.log(response);
					respuesta = response.data.data;
					contents.find('input[name="name"]').val(respuesta.name);
					self.changes['name'] = respuesta.name;
					contents.find('input[name="company_type"]').val(respuesta.company_type);
					self.changes['company_type'] = respuesta.company_type;
					if (tipo_doc === 'RUC') {
						contents.find('input[name="state_sunat"]').val(respuesta.state_sunat);
						self.changes['state_sunat'] = respuesta.state_sunat;
						contents.find('input[name="condition_sunat"]').val(respuesta.condition_sunat);
						self.changes['condition_sunat'] = respuesta.condition_sunat;
						contents.find('input[name="street"]').val(respuesta.street);
						self.changes['street'] = respuesta.street;
						if (respuesta.zip){
							contents.find('input[name="zip"]').val(respuesta.zip);
							self.changes['zip'] = respuesta.zip;
							
							self.changes['state_id'] = respuesta.state_id;
							contents.find('select[name="state_id"]').val(respuesta.state_id);
							self._changeState();								

							self.changes['city_id'] = respuesta.city_id;
							contents.find('select[name="city_id"]').val(respuesta.city_id);
							self._changeProvincia();
							
							self.changes['l10n_pe_district'] = respuesta.l10n_pe_district;
							contents.find('select[name="l10n_pe_district"]').val(respuesta.l10n_pe_district);
						}
						//Algunas advertencias
						let state_sunat = self.changes['state_sunat']
						if(state_sunat == 'ACTIVO') {
							$('#alerta-state-sunat').attr("hidden",true)
							$('.state-sunat-class').css("background", "#22e944c7")
						}
						else{
							$('#alerta-state-sunat').attr("hidden",false)
							$('.state-sunat-class').css("background", "#d96161c7")
						}
						let condition_sunat = self.changes['condition_sunat']
						if(condition_sunat == 'HABIDO') {
							$('#alerta-condition-sunat').attr("hidden",true)
							$('.condition-sunat-class').css("background", "#22e944c7")
						}
						else{
							$('#alerta-condition-sunat').attr("hidden",false)
							$('.state-sunat-class').css("background", "#d96161c7")
						}
					}
				}
			}
		}		

    Registries.Component.extend(ClientDetailsEdit, ClientDetailsEditVat);

    return ClientDetailsEdit;
});
