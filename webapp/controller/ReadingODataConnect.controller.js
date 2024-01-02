sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "samplecode/controller/ErrorHandler"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ErrorHandler) {
        "use strict";

        return Controller.extend("samplecode.controller.App", {
            onInit: function () {
                this.ErrorHandler = new ErrorHandler();
                // this.getRouter().getRoute("MainPage").attachPatternMatched(this._onObjectMatched, this);
            },

            // Basic Read Data Strcuture 
            ReadBasicStructure: function()
            {
                var t = this;
                var strModel = t.getOwnerComponent().getModel("modelName");
                strModel.read("/EntityName", {

                    urlParameters: {
                        "$format": "json" 
                    }, 

                    success: function(oResult)
                    {

                    },
                    error: function(oResult)
                    {
                        console.error(oResult);
                    }
                });
            },

            // Read data with Filter Input
            // Sample URL - /sap/opu/odata/scwm/PICKLIST_PAPER_SRV/WarehouseTaskSet?$format=json&$orderby=EWMWarehouseTask asc
            //              &$filter=EWMWarehouse eq '' and WarehouseProcessCategory eq '2' and WarehouseTaskStatus eq ''  

            /* Example of parameters

                var vsorters=[
                    new sap.ui.model.Sorter("EWMWarehouseTask", false)
                ]

                var arrFilter = [];
                var filterColumn;
                filterColumn = new sap.ui.model.Filter("EWMWarehouse", sap.ui.model.FilterOperator.EQ, "WM01");
                arrFilter.push(filterColumn);

                var parameters = {
                    filters: arrFilter,
                    sorters: vsorters,

                    urlParameters: {
                        "$format": "json" 
                    }, 
                }
            */

            _readDataFilter: function(modelName, entityName, paramaters)
            {
                var t = this;
                var success = false;
                var sMessage = [];
                var strModel = t.getOwnerComponent().getModel(modelName);
                return strModel.metadataLoaded().then(() => {
                    return new Promise((resolve, reject) => {
                        var params = {
                            paramaters,

                            success: function(oResult, response)
                            {
                                var jsonData = JSON.parse(JSON.stringify(oResult))
                                resolve(jsonData, {"success": success});
                            },
                            error: function(error, response)
                            {
                                // additional error handling when needed
                                reject(error);

                                sMessage.push(error.responseText); //this one is to handle multiple message, if there is an error in looping
                                t.ErrorHandler.displayError(sMessage)
                            }
                        }
                        strModel.read("/" + entityName, params)
                    });
                });
            },

            // Sample URL - /sap/opu/odata/sap/ZEWM_PICKING_SRV/GetUserWhsFI?UserId='M.ZULOTHMAN'&$format=json
            /* Example of payload
                var sPath = this.getModel().createKey('/PurchaseOrderSet', {
                    PONumber: sPoNumber,
                    POItem: sPoItem,
                    Mode: this._mode,
                    SRItem: sSrItem
			    });

                payload = 
                { 
                    UserId = "'" + M.ZULOTHMAN + "'" 
                } ;
            */

            /* controller calling this function  

                test: async function ()
                {
                    Const data = await this._readDataParameter(modelName, entityName, paramaters, payload)  // you will get the return data
                                    .then( async function (item)
                                    {
                                        await function();
                                        //if you want proceed the following data, can do it here
                                    })   
                }

            */
            _readDataParameter: function(modelName, entityName, paramaters, payload)
            {
                var t = this;
                var sMessage = [];
                var strModel = t.getOwnerComponent().getModel(modelName);
                return strModel.metadataLoaded().then(() => {
                    return new Promise((resolve, reject) => {

                        const key = model.createKey("/" + modelName, payload)
                        
                        var params = {
                            paramaters,
                            success: function(oResult, response)
                            {
                                var jsonData = JSON.parse(JSON.stringify(oResult))
                                resolve(jsonData);
                            },
                            error: function(error, response)
                            {
                                // additional error handling when needed
                                reject(error);

                                sMessage.push(error.responseText); //this one is to handle multiple message, if there is an error in looping
                                t.ErrorHandler.displayError(sMessage)
                            }
                        }
                        strModel.read(key, params)
                    });
                });
            },


          
        });

    });