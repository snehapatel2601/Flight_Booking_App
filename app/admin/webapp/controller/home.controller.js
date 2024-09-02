sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller,MessageToast) {
    "use strict";

    return Controller.extend("admin.flightbooking.controller.home", {
        onInit: function () {

        },
        postLogin : function(){
            const enterLoginVr = this.getOwnerComponent().getRouter();
            enterLoginVr.navTo("RoutePostLogin");
        },
        enterAdministrator : function(){
            console.log("ha bhai chal ra");
            const enterAdminVr = this.getOwnerComponent().getRouter();
            enterAdminVr.navTo("RouteEnterAdmin");
        }
    });
});
