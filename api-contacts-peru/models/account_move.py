# -*- coding: utf-8 -*-

from odoo import api, fields, models, Command, _


class AccountMove(models.Model):

    _inherit = "account.move"

    sunat_payment_term_id = fields.Selection(
        [('contado', 'Contado'), ('credito', 'Crédito')], string='Tipo de Pago', default='contado')
