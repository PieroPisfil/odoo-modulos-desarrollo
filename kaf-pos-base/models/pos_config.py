# -*- coding: utf-8 -*-

from odoo import api, fields, models, _

class PosConfig(models.Model):
    _inherit = 'pos.config'
    
    invoice_journal_ids = fields.Many2many("account.journal", string="Diarios de venta de facturas", domain="[('type', 'in', ['sale'])]")