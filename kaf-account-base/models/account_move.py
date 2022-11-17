from odoo import api, fields, models, _
# from odoo.exceptions import RedirectWarning, UserError, ValidationError, AccessError
# import odoo.addons.decimal_precision as dp
# from datetime import datetime
from collections import defaultdict
import json 
# import re
# from . import amount_to_text_es
from odoo.exceptions import UserError, ValidationError
# from odoo.tools.misc import format_date


import logging
_logging = logging.getLogger(__name__)

class AccountMove(models.Model):
    _inherit = 'account.move'

    ################# Para obtener el nombre del recibo, factura o boleta  ##########################
    def _compute_name(self):
        def journal_key(move):
            return (move.journal_id, move.journal_id.refund_sequence and move.move_type)

        def date_key(move):
            return (move.date.year, move.date.month)

        grouped = defaultdict(  # key: journal_id, move_type
            lambda: defaultdict(  # key: first adjacent (date.year, date.month)
                lambda: {
                    'records': self.env['account.move'],
                    'format': False,
                    'format_values': False,
                    'reset': False
                }
            )
        )
        self = self.sorted(lambda m: (m.date, m.ref or '', m.id))
        highest_name = self[0]._get_last_sequence(lock=False) if self else False

        # Group the moves by journal and month
        for move in self.filtered(lambda m: not m.journal_id.usar_secuencia_propia):
            if not highest_name and move == self[0] and not move.posted_before and move.date:
                # In the form view, we need to compute a default sequence so that the user can edit
                # it. We only check the first move as an approximation (enough for new in form view)
                pass
            elif (move.name and move.name != '/') or move.state != 'posted':
                try:
                    if not move.posted_before:
                        move._constrains_date_sequence()
                    # Has already a name or is not posted, we don't add to a batch
                    continue
                except ValidationError:
                    # Has never been posted and the name doesn't match the date: recompute it
                    pass
            group = grouped[journal_key(move)][date_key(move)]
            if not group['records']:
                # Compute all the values needed to sequence this whole group
                move._set_next_sequence()
                group['format'], group['format_values'] = move._get_sequence_format_param(move.name)
                group['reset'] = move._deduce_sequence_number_reset(move.name)
            group['records'] += move

        # Fusion the groups depending on the sequence reset and the format used because `seq` is
        # the same counter for multiple groups that might be spread in multiple months.
        final_batches = []
        for journal_group in grouped.values():
            journal_group_changed = True
            for date_group in journal_group.values():
                if (
                    journal_group_changed
                    or final_batches[-1]['format'] != date_group['format']
                    or dict(final_batches[-1]['format_values'], seq=0) != dict(date_group['format_values'], seq=0)
                ):
                    final_batches += [date_group]
                    journal_group_changed = False
                elif date_group['reset'] == 'never':
                    final_batches[-1]['records'] += date_group['records']
                elif (
                    date_group['reset'] == 'year'
                    and final_batches[-1]['records'][0].date.year == date_group['records'][0].date.year
                ):
                    final_batches[-1]['records'] += date_group['records']
                else:
                    final_batches += [date_group]

        # Give the name based on previously computed values
        for batch in final_batches:
            for move in batch['records']:
                move.name = batch['format'].format(**batch['format_values'])
                batch['format_values']['seq'] += 1
            batch['records']._compute_split_sequence()

        self.filtered(lambda m: not m.name).name = '/'

    def _post(self, soft=True):
        for invoice_id in self:
            if invoice_id.journal_id.usar_secuencia_propia:
                sequence = invoice_id._get_sequence()
                if not sequence:
                    raise UserError('Defina una secuencia en su diario.')
                if len(invoice_id.name.split("-")) < 2:
                    invoice_id.name = sequence.with_context(
                        ir_sequence_date=invoice_id.date).next_by_id()
                    invoice_id.payment_reference = invoice_id.name
            else:
                invoice_id._compute_name()
        return super(AccountMove, self)._post()

    def _get_sequence(self):
        self.ensure_one()
        journal = self.journal_id
        return journal.sequence_id
    ################# FIN  ##########################################################################

##############################################**********************************#####################################
    def button_envio_sunat(self):
        if self.journal_id.is_cpe:
            tipo_vat = self.partner_id.l10n_latam_identification_type_id.name
            fecha_emision = self.invoice_date
            fecha_emision = '%s-%s-%s' % (fecha_emision.day, fecha_emision.month, fecha_emision.year)
            # _logging.info('**************************** Entró a envío: {0}'.format(fecha_emision))
            json_envio = {
                'operacion' : "generar_comprobante",
                'tipo_de_comprobante' : int(self.journal_id.pe_invoice_code),
                'serie' : self.journal_id.code,
                'numero' : int(self.name.split("-")[-1]) ,
                'cliente_tipo_de_documento' : tipo_vat,
                'cliente_numero_de_documento' : self.partner_id.vat,
                'cliente_direccion' : self.partner_id.street,
                'moneda' : self.currency_id.name,
                'fecha_de_emision' : fecha_emision,
            }
            #json_envio['operacion'] = "generar_comprobante"

            json_envio = json.dumps(json_envio)
            _logging.info('**************************** Entró a envío: {0}'.format(json_envio))
        else:
            raise UserError(_(
                "El diario seleccionado no permite el envío."
            ))
        


    