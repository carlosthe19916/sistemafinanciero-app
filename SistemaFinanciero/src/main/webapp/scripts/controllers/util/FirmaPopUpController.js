define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('FirmaPopUpController', ['$scope','$modalInstance', 'idPersonas', 'nombres','ConfiguracionService',
        function($scope,$modalInstance, idPersonas, nombres, ConfiguracionService) {

            $scope.idPersonas = idPersonas;
            $scope.nombres = nombres;

            $scope.getUrlFirma = function(index) {
                return ConfiguracionService.getRestApiUrl()+"/services/personaNatural/"+$scope.idPersonas[index]+"/firma";
            };
            $scope.getNombre = function(index){
                return $scope.nombres[index];
            };

            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
});