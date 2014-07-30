define(['../../module'], function (controllers) {
    'use strict';
    controllers.controller('BuscarPersonaNaturalController', ['$scope','$state','$timeout','$location','$window','ngProgress','focus','PersonaNaturalService','RedirectService',
        function($scope,$state,$timeout,$location,$window,ngProgress,focus,PersonaNaturalService,RedirectService){

            $scope.focusElements = {
                filterText: 'focusFilterText'
            };
            $scope.setInitialFocus = function($event){
                if(!angular.isUndefined($event))
                    $event.preventDefault();
                focus($scope.focusElements.filterText);
                $window.scrollTo(0, 0);
            };
            $scope.setInitialFocus();

            $scope.nuevo = function() {
                RedirectService.limpiar();
                $state.transitionTo('app.administracion.crearPersonaNatural');
            };
            $scope.editar = function(persona) {
                RedirectService.limpiar();
                $state.transitionTo('app.administracion.editarPersonaNatural', { id: persona.id });
            };

            $scope.personasList = [];

            $scope.view = {
                filterText: ""
            };

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
                $scope.personasList = data;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.getDesde = function(){
                return ($scope.pagingOptions.pageSize * $scope.pagingOptions.currentPage) - $scope.pagingOptions.pageSize;
            };
            $scope.getHasta = function(){
                return $scope.pagingOptions.pageSize;
            };
            $scope.cargarTabla = function(filterText){
                if(arguments.length == 0) {
                    PersonaNaturalService.getPersonas($scope.getDesde(), $scope.getHasta()).then(function(data){
                        $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                    });
                    PersonaNaturalService.count().then(function(data){
                        $scope.totalServerItems = data;
                    });
                } else if(arguments.length == 1){
                    PersonaNaturalService.findByFilterText(filterText, $scope.getDesde(), $scope.getHasta()).then(function (data){
                        $scope.pagingOptions.currentPage = 1;
                        $scope.setPagingData(data, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                    });
                }
            };

            //carga inicial de datos
            $scope.getPagedDataInitial = function () {
                $scope.pagingOptions.currentPage = 1;
                $scope.cargarTabla();
            };
            $scope.getPagedDataInitial();

            $scope.getPagedDataSearched = function () {
                if ($scope.filterOptions.filterText) {
                    var ft = $scope.filterOptions.filterText.toUpperCase();
                    $scope.cargarTabla(ft);
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
                        $scope.cargarTabla(ft);
                    } else {
                        $scope.cargarTabla();
                    }
                },true);

            $scope.gridOptions = {
                data: 'personasList',
                multiSelect: false,
                enablePaging: true,
                showFooter: true,
                totalServerItems: 'totalServerItems',
                pagingOptions: $scope.pagingOptions,
                filterOptions: $scope.filterOptions,
                columnDefs: [
                    {field:'tipoDocumento.abreviatura', displayName:'TIPO DOC.', width:80},
                    {field:'numeroDocumento', displayName:'NUM. DOC.', width:100},
                    {field:'apellidoPaterno', displayName:'AP. PATERNO', width:130},
                    {field:'apellidoMaterno', displayName:'AP. MATERNO', width:130},
                    {field:'nombres', displayName:'NOMBRES'},
                    {field:'sexo', displayName:'SEXO', width:90},
                    {field:"fechaNacimiento | date:'dd/MM/yyyy'", displayName:'F. NACIMIENTO', width:100},
                    {displayName: 'EDITAR', cellTemplate: '<div ng-class="col.colIndex()" class="ngCellText ng-scope col6 colt6" style="text-align: center;"><button type="button" class="btn btn-info btn-xs" ng-click="editar(row.entity)"><span class="glyphicon glyphicon-share"></span>Edit</button></div>', width:80}]
            };
        }]);
});