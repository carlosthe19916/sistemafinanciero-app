define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('BuscarTransaccionBovedaCajaController', ['$scope', '$state', '$filter','$modal','CajaSessionService',
        function($scope, $state, $filter,$modal, CajaSessionService) {

            $scope.nuevo = function(){
                $state.transitionTo('app.caja.createTransaccionBovedaCaja');
            };

            $scope.loadTransaccionEnviadas = function(){
                CajaSessionService.getTransaccionBovedaCajaEnviadas().then(
                    function(enviados){
                        $scope.transaccionesEnviadas = enviados;
                    }
                );
            };
            $scope.loadTransaccionRecibidas = function(){
                CajaSessionService.getTransaccionBovedaCajaRecibidas().then(
                    function(recibidos){
                        $scope.transaccionesRecibidas = recibidos;
                    }
                );
            };
            $scope.loadTransaccionEnviadas();
            $scope.loadTransaccionRecibidas();

            $scope.gridOptionsRecibidos = {
                data: 'transaccionesRecibidas',
                multiSelect: false,
                columnDefs: [
                    {field:"fecha | date : 'dd/MM/yyyy'", displayName:'Fecha'},
                    {field:"hora | date : 'HH:mm:ss'", displayName:'Hora'},
                    {displayName: 'Estado solicitud', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><span ng-show="row.entity.estadoSolicitud">SOLICITADO</span><span ng-hide="row.entity.estadoSolicitud">NO SOLICITADO</span></div>'},
                    {displayName: 'Estado confirmacion', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><span ng-show="row.entity.estadoConfirmacion">CONFIRMADO</span><span ng-hide="row.entity.estadoConfirmacion">NO CONFIRMADO</span></div>'},
                    {field:"origen", displayName:'Origen'},
                    {field:"monto | currency :''", displayName:'Monto'},
                    {displayName: 'Edit', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><button type="button" class="btn btn-info btn-xs" ng-click="getVoucher(row.entity)"><span class="glyphicon glyphicon-share"></span>Voucher</button>&nbsp;<button type="button" class="btn btn-danger btn-xs" ng-click="confirmarTransaccion(row.entity)"><span class="glyphicon glyphicon-remove"></span>Confirmar</button></div>'}]
            };

            $scope.gridOptionsEnviados = {
                data: 'transaccionesEnviadas',
                multiSelect: false,
                columnDefs: [
                    {field:"fecha | date : 'dd/MM/yyyy'", displayName:'Fecha', width: "10%"},
                    {field:"hora | date : 'HH:mm:ss'", displayName:'Hora', width: "10%"},
                    {displayName: 'Estado solicitud', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><span ng-show="row.entity.estadoSolicitud">SOLICITADO</span><span ng-hide="row.entity.estadoSolicitud">NO SOLICITADO</span></div>'},
                    {displayName: 'Estado confirmacion', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><span ng-show="row.entity.estadoConfirmacion">CONFIRMADO</span><span ng-hide="row.entity.estadoConfirmacion">NO CONFIRMADO</span></div>'},
                    {field:"origen", displayName:'Origen', width: "12%"},
                    {field:"monto | currency :''", displayName:'Monto'},
                    {displayName: 'Edit', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><button type="button" class="btn btn-info btn-xs" ng-click="getVoucher(row.entity)"><span class="glyphicon glyphicon-share"></span>Voucher</button>&nbsp;<button type="button" class="btn btn-danger btn-xs" ng-click="cancelarTransaccion(row.entity)" ng-disabled="getDisabledStateExtornar(row.entity)"><span class="glyphicon glyphicon-remove"></span>Cancelar</button></div>'}]
            };

            $scope.getDisabledStateExtornar = function(row){
                if(row.estadoSolicitud == false)
                    return true;
                if(row.estadoConfirmacion == true)
                    return true;
                return false;
            };

            $scope.getVoucher = function(row){
                $state.transitionTo('app.caja.voucherTransaccionBovedaCaja', { id: row.id });
            };

            $scope.cancelarTransaccion = function(row){
                if(!angular.isUndefined(row)){
                    var modalInstance = $modal.open({
                        templateUrl: 'views/cajero/util/confirmPopUp.html',
                        controller: "ConfirmPopUpController"
                    });
                    modalInstance.result.then(function (result) {
                        CajaSessionService.cancelarTransaccionBovedaCaja(row.id).then(
                            function(data){
                                $scope.loadTransaccionEnviadas();
                            }
                            ,function error(error){
                                $scope.alerts = [{ type: "danger", msg: "Error: " + error.data.message + "."}];
                                $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};
                            }
                        );
                    }, function () {
                    });
                }
            };
            $scope.confirmarTransaccion = function(row){
                if(!angular.isUndefined(row)){
                    var modalInstance = $modal.open({
                        templateUrl: 'views/cajero/util/confirmPopUp.html',
                        controller: "ConfirmPopUpController"
                    });
                    modalInstance.result.then(function (result) {
                        CajaSessionService.confirmarTransaccionBovedaCaja(row.id).then(
                            function(data){
                                $scope.loadTransaccionRecibidas();
                            }
                            ,function error(error){
                                $scope.alerts = [{ type: "danger", msg: "Error: " + error.data.message + "."}];
                                $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};
                            }
                        );
                    }, function () {
                    });
                }
            };

        }]);
});