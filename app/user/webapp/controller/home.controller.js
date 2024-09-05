sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("user.user.controller.home", {
        onInit: function () {

        },
        enterBookFlight : function(){
            const enterBF = this.getOwnerComponent().getRouter();
            enterBF.navTo("RouteBookFlight");
        },
        enterHistory : function(){
            const enterBH = this.getOwnerComponent().getRouter();
            enterBH.navTo("RouteBookHistory");
        }
    });
});
