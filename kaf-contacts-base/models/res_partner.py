# -*- coding: utf-8 -*-

from odoo import api, fields, models, _

class Partner(models.Model):
	_inherit = "res.partner"

	doc_type = fields.Char(related="l10n_latam_identification_type_id.l10n_pe_vat_code")
	doc_number = fields.Char("Numero de documento")
	commercial_name = fields.Char("Nombre comercial", default="-")
	legal_name = fields.Char("Nombre legal", default="-")
	state_sunat = fields.Selection(STATE, 'Estado', default="ACTIVO")
	condition_sunat = fields.Selection(CONDITION, 'Condición', default='HABIDO')
	is_validate = fields.Boolean("Está validado")
	last_update = fields.Datetime("Última actualización")