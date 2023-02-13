# -*- coding: utf-8 -*-

{
    'name': "kaf-whatsapp-pos",
    'summary': "Envía comprobantes por whatsapp desde el pos, previa configuración.",
    'version': '1.1',
    'description': """
       Los comprobantes los envía por whatsapp
    """,
    'author': "Piero Pisfil",
    'depends': [
        'base',
        'contacts',
        'point_of_sale',
    ],
    'data': [
        'views/res_company_view.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
            'kaf-whatsapp-pos/static/src/js/*',
            'kaf-whatsapp-pos/static/src/css/**/*',
            'kaf-whatsapp-pos/static/src/js/Screens/**/*',
        ],
        'web.assets_qweb': [
            'kaf-whatsapp-pos/static/src/xml/**',
            'kaf-whatsapp-pos/static/src/xml/Screens/**/*',
        ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
}
