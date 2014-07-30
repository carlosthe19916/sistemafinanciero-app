define(['../module'], function (controllers) {
    'use strict';
    controllers.controller('CrearCuentaPlazoFijoController', [ "$scope", "$state", "$filter", "$window", "$timeout", "$location","$modal", "focus", "MaestroService", "MonedaService", "PersonaNaturalService", "PersonaJuridicaService", "SocioService", "TasaInteresService", "CuentaBancariaService","RedirectService",
        function($scope, $state, $filter, $window,$timeout,$location,$modal, focus, MaestroService, MonedaService, PersonaNaturalService, PersonaJuridicaService, SocioService, TasaInteresService, CuentaBancariaService,RedirectService) {

            $scope.viewState = 'app.socio.crearCuentaBancaria';

            $scope.focusElements = {
                tipoPersona: 'focusTipoPersona',
                numeroDocumento: 'focusNumeroDocumento',
                tipoDocumentoTitular: 'focusTipoDocumentoTitular',
                numeroDocumentoTitular: 'focusNumeroDocumentoTitular',

                tasaInteresEdited: 'focusTasaInteresEdited',
                btnGuardar: 'focusBtnGuardar'
            };
            $scope.setInitialFocus = function($event){
                if(!angular.isUndefined($event))
                    $event.preventDefault();
                $timeout(function() {
                    focus($scope.focusElements.tipoPersona);
                }, 100);
                $window.scrollTo(0, 0);
            };
            $scope.setInitialFocus();

            $scope.control = {
                success: false,
                inProcess: false,
                submitted : false
            };

            $scope.combo = {
                tipoPersonas: MaestroService.getTipoPersonas(),
                tipoDocumentos: [],
                monedas: undefined
            };

            $scope.view = {
                tipoPersona: undefined,
                idTipoDocumento: undefined,
                numeroDocumento: undefined,
                idMoneda: undefined,
                tasaInteres: 0,
                monto: 0,
                total: 0,
                periodo: 0,
                cantRetirantes: 1,
                titulares: [],
                titularesFinal: [],
                beneficiarios: [],

                idTipoDocumentoTitular: undefined,
                numeroDocumentoTitular: undefined
            };

            $scope.login = {
                result: false ,
                tasaInteres: undefined
            };

            $scope.objetosCargados = {
                socioNatural: undefined,
                socioJuridico: undefined
            };

            $scope.loadRedireccion = function(){
                if(RedirectService.haveNext()){
                    var state = RedirectService.getNextState();
                    if(state == $scope.viewState){
                        $scope.view = RedirectService.getNextObject();
                        var focusElem = RedirectService.getNextFocusElement();
                        var windowsPosition = RedirectService.getNextWindowsPosition();
                        RedirectService.clearLast();
                        $timeout(function() {
                            focus(focusElem);
                        }, 500);
                        if(!angular.isUndefined(windowsPosition))
                            $timeout(function() {
                                $window.scrollTo(windowsPosition.x, windowsPosition.y);
                            }, 500);
                        $scope.tipoPersonaChange();
                        $scope.buscarPersonaSocio();
                    }
                }
            };

            $scope.$watchCollection('view.titulares', function() {
                $scope.view.titularesFinal = angular.copy($scope.view.titulares);
                if($scope.objetosCargados.socioNatural !== undefined)
                    $scope.view.titularesFinal.push($scope.objetosCargados.socioNatural);
                if($scope.objetosCargados.socioJuridico !== undefined)
                    $scope.view.titularesFinal.push($scope.objetosCargados.socioJuridico.representanteLegal);
            });
            $scope.$watch('objetosCargados.socioNatural', function() {
                $scope.view.titularesFinal = angular.copy($scope.view.titulares);
                if(!angular.isUndefined($scope.objetosCargados.socioNatural)){
                    $scope.view.titularesFinal.push($scope.objetosCargados.socioNatural);
                }
            });
            $scope.$watch('socioJuridico', function() {
                $scope.view.titularesFinal = angular.copy($scope.view.titulares);
                if(!angular.isUndefined($scope.objetosCargados.socioJuridico)){
                    $scope.view.titularesFinal.push($scope.objetosCargados.socioJuridico.representanteLegal);
                }
            });

            $scope.loadMonedas = function(){
                MonedaService.getMonedas().then(function(data){
                    $scope.combo.monedas = data;
                });
            };

            $scope.tipoPersonaChange = function(){
                $scope.socioNatural = undefined;
                $scope.socioJuridico = undefined;
                if($scope.view.tipoPersona == "NATURAL"){
                    MaestroService.getTipoDocumentoPN().then(function(data){
                        $scope.combo.tipoDocumentos = data;
                    });
                }else{if($scope.view.tipoPersona == "JURIDICA"){
                    MaestroService.getTipoDocumentoPJ().then(function(data){
                        $scope.combo.tipoDocumentos = data;
                    });
                }}
            };

            $scope.monedaChange = function(){
                TasaInteresService.getTasaCuentaAhorro($scope.view.idMoneda).then(
                    function(data){
                        $scope.view.tasaInteres = data.valor;
                    }
                );
            };

            $scope.getMoneda = function(){
                if(!angular.isUndefined($scope.combo.monedas) &&
                    !angular.isUndefined($scope.view.idMoneda)){
                    for(var i=0 ; i<$scope.combo.monedas.length; i++)
                        if($scope.view.idMoneda == $scope.combo.monedas[i].id)
                            return $scope.combo.monedas[i];
                } else {
                    return undefined;
                }
            };

            $scope.buscarPersonaSocio = function($event){
                if(angular.isUndefined($scope.view.idTipoDocumento) || angular.isUndefined($scope.view.numeroDocumento)){
                    if(!angular.isUndefined($event))
                        $event.preventDefault();
                    return;
                }

                var tipoDoc = $scope.view.idTipoDocumento;
                var numDoc = $scope.view.numeroDocumento;
                if($scope.view.tipoPersona == "NATURAL"){
                    PersonaNaturalService.findByTipoNumeroDocumento(tipoDoc,numDoc).then(function(data){
                        $scope.objetosCargados.socioNatural = data;
                        $scope.alerts = [{ type: "success", msg: "Persona(socio) encontrada."}];
                        $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);}
                    },function error(error){
                        $scope.objetosCargados.socioNatural = undefined;
                        $scope.alerts = [{ type: "danger", msg: "Persona(socio) no encontrada."}];
                        $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};
                    });
                }else{if($scope.view.tipoPersona == "JURIDICA"){
                    PersonaJuridicaService.findByTipoNumeroDocumento(tipoDoc,numDoc).then(function(persona){
                        $scope.objetosCargados.socioJuridico = persona;
                        $scope.alerts = [{ type: "success", msg: "Persona(socio) encontrada."}];
                        $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);}
                    },function error(error){
                        $scope.objetosCargados.socioJuridico = undefined;
                        $scope.alerts = [{ type: "danger", msg: "Persona(socio) no encontrada."}];
                        $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);}
                    });
                }}
                if($event !== undefined)
                    $event.preventDefault();
            };

            //transacacion principal
            $scope.formCrearCuenta = {};
            $scope.crearCuenta = function(){
                if ($scope.formCrearCuenta.$valid) {
                    $scope.control.inProcess = true;

                    //poniendo variables
                    var cuenta = {
                        "idMoneda": $scope.view.idMoneda,
                        "periodo": $scope.view.periodo,
                        "monto": $scope.view.monto,
                        "tasaInteres": $scope.view.tasaInteres,

                        "tipoPersona": $scope.view.tipoPersona,
                        "idTipoDocumento": $scope.view.idTipoDocumento,
                        "numeroDocumento": $scope.view.numeroDocumento,

                        "cantRetirantes":$scope.view.cantRetirantes,
                        "titulares":[]
                    };

                    for(var i = 0; i < $scope.view.titularesFinal.length ; i++){
                        var idTitular = $scope.view.titularesFinal[i].id;
                        cuenta.titulares.push(idTitular);
                    }

                    CuentaBancariaService.crearCuentaPlazoFijo(cuenta).then(
                        function(data){
                            $scope.control.inProcess = false;
                            $scope.control.success = true;
                            var mensaje= data.message;

                            var savedParameters = {
                                id: data.id
                            };
                            var sendParameters = {
                                id: data.idTransaccion
                            };
                            var nextState = "app.socio.editarCuentaBancaria";
                            RedirectService.addNext(nextState, savedParameters);
                            $state.transitionTo("app.transaccion.depositoRetiroVoucher", sendParameters);
                        }, function error(error){
                            $scope.control.inProcess = false;
                            $scope.control.success = false;
                            $scope.alerts = [{ type: "danger", msg: "Error: " + error.data.message + "."}];
                            $scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};
                        }
                    );
                } else {
                    $scope.control.submitted = true;
                }
            };

            $scope.crearPersona = function(){
                if(!angular.isUndefined($scope.view.tipoPersona)){
                    var savedParameters = 'PLAZO_FIJO';
                    var sendParameters = {
                        tipoDocumento: $scope.view.idTipoDocumento,
                        numeroDocumento: $scope.view.numeroDocumento
                    };

                    var nextState = $scope.viewState;
                    var elementFocus = $scope.focusElements.numeroDocumento;
                    var windowsPosition = {x: $window.screenX, y: $window.screenY};
                    RedirectService.addNext(nextState,savedParameters,$scope.view, elementFocus, windowsPosition);

                    if($scope.view.tipoPersona == 'NATURAL'){
                        $state.transitionTo('app.administracion.crearPersonaNatural', sendParameters);
                    } else if($scope.view.tipoPersona == 'JURIDICA'){
                        $state.transitionTo('app.administracion.crearPersonaJuridica', sendParameters);
                    }
                } else {
                    alert("Seleccione tipo de persona");
                }
            };

            $scope.openLoginPopUp = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'views/cajero/util/loginPopUp.html',
                    controller: "LoginPopUpController"
                });
                modalInstance.result.then(function (result) {
                    $scope.login.result = result;
                    $timeout(function() {
                        focus($scope.focusElements.tasaInteresEdited);
                    }, 100);
                }, function () {
                });
            };

            $scope.setTasaInteres = function($event){
                if(!angular.isUndefined($scope.login.tasaInteres)){
                    var final = parseFloat($scope.login.tasaInteres.replace(',','.').replace(' ',''));
                    if(final >= 0 && final <= 100) {
                        $scope.view.tasaInteres = final / 100;
                        $scope.login.result = false;

                        $timeout(function() {
                            focus($scope.focusElements.btnGuardar);
                        }, 100);

                        if(!angular.isUndefined($event))
                            $event.preventDefault();
                    } else {
                        if(!angular.isUndefined($event))
                            $event.preventDefault();
                    }
                }else {
                    if(!angular.isUndefined($event))
                        $event.preventDefault();
                }
            };

            $scope.getTipoDocumentoSocio = function(){
                if(!angular.isUndefined($scope.combo.tipoDocumentos)){
                    for(var i = 0; i < $scope.combo.tipoDocumentos.length; i++){
                        if($scope.view.idTipoDocumento == $scope.combo.tipoDocumentos[i].id)
                            return $scope.combo.tipoDocumentos[i];
                    }
                }
                return undefined;
            };
            $scope.$watch("view.numeroDocumento",function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.validarNumeroDocumentoSocio();
                }
            },true);
            $scope.validarNumeroDocumentoSocio = function(){
                if(!angular.isUndefined($scope.formCrearCuenta.numeroDocumento)){
                    if(!angular.isUndefined($scope.view.numeroDocumento)){
                        if(!angular.isUndefined($scope.view.idTipoDocumento)){
                            var tipoDoc = $scope.getTipoDocumentoSocio();
                            if(!angular.isUndefined(tipoDoc)) {
                                if($scope.view.numeroDocumento.length == tipoDoc.numeroCaracteres) {
                                    $scope.formCrearCuenta.numeroDocumento.$setValidity("sgmaxlength",true);
                                } else {$scope.formCrearCuenta.numeroDocumento.$setValidity("sgmaxlength",false);}
                            } else {$scope.formCrearCuenta.numeroDocumento.$setValidity("sgmaxlength",false);}
                        } else{$scope.formCrearCuenta.numeroDocumento.$setValidity("sgmaxlength",false);}
                    } else {$scope.formCrearCuenta.numeroDocumento.$setValidity("sgmaxlength",false);}}
            };

            $scope.$watch('view.tasaInteres', function () {
                $scope.view.total = TasaInteresService.getInteresGenerado($scope.view.tasaInteres, $scope.view.periodo, $scope.view.monto);
            });
            $scope.$watch('view.monto', function () {
                $scope.view.total = TasaInteresService.getInteresGenerado($scope.view.tasaInteres, $scope.view.periodo, $scope.view.monto);
            });
            $scope.$watch('view.periodo', function () {
                $scope.view.total = TasaInteresService.getInteresGenerado($scope.view.tasaInteres, $scope.view.periodo, $scope.view.monto);
            });

            $scope.loadRedireccion();
            $scope.loadMonedas();
        }]);
});