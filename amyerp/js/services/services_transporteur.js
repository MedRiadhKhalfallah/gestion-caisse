angular.module('starter.services.p2', [])
        .factory('TransporteurFactory', function ($http, $q, $timeout) {
            var factory = {
                // list client commande ramassage ou depot
                listClientRamassageDepotPaginate: function (pageNumber, limit, searchKey, ville, user_id) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            limit: limit,
                            searchKey: searchKey,
                            ville_id: ville,
                            user_id: user_id
                        }
                    };
                    var url = api_url() + "transporteurs/ramassage_depot_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.clientsramassage = data;
                                deferred.resolve(factory.clientsramassage);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list client commande ramassage ou depot
                listClientRecupereesPaginate: function (pageNumber, limit, searchKey, ville, user_id) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            limit: limit,
                            searchKey: searchKey,
                            ville_id: ville,
                            user_id: user_id
                        }
                    };
                    var url = api_url() + "transporteurs/recuperees_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.clientsrecuperer = data;
                                deferred.resolve(factory.clientsrecuperer);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list client commande ramassage ou depot
                listCommandeEnstocksPaginate: function (pageNumber, limit, searchKey, ville, user_id) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            limit: limit,
                            searchKey: searchKey,
                            ville_id: ville,
                            user_id: user_id
                        }
                    };
                    var url = api_url() + "transporteurs/stocks_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandesenstock = data;
                                deferred.resolve(factory.commandesenstock);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client liste commande en attente livraison
                listCommandeEnattenteLivraisonEspaceclientPaginate: function (pageNumber, limit, searchKey, ville, user_id) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville,
                            user_id: user_id
                        }
                    };
                    var url = api_url() + "transporteurs/enattentelivraison_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandeseEnattentelivraisonspaceclient = data;
                                deferred.resolve(factory.commandeseEnattentelivraisonspaceclient);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listCommandeRetoursEspaceclientPaginate: function (pageNumber, limit, searchKey, ville, etatRetoure, user_id) {
                    var deferred = $q.defer();
                    console.log(etatRetoure);
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville,
                            etatRetoure: etatRetoure,
                            user_id: user_id
                        }
                    };
                    var url = api_url() + "transporteurs/retour_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandesretours = data;
                                deferred.resolve(factory.commandesretours);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listCommandeLivreeEspaceclientPaginate: function (pageNumber, limit, searchKey, ville, user_id) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville,
                            user_id: user_id
                        }
                    };
                    var url = api_url() + "transporteurs/livree_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandeslivrees = data;
                                deferred.resolve(factory.commandeslivrees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listCommandeAnnuleeEspaceclientPaginate: function (pageNumber, limit, searchKey, ville, etatFacture, user_id) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville,
                            etatFacture: etatFacture,
                            user_id: user_id
                        }
                    };
                    var url = api_url() + "transporteurs/annulee_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandesannulee = data;
                                deferred.resolve(factory.commandesannulee);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listCommandeFactureesPaginate: function (pageNumber, limit, searchKey, ville, user_id) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville,
                            user_id: user_id
                        }
                    };
                    var url = api_url() + "transporteurs/facturees_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandesfacturees = data;
                                deferred.resolve(factory.commandesfacturees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listRetoursExpediteurPaginate: function (pageNumber, limit, searchKey, ville, user_id) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville,
                            user_id: user_id
                        }
                    };
                    var url = api_url() + "transporteurs/retourexpediteur_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.listretoursexpediteur = data;
                                deferred.resolve(factory.listretoursexpediteur);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
            };
            return factory;
        });
 