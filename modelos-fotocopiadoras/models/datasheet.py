# -*- coding: utf-8 -*-

from odoo import fields, models, api

class Datasheet(models.Model):
    _name = "datasheet"

    name = fields.Char()