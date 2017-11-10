'use strict';
//console.clear();
function dateDiff(date1, date2) {

    var diff = {}                           // Initialisation du retour
    var tmp = date2 - date1;
    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes
    tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes
    tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    return diff;

}
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
function generatePwd() {
    var pwd = Math.random().toString(36).slice(-6);
    $(document).find("#password").val(pwd);
    $(document).find("#password1").val(pwd);
}
function generateLogin() {
    var firstCharLastname = $("#last_name").val().substr(0, 1).toUpperCase();
    var firstCharFirstname = $("#first_name").val().substr(0, 1).toUpperCase();
    if (firstCharFirstname === "" || firstCharLastname === "") {
        toastr.info("Veuillez saisir le Nom & le Prénom");
    } else {
        var login = firstCharFirstname + firstCharLastname + parseInt(Math.random() * 70 * 1000) + "-CET";
        $(document).find("#username").val(login);
    }
}

function textToSound(Texte) {
    var synth = window.speechSynthesis;
    if (synth) {
        var utterThis = new SpeechSynthesisUtterance(Texte);
        synth.speak(utterThis);
    }
}
function decodeBarcode(barCode) {
    var loopBarcode = barCode;
    loopBarcode = loopBarcode.replace(/&/g, '1');
    loopBarcode = loopBarcode.replace(/é/g, '2');
    loopBarcode = loopBarcode.replace(/"/g, '3');
    loopBarcode = loopBarcode.replace(/'/g, '4');
    loopBarcode = loopBarcode.replace(/\(/g, '5');
    loopBarcode = loopBarcode.replace(/-/g, '6');
    loopBarcode = loopBarcode.replace(/è/g, '7');
    loopBarcode = loopBarcode.replace(/_/g, '8');
    loopBarcode = loopBarcode.replace(/ç/g, '9');
    loopBarcode = loopBarcode.replace(/à/g, '0');
    loopBarcode = loopBarcode.replace(/\)/g, '-');


    loopBarcode = loopBarcode.replace(/°/g, '-');
    return loopBarcode;
}
function initSelectize() {
    var xhr;
    var select_state, $select_state;
    var select_city, $select_city;
    var select_localite, $select_localite;
//    setInterva    l(function () {
    $select_state = $('#villeValue').selectize({
        onChange: function (value) {
            console.log(value);
            var dataVille = {
                Ville: {
                    id: value
                }
            };
            if (!value.length)
                return;
            select_city.disable();
            select_city.clearOptions();
            select_city.load(function (callback) {
//                console.log('lool');
                xhr && xhr.abort();
                xhr = $.ajax({
                    url: api_url() + 'villes/list_delegations_ville',
                    type: 'POST',
                    data: dataVille,
                    error: function () {
                        callback();
                    },
                    success: function (results) {
                        select_city.enable();
//                        initSelectizeLocalite();
                        console.log(results.data);
                        callback(results.data);
                    }
                });
            });
        }
    });


    $select_city = $('#select-country').selectize({
        valueField: 'id',
        labelField: 'name',
        searchField: ['name'],
        onChange: function (value) {
            console.log(value);
            var dataDelegation = {
                Delegation: {
                    id: value
                }
            };
            if (!value.length)
                return;
            select_localite.disable();
            select_localite.clearOptions();
            select_localite.load(function (callback) {
//                console.log('lool');
                xhr && xhr.abort();
                xhr = $.ajax({
                    url: api_url() + 'villes/list_localites_ville',
                    type: 'POST',
                    data: dataDelegation,
                    error: function () {
                        callback();
                    },
                    success: function (results) {
                        select_localite.enable();
                        console.log(results.data);
                        callback(results.data);
                    }
                });
            });
        }
    });
    $select_localite = $('#select-localite').selectize({
        valueField: 'id',
        labelField: 'name',
        searchField: ['name']
    });
    select_localite = $select_localite[0].selectize;
    select_city = $select_city[0].selectize;
//    setInterval(function () {
    select_state = $select_state[0].selectize;
    console.log(select_state);
//    }, 2000);
    select_localite.disable();
    select_city.disable();

    console.log(select_city);
//    }, 1500);
}
//function decodeBarcode(barCode) {
//    var loopBarcode = barCode;
//    loopBarcode = loopBarcode.replace(/&/g, '1');
//    loopBarcode = loopBarcode.replace(/é/g, '2');
//    loopBarcode = loopBarcode.replace(/"/g, '3');
//    loopBarcode = loopBarcode.replace(/'/g, '4');
//    loopBarcode = loopBarcode.replace(/\(/g, '5');
////    loopBarcode = loopBarcode.replace(/-/g, '6');
//    loopBarcode = loopBarcode.replace(/è/g, '7');
//    loopBarcode = loopBarcode.replace(/_/g, '8');
//    loopBarcode = loopBarcode.replace(/ç/g, '9');
//    loopBarcode = loopBarcode.replace(/à/g, '0');
//    loopBarcode = loopBarcode.replace(/\)/g, '-');
//    return loopBarcode;
//}
function populateTd() {
    
}




function cleanTableDuplicate() {
    var seen = {};
    $('#CommandeLivreur tr').each(function () {
        var txt = $(this).children().eq(1).text();
//        console.log(txt);
        if (seen[txt])
            $(this).remove();
        else
            seen[txt] = true;
    });
}
function showIndicateur() {
//            console.clear();
    var total_ht = 0;
    var total_tva = 0;
    var total_ttc_net = 0;
    var indicateur = 0;
    var remise_product = 0;
    $('tr#itemProduct').each(function (i, v) {
        var qte = parseFloat($(v).children().eq(4).text());
        var remise = parseFloat($(v).children().eq(5).text());
        var ht = parseFloat($(v).children().eq(2).attr('data-ht').replace(" ", ""));
        var dataHT = parseFloat($(v).children().eq(2).attr('data-ht').replace(" ", ""));
        if ($.trim($(v).children().eq(1).text()) === "Main d'oeuvre") {
            dataHT = 0;
        }
        var tva = parseFloat($(v).children().eq(3).attr('data-tva'));
        remise_product = remise_product + (ht * qte * remise / 100);
        total_tva = total_tva + (ht * qte * (1 - remise / 100) * tva / 100);
        total_ht = total_ht + (ht * qte * (1 - remise / 100));
        indicateur = indicateur + (((dataHT * (1 - remise / 100)) - parseFloat($(v).attr('data-achat'))) * qte);
    });
    var indicateur_final = parseFloat(indicateur) - (parseFloat(total_ht) * parseFloat($('#RemiseGlob').val()) / 100);
    console.log("Indicateur Final: " + indicateur_final);
    setTimeout(function () {
//        $('#Indicateur').text(parseFloat(indicateur_final).toFixed(3));
    }, 500);
}
function totalDevis() {
    var total_ht = 0;
    var total_tva = 0;
    var total_ttc_net = 0;
    var indicateur = 0;
    var remise_product = 0;
    var remiseglobale = parseFloat($('#RemiseGlob').val()) || 0;
    $('tr#itemProduct').each(function (i, v) {
        var qte = parseFloat($(v).children().eq(4).text());
        var remise = parseFloat($(v).children().eq(5).text());
        var ht = parseFloat($(v).children().eq(2).attr('data-ht').replace(" ", ""));
        if (ht == 0) {
            ht = parseFloat($(v).children().eq(2).attr('data-ht-indicateur').replace(" ", ""));
        }
        var ht_indicateur = parseFloat($(v).children().eq(2).attr('data-ht-indicateur').replace(" ", ""));
        if ($.trim($(v).children().eq(1).text()) === "Main d'oeuvre") {
            ht_indicateur = 0;
        }
        var tva = parseFloat($(v).children().eq(3).attr('data-tva'));
        remise_product = remise_product + (ht * qte * remise / 100);
        total_tva = total_tva + (ht * qte * (1 - remise / 100) * tva / 100);
        total_ht = total_ht + (ht * qte * (1 - remise / 100));
        var prixProd = $(v).attr('data-priceprod');
        var prixAchat = $(v).attr('data-achat');
        var remiseVal = parseFloat($.trim($(v).children().eq(5).text()));
        var remiseProd = (prixProd * remiseVal / 100) || 0;
        console.log(remiseProd);
        indicateur = indicateur + ((prixProd - remiseProd - prixAchat) * qte);
//        indicateur = indicateur + (((ht_indicateur * (1 - remise / 100)) - parseFloat($(v).attr('data-achat'))) * qte);
    });
    var remiseGlobaleHt = total_ht * remiseglobale / 100;
    //calcul final indicateur
    console.log("indicateur avant remise =>" + indicateur);
    indicateur = indicateur - remiseGlobaleHt;
    console.log("totalHT =>" + total_ht);
    console.log("totalHT net =>" + (total_ht - remiseGlobaleHt));
    console.log("indicateur après remise =>" + indicateur);
    var total_ht_final = parseFloat(total_ht) * (1 - remiseglobale / 100);
    var total_tva_final = parseFloat(total_tva) * (1 - remiseglobale / 100);
    var remise_final = parseFloat(remise_product) + (parseFloat(total_ht) * remiseglobale / 100);
//    var indicateur_frtyuklinal = parseFloat(indicateur) - (parseFloat(total_ht) * parseFloat($('#RemiseGlob').val()) / 100);
    setTimeout(function () {
        $('#remiseglobale').text(remise_final.toFixed(3));
        $('#total_ht').text(total_ht_final.toFixed(3));
        $('#total_tva').text(total_tva_final.toFixed(3));
        $('#Indicateur').text(indicateur.toFixed(3));
    }, 500);
    setTimeout(function () {
        var timbre = parseFloat($("#timbre_fiscale").text().replace(",", "."));
        var ht_net = parseFloat($('#total_ht').text().replace(" ", ""));
        var tva_net = parseFloat($('#total_tva').text().replace(" ", ""));
        $('#net_ttc').text((parseFloat(ht_net) + parseFloat(tva_net) + parseFloat(timbre)).toFixed(3));
    }, 1500);
}

function base_url(segment) {
    // get the segments
    var pathArray = window.location.pathname.split('/');
    // find where the segment is located
    var indexOfSegment = pathArray.indexOf(segment);
    // make base_url be the origin plus the path to the segment
    return window.location.origin + pathArray.slice(0, indexOfSegment).join('/') + '/';
}
function api_url() {
//    var apiUrl = "http://192.168.1.130/api/app/webroot/index.php/";
    var apiUrl = "http://localhost/amy_erp/";
    return apiUrl;
}
function app_url() {
//    var appUrl = "http://192.168.1.130/erp/#";
//    if (document.location.protocol.search("https") < 0) {
        appUrl = "http://localhost/amyerp/#";
//    }
    return appUrl;

}
/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    'starter.services',
    'starter.controllers.caisse',
    'starter.services.p2',
    'starter.controllers',
    'starter.controllers.p2',
    'starter.controllers.stocks',
    'starter.directives',
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngFileUpload",
//    "vs-repeat",
//    "customFilter",
//    'ngMaterial',
//    'ngMessages',
//    'material.svgAssetsCache',
//    'ngAnimate',
    'io-barcode',
//    'ui-tinymce',  
    'ngCookies',
    'angularUtils.directives.dirPagination'
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(function ($ocLazyLoadProvider, $httpProvider) {
//    $httpProvider.defaults.headers.common = {};
//    $httpProvider.defaults.headers.post = {};
//    $httpProvider.defaults.headers.put = {};
//    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.useXDomain = true;
//    delete $httpProvider.defaults.headers.common['X-Requested-With'];
//    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $ocLazyLoadProvider.config({
        // global configs go here
    });
});
MetronicApp.filter('custom', function () {
    return function (input, search) {
        if (!input)
            return input;
        if (!search)
            return input;
        var expected = ('' + search).toLowerCase();
        var result = {};
        angular.forEach(input, function (value, key) {
            var actual = ('' + value).toLowerCase();
            if (actual.indexOf(expected) !== -1) {
                result[key] = value;
            }
        });
        return result;
    }
});
/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/
/**
 `$controller` will no longer look for controllers on `window`.
 The old behavior of looking on `window` for controllers was originally intended
 for use in examples, demos, and toy apps. We found that allowing global controller
 functions encouraged poor practices, so we resolved to disable this behavior by
 default.
 
 To migrate, register your controllers with modules rather than exposing them
 as globals:
 
 Before:
 
 ```javascript
 function MyController() {
 // ...
 }
 ```
 
 After:
 
 ```javascript
 angular.module('myApp', []).controller('MyController', [function() {
 // ...
 }]);
 
 Although it's not recommended, you can re-enable the old behavior like this:
 
 ```javascript
 angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
 // this option might be handy for migrating old apps, but please don't use it
 // in new ones!
 $controllerProvider.allowGlobals();
 }]);
 **/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
        // this option might be handy for migrating old apps, but please don't use it
        // in new ones!
        $controllerProvider.allowGlobals();
    }]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
 *********************************************/
MetronicApp.filter('words', function () {
    function isInteger(x) {
        return x % 1 === 0;
    }


    return function (value) {
        if (value && isInteger(value))
            return  toWords(value);

        return value;
    };

});


var th = ['', 'mille', 'million', 'milliard', 'billion'];
var dg = ['zero', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
var tn = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
var tw = ['viegt', 'trente', 'quarente', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];


function toWords(s)
{
    s = s.toString();
    s = s.replace(/[\, ]/g, '');
    if (s != parseFloat(s))
        return "n'est pas un nombre";
    var x = s.indexOf('.');
    if (x == -1)
        x = s.length;
    if (x > 15)
        return 'Trop Long';
    var n = s.split('');
    var str = '';
    var sk = 0;
    for (var i = 0; i < x; i++)
    {
        if ((x - i) % 3 == 2)
        {
            if (n[i] == '1')
            {
                str += tn[Number(n[i + 1])] + ' ';
                i++;
                sk = 1;
            } else if (n[i] != 0)
            {
                str += tw[n[i] - 2] + ' ';
                sk = 1;
            }
        } else if (n[i] != 0)
        {
            str += dg[n[i]] + ' ';
            if ((x - i) % 3 == 0)
                str += 'cent ';
            sk = 1;
        }


        if ((x - i) % 3 == 1)
        {
            if (sk)
                str += th[(x - i - 1) / 3] + ' ';
            sk = 0;
        }
    }
    if (x != s.length)
    {
        var y = s.length;
        str += 'point ';
        for (var i = x + 1; i < y; i++)
            str += dg[n[i]] + ' ';
    }
    return str.replace(/\s+/g, ' ');
}

window.toWords = toWords;
/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
        // supported languages
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageContentWhite: true, // set page content layout
                pageBodySolid: false, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
            },
            assetsPath: 'assets',
            globalPath: 'assets/global',
            layoutPath: 'assets/layouts/layout4',
        };

        $rootScope.settings = settings;

        return settings;
    }]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', function ($scope, $rootScope, $cookies, $location, $cookieStore, PostFactory) {
    $scope.$on('$viewContentLoaded', function () {
        App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
    $scope.logout = function ($event) {
        console.log('here');
        $event.preventDefault();
        $scope.usersLogout = PostFactory.logout().then(function (response) {
            $cookieStore.remove('sessionConnected');
            $cookies.remove('sessionID');
            $location.path('/login');
            $("#Menu_bar").hide();
            $(".Menu_bar").hide();
        });
    };
});

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', function ($scope, $http) {
    console.log('ssl');
    var forceSSL = function () {
//        setTimeout(function () {
//        if (document.location.protocol.search("https") >= 0) {
//            window.location.href = base_url().replace('http', 'https');
//        }
//        }, 1000);
    };
    forceSSL();
    var url = api_url() + "pages/purge_cache";
    $http.post(url)
            .success(function (data, status) {
                $scope.purge_cache = data.success;
            }).error(function (data, status) {
    });
//        $scope.purge_cache = PostFactory.purgeCache().then(function (purge_cache) {
//            $scope.purge_cache = purge_cache;
//        },
//                function (msg) {
//                    alert(msg);
//                }
//        );
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
});

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initSidebar(); // init sidebar
        });
    }]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Demo.init(); // init theme panel
        });
    }]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            setTimeout(function () {
                QuickSidebar.init(); // init quick sidebar        
            }, 2000)
        });
    }]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Demo.init(); // init theme panel
        });
    }]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
        $scope.$on('$includeContentLoaded', function () {
            Layout.initFooter(); // init footer
        });
    }]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        // Redirect any unmatched url
         $urlRouterProvider.otherwise("/dashboard.html");

        $stateProvider

                //caisee
                .state('caisse', {
                    url: "/app-caisse",
                    templateUrl: "views/caisse/app_caisse.html",
                    data: {blankk: 'caisse'},
                    controller: "CaisseController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/jquery-ui.js',
//                                            'js/combobox.js',
                                            'js/controllers/GeneralPageController.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js'


                                    ]
                                });
                            }]
                    }
                })

                // Dashboard
                .state('dashboard', {
                    url: "/dashboard.html",
                    templateUrl: "views/dashboard.html",
                    data: {pageTitle: 'Admin Dashboard Template'},
                    controller: "DashboardController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // Gestion commercial
                .state('appGestionCommercil', {
                    url: "/app-gestion-commercials",
                    templateUrl: "views/app_commercial.html",
                    data: {pageTitle: 'App gestion commercial'},
                    controller: "DashboardController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/global/plugins/typeahead/handlebars.min.js',
                                        'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'js/jquery-ui.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })

                // app reglement
                .state('APPreglement', {
                    url: "/reglements",
                    templateUrl: "views/app_reglement.html",
                    data: {pageTitle: 'Règlement'},
                    controller: "DashboardController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // login
                .state('login', {
                    url: "/login",
                    templateUrl: "views/login.html",
                    data: {pageTitle: 'Login'},
                    controller: "LoginCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js'
                                    ]
                                });
                            }]
                    }
                })

                // Blank Page
                .state('blank', {
                    url: "/blank",
                    templateUrl: "views/blank.html",
                    data: {pageTitle: 'Blank Page Template'},
                    controller: "BlankController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'js/controllers/BlankController.js'
                                    ]
                                });
                            }]
                    }
                })
                // Configuration
                .state('config', {
                    url: "/config",
                    templateUrl: "views/config.html",
                    data: {pageTitle: 'Configuration de l\'application'},
                    controller: "ErpCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Configuration de pointage
                .state('configPointage', {
                    url: "/reglages-pointage",
                    templateUrl: "views/module-pointage/config.html",
                    data: {pageTitle: 'Configuration de pointage'},
                    controller: "ErpCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // AngularJS plugins
                .state('fileupload', {
                    url: "/file_upload.html",
                    templateUrl: "views/file_upload.html",
                    data: {pageTitle: 'AngularJS File Upload'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'angularFileUpload',
                                        files: [
                                            'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                                        ]
                                    }, {
                                        name: 'MetronicApp',
                                        files: [
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // contact
                // contact
                .state('contact', {
                    url: "/contact",
                    templateUrl: "views/app_contact.html",
                    data: {pageTitle: 'Contact'},
                    controller: "EspaceClientController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/controllers/GeneralPageController.js',
                                            'js/jquery-ui.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // commandes espace client
                .state('commandesespaceclient', {
                    url: "/module-transporteur",
                    templateUrl: "views/module-contact/list_commandes_espaceclient.html",
                    data: {pageTitle: 'Éspace client'},
                    controller: "EspaceClientController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'css/textdefilant.css',
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // commandes espace client
                .state('ficheespaceclient', {
                    url: "/fiche-expediteur/:id",
                    templateUrl: "views/module-contact/fiche_expediteur.html",
                    data: {pageTitle: 'Fiche expediteur'},
                    controller: "FicheExpediteurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'css/textdefilant.css',
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // commandes espace client
                .state('pageTest', {
                    url: "/page-test",
                    templateUrl: "views/tests/page_test.html",
                    data: {pageTitle: 'Test page'},
                    controller: "TestController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'css/textdefilant.css',
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'css/select-selectize/selectize.default.css',
                                            'js/select-selectize/selectize.js',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // commandes for costum client
                .state('commandesforcostumclient', {
                    url: "/view-commande-for-client/:id",
                    templateUrl: "views/module-contact/list_commandes_client.html",
                    data: {pageTitle: 'Commande de client'},
                    controller: "ContactController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'css/select-selectize/normalize.css',
                                            'css/select-selectize/selectize.default.css',
                                            'css/select-selectize/selectize.bootstrap3.css',
                                            'css/select-selectize/selectize.legacy.css',
                                            'js/select-selectize/selectize.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // commandes récupérées for costum client
                .state('commandesrecupereesforcostumclient', {
                    url: "/view-recuperee-for-client/:id",
                    templateUrl: "views/module-contact/list_recuperees_client.html",
                    data: {pageTitle: 'Commande récupérées de client'},
                    controller: "EspaceClientController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Ajout Commande client
                .state('ajoutCommandeClient', {
                    url: "/ajout-commande-client",
                    templateUrl: "views/add_commande_client.html",
                    data: {pageTitle: 'Ajout Commande Client'},
                    controller: "AddCMDClientController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/controllers/GeneralPageController.js',
                                            'css/select-selectize/normalize.css',
                                            'css/select-selectize/selectize.default.css',
                                            'css/select-selectize/selectize.bootstrap3.css',
                                            'css/select-selectize/selectize.legacy.css',
                                            'js/select-selectize/selectize.js'
                                        ]
                                    }]);
                            }]
                    }
                })
// view Commande client
                .state('viewCommandeEspaceclient', {
                    url: "/view-commande-client/:id",
                    templateUrl: "views/view_commande_client.html",
                    data: {pageTitle: 'view Commande'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // generer facture multi bl
                .state('factureGroupedBL', {
                    url: "/generer-facture",
                    templateUrl: "views/grouped_bl.html",
                    data: {pageTitle: 'Générer facture'},
                    controller: "StateLivraisonController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/global/plugins/typeahead/handlebars.min.js',
                                        'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/add_product.js',
                                        'js/controllers/GeneralPageController.js',
                                    ]
                                });
                            }]
                    }
                })
                // statistique
                .state('States', {
                    url: "/statistique",
                    templateUrl: "views/stats.html",
                    data: {pageTitle: 'Statistique'},
                    controller: "StatsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // list Product
                .state('listProduct', {
                    url: "/products",
                    templateUrl: "views/product.html",
                    data: {pageTitle: 'Liste Produits'},
                    controller: "ProductsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/global/plugins/typeahead/handlebars.min.js',
                                        'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/css/semantic/semantic.min.css',
                                        'assets/pages/css/bootstrap-select.min.css',
                                        'js/jquery-ui.js',
                                        'js/semantic/semantic.min.js',
                                        'js/bootstrap-select.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Produit
                .state('ajoutproduit', {
                    url: "/ajout-produit",
                    templateUrl: "views/ajout_produit.html",
                    data: {pageTitle: 'Ajout Produit'},
                    controller: "ProductsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/add_product.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // edit Produit
                .state('editproduit', {
                    url: "/edit-product/:id",
                    templateUrl: "views/edit_produit.html",
                    data: {pageTitle: 'Modifié Produit'},
                    controller: "ProductsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/add_product.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Fiche Produit
                .state('FicheProduit', {
                    url: "/fiche-produit/:id",
                    templateUrl: "views/fiche_produit.html",
                    data: {pageTitle: 'Fiche Produit'},
                    controller: "ProductsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // suivicheque
                .state('suivicheque', {
                    url: "/suivi-cheque",
                    templateUrl: "views/suivi_cheque.html",
                    data: {pageTitle: 'Suivi chèque'},
                    controller: "ReglementsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // list Emplacement
//                .state('listEmplacement', {
//                    url: "/gestion-entrepots",
//                    templateUrl: "views/list_entrepots.html",
//                    data: {pageTitle: 'Liste Entrepôts'},
//                    controller: "EmplacementsController",
//                    resolve: {
//                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
//                                return $ocLazyLoad.load({
//                                    name: 'MetronicApp',
//                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
//                                    files: [
//                                        'assets/global/plugins/datatables/datatables.min.css',
//                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
//                                        'assets/global/plugins/datatables/datatables.all.min.js',
//                                        'assets/pages/scripts/table-datatables-managed.min.js',
//                                        'js/controllers/GeneralPageController.js',
//                                        'assets/pages/css/rootAccess.css',
//                                        'js/rootAccess.js'
//                                    ]
//                                });
//                            }]
//                    }
//                })
                // list Stock
                .state('listStock', {
                    url: "/gestion-entrepots",
                    templateUrl: "views/stocks.html",
                    data: {pageTitle: 'Liste Entrepôts'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/global/plugins/typeahead/handlebars.min.js',
                                        'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'js/jquery-ui.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // validate Stock
                .state('validateStock', {
                    url: "/valider-stocks",
                    templateUrl: "views/valide_stocks.html",
                    data: {pageTitle: 'Valider Stocks'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js',
                                        'js/icheck.min.js'
                                    ]
                                });
                            }]
                    }
                })
                // mouvement Stock
                .state('mouvementStock', {
                    url: "/mouvement-stock",
                    templateUrl: "views/mouvement_stock.html",
                    data: {pageTitle: 'mouvement Stock'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
//                                            'assets/pages/scripts/components-bootstrap-select.min.js',
//                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/jquery-ui.js',
//                                            'js/combobox.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view Stock
                .state('viewStock', {
                    url: "/view-entrepot/:id",
                    templateUrl: "views/view_stock.html",
                    data: {pageTitle: 'Entrepôt'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/css/semantic/semantic.min.css',
                                            'assets/pages/css/bootstrap-select.min.css',
                                            'js/jquery-ui.js',
                                            'js/semantic/semantic.min.js',
                                            'js/bootstrap-select.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view Emplacement
                .state('viewEmplacement', {
                    url: "/view-emplacement/:id",
                    templateUrl: "views/view_emplacement.html",
                    data: {pageTitle: 'Emplacement'},
                    controller: "EmplacementsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/css/semantic/semantic.min.css',
                                            'assets/pages/css/bootstrap-select.min.css',
                                            'js/jquery-ui.js',
                                            'js/semantic/semantic.min.js',
                                            'js/bootstrap-select.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view sous Emplacement
                .state('viewSousEmplacement', {
                    url: "/view-sous-emplacement/:id",
                    templateUrl: "views/view_sous_emplacement.html",
                    data: {pageTitle: 'Sous emplacement'},
                    controller: "SousEmplacementsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/css/semantic/semantic.min.css',
                                            'assets/pages/css/bootstrap-select.min.css',
                                            'js/jquery-ui.js',
                                            'js/semantic/semantic.min.js',
                                            'js/bootstrap-select.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Ajout Stock
                .state('ajoutstock', {
                    url: "/ajout-entrepot",
                    templateUrl: "views/add_stock.html",
                    data: {pageTitle: 'Ajout Entrepôt'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Ajout Emplacement
                .state('ajoutemplacement', {
                    url: "/ajout-emplacement",
                    templateUrl: "views/add_emplacement.html",
                    data: {pageTitle: 'Ajout Emplacement'},
                    controller: "EmplacementsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Ajout SousEmplacement
                .state('ajoutsousemplacement', {
                    url: "/ajout-sousemplacement",
                    templateUrl: "views/add_sousemplacement.html",
                    data: {pageTitle: 'Ajout SousEmplacement'},
                    controller: "SousEmplacementsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Modifier Emplacement
                .state('modifieremplacement', {
                    url: "/edit-emplacement/:id",
                    templateUrl: "views/edit_emplacement.html",
                    data: {pageTitle: 'Modifier Emplacement'},
                    controller: "EmplacementsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Modifier SousEmplacement
                .state('modifiersousemplacement', {
                    url: "/edit-sousemplacement/:id",
                    templateUrl: "views/edit_sousemplacement.html",
                    data: {pageTitle: 'Modifier SousEmplacement'},
                    controller: "SousEmplacementsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // edit Stock
                .state('editstock', {
                    url: "/edit-stock/:id",
                    templateUrl: "views/edit_stock.html",
                    data: {pageTitle: 'Modifié Stock'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/controllers/GeneralPageController.js',
                                            'js/jquery-ui.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // list commandes
                .state('listCommande', {
                    url: "/gestion-commandes",
                    templateUrl: "views/list_commande.html",
                    data: {pageTitle: 'Liste Commandes'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // list commandes ventes/produits
                .state('listCommandeVenteProducts', {
                    url: "/commandes-ventes-produit/:id",
                    templateUrl: "views/commandes_ventes_produit.html",
                    data: {pageTitle: 'Liste Commandes ventes/produit'},
                    controller: "CommandeProduitController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // list commandes achats/produits
                .state('listCommandeAchatProducts', {
                    url: "/commandes-achats-produit/:id",
                    templateUrl: "views/commandes_achats_produit.html",
                    data: {pageTitle: 'Liste Commandes achats/produit'},
                    controller: "CommandeProduitController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })

                // liste dl genarate facture
                .state('listBLGenerate', {
                    url: "/generer-facture/:id",
                    templateUrl: "views/generate_facture.html",
                    data: {pageTitle: 'Liste BL Générer'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // liste dl avoir
                .state('listBLAvoir', {
                    url: "/gestion-bl-avoir",
                    templateUrl: "views/bl_avoir.html",
                    data: {pageTitle: 'Liste BL Avoir'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // reglement grouper
                .state('listFactureAchatGrouper', {
                    url: "/reglement-grouper/:id",
                    templateUrl: "views/regrouper_reglement.html",
                    data: {pageTitle: 'Reglement grouper'},
                    controller: "FicheFournisseurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // list commandes
                .state('listBL', {
                    url: "/gestion-bon-livraison",
                    templateUrl: "views/list_bl.html",
                    data: {pageTitle: 'Liste Bon Livraison'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // list retenus à la sourceachat
                .state('listRetenus', {
                    url: "/gestion-retenus",
                    templateUrl: "views/list_retenus.html",
                    data: {pageTitle: 'Liste retenus à la source'},
                    controller: "RetenusController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // view Retenu achat
                .state('viewRetenu', {
                    url: "/view-retenu/:id",
                    templateUrl: "views/view_retenu.html",
                    data: {pageTitle: 'View Retenu'},
                    controller: "RetenusController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                //Avoir par article
                .state('AvoirProduct', {
                    url: "/avoir-product/:id",
                    templateUrl: "views/avoir_product.html",
                    data: {pageTitle: 'Avoir Produit'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/global/plugins/typeahead/handlebars.min.js',
                                        'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Reglement
                .state('reglement', {
                    url: "/reglement/:id",
                    templateUrl: "views/reglement.html",
                    data: {pageTitle: 'Reglement'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Commande
                .state('ajoutcommande', {
                    url: "/ajout-commande",
                    templateUrl: "views/add_commande.html",
                    data: {pageTitle: 'Ajout Commande'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
//                                            'assets/pages/scripts/components-bootstrap-select.min.js',
//                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/jquery-ui.js',
//                                            'js/combobox.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Commande
                .state('editcommande', {
                    url: "/edit-commande/:id",
                    templateUrl: "views/edit_commande.html",
                    data: {pageTitle: 'Modifié Commande'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
//                                            'assets/pages/scripts/components-bootstrap-select.min.js',
//                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/jquery-ui.js',
//                                            'js/combobox.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // view commande
                .state('viewCommande', {
                    url: "/view-commande/:id",
                    templateUrl: "views/view_commande.html",
                    data: {pageTitle: 'View Commande'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // list Devis
                .state('listDevis', {
                    url: "/gestion-devis",
                    templateUrl: "views/list_devis.html",
                    data: {pageTitle: 'Liste Devis'},
                    controller: "DevisController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Devi
                .state('ajoutdevis', {
                    url: "/ajout-devis",
                    templateUrl: "views/add_devis.html",
                    data: {pageTitle: 'Ajout Devis'},
                    controller: "DevisController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/jquery-ui.js',
//                                            'js/combobox.js',
                                            'js/controllers/GeneralPageController.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Ajout Devi
                .state('ajoutdevis1', {
                    url: "/ajout-devis-test",
                    templateUrl: "views/add_devis_1.html",
                    data: {pageTitle: 'Ajout Devis test'},
                    controller: "DevisController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/jquery-ui.js',
//                                            'js/combobox.js',
                                            'js/controllers/GeneralPageController.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view Devis
                .state('viewDevis', {
                    url: "/view-devis/:id",
                    templateUrl: "views/view_devis.html",
                    data: {pageTitle: 'View Devis'},
                    controller: "DevisController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // view Devis
                .state('viewDevisTest', {
                    url: "/view-devis-test/:id",
                    templateUrl: "views/view_devis_1.html",
                    data: {pageTitle: 'View Devis Test'},
                    controller: "DevisController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // Edit Devis
                .state('editdevis', {
                    url: "/edit-devis/:id",
                    templateUrl: "views/edit_devis.html",
                    data: {pageTitle: 'Modifié Devis'},
                    controller: "DevisController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/jquery-ui.js',
//                                            'js/combobox.js',
                                            'js/controllers/GeneralPageController.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // list factures  ventes
                .state('listFacture', {
                    url: "/gestion-factures",
                    templateUrl: "views/list_facture.html",
                    data: {pageTitle: 'Liste Factures'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // list factures  ventes en avoir
                .state('listFactureAvoir', {
                    url: "/gestion-factures-avoir",
                    templateUrl: "views/list_facture_avoir.html",
                    data: {pageTitle: 'Liste Factures Avoir'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
//                // avoir Facture
//                .state('avoirFacture', {
//                    url: "/avoir-facture/:id",
//                    templateUrl: "views/avoir_facture.html",
//                    data: {pageTitle: 'Avoir Facture'},
//                    controller: "FacturesController",
//                    resolve: {
//                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
//                                return $ocLazyLoad.load({
//                                    name: 'MetronicApp',
//                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
//                                    files: [
//                                        'assets/global/plugins/datatables/datatables.min.css',
//                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
//                                        'assets/global/plugins/datatables/datatables.all.min.js',
//                                        'assets/pages/scripts/table-datatables-managed.min.js',
//                                        'js/controllers/GeneralPageController.js'
//                                    ]
//                                });
//                            }]
//                    }
//                })
                // list factures vente declaré
                .state('listFactureDeclaration', {
                    url: "/declaration-fiscale-facture",
                    templateUrl: "views/declaration_fiscale_facture.html",
                    data: {pageTitle: 'Declaration fiscale vente'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })

                // Ajout Facture
                .state('ajoutfacture', {
                    url: "/ajout-facture",
                    templateUrl: "views/add_facture.html",
                    data: {pageTitle: 'Ajout Facture'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                //Avoir par article
                .state('AvoirParArticle', {
                    url: "/avoir-article-facture/:id",
                    templateUrl: "views/avoir_article_facture.html",
                    data: {pageTitle: 'Avoir Produit Facture'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/global/plugins/typeahead/handlebars.min.js',
                                        'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Déclaration fiscale
                .state('declarationFiscale', {
                    url: "/declaration-fiscale-ventes",
                    templateUrl: "views/declaration_fiscale.html",
                    data: {pageTitle: 'Déclaration Fiscale Vente'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Etat Factures ventes
                .state('etatBLsVentes', {
                    url: "/etat-ventes",
                    templateUrl: "views/etat_factures_ventes.html",
                    data: {pageTitle: 'État ventes'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Etat Factures Achats
                .state('etatAchat', {
                    url: "/etat-achats",
                    templateUrl: "views/etat_achats.html",
                    data: {pageTitle: 'Etat Achats'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Etat Comparatif achats ventes
                .state('etatcomparatifAchatsVente', {
                    url: "/etat-comparatif",
                    templateUrl: "views/comparatif_achats_ventes.html",
                    data: {pageTitle: 'Etat Comparatif Achats Ventes'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Etat Factures Achats Ipayée
                .state('etatAchatImpyee', {
                    url: "/etat-achats-impyees",
                    templateUrl: "views/etat_achats_impyee.html",
                    data: {pageTitle: 'Etat Achats Impyée'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view facture
                .state('viewFacture', {
                    url: "/view-facture/:id",
                    templateUrl: "views/view_facture.html",
                    data: {pageTitle: 'View Facture'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // view facture Transport
                .state('viewFactureTransport', {
                    url: "/view-facture-transport/:id",
                    templateUrl: "views/module-contact/view_facture_transport.html",
                    data: {pageTitle: 'View Facture Transport'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // view facture Transport test
                .state('viewFactureTransportTest', {
                    url: "/view-facture-transport-test/:id",
                    templateUrl: "views/module-contact/view_facture_transport_test.html",
                    data: {pageTitle: 'View Facture Transport test'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // list factures achat
                .state('listFactureAchat', {
                    url: "/gestion-factures-achat",
                    templateUrl: "views/list_facture_achat.html",
                    data: {pageTitle: 'Liste Factures Achat'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Facture
                .state('ajoutfactureachat', {
                    url: "/ajout-facture-achat",
                    templateUrl: "views/add_facture_achat.html",
                    data: {pageTitle: 'Ajout Facture Achat'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // list commandes achat
                .state('listCommandeAchat', {
                    url: "/gestion-commandes-achat",
                    templateUrl: "views/list_commandes_achat.html",
                    data: {pageTitle: 'Liste Commandes Achat'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // list demande prix
                .state('listdemandeprix', {
                    url: "/gestion-demande-prix",
                    templateUrl: "views/list_demande_prix.html",
                    data: {pageTitle: 'Liste demande de prix'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // list bon réception
                .state('listBonReceptionAchat', {
                    url: "/gestion-bon-reception",
                    templateUrl: "views/list_bl_achat.html",
                    data: {pageTitle: 'Liste bon réception'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Commande Achat
                .state('ajoutcommandeachat', {
                    url: "/ajout-commande-achat",
                    templateUrl: "views/add_commande_achat.html",
                    data: {pageTitle: 'Ajout commande d\'achat'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Ajout demande_prix
                .state('ajoutdemandeprix', {
                    url: "/ajout-demande-prix",
                    templateUrl: "views/add_demande_prix.html",
                    data: {pageTitle: 'Ajout demande de prix'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // edit Commande Achat
                .state('editcommandeachat', {
                    url: "/edit-commande-achat/:id",
                    templateUrl: "views/edit_commande_achat.html",
                    data: {pageTitle: 'Edit demande de prix'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // confirm demande prix
                .state('confirmdemandeprix', {
                    url: "/confirm-demande-prix/:id",
                    templateUrl: "views/confirm_demande_prix.html",
                    data: {pageTitle: 'Confirmer demande de prix'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // confirm Commande Achat
                .state('confirmcommandeachat', {
                    url: "/confirm-commande-achat/:id",
                    templateUrl: "views/confirm_commande_achat.html",
                    data: {pageTitle: 'Confirmer commande d\'achat'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // confirm Commande Achat
                .state('generatefactureachat', {
                    url: "/generer-facture-achat/:id",
                    templateUrl: "views/module-achat/generer_facture_achat.html",
                    data: {pageTitle: 'Generer facture d\'achat'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // générer facture avec bon réception Achat 
                .state('generatefacturebrachat', {
                    url: "/generer-facture-bon-reception/:id",
                    templateUrl: "views/module-achat/generer_facture_br_achat.html",
                    data: {pageTitle: 'Generer facture d\'achat avec Bon réception'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view Commande Achat
                .state('viewcommandeachat', {
                    url: "/view-commande-achat/:id",
                    templateUrl: "views/view_commande_achat.html",
                    data: {pageTitle: 'Bon commande achat'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view Commande Achat
                .state('viewnreceptionb', {
                    url: "/view-bon-reception/:id",
                    templateUrl: "views/view_bon_reception.html",
                    data: {pageTitle: 'Bon réception'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view Demande prix
                .state('viewdemandeprix', {
                    url: "/view-demande-prix/:id",
                    templateUrl: "views/view_demande_prix.html",
                    data: {pageTitle: 'Demande prix'},
                    controller: "CommandeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view facture
                .state('viewFactureAchat', {
                    url: "/view-facture-achat/:id",
                    templateUrl: "views/view_facture_achat.html",
                    data: {pageTitle: 'View Facture Achat'},
                    controller: "FacturesController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                //Famille
                //List Famille
                .state('listFamille', {
                    url: "/gestion-familles",
                    templateUrl: "views/list_familles.html",
                    data: {pageTitle: 'Liste Familles'},
                    controller: "FamilleController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Famille
                .state('ajoutfamille', {
                    url: "/ajout-famille",
                    templateUrl: "views/add_famille.html",
                    data: {pageTitle: 'Ajout Famille'},
                    controller: "FamilleController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Famille
                .state('editfamille', {
                    url: "/edit-famille/:id",
                    templateUrl: "views/edit_famille.html",
                    data: {pageTitle: 'Modifier Famille'},
                    controller: "FamilleController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                //Cp
                //List Cp
                .state('listCp', {
                    url: "/gestion-cps",
                    templateUrl: "views/list_cps.html",
                    data: {pageTitle: 'Liste Cps'},
                    controller: "CpController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Cp
                .state('ajoutcp', {
                    url: "/ajout-cp",
                    templateUrl: "views/add_cp.html",
                    data: {pageTitle: 'Ajout Cp'},
                    controller: "CpController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Cp
                .state('editcp', {
                    url: "/edit-cp/:id",
                    templateUrl: "views/edit_cp.html",
                    data: {pageTitle: 'Modifier Cp'},
                    controller: "CpController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                //Unite
                //List Unite
                .state('listUnite', {
                    url: "/gestion-unites",
                    templateUrl: "views/list_unites.html",
                    data: {pageTitle: 'Liste Unites'},
                    controller: "UniteController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Unite
                .state('ajoutunite', {
                    url: "/ajout-unite",
                    templateUrl: "views/add_unite.html",
                    data: {pageTitle: 'Ajout Unite'},
                    controller: "UniteController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Unite
                .state('editunite', {
                    url: "/edit-unite/:id",
                    templateUrl: "views/edit_unite.html",
                    data: {pageTitle: 'Modifier Unite'},
                    controller: "UniteController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                //Paiement
                //List Paiement
                .state('listPaiement', {
                    url: "/gestion-paiements",
                    templateUrl: "views/list_paiements.html",
                    data: {pageTitle: 'Liste Paiements'},
                    controller: "PaymentsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Paiement
                .state('ajoutpaiement', {
                    url: "/ajout-paiement",
                    templateUrl: "views/add_paiement.html",
                    data: {pageTitle: 'Ajout Paiement'},
                    controller: "PaymentsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Paiement
                .state('editpaiement', {
                    url: "/edit-paiement/:id",
                    templateUrl: "views/edit_paiement.html",
                    data: {pageTitle: 'Modifier Paiement'},
                    controller: "PaymentsController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                //Fournisseur
                //List Fournisseur
                .state('listFournisseur', {
                    url: "/gestion-fournisseurs",
                    templateUrl: "views/list_fournisseurs.html",
                    data: {pageTitle: 'Liste Fournisseurs'},
                    controller: "FournisseurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                //fiche Fournisseur
                .state('ficheFournisseur', {
                    url: "/fiche-fournisseur/:id",
                    templateUrl: "views/fiche_fournisseur.html",
                    data: {pageTitle: 'Fiche Fournisseur'},
                    controller: "FournisseurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                //solde Fournisseur
                .state('soldeFournisseur', {
                    url: "/solde-fournisseur",
                    templateUrl: "views/solde_fournisseur.html",
                    data: {pageTitle: 'Solde Fournisseur'},
                    controller: "FournisseurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // Reglement
                .state('reglementFournisseur', {
                    url: "/reglement-fournisseur/:id",
                    templateUrl: "views/reglement_fournisseur.html",
                    data: {pageTitle: 'Reglement fournisseur'},
                    controller: "FicheFournisseurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Fournisseur
                .state('ajoutfournisseur', {
                    url: "/ajout-fournisseur",
                    templateUrl: "views/add_fournisseur.html",
                    data: {pageTitle: 'Ajout Fournisseur'},
                    controller: "FournisseurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Fournisseur
                .state('editfournisseur', {
                    url: "/edit-fournisseur/:id",
                    templateUrl: "views/edit_fournisseur.html",
                    data: {pageTitle: 'Modifier Fournisseur'},
                    controller: "FournisseurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                //Client
                //List Client
                .state('listClient', {
                    url: "/gestion-clients",
                    templateUrl: "views/list_clients.html",
                    data: {pageTitle: 'Liste Clients'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                //fiche Client
                .state('ficheClient', {
                    url: "/fiche-client/:id",
                    templateUrl: "views/fiche_client.html",
                    data: {pageTitle: 'Fiche Client'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                //solde Client
                .state('soldeClient', {
                    url: "/solde-client",
                    templateUrl: "views/solde_client.html",
                    data: {pageTitle: 'Solde Client'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/global/plugins/typeahead/handlebars.min.js',
                                        'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/add_product.js',
                                        'js/controllers/GeneralPageController.js',
                                    ]
                                });
                            }]
                    }
                })

                // Ajout Client
                .state('ajoutclient', {
                    url: "/ajout-client",
                    templateUrl: "views/add_client.html",
                    data: {pageTitle: 'Ajout Client'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'css/example.wink.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/controllers/GeneralPageController.js',
                                            'js/hideShowPassword.min.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Client
                .state('editclient', {
                    url: "/edit-client/:id",
                    templateUrl: "views/edit_client.html",
                    data: {pageTitle: 'Modifier Client'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'css/example.wink.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/controllers/GeneralPageController.js',
                                            'js/hideShowPassword.min.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                //Commerciale
                //List Commerciale
                .state('listCommerciale', {
                    url: "/gestion-commerciales",
                    templateUrl: "views/list_commerciales.html",
                    data: {pageTitle: 'Listes Commerciaux'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Commerciale
                .state('ajoutcommerciale', {
                    url: "/ajout-commerciale",
                    templateUrl: "views/add_commerciale.html",
                    data: {pageTitle: 'Ajout Commerciale'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Commerciale
                .state('editcommerciale', {
                    url: "/edit-commerciale/:id",
                    templateUrl: "views/edit_commerciale.html",
                    data: {pageTitle: 'Modifier Commerciale'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                //fiche Commerciale
                .state('ficheCommerciale', {
                    url: "/fiche-commerciale/:id",
                    templateUrl: "views/fiche_commerciale.html",
                    data: {pageTitle: 'Fiche Commerciale'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // gestion livreurs
                //List Livreur
                .state('listLivreur', {
                    url: "/gestion-livreurs",
                    templateUrl: "views/module-contact/list_livreurs.html",
                    data: {pageTitle: 'Listes Commerciaux'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Livreur
                .state('ajoutlivreur', {
                    url: "/ajout-livreur",
                    templateUrl: "views/module-contact/add_livreur.html",
                    data: {pageTitle: 'Ajout Livreur'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'css/example.wink.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/controllers/GeneralPageController.js',
                                            'js/hideShowPassword.min.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                //fiche Livreur
                .state('ficheLivreur', {
                    url: "/fiche-livreur/:id",
                    templateUrl: "views/module-contact/fiche_livreur.html",
                    data: {pageTitle: 'Fiche Livreur'},
                    controller: "LivreurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/typeahead/typeahead.css',
                                        'assets/global/plugins/fuelux/js/spinner.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                        'assets/pages/scripts/components-form-tools-2.min.js',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                        'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // Edit Livreur
                .state('editLivreur', {
                    url: "/edit-livreur/:id",
                    templateUrl: "views/module-contact/edit_livreur.html",
                    data: {pageTitle: 'Modifier Livreur'},
                    controller: "LivreurController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'css/example.wink.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/controllers/GeneralPageController.js',
                                            'js/hideShowPassword.min.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                //Utilisateur
                //List Utilisateur
                .state('listUtilisateurs', {
                    url: "/gestion-utilisateurs",
                    templateUrl: "views/list_users.html",
                    data: {pageTitle: 'Liste Utilisateurs'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout utilisateur
                .state('ajoututilisateur', {
                    url: "/ajout-utilisateur",
                    templateUrl: "views/add_user.html",
                    data: {pageTitle: 'Ajout Utilisateur'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Client
                .state('editutilisateur', {
                    url: "/edit-utilisateur/:id",
                    templateUrl: "views/edit_user.html",
                    data: {pageTitle: 'Modifier Utilisateur'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                //Tva
                //List Tva
                .state('listTva', {
                    url: "/gestion-taxes",
                    templateUrl: "views/list_tvas.html",
                    data: {pageTitle: 'Liste Tvas'},
                    controller: "TvaController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Tva
                .state('ajouttva', {
                    url: "/ajout-tva",
                    templateUrl: "views/add_tva.html",
                    data: {pageTitle: 'Ajout Tva'},
                    controller: "TvaController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Tva
                .state('edittva', {
                    url: "/edit-tva/:id",
                    templateUrl: "views/edit_tva.html",
                    data: {pageTitle: 'Modifier Tva'},
                    controller: "TvaController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                //Categorie
                //List Categorie
                .state('listCategories', {
                    url: "/gestion-categories",
                    templateUrl: "views/list_categories.html",
                    data: {pageTitle: 'Liste Categories'},
                    controller: "CategorieController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Categorie
                .state('ajoutcategorie', {
                    url: "/ajout-categorie",
                    templateUrl: "views/add_categorie.html",
                    data: {pageTitle: 'Ajout Categorie'},
                    controller: "CategorieController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Categorie
                .state('editcategorie', {
                    url: "/edit-categorie/:id",
                    templateUrl: "views/edit_categorie.html",
                    data: {pageTitle: 'Modifier Categorie'},
                    controller: "CategorieController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Module contact
                // Mes relance
                .state('mesrelances', {
                    url: "/gestion-relances",
                    templateUrl: "views/app_relances.html",
                    data: {pageTitle: 'Mes relances'},
                    controller: "ContactController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Module reglages
                .state('mesregages', {
                    url: "/gestion-reglages",
                    templateUrl: "views/app_config.html",
                    data: {pageTitle: 'Mes règlages'},
                    controller: "ErpCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // affecter commande client à un commande
                .state('affectercommandeclient', {
                    url: "/affecter-commande-client/:id",
                    templateUrl: "views/module-contact/affecter_commande.html",
                    data: {pageTitle: 'Affecer commande client'},
                    controller: "ContactController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // affecter commande à un  livreur 
                .state('affectercommandelivreur', {
                    url: "/affecter-commande-livreur/:id",
                    templateUrl: "views/module-contact/affecter_commande_livreur.html",
                    data: {pageTitle: 'Affecer commande livreur'},
                    controller: "ContactController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // affecter multi commande en stock à un  livreur 
                .state('affecterplusieurcommandelivreur', {
                    url: "/affecter-multi-commande-livreur",
                    templateUrl: "views/module-contact/affecter_multi_commande_livreur.html",
                    data: {pageTitle: 'Affecer multi-commandes livreur'},
                    controller: "ContactController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // affecter multi commande client à un commande
                .state('affectermulticommandeclient', {
                    url: "/affecter-multi-commande-client",
                    templateUrl: "views/module-contact/affecter_multi_commande.html",
                    data: {pageTitle: 'Affecer multi commande client'},
                    controller: "ContactController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // affecter multi commande client
                .state('affecterparclient', {
                    url: "/affecter-commandes-client",
                    templateUrl: "views/module-contact/affecter_commandes_client.html",
                    data: {pageTitle: 'Affecer commandes client'},
                    controller: "AffecterCommandeUserController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // affecter groupe commande client à un livreur
                .state('affectergroupecommande', {
                    url: "/affecter-groupe-commande",
                    templateUrl: "views/module-contact/affecter_groupe_commande.html",
                    data: {pageTitle: 'Affecer groupe commande'},
                    controller: "ContactController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // bon chargement
                .state('bonchargement', {
                    url: "/gestion-bon-chargement",
                    templateUrl: "views/module-contact/bon_chargement.html",
                    data: {pageTitle: 'Bon chargement'},
                    controller: "BonChargementController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view bon chargement
                .state('viewbonchargement', {
                    url: "/bon-chargement/:id",
                    templateUrl: "views/module-contact/view_bon_chargement.html",
                    data: {pageTitle: 'View Bon chargement'},
                    controller: "BonChargementController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view bon chargement test
                .state('viewbonchargementtest', {
                    url: "/bon-chargement-test/:id",
                    templateUrl: "views/module-contact/view_bon_chargement_1.html",
                    data: {pageTitle: 'View Bon chargement test'},
                    controller: "BonChargementController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // bon sortie
                .state('bonsortie', {
                    url: "/bon-sortie",
                    templateUrl: "views/entrepot/bon_sortie.html",
                    data: {pageTitle: 'Bon sortie'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'js/select-selectize/selectize.js',
                                            'css/select-selectize/normalize.css',
                                            'css/select-selectize/selectize.legacy.css',
                                            'css/select-selectize/selectize.default.css',
                                            'js/semantic/semantic.min.js',
                                            'js/bootstrap-select.min.js',
                                            'js/moment.min.js',
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view bon sortie
                .state('viewbonsortie', {
                    url: "/view-bon-sortie/:id",
                    templateUrl: "views/entrepot/view_bon_sortie.html",
                    data: {pageTitle: 'View bon de sortie'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'assets/pages/css/semantic/semantic.min.css',
                                            'assets/pages/css/bootstrap-select.min.css',
                                            'js/semantic/semantic.min.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // generer bon sortie
                .state('genererbonsortie', {
                    url: "/generer-bon-sortie",
                    templateUrl: "views/entrepot/generer_bon_sortie.html",
                    data: {pageTitle: 'Generer Bon sortie'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'js/select-selectize/selectize.js',
                                            'css/select-selectize/normalize.css',
                                            'css/select-selectize/selectize.legacy.css',
                                            'css/select-selectize/selectize.default.css',
                                            'js/semantic/semantic.min.js',
                                            'js/bootstrap-select.min.js',
                                            'js/moment.min.js',
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // bon entrée
                .state('bonentree', {
                    url: "/bon-entree",
                    templateUrl: "views/entrepot/bon_entree.html",
                    data: {pageTitle: 'Bon d\'entrée'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'assets/pages/css/semantic/semantic.min.css',
                                            'assets/pages/css/bootstrap-select.min.css',
                                            'js/semantic/semantic.min.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // validate bon entrée
                .state('validatebonentree', {
                    url: "/valider-bon-entree/:id",
                    templateUrl: "views/entrepot/valide_bon_entree.html",
                    data: {pageTitle: 'Valider bon d\'entrée'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'assets/pages/css/semantic/semantic.min.css',
                                            'assets/pages/css/bootstrap-select.min.css',
                                            'js/semantic/semantic.min.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // view bon entrée
                .state('viewbonentree', {
                    url: "/view-bon-entree/:id",
                    templateUrl: "views/entrepot/view_bon_entree.html",
                    data: {pageTitle: 'View bon d\'entrée'},
                    controller: "StocksController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'assets/pages/css/semantic/semantic.min.css',
                                            'assets/pages/css/bootstrap-select.min.css',
                                            'js/semantic/semantic.min.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Module mailbox
                // Boîte de réception
                .state('mailbox', {
                    url: "/mailbox",
                    templateUrl: "views/mailbox/inbox.html",
                    data: {pageTitle: 'Boîte de réception'},
                    controller: "MailboxController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'assets/global/plugins/typeahead/handlebars.min.js',
                                            'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                                            'assets/pages/scripts/components-form-tools-2.min.js',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js',
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/css/semantic/semantic.min.css',
                                            'assets/pages/css/bootstrap-select.min.css',
                                            'js/jquery-ui.js',
                                            'js/semantic/semantic.min.js',
                                            'js/bootstrap-select.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // important mail
                .state('mailboximportant', {
                    url: "/important",
                    templateUrl: "views/mailbox/important.html",
                    data: {pageTitle: 'Messages importants'},
                    controller: "MailboxController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // draft mail (brouillant)
                .state('mailboxdraft', {
                    url: "/draft",
                    templateUrl: "views/mailbox/draft.html",
                    data: {pageTitle: 'Drafts'},
                    controller: "MailboxController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // trash mail (corbeille)
                .state('mailboxtrash', {
                    url: "/trash",
                    templateUrl: "views/mailbox/trash.html",
                    data: {pageTitle: 'Drafts'},
                    controller: "MailboxController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // sended mail
                .state('mailboxsended', {
                    url: "/sended",
                    templateUrl: "views/mailbox/sended.html",
                    data: {pageTitle: 'Drafts'},
                    controller: "MailboxController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Envoi mail
                .state('envoimail', {
                    url: "/envoi-mail",
                    templateUrl: "views/mailbox/envoi_mail.html",
                    data: {pageTitle: 'Envoi mail'},
                    controller: "MailboxController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Envoi mail
                .state('envoimailenvoi_mail_marketing', {
                    url: "/envoi-mail-marketing",
                    templateUrl: "views/mailbox/envoi_mail_marketing.html",
                    data: {pageTitle: 'Envoi mail marketing'},
                    controller: "MailboxController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // module note frais
                // // ajoutnotefrais
                .state('ajoutnotefrais', {
                    url: "/ajout-note-frais",
                    templateUrl: "views/noteFrais/add_notefrais.html",
                    data: {pageTitle: 'Ajout note frais'},
                    controller: "NoteFraisController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js',
                                            'assets/pages/css/rootAccess.css',
                                            'js/rootAccess.js'
                                        ]
                                    }]);
                            }]
                    }
                })
//                .state('ajoutnotefrais', {
//                    url: "/ajout-note-frais",
//                    templateUrl: "views/noteFrais/add_notefrais.html",
//                    data: {pageTitle: 'Ajout note frais'},
//                    controller: "NoteFraisController",
//                    resolve: {
//                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
//                                return $ocLazyLoad.load([{
//                                        name: 'MetronicApp',
//                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
//                                        files: [
//                                            'assets/global/plugins/clockface/css/clockface.css',
//                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
//                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
//                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
//                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
//                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
//                                            'assets/global/plugins/bootstrap-datepicker/locales/bootstrap-datepicker.fr.min.js',
//                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
//                                            'assets/global/plugins/clockface/js/clockface.js',
//                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
//                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
//                                            'assets/pages/scripts/components-date-time-pickers.min.js',
//                                            'js/controllers/GeneralPageController.js',
//                                            'assets/pages/css/rootAccess.css',
//                                            'js/rootAccess.js'
//                                        ]
//                                    }]);
//                            }]
//                    }
//                })
//                module E-commerce
                .state('moduleecomerce', {
                    url: "/e-commerce",
                    templateUrl: "views/e-commerce/ecommerce.html",
                    data: {pageTitle: 'Éspace client'},
                    controller: "EspaceClientController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/pages/css/jquery-ui.css',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

//                module-prospection
                .state('gestionclient', {
                    url: "/gestion-clients",
                    templateUrl: "views/module-prospection/list_client.html",
                    data: {pageTitle: 'liste client'},
                    controller: "UsersController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }
                })
                //webphone  
                .state('prospectiontelephonique', {
                    url: "/webphone",
                    templateUrl: "views/phone/softphone.html",
                    data: {pageTitle: 'Prospection téléphonique'},
                    controller: "SoftphoneCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
//                                        'assets/global/plugins/morris/morris.css',
//                                        'assets/global/plugins/morris/morris.min.js',
//                                        'assets/global/plugins/morris/raphael-min.js',
//                                        'assets/global/plugins/jquery.sparkline.min.js',
//                                        'assets/pages/scripts/dashboard.min.js',
//                                        'js/controllers/ProspectionController.js',


                                        'css/index.css',
                                        'css/themes/wphone_1.0.css',
                                        'css/themes/jquery.mobile.icons.min.css',
                                        'css/jquery.mobile.structure-1.4.2.css',
                                        'css/mainlayout.css',
//                                        'views/phone/webphone_api.js',
                                    ]
                                });
                            }]
                    }
                })
                .state('view-client', {
                    url: "/view-client/:id",
                    templateUrl: "views/module-prospection/view_client.html",
                    data: {pageTitle: 'Contacter le client'},
                    controller: "prospectionController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }


                })
                .state('listermsg', {
                    url: "/gestion-msg",
                    templateUrl: "views/module-prospection/listermsg.html",
                    data: {pageTitle: 'lister les message'},
                    controller: "prospectionController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }
                })
                .state('prospectiontt', {
                    url: "/prospectiontt",
                    templateUrl: "views/module-prospection/prospection_tt.html",
                    data: {pageTitle: 'liste user Template'},
                    controller: "prospectionController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }
                })
                .state('prospectionemail', {
                    url: "/prospectionemail/:id",
                    templateUrl: "views/module-prospection/prospectionemail.html",
                    data: {pageTitle: 'envoyer un email'},
                    controller: "EmailCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('prospectionemailtt', {
                    url: "/prospectionemailtt",
                    templateUrl: "views/module-prospection/prospectionemailtt.html",
                    data: {pageTitle: 'envoyer un email à tout le monde '},
                    controller: "prospectionController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('historiquemsgjhguj', {
                    url: "/historique-msg/:id",
                    templateUrl: "views/module-prospection/historique_msg.html",
                    data: {pageTitle: 'consulter l"historique du client'},
                    controller: "prospectionController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('historiqueemaill', {
                    url: "/historique-email/:id",
                    templateUrl: "views/module-prospection/historique_email.html",
                    data: {pageTitle: 'consulter l"historique du client'},
                    controller: "prospectionController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })

                .state('historiques', {
                    url: "/historiques/:id",
                    templateUrl: "views/module-prospection/historiques.html",
                    data: {pageTitle: 'consulter l"historique du client'},
                    controller: "prospectionController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })






//                module pointage
                .state('Gestionpointage', {
                    url: "/dashboard-pointage",
                    templateUrl: "views/module-pointage/dashboard_pointage.html",
                    data: {pageTitle: 'dashboard pointage'},
                    controller: "pointageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }
                })
                .state('Gestionpresence', {
                    url: "/gestion-presence",
                    templateUrl: "views/module-pointage/gestion_presence.html",
                    data: {pageTitle: 'Fiche de présence des employées'},
                    controller: "PresenceCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // gestion presence test 
                .state('Gestionpresencetest', {
                    url: "/gestion-presences",
                    templateUrl: "views/module-pointage/gestion_presence_manuel.html",
                    data: {pageTitle: 'Fiche de présence des employées'},
                    controller: "PointagesCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'js/select-selectize/selectize.js',
                                        'css/select-selectize/normalize.css',
                                        'css/select-selectize/selectize.legacy.css',
                                        'css/select-selectize/selectize.default.css',
                                        'js/semantic/semantic.min.js',
                                        'js/bootstrap-select.min.js',
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                    ]
                                });
                            }]
                    }
                })
                // gestion presence test 
                .state('GestionpresenceAuto', {
                    url: "/gestion-presences-auto",
                    templateUrl: "views/module-pointage/gestion_presence_auto.html",
                    data: {pageTitle: 'Fiche de présence automatique des employées'},
                    controller: "PointagesAutoCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'js/select-selectize/selectize.js',
                                        'css/select-selectize/normalize.css',
                                        'css/select-selectize/selectize.legacy.css',
                                        'css/select-selectize/selectize.default.css',
                                        'js/semantic/semantic.min.js',
                                        'js/bootstrap-select.min.js',
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                    ]
                                });
                            }]
                    }
                })
                // gestion presence automatique 
                .state('GestionpresenceAutomatique', {
                    url: "/gestion-presences-automatique",
                    templateUrl: "views/module-pointage/gestion_presence_auto_data.html",
                    data: {pageTitle: 'Fiche de présence automatique des employées'},
                    controller: "PointagesAutomatiqueCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'js/select-selectize/selectize.js',
                                        'css/select-selectize/normalize.css',
                                        'css/select-selectize/selectize.legacy.css',
                                        'css/select-selectize/selectize.default.css',
                                        'js/semantic/semantic.min.js',
                                        'js/bootstrap-select.min.js',
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                    ]
                                });
                            }]
                    }
                })
                .state('add_employee', {
                    url: "/add-employee",
                    templateUrl: "views/module-pointage/add_employee.html",
                    data: {pageTitle: 'Contacter lemployee'},
                    controller: "pointageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }


                })
                .state('salaire', {
                    url: "/salaire",
                    templateUrl: "views/module-pointage/salaire.html",
                    data: {pageTitle: 'Calculer nombre heure'},
                    controller: "PresenceCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'js/select-selectize/selectize.js',
                                        'css/select-selectize/normalize.css',
                                        'css/select-selectize/selectize.legacy.css',
                                        'css/select-selectize/selectize.default.css',
                                        'js/semantic/semantic.min.js',
                                        'js/bootstrap-select.min.js',
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // table paie
                .state('tablepaie', {
                    url: "/gestion-paie",
                    templateUrl: "views/module-pointage/table_paie.html",
                    data: {pageTitle: 'Gestion de paie'},
                    controller: "PaieCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'js/select-selectize/selectize.js',
                                        'css/select-selectize/normalize.css',
                                        'css/select-selectize/selectize.legacy.css',
                                        'css/select-selectize/selectize.default.css',
                                        'js/semantic/semantic.min.js',
                                        'js/bootstrap-select.min.js',
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('presence_employee', {
                    url: "/presence_employee/:id",
                    templateUrl: "views/module-pointage/presence_employee.html",
                    data: {pageTitle: 'Calculer nombre heure'},
                    controller: "PresenceCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }
                })
                // gestion primes
                //Prime
                //List Prime
                .state('listPrime', {
                    url: "/gestion-primes",
                    templateUrl: "views/module-pointage/list_primes.html",
                    data: {pageTitle: 'Liste Primes'},
                    controller: "PrimeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajout Prime
                .state('ajoutprime', {
                    url: "/ajout-prime",
                    templateUrl: "views/module-pointage/add_prime.html",
                    data: {pageTitle: 'Ajout Prime'},
                    controller: "PrimeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // Edit Prime
                .state('editprime', {
                    url: "/edit-prime/:id",
                    templateUrl: "views/module-pointage/edit_prime.html",
                    data: {pageTitle: 'Modifier Prime'},
                    controller: "PrimeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/typeahead/typeahead.css',
                                            'assets/global/plugins/fuelux/js/spinner.min.js',
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                                            'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                                            'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                                            'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                                            'js/controllers/GeneralPageController.js',
                                        ]
                                    }]);
                            }]
                    }
                })
                // end gestion primes
                .state('cause', {
                    url: "/cause/:id",
                    templateUrl: "views/module-pointage/cause.html",
                    data: {pageTitle: 'Calculer nombre heure'},
                    controller: "PresenceCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }


                })
                .state('list_presence', {
                    url: "/list_presence/:id",
                    templateUrl: "views/module-pointage/list_presence.html",
                    data: {pageTitle: 'Calculer nombre heure'},
                    controller: "PresenceCtrl",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }


                })
                .state('test', {
                    url: "/test",
                    templateUrl: "views/module-pointage/test.html",
                    data: {pageTitle: 'Contacter lemployee'},
                    controller: "pointageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/global/plugins/morris/morris.css',
                                        'assets/global/plugins/morris/morris.min.js',
                                        'assets/global/plugins/morris/raphael-min.js',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/pages/scripts/dashboard.min.js',
                                        'js/controllers/DashboardController.js',
                                    ]
                                });
                            }]
                    }


                })
                .state('mail', {
                    url: "/mail",
                    templateUrl: "views/module-pointage/mail.html",
                    data: {pageTitle: 'Envoyer email'},
                    controller: "pointageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'

                                    ]
                                });
                            }]
                    }


                })

                .state('list_employee', {
                    url: "/gestion-employees",
                    templateUrl: "views/module-pointage/list_employee.html",
                    data: {pageTitle: 'Contacter lemployee'},
                    controller: "pointageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }


                })
                .state('fiche_paie', {
                    url: "/fiche_paie/:id",
                    templateUrl: "views/module-pointage/fiche_paie.html",
                    data: {pageTitle: 'fiche employee'},
                    controller: "pointageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }


                })
                .state('simulateur', {
                    url: "/simulateur",
                    templateUrl: "views/module-pointage/simulateur.html",
                    data: {pageTitle: 'calculer salaire net'},
                    controller: "pointageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js',
//                                            'js/espace-client/espaceclient.js',
                                        'js/controllers/GeneralPageController.js',
                                        'assets/pages/css/rootAccess.css',
                                        'js/rootAccess.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('edit_employee', {
                    url: "/edit-employee/:id",
                    templateUrl: "views/module-pointage/edit_employee.html",
                    data: {pageTitle: 'Modifier lemployee'},
                    controller: "pointageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js'
                                    ]
                                });
                            }]
                    }
                })
                .state('prime_employee', {
                    url: "/prime-employe/:id",
                    templateUrl: "views/module-pointage/prime_employe.html",
                    data: {pageTitle: 'Prime employé'},
                    controller: "PrimeController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                                    files: [
                                        'assets/pages/css/jquery-ui.css',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/pages/scripts/components-bootstrap-select.min.js',
                                        'assets/pages/scripts/components-select2.min.js',
                                        'assets/global/plugins/clockface/css/clockface.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                        'assets/global/plugins/clockface/js/clockface.js',
                                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                        'assets/pages/scripts/components-date-time-pickers.min.js',
                                        'js/jquery-ui.js'
                                    ]
                                });
                            }]
                    }
                })
                // UI Select
                .state('uiselect', {
                    url: "/ui_select.html",
                    templateUrl: "views/ui_select.html",
                    data: {pageTitle: 'AngularJS Ui Select'},
                    controller: "UISelectController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'ui.select',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                                            'assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                                        ]
                                    }, {
                                        name: 'MetronicApp',
                                        files: [
                                            'js/controllers/UISelectController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // UI Bootstrap
                .state('uibootstrap', {
                    url: "/ui_bootstrap.html",
                    templateUrl: "views/ui_bootstrap.html",
                    data: {pageTitle: 'AngularJS UI Bootstrap'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        files: [
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // Tree View
                .state('tree', {
                    url: "/tree",
                    templateUrl: "views/tree.html",
                    data: {pageTitle: 'jQuery Tree View'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/jstree/dist/themes/default/style.min.css',
                                            'assets/global/plugins/jstree/dist/jstree.min.js',
                                            'assets/pages/scripts/ui-tree.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })
                // Date & Time Pickers
                .state('pickers', {
                    url: "/pickers",
                    templateUrl: "views/pickers.html",
                    data: {pageTitle: 'Date & Time Pickers'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                            'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                                            'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                                            'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                                            'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'assets/global/plugins/clockface/css/clockface.css',
                                            'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                            'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                            'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                                            'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                            'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                            'assets/global/plugins/clockface/js/clockface.js',
                                            'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                                            'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                            'assets/pages/scripts/components-date-time-pickers.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // Custom Dropdowns
                .state('dropdowns', {
                    url: "/dropdowns",
                    templateUrl: "views/dropdowns.html",
                    data: {pageTitle: 'Custom Dropdowns'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([{
                                        name: 'MetronicApp',
                                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                        files: [
                                            'assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                                            'assets/global/plugins/select2/css/select2.min.css',
                                            'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                            'assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                                            'assets/global/plugins/select2/js/select2.full.min.js',
                                            'assets/pages/scripts/components-bootstrap-select.min.js',
                                            'assets/pages/scripts/components-select2.min.js',
                                            'js/controllers/GeneralPageController.js'
                                        ]
                                    }]);
                            }]
                    }
                })

                // Advanced Datatables
                .state('datatablesAdvanced', {
                    url: "/managed1",
                    templateUrl: "views/managed.html",
                    data: {pageTitle: 'Advanced Datatables'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/pages/scripts/table-datatables-managed.min.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })
                // Ajax Datetables
                .state('datatablesAjax', {
                    url: "/datatables/ajax.html",
                    templateUrl: "views/datatables/ajax.html",
                    data: {pageTitle: 'Ajax Datatables'},
                    controller: "GeneralPageController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/datatables/datatables.min.css',
                                        'assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/global/plugins/datatables/datatables.all.min.js',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/global/scripts/datatable.min.js',
                                        'js/scripts/table-ajax.js',
                                        'js/controllers/GeneralPageController.js'
                                    ]
                                });
                            }]
                    }
                })

                // User Profile
                .state("profile", {
                    url: "/profile", templateUrl: "views/profile/main.html",
                    data: {pageTitle: 'User Profile'},
                    controller: "UserProfileController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                                        'assets/pages/css/profile.css',
                                        'assets/global/plugins/jquery.sparkline.min.js',
                                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js', 'assets/pages/scripts/profile.min.js',
                                        'js/controllers/UserProfileController.js'
                                    ]
                                });
                            }]
                    }
                })

                // User Profile Dashboard
                .state("profile.dashboard", {
                    url: "/dashboard",
                    templateUrl: "views/profile/dashboard.html",
                    data: {pageTitle: 'User Profile'}
                })

                // User Profile Account
                .state("profile.account", {
                    url: "/account",
                    templateUrl: "views/profile/account.html",
                    data: {pageTitle: 'User Account'}
                })

                // User Profile Help
                .state("profile.help", {
                    url: "/help",
                    templateUrl: "views/profile/help.html",
                    data: {pageTitle: 'User Help'}
                })

                // Todo
                .state('todo', {
                    url: "/todo",
                    templateUrl: "views/todo.html",
                    data: {pageTitle: 'Todo'},
                    controller: "TodoController",
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    name: 'MetronicApp',
                                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                                    files: [
                                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                        'assets/apps/css/todo-2.css',
                                        'assets/global/plugins/select2/css/select2.min.css',
                                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',
                                        'assets/global/plugins/select2/js/select2.full.min.js',
                                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                        'assets/apps/scripts/todo-2.min.js',
                                        'js/controllers/TodoController.js'
                                    ]
                                });
                            }]
                    }
                })

    }]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view
    }
]);
