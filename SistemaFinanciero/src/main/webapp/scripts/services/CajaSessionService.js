define(['./module'], function (services) {
    'use strict';
    services.factory("CajaSessionService",["Restangular",
        function(Restangular){
            var _cajaService = Restangular.all("caja/session");
            return {
                getCurrentCaja: function(){
                    return Restangular.one("caja/session").get();
                },
                getDetalle: function(){
                    return Restangular.all("caja/session/detalle").getList();
                },
                getMonedasOfCurrentCaja: function(){
                    return Restangular.all("caja/session/monedas").getList();
                },
                abrir: function(){
                    return Restangular.one("caja/session/abrir").post();
                },
                cerrar: function(detalle){
                    var copy = Restangular.copy(detalle);
                    return Restangular.all("caja/session/cerrar").post(copy);
                },
                getBovedasOfCurrentCaja: function(){
                    return Restangular.all("caja/session/bovedas").getList();
                },
                crearTransaccionBovedaCaja: function(boveda, detalle){
                    var copy = Restangular.copy(detalle);
                    return Restangular.all("caja/session/transaccionbovedacaja").post(copy ,{"boveda":boveda});
                },
                crearTransaccionCajaCaja: function(boveda, detalle){
                    var copy = Restangular.copy(detalle);
                    return Restangular.all("caja/session/transaccioncajacaja").post(copy ,{"boveda":boveda});
                },
                cancelarTransaccionBovedaCaja: function(id){
                    return Restangular.all("caja/session/transaccionbovedacaja/"+id+"/cancelar").post();
                },
                confirmarTransaccionBovedaCaja: function(id){
                    return Restangular.all("caja/session/transaccionbovedacaja/"+id+"/confirmar").post();
                },
                getTransaccionBovedaCajaEnviadas: function(){
                    return Restangular.all("caja/session/transaccionbovedacaja/enviados").getList();
                },
                getTransaccionBovedaCajaRecibidas: function(){
                    return Restangular.all("caja/session/transaccionbovedacaja/recibidos").getList();
                },
                getTransaccionCajaCajaEnviadas: function(){
                    return Restangular.all("caja/session/transaccioncajacaja/enviados").getList();
                },
                getTransaccionCajaCajaRecibidas: function(){
                    return Restangular.all("caja/session/transaccioncajacaja/recibidos").getList();
                },
                getPendientes: function(){
                    return Restangular.all("caja/session/pendiente").getList();
                },
                crearPendiente: function(boveda,monto,observacion){
                    var data = $.param({idboveda:boveda,monto:monto,observacion:observacion});
                    return Restangular.one("caja/session/pendiente").customPOST(
                        data,
                        '',{},{
                            "Content-Type":"application/x-www-form-urlencoded"}
                    );
                },
                getPendiente: function(idPendiente){
                    return Restangular.one("pendiente/"+idPendiente).get();
                },
                getHistoriales: function(desde, hasta){
                    return Restangular.all("caja/session/historial").getList({"desde":desde,"hasta":hasta},{});
                },



                crearTransaccionBancaria: function(transaccion){
                    return Restangular.all("caja/session/transaccionBancaria").post(transaccion);
                },
                crearTransferenciaBancaria: function(transaccion){
                    return Restangular.all("caja/session/transferenciaBancaria").post(transaccion);
                },
                crearAporte: function(transaccion){
                    return Restangular.all("caja/session/transaccionCuentaAporte/deposito").post(transaccion);
                },
                inactivarSocio: function(idSocio){
                    return Restangular.all("caja/session/transaccionCuentaAporte/retiro/"+idSocio).post();
                },
                getVoucherCancelacionCuentaAporte: function(idTransaccion){
                    return Restangular.one("socio/"+idTransaccion+"/voucherCancelacionCuentaAporte").get();
                },
                crearTransaccionCompraVenta: function(transaccion){
                    return Restangular.all("caja/session/transaccionCompraVenta").post(transaccion);
                },
                getHistorialTransaccion: function(){
                    return Restangular.all("caja/session/historialTransaccion").getList();
                },
                getCountHistorialTransaccion: function(){
                    return Restangular.all("caja/session/historialTransaccion/count").getList();
                },
                cancelarCuentaBancaria: function(idCuentaBancaria){
                    return Restangular.one("caja/session/cuentaBancaria/"+idCuentaBancaria).remove();
                },
                extornarTransaccion: function(idTransaccion){
                    return Restangular.all("caja/session/transaccionBancaria/"+idTransaccion+"/extornar").post();
                },
                findByFilterTextView: function(filterText){
                	return Restangular.all("caja/session/transaccionBancaria/view").getList({"filterText":filterText},{});
                },
                count: function(){
                    return Restangular.one("caja/session/transaccionBancaria/view/count").get();
                },
            };
        }]);
});
