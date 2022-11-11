# _*_ coding utf-8 _*_

from odoo import models, fields, api
from odoo.exceptions import UserError, ValidationError

import requests
import logging

_logger = logging.getLogger(__name__)

QUERY_DOCUMENT ={
'urls': {
    'dni': 'gjghj',
    'ruc': 'fdgdfg',
}
}

class ResPArtner(model.Model):
    #Consulta DNI
    related_identification = fields.Char