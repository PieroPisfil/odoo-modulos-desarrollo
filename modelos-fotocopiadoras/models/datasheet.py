# -*- coding: utf-8 -*-

from odoo import fields, models, api

copier_formats = [('no_tiene', 'No tiene'),
                  ('a4', 'Hasta A4'),
                  ('letter', 'Hasta A4 - Letter(Carta)'),
                  ('legal', 'Hasta A4 - Legal(Oficio)'),
                  ('a3', 'Hasta A3'), ]


class Datasheet(models.Model):
    _name = "datasheet"
    _inherit = ['image.mixin']

    name = fields.Char(string='Nombre de Modelo')
    copy_brand = fields.Many2one(
        comodel_name='copier.brand',
        string='Marca')
    tipo_funcion = fields.Selection(selection=[
        ('multifuncional-laser',
         'Copiadora Multifuncional Laser (Impresora-Copiadora-Escaner-Fax)'),
        ('only-printer-laser', 'Impresora Laser'),
    ], string='Tipo', default='multifuncional-laser')
    tipo_color = fields.Selection(selection=[
        ('monocroma', 'Monócroma'),
        ('color', 'Color'),
    ], string='Tipo')

    paper_format_luna = fields.Selection(
        copier_formats, string='Formato Luna')
    paper_format_bandeja = fields.Selection(
        copier_formats, string='Formato Bandeja')
    paper_format_bypass = fields.Selection(
        copier_formats, string='Formato Bypass')
    paper_format_adf = fields.Selection(
        copier_formats, string='Formato ADF')

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
    brochure_filename = fields.Char()

    active = fields.Boolean(default=True)
