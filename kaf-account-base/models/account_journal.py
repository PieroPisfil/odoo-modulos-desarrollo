# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models, api, _
from odoo.exceptions import ValidationError

class AccountJournal(models.Model):
   
    _inherit = "account.journal"

    is_cpe = fields.Boolean('Es un CPE',help="Es un Comprobante Peruano Electrónico?")
    is_synchronous = fields.Boolean("Es síncrono")
    is_synchronous_anull = fields.Boolean("Anulación síncrona", default=True)
    credit_note_id = fields.Many2one(comodel_name="account.journal", string="Nota de credito", 
      domain="[('type','in', ['sale', 'purchase']), ('pe_invoice_code', '=', '07')]")
    dedit_note_id = fields.Many2one(comodel_name="account.journal", string="Nota de debito", 
      domain="[('type','in', ['sale', 'purchase']), ('pe_invoice_code', '=', '08')]")
    pe_invoice_code = fields.Selection(selection="_get_pe_invoice_code", string="Tipo de comprobante")
    #pe_payment_method = fields.Selection(selection="_get_pe_payment_method", string="Metodo de pago")

    usar_secuencia_propia = fields.Boolean('Secuencia personalizada', help="Usar una secuencia propia como se hacia en otras versiones, al marcar esta opción y emitir un comprobante con este diario ya no se podrá usar el correlativo por defecto de odoo14 para este diario")
    sequence_id = fields.Many2one('ir.sequence', string='Secuencia de diario',
      help="Este campo contiene la información relacionada con la numeración de los asientos de este diario.", copy=False)
    sequence_number_next = fields.Integer(string='Siguiente numero', help='El siguiente número de secuencia se utilizará para la próxima factura.',
      compute='_compute_seq_number_next',inverse='_inverse_seq_number_next')
    # Usado para los diarios tipo banco cuyo numero de cuenta se desea mostrar en las cotizaciones y/o facturas
    mostrar_en_venta = fields.Boolean('Mostrar en venta')

    @api.model
    def _get_pe_invoice_code(self):
      return self.env['pe.datas'].get_selection("PE.TABLA10")

    @api.depends('sequence_id.use_date_range', 'sequence_id.number_next_actual')
    def _compute_seq_number_next(self):
      # Calcule 'sequence_number_next' según la secuencia actual en uso, una ir.sequence o una ir.sequence.date_range.      
      for journal in self:
        if journal.sequence_id:
          sequence = journal.sequence_id._get_current_sequence()
          journal.sequence_number_next = sequence.number_next_actual
        else:
          journal.sequence_number_next = 1

    def _inverse_seq_number_next(self):
		# Inverse 'sequence_number_next' to edit the current sequence next number.
      for journal in self:
        if journal.sequence_id and journal.sequence_number_next:
          sequence = journal.sequence_id._get_current_sequence()
          sequence.sudo().number_next = journal.sequence_number_next