angular.module('MetronicApp')
        .factory('PointageFactory', function ($http, $q, $timeout) {
            var factory = {
                posts: false,
                adduser: function (datauser) {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/add_ajax';
                    console.log(datauser);
                    $http.post(url, datauser)
                            .success(function (data, status) {
                                factory.user = data;
                                deferred.resolve(factory.user);
                            }).error(function (data, status) {
                    });
                    return deferred.promise; 
                },
                validateAction: function (dataRoot) {
                    var deferred = $q.defer();
                    var url = api_url() + "roots/root_delete";
                    $http.post(url, dataRoot)
                            .success(function (data, status) {
                                factory.root = data;
                                $timeout(function () {
                                    deferred.resolve(factory.root);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                listuser: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/index_angular';
//                    console.log();
                    $http.post(url)
                            .success(function (data, status) {
                                factory.users = data;
                                deferred.resolve(factory.users);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                addemployee: function (dataemploye) {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/add_employe';
//                    console.log(dataemploye);
                    $http.post(url, dataemploye)
                            .success(function (data, status) {
                                factory.employ = data;
                                deferred.resolve(factory.employ);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                now: function (datapresence) {
                    var deferred = $q.defer();
                    var url = api_url() + 'presences/presence_employee';
//                    console.log(dataemploye);
                    $http.post(url, datapresence)
                            .success(function (data, status) {
                                factory.employ = data;
                                deferred.resolve(factory.employ);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                pointage: function (datapresence) {
                    var deferred = $q.defer();
                    var url = api_url() + 'presences/presence_employee';
//                    console.log(dataemploye);
                    $http.post(url, datapresence)
                            .success(function (data, status) {
                                factory.employ = data;
                                deferred.resolve(factory.employ);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listAnneesPointage: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'presences/annee_pointage';
//                    conlistemployesole.log();
                    $http.post(url)
                            .success(function (data, status) {
                                factory.anneespointage = data;
                                deferred.resolve(factory.anneespointage);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listpaie: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'presences/table_paie';
//                    conlistemployesole.log();
                    $http.post(url)
                            .success(function (data, status) {
                                factory.user = data;
                                deferred.resolve(factory.user);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listepointage: function (TablePresence) {
                    var deferred = $q.defer();
                    var url = api_url() + 'presences/showHoursCount';
//                    conlistemployesole.log();
                    $http.post(url, TablePresence)
                            .success(function (data, status) {
                                factory.pointages = data.data;
                                deferred.resolve(factory.pointages);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                getTotalHours: function (count) {
                    var deferred = $q.defer();
                    var url = api_url() + 'presences/count_heure';
//                    console.log();
                    $http.post(url, count)
                            .success(function (data, status) {
                                factory.getTotal = data;
                                deferred.resolve(factory.getTotal);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listpresence: function (dataP) {
                    var deferred = $q.defer();
                    var url = api_url() + 'presences/index';
//                    conlistemployesole.log();
                    $http.post(url, dataP)
                            .success(function (data, status) {
                                factory.user = data;
                                deferred.resolve(factory.user);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                viewEmployee: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        User: {
                            id: id
                        }
                    };
                    var url = api_url() + "employes/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.user = data;
                                $timeout(function () {
                                    deferred.resolve(factory.user);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                getTotal: function (datasalaire) {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/index_angular';
                    console.log(datasalaire);
                    $http.put(url, datasalaire)
                            .success(function (data, status) {
                                factory.employ = data;
                                deferred.resolve(factory.employ);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listEmployeesExport: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "employes/list_employee";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.users = data;
                                deferred.resolve(factory.users);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                addemail: function (dataemail) {
                    var deferred = $q.defer();
                    var url = api_url() + "employes/addemail";
                    var fd = new FormData();
                    fd.append('email', dataemail.User.email);
                    fd.append('objet', dataemail.User.objet);
                    fd.append('content', dataemail.User.content);
                    fd.append('file', dataemail.User.preuve);
                    $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                            .success(function (data, status) {
                                factory.users = data;
                                deferred.resolve(factory.users);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editEmployee: function (dataemploye) {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/edit_employe';
                    console.log(dataemploye);
                    $http.put(url, dataemploye)
                            .success(function (data, status) {
                                factory.employ = data;
                                deferred.resolve(factory.employ);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                editemployee: function (datasalaire) {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/edit_employe';
                    console.log(datasalaire);
                    $http.put(url, datasalaire)
                            .success(function (data, status) {
                                factory.employ = data;
                                deferred.resolve(factory.employ);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
//                editepointage: function (datapointage) {
//                    var deferred = $q.defer();
//                    var url = api_url() + 'presences/edit_pointage';
//                    console.log(datapointage);
//                    $http.put(url, datapointage)
//                            .success(function (data, status) {
//                                factory.employ = data;
//                                deferred.resolve(factory.employ);
//                            }).error(function (data, status) {
//                    });
//                    return deferred.promise;
//                },
                listpointage: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'presences/index';
//                    conlistemployesole.log();
                    $http.post(url)
                            .success(function (data, status) {
                                factory.presence = data;
                                deferred.resolve(factory.presence);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                exportToExcel: function (tableId) {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/index_angular';
                    console.log(tableId);
                    $http.put(url, tableId)
                            .success(function (data, status) {
                                factory.employ = data;
                                deferred.resolve(factory.employ);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                calculer_net: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/index_angular';
//                    console.log();
                    $http.post(url)
                            .success(function (data, status) {
                                factory.user = data;
                                deferred.resolve(factory.user);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                change: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/index_angular';
//                    console.log();
                    $http.post(url)
                            .success(function (data, status) {
                                factory.user = data;
                                deferred.resolve(factory.user);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listemploye: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'users/index_angular';
//                    conlistemployesole.log();
                    $http.post(url)
                            .success(function (data, status) {
                                factory.user = data;
                                deferred.resolve(factory.user);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                pointage_manuel: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/index_angular';
//                    console.log();
                    $http.post(url)
                            .success(function (data, status) {
                                factory.pointage = data;
                                deferred.resolve(factory.pointage);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // test pointage
                newPointage: function (datapresence) {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/add_pointage';
//                    console.log(dataemploye);
                    $http.post(url, datapresence)
                            .success(function (data, status) {
                                factory.pointage = data;
                                deferred.resolve(factory.pointage);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                newListpointage: function (dataP) {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/index';
//                    conlistemployesole.log();
                    $http.post(url, dataP)
                            .success(function (data, status) {
                                factory.pointages = data;
                                deferred.resolve(factory.pointages);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listpointageAutomatique: function (dataP) {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/index_automatique';
//                    conlistemployesole.log();
                    $http.post(url, dataP)
                            .success(function (data, status) {
                                factory.pointagesAuto = data;
                                deferred.resolve(factory.pointagesAuto);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                savePointageAutomatique: function () {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/save_data_pointeuse_app';
//                    conlistemployesole.log();
                    $http.post(url)
                            .success(function (data, status) {
                                factory.pointagesAuto = data;
                                deferred.resolve(factory.pointagesAuto);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                viewPointage: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Pointage: {
                            id: id
                        }
                    };
                    var url = api_url() + "pointages/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.pointage = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.pointage);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                addpointageSortie: function (dataSortie) {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/add_sortie';
                    var fd = new FormData();
                    fd.append('pointage_id', dataSortie.SortiesPointage.pointage_id);
                    fd.append('date_entree', dataSortie.SortiesPointage.date_entree);
                    fd.append('date_sortie', dataSortie.SortiesPointage.date_sortie);
                    fd.append('cause', dataSortie.SortiesPointage.cause);
                    fd.append('descriptif', dataSortie.SortiesPointage.descriptif);
                    fd.append('file', dataSortie.SortiesPointage.file);
                    $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                            .success(function (data, status) {
                                factory.newSortie = data;
                                $timeout(function () {
                                    deferred.resolve(factory.newSortie);
                                }, 1);
                            })
                            .error(function (data, status) {

                            });
                    return deferred.promise;
                },
                // pointage absence employé
                newPointageAbsence: function (datapointage) {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/pointage_absent';
                    var fd = new FormData();
                    fd.append('user_id', datapointage.Pointage.user_id);
                    fd.append('isAbsent', datapointage.Pointage.isAbsent);
                    fd.append('cause', datapointage.Pointage.cause);
                    fd.append('isAutorise', datapointage.Pointage.isAutorise);
                    fd.append('descriptif', datapointage.Pointage.descriptif);
                    fd.append('date', datapointage.Pointage.date);
                    fd.append('file', datapointage.Pointage.file);
                    $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                            .success(function (data, status) {
                                factory.newPointageAbsentce = data;
                                $timeout(function () {
                                    deferred.resolve(factory.newPointageAbsentce);
                                }, 1);
                            })
                            .error(function (data, status) {

                            });
                    return deferred.promise;
                },
                editpointageSortie: function (dataSortie) {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/edit_sortie';
                    $http.post(url, dataSortie)
                            .success(function (data, status) {
                                factory.newSortie = data;
                                $timeout(function () {
                                    deferred.resolve(factory.newSortie);
                                }, 1);
                            })
                            .error(function (data, status) {

                            });
                    return deferred.promise;
                },
                // ajout heure supplimentaire
                addpointageHS: function (dataHS) {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/add_hs';
                    $http.post(url, dataHS)
                            .success(function (data, status) {
                                factory.newHS = data;
                                $timeout(function () {
                                    deferred.resolve(factory.newHS);
                                }, 1);
                            })
                            .error(function (data, status) {

                            });
                    return deferred.promise;
                },
                // list heure supplimentaire custom pointage
                listHS: function (id) {
                    var deferred = $q.defer();
                    var dataHS = {
                        SortiesPointage: {
                            pointage_id: id
                        }
                    };
                    var url = api_url() + 'pointages/list_HS';
                    $http.post(url, dataHS)
                            .success(function (data, status) {
                                factory.listHSPointage = data;
                                $timeout(function () {
                                    deferred.resolve(factory.listHSPointage);
                                }, 1);
                            })
                            .error(function (data, status) {

                            });
                    return deferred.promise;
                },
                // gestion paie
                listepointagePaie: function (TablePresence) {
                    var deferred = $q.defer();
                    var url = api_url() + 'pointages/showHoursCount';
//                    conlistemployesole.log();
                    $http.post(url, TablePresence)
                            .success(function (data, status) {
                                factory.pointages = data.data;
                                deferred.resolve(factory.pointages);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // gestion primes
                //liste Prime
                listPrime: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "primes/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.primes = data;
                                deferred.resolve(factory.primes);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // add new prime
                ajoutPrime: function (dataPrime) {
                    var deferred = $q.defer();
                    var url = api_url() + "primes/add";
                    $http.post(url, dataPrime)
                            .success(function (data, status) {
                                factory.prime = data;
                                deferred.resolve(factory.prime);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // add prime to employe
                ajoutPrimeEmploye: function (dataPrime) {
                    var deferred = $q.defer();
                    var url = api_url() + "primes/add_prime_employe";
                    $http.post(url, dataPrime)
                            .success(function (data, status) {
                                factory.primeEmploye = data;
                                deferred.resolve(factory.primeEmploye);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                editPrime: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "primes/edit";
                    $http.put(url, {Prime: $scope.Prime})
                            .success(function (data, status) {
                                factory.prime = data;
                                $timeout(function () {
                                    deferred.resolve(factory.prime);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                viewPrime: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Prime: {
                            id: id
                        }
                    };
                    var url = api_url() + "primes/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.prime = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.prime);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                deletePrime: function (dataPrime) {
                    var deferred = $q.defer();
                    var url = api_url() + "primes/delete";
                    $http.post(url, dataPrime)
                            .success(function (data, status) {
                                factory.prime = data;
                                $timeout(function () {
                                    deferred.resolve(factory.prime);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // pointage automatique
                listPointageAuto: function (dataPointage) {
                    var deferred = $q.defer();
                    var url = api_url() + "pointages/save_info_pointeuse";
                    $http.post(url, dataPointage)
                            .success(function (data, status) {
                                factory.pointagesAuto = data;
                                deferred.resolve(factory.pointagesAuto);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
            };
            return factory;
        });

