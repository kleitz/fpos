cordova.define("cordova-plugin-poshw.PosHw", function(require, exports, module) {
/*global cordova:false, module:false*/

module.exports = {
    
    getStatus: function(successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "PosHw", "getStatus", []);
    },
        
    printHtml: function(html, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "PosHw", "printHtml", [html]);
    },
    
    scaleInit: function(price, tara, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "PosHw", "scaleInit", [price, tara]);
    },
    
    scaleRead: function(successCallback, errorCallback ) {
        cordova.exec(successCallback, errorCallback, "PosHw", "scaleRead", []);
    },
    
    display: function(lines, successCallback, errorCallback ) {
        cordova.exec(successCallback, errorCallback, "PosHw", "display", [lines]);
    },
    
    openCashDrawer: function(successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "PosHw", "openCashDrawer", []);
    },
    
    test: function(successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "PosHw", "test", []);
    },
    
    provisioning: function(successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "PosHw", "provisioning", []);
    }    
};
});
