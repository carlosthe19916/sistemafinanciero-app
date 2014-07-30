define(['../module'], function (controllers) {
    'use strict';
    controllers.controller("BuscarSocioPopUpController", ["$scope","$modalInstance","$state","$timeout","focus","SocioService",
        function($scope,$modalInstance,$state,$timeout,focus,SocioService) {

            $scope.focusElements = {
                filterText: 'focusFilterText'
            };
            $scope.setInitialFocus = function($event){
                if(!angular.isUndefined($event))
                    $event.preventDefault();
                $timeout(function() {
                    focus($scope.focusElements.filterText);
                }, 100);
            };
            $scope.setInitialFocus();

            //configurar tabla
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
                return ($scope.pagingOptions.pageSize);
            };

            //eventos

            //cargar datos por primera vez
            $scope.getPagedDataInitial = function () {
                $scope.pagingOptions.currentPage = 1;
                SocioService.getSocios(false, true, $scope.getDesde(), $scope.getHasta()).then(function(data){
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
                    SocioService.findByFilterText(ft, false, true,$scope.getDesde(), $scope.getHasta()).then(function (data){
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
                        SocioService.findByFilterText(ft, false, true, $scope.getDesde(), $scope.getHasta()).then(function(data){
                            $scope.sociosList = data;
                            $scope.setPagingData($scope.sociosList, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        });
                    } else {
                        SocioService.getSocios(false, true, $scope.getDesde(), $scope.getHasta()).then(function(data){
                            $scope.sociosList = data;
                            $scope.setPagingData($scope.sociosList, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                        });
                    }
                },true);


            var gridLayoutPlugin = new ngGridLayoutPlugin();
            $scope.gridOptions = {
                data: 'sociosList',
                selectedItems: [],
                multiSelect: false,
                enablePaging: true,
                showFooter: true,
                totalServerItems: 'totalServerItems',
                pagingOptions: $scope.pagingOptions,
                filterOptions: $scope.filterOptions,
                plugins: [gridLayoutPlugin],
                columnDefs: [
                    {field:"tipoDocumento", displayName:'TIPO DOC.', width:120},
                    {field:"numeroDocumento", displayName:'Nº DOCUMENTO', width:130},
                    {field:"socio", displayName:'SOCIO'}, 
                    {field:"fechaAsociado | date : 'dd/MM/yyyy'", displayName:'FEC. ASOCIADO', width:120},
                    {displayName: 'ESTADO', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><span ng-show="row.entity.estado">ACTIVO</span><span ng-hide="row.entity.estado">INACTIVO</span></div>', width:80},
                    {displayName: 'Select', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><button type="button" class="btn btn-info btn-xs" ng-click="selectSocio(row.entity)"><span class="glyphicon glyphicon-share"></span>Select</button></div>', width:80}
                ]
            };
            $scope.updateGridLayout = function(){
                gridLayoutPlugin.updateGridLayout();
            }
            setTimeout(function () {
                $scope.updateGridLayout();
            }, 500);

            $scope.selectSocio = function(row){
                $scope.socioSelected = row;
                if ($scope.socioSelected !== undefined && $scope.socioSelected !== null) {
                    $modalInstance.close($scope.socioSelected);
                }
            }

            $scope.ok = function () {
                var socio = $scope.gridOptions.selectedItems[0];
                if(socio !== undefined && socio !== null){
                    $scope.socioSelected = socio;
                }
                if ($scope.socioSelected !== undefined && $scope.socioSelected !== null) {
                    $modalInstance.close($scope.socioSelected);
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }]);
});