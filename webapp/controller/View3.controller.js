sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",

],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, Filter, FilterOperator, JSONModel) {
    "use strict";

    return Controller.extend("itiproject.controller.View3", {
      onInit: function () {
        var oController = this;
        var oRouter = sap.ui.core.UIComponent.getRouterFor(oController);
        oRouter.attachRoutePatternMatched(this._onRouteMatched, this);


      },

      _onRouteMatched: function (oEvent) {
        var oModel = new sap.ui.model.json.JSONModel({
          Data: []
        });
        this.getView().setModel(oModel, "ProductsInStore");
        this.callGetAllProducts();
      },
      callGetAllProducts: function () {
        var that = this;
        var testModel = this.getOwnerComponent().getModel();
        var view = this.getView();
        testModel.read("/get_all_productsSet", {
          success: function (data) {
            var formattedResults = [];
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });


            data.results.forEach(function (result) {
              var formattedResult = {
                ZprodNumberIti: result.ZprodNumberIt,
                ZprodDescriptionIti: result.ZprodDescriptionIti,
                ZprodPriceIti: Number(result.ZprodPriceIti).toLocaleString(),
                ZprodIsExistsIti: result.ZprodIsExistsIti
              }
              formattedResults.push(formattedResult);
            });
            var oModel = view.getModel("ProductsInStore");
            oModel.setProperty("/Data", formattedResults);
            view.setModel("ProductsInStore", oModel);
          },
          error: function (error) { },
        });

      },


      AddForBag(event) {
        var oButton = event.getSource();
        var oContext = oButton.getBindingContext("ProductsInStore");
        var oDataModel = oContext.getModel();
        var sPath = oContext.getPath();
        var oData = oDataModel.getProperty(sPath);
        var oGlobalModel = this.getOwnerComponent().getModel("GlobalProduct");

        // שליפת המערך מהמודל
        var dataModel = oGlobalModel.getProperty("/dataModel");
        var bid_num = oGlobalModel.getProperty("/bidNumber");

        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd.MM.yyyy" });

        var newObject = {
          "ZbidNumberIti": bid_num,
          "ZdetailsBidProdNumberIti": Number(oData.ZprodNumberIti).toLocaleString(),
          "Zdescription": oData.ZprodDescriptionIti,
          "ZpricePerOne": Number(oData.ZprodPriceIti).toLocaleString(),
          "Zamount": 1,
          "Zdate": oDateFormat.format(new Date()),
          "ZtotalPrice": Number(oData.ZprodPriceIti).toLocaleString(),

        }


        dataModel.push(newObject);
        oGlobalModel.setProperty("/dataModel", dataModel);
        this.getOwnerComponent().setModel(oGlobalModel, "GlobalProduct");
        console.log("לחצת על הוספה לסל ");
      },

      onButtonPress: function (oEvent) {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("View2")
      }
      ,
      moveToSecScreen() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("View2");
      },
      onButtonPress: function (oEvent) {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("View4")


      }
      ,



      moveToSecScreen4() {

        var oView = this.getView();
        var oTable = oView.byId("productsTable");
        var aSelectedItems = oTable.getItems().filter(function (oItem) {
          var oCheckBox = oItem.getCells()[0];
          return oCheckBox.getSelected();
        });
        var aSelectedProducts = [];
        aSelectedItems.map(function (oItem) {
          var item = {

            ZprodNumberIti: oItem.getCells()[1].getNumber(), // הגע ל-ObjectNumber בתוך ה-cells של ה-row וקבל את המספר
            ZprodDescriptionIti: oItem.getCells()[2].getText(), // הגע ל-ObjectIdentifier בתוך ה-cells של ה-row וקבל את התיאור
            ZprodPriceIti: oItem.getCells()[3].getNumber(), // הגע ל-ObjectNumber בתוך ה-cells של ה-row וקבל את המחיר

          };
          aSelectedProducts.push(item);
        })

        var oModel = this.getOwnerComponent().getModel("GlobalProduct");
        oModel.setProperty("/selectedProducts", aSelectedProducts);
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("View4");

      }

    });
  });


