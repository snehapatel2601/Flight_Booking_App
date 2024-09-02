sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast",
        "sap/ui/layout/form/SimpleForm",
        "sap/m/Label",
        "sap/m/Dialog",
         "sap/m/Button",
         "sap/m/Input"

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
            Status : sStatus
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
    let oTable = this.byId("flightTable");
    let selectedRow = oTable.getSelectedItem().getBindingContext().getObject();
    //console.log("Selected row",selectedRow);
    let flightDataModel= this.getView().getModel();
    
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
          new Input({ id: this.createId("updateFlightID"), value: sFlightID ,editable: false}),
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
      title : "Update Flight Details",
      content : oForm,
      beginButton : new Button({
        text:"save",
        type : "Emphasized",
        press : async function(){
          let uFlightID = this.byId("updateFlightID").getValue();
          let uFlightNumber = this.byId("updateFlightNumber").getValue();
                            let uSource = this.byId("updateSource").getValue();
                            let uDestination = this.byId("updateDestination").getValue();
                            let uArrivalTime = this.byId("updateArrivalTime").getValue();
                            let uDepartureTime = this.byId("updateDepartureTime").getValue();
                            let uTicketPrice = this.byId("updateTicketPrice").getValue();
                            let uStatus = this.byId("updateStatus").getValue();
          let oBinding = flightDataModel.bindList("/Flight");
          await oBinding.requestContexts().then(function(aContexts){
            console.log("shi :",aContexts[0].getProperty("FlightID"));
            for(let i=0;i<aContexts.length;i++){
              if(aContexts[i].getProperty("FlightID")==uFlightID){
                  aContexts[i].setProperty("FlightNumber",uFlightNumber);
                  aContexts[i].setProperty("Source",uSource);
                  aContexts[i].setProperty("Destination",uDestination);
                  aContexts[i].setProperty("ArrivalTime",uArrivalTime);
                  aContexts[i].setProperty("DepartureTime",uDepartureTime);
                  aContexts[i].setProperty("TicketPrice",uTicketPrice);
                  aContexts[i].setProperty("Status",uStatus);
              }
          }
        })
        flightDataModel.refresh();
                            updateDialog.close();
                            updateDialog.destroy();
        }.bind(this)
      }),
      endButton : new Button({
        text : "close",
        type : "Back",
        press : function(){
            updateDialog.close()
        }
    })
    })
    updateDialog.open();

   
  }
      });
    }
  );