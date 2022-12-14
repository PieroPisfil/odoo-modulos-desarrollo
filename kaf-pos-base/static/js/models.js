odoo.define('kaf-pos-base.models', function(require) {
    "use strict";
  
    var models = require('point_of_sale.models');
    var OrderSuper = models.Order;
    var _posModelSuper = models.PosModel.prototype;
    var config = require('web.config');

    models.load_models([{
        model: 'account.journal',
        fields: ["id","name","tipo_comprobante_nombre"],
        domain: function(self){return [['type', 'in', ['sale']]]; },
        loaded: function(self, accs){
            self.accs = accs;
        },
    }]);

    models.load_fields('pos.config', ['invoice_journal_factura_id', 'invoice_journal_boleta_id', 'invoice_journal_recibo_venta_id','envio_automatico_cpe']);

    models.Order = models.Order.extend({
        initialize: function (attributes, options) {
            this.pos = options.pos;
            this.journal_id_alt_factura = this.pos.config.invoice_journal_factura_id || false
            console.log(this.journal_id_alt_factura)
            this.journal_id_alt_boleta = this.pos.config.invoice_journal_boleta_id || false
            this.journal_id_alt_recibo = this.pos.config.invoice_journal_recibo_venta_id || false
            this.forma_de_pago_pe_alt = [
                {'id':0,'code': 'CONTADO', 'name':'CONTADO'},
                {'id':1,'code': 'CREDITO', 'name':'CRÉDITO'},
                {'id':2,'code': 'GARANTIA', 'name':'POR GARANTÍA'},]
            this.forma_de_pago_pe = this.forma_de_pago_pe_alt[0]; 
            this.to_invoice_factura    = false;
            this.to_invoice_boleta     = false;
            this.to_invoice_recibo     = false;
            this.invoice_journal = false;
            var res = OrderSuper.prototype.initialize.apply(this, arguments);
            return res;
        },

        /**
        * @param {object} json JSON representing one PoS order.
        */
        init_from_JSON: function(json) {
            OrderSuper.prototype.init_from_JSON.apply(this, arguments);
            this.invoice_journal_name = json.invoice_journal_name ? json.invoice_journal_name : false;
        },

        set_to_invoice_factura: function(to_invoice) {
            this.assert_editable();
            this.to_invoice_boleta     = false;
            this.to_invoice_recibo     = false;
            this.to_invoice_factura = to_invoice;
            this.invoice_journal = to_invoice ? this.journal_id_alt_factura : false; 
            this.to_invoice = to_invoice;
            this.invoice_journal_name = to_invoice ? this.invoice_journal[1] : false;
        },
        is_to_invoice_factura: function(){
            return this.to_invoice_factura;
        },
        set_to_invoice_boleta: function(to_invoice) {
            this.assert_editable();
            this.to_invoice_factura    = false;
            this.to_invoice_recibo     = false;
            this.to_invoice_boleta = to_invoice;
            this.invoice_journal = to_invoice ? this.journal_id_alt_boleta : false; 
            this.to_invoice = to_invoice;
            this.invoice_journal_name = to_invoice ? this.invoice_journal[1] : false;
        },
        is_to_invoice_boleta: function(){
            return this.to_invoice_boleta;
        },
        set_to_invoice_recibo: function(to_invoice) {
            this.assert_editable();
            this.to_invoice_factura    = false;
            this.to_invoice_boleta     = false;
            this.to_invoice_recibo = to_invoice;
            this.invoice_journal = to_invoice ? this.journal_id_alt_recibo : false; 
            this.to_invoice = to_invoice;
            this.invoice_journal_name = to_invoice ? this.invoice_journal[1] : false;
        },
        is_to_invoice_recibo: function(){
            return this.to_invoice_recibo;
        },
        
        export_as_JSON: function () {
            var json = OrderSuper.prototype.export_as_JSON.apply(this, arguments);
            json['invoice_journal'] = this.invoice_journal[0]
            json['invoice_journal_name'] = this.invoice_journal[1]
            json['date_invoice'] = moment(new Date().getTime()).format('YYYY/MM/DD');
            return json;
        },

        export_for_printing: function(){
            var res = OrderSuper.prototype.export_for_printing.apply(this, arguments);
            res['invoice'] = {
                invoice_journal_name: this.get_journal_name() || 'Ticket POS',
            }
            return res
        },

        get_journal_name: function(){
            return this.invoice_journal_name
        },
    });

})
