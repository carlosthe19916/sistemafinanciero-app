define(['./module'], function (services) {
    'use strict';
    services.factory('ConfiguracionService',function(){

        var appName = 'SistemaFinanciero';
        var restApiUrl = 'http://192.168.1.33:8080/RestApi/services';

        return {
            getRestApiUrl: function(){
                return restApiUrl;
            },
            getAppName: function(){
                return appName;
            }
        }
    })
});
