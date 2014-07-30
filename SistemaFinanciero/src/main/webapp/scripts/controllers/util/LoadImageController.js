define(['../module'], function (controllers) {
    'use strict';

    controllers.controller('LoadImageController', ['$scope','ConfiguracionService',
        function($scope, ConfiguracionService) {

            $scope.urlBase = ConfiguracionService.getRestApiUrl();
            $scope.idPersona = undefined;
            $scope.tipoImagen = undefined;

            //tipofoto ppuede ser FOTO O FIRMA
            $scope.configImagen = function(id, tipoFoto){
                $scope.tipoImagen = tipoFoto;
                if(!angular.isUndefined(id)){
                    return {
                        singleFile: true,
                        target: $scope.urlBase + 'RestApi/services/personas/naturales/' + id + '/' + tipoFoto
                    }
                } else {
                    return {
                        singleFile: true,
                        target: '/upload'
                    }
                }
            };

            $scope.getImagen = function(id,tipoFoto) {
                if(!angular.isUndefined(id))
                    return $scope.urlBase + "/personas/naturales/" + id + "/" + tipoFoto;
            };

            $scope.$watch("view.id", function(){
                if(!angular.isUndefined($scope.view)){
                    if(!angular.isUndefined($scope.view.id)){
                        $scope.idPersona = $scope.view.id;
                        $scope.$flow.opts.target = $scope.urlBase + '/personas/naturales/' + $scope.idPersona + '/' + $scope.tipoImagen;
                    }
                }
            });

        }]);
});