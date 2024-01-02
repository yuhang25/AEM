sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("samplecode.controller.App", {
            onInit: function () {

            },

            /* there are two ways of binding (set) data to the value help

                1. directly bind it to the fragment value help -- can refer to the value help fragment how to directly binding, 
                                                                  but need to have open fragment coding
                2. can be done in the controller, may follow the below code
            */
            
            
            /* Example of this Input (view)
                <Input id="WarehouseOrderInput" showValueHelp="true" value="" valueHelpRequest="WarehouseOrderVHelp"/>
                1. showValueHelp - show the value help inside the input
                2. now the we do the logic on the valueHelpRequest function, mean that when user click the value help, it will
                   trigger the value help function (WarehouseOrderVHelp)
            */

            // 1st Solution - just need to open the fragment
            //WarehouseOrderVHelp Value Help function
            WarehouseOrderVHelp: function(oEvent)
            {
                var t = this;
                var sInputValue = oEvent.getSource().getValue();            // this is the value where 
                t.showDialog(sInputValue, "ewm.zewmzpicking.view.fragments.valuehelp.ActivityAreaVHelp" )
            },
            
            showDialog: function(Input, fragmentName) {
                this.oDialog = sap.ui.xmlfragment(fragmentName, this);
                this.getView().addDependent(this.oDialog);
                this.oDialog.open();
            },


            // 2nd Solution - use controller to bind the data 
            WarehouseOrderVHelp: function()
            {
                this._getWarehouseOrderVHData();
            },
            
            // 2. get the warehouse order data from OData side 
            _getWarehouseOrderVHData: function()
            {
                var t = this;
                var oModel = t.getOwnerComponent().getModel("ZEWM_PICKING_SRV");
                oModel.read('/WarehouseOrderSrhHelpSet', {
                    success: function(oResult)
                    {
                        var results = oResult.results;
                        t._getWarehouseOrderValue(results);
                    }
                });
            },

            //3. bind (set) data into the fragment and open it
            _getWarehouseOrderValue: function(data)
            {
                var t = this;
                var itemModel = new JSONModel();
                itemModel.setSizeLimit(data.length);
                itemModel.setData(data);                //bind (set) the data into the JSON 

                if(!t._WarehouseOrderVHelpDialog)
                {
                    t._WarehouseOrderVHelpDialog = sap.ui.xmlfragment("ewm.zewmzpicking.view.fragments.valuehelp.WarehouseOrderVHelp",t); //initial the fragment page where you want to open the fragment
                    t.getView().addDependent(t._WarehouseOrderVHelpDialog);     //open the fragment
                }
                t._WarehouseOrderVHelpDialog.setModel(itemModel); // model is assigned to dialogue
                t._WarehouseOrderVHelpDialog.setBindingContext(t.getView().getBindingContext());
                t._WarehouseOrderVHelpDialog.setMultiSelect(false);     //if u want set the dialog allow to multiple select, you can set it true
                t._WarehouseOrderVHelpDialog.open();
            }
            
        });
    });
