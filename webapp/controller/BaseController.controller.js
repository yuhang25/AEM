sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/BusyIndicator"
], function(Controller, BusyIndicator) {
    "use strict";

    return Controller.extend("ewm.zewmzpicking.controller.BaseController", {
        /**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
       },

       /**
        * Convenience method for getting the view model by name.
        * @public
        * @param {string} [sName] the model name
        * @returns {sap.ui.model.Model} the model instance
        */
       getModel: function(sName) {
           return this.getView().getModel(sName);
       },

       /**
        * Convenience method for setting the view model.
        * @public
        * @param {sap.ui.model.Model} oModel the model instance
        * @param {string} sName the model name
        * @returns {sap.ui.mvc.View} the view instance
        */
       setModel: function(oModel, sName) {
           return this.getView().setModel(oModel, sName);
       },

       showBusy: function() {
           BusyIndicator.show(0);
       },

       hideBusy: function() {
           BusyIndicator.hide();
       },

       /**
        * Getter for the resource bundle.
        * @public
        * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
        */
       getResourceBundle: function() {
           return this.getOwnerComponent().getModel("i18n").getResourceBundle();
       },

       /**
        * Event handler when the share by E-Mail button has been clicked
        * @public
        */
       onShareEmailPress: function() {
           var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
           sap.m.URLHelper.triggerEmail(
               null,
               oViewModel.getProperty("/shareSendEmailSubject"),
               oViewModel.getProperty("/shareSendEmailMessage")
           );
       },

       //Convert date time to JSON Format pass it to backend
       formatDateToISO: function(d) 
       {
            if(d !== null)
            {    
                var lv_date = new Date(d);

                // console.log("lv_date", lv_date);
                //if date is invalid - assign current date
                if (isNaN(lv_date)) {
                    lv_date = new Date();
                }

                var offsetHours = Math.abs(lv_date.getTimezoneOffset() / 60);

                var lv_month_string = "";
                var lv_return_string = "";
                var lv_date_string = "";
                //var lv_time_string = this.zeroPad(offsetHours, 2) + ":00:00";
                
                var lv_time_string = "00:00:00";
                lv_month_string = lv_date.getMonth() + 1;
                lv_month_string = (parent.parseInt(lv_month_string) < 10 ? '0' + lv_month_string : lv_month_string);
                lv_date_string = lv_date.getFullYear() + '-' + lv_month_string + '-' + (lv_date.getDate() < 10 ? '0' + lv_date.getDate() : lv_date.getDate());

                lv_return_string = lv_date_string +"T"+lv_time_string;

                
            }
            else
            {
                lv_return_string = null;
            }
            return lv_return_string;
       },
       zeroPad: function(num, places) 
       {
         var zero = places - num.toString().length + 1;
         return Array(+(zero > 0 && zero)).join("0") + num;
       },

        onlyUnique: function (value, index, array) {
            return array.indexOf(value) === index;
        },

        integerFormatter: function(value) {
            if (value !== null && value !== undefined) {
              return parseInt(value, 10); // Parse the value as an integer
            }
            return value;
        },

        showDialog: function(Input, fragmentName) {
            this.oDialog = sap.ui.xmlfragment(fragmentName, this);
            this.getView().addDependent(this.oDialog);
            this.oDialog.open();
        },

        formatDateOnly: function(d) 
        {
            if( d !== null ){
                var lv_returned_date = "";
                var date = new Date(d);
                if (!isNaN(date)) {
                    var lv_date = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: 'dd.MM.yyyy',
                        UTC: false
                     });
                    lv_returned_date = lv_date.format(date);
                }
            }
            else
            {
                lv_returned_date = null;
            }
            return lv_returned_date;
        },

        _filterDistinctColumn(array, columnName) {
            const uniqueValues = new Set(); // Use a Set to store unique values
            const result = [];
          
            for (const item of array) {
                const value = item[columnName];
            
                if (!uniqueValues.has(value)) {
                    uniqueValues.add(value); // Add the value to the Set
                    result.push(item); // Push the object to the result array
                }
            }
          
            return result;
        },
        formatCurrency: function(amount, currency)
        {
            // "NumberFormat" required from module "sap/ui/core/format/NumberFormat"
            var oCurrencyFormat = NumberFormat.getCurrencyInstance();
            var value = oCurrencyFormat.format(amount, currency);

            return value;
        },
        formatAmount: function(amount) {
            var oNumberFormat = new Intl.NumberFormat('en-US', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
          
            return oNumberFormat.format(amount);
        },
        /**
		 * Checks if object is undefined
		 * @param {object} oObject - Object to check
		 * @returns {boolean} bDefined - True if object is defined
		 */
		isDefined: function(oObject){
			if(typeof oObject !== 'undefined'){
				return true;
			} else {
				return false;
			}
		},
		
		/**
		 * Checks if string is empty or undefined or null
		 * @param {string} sValue String to be checked
		 * @returns {boolean} Empty flag
		 */
		isEmpty: function(sValue) {
			var bEmpty = false;
			if (sValue === undefined || sValue === null || sValue === "") {
				bEmpty = true;
			}
			return bEmpty;
		},
		
		/**
		 * Checks if string is contained in text
		 * @param {string} sText
		 * @param {string} sSubstring
		 * @returns {boolean} Contains flag
		 */
		containsString: function(sText, sSubstring) {
			var bContains = true;
			if (sText.indexOf(sSubstring) === -1) {
				bContains = false;
			}
			return bContains;
		},
        /**
		 * Checks if elememt is in array
		 * @param {elem} String or number
		 * @param {array} Array of strings or numbers
		 * @returns {boolean} Indicates if elem is in array
		 */
		isInArray: function(elem, array) {
			return array.indexOf(elem) > -1;
		},
        seti18nBundle() {
            // Assuming getModel and getResourceBundle methods exist
            this.i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
          },
        
        geti18nBundle() {
            return this.i18nBundle;
        }
    });
});