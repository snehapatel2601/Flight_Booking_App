sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, MessageToast) {
  "use strict";

  return Controller.extend("user.user.controller.BookingHistory", {
      onInit: function () {
       
          // Load the user's booking history when the view is initialized
          this._loadUserBookingHistory();
      },

      _loadUserBookingHistory: function () {
          var oModel = this.getView().getModel(); // Get the OData model
          var oTable = this.byId("bookingHistoryTable"); // Get the booking history table

          // Assuming user ID is stored in a global variable after login
          var sUserID = "0cc979e9-205d-48f1-8ed6-18c1eb5ede46";

          if (!sUserID) {
              MessageToast.show("User is not logged in.");
              return;
          }

          // Create a filter to fetch bookings for the logged-in user
          var aFilters = [
              new Filter("UserID_UserID", FilterOperator.EQ, sUserID)
          ];

          // Bind the table to the Booking entity, filtered by UserID
          oTable.bindItems({
              path: "/Booking",
              template: oTable.getBindingInfo("items").template,
              filters: aFilters
          });
      }
  });
});
