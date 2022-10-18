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
        'l10n_pe',
        'l10n_latam_base',
        'point_of_sale',
    ],
    'data': [
        'views/res_partner_view.xml',
        'views/res_company_view.xml',
        'views/pos_config_image_view.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
            'kaf-contacts-base/static/src/js/pos_image_field.js',
            'kaf-contacts-base/static/src/js/models.js',
            'kaf-contacts-base/static/src/css/pos_customize.css',
            'kaf-contacts-base/static/src/js/Screens/ClientListSreen/ClientDetailsEdit.js',
        ],
        'web.assets_qweb': [
            'kaf-contacts-base/static/src/xml/Chrome.xml',
            'kaf-contacts-base/static/src/xml/**',
            'kaf-contacts-base/static/src/xml/Screens/**/*',
        ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
}
