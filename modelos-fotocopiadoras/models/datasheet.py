# -*- coding: utf-8 -*-

from email.policy import default
from odoo import fields, models, api


class Datasheet(models.Model):
    _name = "datasheet"
    _inherit = ['image.mixin']

    name = fields.Char(string='Nombre de Modelo')
    copy_brand = fields.Selection(selection=[
        ('ricoh', 'Ricoh'),
        ('minolta', 'Minolta'),
        ('canon', 'Canon'),
        ('lexamrk', 'Lexamrk'),
        ('hp', 'HP'),
        ('samsung', 'Samsung'),
        ('sin-marca', 'Sin Marca'),
    ], string='Marca')
    tipo_color = fields.Selection(selection=[
        ('monocroma', 'Monócroma'),
        ('color', 'Color'),
    ], string='Tipo')

    paper_format = fields.Selection([
        ('a4', 'A4'),
        ('letter', 'A4-Oficio'),
        ('a3', 'A4-A3'),
    ], string='Formato de Papel')
    copy_speed = fields.Integer(string='Velocidad de copiado')  # ppm

    printer_speed = fields.Integer(string='Velocidad de impresión')  # ppm
    printer_max_resolution = fields.Integer(
        string='Resolución máxima de impresión')  # dpi

    scan_max_speed_byn = fields.Integer(
        string='Velocidad máxima de escaner en ByN')  # ppm
    scan_max_speed_color = fields.Integer(
        string='Velocidad máxima de escaner en color')  # ppm
    scan_max_resolution = fields.Integer(
        string='Resolución máxima de escaner en ByN')  # dpi
    scan_duplex_scan = fields.Selection([
        ('twoscan', 'Two-scan'),
        ('duplex', 'Duplex'),
    ], string='Tipo de scaner duplex')

    product_realted_id = fields.Many2one(
        comodel_name='product.template',
        string='Fotocopiadora en el inventario'
    )
    product_toner_compatible = fields.Many2many(
        comodel_name='product.template',
        string='Toner Compatibles'
    )

    link_brochure = fields.Char(string='Link a Brochure')
    tiene_brochure = fields.Boolean(string='Tiene brochure')
    brochure_file = fields.Binary(string='Brochure')

    active = fields.Boolean(default=True)