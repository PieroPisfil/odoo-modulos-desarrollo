odoo.define('kaf-pos-base.models', function(require) {
    "use strict";
  
    var models = require('point_of_sale.models');
    var OrderSuper = models.Order;
    var _posModelSuper = models.PosModel.prototype;

    models.Order = models.Order.extend({
        initialize: function (attributes, options) {
            var self = this;
            this.forma_de_pago_pe_alt = [
                {'id':0,'code': 'CONTADO', 'name':'CONTADO'},
                {'id':1,'code': 'CREDITO', 'name':'CRÉDITO'},
                {'id':2,'code': 'GARANTIA', 'name':'POR GARANTÍA'},]
            this.forma_de_pago_pe = this.forma_de_pago_pe_alt[0]; 
            this.to_invoice_factura    = false;
            this.to_invoice_boleta     = false;
            this.to_invoice_recibo     = false;
            var res = OrderSuper.prototype.initialize.apply(this, arguments);
            return res;
        },
        set_to_invoice_factura: function(to_invoice) {
            this.assert_editable();
            this.to_invoice_boleta     = false;
            this.to_invoice_recibo     = false;
            this.to_invoice_factura = to_invoice;
            this.to_invoice = to_invoice;
        },
        is_to_invoice_factura: function(){
            return this.to_invoice_factura;
        },
        set_to_invoice_boleta: function(to_invoice) {
            this.assert_editable();
            this.to_invoice_factura    = false;
            this.to_invoice_recibo     = false;
            this.to_invoice_boleta = to_invoice;
            this.to_invoice = to_invoice;
        },
        is_to_invoice_boleta: function(){
            return this.to_invoice_boleta;
        },
        set_to_invoice_recibo: function(to_invoice) {
            this.assert_editable();
            this.to_invoice_factura    = false;
            this.to_invoice_boleta     = false;
            this.to_invoice_recibo = to_invoice;
            this.to_invoice = to_invoice;
        },
        is_to_invoice_recibo: function(){
            return this.to_invoice_recibo;
        },
    });

    // models.load_models([{
    //     model: 'l10n_latam.identification.type',
    //     fields: ["name"],
    //     //domain: function(self){return [['country_id.code', '=', 'PE']]},
    //     loaded: function(self, doc_types){
    // /*         self.docu_by_id = {}
    //         _.each(doc_types, function(doc) {
    //         self.docu_by_id[doc.id] = doc.id
    //         }); */
    //         self.doc_types = doc_types;
    //     },
    // }]);

    // models.PosModel = models.PosModel.extend({
    //     initialize: function (session, attributes) {

    //         return _posModelSuper.initialize.call(this,session,attributes);
    //     }
    // });

})
