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
        _logger.info('***************response: {0}'.format(phonenumber))
        _logger.info('***************response: {0}'.format(ticket))
        endpoint = "http://api:3333/message/image?key=%s" % 10

        image_file = '/mnt/extra-addons-customize/kaf-whatsapp-pos/static/description/icon.png'

        with open(image_file, "rb") as f:
            im_bytes = f.read()        
        im_b64 = base64.b64encode(im_bytes).decode("utf8")
        #receipt = self._add_mail_attachment(name, ticket)
        #attachments = receipt
        # b64_res = ticket.encode('utf-8')
        receipt = base64.b64decode(ticket)
        imagen = Image.open(io.BytesIO(base64.b64decode(ticket)))
        # receipt_jpg = receipt.decode('utf-8')
        #image_1 = io.BytesIO(receipt)
        #image_2 = Image.open(image_1)
        # image_3 = base64.b64decode(image_2)
        #data = base64.b64encode(image_2).decode('utf-8')
        #_logger.info('***************response: {0}'.format(receipt))
        # load attachment binary data with a separate read(), as prefetching all
        # `datas` (binary field) could bloat the browse cache, triggerring
        # soft/hard mem limits with temporary data.
        #attachments = [(a['name'], base64.b64decode(a['datas']), a['mimetype'])
        #                for a in attachments.sudo().read(['name', 'datas', 'mimetype']) if a['datas'] is not False]
        #_logger.info('***************response: {0}'.format(attachments))
        #tckt = self._prepare_mail_values(name, client, ticket)
        #ticket_2 = tckt['attachment_ids']
        #tckt = ticket_2
        
        files = [("file", ('icon.jpg', open(image_file, "rb"), 'image/png'))]
            
        headers = { }
        #headers = {
        #    'Content-Type': 'application/x-www-form-urlencoded',}
        #    'accept': 'application/json',}
        data = {
            "id": "%s" % phonenumber,
        }
        result = requests.post(endpoint, headers=headers, data=data,  files=files)
        #result = requests.post(endpoint, json = body, files = files)
        res = {'error': True, 'message': 'No Enviado', 'data': {}}
        _logger.info('***************response: {0}'.format(result.json()))
        #if result.status_code == 200:
        #    result_json = result.json()
        #    if not result_json['error']:
        #        res = {'error': False, 'message': 'Ok Enviado', 'data': {}}
        #        return res
        return res