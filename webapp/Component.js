/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "itiproject/model/models"
],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("itiproject.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                var oModel = new sap.ui.model.json.JSONModel(

                );


                this.setModel(oModel, "GlobalProduct");
                this.getModel("GlobalProduct").setProperty("/dataModel", []);
                this.getModel("GlobalProduct").setProperty("/selectedProducts", []);
                this.getModel("GlobalProduct").setProperty("/bidNumber", 0);
                sap.ui.getCore().getEventBus().subscribe("GlobalModelChannel", "DataUpdated", this.handleDataUpdated, this);

            }
            , handleDataUpdated: function (channel, event, data) {

                var oModel = this.getModel("GlobalProduct");
                var updatedData = oModel.getProperty("/dataModel");


                sap.ui.getCore().getEventBus().publish("YourCustomChannel", "DataChanged", { data: updatedData });
            }

        });
    }
);