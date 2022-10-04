# -*- coding: utf-8 -*-

from odoo import fields, models, api


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


class ResPartner(models.Model):
    _inherit = 'res.partner'

    l10n_latam_identification_type_id = fields.Many2one(
        'l10n_latam.identification.type', default=lambda self: self.env.ref('l10n_pe.it_RUC'))
    # doc_type = fields.Char(related = 'l10n_latam_identification_type_id.l10n_pe_vat_code', store = True)
    doc_number = fields.Char(string='Numero de documento')
    commercial_name = fields.Char(string='Nombre comercial', default='-')
    legal_name = fields.Char(string='Nombre legal', default='-')
    state_sunat = fields.Selection(
        state_sunat_v, string='Estado', default='ACTIVO')
    condition_sunat = fields.Selection(
        condition_sunat_v, string='Condición', default='HABIDO')
    is_validate = fields.Boolean(string='Está validado')
    last_update = fields.Datetime(string='Última actualización')
