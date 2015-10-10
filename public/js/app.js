(function(){
    'use strict';

    var myApp = angular.module('myApp', ['onsen.directives']);

   //myApp.module('myApp', ['route']);

    
//   var STATICURL = 'http://panel.deliverymas.com';
    var STATICURL = 'http://test.deliverymas.com';
//    var URL = STATICURL + '/api/v1';
    var URL = STATICURL + '/api/v2';
    var httpConfig = {};
    var version = 10007;
 //   var URL = 'http://panel.deliverymas.com:8000';
    //var URL = 'http://localhost:8000';


/* Supuestamente esto deberia extraer el token de las cookies y
   solucionar el problema :P 
	myApp.config(['$httpProvider', function($httpProvider) {
	    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
	    $httpProvider.defaults.xsrfHeaderName = 'X-Token';}
	]);
*/


myApp.run(function($window, $rootScope) {
      $rootScope.online = navigator.onLine;
      $window.addEventListener("offline", function () {
        $rootScope.$apply(function() {
          $rootScope.online = false;
        });
      }, false);
      $window.addEventListener("online", function () {
        $rootScope.$apply(function() {
          $rootScope.online = true;
        });
      }, false);
});

    
    myApp.value('usuario', { value: null});

    function searchById(a, o){
        var r = -1;
        for(var i = 0 ; i < a.length; i++){
//            if( a[i].name === o.name){
            if( a[i].nombre === o.nombre){
                r = i;
            }
        }

        return r;
    };

    function searchByRealId(a, o){
        var r = -1;
        for(var i = 0 ; i < a.length; i++){
//            if( a[i].name === o.name){
            if( a[i].id === o.id){
                r = i;
            }
        }

        return r;
    };

    function searchByReRealId(a, o){
        var r = -1;
        for(var i = 0 ; i < a.length; i++){
//            if( a[i].name === o.name){
            if( a[i] === o){
                r = i;
            }
        }

        return r;
    };

    myApp.service('sharedProperties', function () {

        var hashtable = {};

        return {
            setValue: function (key, value) {


                hashtable[key] = value;

            },
            getValue: function (key) {
                return hashtable[key];
            }
        }
    });

    myApp.factory('store', function() {
        return {
            data : null,
            products : null,
            store : null,
            rubro : null,
        };
    });

    myApp.factory('carrito', function() {
        return {
            data : null
        };
    });

	myApp.filter('sumByKey', function () {
	    return function (data, key) {
		if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
		    return 0;
		}

		var sum = 0;
		for (var i = data.length - 1; i >= 0; i--) {
		    sum += parseInt(data[i][key]);

		}

		return sum;
	    };
	})


//ons.bootstrap();

    myApp.controller('LockController', ['$scope', '$http', 'store','usuario','sharedProperties', function($scope, $http, store,usuario,sharedProperties) {

	$scope.openURL = function(urlString){
	    console.log(urlString);
	    navigator.app.loadUrl(urlString, {openExternal : true});
	};
    }]);


    /* Control de Seleccion de Local */
    myApp.controller('LocalController', ['$scope', '$http', 'store','usuario','sharedProperties', function($scope, $http, store,usuario,sharedProperties) {
        //Funcion que trae los datos de los menus de cierto local
        console.log("En LocalController");
        console.log(usuario);
        $scope.user = usuario.value;
        $scope.ubicacion = usuario.ubicacion;
        $scope.search_query = "";
        $scope.noHayLocales = true;
        $scope.modal = false;
        $scope.urlimg = STATICURL+'/static/media/';
	var coneccion = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });

//	if (navigator.onLine == false){alert("Verifique su conexion a internet.");}

//	var token = localStorage.getItem("token");

//	$http.defaults.headers.common["Authorization"]= 'Token ' + token;

		//http://test.deliverymas.com/api/v2/config/



	$scope.openURL = function(urlString){
            console.log(urlString);
            navigator.app.loadUrl(urlString, {openExternal : true});
	};


        $scope.getVersion = function(){
            $http.get(URL+'/config/')
                .success( function(data, status, headers, config) {
			console.log('Config', data.results);
			
			$scope.config = data.results;

		for(var i = 0; i < $scope.config.length; i++){
			if($scope.config[i].clave == "versionAndroid"){
				$scope.versionconfig = $scope.config[i].contenido;
			}
		}
		if($scope.versionconfig > version){
		//	modalversion.show();
			ons.navigator.pushPage('lock.html', { animation: "fade" });
		}

                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("Data:");
                    console.log(data);
                });


console.log('Version', $scope.versionconfig);
	}



        $scope.rubros = [];
        if( sharedProperties.getValue('rubro') ){
            $scope.rubro = sharedProperties.getValue('rubro');
		console.log('esto es rubro');
		console.log($scope.rubro);
        }else{
            $scope.rubro = null;
        }

        $scope.getRubros = function(){

console.log("buscando rubros");
            $http.get(URL+'/rubros/')
                .success( function(data, status, headers, config) {

                    $scope.rubros = [{"id" : "0", "desc" : "Todos", "image" : ""},];
                    $scope.rubros = $scope.rubros.concat(data.results);
		    console.log('en rubros concat');
		    console.log(data.results);
                    console.log($scope.rubros);

                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("Data:");
                    console.log(data);
                });

        }

        $scope.setRubro = function(r){

            sharedProperties.setValue('rubro', r);

            ons.navigator.pushPage('locales.html', { animation: "fade" });

        }

        $scope.filterLocales = function (query){
            console.log("El query es : " + query);
            

            if(!$scope.noHayLocales){

                var locales = $scope.localesList;
                if(query.length > 0){
                    var filtrado = [];

                    for(var i = 0; i < locales.length; i++){
                        if( locales[i].name.toLowerCase().indexOf(query.toLowerCase()) != -1  ||
                            locales[i].descripcion.toLowerCase().indexOf(query.toLowerCase()) != -1){
                                filtrado.push(locales[i]);
                        }
                    }

                    $scope.locales = filtrado;
                }else{
                    $scope.locales = locales;
                }

            }


        };

        $scope.getLocales = function() {
            console.log(store);

//$http.get('http://localhost/work/apidelivery/apilocal.php')
//  $http.get('http://23.239.18.105:8000/negocios/3/?format=json')
//$http.get('http://maugavilan.com/apidelivery/apilocal.php')
            var filt = '';
            if($scope.rubro != null && $scope.rubro.desc != 'Todos'){
//                filt = '&cat=' + $scope.rubro.desc;
                filt = '&cat=' + $scope.rubro.id;
            }

            $http.get(URL+'/negocios/?format=json'+filt)
                .success( function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log("Store:");
                    console.log(store);
                    console.log("Data Get Locales:");
                    console.log(data);
$scope.getVersion();
                    $scope.localesList = data.results;
                    $scope.locales = data.results;
                    console.log($scope.locales);
                    $scope.noHayLocales = false;

		var ubi_usr = new google.maps.LatLng($scope.ubicacion.lat, $scope.ubicacion.lon);

		/*for(var i = 0; i<$scope.locales.length; i++){

			    var ubi_loc = new google.maps.LatLng($scope.locales[i].lat, $scope.locales[i].lon);

			    $scope.enRango = (google.maps.geometry.spherical.computeDistanceBetween(ubi_usr, ubi_loc));
			    console.log("distancia:");
			    $scope.idRango = $scope.locales[i].id;
			    console.log($scope.idRango);
			    console.log($scope.enRango);
			    
			    if($scope.enRango > $scope.locales[i].radio){$scope.locales[i].enrango = false;}
			    else{$scope.locales[i].enrango = true;}
$scope.si = $scope.locales[i].enrango;
		}*/

/*prueba de sucursales en rango*/
		for(var i = 0; i<$scope.locales.length; i++){
			var rangoant = 0;
			$scope.locales[i].sucenrango = 0;

			for(var j = 0; j<$scope.locales[i].sucursales.length; j++){

			    var ubi_suc = new google.maps.LatLng($scope.locales[i].sucursales[j].lat, $scope.locales[i].sucursales[j].lon);

			    $scope.enRangoS = (google.maps.geometry.spherical.computeDistanceBetween(ubi_usr, ubi_suc));
			    console.log("distancia sucursales:");
			    $scope.idRangoS = $scope.locales[i].sucursales[j].id;
			    console.log("sucursal en rango id: ", $scope.idRangoS);
			    console.log("sucursal en rango rango: ", $scope.enRangoS);
				console.log("sucursal en rango: ", $scope.locales[i].sucenrango);

			    if($scope.enRangoS > $scope.locales[i].sucursales[j].radio){$scope.locales[i].enrango = false;}
			    else if(0 < $scope.enRangoS){$scope.locales[i].sucursal = $scope.locales[i].sucursales[j];
				$scope.locales[i].enrango = true;}


console.log("sucursal: ", $scope.locales[i].sucursal);
			rangoant = $scope.enRangoS;

				/*if($scope.locales[i].sucenrango)
				{$scope.si = $scope.locales[i].enrango;}*/
			}

/*			if($scope.enRangoS > $scope.locales[i].sucursales[j].radio){$scope.locales[i].enrango = false;}
			else{$scope.locales[i].enrango = true;}
			$scope.si = $scope.locales[i].enrango;*/

		}
/*fin prueba de sucursales en rango*/




                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("Data:");
                    console.log(data);
                });

        };


        $scope.getMenuFromLocal = function (local) {
            //            console.clear();
            $scope.modal=false;
	    $scope.color4 = local.color4;
	    $scope.color1 = local.color1;
            
            modalon.show();

            $scope.imgmodal = $scope.urlimg + local.logo;
            console.log($scope.imgmodal);

            var id = local.id
            console.log("Dentro de getMenuFromLocal");
            console.log("ID : " + id);
            store.store = local;
            console.log(store);



            setTimeout(function(){ $scope.getMenuReal(id); }, 2000);

        };

        $scope.getMenuReal = function(id){

            //$http.get('http://localhost/work/apidelivery/apimenu.php?id='+id_local)
//$http.get('http://maugavilan.com/apidelivery/apimenu.php?id='+id)
            $http.get(URL+'/negocios/'+id+'/?format=json')
                        .success( function(data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available
                            console.log("Store antes:");
                            console.log(store);
                            console.log("Data antes:");
                            console.log(data);



		    $http.get(URL+'/catalogos/?empresa='+id)
		                .success( function(data, status, headers, config) {
		                    // this callback will be called asynchronously
		                    // when the response is available
		                    console.log("Store:");
		                    console.log(store);
		                    console.log("Data:");
	//                            console.log(data);
				    console.log(data);
	console.log("Listado de Productos antes de cambiar de pag");

		                    store.data = {"menu" : data.results };
				store.data.menu.submenus = data.results;
				    $scope.local = store;

				if($scope.local.padre == null){

					store.products = data.results.productos;

					console.log(store.products);
					store.data = {"menu" : data.results};
					console.log(store.data.results);
					ons.navigator.pushPage('testPage.html');
				}

				if(!$scope.modal){
		
			                $scope.modalon.hide();
				}

		            
		                    
		                })
		                .error(function(data, status, headers, config) {
		                    // called asynchronously if an error occurs
		                    // or server returns response with an error status.
		                    console.log("Data:");
		                    console.log(data);
		                    modalon.hide();
		                });             
                            
                        })
                        .error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log("Data:");
                            console.log(data);
                            modalon.hide();
                        });

        }


        $scope.getPromos = function() {
            console.log(store);
		console.log(":::::HTTP CONFIG:::::");
	    console.log(httpConfig);

            $http.get(URL+'/promos/?format=json')
                .success( function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
		
                    console.log("Store:");
                    console.log(store);
                    console.log("Data promo:");
                    console.log(data);

		            $scope.modal = true;
		
                    $scope.promosList = data.results;
                    $scope.promos = data.results;

                    console.log($scope.promos);
                    $scope.noHayPromos = false;

                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("Data:");
                    console.log(data);
                });

        };


        function getLocalByUrl(url){
            var aux = url.split("/");
            var id =  aux[aux.length - 2];
            console.log("ID en getLocal : " + id);
            console.log($scope.localesList);
            for(var i = 0; i<$scope.localesList.length; i++){
                if( id == $scope.localesList[i].id ){
                    console.log("Entro o no ?");
                    return $scope.localesList[i];
                }
            }

            return null;
        }

        $scope.setPromo = function(p){

            $scope.promo = p;
            store.store = getLocalByUrl(p.empresa)
            console.log("Store en Set Promo:");
            console.log(store);
            modalpromo.show();
        }


        $scope.$watch("search_query", function(newValue, oldValue) {
            $scope.filterLocales($scope.search_query);
        });
	
	$scope.getVersion();
        $scope.getLocales();
        $scope.getPromos();

	ons.slidingMenu.on('preopen', function() {
		$scope.getRubros();
	});


    }]);

    myApp.controller('TestController', ['$scope','$http','store', 'carrito','usuario', function($scope, $http, store, carrito, usuario) {

	var coneccion = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });

	$scope.ubicacion = usuario.ubicacion;

	var imgsrc = STATICURL+'/static/media/';

        console.log("Hola... ?");
        var a = store.data;
	if(carrito.data !== null){
		if(store.store.id !== carrito.data.local || store.store.enrango !== true){
		carrito.data = null;}
	}

        console.log('El valor de A:' + a);

        if(a === null || a.hayMenu === false){

            $scope.menu = {  };
        } else {
            $scope.menu = a.menu;
        }

	$scope.empresa = store.store.name;
console.log('porque');
console.log(store);

	$scope.pattern = imgsrc + store.store.pattern;
	$scope.banner = imgsrc + store.store.banner;
//	$scope.banner = imgsrc + a.menu.banner;
//	$scope.banner = a.menu.imagen;
	$scope.color1 = store.store.color1;
	$scope.color2 = store.store.color2;
	$scope.color3 = store.store.color3;
	$scope.color4 = store.store.color4;
	$scope.color5 = store.store.color5;
	$scope.desc = store.store.menu;
	$scope.logo = imgsrc + store.store.logo;

        console.log("ubicacion en local y menu");
	if(usuario.ubicacion == undefined) {
		$scope.lugar = "";
            }else{
                $scope.lugar = usuario.ubicacion.nombre;
            }

        console.log(usuario.ubicacion);

            if(! usuario.ubicacion ){

		swal({title: "Disculpe", text: "Debe seleccionar un destino para realizar la compra", type: "warning", confirmButtonText: "Aceptar"});

		$scope.lugarsi = "No seleccionó destino!";       
 //               return false;
            }

        console.log("De donde saco color:");
        console.log($scope.color1);
	console.log($scope.color2);
	console.log($scope.color3);

        console.log("Y el valor del menu:");
        console.log($scope.menu);

        $scope.cambiarMenu = function(m){
            
            if( m.submenus.length != 0  ){

                store.data = {"menu" : m};
                ons.navigator.pushPage('testPage.html');
            }
            else{
                store.products = m.productos;
                console.log("Listado de Productos antes de cambiar de pag");
                console.log(store.products);
                store.data = {"menu" : m};
                console.log(store.data.menu);

                ons.navigator.pushPage('listadoProductos.html');
            }
        };

         $scope.$watch(function(){return carrito.data}, function(newValue, oldValue) {
            
            $scope.carrito = carrito.data;
            console.log("On watch");
            console.log($scope.carrito);
            
        });


	$scope.getDescLocal = function () {

            
            console.log(store);

            console.log("Dentro de ficha del Local");
            console.log(a.menu);

            ons.navigator.pushPage('ficha.html');

        };



    }]);

    
    myApp.controller('FlavorController', ['$scope','store', function($scope,store){


        $scope.flavors = ['Muzza', 'Napolitana', 'Cheesylover', 'Margarita', 'Pepperoni', 'Porongoidea', 'SoplaPollas' ];
        $scope.selectedFlavors = [];

        $scope.addFlavor = function(flavor){
            if($scope.selectedFlavors.indexOf(flavor) != -1) {
                var i = $scope.selectedFlavors.indexOf(flavor);
                $scope.selectedFlavors.splice(i,1);
            }else{
                $scope.selectedFlavors.push(flavor);
            }
            console.log($scope.selectedFlavors);
        };

        $scope.test = function(){alert('hola');};



    }]);

    myApp.controller('ProductController', ['$scope', '$rootScope', '$filter', 'store', 'carrito', function($scope, $rootScope, $filter, store, carrito){

	var coneccion = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 }); 

       var imgsrc = STATICURL+'/static/media/';


	if(carrito.data !== null ){
		if(store.store.id !== carrito.data.local || store.store.enrango !== true){
		carrito.data = null;}
	}

        if(carrito.data === null){
                carrito.data = {};
                carrito.data.products = []
                carrito.data.total = 0;
                carrito.data.cantidad = 0;
                carrito.data.local = store.store.id;
        }

//$scope.extras = store.data.extras;

	$scope.seleccionados = [];

    	$scope.color1 = store.store.color1;
    	$scope.color2 = store.store.color2;
    	$scope.color3 = store.store.color3;
    	$scope.color4 = store.store.color4;
    	$scope.color5 = store.store.color5;
//    	$scope.banner = store.store.imagen;
    	$scope.banner = imgsrc + store.store.banner;

	$scope.pattern = imgsrc + store.store.pattern;

        console.log("Color:");
        console.log($scope.color1);
    	console.log($scope.color2);
    	console.log($scope.color3);

        $scope.products = store.products;
	$scope.menu = store.data.menu;
        $scope.carrito = carrito.data;
        console.log($scope.menu);
    	console.log($scope.products);

        $scope.actualizarCarritoLocal = function(){

            $scope.carrito = carrito.data;
            console.log("CARRITO EN REFRESH");
            console.log( JSON.stringify(carrito.data.products) );
            for(var i = 0; i<$scope.products.length; i++ ){
		$scope.products[i].cantidad = 0;
            }
//console.log('cantidad q no anda 1',$scope.products[i].cantidad);
            for(var i = 0; i<carrito.data.products.length; i++ ){

                var item = carrito.data.products[i];
                var j = searchById($scope.products, item);
				var suma = 2;

				if((carrito.data.products[i].selsabores==0 || carrito.data.products[i].selsabores == undefined) && (carrito.data.products[i].extras==0 || carrito.data.products[i].extras == undefined)){
					var suma = 0;
				
				}else{var suma = 1;}
				switch(suma) {
					case 0:
						if( j != -1){

							$scope.products[j].cantidad = carrito.data.products[i].cantidad;

						}
						break;
					case undefined:
						if( j != -1){

							$scope.products[j].cantidad = carrito.data.products[i].cantidad;

						}
						break;
					case 1:
						if($scope.products[j]){
							$scope.products[j].cantidad++;
							break;
						}

				}


				//$scope.products[j].cantidad++;


			}
        };

      /*$scope.actualizarCarritoLocal = function(){

            $scope.carrito = carrito.data;
            console.log("CARRITO EN REFRESH");
            console.log( JSON.stringify(carrito.data.products) );
            for(var i = 0; i<$scope.products.length; i++ ){
                $scope.products[i].cantidad = 0;
            }

            for(var i = 0; i<carrito.data.products.length; i++ ){
                
                var item = carrito.data.products[i];
                var j = searchById($scope.products, item);



                if( j != -1){
                    $scope.products[j].cantidad = carrito.data.products[i].cantidad;

			if(carrito.data.products[i].selsabores.length > 0 || carrito.data.products[i].extras.length > 0){$scope.products[j].cantidad++;}
                }

		
            }

	

        };*/

        $scope.detalleProducto = function(prod){

    		console.log("en detalle");
    		console.log(prod.nombre);

    		for(var i = 0; i<$scope.products.length; i++ ){
    			console.log(prod);
    			if($scope.products[i].nombre == prod.nombre){
    				store.data = {"prod" : prod};
    				ons.navigator.pushPage('descripcion.html');
    				break;
    			}
    		}
        };

        $scope.agregadosProducto = function(prod){

    		console.log("en agregados");
    		console.log(prod);
		store.data = {"extras" : prod};
    		console.log($scope.extras);
		
		ons.navigator.pushPage('extras.html');

        };

        function rellenarNegocio(p,last){
            if($scope.negocios){
                var aux = p.negocio.split("/");
                var id =  aux[aux.length - 2];
                for(var i = 0; i < $scope.negocios.length; i++){
                    var data = $scope.negocios[i];
                    if( id == data.id){
                        p.negocio = data;
                        p.estado = estados[p.estado];
                        p.ped = data.id;
                    }
                }
                
                if(!isInScope(p)){
                    $scope.pedidosT.push(p);
                }

                if(last){
                        $scope.pedidos = $scope.pedidosT;
                }
            }

        }



	$scope.selectAgregados = function(a){

		for (var j = $scope.extras.agregados.length - 1; j >= 0; j--) {
			if($scope.extras.agregados[j].id != a.id && $scope.extras.agregados[j].tipo==2){
				$scope.extras.agregados[j].checked=false;
			}else if( $scope.extras.agregados[j].tipo==2){
				$scope.extras.agregados[j].checked=true; 
			}
		}
	}

	$scope.confirmarAgregados = function(extras){

		$scope.seleccionados = $filter('filter')($scope.extras.agregados, {checked: true});
    		console.log("en confirmar agregados");
    		console.log($scope.seleccionados);
		console.log(extras);
		
		var select = $scope.seleccionados;

		var si = 0;
		if($scope.mandatorio){

			for (var i = $scope.seleccionados.length - 1; i >= 0; i--) {
				if($scope.seleccionados[i].tipo == 2){si++;}
			}

			if(si == 0){

				swal({title: "Ups!", text: "Seleccione una opción.", type: "error",     confirmButtonText: "Aceptar"});
			}else{$scope.extras.extras = select;$scope.addItem(extras);modalextras.hide();}
		}else{$scope.extras.extras = select;$scope.addItem(extras);modalextras.hide();}

        };

	/*Inicio de Agregado para funcionalidad de selector de sabores*/

	$scope.flavors = ons.navigator.getCurrentPage().options.flavors;

console.log('merd',$scope.flavors);

	if($scope.flavors){
		$scope.checked = false;
		var auxslice = 0;
		var maxsabores = $scope.flavors.maxsabores;
		$scope.maxsabores = maxsabores;
		//$scope.flavors = $scope.flavors;
		$scope.selectedFlavors = [];
		$scope.slices = [];
	}

        $scope.addFlavor = function(flavor){

	
            if($scope.selectedFlavors.indexOf(flavor) != -1) {
                var i = $scope.selectedFlavors.indexOf(flavor);
                $scope.selectedFlavors.splice(i,1);
                auxslice--;
            }else{
		if($scope.selectedFlavors.length <= maxsabores){
			$scope.selectedFlavors.push(flavor);
			auxslice++;
		}
            }

            console.log($scope.selectedFlavors);
            $scope.slice = auxslice;

        };

	$scope.confirmarSabores = function(flavors){
		//var item = flavor;
		console.log('alfin', flavors);
		console.log('alfin2', $scope.selectedFlavors);
		if($scope.selectedFlavors == 0){
			swal({title: "Lo sentimos!", text: "Debe elegir al menos un sabor.", type: "warning",     confirmButtonText: "Aceptar"});
		}else{
$rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
        console.log('page', newUrl); // http://localhost:3000/#/articles/new
        console.log('page1', oldUrl); // http://localhost:3000/#/articles 
        event.preventDefault(); // This prevents the navigation from happening
      });
			$scope.flavors.selsabores = $scope.selectedFlavors;
			$scope.addItem(flavors);
			$scope.flavors.selsabores = 0;
			ons.navigator.popPage();
			//ons.navigator.pushPage('listadoProductos.html', {flavors: $scope.flavors});

//$scope.$on('$destroy', function() {
  //      console.log('destroy');
//$scope.$on('$destroy', listadoProductos.html.destroy);
//});

		}
	}



	$scope.mostrarDescrip = function(detalle){
		if(detalle.descripcion){
			var tittle = detalle.nombre;
			var message = detalle.descripcion;
		}
		swal(tittle,message);

	}


	/*fin de Agregado para funcionalidad de selector de sabores*/


        $scope.addItem = function(item){

console.log("en in: ", item);

	modalextras.hide();	
	        var producto = JSON.parse(JSON.stringify(item));
	if(store.store.abierto == true){
		if(store.store.enrango == true){

console.log('mierda',item);
		if(item.sabores.length > 0 && !item.selsabores && !item.extras){

			$scope.flavors = item;
			$scope.flavors.selsabores = 0;
			console.log('oa',$scope.flavors);
			ons.navigator.pushPage('page12.html', {flavors: $scope.flavors});
			//ons.navigator.pushPage('page12.html');
			if(item.agregados){
				$scope.extras = item;
				//modalextras.show();
			}

		}else if(item.agregados.length > 0 && !item.extras){

if(item.selsabores){
	//producto.cantidad = 0;
	carrito.data.products.push(producto);
	carrito.data.total += item.precio;

	for (var i = item.selsabores.length - 1; i >= 0; i--) {
		
		carrito.data.total += Math.round(item.selsabores[i].precio / item.selsabores.length);
		producto.precio += Math.round(item.selsabores[i].precio / item.selsabores.length);

	} 

}

			$scope.extras = item;

			$scope.mandatorio = false;
			$scope.agregar = false;
			$scope.quitar = false;

			for (var j = $scope.extras.agregados.length - 1; j >= 0; j--) {
				if($scope.extras.agregados[j].tipo==2){
					$scope.mandatorio = true ;
				}else if($scope.extras.agregados[j].tipo==1){
					$scope.quitar = true ;
				}else{
					$scope.agregar = true ;
				}
				if($scope.extras.agregados[j].checked){$scope.extras.agregados[j].checked=false;}

			}



			$scope.extras.extras = 0;
			modalextras.show();

		}else{

			if(searchById(carrito.data.products,item) == -1 || item.extras || item.selsabores){
		        	console.log("Primera vez");

				carrito.data.products.push(producto);

				if(item.extras || item.selsabores){ 
					//producto.cantidad = 1;
					//carrito.data.total += item.precio;
					if(item.extras){
					producto.cantidad = 1;
					carrito.data.total += item.precio;
						for (var i = item.extras.length - 1; i >= 0; i--) {
					
							carrito.data.total += (item.extras[i].precio);
							producto.precio += item.extras[i].precio;

						}
					}else if(item.selsabores){
					producto.cantidad = 1;
					carrito.data.total += item.precio;
					var selsaboresprecio = 0;
						for (var i = item.selsabores.length - 1; i >= 0; i--) {//console.log("queee ", carrito.data.products[i].precio);
/*							if(carrito.data.products[i]){
								carrito.data.products[i].precio += (item.selsabores[i].precio / item.selsabores.length);
							}else{
								carrito.data.products.precio += (item.selsabores[i].precio / item.selsabores.length);
							}parseFloat(*/
//							
							//carrito.data.total += item.selsabores[i].precio;
//							carrito.data.total += (item.selsabores[i].precio / item.selsabores.length);
//							producto.precio += item.selsabores[i].precio;
							selsaboresprecio += item.selsabores[i].precio;
//							producto.precio += (item.selsabores[i].precio / item.selsabores.length);

						} //carrito.data.total = (carrito.data.total / item.selsabores.length);
						carrito.data.total += Math.round(selsaboresprecio / item.selsabores.length);
						producto.precio += Math.round(selsaboresprecio / item.selsabores.length);
					}/**/

				}else{carrito.data.total += item.precio; /*producto.cantidad++;*/ producto.cantidad = 1;  }
				carrito.data.cantidad++;
				console.log("Pre Refresh");

				console.log( JSON.stringify(carrito.data.products) );

				$scope.actualizarCarritoLocal();

			}else{

			    item.cantidad++;
			    var i = searchById(carrito.data.products, item);
			    var ungrup = carrito.data.products[i].extras;
				console.log('extraa: ',ungrup);
				console.log('extraa: ',carrito.data.products[i].extras);
				console.log('extraa: ',item.extras);
			    var nada = searchById(carrito.data.products[i], item.extras);

			    carrito.data.products[i].cantidad++;
			    carrito.data.products[i].extras = item.extras;
			    carrito.data.products[i].selsabores = item.selsabores;
				if(item.extras || item.selsabores){
					if(item.extras){
						carrito.data.total += item.precio;
						for (var i = item.extras.length - 1; i >= 0; i--) {
		
							carrito.data.total += item.extras[i].precio;

						}
					}
					if(item.selsabores){
						carrito.data.products[i].precio = Math.round(carrito.data.products[i].precio / carrito.data.products[i].selsabores.length);
						carrito.data.total += item.precio;
						for (var i = item.selsabores.length - 1; i >= 0; i--) {

							carrito.data.total += item.selsabores[i].precio;

						}
					}
				}else{carrito.data.total += item.precio;}

			    carrito.data.cantidad++;
	//carrito.data.cantidad = 10;


			    console.log("Pre Refresh");

			    console.log( JSON.stringify(carrito.data.products) );

			    $scope.actualizarCarritoLocal();
			}
}
		}else{console.log('el rango cuando no esta en rango'); console.log(store.store.enrango);
			if(store.store.enrango == undefined){
				swal({title: "Lo sentimos!", text: "No ha seleccionado ningún destino.", type: "warning",     confirmButtonText: "Aceptar"});
			}
			else{
				swal({title: "Lo sentimos!", text: "El negocio se encuentra fuera del area de cobertura.", type: "warning",     confirmButtonText: "Aceptar"});
			}
		}

	}else{
		swal({     title: "Lo sentimos!",     text: "El negocio se encuentra fuera del horario de atención.",     type: "warning",     confirmButtonText: "Aceptar"   });
	}

	if(searchById(store.products,item) != -1) {
		var i = searchById(store.products,item);

		if(store.products[i].agregados) {
			store.products[i].extras = 0;
		}
		if(store.products[i].sabores) {
			store.products[i].selsabores = 0;
		}
	 }


        };
/*        $scope.removeItem = function(item){ 
            if(searchById(carrito.data.products,item) != -1) {

                var i = searchById(carrito.data.products,item);
                carrito.data.products[i].cantidad--;

		if(carrito.data.products[i].extras || carrito.data.products[i].selsabores){
			if(carrito.data.products[i].extras){
				carrito.data.total -= item.precio;
				for (var j = carrito.data.products[i].extras.length - 1; j >= 0; j--) {
				    //sum += parseInt(data[i][key]);
					carrito.data.total -= carrito.data.products[i].extras[j].precio;

				}
			}else if(carrito.data.products[i].selsabores){
				//carrito.data.total -= item.precio;
				////for (var j = carrito.data.products[i].selsabores.length - 1; j >= 0; j--) {
				    ////sum += parseInt(data[i][key]);
					//carrito.data.total -= (carrito.data.products[i].precio / carrito.data.products[i].selsabores.length);

				////}
				carrito.data.products[i].cantidad = 0;
var quitar = carrito.data.products[i].cantidad +1 ;
console.log("quito", carrito.data.products[i].cantidad);
				carrito.data.total = 0;
				carrito.data.cantidad = 0;//producto.cantidad = 0;
				//$scope.products[i].cantidad = 0;
//for(var j = 0; j<4; j++ ){
//                    carrito.data.products.splice(j,1);
//}
            //for(var j = 0; j<$scope.products.length +1; j++ ){
		//$scope.products[j].cantidad = 0;
//carrito.data.products[j].cantidad = 0;;
            //}
            //for(var j = 0; j<$scope.products.length +1; j++ ){
console.log("ququ", carrito.data.products);		carrito.data.products.splice(i,1);
            //}//carrito.data.products.splice(i,1);

			}
		}else{carrito.data.total -= item.precio;}

                if(carrito.data.products[i] && carrito.data.products[i].cantidad == 0){
                    carrito.data.products.splice(i,1);
                }

                //carrito.data.total -= item.precio;
		if(carrito.data.cantidad > 0){
                carrito.data.cantidad--;}
                $scope.actualizarCarritoLocal();
            }else{
                console.log("no tiene niooo");
            }
        };*/

	$scope.preremove = function(item){
		console.log('en quito', item);
		if(item.agregados.length > 0 || item.sabores.length > 0){console.log('voy a quitar', item);
			for (var h = 0, len = item.cantidad; h < len; h++) {
				$scope.removeItem(item);
			}
		}else{$scope.removeItem(item);}
	}


        $scope.removeItem = function(item){ 

            if(searchById(carrito.data.products,item) != -1) {
                var i = searchById(carrito.data.products,item);
                carrito.data.products[i].cantidad--;

if(carrito.data.products[i].extras || carrito.data.products[i].selsabores){
			if(carrito.data.products[i].extras){
				carrito.data.total -= item.precio;
				//for (var k = carrito.data.products[i].cantidad;k >= 0; k--) {
					for (var j = carrito.data.products[i].extras.length - 1; j >= 0; j--) {
					    //sum += parseInt(data[i][key]);
						carrito.data.total -= carrito.data.products[i].extras[j].precio;

					}
				//}
			}else if(carrito.data.products[i].selsabores){
				//carrito.data.total -= item.precio;
				////for (var j = carrito.data.products[i].selsabores.length - 1; j >= 0; j--) {
				    ////sum += parseInt(data[i][key]);
					//carrito.data.total -= (carrito.data.products[i].precio / carrito.data.products[i].selsabores.length);

				////}
				
				carrito.data.products[i].cantidad = 0;
//var quitar = carrito.data.products[i].cantidad +1 ;
//console.log("quito", carrito.data.products[i].cantidad);
				//if(item.selsabores){console.log("quito", item);
					//item.precio = (item.precio / item.selsabores.length);
					//carrito.data.total -= item.precio;
				//}else{ carrito.data.total -= item.precio}
				//carrito.data.cantidad = 0;
				var selsaboresprecio =0;
				carrito.data.total -= item.precio;
				for (var j = carrito.data.products[i].selsabores.length - 1; j >= 0; j--) {
				    //sum += parseInt(data[i][key]);
					//carrito.data.total -= (carrito.data.products[i].selsabores[j].precio / carrito.data.products[i].selsabores.length);
					selsaboresprecio += carrito.data.products[i].selsabores[j].precio;

				}
				carrito.data.total -= Math.round(selsaboresprecio / carrito.data.products[i].selsabores.length);


			}
		}else{carrito.data.total -= item.precio;}

		//carrito.data.total -= item.precio;

                if(carrito.data.products[i].cantidad == 0){
                    carrito.data.products.splice(i,1);
                }

                //carrito.data.total -= item.precio;
                carrito.data.cantidad--;
                $scope.actualizarCarritoLocal();
            }else{
                console.log("no tiene niooo");
            }
        };




	$scope.$watch(function(){return carrito.data}, function(newValue, oldValue) {
            
            $scope.carrito = carrito.data;
            console.log("On watch");
            console.log($scope.carrito);
            
        });

	$scope.getDescLocal = function () {

            
            console.log(store);

            console.log("Dentro de ficha del Local");
            console.log(store.store.menu);


            ons.navigator.pushPage('ficha.html');

        };


        $scope.actualizarCarritoLocal();

    }]);


    myApp.controller('DetailController', ['$scope', 'store', 'carrito', function($scope, store, carrito){
	var imgsrc = STATICURL+'/static/media/';

	$scope.urlimg = STATICURL+'/static/media/';
	$scope.color1 = store.store.color1;
	$scope.color2 = store.store.color2;
	$scope.color3 = store.store.color3;
	$scope.color4 = store.store.color4;
	$scope.color5 = store.store.color5;
	$scope.detail = store.data.prod;

    }]);


    myApp.controller('ExtrasController', ['$scope', 'store', 'carrito', function($scope, store, carrito){
	var imgsrc = STATICURL+'/static/media/';
	$scope.color1 = store.store.color1;
	$scope.color2 = store.store.color2;
	$scope.color3 = store.store.color3;
	$scope.color4 = store.store.color4;
	$scope.color5 = store.store.color5;
	$scope.extras = store.data.extras;

    }]);


    /* Control de Ficha de Local */
    myApp.controller('FichaController', ['$scope', '$http', 'store','usuario','sharedProperties', function($scope, $http, store,usuario,sharedProperties) {

var imgsrc = STATICURL+'/static/media/';
var iidd = store.store.id;
console.log('a ver si hay id de negocio');
console.log(iidd);

	var coneccion = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });

	$scope.openURL = function(urlString){
            console.log(urlString);
            // Solo funcionara en android, para ios lo correcto seria :
            // window.open(url, '_system')
            navigator.app.loadUrl(urlString, {openExternal : true});
    };



		$http.get(URL+'/negocios/'+iidd+'/?format=json')

                .success( function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
		
		    console.log(store);

		    console.log("Dentro de ficha del Local");
		    $scope.logo = imgsrc + store.store.logo;
		    $scope.ficha = store.store;
		    console.log($scope.ficha);


	

                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("Data:");
                    console.log(data);
                });

   }]);


    myApp.controller('CheckoutController', ['$scope','$http', 'carrito','usuario','store', function($scope, $http ,carrito,usuario,store){
        
	var imgsrc = STATICURL+'/static/media/';

	$scope.products = store.products;

	//$scope.tarjeta = store.store.tarjeta;

	if(store.store.tarjeta == false){$scope.tarjeta = 'none';}else{$scope.tarjeta = '';}

		console.log("hola minimo");
		console.log($scope.tarjeta);

		console.log("prueba sucursales: ", store.store);

	$scope.carrito = carrito.data;
	$scope.envio = store.store.costo;
	$scope.tiempo = store.store.tiempo;
//	$scope.banner = store.store.imagen;
	$scope.banner = imgsrc + store.store.banner;
	$scope.enableEnvio = true;
	$scope.tipo_pago = true;
	$scope.observacion = "";


        $scope.actualizarCarritoLocal = function(){

            $scope.carrito = carrito.data;
            console.log("CARRITO EN REFRESH");
            console.log( JSON.stringify(carrito.data.products) );
            for(var i = 0; i<$scope.products.length; i++ ){
		$scope.products[i].cantidad = 0;
            }
//console.log('cantidad q no anda 1',$scope.products[i].cantidad);
            for(var i = 0; i<carrito.data.products.length; i++ ){

                var item = carrito.data.products[i];
                var j = searchById($scope.products, item);
				var suma = 2;

				if((carrito.data.products[i].selsabores==0 || carrito.data.products[i].selsabores == undefined) && (carrito.data.products[i].extras==0 || carrito.data.products[i].extras == undefined)){
					var suma = 0;
				
				}else{var suma = 1;}
				switch(suma) {
					case 0:
						if( j != -1){

							$scope.products[j].cantidad = carrito.data.products[i].cantidad;

						}
						break;
					case undefined:
						if( j != -1){

							$scope.products[j].cantidad = carrito.data.products[i].cantidad;

						}
						break;
					case 1:
						if($scope.products[j]){
							$scope.products[j].cantidad++;
							break;
						}

				}


				//$scope.products[j].cantidad++;


			}
        };


        console.log("En menu que tengo?");
        console.log(store);

        console.log("ubicacion en checkout");
	   if(usuario.ubicacion == undefined) {
		$scope.lugar = "";
            }else{
                $scope.lugar = usuario.ubicacion.nombre;
            }
        console.log(usuario.ubicacion);

//console.log('que remuevo', carrito.data.products);


        $scope.removeItem = function(item){
console.log('que remuevoooo', carrito.data.products);
		//item = JSON.parse(JSON.stringify(item));
		console.log('que remuevo2', item);
            if(searchById(carrito.data.products,item) != -1) {
		carrito.data.products.sort();
		for(var o = carrito.data.products.length - 1; o >= 0; o--){
			if(carrito.data.products[o] === item){
				if(!carrito.data.products[o].extras && !carrito.data.products[o].selsabores){
					carrito.data.cantidad--;
					carrito.data.total -= item.precio; 
					carrito.data.products[o].cantidad--;
					//if(carrito.data.products[o].cantidad == 0){carrito.data.products.splice(o,1);}
				}else{
					
					if(carrito.data.products[o].extras){
						carrito.data.cantidad--;
						carrito.data.total -= carrito.data.products[o].precio;
						for (var j = carrito.data.products[o].extras.length - 1; j >= 0; j--) {
							//carrito.data.total -= carrito.data.products[o].extras[j].precio;
						}
						carrito.data.products[o].cantidad--;
						//item.cantidad--;
						//carrito.data.products.splice(o,1);
					}
					if(carrito.data.products[o].selsabores){
						carrito.data.products[o].cantidad--;
						carrito.data.cantidad--;
						carrito.data.total -= carrito.data.products[o].precio;
						for (var j = carrito.data.products[o].selsabores.length - 1; j >= 0; j--) {console.log('ioji ',carrito.data.products[o].selsabores[j]);
							//carrito.data.total -= (item.selsabores[j].precio / item.selsabores.length);
						}

						//carrito.data.products.splice(o,1);
					}
				}
				if(carrito.data.products[o].cantidad == 0){
					carrito.data.products.splice(o,1);
				}
			}
		}
		$scope.actualizarCarritoLocal();
            }else{
                console.log("no tiene niooo");
            }
        };


$scope.mostrarAgregados = function(lista){
	var message = '';
	var ttipo = '';
	for (var i = lista.length - 1; i >= 0; i--) {
		if(lista[i].tipo == 0){ttipo = "Agregar - ";}else if(lista[i].tipo == 1){ttipo = "Quitar - ";}
		message += ttipo + '\x09' + lista[i].nombre + '\n';
	}

	 swal("Detalle",message);

}

$scope.mostrarSabores = function(lista){
	var message = '';
	var ssabor = '';
	for (var i = lista.length - 1; i >= 0; i--) {
		ssabor = "Sabor - ";
		//if(lista[i].tipo == 0){ttipo = "Agregar - ";}else if(lista[i].tipo == 1){ttipo = "Quitar - ";}
		message += ssabor + '\x09' + lista[i].nombre + '\n';
	}

	 swal("Detalle",message);

}

$scope.mostrarDetalles = function(detalle){
	if(detalle.extras.length > 0){
		var lista = detalle.extras;
		var message = '';
		var ttipo = '';
		for (var i = lista.length - 1; i >= 0; i--) {
			if(lista[i].tipo == 0){ttipo = "Agregar - ";}else if(lista[i].tipo == 1){ttipo = "Quitar - ";}
			message += ttipo + '\x09' + lista[i].nombre + '\n';
		}

		//swal("Detalle",message);
	}else if(detalle.selsabores.length > 0){
		var lista = detalle.selsabores;
		var message = '';
		var ssabor = '';
		for (var i = lista.length - 1; i >= 0; i--) {
			ssabor = "Sabor - ";
			//if(lista[i].tipo == 0){ttipo = "Agregar - ";}else if(lista[i].tipo == 1){ttipo = "Quitar - ";}
			message += ssabor + '\x09' + lista[i].nombre + '\n';
		}

		//swal("Detalle",message);
	}
	swal("Detalle",message);

}


        $scope.enviarPedido = function(){

            var carro = carrito.data;

            if(! usuario.ubicacion ){
	            swal({     title: "Error!",     text: "Debe elegir un destino!",     type: "error",     confirmButtonText: "Aceptar"   });
                return false;
            }else{


/*prueba de sucursales en rango*/
		if(!store.store.sucursal){
			
			var sucenrango = 0;
			var enrango = false;

			for(var j = 0; j<store.store.sucursales.length; j++){
		var ubi_usr = new google.maps.LatLng(usuario.ubicacion.lat, usuario.ubicacion.lon);
			    var ubi_suc = new google.maps.LatLng(store.store.sucursales[j].lat, store.store.sucursales[j].lon);

			    $scope.enRangoS = (google.maps.geometry.spherical.computeDistanceBetween(ubi_usr, ubi_suc));
			    console.log("distancia sucursales:",ubi_suc);
			    $scope.idRangoS = store.store.sucursales[j].id;
			    console.log("sucursal en rango id: ", $scope.idRangoS);
			    console.log("sucursal en rango rango: ", $scope.enRangoS);
console.log("sucursales: ", store.store.sucursales[j].radio);			    
			    if($scope.enRangoS > store.store.sucursales[j].radio){enrango = false;var ubi_loc = {A: 0, F: 0}; var radio_suc = 0;console.log("si: ", ubi_loc);}
			    else if(sucenrango < $scope.enRangoS){store.store.sucursal = store.store.sucursales[j];
				enrango = true; var ubi_loc = new google.maps.LatLng(store.store.sucursal.lat, store.store.sucursal.lon); var radio_suc = store.store.sucursal.radio;console.log("no: ", ubi_loc);}

console.log("sucursal: ", store.store.sucursal);

				//if($scope.locales[i].sucenrango 
				/*$scope.si = $scope.locales[i].enrango;*/
			}


		

/*			if($scope.enRangoS > $scope.locales[i].sucursales[j].radio){$scope.locales[i].enrango = false;}
			else{$scope.locales[i].enrango = true;}
			$scope.si = $scope.locales[i].enrango;*/

		}else{var radio_suc = store.store.sucursal.radio; var ubi_loc = new google.maps.LatLng(store.store.sucursal.lat, store.store.sucursal.lon); var ubi_usr = new google.maps.LatLng(usuario.ubicacion.lat, usuario.ubicacion.lon);}
/*fin prueba de sucursales en rango*/
console.log('distancia en checkout:',ubi_loc);
		$scope.ped_dist = (google.maps.geometry.spherical.computeDistanceBetween(ubi_usr, ubi_loc));
		console.log('distancia en checkout:',$scope.ped_dist);/**/
		if($scope.ped_dist > radio_suc){
			swal({title: "Error!", text: "El negocio se encuentra fuera del area de cobertura.", type: "error", confirmButtonText: "Aceptar"});

			return false;
		}

	    }

//            if( !carro || carro.total == 0 ){
            if( !carro || carro.cantidad == 0 ){
                swal({     title: "Atencion!",     text: "No hay productos dentro del carrito",     type: "warning",     confirmButtonText: "Aceptar"   }); 
                return false;
            }
            if( carro.total < store.store.minimo ){
                swal({     title: "Atencion!",     text: "El monto mínimo de pedido es "+ store.store.minimo +"",     type: "warning",     confirmButtonText: "Aceptar"   }); 
                return false;
            }

            if( !store.store.abierto ){
                swal({     title: "Atencion!",     text: "El negocio se encuentra cerrado.",     type: "warning",     confirmButtonText: "Aceptar"   }); 
                return false;
            }

            $scope.enableEnvio = false;
            carro.costo_envio = store.store.costo;

            carro.observacion = $scope.observacion;

            var tipo_pago = "tarjeta";
            if($scope.tipo_pago){
                tipo_pago = "efectivo";
            }

            carro.tipo_pago = tipo_pago;
//	    carro.distancia = $scope.ped_dist;

            console.log( carro );

            console.log("TIPO DE PAGO:");
            console.log($scope.tipo_pago);

            console.log("sucucheck:", store.store.sucursal);





            var data = {
				'sucursal' : URL+'/sucursales/'+store.store.sucursal.id+'/',
                'json' : JSON.stringify(carro),
                'uid' : 108,
//                'negocio' : URL+'/negocios/'+store.store.id+'/',
                'negocio' : URL+'/negocios/'+store.store.sucursal+'/',
                'user' : URL+'/users/'+usuario.value.user+'/',
                'direccion' : URL+'/ubicaciones/'+ usuario.ubicacion.id +'/',
		'jubi' : JSON.stringify(usuario.ubicacion),
                'estado' : 0,
	        'costo_envio' : carro.costo_envio,
		'tipo_pago' : carro.tipo_pago,
		'extras' : carro.extras,
                'total' : carro.total + carro.costo_envio,
		'observacion' : carro.observacion//,
//		'distancia' : carro.distancia
            };
            console.log("Lo que envio : ");
            console.log(data);

            swal({title: "Procesando pedido.",   text: "Gracias por su preferencia!",   timer: 2000 });
            $http.post(URL+'/pedidos/', data)

	    .success(function(){
		        swal("Enviado con éxito!", "Gracias por su preferencia!", "success");

                carrito.data = null;
                $scope.carrito = null;

                ons.navigator.pushPage('estadoPedidos.html');
            })
            .error(function(){
		$scope.enableEnvio = true;
                swal("Ha ocurrido un error, intente de nuevo","","warning");

            });

        }

    }]);

    myApp.controller('LocationController', ['$scope','$timeout','$http','usuario', function($scope,$timeout,$http,usuario){
 
	var coneccion = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

//$timeout(function(){ },1);
	$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });
       var map;
        var marker;
        var infowindow;

$scope.activo = false;

        $scope.location = null;

Object.toparams = function ObjecttoParams(obj) {
    var p = [];
    for (var key in obj) {
        p.push(key + '=' + obj[key]);
    }
    return p.join('&');
};

        function placeMarker(location) {
            if ( marker == null ) { 
                marker = new google.maps.Marker({
                      position: location,
                      map: map,
                      animation: google.maps.Animation.DROP
                });
            }else {
                marker.setPosition(location);
                //centra el mapa...
                //map.setCenter(location);
            }

            $scope.location = { 'lat' : location.lat(), 'lng' : location.lng() } ;
            console.log($scope.location);
            console.log(usuario);
          
        }

        function initialize() {
          var mapOptions = {
            zoom: 16
          };

          console.log("Antes de que toque...");
          console.log(document.getElementById('mapa_content'));

          map = new google.maps.Map(document.getElementById('mapa_content'),
              mapOptions);

//agregado para test de ubicacion sin gps//
//handleNoGeolocation(false);
	  var options = {
            map: map,
            position: new google.maps.LatLng(-25.2869219,-57.5885297),
            //content: content
          };

          //var infowindow = new google.maps.InfoWindow(options);
          map.setCenter(options.position);

	  placeMarker(options.position);

	  google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
	  });

//fin de agregado para test ubicacion sin gps//



          // Try HTML5 geolocation
          if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);
	map.setCenter(pos);

              var infowindow = new google.maps.InfoWindow({
                content: 'Usted esta aqui'
              });

              placeMarker(pos);

              google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
              });


              //map.setCenter(pos);

              console.log("Se supone que esta gua'u todo ya");
              console.log(map);


              console.log("Despues ....");
              console.log(document.getElementById('mapa_content'));

              


	      google.maps.event.addListener(map, 'click', function(event) {
	        placeMarker(event.latLng);
	      });


            }, function() {
              handleNoGeolocation(true);
            });

          } else {
            // Browser doesn't support Geolocation
            alert("No tiene geolocalización");
            handleNoGeolocation(false);
          }/**/

        }

        function handleNoGeolocation(errorFlag) {
          if (errorFlag) {
            var content = 'Error: La geolocalización falló. Favor Activar en las opciones del teléfono';
          } else {
            var content = 'Error: Tu navegador no soporta geolocalización.';
          }

          var options = {
            map: map,
            position: new google.maps.LatLng(-25.2869219,-57.5885297),
            content: content
          };

          var infowindow = new google.maps.InfoWindow(options);
          map.setCenter(options.position);

	  placeMarker(options.position);

	  google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
	  });



        }

        
        //initialize();
        $timeout(function(){
             initialize(); 

         },2000);


        $scope.$watch('nombre', function(newValue, oldValue) {
            if(infowindow){
                console.log("Hola... ");
                console.log($scope.nombre);
                infowindow.setContent($scope.nombre);
            }
        });



        $scope.addUbicacion = function(){
            if($scope.location){

                var nombre = $scope.nombre;
                var direccion = $scope.direccion;
                var referencia = $scope.referencia
                var lat = $scope.location.lat;
                var lon = $scope.location.lng;

		if( !nombre ){
			swal("Ups!","Ingrese el título de la ubicación.","warning");
			return;
		}

		if( !direccion ){
			swal("Ups!","Ingrese una dirección.","warning");
			return;
		}

                var data = {
                    "user": URL+"/users/"+ usuario.value.user +"/", 
                    "nombre": nombre, 
                    "direccion": direccion, 
                    "referencia": referencia, 
                    "lat": lat, 
                    "lon": lon
                }

                console.log(data);


                $http.post(URL+'/ubicaciones/', data)
                    .success( function(data, status, headers, config) {
                    
                        console.log(data);

			swal("Genial!", "La ubicación ha sido añadida.", "success");

                        ons.navigator.popPage();
			ons.navigator.pushPage('ubicacion.html');

                    })
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
			swal("Ha ocurrido un error, intente de nuevo","","warning");
                        console.log("Data:");
                        console.log(data);
                    });

                

            }else{
                swal("Ha ocurrido un error, intente de nuevo","","warning");
            }
        }

        $scope.editUbicacion = function(u){

var id = 70;

/*		$http.get(URL+'/ubicaciones/'+u.id+'/')*/
		$http.get(URL+'/ubicaciones/'+id+'/')
		.success( function(data, status, headers, config) {

			console.log(data);

			$scope.locationedit = data;

			//swal("Genial!", "La ubicación ha sido eliminada.", "success");
			//ons.navigator.pushPage('delubicacion.html');
		})
		.error(function(data, status, headers, config) {
			console.log(data);
			swal("Ha ocurrido un error, intente de nuevo","","warning");
		});

            if($scope.locationedit){

                var nombre = $scope.nombre;
                var direccion = $scope.direccion;
                var referencia = $scope.referencia
                var lat = $scope.location.lat;
                var lon = $scope.location.lng;

                var data = {
                    "user": URL+"/users/"+ usuario.value.user +"/", 
                    "nombre": nombre, 
                    "direccion": direccion, 
                    "referencia": referencia, 
                    "lat": lat, 
                    "lon": lon
                }

            }
        }


     }]);


    myApp.controller('LoginController', ['$scope','$http','usuario','sharedProperties', function($scope, $http, usuario,sharedProperties){

	var coneccion = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });

        $scope.logged = false;
	$scope.recover = STATICURL + '/recover/';

        function isLogged(){

           var uid = localStorage.getItem("uid");
	       var token = localStorage.getItem("token");
            
            if(uid){
               $scope.logged = true;
	           $http.defaults.headers.common["Authorization"]= 'Token ' + token;
               setUser(uid);
            }

        }

	$scope.openURL = function(urlString){
            console.log(urlString);
            navigator.app.loadUrl(urlString, {openExternal : true});
	};


        function setUser(uid){
            $http.get(URL+'/perfiles/'+ uid +'/')
            .success(function(data, status, headers, config) {
                console.log(data);
                usuario.value = data;
                sharedProperties.setValue('rubro', null);

                ons.navigator.pushPage('locales.html',{ animation : 'none'});


            })
            .error(function(data, status, headers, config) {
                console.log("ERROR!:");
                console.log(data);
            });

        }

        $scope.username = "";
        $scope.password = "";
        $scope.login = function(){


	   Object.toparams = function ObjecttoParams(obj) {
	    var p = [];
	    for (var key in obj) {
		p.push(key + '=' + obj[key]);
	    }
	    return p.join('&');
	   };

            var user = $scope.username;
            var pass = $scope.password;

            console.log(user);
            console.log(pass);

		var data = Object.toparams({'username' : user, 'password' : pass});

                $http.post(URL+'/logtok/', data , {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                    .success( function(data, status, headers, config) {
                        console.log("Data:");
                        console.log(data);

                        if(data.token){

			    
                            $http.defaults.headers.common["Authorization"]= 'Token ' + data.token;
            			    $http.get(URL+'/negocios/');
            			    var uid = data.uid
                            localStorage.setItem("uid", uid);
            			    localStorage.setItem("token", data.token);
                            setUser(uid)
                        }else{
                            console.log("wron pass");
                            swal({title: "Error!",text: "Usuario o Password incorrecto!",     type: "error",     confirmButtonText: "Aceptar"   });
                        }
                        
                    })
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log("Data:");
                        console.log(data);
                    });

        }

        isLogged();



    }]);


    myApp.controller('ProfileController', ['$scope','usuario', function($scope,usuario){


        $scope.usuario = usuario.value;

        $scope.editarperfil = function(){
            ons.navigator.pushPage('editarperfil.html');
        }

        $scope.resetpass = function(){
            ons.navigator.pushPage('resetpass.html');
        }

        $scope.logout = function(){
            localStorage.removeItem('uid');
            ons.tabbar.setActiveTab(0);
//	    $scope.ubicacion = '';
	    usuario.ubicacion = null;
//	    localStorage.removeItem('usuario.ubicacion');
        };

        $scope.test = function(){
            ons.navigator.pushPage('addLocation.html');
        }

        $scope.test = function(){
            ons.navigator.pushPage('editLocation.html');
        }

        $scope.delubicacion = function(){
            ons.navigator.pushPage('delubicacion.html');
        }
        
    }]);


    myApp.controller('RegistroController', ['$scope','$http','usuario', function($scope,$http,usuario){

	var coneccion = true;

$scope.enableEnvio = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });





        $scope.registrar = function(){

$scope.enableEnvio = false;

if (document.getElementById('pass').value != document.getElementById('pass_conf').value) {
//    document.getElementById('pass_conf').setCustomValidity('Passwords must match.');
	$scope.enableEnvio = true;
	swal("Ups!","La confimación de contraseña no coincide.","warning");
} else {
    document.getElementById('pass').setCustomValidity('');


            var nombre = $scope.nombre;
            var apellido = $scope.apellido;
            var celular = $scope.celular;
            var ci = $scope.ci;
            var razon = $scope.razon;
            var ruc = $scope.ruc;    
            var username = $scope.username;
            var password = $scope.password;
            var sms = $scope.sms;

            if( !username ){
                swal("Ups!","Ingrese un email válido.","warning");
		$scope.enableEnvio = true;
                return;
            }

            if( !celular ){
                swal("Ups!","Ingrese un número de celular válido\n [09xx xxx xxx].","warning");
		$scope.enableEnvio = true;
                return;
            }

            if( !nombre ){
                swal("Ups!","Ingrese un nombre.","warning");
		$scope.enableEnvio = true;
                return;
            }

            if( !apellido ){
                swal("Ups!","Ingrese un apellido.","warning");
		$scope.enableEnvio = true;
                return;
            }

            if( !password ){
                swal("Ups!","Ingrese un password.","warning");
		$scope.enableEnvio = true;
                return;
            }

            var data = {
                'username' : username,
                'password' : password
            }

            console.log(data);

            
            $http.post(URL+'/users/', data)
                    .success( function(data, status, headers, config) {
                        console.log("Data:");
                        console.log(data);
			
                        if(data.id){
                            var uid = data.id
                            localStorage.setItem("uid", uid);


                            var pdata =  { 
                                "nombre": nombre, 
                                "apellido": apellido, 
                                "genero": "", 
                                "nacimiento": null, 
                                "telefono": celular,
                                "ruc": ruc, 
                                "razon": razon,
                                "ci": ci,
                                "sms": sms,
                                "cercanos": false
                            }

                            console.log(pdata);
                            
                            $http.put(URL+'/perfiles/'+uid+'/', pdata)
                            .success( function(data, status, headers, config) {
                                console.log(data);
                                usuario.value = data;



                                Object.toparams = function ObjecttoParams(obj) {
                                var p = [];
                                for (var key in obj) {
                                p.push(key + '=' + obj[key]);
                                }
                                return p.join('&');
                                };


                                var data = Object.toparams({'username' : username, 'password' : password});

                                $http.post(URL+'/logtok/', data , {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                                .success( function(data, status, headers, config) {
                                    console.log("Data:");
                                    console.log(data);

                                    if(data.token){                
                                        $http.defaults.headers.common["Authorization"]= 'Token ' + data.token;
                                        localStorage.setItem("token", data.token);
					swal("Enviado con éxito!", "Gracias por registrarse!", "success");
					
					$scope.enableEnvio = true;

                                        ons.navigator.pushPage('registroexito.html');
                                    }

                                 })
                                .error(function(data, status, headers, config) {
                                    console.log(data);
					$scope.enableEnvio = true;
                                });
                            })
                            .error(function(data, status, headers, config) {
                                console.log(data);

				$scope.enableEnvio = true;
                            });



                        }
                        
                    })
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log("Data error:");
                        console.log(data.username);
			if(data.username == "Ya existe Usuario con este Nombre de usuario."){
				swal({title: "Error!",text: "Ya existe un Usuario registrado con este email!", type: "error",     confirmButtonText: "Aceptar"});
			}

			$scope.enableEnvio = true;

                    });
 }           
        }

    }]);

    myApp.controller('PosRControl', ['$scope','usuario', function($scope,usuario){

        console.log("=== En PosRegistro ====");
        $scope.usuario = usuario.value;
        console.log($scope.usuario);

        $scope.goBack = function(){
            console.log("nuuuu");
            ons.navigator.resetToPage('page1.html',{'animation' : 'none'});

        }

        
    }]);

    myApp.controller('RankController', ['$scope','$http','$sce', 'store', 'usuario', function($scope,$http,$sce,store,usuario){
	var coneccion = true;

	$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
	if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
	 });
	
	//$scope.comentario = "";

	var id = ons.navigator.getCurrentPage().options.rid;
	var ped = ons.navigator.getCurrentPage().options.ped;
	var star = "";

	$scope.rid = id;
//	$scope.star = '<div><ons-icon icon="fa-star" fixed-width="false" style="color: red">a</ons-icon></div>';
	for (var i = 1; i <= 5; i++) {
		if(i <= id){
			star = star + '<ons-icon><i class="fa fa-star" style="color: yellow"></i></ons-icon>';
		}else{
			star = star + '<ons-icon><i class="fa fa-star"></i></ons-icon>';
		}
	}
//	$scope.rank = '<i class="fa fa-star"></i>';
	$scope.rank = star;
	$scope.ranking = $sce.trustAsHtml($scope.rank);

                /*var ldata = {
                    "lat": lat, 
                    "lon": lon
                }*/
	$scope.calificar = function(){

			var comentario = $scope.comentario;
 console.log('comen', comentario);	

			$http({ method: 'PATCH', url: URL+'/pedidos/'+ped+'/', data: {'rating' : id, 'comentario' : comentario}})
				.success( function(data, status, headers, config) {
				console.log(data);
				swal("Gracias!", "Pedido Calificado con éxito.", "success");
				ons.navigator.resetToPage('page1.html',{'animation' : 'none'});
			})
				.error(function(data, status, headers, config) {
				console.log(data);
				swal({title: "Error!", text: "Mmmm ... intenta de nuevo", type: "error", confirmButtonText: "Aceptar"});
			}); 

	}


    }]);


    myApp.controller('PedidoController', ['$scope','$http','$sce','store','$interval', 'usuario', 'carrito', function($scope,$http,$sce,store,$interval,usuario,carrito){

	var coneccion = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });

//        var estados = ['Pendiente','Recibido','En Proceso','Enviado','Entregado','Cancelado'];
        var estados = [['Pendiente','red'],['Recibido','orange'],['En Proceso','blue'],['Enviado','green'],['Entregado','black'],['Cancelado','black']];
        var uid = usuario.value.user;
        var pedido = null;
        $scope.pedidosT = [];
        $scope.pedidos = [];
        $scope.negocios = []


	$scope.mostrarAgregados = function(lista){
		var message = '';
		var ttipo = '';
		for (var i = lista.length - 1; i >= 0; i--) {
			if(lista[i].tipo == 0){ttipo = "Agregar - ";}else if(lista[i].tipo == 1){ttipo = "Quitar - ";}
			message += ttipo + '\x09' + lista[i].nombre + '\n';
		}

		 swal("Detalle",message);

	}


	$scope.mostrarSabores = function(lista){
		var message = '';
		var ssabor = '';
		for (var i = lista.length - 1; i >= 0; i--) {
			ssabor = "Sabor - ";
			message += ssabor + '\x09' + lista[i].nombre + '\n';
		}

		 swal("Detalle",message);

	}


        function getNegocios(){
            $http.get(URL+'/negocios/')
            .success(function(data, status, headers, config) {
                if(data.results){
                    $scope.negocios = data.results;
                }
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });
        }

        function pedir(){
//            $http.get('http://test.deliverymas.com/api/v2/pedidos/?user='+uid)            
            $http.get(URL+'/pedidos/?user='+uid)
            .success(function(data, status, headers, config) {
console.log("Llego data");
                if(data){
                    console.log("Llego data");
                    console.log(data);
                    formatearPedido(data);
                }
            })
            .error(function(data, status, headers, config) {
                console.log('error en pedidos',data);
            });


        }



        function isInScope(p){
            for(var i = 0; i < $scope.pedidosT.length;i++){
                if($scope.pedidosT[i].id == p.id){
                    $scope.pedidosT[i] = p;
                    return true;
                }
            }
            return false
        }


        function rellenarNegocio(p,last){
            if($scope.negocios){
                var aux = p.negocio.split("/");
                var id =  aux[aux.length - 2];
                for(var i = 0; i < $scope.negocios.length; i++){
                    var data = $scope.negocios[i];
                    if( id == data.id){
                        p.negocio = data;
                        p.estado = estados[p.estado];
                        p.ped = data.id;
                    }
                }
                
                if(!isInScope(p)){
                    $scope.pedidosT.push(p);
                }

                if(last){
                        $scope.pedidos = $scope.pedidosT;
                }
            }

        }

        function formatearPedido(p){
                pedido = p;

                for(var i=0;i<pedido.length;i++){
                    var actual = pedido[i];

                    rellenarNegocio(actual, i == (pedido.length -1)  );
                }

        }

        $scope.thread = null;
        $scope.getPedidos = function(){
            getNegocios();
            console.log("Esta es la primera");
            pedir();      
            $scope.thread = $interval(pedir,5000);
                

        }

		$scope.verRank = function(id, ped){
			//modalranking.show();
			$scope.rid = 'hola'; 
			console.log('recibo que?',$scope.rid); 
			ons.navigator.pushPage('ranking.html', {rid: id, ped: ped});
			$scope.rid = id;
			//ons.navigator.pushPage('ranking.html');
		}


        $scope.verDetalle = function(p){

		var detalle = p.json;
		var numpedido = p.id;
		var tiempo = p.negocio.tiempo;
		var estado = p.estado;
		var rating = p.rating;
            var go = true;
            while(go){
                detalle = JSON.parse(detalle)
                if (typeof detalle == 'string' || detalle instanceof String){
                    go = true;
                    if(detalle == 'Object {}'){
                        detalle = null;
                        go = false;
                        break;
                    }
                }
                else{
                    go = false;
                    break;
                }

            }
console.log('rating', estado[0]);


	    $scope.tiempo = tiempo;
            $scope.detalle = detalle;
            $scope.numpedido = numpedido;
		if((estado[0] == 'Entregado' || estado[0] == 'Cancelado' )&& !rating){ $scope.ratingsi = false;}else{$scope.ratingsi = true;}
	    $scope.numest = p;

		if($scope.ratingsi){
			var star = "";
			for (var i = 1; i <= 5; i++) {
				if(i <= rating){
					star = star + '<ons-icon><i class="fa fa-star" style="color: yellow"></i></ons-icon>';
				}else{
					star = star + '<ons-icon><i class="fa fa-star"></i></ons-icon>';
				}
			}
			$scope.rank = star;
			$scope.calificacion = $sce.trustAsHtml($scope.rank);

		}

            console.log("quiero saber si tengo id pedido");
            console.log($scope.numpedido);
            console.log("detalle en estado",$scope.detalle);
            modaldetalle.show();
        }



	$scope.getRepetir = function (item){
	var producto = JSON.parse(JSON.stringify(item));
	var itemrepe = producto.products;
	itemrepe.sort();
	console.log('premenu ',itemrepe);
	if(carrito.data !== null ){
		carrito.data = null;
	}

        if(carrito.data === null){
                carrito.data = {};
                carrito.data.products = []
                carrito.data.total = 0;
                carrito.data.cantidad = 0;
		carrito.data.local = itemrepe[0].negocio;
        }

		$http.get(URL+'/negocios/'+carrito.data.local+'/')
                .success( function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log("Store:");
                    console.log(store);
                    console.log("Data Get Locales:", data);

			store.store = data;

			$http.get(URL+'/productos/?negocio='+carrito.data.local)
			.success( function(data, status, headers, config) {
				var menuactual = data.results;
				carrito.data.products = itemrepe;console.log('kkk',carrito.data.products);
console.log('menuactual ',menuactual); 
				for(var i = 0; i<carrito.data.products.length; i++){
console.log('buscar ',carrito.data.products[i]);
					var j = searchByRealId(menuactual,carrito.data.products[i]);
					if( j == -1){
						var norepetir = true;
						//carrito.data.products.splice(i,1);
					}else{

						
						//if(carrito.data.products[i].agregados.length>0 && menuactual[j].agregados.length>0){
						if(carrito.data.products[i].extras && carrito.data.products[i].extras.length>0){
							carrito.data.products[i].precio = menuactual[j].precio;
							for(var k = 0; k<carrito.data.products[i].extras.length; k++){
								var l = searchByRealId(menuactual[j].agregados,carrito.data.products[i].extras[k]);
								if( l == -1){
									var norepetir = true;
									//carrito.data.products.splice(i,1);
								}else{
									carrito.data.products[i].extras[k].precio = menuactual[j].agregados[l].precio;
									carrito.data.products[i].precio += carrito.data.products[i].extras[k].precio; 
									var tototaltal = carrito.data.products[i].precio;
								}
							}
						}
						//}

						if(carrito.data.products[i].selsabores && carrito.data.products[i].selsabores.length>0){
							carrito.data.products[i].precio = menuactual[j].precio;
							for(var k = 0; k<carrito.data.products[i].selsabores.length; k++){
								var l = searchById(menuactual[j].sabores,carrito.data.products[i].selsabores[k]);
carrito.data.products.sort();	
								if( l == -1){
									var norepetir = true;	var sacar = carrito.data.products[i];
									//console.log("jaja", carrito.data.products);
									//console.log("jiji", carrito.data.products[i]);
									//$scope.removeItem(carrito.data.products[i]);
									//carrito.data.products.splice(i,1);for(var x = 0; x<carrito.data.products.length; x++){
									var z = searchById(carrito.data.products,sacar);
									//console.log("jojo", carrito.data.products[z]);
									carrito.data.products.splice(z,1);
									//}
								}else{
									carrito.data.products[i].selsabores[k].precio = menuactual[j].sabores[l].precio;
									carrito.data.products[i].precio += Math.round(menuactual[j].sabores[l].precio / carrito.data.products[i].selsabores.length);
									var tototaltal = carrito.data.products[i].precio;
									
								}
							}
						}
						if(!carrito.data.products[i].selsabores && !carrito.data.products[i].extras){
							carrito.data.products[i].precio = menuactual[j].precio;
							var tototaltal = menuactual[j].precio * carrito.data.products[i].cantidad;
						}
						carrito.data.cantidad += carrito.data.products[i].cantidad;
console.log('wuwu',carrito.data.cantidad);
						//carrito.data.total += carrito.data.products[i].precio;
						carrito.data.total += tototaltal;
					}
				}

				if(norepetir){
					swal({title: "Disculpe", text: "No se puede repetir el pedido, al menos un ítem ya no se encuentra disponible.", type: "warning", confirmButtonText: "Aceptar"});
					ons.navigator.pushPage('page1.html',{'animation' : 'fade'});
				}else{
					ons.navigator.pushPage('page13.html',{'animation' : 'fade'});
				}

			})
	                .error(function(data, status, headers, config) {
				console.log("Data:");
				console.log(data);				
			})	

                })
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log("Data:");
                    console.log(data);
		    //swal("Es probable que el negocio no esté activo actualmente.","","error");
		    swal({title: "Ups!", text: "El negocio no está activo actualmente", type: "warning", confirmButtonText: "Aceptar"});
                });
	}




	$scope.cancel = function (item){
		var pid = item.id;

		swal({   title: "Seguro?",   text: "Realmente desea cancelar su pedido.",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, cancélalo!",cancelButtonText: "No, consérvalo.",   closeOnConfirm: false }, function(){ 

			$http.get(URL+'/pedidos/'+pid+'/')
			.success(function(data, status, headers, config) {

				    console.log("Llego cancelar");
				    console.log(data);
				if(data.estado == 0 ){
					$http({ method: 'PATCH', url: URL+'/pedidos/'+pid+'/', data: {'estado' : 5}})
						.success( function(data, status, headers, config) {
						console.log(data);
						swal("Cancelado!", "Pedido cancelado con éxito.", "success");
						ons.navigator.resetToPage('page1.html',{'animation' : 'none'});
					})
						.error(function(data, status, headers, config) {
						console.log(data);
						swal({title: "Error!", text: "Mmmm ... intenta de nuevo", type: "error", confirmButtonText: "Aceptar"});
					}); 
				}else{
					swal("Error!", "Su pedido ya fué procesado y no se puede cancelar.", "error");
				}


			})
			.error(function(data, status, headers, config) {
				console.log(data);
			});



		});		
	}

	$scope.confirmcancel = function (pid){

		$http({ method: 'PATCH', url: URL+'/pedidos/'+pid+'/', data: {'estado' : 5}})
			.success( function(data, status, headers, config) {
			console.log(data);
			swal("Cancelado!", "Pedido cancelado con éxito.", "success");
			ons.navigator.resetToPage('page1.html',{'animation' : 'none'});
		})
			.error(function(data, status, headers, config) {
			console.log(data);
			swal({title: "Error!", text: "Mmmm ... intenta de nuevo", type: "error", confirmButtonText: "Aceptar"});
		});

	}

        $scope.getPedidos();

        $scope.$on('$destroy', function(){
            $interval.cancel($scope.thread);
        });


    }]);

    myApp.controller('UbicacionCtrl', ['$scope','usuario','$http','$timeout', function ($scope,usuario,$http,$timeout) {

	var coneccion = true;

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });

        $scope.ubicaciones = [];
        $scope.seleccionado = -1;

        function getUbicaciones(){

            var uid = usuario.value.user;
            $http.get(URL+'/ubicaciones/?user='+uid)
            .success(function(data, status, headers, config) {
                if(data){
                    console.log(data);

                    $scope.ubicaciones = data;
                    usuario.ubicaciones = data;

                    if( usuario.ubicacion ){
                        $scope.seleccionado = usuario.ubicacion.id;
                    }

                }else{
                    console.log("No tiene aun...");
                }

            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });


        }

        $scope.selectUbicacion = function(u){
            console.log(u);
            usuario.ubicacion = u;
            $scope.seleccionado = u.id;

	    ons.navigator.pushPage('locales.html',{animation:'lift'});
        }

        $scope.isSelected = function(u){
            console.log ( "Dentro de IS SELECTED" );
            console.log(u);
            console.log(usuario.ubicacion);
            if( usuario.ubicacion && usuario.ubicacion != null ){
                if(usuario.ubicacion.id = u.id){
                    return true;
                }
            }

            return false;
        }

        $scope.goBack = function(){
            console.log("nuuuu");
            ons.navigator.resetToPage('locales.html',{'animation' : 'none'});

        }


       $scope.removeUbicacion = function(u){


	console.log('en borrar ubicacion');

                console.log('u en del',u);console.log('data0 en del',usuario.ubicacion);
			if(usuario.ubicacion){if(usuario.ubicacion.id == u.id){usuario.ubicacion = null;}}
			    $http.delete(URL+'/ubicaciones/'+u.id+'/', u).success( function(data, status, headers, config) {

                                console.log('data en del',usuario.ubicacion);
				
				swal("Genial!", "La ubicación ha sido eliminada.", "success");

				ons.navigator.pushPage('delubicacion.html');
                            })
                            .error(function(data, status, headers, config) {
                                console.log(data);
				swal("Ha ocurrido un error, intente de nuevo","","warning");
                            });

        }

	$scope.edit = function(u){

		$scope.ubi = u.id; 
		console.log('ubu',$scope.ubi); 
		ons.navigator.pushPage('editLocation.html', {ubi: u.id});

	}


        $scope.setUbicacion = function(u){

//var id = 67;
//$scope.nombre = u.nombre;
		ons.navigator.pushPage('editLocation.html', {ubi: u.id});

/*		$http.get(URL+'/ubicaciones/'+u.id+'/')
//		$http.get(URL+'/ubicaciones/'+id+'/')
		.success( function(data, status, headers, config) {

			console.log('a editar: ',data);

			$scope.nombre = data.nombre;
			$scope.direccion = data.direccion;
			$scope.referencia = data.referencia;
			$scope.lat = data.lat;
			$scope.lon = data.lon;

			console.log('nombree: ',$scope.nombree);

			swal("Ay!", "La ubicación ha sido eliminada.", "success");
//			ons.navigator.pushPage('editLocation.html');
		})
		.error(function(data, status, headers, config) {
			console.log(data);
			swal("Ha ocurrido un error, intente de nuevo","","warning");
		});


		var map;
		var marker;
		var infowindow;

		$scope.activo = false;

			$scope.location = null;

		Object.toparams = function ObjecttoParams(obj) {
		    var p = [];
		    for (var key in obj) {
			p.push(key + '=' + obj[key]);
		    }
		    return p.join('&');
		};

			function placeMarker(location) {
			    if ( marker == null ) { 
				marker = new google.maps.Marker({
				      position: location,
				      map: map,
				      animation: google.maps.Animation.DROP
				});
			    }else {
				marker.setPosition(location);
				//centra el mapa...
				//map.setCenter(location);
			    }

			    $scope.location = { 'lat' : location.lat(), 'lng' : location.lng() } ;
			    console.log($scope.location);
			    console.log(usuario);
			  
			}

			function initialize() {
			  var mapOptions = {
			    zoom: 16
			  };

			  console.log("Antes de que toque...");
			  console.log(document.getElementById('mapa_content'));

			  map = new google.maps.Map(document.getElementById('mapa_content'),
			      mapOptions);

		//agregado para test de ubicacion sin gps//
		//handleNoGeolocation(false);
			var options = {
			    map: map,
			    position: new google.maps.LatLng($scope.lat,$scope.lon),
			    //content: content
			  };

			  var infowindow = new google.maps.InfoWindow(options);
			  map.setCenter(options.position);

			  placeMarker(options.position);

			  google.maps.event.addListener(map, 'click', function(event) {
				placeMarker(event.latLng);
			  });

		//fin de agregado para test ubicacion sin gps//



			}



		
			//initialize();
			$timeout(function(){
			     initialize(); 

			 },2000);/*


			$scope.$watch('nombre', function(newValue, oldValue) {
			    if(infowindow){
				console.log("Hola... ");
				console.log($scope.nombre);
				infowindow.setContent($scope.nombre);
			    }
			});

$scope.nombre =$scope.nombree;*/

	}

	
	$scope.editUbicacion = function(u){

  //           if($scope.location){

//swal("hola mierda");
//var id = 67;
                var nombre = $scope.nombre;
                var direccion = $scope.direccion;
                var referencia = $scope.referencia
                var lat = $scope.location.lat;
                var lon = $scope.location.lng;

		if( !nombre ){
			swal("Ups!","Ingrese el título de la ubicación.","warning");
			return;
		}

		if( !direccion ){
			swal("Ups!","Ingrese una dirección.","warning");
			return;
		}

                var ldata = {
                    //"user": URL+"/users/"+ usuario.value.user +"/", 
                    "nombre": nombre, 
                    "direccion": direccion, 
                    "referencia": referencia, 
                    "lat": lat, 
                    "lon": lon
                }

		$http({ method: 'PATCH', url: URL+'/ubicaciones/'+u.id+'/', data: ldata})
			.success( function(data, status, headers, config) {
			console.log(data);
			swal("Genial!", "Ubicación actualizada con éxito.", "success");

			ons.navigator.resetToPage('page1.html',{'animation' : 'none'});
		})
			.error(function(data, status, headers, config) {
			console.log(data);
			swal({title: "Error!", text: "Mmmm ... intenta de nuevo", type: "error", confirmButtonText: "Aceptar"});
		}); 


    //        }
	}




        getUbicaciones();
        
    }]);

    myApp.controller('EditController', ['$scope','$http','usuario', function($scope,$http,usuario){

	var coneccion = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });

	var uid = usuario.value.user;
	
	$scope.nombre = usuario.value.nombre;
	$scope.apellido = usuario.value.apellido;
	$scope.celular = usuario.value.telefono;
	$scope.ci = usuario.value.ci;
	$scope.razon = usuario.value.razon;
	$scope.ruc = usuario.value.ruc;
	$scope.sms = usuario.value.sms;
	$scope.cercanos = usuario.value.cercanos;
	//$scope.username = usuario.value.username;
console.log('dsds', usuario.value);

        $scope.actualizar = function(){

            var nombre = $scope.nombre;
            var apellido = $scope.apellido;
            var celular = $scope.celular;
            var ci = $scope.ci;
            var razon = $scope.razon;
            var ruc = $scope.ruc;
            var username = $scope.username;
            var sms = $scope.sms;
            var cercanos = $scope.cercanos;

 /*           if( !username ){
                swal("Ingrese un email válido.");
                return;
            }*/

            if( !celular ){
                swal("Ups!","Ingrese un número de celular válido\n [09xx xxx xxx].","warning");console.log('error cel',celular);
                return;
            }

            if( !nombre ){
                swal("Ups!","Ingrese un nombre.","warning");
                return;
            }

            if( !apellido ){
                swal("Ups!","Ingrese un apellido.","warning");
                return;
            }

           

                            var pdata =  {
//                                "username": username,
                                "nombre": nombre, 
                                "apellido": apellido, 
                                "telefono": celular, 
                                "ruc": ruc, 
                                "ci": ci,
                                "razon": razon,
				"sms": sms,
				"cercanos": cercanos
                            }

		    $http({ method: 'PATCH', url: URL+'/perfiles/'+uid+'/', data: pdata})
	    		.success( function(data, status, headers, config) {
	                console.log(data);
			swal("Enviado con éxito!", "Perfil actualizado con exito!", "success");
			ons.navigator.resetToPage('page1.html',{'animation' : 'none'});
	            })
	            .error(function(data, status, headers, config) {
	                console.log(data);
			swal({title: "Error!", text: "Mmmm ... intenta de nuevo", type: "error", confirmButtonText: "Aceptar"});
	            });

          
        }



    }]);

    myApp.controller('PassController', ['$scope','$http','usuario', function($scope,$http,usuario){

	var coneccion = true;

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });

	var uid = usuario.value.user;

        $scope.actualizar = function(){

		if (document.getElementById('pass').value != document.getElementById('pass_conf').value) {
		    document.getElementById('pass_conf').setCustomValidity('Passwords must match.');
			swal("Ups!","La confimación de contraseña no coincide.","warning");
		} else {
		    document.getElementById('pass').setCustomValidity('');

			   var password = $scope.password;

			    if( !password ){
				swal("Ups!","Ingrese un password.","warning");
				return;
			    }

				    $http({ method: 'PATCH', url: URL+'/users/'+uid+'/', data: {'password' : password}})
			    		.success( function(data, status, headers, config) {
					console.log(data);
					swal("Enviado con éxito!", "Password cambiado con exito", "success");
					ons.navigator.resetToPage('page1.html',{'animation' : 'none'});
				    })
				    .error(function(data, status, headers, config) {
					console.log(data);
					swal({title: "Error!", text: "Mmmm ... intenta de nuevo", type: "error", confirmButtonText: "Aceptar"});
				    });

		 }           
        }

    }]);


    myApp.controller('EditlocController', ['$scope','$timeout','$http','usuario', function($scope,$timeout,$http,usuario){
 
	var coneccion = true;
//console.log('recibe: ',ubi)

//if(!($scope.$watch('online', function(newStatus) {  }))){ons.navigator.pushPage('page2.html', { animation: "fade" });}

//$timeout(function(){ },1);
	$scope.$watch('online', function(coneccion) { $scope.esta = coneccion ? 'anda' : 'no anda'; console.log('conecta:', $scope.esta);
if(!coneccion){ons.navigator.pushPage('page2.html', { animation: "fade" });}
 });


var id = ons.navigator.getCurrentPage().options.ubi;

console.log('paso de var: ',id );

        $scope.setUbicacion = function(){

//		$http.get(URL+'/ubicaciones/'+u.id+'/')
		$http.get(URL+'/ubicaciones/'+id+'/')
		.success( function(data, status, headers, config) {

			console.log(data);

			$scope.nombre = data.nombre;
			$scope.direccion = data.direccion;
			$scope.referencia = data.referencia;
			$scope.lat = data.lat;
			$scope.lon = data.lon	;

			//swal("Genial!", "La ubicación ha sido eliminada.", "success");
			//ons.navigator.pushPage('delubicacion.html');
		})
		.error(function(data, status, headers, config) {
			console.log(data);
			swal("Ha ocurrido un error, intente de nuevo","","warning");
		});


		var map;
		var marker;
		var infowindow;

		$scope.activo = false;

			$scope.location = null;

		Object.toparams = function ObjecttoParams(obj) {
		    var p = [];
		    for (var key in obj) {
			p.push(key + '=' + obj[key]);
		    }
		    return p.join('&');
		};

			function placeMarker(location) {
			    if ( marker == null ) { 
				marker = new google.maps.Marker({
				      position: location,
				      map: map,
				      animation: google.maps.Animation.DROP
				});
			    }else {
				marker.setPosition(location);
				//centra el mapa...
				//map.setCenter(location);
			    }

			    $scope.location = { 'lat' : location.lat(), 'lng' : location.lng() } ;
			    console.log($scope.location);
			    console.log(usuario);
			  
			}

			function initialize() {
			  var mapOptions = {
			    zoom: 16
			  };

			  console.log("Antes de que toque...");
			  console.log(document.getElementById('mapa_content'));

			  map = new google.maps.Map(document.getElementById('mapa_content'),
			      mapOptions);

		//agregado para test de ubicacion sin gps//
		//handleNoGeolocation(false);
			var options = {
			    map: map,
			    position: new google.maps.LatLng($scope.lat,$scope.lon),
			    //content: content
			  };

			  //var infowindow = new google.maps.InfoWindow(options);
			  map.setCenter(options.position);

			  placeMarker(options.position);

			  google.maps.event.addListener(map, 'click', function(event) {
				placeMarker(event.latLng);
			  });

		//fin de agregado para test ubicacion sin gps//



			}



		
			//initialize();
			$timeout(function(){
			     initialize(); 

			 },2000);


			/**/$scope.$watch('nombre', function(newValue, oldValue) {
			    if(infowindow){
				console.log("Hola... ");
				console.log($scope.nombre);
				infowindow.setContent($scope.nombre);
			    }
			});



	}

	
	$scope.editUbicacion = function(){

  //           if($scope.location){

                var nombre = $scope.nombre;
                var direccion = $scope.direccion;
                var referencia = $scope.referencia
                var lat = $scope.location.lat;
                var lon = $scope.location.lng;

		if( !nombre ){
			swal("Ups!","Ingrese el título de la ubicación.","warning");
			return;
		}

		if( !direccion ){
			swal("Ups!","Ingrese una dirección.","warning");
			return;
		}

                var ldata = {
                    //"user": URL+"/users/"+ usuario.value.user +"/", 
                    "nombre": nombre, 
                    "direccion": direccion, 
                    "referencia": referencia, 
                    "lat": lat, 
                    "lon": lon
                }

		$http({ method: 'PATCH', url: URL+'/ubicaciones/'+id+'/', data: ldata})
			.success( function(data, status, headers, config) {
			console.log(data);
			swal("Genial!", "Ubicación actualizada con éxito.", "success");
usuario.ubicacion = data;
console.log('a verga: ', usuario.ubicacion);
			ons.navigator.resetToPage('page1.html',{'animation' : 'none'});
		})
			.error(function(data, status, headers, config) {
			console.log(data);
			swal({title: "Error!", text: "Mmmm ... intenta de nuevo", type: "error", confirmButtonText: "Aceptar"});
		}); 


    //        }
	}

$scope.setUbicacion();

     }]);






})();$scope.products[j].cantidad = 0; console.log('nooo', $scope.products[j])
