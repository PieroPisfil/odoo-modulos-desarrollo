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
        'kaf-account-base',
    ],
    'data': [
        'views/pos_config_view.xml',
        'views/pos_order_view.xml',
        # 'data/*',
    ],
    'assets': {
        'point_of_sale.assets': [
            'kaf-pos-base/static/js/**/*',
            'kaf-pos-base/static/css/**/*',
            'kaf-pos-base/static/js/Screens/**/*',
        ],
        'web.assets_qweb': [
            'kaf-pos-base/static/xml/**/*',
            'kaf-pos-base/static/xml/Screens/**/*',
        ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
}
