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

                // var date = new Date();
                // console.log("conv", this.formatDateOnly(date));

                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    style: "medium"  // You can use "short", "medium", "long", or "full" for style.
                });
                
                var date = new Date(); // The date you want to format.
                
                var formattedDate = oDateFormat.format(date); // Format the date.
                
                console.log(formattedDate); // Output the formatted date.
                
                // this.getRouter().getRoute("MainPage").attachPatternMatched(this._onObjectMatched, this);
            },
            _onObjectMatched: function()
            {
                
            }
        });
    });
