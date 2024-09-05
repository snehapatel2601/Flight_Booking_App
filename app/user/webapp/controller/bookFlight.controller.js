//const { array } = require("@sap/cds");

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
        "sap/ui/layout/form/SimpleForm",
        "sap/m/Label",
        "sap/m/Dialog",
         "sap/m/Button",
         "sap/m/Input",
         "sap/ui/model/Filter",
         "sap/ui/model/FilterOperator",
         "sap/ui/core/format/DateFormat"
],
function (Controller,MessageToast,SimpleForm,Label,Dialog,Button,Input,Filter,FilterOperator,DateFormat) {
    "use strict";

    //let loggedinUserID = undefined;
    //let currentUserEmail = undefined;
    return Controller.extend("user.user.controller.bookFlight", {
        onInit: function () {
           
            // After rendering mast chal ra
            this.getView().addEventDelegate({
                onAfterRendering: this._applyFilter.bind(this)
            });
        },
       
// filter apply kar rahe to filter isDeleted true wale records ko 
// Oonly showing flights which are not deleted by admin
        _applyFilter: function() {
            var oTable = this.byId("flightTable");
            if (oTable) {
                var oBinding = oTable.getBinding("items");
        
                if (oBinding) {
                    var oFilter = new sap.ui.model.Filter("isDeleted", sap.ui.model.FilterOperator.EQ, false);
                    oBinding.filter([oFilter]); // Apply the filter
                } else {
                    console.error("Table binding is not yet available.");
                }
            } else {
                console.error("Table not found or binding not set.");
            }
        },
       
        onDateChange: function (oEvent) {
            // Get the DatePicker control
            let oDatePicker = oEvent.getSource();
            // Get the selected date value
            let sSelectedDate = oDatePicker.getValue();
            
            // Log or handle the selected date
            console.log("Selected Date:", sSelectedDate);

            // Perform your custom logic here, e.g., show a toast or validate the date
            if (sSelectedDate) {
               
            } else {
                MessageToast.show("No date selected.");
            }

            // Example: Validate that the selected date is not before today
            let oMinDate = new Date();
            let oSelectedDate = new Date(sSelectedDate);

            if (oSelectedDate < oMinDate) {
                MessageToast.show("Please select future date");
                oDatePicker.setValue(""); // Clear the invalid value
            }
        },
          
        onBookNow: async function () {
               
                // Open the dialog
                if (!this.oDialog) {
                    this.oDialog = await this.loadFragment({
                        name: "user.user.fragment.BookingDialog"
                    });
                    this.oDialog.open();
                } else {
                    this.oDialog.open();
                }
    
                // Optionally, set default values in the dialog based on selected flight details
                // Example: this.byId("passengerName").setValue(this._selectedFlightDetails.FlightNumber);
            },

        onCloseDialog : function(){
            let oDialog = this.byId("addRecord");
            oDialog.close();
            console.log("oDialog", oDialog);
        },

        
        onSubmitAddRecord: async function () {
            try {
                // Get values from input fields
                let spassengerName = this.byId("passengerName").getValue();
                let sphoneNumber = this.byId("phoneNumber").getValue();
                let semail = this.byId("email").getValue();
                let sbookingDate = this.byId("bookingDate").getValue();
        
                // Get selected values from radio buttons
                let oGenderRadioGroup = this.byId("genderRadioGroup");
                let selectedGenderIndex = oGenderRadioGroup.getSelectedIndex();
                let selectedGender = (selectedGenderIndex !== -1) ? oGenderRadioGroup.getButtons()[selectedGenderIndex].getText() : null;
        
                let oClassRadioGroup = this.byId("classRadioGroup");
                let selectedClassIndex = oClassRadioGroup.getSelectedIndex();
                let selectedClass = (selectedClassIndex !== -1) ? oClassRadioGroup.getButtons()[selectedClassIndex].getText() : null;
        
                // Validate all fields
                if (!spassengerName || !sphoneNumber || !semail || !sbookingDate || !selectedGender || !selectedClass) {
                    MessageToast.show("All fields must be filled out.");
                    return; // Stop further execution if validation fails
                }
        
                // Getting models of the view
                let oflightModel = this.getView().getModel(); // flight model
                let ouserModel = this.getView().getModel(); // user model
        
                // Bind list to post data
                let oBinding = oflightModel.bindList("/Flight");
                let oUserBinding = ouserModel.bindList("/Users");
        
                let aContexts = await oBinding.requestContexts();
                let aUserContexts = await oUserBinding.requestContexts();
        
                let sflightid = aContexts[2].getProperty("FlightID");
                let suserid = aUserContexts[0].getProperty("UserID");
        
                let Booking_data = {
                    FlightID_FlightID: sflightid,
                    UserID_UserID: suserid,
                    PassengerName: spassengerName,
                    PhoneNumber: sphoneNumber,
                    Email: semail,
                    Gender: selectedGender,
                    BookingDate: sbookingDate,
                    Class: selectedClass,
                    BookingStatus: "Booked",
                    BookingOrderNumber: this.generateBookingOrderNumber()
                };
        
                console.log(Booking_data);
        
                // Close dialog and refresh model
                this.onCloseDialog();
                let oModel = this.getView().getModel();
                let oBindingBooking = oModel.bindList("/Booking");
                await oBindingBooking.create(Booking_data);
                MessageToast.show("Successfully submitted!");
                oModel.refresh();
        
            } catch (error) {
                MessageToast.show("Error: " + error.message);
            }
        },
        


        generateBookingOrderNumber: function () {
            return 'ORD-' + Math.floor(Math.random() * 1000000); 
        },
        livechangefrom: function(oEvent) {
            var sSource = oEvent.getParameter("value"); // Get value from the Source input field
            var sDestination = this.byId("destinationInput").getValue(); // Get current value of Destination input field
        
            // Call the function to apply filters
            this._applyFilters(sSource, sDestination);
        },
        
        livechangeto: function(oEvent) {
            var sDestination = oEvent.getParameter("value"); // Get value from the Destination input field
            var sSource = this.byId("sourceInput").getValue(); // Get current value of Source input field
        
            // Call the function to apply filters
            this._applyFilters(sSource, sDestination);
        },
        
        // Helper function to apply filters based on Source and Destination
        _applyFilters: function(sSource, sDestination) {
            var oTable = this.byId("flightTable");
            var oBinding = oTable.getBinding("items");
        
            if (!oBinding) {
                sap.m.MessageToast.show("Table binding not found.");
                return;
            }
        
            // Array to store all filters
            var aFilters = [];
        
            // Always apply the 'isDeleted' filter to show non-deleted flights
            aFilters.push(new sap.ui.model.Filter("isDeleted", sap.ui.model.FilterOperator.EQ, false));
        
            // Apply Source filter if not empty
            if (sSource) {
                aFilters.push(new sap.ui.model.Filter("Source", sap.ui.model.FilterOperator.Contains, sSource));
            }
        
            // Apply Destination filter if not empty
            if (sDestination) {
                aFilters.push(new sap.ui.model.Filter("Destination", sap.ui.model.FilterOperator.Contains, sDestination));
            }
        
            // Apply all filters to the table binding
            oBinding.filter(aFilters);
        
            // Check if any items are available after filtering
            oBinding.attachChange(function() {
                var iLength = oBinding.getLength();
                if (iLength === 0) {
                    
                    sap.m.MessageToast.show("The Flights Not available on this route");
                }
            })
            
            
            ;
        }
        
,        

        onSearch: function () {
           var oSourceInput = this.byId("sourceInput");
    var oDestinationInput = this.byId("destinationInput");

    var sSource = oSourceInput.getValue();
    var sDestination = oDestinationInput.getValue();

    var oTable = this.byId("flightTable");
    var oBinding = oTable.getBinding("items");

    if (!oBinding) {
        MessageToast.show("Table binding not found.");
        return;
    }

    // Array to store all filters
    var aFilters = [];

    // Always apply the 'isDeleted' filter to show non-deleted flights
    aFilters.push(new sap.ui.model.Filter("isDeleted", sap.ui.model.FilterOperator.EQ, false));

    // Apply Source and Destination filters if they are not empty
    if (sSource) {
        aFilters.push(new sap.ui.model.Filter("Source", sap.ui.model.FilterOperator.Contains, sSource));
    }

    if (sDestination) {
        aFilters.push(new sap.ui.model.Filter("Destination", sap.ui.model.FilterOperator.Contains, sDestination));
    }

    // Apply all filters to the table
    oBinding.filter(aFilters);
        }
       
    });
});
