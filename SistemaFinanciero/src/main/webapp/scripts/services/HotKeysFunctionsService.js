define(['./module'], function (services) {
    'use strict';
    services.factory("HotKeysFunctionsService",function(){

        var enterFunction = function(){
            console.log("Funcion no definida");
        }

        return {
            getEnterFunction: function(){
                return enterFunction;
            },
            setEnterFunction : function(newFunction){
                enterFunction = newFunction;
            }
        }

    })
});
