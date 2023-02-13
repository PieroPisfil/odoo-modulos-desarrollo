 # -*- coding: utf-8 -*-

from odoo import fields, models, api
import json
import base64
import io
from PIL import Image
from odoo.exceptions import UserError, ValidationError
import requests
import logging

_logger = logging.getLogger(__name__)

class PosOrder(models.Model):
    _inherit = 'pos.order'

    def send_ticket_whatsapp(self, phonenumber, name, client, ticket):
        res = {'error': True, 'message': 'No Enviado', 'data': {}}
        endpoint = "http://api:3333/message/image?key=%s" % 10
        imagen = io.BytesIO(base64.b64decode(ticket))    
        files = [("file", ('icon.jpg', imagen, 'image/jpeg'))]
        headers = {}
        body = {}
        data = {
            "id": "%s" % phonenumber,
            "caption" : "Gracias por su compra %s. Referencia: Número de %s." % (client['name'], name),
        }
        result = requests.post(endpoint, headers=headers, data=data, json = body, files=files)
        #_logger.info('***************response: {0}'.format(result.json()))
        if result.status_code == 200 or 201:
           result_json = result.json()
           if not result_json['error']:
               res = {'error': False, 'message': 'Ok Enviado', 'data': {}}
               return res
        return res