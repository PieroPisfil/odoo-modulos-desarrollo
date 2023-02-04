# -*- coding: utf-8 -*-

{
    'name': "kaf-missg-pos",
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
            'kaf-missg-pos/static/js/**/*',
            'kaf-missg-pos/static/css/**/*',
            'kaf-missg-pos/static/js/Screens/**/*',
            'kaf-missg-pos/static/lib/**/*',
        ],
        'web.assets_qweb': [
            'kaf-missg-pos/static/xml/**/*',
            'kaf-missg-pos/static/xml/Screens/**/*',
        ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
}
