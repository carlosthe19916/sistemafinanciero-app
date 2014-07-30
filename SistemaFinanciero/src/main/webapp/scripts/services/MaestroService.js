define(['./module'], function (services) {
    'use strict';
    services.factory("MaestroService",["Restangular",
        function(Restangular){
            var tipoPersonas= [{"denominacion":"NATURAL"},{"denominacion":"JURIDICA"}];

            return {
                getTipoPersonas: function(){
                    return tipoPersonas;
                },


                getEstadosciviles: function() {
                    return Restangular.all("estadosCiviles").getList();
                },
                getSexos: function() {
                    return Restangular.all("sexos").getList();
                },
                getTipoDocumentoPN: function() {
                    return Restangular.all("tipoDocumentos/personas/naturales").getList();
                },
                getTipoDocumentoPJ: function() {
                    return Restangular.all("tipoDocumentos/personas/juridicas").getList();
                },
                getTiposEmpresa: function() {
                    return Restangular.all("tiposEmpresa").getList();
                },
                getPaises: function() {
                    return Restangular.all("paises").getList();
                },
                getPaisByAbreviatura: function(abreviatura) {
                    return Restangular.one("paises/abreviatura/"+abreviatura).get();
                },
                getPaisByCodigo: function(codigo) {
                    return Restangular.one("paises/codigo/"+codigo).get();
                },

                getDepartamentos: function() {
                    return Restangular.all("ubigeo/departamentos").getList();
                },
                getProvinciasByCodigo: function(codigoDepartamento) {
                    return Restangular.all("ubigeo/provincias").getList({codigoDepartamento:codigoDepartamento},{});
                },
                getDistritosByCodigo: function(codigoDepartamento, codigoProvincia) {
                    return Restangular.all("ubigeo/distritos").getList({codigoDepartamento:codigoDepartamento, codigoProvincia:codigoProvincia},{});
                }
            }
        }])
});
