define(['../module'], function (controllers) {
    'use strict';
    controllers.controller("BuscarSocioController", ['$scope','$state','$timeout','focus','SocioService','RedirectService',
        function($scope,$state,$timeout,focus,SocioService,RedirectService) {

            $scope.focusElements = {
                filterText: 'focusFilterText'
            };
            $scope.setInitialFocus = function($event){
                if(!angular.isUndefined($event))
                    $event.preventDefault();
                focus($scope.focusElements.filterText);
            };
            $scope.setInitialFocus();

            $scope.view = {
                busquedaAvanzada: true
            };

            $scope.changeStateBusquedaAvanzada = function(){
                $scope.view.busquedaAvanzada = !$scope.view.busquedaAvanzada;
                if($scope.view.busquedaAvanzada){
                    $scope.searchOptions.estadoCuentaAporte = true;
                    $scope.searchOptions.estadoSocio = true;
                }
            };
            $scope.searchOptions = {
                estadoCuentaAporte: true,
                estadoSocio: true
            };

            $scope.nuevo = function(){
                RedirectService.limpiar();
                $state.transitionTo("app.socio.crearSocio");
            };

            $scope.editSocio = function(row){
                RedirectService.limpiar();
                $state.transitionTo("app.socio.panelSocio", { id: row.id });
            };

            $scope.sociosList = [];

            $scope.filterOptions = {
                filterText: "",
                useExternalFilter: true
            };
            $scope.totalServerItems = 0;
            $scope.pagingOptions = {
                pageSizes: [10, 20, 40],
                pageSize: 10,
                currentPage: 1
            };
            $scope.setPagingData = function(data, page, pageSize){
                $scope.sociosList = data;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            $scope.getDesde = function(){
                return ($scope.pagingOptions.pageSize*$scope.pagingOptions.currentPage)-$scope.pagingOptions.pageSize;
            };
            $scope.getHasta = function(){
                return $scope.pagingOptions.pageSize;
            };

            //cargar datos por primera vez
            $scope.getPagedDataInitial = function () {
                $scope.pagingOptions.currentPage = 1;
                SocioService.getSocios($scope.searchOptions.estadoCuentaAporte, $scope.searchOptions.estadoSocio, $scope.getDesde(), $scope.getHasta()).then(function(data){
                    $scope.sociosList = data;
                    $scope.setPagingData($scope.sociosList, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                });
                SocioService.count().then(function(data){
                    $scope.totalServerItems = data;
                });
            };
            $scope.getPagedDataInitial();

            //buscar con enter
            $scope.getPagedDataSearched = function () {
                if ($scope.filterOptions.filterText) {
                    var ft = $scope.filterOptions.filterText.toUpperCase();
                    SocioService.findByFilterText(ft,$scope.searchOptions.estadoCuentaAporte, $scope.searchOptions.estadoSocio,$scope.getDesde(), $scope.getHasta()).then(function (data){
                        $scope.sociosList = data;
                        $scope.setPagingData($scope.sociosList, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                    });
                    SocioService.count().then(function(data){
                        $scope.totalServerItems = data;
                    });
                } else {
                    $scope.getPagedDataInitial();
                }

                $scope.setInitialFocus();
            };

            $scope.$watch(
                function () {
                    return {
                        currentPage: $scope.pagingOptions.currentPage,
                        pageSize: $scope.pagingOptions.pageSize
                    };
                },
                function (newVal, oldVal) {
                    if (newVal.pageSize !== oldVal.pageSize) {
                        $scope.pagingOptions.currentPage = 1;
                    }
                    if ($scope.filterOptions.filterText) {
                        var ft = $scope.filterOptions.filterText.toUpperCase();
                        SocioService.findByFilterText(ft,$scope.searchOptions.estadoCuentaAporte, $scope.searchOptions.estadoSocio, $scope.getDesde(), $scope.getHasta()).then(function(data){
                            $scope.sociosList = data;
                            $scope.setPagingData($scope.sociosList, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        });
                    } else {
                        SocioService.getSocios($scope.searchOptions.estadoCuentaAporte, $scope.searchOptions.estadoSocio,$scope.getDesde(), $scope.getHasta()).then(function(data){
                            $scope.sociosList = data;
                            $scope.setPagingData($scope.sociosList, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        });
                    }
                },true);

            $scope.gridOptions = {
                data: 'sociosList',
                multiSelect: false,
                enablePaging: true,
                showFooter: true,
                totalServerItems: 'totalServerItems',
                pagingOptions: $scope.pagingOptions,
                filterOptions: $scope.filterOptions,
                columnDefs: [
                    {field:'id', displayName:'C. SOCIO', width:80},
                    {field:'tipoDocumento', displayName:'T. DOC.',width:60},
                    {field:'numeroDocumento', displayName:'Nº DOCUMENTO',width:100},
                    {field:'tipoPersona', displayName:'PERSONA',width:80},
                    {field:'socio', displayName:'SOCIO'},
                    {displayName: 'Nº CTA APORTE', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center; width: 100%;"><span ng-show="row.entity.numeroCuentaAporte">{{row.entity.numeroCuentaAporte}}</span><span ng-hide="row.entity.numeroCuentaAporte">NO REGISTRADO</span></div>', width:110},
                    {displayName: 'ESTADO', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><span ng-show="row.entity.estado">ACTIVO</span><span ng-hide="row.entity.estado">INACTIVO</span></div>', width:70},
                    {field:"fechaAsociado | date:'dd-MM-yyyy'", displayName:'F. ASOCIADO',width:90},
                    {displayName: 'Edit', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><button type="button" class="btn btn-info btn-xs" ng-click="editSocio(row.entity)"><span class="glyphicon glyphicon-share"></span>Editar</button></div>', width:"7%"}
                ]
            };


        }]);
});