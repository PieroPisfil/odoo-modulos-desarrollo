# -*- coding: utf-8 -*-

from odoo import api, fields, models, Command, _


class CuotassFacturas(models.Model):

    _name = "cuotas.facturas"

    nro_cuota = fields.Integer(string='Nro de cuota')
    fecha_de_cuota = fields.Date(string='Fecha de cuota')
    monto_de_cuota = fields.Integer(string='Monto de cuota')
