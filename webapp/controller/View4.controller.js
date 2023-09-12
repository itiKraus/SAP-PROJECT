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

    return Controller.extend("itiproject.controller.View4", {
      onInit: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("View4").attachPatternMatched(this._onRouteMatched, this);
        oRouter.initialize();
      },




      _onRouteMatched: function () {
        var oGlobalModel = this.getOwnerComponent().getModel("GlobalProduct");
        var aSelectedItems = oGlobalModel.getProperty("/selectedProducts");
        var oTotalSum = 0;

        aSelectedItems.forEach(function (item) {
          oTotalSum += parseInt(item.ZprodPriceIti);
        });

        var oModel = new sap.ui.model.json.JSONModel({
          Data: aSelectedItems,
          totalSum: oTotalSum
        });

        this.getView().setModel(oModel, "NewBid");
      },

      moveToSecScreen3() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("View3");
      },


      saveNewBid: function () {
        var oTableData = this.getView().getModel("NewBid").getProperty("/Data");
        let oData = [];
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd.MM.yyyy" });

        oTableData.forEach(function (item) {
          let oEntry = {
            Mandt: "001",
            ZprodNumberIt: item.ZprodNumberIti,
            ZprodDescriptionIti: item.ZprodDescriptionIti,
            ZprodPriceIti: item.ZprodPriceIti,
            ZprodIsExistsIti: item.ZprodIsExists
          }
          oData.push(oEntry);

        })

        this.callCreateBid(oData);

      },

      callCreateBid: function (aEntry) {
        var oModel = this.getView().getModel();
        oModel.create("/create_new_bidSet", aEntry, {
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          success: function (oData, oResponse) {
            alert("נשמרה הצעת מחיר חדשה");
          },
          error: function (oError) {
            alert("לא נשמרה הצעת מחיר חדשה: " + oError.message);
          }
        });

      }
    });
  });


