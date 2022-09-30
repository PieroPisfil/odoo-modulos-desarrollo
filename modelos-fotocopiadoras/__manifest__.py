# -*- coding: utf-8 -*-

{
    'name': "module-fotocopier",
    'summary': "Modulo personalizado para agregar modelos de fotocopiadoras en Odoo",
    'version': '1.1',
    'description': """
       Fotocopier's data
    """,
    'author': "Piero Pisfil",
    'depends': [
        'stock',
        'mail',
    ],
    'data': [
        'security/security.xml',
        'data/copier_brand.xml',
        'report/reporte_datasheet.xml',
        'views/menu.xml',
        'views/datasheet_view.xml',
        'views/copier_brand_view.xml',
    ],
    'license': 'LGPL-3',
}
