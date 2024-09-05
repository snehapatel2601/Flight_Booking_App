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
        validateCode : function(){
            let sCode = this.byId("ipCode").getValue();
            if(sCode==="ADMIN01"){
                MessageToast.show("Validated");
                this.byId("adminRadioButton").setVisible(true);

            }else{
                MessageToast.show("Invalid");
            }

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
        onShowPasswordToggle: function(oEvent) {
            // Get the CheckBox control
            let oCheckBox = oEvent.getSource();
            // Determine if the CheckBox is selected
            let bChecked = oCheckBox.getSelected();
            // Get the password input field
            let oPasswordInput = this.byId("passwordInput");

            // Toggle the type of the password input field
            oPasswordInput.setType(bChecked ? "Text" : "Password");
        },
        onShowCodeToggle: function(oEvent) {
            // Get the CheckBox control
            let oCheckBox = oEvent.getSource();
            // Determine if the CheckBox is selected
            let bChecked = oCheckBox.getSelected();
            // Get the password input field
            let oPasswordInput = this.byId("ipCode");

            // Toggle the type of the password input field
            oPasswordInput.setType(bChecked ? "Text" : "Password");
        },
        onSubmit: async function() {
            try {
                // Retrieve values from input fields
                let sUserName = this.byId("ipUserName").getValue();
                let sEmail = this.byId("ipEmail").getValue();
                let sPassword = this.byId("ipPassword").getValue();
                let oRoleRadioGroup = this.byId("ipRole");
                let sRole = oRoleRadioGroup.getSelectedButton() ? oRoleRadioGroup.getSelectedButton().getText() : null;
        
                // Validate mandatory fields
                if (!sUserName || !sEmail || !sPassword) {
                    // Set value state for input fields to indicate required fields
                    if (!sUserName) this.byId("ipUserName").setValueState("Error").setValueStateText("Username is required.");
                    else this.byId("ipUserName").setValueState("None");
                    
                    if (!sEmail) this.byId("ipEmail").setValueState("Error").setValueStateText("Email is required.");
                    else this.byId("ipEmail").setValueState("None");
                    
                    if (!sPassword) this.byId("ipPassword").setValueState("Error").setValueStateText("Password is required.");
                    else this.byId("ipPassword").setValueState("None");
                    
                    MessageToast.show("Please fill in all mandatory fields.");
                    return; // Exit the function to prevent further execution
                }
        
                // If all mandatory fields are filled, prepare the data object
                let signUp_data = {
                    UserName: sUserName,
                    Email: sEmail,
                    Password: sPassword,
                    Role: sRole
                };
                
                console.log("signup data", signUp_data);
        
                // Close the dialog box
                this.onCloseDialog();
        
                // Get the model of the view and create a new entry
                let oModel = this.getView().getModel();
                let oBinding = oModel.bindList("/Users");
                await oBinding.create(signUp_data);
        
                // Show success message and refresh the model
                MessageToast.show("Successfully submitted!");
                oModel.refresh();
        
            } catch (error) {
                // Show error message if something goes wrong
                MessageToast.show("An error occurred: " + error.message);
            }
        },
        
        onCloseDialog : function(){
            let oDialog = this.byId("addNewUser");
            oDialog.close();
            console.log("oDialog", oDialog);
        },
        onLogin: async function () {
            try {
                // Fetch input values
                let sUserName = this.byId("usernameInput").getValue();
                let sPassword = this.byId("passwordInput").getValue();
        
                // Validate that username and password are not empty
                if (!sUserName || !sPassword) {
                    // Set value state for input fields to indicate required fields
                    if (!sUserName) this.byId("usernameInput").setValueStateText("Username is required.");
                    else this.byId("usernameInput").setValueState("None");
        
                    if (!sPassword) this.byId("passwordInput").setValueStateText("Password is required.");
                    else this.byId("passwordInput").setValueState("None");
        
                    sap.m.MessageToast.show("Please enter both username and password.");
                    return; // Exit the function to prevent further execution
                }
        
                // Define the filter for the query
                let aFilters = [
                    new sap.ui.model.Filter("UserName", sap.ui.model.FilterOperator.EQ, sUserName),
                    new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, sPassword)
                ];
        
                // Get the model of the view
                let oModel = this.getView().getModel();
                
                // Bind the list with filters
                let oBinding = oModel.bindList("/Users", undefined, undefined, aFilters);
                
                // Request the contexts (i.e., the data)
                let aContexts = await oBinding.requestContexts();
        
                if (aContexts.length > 0) {
                    let oUserData = aContexts[0].getObject(); // Get user data from the first result
                    
                    // Show success message toast
                    sap.m.MessageToast.show("Login successful!");
                    
                    // Define application URLs
                    let sAdminAppUrl = "https://port4004-workspaces-ws-mv554.us10.trial.applicationstudio.cloud.sap/admin/webapp/index.html";
                    let sUserAppUrl = "https://port4004-workspaces-ws-mv554.us10.trial.applicationstudio.cloud.sap/user/webapp/index.html";
                    
                    // Navigate to the appropriate application after a short delay
                    setTimeout(() => {
                        if (oUserData.Role === "Admin") {
                            window.location.href = sAdminAppUrl; // Navigate to Admin application
                        } else if (oUserData.Role === "User") {
                            window.location.href = sUserAppUrl; // Navigate to User application
                        } else {
                            sap.m.MessageToast.show("Invalid role assigned.");
                        }
                    }, 10); // Adjust delay if needed
                } else {
                    sap.m.MessageToast.show("Invalid username or password.");
                }
            } catch (oError) {
                sap.m.MessageToast.show("Error: " + oError.message);
            }
        }
        
        
    });
});
