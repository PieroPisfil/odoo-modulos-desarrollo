# -*- coding: utf-8 -*-

from odoo import fields, api, models
from odoo.exceptions import ValidationError
import logging


_logging = logging.getLogger(__name__)


class PosOrder(models.Model):
    _inherit = "pos.order"
    
     
    numero_doc_relacionado = fields.Char(string='Doc. Relacionado', readonly=True, copy=False)
    invoice_sequence_number = fields.Integer(string='Secuencia de números de factura', readonly=True, copy=False)
    invoice_journal = fields.Many2one('account.journal', string='Diario de facturas de ventas',   states={'draft': [('readonly', False)]}, readonly=True, domain="[('type', 'in', ['sale'])]", copy=True)
    date_invoice = fields.Date("Fecha de la factura")