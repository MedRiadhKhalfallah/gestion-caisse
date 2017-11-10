angular.module('MetronicApp')
        .factory('ProspectionFatcory', function ($http, $q, $timeout) {
            var factory = {
                posts: false,
 
              ajoutermsg: function (datamsg) {
                    var deferred = $q.defer();
                    var url = api_url() + 'prospections/ajoutermsg';
                    console.log(datamsg);
                    $http.post(url, datamsg)
                            .success(function (data, status) {
                                factory.user = data;
                                deferred.resolve(factory.user);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                  listermsg: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'prospections/index';
                    console.log(api_url);
                    console.log(url);
                    $http.post(url)
                            .success(function (data, status) {
                                factory.msgs = data;
                                deferred.resolve(factory.msgs);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                  ajoutermultimsg: function (datamultimsg) {
                    var deferred = $q.defer();
                    var url = api_url() + 'prospections/ajoutermultimsg';
                    console.log(datamultimsg);
                    $http.post(url, datamultimsg)
                            .success(function (data, status) {
                                factory.msg = data;
                                deferred.resolve(factory.msg);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                addemail: function (dataemail) {
                    var deferred = $q.defer();
                    var url = api_url() + 'prospections/addemail';
                    console.log(dataemail);
                    console.log(api_url());
                    $http.post(url, dataemail)
                            .success(function (data, status) {
                                factory.email = data;
                                deferred.resolve(factory.email);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                }, 
                ajoutermultiemail: function (datamultiemail) {
                    var deferred = $q.defer();
                    var url = api_url() + 'prospections/ajoutermultiemail';
//                    console.log(datamultiemail);
                    $http.post(url, datamultiemail)
                            .success(function (data, status) {
                                factory.email = data;
                                deferred.resolve(factory.email);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                  historiquemsg: function (dataMsgHistorique) {
                    var deferred = $q.defer();
                    var url = api_url() + 'prospections/historiquemsg';
//                    console.log(api_url);
//                    console.log(url, dataMsgHistorique);
                    $http.post(url, dataMsgHistorique)
                            .success(function (data, status) {
                                factory.msgs = data;
                                deferred.resolve(factory.msgs);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                  historiqueemail: function (dataEmailHistorique) {
                    var deferred = $q.defer();
                    var url = api_url() + 'prospections/historiqueemail';
//                    console.log(api_url);
                    console.log(dataEmailHistorique);
                    $http.post(url, dataEmailHistorique)
                            .success(function (data, status) {
                                factory.emails = data;
                                deferred.resolve(factory.emails);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
            }
            return factory;
        })
 
