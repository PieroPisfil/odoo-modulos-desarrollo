# -*- coding: utf-8 -*-

{
    'name': "kaf-report-base",
    'summary': "Configuraciones para reportes personalizados.",
    'version': '1.1',
    'description': """
       Configuraciones para reportes personalizados.
    """,
    'author': "Piero Pisfil",
    'depends': [
        'contacts',
        'kaf-ticket-base',
        'stock',
        'sale',
        'kaf-contacts-base',
        'web',
    ],
    'data': [
        # 'security/security.xml',
        # 'security/ir.model.access.csv',
        # 'data/report_layout.xml',
        'report/paper_format.xml',
        'report/template_a4_proforma.xml',
        # 'views/sale_make_invoice_advance_views.xml',
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
