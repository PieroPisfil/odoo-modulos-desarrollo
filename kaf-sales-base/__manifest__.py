# -*- coding: utf-8 -*-

{
    'name': "kaf-sales-base",
    'summary': "Configuraciones iniciales para las ventas",
    'version': '1.1',
    'description': """
       Los comprobantes los envía por whatsapp
    """,
    'author': "Piero Pisfil",
    'depends': [
        'base',
        'contacts',
        'sale',
        'kaf-contacts-base',
        'web',
    ],
    'data': [
        # 'security/security.xml',
        # 'security/ir.model.access.csv',
        # 'data/copier_brand.xml',
        'report/ticket_paper_format.xml',
        'views/sale_make_invoice_advance_views.xml',
        # 'views/menu.xml',
        # 'views/datasheet_view.xml',
        # 'views/copier_brand_view.xml',
    ],
    # 'assets': {
    #     'point_of_sale.assets': [
    #         'kaf-whatsapp-pos/static/src/js/*',
    #         'kaf-whatsapp-pos/static/src/css/**/*',
    #         'kaf-whatsapp-pos/static/src/js/Screens/**/*',
    #     ],
    #     'web.assets_qweb': [
    #         'kaf-whatsapp-pos/static/src/xml/**',
    #         'kaf-whatsapp-pos/static/src/xml/Screens/**/*',
    #     ],
    # },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
}
