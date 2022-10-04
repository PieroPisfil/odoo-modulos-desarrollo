# -*- coding: utf-8 -*-

{
    'name': "kaf-contacts-base",
    'summary': "Modulo personalizado para agregar campos a los usuarios.",
    'version': '1.1',
    'description': """
       Se quiere agregar campos para el modulo de contactos según Perú
    """,
    'author': "Piero Pisfil",
    'depends': [
        'base',
        'contacts',
    ],
    'data': [
        'views/res_partner_view.xml'
    ],
    'license': 'LGPL-3',
}
