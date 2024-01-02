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
                // this.getRouter().getRoute("MainPage").attachPatternMatched(this._onObjectMatched, this);
            },
            
            // For more information, visit this URL https://1dsag.github.io/UI5-Best-Practice/performance/async-await.html

            //Posting with the structure (one service only without update to another service) - basic (Parallel)
            /* Example in the payload, it will show the entity only and below will show the set of post structure */

            BasicPostFunction()
            {
                var t = this;
                var arrPost = [];
                delete this.gv_poststructure.__metadata;
                for(var i = 0; i < aFilteredItems.length; i++)
                {
                    t.gv_poststructure.EWMWarehouse         = aFilteredItems[i].EWMWarehouse; 
                    t.gv_poststructure.EWMWarehouseTask     = aFilteredItems[i].EWMWarehouseTask;
                    t.gv_poststructure.Batch                = aFilteredItems[i].Batch;
                    t.gv_poststructure.ActualQuantityInAltvUnit = aFilteredItems[i].TargetQuantityInAltvUnit.toString();
                    t.gv_poststructure.SourceHandlingUnit   =  aFilteredItems[i].SourceHandlingUnit;
                    t.gv_poststructure.DestinationStorageBin = aFilteredItems[i].DestinationStorageBin; 
                    t.gv_poststructure.DestinationHandlingUnit = aFilteredItems[i].DestinationHandlingUnit; 
                    t.gv_poststructure.WarehouseTaskExceptionCode = selectedExecptionCode[i];
                    t.gv_poststructure.Huent                = "";
                    t.gv_poststructure.Huent_man            = true;

                    arrPost = JSON.parse(JSON.stringify( t.gv_poststructure ));
                            
                    var oModel = t.getOwnerComponent().getModel();
                    oModel.create("/WTDetailConfirmSet", arrPost, {
                        success:function(oResult)
                        {
                        
                        },
                        error: function()
                        {

                        }
                    });
                }
            },

            // Posting with import function (Parallel)
            // Example URL: /sap/opu/odata/sap/ZEWM_PICKING_SRV/PickRequestUpdFI?OutboundDelivery='80090317'&$format=json
            PostImportFn: function(outboundDelivery)
            {
                var mParameters = {
                    method: "POST",
                    functionImportName: "PickRequestUpdFI",
                    urlParameters: {
                        OutboundDelivery: outboundDelivery
                    },
                    success: function (oData, response) 
                    {

                    },
                    error: function (oError) 
                    {
                        
                    }
                };
    
                var strCustomModel = this.getOwnerComponent().getModel("ZEWM_PICKING_SRV");
                strCustomModel.callFunction("/PickRequestUpdFI", mParameters);
            },

            // Posting with Sequence (mean must wait for this function complete, then goes for another function)
            PostWithSequence: async function()
            {
                var outboundDeliveryArr = [];
                var index = 0;
                for(var i = 0; i < aSelectedData.length; i++)
                {
                    outboundDeliveryArr.push(aSelectedData[i].OutboundDelivery);
                    var t = this;
                    await this._PostGoodIssue(aSelectedData[i].OutboundDeliveryUUID, aSelectedData[i].OutboundDelivery, outboundDeliveryArr, index, aSelectedData.length)
                        .then(async function(results){
                            
                            if(results)
                            {
                               await t._PostUpdCustomGoodIssue(aSelectedData[index].OutboundDelivery);
                               index = index + 1;
                            }

                        //1. Solution
                        // this._PostGoodIssue(aSelectedData[i].OutboundDeliveryUUID, aSelectedData[i].OutboundDelivery, outboundDeliveryArr, index, aSelectedData.length).then(function(results){
                        
                        // if(index == aSelectedData.length )
                        // {
                        //     t._handlePostUpdateCustomTable(outboundDeliveryArr);
                        // }
                        //End of 1st Solution
                       

                        //this._PostGoodIssue(aSelectedData[i].OutboundDeliveryUUID, aSelectedData[i].OutboundDelivery);
                    });
                }
            },
            //Posting Goods Issue to the backend
            _PostGoodIssue: async function(OutboundDeliveryUuid, OutboundDelivery, outboundDeliveryArr, index, totalRecord)
            {
                var t = this;
                var goodIssueModel = t.getOwnerComponent().getModel("SIMPLE_OUTB_DLV_SRV");

                return goodIssueModel.metadataLoaded().then( function () {
                // var sUrl = "/GoodsIssue?OutboundDeliveryUUID=guid'02c5788e-656a-1ede-94fb-a8bca6eb82ff'";
                    return new Promise(function (resolve, reject) {
                        var mParameters = {
                            method: "POST",
                            functionImportName: "GoodsIssue",
                            urlParameters: {
                                OutboundDeliveryUUID:  OutboundDeliveryUuid // Wrap the GUID in single quotes
                            },
                            success: function (oData, response) {
                                // Handle the success response from the backend
                                MessageToast.show("Goods Issue " + OutboundDelivery + " have been updated successfully");
                                resolve(true);            
                            },
                            error: function (oError) {
                                // Handle the error response from the backend
                                var messageJson = JSON.parse(oError.responseText);
                                var errorDetails = messageJson.error.message.value;
                                MessageToast.show("Error. " + errorDetails);
                            }
                        };
                        goodIssueModel.callFunction("/GoodsIssue", mParameters);
                    });
                });
            },

            _PostUpdCustomGoodIssue: function(OutboundDelivery)
            {
                var t = this;
                t.showBusy();
                var strCustomModel = t.getOwnerComponent().getModel("ZEWM_PICKING_SRV");

                // /sap/opu/odata/sap/ZEWM_PICKING_SRV/PickRequestUpdFI?outboundDelivery='766'&$format=json

                return strCustomModel.metadataLoaded().then( function () {
                    return new Promise(function (resolve, reject) {
                        var mParameters = {
                            method: "POST",
                            functionImportName: "PickRequestUpdFI",
                            urlParameters: {
                                OutboundDelivery: OutboundDelivery
                            },
                            success: function (oData, response) 
                            {
                                t.hideBusy();
                                resolve(oData);
                                MessageToast.show(oData.Message);
                            },
                            error: function (oResult) 
                            {
                                t.hideBusy();
                                var messageJson = JSON.parse(oResult.responseText);
                                var errorDetails = messageJson.error.message.value;
                                MessageToast.show("Error. " + errorDetails);
                            }
                        };
                        strCustomModel.callFunction("/PickRequestUpdFI", mParameters);
                    });
                });
            },
            //End of Posting Sequence
            
            //Another solution to do posting sequence
            AnothPostSequnceWithFnCallBack: function()
            {
                var outboundDeliveryArr = [];
                var index = 0;
                for(var i = 0; i < aSelectedData.length; i++)
                {
                    outboundDeliveryArr.push(aSelectedData[i].OutboundDelivery);
                    //Standard odata allow to post with multiple, but custom is not allow
                    this._PostGoodIssue(aSelectedData[i].OutboundDeliveryUUID, aSelectedData[i].OutboundDelivery, outboundDeliveryArr, index, aSelectedData.length)
                    
                    if(index == aSelectedData.length )
                    {
                        // Update custom
                        t._handlePostUpdateCustomTable(outboundDeliveryArr);
                    }
                }
            },
            _handlePostUpdateCustomTable: function(outboundDeliveryArr)
            {
                var t = this;
                var funcCallback = function(oReturn)
                {
                    if( t.postCounter < outboundDeliveryArr.length )
                    {
                        t._PostUpdateCustomTable(outboundDeliveryArr[t.postCounter] , funcCallback);
                    }
                    else
                    {
                        // here 
                        t.hideBusy();
                    }
                };
    
                this.postCounter = 0;
                this._PostUpdateCustomTable(outboundDeliveryArr[this.postCounter] , funcCallback);
            },

            _PostUpdateCustomTable: function(outboundDelivery, oCallback)
            {
                // Counter callback
                this.postCounter = this.postCounter +1;

                var t = this;
                t.showBusy();
                
                ///sap/opu/odata/sap/ZEWM_PICKING_SRV/PickRequestUpdFI?OutboundDelivery='80090317'&$format=json - version 2 

                
                var mParameters = {
                    method: "POST",
                    functionImportName: "PickRequestUpdFI",
                    urlParameters: {
                        // WarehouseTask:  WarehouseTask // Wrap the warehouse task in single quotes --version 1
                        OutboundDelivery: outboundDelivery
                    },
                    success: function (oData, response) 
                    {
                        MessageToast.show(oData.Message);
                        return oCallback();
                    },
                    error: function (oError) 
                    {
                        return oCallback();
                    }
                };

                var strCustomModel = t.getOwnerComponent().getModel("ZEWM_PICKING_SRV");
                strCustomModel.callFunction("/PickRequestUpdFI", mParameters);
            }
        });

    });
