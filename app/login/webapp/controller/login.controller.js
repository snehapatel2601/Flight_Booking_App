sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/Label",
    "sap/m/Dialog",
     "sap/m/Button",
     "sap/m/Input"
],
function (Controller,MessageToast,SimpleForm,Label,Dialog,Button,Input) {
    "use strict";

    return Controller.extend("login.login.controller.login", {
        onInit: function () {

        },
      
        onSignUp : async function(){
            if (!this.oDialog) {
                this.oDialog = await this.loadFragment({
                    name: "login.login.fragment.signUp"
                })
                this.oDialog.open()
            } else {
                this.oDialog.open()
            }
        },
        onSubmit :async function(){
            try {
                let sUserName = this.byId("ipUserName").getValue();
                let sEmail = this.byId("ipEmail").getValue();
                let sPassword = this.byId("ipPassword").getValue();
                //let sRole = this.byId("ipRole").getValue();
                let oRoleRadioGroup = this.byId("ipRole");
        let sRole = oRoleRadioGroup.getSelectedButton() ? oRoleRadioGroup.getSelectedButton().getText() : null;
      
                // ye variables mai values jo user dale ga wo store ho jayega
      
                // upar wali values ko ek object mai store karenge jismai types db ke hisab bhejenge
                let signUp_data = {
                    UserName: sUserName,
                    Email: sEmail,
                  Password: sPassword,
                  Role: sRole,
                 
                }
                console.log("signup data",signUp_data);
                // This will close the dialog box after the click on submit button
                this.onCloseDialog();
      
                // Getting model of the view
                let oModel = this.getView().getModel();
                // Bindlist is a method to post Data BindList(/pathname or entity)
                let oBinding = oModel.bindList("/Users");
                // Create is a function to add data into table
                await oBinding.create(signUp_data);
                MessageToast.show("succesfull submitted!")
                oModel.refresh();
      
            } catch (error) {
                MessageToast.show(error);
                
            }
        },
        onCloseDialog : function(){
            let oDialog = this.byId("addNewUser");
            oDialog.close();
            console.log("oDialog", oDialog);
        },
        onLogin: async function () {
            try {
                let oModel = this.getView().getModel();
        
                // Fetch input values
                let sUserName = this.byId("usernameInput").getValue();
                let sPassword = this.byId("passwordInput").getValue();
                let sRole = this.byId("passwordInput").getValue();
        
                // Define the filter for the query
                let aFilters = [
                    new sap.ui.model.Filter("UserName", sap.ui.model.FilterOperator.EQ, sUserName),
                    new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, sPassword)
                ];
        
                // Bind the list with filters
                let oBinding = oModel.bindList("/Users", undefined, undefined, aFilters);
        
                // Request the contexts (i.e., the data)
                let aContexts = await oBinding.requestContexts();
        
                // Check if any user matched the criteria
                // if (aContexts.length > 0) {
                //     sap.m.MessageToast.show("Login successful!");
                    
                // } else {
                //     sap.m.MessageToast.show("Invalid username or password.");
                // }

                if (aContexts.length > 0) {
                    let oUserData = aContexts[0].getObject(); // Get user data from the first result
        
                    // Show success message toast
                    sap.m.MessageToast.show("Login successful!");
        
                    // Navigate to the appropriate page after a short delay
                    setTimeout(() => {
                        if (oUserData.Role === "Admin") {
                            sap.ui.core.UIComponent.getRouterFor(this).navTo("adminPage"); // Navigate to Admin page
                        } else if (oUserData.Role === "User") {
                            sap.ui.core.UIComponent.getRouterFor(this).navTo("userPage"); // Navigate to User page
                        } else {
                            sap.m.MessageToast.show("Invalid role assigned.");
                        }
                    }, 500); // Adjust delay if needed
                } else {
                    sap.m.MessageToast.show("Invalid username or password.");
                }
            

            } catch (oError) {
                sap.m.MessageToast.show("Error: " + oError.message);
            }
        }
        
    });
});
