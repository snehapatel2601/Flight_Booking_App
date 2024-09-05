sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/layout/form/SimpleForm",
        "sap/m/Label",
        "sap/m/Dialog",
         "sap/m/Button",
         "sap/m/Input",
    ],
    function(BaseController,MessageToast,SimpleForm,Label,Dialog,Button,Input) {
      "use strict";
  
      return BaseController.extend("admin.flightbooking.controller.App", {
        onInit: function() {
        },

    onPressAddRecord: async function () {
          if (!this.oDialog) {
              this.oDialog = await this.loadFragment({
                  name: "admin.flightbooking.fragment.onAddRecord"
              })
              this.oDialog.open()
          } else {
              this.oDialog.open()
          }
      },
    onCloseDialog: function () {
        let oDialog = this.byId("addRecord");
        oDialog.close();
        console.log("oDialog", oDialog);
    },
    onSubmitAddRecord: async function () {

      try {
          let sFlightNumber = this.byId("FlightNumber").getValue();
          let sSource = this.byId("Source").getValue();
          let sDestination = this.byId("Destination").getValue();
          let sDepartureTime = this.byId("DepartureTime").getValue();
          let sArrivalTime = this.byId("ArrivalTime").getValue();
          let sTicketPrice = this.byId("TicketPrice").getValue();
          let sStatus = this.byId("Status").getValue();

          // ye variables mai values jo user dale ga wo store ho jayega

          // upar wali values ko ek object mai store karenge jismai types db ke hisab bhejenge
          let Flight_data = {
            FlightNumber: sFlightNumber,
            Source: sSource,
            Destination: sDestination,
            DepartureTime: sDepartureTime,
            ArrivalTime: sArrivalTime,
            TicketPrice: sTicketPrice,
            Status : sStatus,
            isDeleted: false
          }
          // This will close the dialog box after the click on submit button
          this.onCloseDialog();

          // Getting model of the view
          let oModel = this.getView().getModel();
          // Bindlist is a method to post Data BindList(/pathname or entity)
          let oBinding = oModel.bindList("/Flight");
          // Create is a function to add data into table
          await oBinding.create(Flight_data);
          MessageToast.show("succesfull submitted!")
          oModel.refresh();

      } catch (error) {
          MessageToast.show(error);
          
      }
  },
  onPressUpdate : function(){
    try {
        let oTable = this.byId("flightTable");
        let oSelectedItem = oTable.getSelectedItem();
    
        if (!oSelectedItem) {
            // If no row is selected, show a message toast and return
            MessageToast.show("Please select a flight to update.");
            return;
        }
    
        let selectedRow = oSelectedItem.getBindingContext().getObject();
        console.log("Selected row", selectedRow);
    
        let flightDataModel = this.getView().getModel();
    
        let sFlightID = selectedRow.FlightID;
        let sFlightNumber = selectedRow.FlightNumber;
        let sSource = selectedRow.Source;
        let sDestination = selectedRow.Destination;
        let sArrivalTime = selectedRow.ArrivalTime;
        let sDepartureTime = selectedRow.DepartureTime;
        let sTicketPrice = selectedRow.TicketPrice;
        let sStatus = selectedRow.Status;
    
        let oForm = new SimpleForm({
            content: [
                new Label({ text: "ID" }),
                new Input({ id: this.createId("updateFlightID"), value: sFlightID, editable: false }),
                new Label({ text: "Flight Number" }),
                new Input({ id: this.createId("updateFlightNumber"), value: sFlightNumber }),
                new Label({ text: "Source" }),
                new Input({ id: this.createId("updateSource"), value: sSource }),
                new Label({ text: "Destination" }),
                new Input({ id: this.createId("updateDestination"), value: sDestination }),
                new Label({ text: "Arrival Time" }),
                new Input({ id: this.createId("updateArrivalTime"), value: sArrivalTime }),
                new Label({ text: "Departure Time" }),
                new Input({ id: this.createId("updateDepartureTime"), value: sDepartureTime }),
                new Label({ text: "Ticket Price" }),
                new Input({ id: this.createId("updateTicketPrice"), value: sTicketPrice }),
                new Label({ text: "Status" }),
                new Input({ id: this.createId("updateStatus"), value: sStatus }),
            ]
        });
    
        let updateDialog = new Dialog({
            title: "Update Flight Details",
            content: oForm,
            beginButton: new Button({
                text: "Save",
                type: "Emphasized",
                press: async function () {
                    try {
                        let uFlightID = this.byId("updateFlightID").getValue();
                        let uFlightNumber = this.byId("updateFlightNumber").getValue();
                        let uSource = this.byId("updateSource").getValue();
                        let uDestination = this.byId("updateDestination").getValue();
                        let uArrivalTime = this.byId("updateArrivalTime").getValue();
                        let uDepartureTime = this.byId("updateDepartureTime").getValue();
                        let uTicketPrice = this.byId("updateTicketPrice").getValue();
                        let uStatus = this.byId("updateStatus").getValue();
    
                        let oBinding = flightDataModel.bindList("/Flight");
                        await oBinding.requestContexts().then(function (aContexts) {
                            let flightUpdated = false;
    
                            for (let i = 0; i < aContexts.length; i++) {
                                if (aContexts[i].getProperty("FlightID") === uFlightID) {
                                    aContexts[i].setProperty("FlightNumber", uFlightNumber);
                                    aContexts[i].setProperty("Source", uSource);
                                    aContexts[i].setProperty("Destination", uDestination);
                                    aContexts[i].setProperty("ArrivalTime", uArrivalTime);
                                    aContexts[i].setProperty("DepartureTime", uDepartureTime);
                                    aContexts[i].setProperty("TicketPrice", uTicketPrice);
                                    aContexts[i].setProperty("Status", uStatus);
                                    flightUpdated = true;
                                    break;
                                }
                            }
    
                            if (flightUpdated) {
                                MessageToast.show("Flight details updated successfully.");
                            } else {
                                MessageToast.show("Failed to update flight details.");
                            }
                        });
    
                        updateDialog.close();
                        updateDialog.destroy();
                        flightDataModel.refresh();
    
                    } catch (error) {
                        console.error("Error updating flight details:", error);
                        MessageToast.show("An error occurred while updating flight details.");
                    }
                }.bind(this)
            }),
            endButton: new Button({
                text: "Close",
                type: "Back",
                press: function () {
                    updateDialog.close();
                    updateDialog.destroy();
                }
            })
        });
    
        updateDialog.open();
    
    } catch (error) {
        console.error("Error initializing update dialog:", error);
        MessageToast.show("An error occurred while initializing the update dialog.");
    }
    
  },
  onDeleteFlight: async function () {
   
    try {
        // Get the selected row from the table
        let oTable = this.byId("flightTable");
        let selectedItem = oTable.getSelectedItem();
        
        if (!selectedItem) {
            sap.m.MessageToast.show("No flight selected.");
            return;
        }

        
        // Retrieve the selected row's binding context and object
        let selectedRow = selectedItem.getBindingContext().getObject();
        let flightDataModel = this.getView().getModel();

        let sFlightID = selectedRow.FlightID;
        let isDeleted = true;

        
        // Bind the list to the model and request contexts
        let oBinding = flightDataModel.bindList("/Flight");
        let aContexts = await oBinding.requestContexts();

        // Loop through contexts to find and update the flight
        for (let i = 0; i < aContexts.length; i++) {
            if (aContexts[i].getProperty("FlightID") === sFlightID) {
                // Update the property to mark as deleted
                aContexts[i].setProperty("isDeleted", isDeleted);
                break; // Exit loop after updating
            }
        }
       

        // Optionally refresh the model to reflect changes
        flightDataModel.refresh(); // No parameters needed

        sap.m.MessageToast.show("Flight marked as deleted.");

    } catch (oError) {
        // Handle and display error
        sap.m.MessageToast.show("Error: " + oError.message);
    }
},
onRestoreFlight: async function () {
    try {
        // Check if the current user is an admin
       
        // Get the selected row from the table
        let oTable = this.byId("flightTable");
        let selectedItem = oTable.getSelectedItem();

        if (!selectedItem) {
            sap.m.MessageToast.show("No flight selected.");
            return;
        }

        // Retrieve the selected row's binding context and object
        let selectedRow = selectedItem.getBindingContext().getObject();
        let flightDataModel = this.getView().getModel();
        let sFlightID = selectedRow.FlightID;
        let isDeleted = false;

        // Bind the list to the model and request contexts
        let oBinding = flightDataModel.bindList("/Flight");
        let aContexts = await oBinding.requestContexts();

        // Loop through contexts to find and update the flight
        for (let i = 0; i < aContexts.length; i++) {
            if (aContexts[i].getProperty("FlightID") === sFlightID) {
                // Update the property to mark as not deleted
                aContexts[i].setProperty("isDeleted", isDeleted);
                break; // Exit loop after updating
            }
        }

        // Refresh the model to reflect changes
        flightDataModel.refresh();

        sap.m.MessageToast.show("Flight restored successfully.");

    } catch (oError) {
        // Handle and display error
        sap.m.MessageToast.show("Error: " + oError.message);
    }
},

      });
    }
  );