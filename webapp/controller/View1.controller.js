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

    return Controller.extend("itiproject.controller.View1", {
      onInit: function () {

        this.callGetBid();

      },



      callGetBid: function () {
        var that = this;
        var oView = that.getView();
        var testModel = this.getOwnerComponent().getModel();
        var aFilters = [new Filter("IvDummy", FilterOperator.EQ, "001")];
        // var oBusyIndicator = oView.byId("busyIndicator");
        //  oBusyIndicator.setVisible(true);
        //  var oBusyIndicatorT = oView.byId("allView");
        //  oBusyIndicatorT.setVisible(false);
        testModel.read("/get_all_bidSet", {
          filters: aFilters,
          success: function (oData) {
            var formattedResults = [];
            oData.results.forEach(function (result) {
              var formattedResult = {
                ZbidNumberIti: result.ZbidNumberIti,
                ZbidPriceIti: Number(result.ZbidPriceIti).toLocaleString()

              }
              formattedResults.push(formattedResult);
            });
            var oDataModel = new sap.ui.model.json.JSONModel({
              Data: formattedResults
            });

            that.getView().setModel(oDataModel, "BidModel");
            //    oBusyIndicator.setVisible(false);
            //   oBusyIndicatorT.setVisible(true);
          },

          error: function (oError) {
            oBusyIndicator.setVisible(false);
            oBusyIndicator.setVisible(true);
          }
        });
      }

      , onListItemPress: function (oEvent) {
        let bid_number = oEvent.getSource().getBindingContext("BidModel").getObject().ZbidNumberIti;
        console.log(bid_number);
        var oGlobalModel = this.getOwnerComponent().getModel("GlobalProduct");
        oGlobalModel.setProperty("/bidNumber", bid_number);
        this.ScreenView2();

      },

      moveToSecondScreen() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("View2");
      },

      ScreenView2() {

        var oGlobalModel = this.getOwnerComponent().getModel("GlobalProduct");
        var bid_num = oGlobalModel.getProperty("/bidNumber");
        var DataModel = new sap.ui.model.json.JSONModel({
          Data: [],
          totalSum: 0,
        });

        this.call_get_by_bid_number(bid_num);
        var oGlobalModel = this.getOwnerComponent().getModel("GlobalProduct");
        var bid_num = oGlobalModel.getProperty("/bidNumber");
        var globalData = oGlobalModel.getProperty("/dataModel");
        var existingData = DataModel.getProperty("/Data");
        var totalSum = 0;
        existingData.forEach(function (item) {
          globalData.push(item);
        });

        var aFilteredData = existingData.filter(function (oRow) {
          return oRow.ZbidNumberIti !== undefined && oRow.ZbidNumberIti !== null;
        });

        aFilteredData.forEach(function (item) {
          totalSum += parseInt(item.ZtotalPrice);

        });

        DataModel.setProperty("/Data", aFilteredData);
        DataModel.setProperty("/totalSum", Number(totalSum).toLocaleString());
        console.log(aFilteredData);
        this.getView().setModel(DataModel, "ProductsDetails");

      },
      call_get_by_bid_number: function (bid_num) {
        var that = this;
        var view = this.getView();
        var testModel = this.getOwnerComponent().getModel();
        var aFilters = [new Filter("IvBidNumber", FilterOperator.EQ, bid_num)];

        testModel.read("/get_by_bid_numberSet", {
          filters: aFilters,
          success: function (data) {
            var formattedResults = [];
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });
            data.results.forEach(function (result) {
              var formattedResult = {
                ZbidNumberIti: result.ZbidNumberIti,
                ZdetailsBidProdNumberIti: result.ZdetailsBidProdNumberIti,
                Zdescription: result.Zdescription,
                ZpricePerOne: Number(result.ZpricePerOne).toLocaleString(),
                Zamount: parseInt(result.Zamount),
                Zdate: oDateFormat.format(result.Zdate),
                ZtotalPrice: Number(result.ZtotalPrice).toLocaleString(),

              }
              formattedResults.push(formattedResult);
            });
            var oModel = view.getModel("ProductsDetails");
            oModel.setProperty("/Data", formattedResults);
            oModel.setProperty("/totalSum", Number(data.results[0].EvTotalSum).toLocaleString());
            view.setModel("ProductsDetails", oModel);
          },
          error: function (error) { },
        });
      },

    });
  });


