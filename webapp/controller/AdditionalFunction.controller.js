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
                
            },

            _FilterDataBetweenTwoArrayList: function()
            {
                // arrWHTask = data
                var uniqueRecordsArray = [];

                arrWHTask.forEach(function(record) {
                    var outboundDelivery = record.OutboundDelivery;
                    // Check if the record with this Outbound Delivery is not already in the result array
                    if (!uniqueRecordsArray.some(item => item.OutboundDelivery === outboundDelivery)) {
                        uniqueRecordsArray.push(record);
                    }
                });

                uniqueRecordsArray = uniqueRecordsArray.filter(function (item){
                    return item.OutboundDelivery !== "";
                })

                uniqueRecordsArray = uniqueRecordsArray.filter(function (item){
                    return item.PickRequest !== "";
                })
            },

            // Example of array Filter
            arrayFilter: function()
            {
                uniqueRecordsArray = uniqueRecordsArray.filter(function (item){
                    return item.OutboundDelivery !== item.OutboundDelivery;
                })
            },

            _groupData: function(oItemData, groupCol)
            {
                var groupData = {};
                for(var i = 0; i < oItemData.length; i++)
                {
                    var item = oItemData[i];
                    //var outBoundDelivery = item.OutboundDelivery;

                    if(!groupData[groupCol])
                    {
                        groupData[groupCol] = [];
                    }

                    groupData[groupCol].push(item);
                }

                var groupedArray = [];

                for (var key in groupData) {
                    if (groupData.hasOwnProperty(key)) {
                        var group = groupData[key];
                        groupedArray.push(group);
                    }
                }

                return groupedArray;
            },
            
            _FormatNestedArrayIntoSingleArray: function(NestedArray)
            {
                var singleArray = [];

                //NestedArray like this 0: [0][1]
                if(NestedArray && NestedArray.length > 0)
                {
                    for(var a = 0; a < NestedArray.length; a++)
                    {
                        for(var i = 0; i < NestedArray[a].length; i++)
                        {
                            singleArray.push(NestedArray[a][i]);
                        }
                    }
                    return singleArray;
                }
            }
        });
    });
