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
                //For more information, visit https://1dsag.github.io/UI5-Best-Practice/design-guidelines/ 

                // this.getRouter().getRoute("MainPage").attachPatternMatched(this._onObjectMatched, this);
            },
            _onObjectMatched: function()
            {
                var oList = this.getView().byId("ListItem");

                this._setBindingModel(oList, data);
            },


            _bindingItems: function(ListItem, data)
            {
                var oitemModel = new JSONModel();
                oitemModel.setSizeLimit(data.length);
                oitemModel.setData(data);
                // oitemModel.setProperty('/PickingListModel', arrPickRQListData);  // use this way when like this items ="{/PickingListModel}"
                ListItem.setModel(oitemModel);
            }
           
        });
    });
