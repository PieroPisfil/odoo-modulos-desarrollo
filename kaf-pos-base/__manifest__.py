# -*- coding: utf-8 -*-

{
    'name': "kaf-pos-base",
    'summary': "Configuraciones iniciales par el POS.",
    'version': '1.1',
    'description': """
       Configuraciones iniciales par el POS.
    """,
    'author': "Piero Pisfil",
    'depends': [
        'base',
        'contacts',
        'point_of_sale',
    ],
    'data': [
        'views/pos_config_view.xml',
        # 'data/*',
    ],
    'assets': {
        # 'point_of_sale.assets': [
        #     'kaf-whatsapp-pos/static/src/js/*',
        #     'kaf-whatsapp-pos/static/src/css/**/*',
        #     'kaf-whatsapp-pos/static/src/js/Screens/**/*',
        # ],
        # 'web.assets_qweb': [
        #     'kaf-whatsapp-pos/static/src/xml/**',
        #     'kaf-whatsapp-pos/static/src/xml/Screens/**/*',
        # ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
}
