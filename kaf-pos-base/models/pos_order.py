# -*- coding: utf-8 -*-

from odoo import fields, api, tools, models
from datetime import datetime
from odoo.exceptions import ValidationError
import pytz
import psycopg2
from odoo.tools import float_is_zero, float_round, float_repr, float_compare
import logging
from dateutil.parser import parse as parse_date
from odoo.tools import DEFAULT_SERVER_DATE_FORMAT as DATE_FORMAT

tz = pytz.timezone('America/Lima')

_logging = logging.getLogger(__name__)
_logger = logging.getLogger(__name__)


class PosOrder(models.Model):
    _inherit = "pos.order"

    @api.model
    def _get_journal(self, id_journal):
        return self.env['account.journal'].search([
                ('id', '=', id_journal), 
                ('active', '=', True)
            ], limit=1).id

    @api.model
    def _order_fields(self, ui_order):
        res = super(PosOrder, self)._order_fields(ui_order)
        res['invoice_journal'] = ui_order.get('invoice_journal', False)
        # self.invoice_journal = self._get_journal(res['invoice_journal']) if res['invoice_journal'] else None
        # _logger.warning('////////******************************////////////// {0}'.format(self.invoice_journal))
        reg_datetime = datetime.now(tz)
        fecha = reg_datetime.strftime("%Y-%m-%d")
        res['date_invoice'] = parse_date(ui_order.get('date_invoice', fecha)).strftime(DATE_FORMAT)
        return res
    	
    def _prepare_invoice_vals(self):
        res = super(PosOrder, self)._prepare_invoice_vals()
        timezone = pytz.timezone(self._context.get('tz') or self.env.user.tz or 'UTC')
        res['invoice_date'] = self.date_invoice or self.date_order.astimezone(timezone).date()
        # if not res.get('name') and res.get('type') == 'out_refund':
        #     res['name'] = '/'
        # else:
        #     res['name'] = self.number
        res['journal_id'] = (self.invoice_journal.id or self.session_id.config_id.invoice_journal_id.id)
        return res
    
     
    numero_doc_relacionado = fields.Char(string='Doc. Relacionado', readonly=True, copy=False)
    invoice_sequence_number = fields.Integer(string='Secuencia de números de factura', readonly=True, copy=False)
    invoice_journal = fields.Many2one('account.journal', string='Diario de facturas de ventas',   states={'draft': [('readonly', False)]}, readonly=True, domain="[('type', 'in', ['sale'])]", copy=True)
    invoice_journal_name = fields.Char(string='Nombre de diario', related='invoice_journal.tipo_comprobante.titulo_en_documento')
    date_invoice = fields.Date("Fecha de la factura")

    def _export_for_ui(self, order):
        res = super(PosOrder, self)._export_for_ui(order)
        res['invoice_journal'] = order.invoice_journal.id
        res['invoice_journal_name'] = order.invoice_journal_name
        return res