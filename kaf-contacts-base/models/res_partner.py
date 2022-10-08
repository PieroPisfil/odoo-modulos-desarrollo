# -*- coding: utf-8 -*-

from odoo import fields, models, api
from odoo.exceptions import UserError, ValidationError
import requests
import logging

_logger = logging.getLogger(__name__)


state_sunat_v = [('ACTIVO', 'ACTIVO'),
                 ('BAJA DE OFICIO', 'BAJA DE OFICIO'),
                 ('BAJA DEFINITIVA', 'BAJA DEFINITIVA'),
                 ('BAJA PROVISIONAL', 'BAJA PROVISIONAL'),
                 ('SUSPENSION TEMPORAL', 'BAJA PROVISIONAL'),
                 ('INHABILITADO-VENT.UN', 'INHABILITADO-VENT.UN'),
                 ('BAJA MULT.INSCR. Y O', 'BAJA MULT.INSCR. Y O'),
                 ('PENDIENTE DE INI. DE', 'PENDIENTE DE INI. DE'),
                 ('OTROS OBLIGADOS', 'OTROS OBLIGADOS'),
                 ('NUM. INTERNO IDENTIF', 'NUM. INTERNO IDENTIF'),
                 ('ANUL.PROVI.-ACTO ILI', 'ANUL.PROVI.-ACTO ILI'),
                 ('ANULACION - ACTO ILI', 'ANULACION - ACTO ILI'),
                 ('BAJA PROV. POR OFICI', 'BAJA PROV. POR OFICI'),
                 ('ANULACION - ERROR SU', 'ANULACION - ERROR SU')]

condition_sunat_v = [('HABIDO', 'HABIDO'),
                     ('NO HABIDO', 'NO HABIDO'),
                     ('NO HALLADO', 'NO HALLADO'),
                     ('PENDIENTE', 'PENDIENTE'),
                     ('NO HALLADO SE MUDO D', 'NO HALLADO SE MUDO D'),
                     ('NO HALLADO NO EXISTE', 'NO HALLADO NO EXISTE'),
                     ('NO HALLADO FALLECIO', 'NO HALLADO FALLECIO'),
                     ('-', 'NO HABIDO'),
                     ('NO HALLADO OTROS MOT', 'NO HALLADO OTROS MOT'),
                     ('NO APLICABLE', 'NO APLICABLE'),
                     ('NO HALLADO NRO.PUERT', 'NO HALLADO NRO.PUERT'),
                     ('NO HALLADO CERRADO', 'NO HALLADO CERRADO'),
                     ('POR VERIFICAR', 'POR VERIFICAR'),
                     ('NO HALLADO DESTINATA', 'NO HALLADO DESTINATA'),
                     ('NO HALLADO RECHAZADO', 'NO HALLADO RECHAZADO')]

# QUERY PARA APIS PERU
QUERY_DOCUMENT_APISPERU = {
    'urls': {
        'dni': 'https://dniruc.apisperu.com/api/v1/dni/{vat}?token={token}',
        'ruc': 'https://dniruc.apisperu.com/api/v1/ruc/{vat}?token={token}'
    }
}


class ResPartner(models.Model):
    _inherit = 'res.partner'

    # Modificamos para que aparezca Perú por defecto
    country_id = fields.Many2one(
        'res.country', string='Country', ondelete='restrict', default=lambda self: self.env.ref('base.pe'))
    # Modificamos para que aparezca Lambayeque por defecto
    state_id = fields.Many2one("res.country.state", string='State', ondelete='restrict',
                               domain="[('country_id', '=?', country_id)]", default=lambda self: self.env.ref('base.state_pe_14'))

    l10n_pe_district = fields.Many2one('l10n_pe.res.city.district', string='District', help='Districts are part of a province or city.',
                                       default=lambda self: self.env.ref('l10n_pe.district_pe_140101'))
    # Modificamos para que aparezca RUC por defecto
    l10n_latam_identification_type_id = fields.Many2one(
        'l10n_latam.identification.type', default=lambda self: self.env.ref('l10n_pe.it_RUC'))
    doc_number = fields.Char(string='Numero de documento')
    commercial_name = fields.Char(string='Nombre comercial', default='-')
    legal_name = fields.Char(string='Nombre legal', default='-')
    state_sunat = fields.Selection(
        state_sunat_v, string='Estado', default='ACTIVO')
    condition_sunat = fields.Selection(
        condition_sunat_v, string='Condición', default='HABIDO')
    is_validate = fields.Boolean(string='Está validado')

    last_update = fields.Datetime(string='Última actualización')

    vat = fields.Char(related='doc_number')
    zip = fields.Char(related='l10n_pe_district.code', store=True)

    @api.onchange('company_type')
    def _on_change_estado(self):
        if self.company_type == 'person':
            self.l10n_latam_identification_type_id = self.env.ref(
                'l10n_pe.it_DNI')
        if self.company_type == 'company':
            self.l10n_latam_identification_type_id = self.env.ref(
                'l10n_pe.it_RUC')

    @api.onchange('vat', 'l10n_latam_identification_type_id')
    def _onchange_identification(self):
        token = ''
        if self.company_id:
            tipo_busqueda = self.company_id.busqueda_ruc
            if tipo_busqueda == 'sinapi':
                return
            elif tipo_busqueda == 'apisperu':
                token = self.company_id.token_apisperu
            elif tipo_busqueda == 'apiperu':
                token = self.company_id.token_apiperu
        else:
            tipo_busqueda = self.env.company.busqueda_ruc
            if tipo_busqueda == 'sinapi':
                return
            elif tipo_busqueda == 'apisperu':
                token = self.env.company.token_apisperu
            elif tipo_busqueda == 'apiperu':
                token = self.env.company.token_apiperu
        if self.l10n_latam_identification_type_id and self.vat:
            try:
                if tipo_busqueda == 'apisperu':
                    if self.l10n_latam_identification_type_id.l10n_pe_vat_code == '1':
                        self.verify_dni_apisperu(token)
                    elif self.l10n_latam_identification_type_id.l10n_pe_vat_code == '6':
                        #if len(self.vat) != 11:
                        #    return {'error': True, 'message': 'Error, debe tener 11 digitos'}
                        self.verify_ruc_apisperu(token)
                elif tipo_busqueda == 'apiperu':
                    if self.l10n_latam_identification_type_id.l10n_pe_vat_code == '1':
                        self.verify_dni_apiperu(token)
                    elif self.l10n_latam_identification_type_id.l10n_pe_vat_code == '6':
                        self.verify_ruc_apiperu(token)
            except Exception as ex:
                _logger.error('Ha ocurrido un error {}'.format(ex))

    def verify_dni_apisperu(self, token):
        if not self.vat:
            raise UserError("Debe seleccionar un DNI")
        url = QUERY_DOCUMENT_APISPERU['urls']['dni'].format(
            vat=self.vat, token=token)
        result = requests.get(url, verify=False)
        if result.status_code == 200:
            result_json = result.json()
            self.update({
                'name': result_json['apellidoPaterno'].strip().upper() + ' ' + result_json['apellidoMaterno'].strip().upper() + ' ' + result_json['nombres'].strip().upper(),
                'company_type': 'person'
            })
        else:
            return {'error': True, 'message': 'Error al intentar obtener datos'}

    def verify_ruc_apisperu(self, token):
        district_obj = self.env['l10n_pe.res.city.district']
        url = QUERY_DOCUMENT_APISPERU['urls']['ruc'].format(
            vat=self.vat, token=token)
        result = requests.get(url)
        if result.status_code == 200:
            result_json = result.json()

            district = district_obj.search([('name', '=ilike', result_json['distrito']),
                                            ('city_id.name', '=ilike', result_json['provincia'])], limit=1)
            if not district.exists():
                district = district_obj.search(
                    [('code', '=', result_json['ubigeo'])])

            self.update({
                'name': result_json['razonSocial'],
                'legal_name': result_json['razonSocial'],
                'commercial_name': result_json['razonSocial'],
                'street': result_json['direccion'].rsplit(' ', 3)[0],
                'zip': result_json['ubigeo'],
                'state_id': district.city_id.state_id.id,
                'city_id': district.city_id.id,
                'l10n_pe_district': district.id,
                'state_sunat': result_json['estado'],
                'condition_sunat': result_json['condicion'],
                'company_type': 'company'
            })

        else:
            return {'error': True, 'message': 'Error al intentar obtener datos'}
