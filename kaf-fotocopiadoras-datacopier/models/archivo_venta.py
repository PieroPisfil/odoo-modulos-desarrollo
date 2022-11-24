# -*- coding: utf-8 -*-

from odoo import fields, models, api


class ArchivoVenta(models.Model):
    _name = "archivo.venta"
    _inherit = ['image.mixin']

    name = fields.Char(string='Nombre',copy=False)
    state = fields.Selection(selection=[
        ('borrador', 'Borrador'),
        ('proforma', 'Proforma'),
        ('venta', 'Venta Hecha'),
        ('desechado', 'Desechado'),
    ], default='borrador', string='Estado', copy=False)
    partner_id_principal = fields.Many2one(
        comodel_name='res.partner',
        string='Contacto Principal',required=True)
    partner_ids_secundarios = fields.Many2one(
        comodel_name='res.partner',
        string='Contactos que pertenecen a este archivo')
    fotocopiadora_id = fields.Many2one(
        comodel_name='product.template',
        string='Contactos que pertenecen a este archivo')
    suministros_id = fields.Many2many(
        comodel_name='product.template',
        string='Productos Adicionales para compra'
    )
    forma_de_pago_pe = fields.Selection([
        ('contado','CONTADO'),
        ('credito','CRÉDITO')
    ],string="Forma de Pago", default="contado", copy=False, required=True)
    fch_aprobado = fields.Datetime(string='Fecha aprobado', copy=False)
    active = fields.Boolean(default=True)