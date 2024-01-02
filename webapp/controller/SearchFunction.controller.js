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

            // this function when user click enter or search icon to trigger this function 
            // search = onSearch 
            onSearch: function(oEvent)
            {
                var Input = oEvent.getSource().getValue();
                var aFilter = [];
                var oList, oBinding;
                if(Input)
                {
                    var selectFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("PhysicalInventoryDocumentNumber", sap.ui.model.FilterOperator.EQ, Input),
                            // new sap.ui.model.Filter("CountStatusDescription", sap.ui.model.FilterOperator.Contains, Input),
                            // new sap.ui.model.Filter("Reference", sap.ui.model.FilterOperator.Contains, Input),
                            // new sap.ui.model.Filter("DocTypeDescription", sap.ui.model.FilterOperator.Contains, Input)
                        ],
                        and: false
                    });
                    aFilter.push(selectFilter);
                    oList = this.getView().byId("stockCountList");  // change the id based on List or Table Id 
                    oBinding = oList.getBinding("items");
                    oBinding.filter(aFilter);
                }
                else
                {
                    // here is enter empty input, will return all list of record
                    oList = this.getView().byId("stockCountList");
                    oBinding = oList.getBinding("items");
                    oBinding.filter(aFilter);
                }

                // below is to check / debug the filter items -- nothing do with the search function  
                var aFilteredItems = oBinding.getContexts();
                aFilteredItems = oBinding.getCurrentContexts().map(function(oContext) {
                    return oContext.getObject();
                });

            },

            // this livechange code is same with the search function code
            // liveChange = onLiveSearch 
            onLiveSearch: function(oEvent)
            {
                var Input = oEvent.getSource().getValue();
                var aFilter = [];
                var oList, oBinding;
                if(Input)
                {
                    var selectFilter = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter("PhysicalInventoryDocumentNumber", sap.ui.model.FilterOperator.EQ, Input),
                            // new sap.ui.model.Filter("CountStatusDescription", sap.ui.model.FilterOperator.Contains, Input),
                            // new sap.ui.model.Filter("Reference", sap.ui.model.FilterOperator.Contains, Input),
                            // new sap.ui.model.Filter("DocTypeDescription", sap.ui.model.FilterOperator.Contains, Input)
                        ],
                        and: false
                    });
                    aFilter.push(selectFilter);
                    oList = this.getView().byId("stockCountList");  // change the id based on List or Table Id 
                    oBinding = oList.getBinding("items");
                    oBinding.filter(aFilter);
                }
                else
                {
                    // here is enter empty input, will return all list of record
                    oList = this.getView().byId("stockCountList");
                    oBinding = oList.getBinding("items");
                    oBinding.filter(aFilter);
                }

                // below is to check / debug the filter items -- nothing do with the search function  
                var aFilteredItems = oBinding.getContexts();
                aFilteredItems = oBinding.getCurrentContexts().map(function(oContext) {
                    return oContext.getObject();
                });
            }
        });
    });