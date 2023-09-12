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

    return Controller.extend("itiproject.controller.View2", {
      onInit: function () {

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("View2").attachPatternMatched(this._onRouteMatched, this);
        oRouter.initialize();

      },

      _onRouteMatched: function (oEvent) {

        var oGlobalModel = this.getOwnerComponent().getModel("GlobalProduct");
        var bid_num = oGlobalModel.getProperty("/bidNumber");
        var DataModel = new sap.ui.model.json.JSONModel({
          Data: [],
          totalSum: 0,
        });
        this.getView().setModel(DataModel, "ProductsDetails");
        this.call_get_by_bid_number(bid_num);
        //  var oGlobalModel = this.getOwnerComponent().getModel("GlobalProduct");
        //  var bid_num = oGlobalModel.getProperty("/bidNumber");
        DataModel = this.getView().getModel("ProductsDetails");
        var globalData = oGlobalModel.getProperty("/dataModel");
        var existingData = DataModel.getProperty("/Data");

        var totalSum = 0;
        console.log(globalData);
        globalData.forEach(function (item) {
          existingData.push(item);
        });

        var aFilteredData = existingData.filter(function (oRow) {
          return oRow.ZbidNumberIti !== undefined && oRow.ZbidNumberIti !== null;
        });

        aFilteredData.forEach(function (item) {
          totalSum += parseInt(item.ZtotalPrice);

        });
        DataModel.setProperty("/Data", existingData);
        DataModel.setProperty("/totalSum", Number(totalSum).toLocaleString());
        console.log(existingData);
        this.getView().setModel(DataModel, "ProductsDetails");
      },


      // _onRouteMatched: function (oEvent) {
      //     var that = this;
      //     var oGlobalModel = this.getOwnerComponent().getModel("GlobalProduct");
      //     var bid_num = oGlobalModel.getProperty("/bidNumber");
      //     var DataModel = new sap.ui.model.json.JSONModel({
      //         Data: [],
      //         totalSum: 0,
      //     });
      //     this.getView().setModel(DataModel, "ProductsDetails");

      //     // הפרומיס שמחכה לקריאה לסרבר
      //     var serverCallPromise = new Promise(function (resolve, reject) {
      //         that.call_get_by_bid_number(bid_num, resolve, reject);
      //     });

      //     // כאשר הפרומיס שמחכה לקריאה לסרבר מושלם, תמשיך עם הקוד הבא
      //     serverCallPromise.then(function () {
      //         var DataModel = that.getView().getModel("ProductsDetails");
      //         var globalData = oGlobalModel.getProperty("/dataModel");
      //         var existingData = DataModel.getProperty("/Data");
      //         var totalSum = 0;
      //         console.log("globalData");
      //         globalData.forEach(function (item) {
      //             existingData.push(item);
      //         });

      //         var aFilteredData = existingData.filter(function (oRow) {
      //             return oRow.ZbidNumberIti !== undefined && oRow.ZbidNumberIti !== null;
      //         });

      //         aFilteredData.forEach(function (item) {
      //             totalSum += parseInt(item.ZtotalPrice);
      //         });
      //         DataModel.setProperty("/Data", existingData);
      //         DataModel.setProperty("/totalSum", Number(totalSum).toLocaleString());
      //         console.log(existingData);
      //         that.getView().setModel(DataModel, "ProductsDetails");
      //     }).catch(function (error) {
      //         // טפל בשגיאה אם קרתה שגיאה בקריאה לסרבר
      //         console.error("Error calling server: " + error);
      //     });
      // },

      call_get_by_bid_number: function (bid_num) {
        var that = this;
        var view = this.getView();
        var testModel = this.getOwnerComponent().getModel();
        var aFilters = [new Filter("IvBidNumber", FilterOperator.EQ, bid_num)];
        //כיצד לשלוח לקראיה בשרת את הפרמטר
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
      // call_get_by_bid_number: function (bid_num, resolve, reject) {
      //   var that = this;
      //   var view = this.getView();
      //   var testModel = this.getOwnerComponent().getModel();
      //   var aFilters = [new Filter("IvBidNumber", FilterOperator.EQ, bid_num)];

      //   // עשה את הקריאה לסרבר כך שתחזיר Promise
      //   return new Promise(function (resolve, reject) {
      //       testModel.read("/get_by_bid_numberSet", {
      //           filters: aFilters,
      //           success: function (data) {
      //               var formattedResults = [];
      //               var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd/MM/yyyy" });
      //               data.results.forEach(function (result) {
      //                   var formattedResult = {
      //                       ZbidNumberIti: result.ZbidNumberIti,
      //                       ZdetailsBidProdNumberIti: result.ZdetailsBidProdNumberIti,
      //                       Zdescription: result.Zdescription,
      //                       ZpricePerOne: Number(result.ZpricePerOne).toLocaleString(),
      //                       Zamount: parseInt(result.Zamount),
      //                       Zdate: oDateFormat.format(result.Zdate),
      //                       ZtotalPrice: Number(result.ZtotalPrice).toLocaleString(),
      //                   }
      //                   formattedResults.push(formattedResult);
      //               });
      //               var oModel = view.getModel("ProductsDetails");
      //               oModel.setProperty("/Data", formattedResults);
      //               oModel.setProperty("/totalSum", Number(data.results[0].EvTotalSum).toLocaleString());
      //               view.setModel("ProductsDetails", oModel);
      //               resolve(); // הצלחה - המידע מסרבר התקבל
      //           },
      //           error: function (error) {
      //               console.error("Error calling server: " + error);
      //               reject(error); // שגיאה - הקריאה לסרבר נכשלה
      //           },
      //       });
      //   });
      // },


      call_delete_line_from_bid: function (oData) {
        var that = this;
        var view = this.getView();
        var testModel = this.getOwnerComponent().getModel();
        //var sPath = "/delete_prod_from_bidSet(LS_DETAILS_PRODUCT='" + oData + "')";       
        testModel.remove("/delete_prod_from_bidSet(LS_DETAILS_PRODUCT='" + oData + "')", {
          method: "DELETE",

          success: function (oData, oResponse) {
            var oModel = view.getModel("ProductsDetails");
            var oSum = oModel.getProperty("/totalSun");
            oSum = oSum - oResponse.ZTOTAL_SUM;
            oModel.setProperty("/totalSum", Number(oSum).toLocaleString());
            console.log("הצלחתי");
          },
          error: function (oError) {
            console.log("error function call_delete_line_from_bid", oError);
            alert("הפונקציה נתקלה בשגיאה לא בוצעה מחיקת מוצר " + oError.message);
          }
        });
      },

      call_save_changes_bid: function (oDetailsTable, oBidModel) {
        var that = this;
        var view = this.getView();
        var oModel = this.getView().getModel();
        var testModel = this.getOwnerComponent().getModel();
        var sPath = "/save_change_in_bidSet(Parameter1='" + oDetailsTable + "',Parameter2='" + oBidModel + "')";
        //  var aFilters = [new Filter("ZBID_NUMBER_ITI", FilterOperator.EQ, "bid_num")];
        //כיצד לשלוח לקראיה בשרת את הפרמטר
        testModel.read("/save_change_in_bidSet(Parameter1='" + oDetailsTable + "',Parameter2='" + oBidModel + "')", {
          //filters: aFilters,
          method: "UPDATE",
          success: function (data) {
            console.log("kkkkkkkkkk");

          },
          error: function (error) {
            console.log("error function call_save_changes_bid");
            alert("הפונקציה נתקלה בשגיאה לא בוצעה שמירת שינויים " + error.message);

          },
        });
      },



      // onButtonPress: function (oEvent) {
      //   var oRouter = this.getOwnerComponent().getRouter();
      //   oRouter.navTo("View3",{bid_num:1000})
      //   //לבדוק איך שולפים את מספר ההזמנה מהשורה הנבחרת

      //     }
      //     ,

      moveToSecScreen() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("View3");
      }
      , deleteLine(event) {
        var oButton = event.getSource();
        var oContext = oButton.getBindingContext("ProductsDetails");
        var oDataModel = oContext.getModel();
        var sPath = oContext.getPath();
        var oData = oDataModel.getProperty(sPath);
        var zbidNumber = oData.ZbidNumberIti;
        var zProdPrice = oData.ZtotalPrice;
        this.call_delete_line_from_bid(oData);
        var that = this;
        var oModel = this.getView().getModel("ProductsDetails");
        var oDataProducts = oModel.getData();
        oDataProducts.totalSum = oDataProducts.totalSum - zProdPrice;
        oModel.setData(oDataProducts);
        this.call_get_by_bid_number(zbidNumber);

      }


      , SaveChanges() {
        var that = this;
        var oModel = that.getView().getModel("ProductsDetails");
        var oDetailsTable = oModel.getProperty("/Data");
        var oBidPrice = oModel.getProperty("/totalSum");
        var oBidNumber = oModel.getProperty("/Data/0/ZBID_NUMBER_ITI");
        var DataModel = new sap.ui.model.json.JSONModel({

          Data: {
            MANDT: "001",
            ZBID_NUMBER_ITI: oBidNumber,
            ZBID_PRICE_ITI: oBidPrice
          }
        });
        var oBidModel = DataModel.getProperty("/Data");

        this.call_save_changes_bid(oDetailsTable, oBidModel);
        this.getView().getModel("ProductsDetails").refresh();

      },
      onAmountChange: function (event) {
        console.log("פונקציית כמות")
        var newValue = event.getParameter("value");
        var oInput = event.getSource();
        var oBindingContext = oInput.getBindingContext("ProductsDetails");
        var oModel = oBindingContext.getModel();
        var sPath = oBindingContext.getPath();
        var oData = oModel.getProperty(sPath);
        oData.ZtotalPrice = Number(parseFloat(oData.ZpricePerOne.replace(/,/g, '')) * newValue).toLocaleString();
        oModel.setProperty(sPath, oData);
        this.getView().setModel(oModel, "ProductsDetails");
        this.calcTotalSum();
      },
      calcTotalSum: function () {
        var oData = this.getView().getModel("ProductsDetails").getProperty("/Data");
        var oTotal = 0;
        oData.forEach(function (item) {
          oTotal += parseFloat(item.ZtotalPrice.replace(/,/g, ''));
        });
        var oModel = this.getView().getModel("ProductsDetails");
        oModel.setProperty("/totalSum", oTotal.toLocaleString());
        this.getView().setModel(oModel, "ProductsDetails");

      }
    });
  });


