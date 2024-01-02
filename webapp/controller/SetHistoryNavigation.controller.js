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
                
                // Initialize calling the function 
                this._ShellUIService();
            },

            /*
                This controller file is used to 'Hardcode' the SAP Back function where it should go instead of using window history
                function to navigate.
                - because most of the time navigate to the wrong page, so come out with this

                this one need to set it inside the manifest.json and 1st controller file or component js 
            */

            /* 1. Step inside the manifest.json
                Add this services inside the sap.ui5": {}, after the dependencies{} 
                i. 
                "services": {        
                    "ShellUIService": {
                        "factoryName": "sap.ushell.ui5service.ShellUIService"
                    }
                },

                ii. Add the View Level inside the routing Targets example like below
                "ListingPage": {
                    "viewType": "XML",
                    "transition": "slide",
                    "clearControlAggregation": false,
                    "viewId": "ListingPage",
                    "viewName": "ListingPage",
                    "viewLevel": 2
                }
            */

            //2nd Step 
            _ShellUIService: function()
            {
                var t = this;
                this.getOwnerComponent().getService("ShellUIService").then(function(oShellService) {
                    oShellService.setBackNavigation(function(oEvt)
                    {
                        t.setBackNavigation();
                    });
                }); 
            },

            setBackNavigation: function()
            {
                var t = this;

                var lv_view_level = this.getOwnerComponent().getRouter().getTargetHandler()._iCurrentViewLevel; // get the current page 

                /* Example this one code 
                    if(lv_view_level == 1){
                        var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");  
                        oCrossAppNavigator.toExternal({  
                            target: { semanticObject : "#"}  
                        }); 
                    }

                    1. if the current page is 1st page (View Level: 1) (determine by the View Level in manifest.json )
                    when click the Back button beside the SAP Icon, it back to Fiori menu launchpad
                    
                    2. if current page is 2nd page, click back redirect to 1st page (Main Page)
                */
                if(lv_view_level == 1){
                    var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");  
                    oCrossAppNavigator.toExternal({  
                        target: { semanticObject : "#"}  
                    }); 
                }
                else if(lv_view_level == 2){
                    // this.getOwnerComponent().getRouter().getTargets().display("TargetMainPage");
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(t);
                    oRouter.navTo("MainPage");
                }
                else if(lv_view_level == 3){
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(t);
                    oRouter.navTo("ListingPage");
                }
            },
            
        });
    });