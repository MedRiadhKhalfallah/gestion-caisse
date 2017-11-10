angular.module('starter.services', [])
        .factory('PostFactory', function ($http, $q, $timeout) {
            var factory = {
                products: false,
                post: false,
                loginPost: function (data) {
                    var deferred = $q.defer();
                    var url = api_url() + "users/login";
                    $http.defaults.headers.post["Content-Type"] = "application/json";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.users = data;
                                $timeout(function () {
                                    deferred.resolve(factory.users);
                                }, 1);
                            }).error(function (data, status) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                logout: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "users/logout";
                    $http.get(url)
                            .success(function (data, status) {
                                factory.users = data;
                                $timeout(function () {
                                    deferred.resolve(factory.users);
                                }, 1);
                            }).error(function (data, status) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                MoneyText: function (totalFinal) {
                    var deferred = $q.defer();
                    var url = api_url() + "pages/towords/" + totalFinal;
                    $http.get(url)
                            .success(function (data, status) {
                                factory.totalFinalText = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.totalFinalText);
                                }, 1);
                            }).error(function (data, status) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                loadTopSeven: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/get_stats";
                    $http.post(url)
                            .success(function (data, status) {
                                var stats = {
                                    'month': data.month,
                                    'sales': data.sales,
                                    'top': data.top
                                };
                                factory.stats = stats;

//                                factory.stats['sales'] = data.sales;
                                $timeout(function () {
                                    deferred.resolve(factory.stats);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                },
                // revenue mensuel de vente par mois
                loadSalesVente: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/sales_ventes";
                    $http.post(url)
                            .success(function (data, status) {
                                var statsvente = data;
                                factory.statsvente = statsvente;

//                                factory.stats['sales'] = data.sales;
                                $timeout(function () {
                                    deferred.resolve(factory.statsvente);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                },
                // revenue mensuel de vente par client
                loadSalesVenteClient: function (dataInterval) {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/state_vente_client";
                    $http.post(url, dataInterval)
                            .success(function (data, status) {
                                var statsventeclient = data;
                                factory.statsventeclient = statsventeclient;

//                                factory.stats['sales'] = data.sales;
                                $timeout(function () {
                                    deferred.resolve(factory.statsventeclient);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!'); 
                    });
                    return deferred.promise;
                },
                // revenue mensuel de vente par client
                loadSalesProducts: function (dataProduct) {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/sales_products";
                    $http.post(url, dataProduct)
                            .success(function (data, status) {
                                var DataProduct = {
                                    'achats': data.achats,
                                    'ventes': data.ventes,
                                };
                                factory.salesproducts = DataProduct;
//                                factory.stats['sales'] = data.sales;
                                $timeout(function () {
                                    deferred.resolve(factory.salesproducts);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!'); 
                    });
                    return deferred.promise;
                },
                // revenue mensuel de vente par client
                loadSalesAchatProducts: function (dataProduct) {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/buys_sales_products";
                    $http.post(url, dataProduct)
                            .success(function (data, status) {
                                var DataProduct = {
                                    'achats': data.achats,
                                    'ventes': data.ventes,
                                };
                                factory.salesproducts = DataProduct;
//                                factory.stats['sales'] = data.sales;
                                $timeout(function () {
                                    deferred.resolve(factory.salesproducts);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!'); 
                    });
                    return deferred.promise;
                },
                // comparatif globale ventes achats
                loadSalesGlobalComparatif: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/comparatif_global";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                var DataProduct = {
                                    'achats': data.achats,
                                    'ventes': data.ventes,
                                };
                                factory.statscoparatifs = DataProduct;
//                                factory.stats['sales'] = data.sales;
                                $timeout(function () {
                                    deferred.resolve(factory.statscoparatifs);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!'); 
                    });
                    return deferred.promise;
                },
                // revenue mensuel des achats par fournisseur
                loadSalesAchat: function (dataInterval) {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/sales_achats";
                    $http.post(url, dataInterval)
                            .success(function (data, status) {
                                var statsachats = data;
                                factory.statsachats = statsachats;

//                                factory.stats['sales'] = data.sales;
                                $timeout(function () {
                                    deferred.resolve(factory.statsachats);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!'); 
                    });
                    return deferred.promise;
                },
                // revenue mensuel des ventes par client
                loadSalesVentes: function (dataInterval) {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/sales_comparatif_ventes";
                    $http.post(url, dataInterval)
                            .success(function (data, status) {
                                var DataVente = {
                                    'stats': data.data,
                                    'ventes': data.commandes,
                                };
                                factory.statsventes = DataVente;

//                                factory.stats['sales'] = data.sales;
                                $timeout(function () {
                                    deferred.resolve(factory.statsventes);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!'); 
                    });
                    return deferred.promise;
                },
                loadSalesAchatFournisseur: function (dataFournisseur) {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/sales_achats_fournisseur";
                    $http.post(url, dataFournisseur)
                            .success(function (data, status) {
                                var statsachatsfournisseur = data;
                                factory.statsachatsfournisseur = statsachatsfournisseur;
                                $timeout(function () {
                                    deferred.resolve(factory.statsachatsfournisseur);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!'); 
                    });
                    return deferred.promise;
                },
                // revenue mensuel de mouvement de stock
                loadSalesStock: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "stats/sales_stock";
                    $http.post(url)
                            .success(function (data, status) {
                                var statsstocks = data;
                                factory.statsstocks = statsstocks;

//                                factory.stats['sales'] = data.sales;
                                $timeout(function () {
                                    deferred.resolve(factory.statsstocks);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!'); 
                    });
                    return deferred.promise;
                },
                editConfig: function (file, $scope) {
                    var deferred = $q.defer();
                    console.log($scope);
                    console.log(file);
                    var url = api_url() + "pages/config";
                    var fd = new FormData();
                    fd.append('id', $scope.Configuration.id);
                    fd.append('adresse', $scope.Configuration.adresse);
                    fd.append('agence', $scope.Configuration.agence);
                    fd.append('banque', $scope.Configuration.banque);
                    fd.append('client_display', $scope.Configuration.client_display);
                    fd.append('debut_exercice', $scope.Configuration.debut_exercice);
                    fd.append('fin_exercice', $scope.Configuration.fin_exercice);
                    fd.append('echeance_defaut', $scope.Configuration.echeance_defaut);
                    fd.append('email', $scope.Configuration.email);
                    fd.append('email_host', $scope.Configuration.email_host);
                    fd.append('fodec', $scope.Configuration.fodec);
                    fd.append('frais_livraison', $scope.Configuration.frais_livraison);
                    fd.append('iban', $scope.Configuration.iban);
                    fd.append('informations', $scope.Configuration.informations);
                    fd.append('matricule_fiscale', $scope.Configuration.matricule_fiscale);
                    fd.append('name', $scope.Configuration.name);
                    fd.append('objet', $scope.Configuration.objet);
                    fd.append('price_timbre', $scope.Configuration.price_timbre);
                    fd.append('prime', $scope.Configuration.prime);
                    fd.append('product_display', $scope.Configuration.product_display);
                    fd.append('raison_social', $scope.Configuration.raison_social);
                    fd.append('rc', $scope.Configuration.rc);
                    fd.append('rib', $scope.Configuration.rib);
                    fd.append('seuil_cheque', $scope.Configuration.seuil_cheque);
                    fd.append('seuil_prime', $scope.Configuration.seuil_prime);
                    fd.append('siege', $scope.Configuration.siege);
                    fd.append('swift', $scope.Configuration.swift);
                    fd.append('telephone_1', $scope.Configuration.telephone_1);
                    fd.append('telephone_2', $scope.Configuration.telephone_2);
                    fd.append('telephone_3', $scope.Configuration.telephone_3);
                    fd.append('telephone_3', $scope.Configuration.telephone_3);
                    fd.append('type_activite', $scope.Configuration.type_activite);
                    fd.append('tva_id', $scope.Tva.id);
                    fd.append('file', file);
                    $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                            .success(function (data, status) {
                                factory.configuration = data;
                                $timeout(function () {
                                    deferred.resolve(factory.configuration);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                configPointage: function (config) {
                    console.log(config);
//                    var conf = {
//                        Configuration: {
//                            NHT: config.Configuration.NHT,
//                            ip_pointeuse: config.Configuration.ip_pointeuse,
//                            type_pointage: config.Configuration.type_pointage,
//                        },
//                        jours_travail: config.Configuration.jours_travail
//                    };
//                    console.log(conf);
                    var deferred = $q.defer();
                    var url = api_url() + "pages/config_pointage";
                    $http.post(url, config)
                            .success(function (data, status) {
                                factory.configpointage = data;
                                deferred.resolve(factory.configpointage);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listProducts: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "products/index_product";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.products = data;
                        
                     
                                deferred.resolve(factory.products);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                journale_caisse: function (datauser) {
                    var deferred = $q.defer();
                    var url = api_url() + "caisses/liste_reglement";
                    $http.post(url,datauser)
                            .success(function (data, status) {
                                factory.reglements = data.data;
                                deferred.resolve(factory.reglements);
                            }).error(function (data, status) {
                        deferred.reject('impossible de recupere les doonees')
                    });
                    return deferred.promise
                },
                listProductsFamille: function (dataProduct) {
                    var deferred = $q.defer();
                    var url = api_url() + "products/products_famille";
                    $http.post(url, dataProduct)
                            .success(function (data, status) {
                                factory.productsfamille = data.data;
                                deferred.resolve(factory.productsfamille);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                ajoutProduct: function (dataProduct) {
                    var deferred = $q.defer();
                    var url = api_url() + "products/ajout_product";
                    $http.post(url, dataProduct)
                            .success(function (data, status) {
                                factory.product = data;
                                deferred.resolve(factory.product);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                editProduct: function (file, dataProduct) {
                    var deferred = $q.defer();
                    console.log(file);
                    console.log(dataProduct);
                    var url = api_url() + "products/edit";
//                    var url = "http://localhost/test/angularfileupload/upload.php";
                    console.log(file);
                    var fd = new FormData();
                    fd.append('id', dataProduct.Product.id);
                    fd.append('name', dataProduct.Product.name);
                    fd.append('price', dataProduct.Product.price);
                    fd.append('marge', dataProduct.Product.marge);
                    fd.append('prix_achat', dataProduct.Product.prix_achat);
                    fd.append('code_barres', dataProduct.Product.code_barres);
                    fd.append('ref', dataProduct.Product.ref);
                    fd.append('tva_id', dataProduct.Product.tva_id);
                    fd.append('fournisseur_id', dataProduct.Product.fournisseur_id);
                    fd.append('famille_id', dataProduct.Product.famille_id);
                    fd.append('unite_id', dataProduct.Product.unite_id);
                    fd.append('category_id', dataProduct.Product.category_id);
                    fd.append('type', dataProduct.Product.type);
                    fd.append('file', file);
                    $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                            .success(function (data, status) {
                                factory.product = data;
                                $timeout(function () {
                                    deferred.resolve(factory.product);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewProduct: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Product: {
                            id: id
                        }
                    };
                    var url = api_url() + "products/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.product = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.product);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteProduct: function (dataProduct) {
                    var deferred = $q.defer();
                    var url = api_url() + "products/delete";
                    $http.post(url, dataProduct)
                            .success(function (data, status) {
                                factory.product = data;
                                $timeout(function () {
                                    deferred.resolve(factory.product);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                cancelReglement: function (dataReglement) {
                    var deferred = $q.defer();
                    var url = api_url() + "reglements/delete_reglement";
                    $http.post(url, dataReglement)
                            .success(function (data, status) {
                                factory.reglement = data;
                                $timeout(function () {
                                    deferred.resolve(factory.reglement);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!')
                    });
                    return deferred.promise;
                },
                // liste des emplacements
                listEmplacements: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "emplacements/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.emplacements = data;
                                deferred.resolve(factory.emplacements);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // liste des sous emplacements
                listSousEmplacements: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "sousemplacements/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.sousemplacements = data;
                                deferred.resolve(factory.sousemplacements);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // liste de stocks
                listStocks: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "stocks/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.stocks = data;
                                deferred.resolve(factory.stocks);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // valider stock
                valideStock: function (dataStock) {
                    var deferred = $q.defer();
                    var url = api_url() + "stocks/valide_stock";
                    $http.put(url, dataStock)
                            .success(function (data, status) {
                                factory.validestock = data;
                                deferred.resolve(factory.validestock);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // mouvement stock
                mouvementStock: function (DataStock) {
                    var deferred = $q.defer();
                    var url = api_url() + "stocks/mouvement_stock";
                    $http.put(url, DataStock)
                            .success(function (data, status) {
                                factory.mouvementstock = data;
                                deferred.resolve(factory.mouvementstock);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // add stock
                ajoutStock: function (dataStock) {
                    var deferred = $q.defer();
                    var url = api_url() + "stocks/add";
                    $http.post(url, dataStock)
                            .success(function (data, status) {
                                factory.stock = data;
                                deferred.resolve(factory.stock);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // add emplacement
                ajoutEmplacement: function (dataEmplacement) {
                    var deferred = $q.defer();
                    var url = api_url() + "emplacements/add";
                    $http.post(url, dataEmplacement)
                            .success(function (data, status) {
                                factory.emplacement = data;
                                deferred.resolve(factory.emplacement);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // add emplacement
                ajoutSousEmplacement: function (dataEmplacement) {
                    var deferred = $q.defer();
                    var url = api_url() + "sousemplacements/add";
                    $http.post(url, dataEmplacement)
                            .success(function (data, status) {
                                factory.sousemplacement = data;
                                deferred.resolve(factory.sousemplacement);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editStock: function (dataStock) {
                    var deferred = $q.defer();
                    //console.log(dataStock);
                    var url = api_url() + "stocks/edit";
                    $http.put(url, dataStock)
                            .success(function (data, status) {
                                factory.stock = data;
                                $timeout(function () {
                                    deferred.resolve(factory.stock);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                editEmplacement: function (dataEmplacement) {
                    var deferred = $q.defer();
                    //console.log(dataStock);
                    var url = api_url() + "emplacements/edit";
                    $http.put(url, dataEmplacement)
                            .success(function (data, status) {
                                factory.emplacement = data;
                                $timeout(function () {
                                    deferred.resolve(factory.emplacement);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                editSousEmplacement: function (dataEmplacement) {
                    var deferred = $q.defer();
                    //console.log(dataStock);
                    var url = api_url() + "sousemplacements/edit";
                    $http.put(url, dataEmplacement)
                            .success(function (data, status) {
                                factory.sousemplacement = data;
                                $timeout(function () {
                                    deferred.resolve(factory.sousemplacement);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewStock: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Stock: {
                            id: id
                        }
                    };
                    var url = api_url() + "stocks/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.stock = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.stock);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                viewEmplacement: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Emplacement: {
                            id: id
                        }
                    };
                    var url = api_url() + "emplacements/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.emplacement = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.emplacement);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                viewSousEmplacement: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Sousemplacement: {
                            id: id
                        }
                    };
                    var url = api_url() + "sousemplacements/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.sousemplacement = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.sousemplacement);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteStock: function (dataStock) {
                    var deferred = $q.defer();
                    var url = api_url() + "stocks/delete";
                    $http.post(url, dataStock)
                            .success(function (data, status) {
                                factory.stock = data;
                                $timeout(function () {
                                    deferred.resolve(factory.stock);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Tva
                listTva: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "tvas/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.tvas = data;
                                deferred.resolve(factory.tvas);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutTva: function (dataTva) {
                    var deferred = $q.defer();
                    var url = api_url() + "tvas/add";
                    $http.post(url, dataTva)
                            .success(function (data, status) {
                                factory.tva = data;
                                deferred.resolve(factory.tva);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editTva: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "tvas/edit";
                    $http.put(url, {Tva: $scope.Tva})
                            .success(function (data, status) {
                                factory.tva = data;
                                $timeout(function () {
                                    deferred.resolve(factory.tva);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewTva: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Tva: {
                            id: id
                        }
                    };
                    var url = api_url() + "tvas/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.tva = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.tva);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteTva: function (dataTva) {
                    var deferred = $q.defer();
                    var url = api_url() + "tvas/delete";
                    $http.post(url, dataTva)
                            .success(function (data, status) {
                                factory.tva = data;
                                $timeout(function () {
                                    deferred.resolve(factory.tva);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Famille
                listFamille: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "familles/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.familles = data;
                        
                                deferred.resolve(factory.familles);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutFamille: function (dataFamille) {
                    var deferred = $q.defer();
                    var url = api_url() + "familles/add";
                    $http.post(url, dataFamille)
                            .success(function (data, status) {
                                factory.famille = data;
                                deferred.resolve(factory.famille);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editFamille: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "familles/edit";
                    $http.put(url, {Famille: $scope.Famille})
                            .success(function (data, status) {
                                factory.famille = data;
                                $timeout(function () {
                                    deferred.resolve(factory.famille);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewFamille: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Famille: {
                            id: id
                        }
                    };
                    var url = api_url() + "familles/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.famille = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.famille);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteFamille: function (dataFamille) {
                    var deferred = $q.defer();
                    var url = api_url() + "familles/delete";
                    $http.post(url, dataFamille)
                            .success(function (data, status) {
                                factory.famille = data;
                                $timeout(function () {
                                    deferred.resolve(factory.famille);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Villes
                listVilles: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "villes/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.villes = data;
                                deferred.resolve(factory.villes);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //Cp
                listCp: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "cps/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.cps = data;
                                deferred.resolve(factory.cps);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutCp: function (dataCp) {
                    var deferred = $q.defer();
                    var url = api_url() + "cps/add";
                    $http.post(url, dataCp)
                            .success(function (data, status) {
                                factory.cp = data;
                                deferred.resolve(factory.cp);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editCp: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "cps/edit";
                    $http.put(url, {Cp: $scope.Cp})
                            .success(function (data, status) {
                                factory.cp = data;
                                $timeout(function () {
                                    deferred.resolve(factory.cp);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewCp: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Cp: {
                            id: id
                        }
                    };
                    var url = api_url() + "cps/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.cp = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.cp);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteCp: function (dataCp) {
                    var deferred = $q.defer();
                    var url = api_url() + "cps/delete";
                    $http.post(url, dataCp)
                            .success(function (data, status) {
                                factory.cp = data;
                                $timeout(function () {
                                    deferred.resolve(factory.cp);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Unite
                listUnite: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "unites/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.unites = data;
                                deferred.resolve(factory.unites);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutUnite: function (dataUnite) {
                    var deferred = $q.defer();
                    var url = api_url() + "unites/add";
                    $http.post(url, dataUnite)
                            .success(function (data, status) {
                                factory.unite = data;
                                deferred.resolve(factory.unite);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editUnite: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "unites/edit";
                    $http.put(url, {Unite: $scope.Unite})
                            .success(function (data, status) {
                                factory.unite = data;
                                $timeout(function () {
                                    deferred.resolve(factory.unite);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewUnite: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Unite: {
                            id: id
                        }
                    };
                    var url = api_url() + "unites/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.unite = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.unite);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteUnite: function (dataUnite) {
                    var deferred = $q.defer();
                    var url = api_url() + "unites/delete";
                    $http.post(url, dataUnite)
                            .success(function (data, status) {
                                factory.unite = data;
                                $timeout(function () {
                                    deferred.resolve(factory.unite);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Fournisseur
                listFournisseur: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "fournisseurs/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.fournisseurs = data;
                        
                                deferred.resolve(factory.fournisseurs);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutFournisseur: function (dataFournisseur) {
                    var deferred = $q.defer();
                    var url = api_url() + "fournisseurs/add";
                    $http.post(url, dataFournisseur)
                            .success(function (data, status) {
                                factory.fournisseur = data;
                                deferred.resolve(factory.fournisseur);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editFournisseur: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "fournisseurs/edit";
                    $http.put(url, {Fournisseur: $scope.Fournisseur})
                            .success(function (data, status) {
                                factory.fournisseur = data;
                                $timeout(function () {
                                    deferred.resolve(factory.fournisseur);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewFournisseur: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Fournisseur: {
                            id: id
                        }
                    };
                    var url = api_url() + "fournisseurs/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.fournisseur = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.fournisseur);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteFournisseur: function (dataFournisseur) {
                    var deferred = $q.defer();
                    var url = api_url() + "fournisseurs/delete";
                    $http.post(url, dataFournisseur)
                            .success(function (data, status) {
                                factory.fournisseur = data;
                                $timeout(function () {
                                    deferred.resolve(factory.fournisseur);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Category
                listCategory: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "categories/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.categories = data;
                        
                                deferred.resolve(factory.categories);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutCategory: function (dataCategory) {
                    var deferred = $q.defer();
                    var url = api_url() + "categories/add";
                    $http.post(url, dataCategory)
                            .success(function (data, status) {
                                factory.categorie = data;
                                deferred.resolve(factory.categorie);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editCategory: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "categories/edit";
                    $http.put(url, {Category: $scope.Category})
                            .success(function (data, status) {
                                factory.categorie = data;
                                $timeout(function () {
                                    deferred.resolve(factory.categorie);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewCategory: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Category: {
                            id: id
                        }
                    };
                    var url = api_url() + "categories/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.categorie = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.categorie);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteCategory: function (dataCategory) {
                    var deferred = $q.defer();
                    var url = api_url() + "categories/delete";
                    $http.post(url, dataCategory)
                            .success(function (data, status) {
                                factory.categorie = data;
                                $timeout(function () {
                                    deferred.resolve(factory.categorie);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Commande
                listCommandes: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandes = data;
                                deferred.resolve(factory.commandes);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //Commande ventes/produit
                listProductsVente: function (id) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/ventes_produit/" + id;
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandesventes = data.data;
                                deferred.resolve(factory.commandesventes);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //Commande achats/produit
                listProductsAchat: function (id) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/achats_produit/" + id;
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandesachats = data.data;
                                deferred.resolve(factory.commandesachats);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //mouvement product (achats, ventes)
                listMVMProducts: function (id) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/last_mvm_produit/" + id;
                    $http.post(url)
                            .success(function (data, status) {
                                var DataMVM = {
                                    'achats': data.dataachats,
                                    'ventes': data.dataventes
                                };
                                factory.DataMVM = DataMVM;
                                deferred.resolve(factory.DataMVM);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //mouvement product (achats, ventes)
                listCommandeAchatsFinaliseeProducts: function (id) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/achats_finalisee_produit/" + id;
                    $http.post(url)
                            .success(function (data, status) {
//                                var commandesfinaliseesproducts = {
//                                    'achats': data.dataachats,
//                                    'ventes': data.dataventes
//                                };
                                factory.commandesachatsfinaliseesproducts = data.achats;
                                deferred.resolve(factory.commandesachatsfinaliseesproducts);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listCommandeVentesFinaliseeProducts: function (id) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/ventes_finalisee_produit/" + id;
                    $http.post(url)
                            .success(function (data, status) {
//                                var commandesfinaliseesproducts = {
//                                    'achats': data.dataachats,
//                                    'ventes': data.dataventes
//                                };
                                factory.commandesventesfinaliseesproducts = data.ventes;
                                deferred.resolve(factory.commandesventesfinaliseesproducts);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //Commande
                listBLNonPayee: function (dataFactureBL) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/facture_groupe";
                    $http.post(url, dataFactureBL)
                            .success(function (data, status) {
                                factory.nonpayees = data;
                                deferred.resolve(factory.nonpayees);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //List Retenus à la source achat
                listRetenusAchat: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "retenus/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.retenus = data;
                                deferred.resolve(factory.retenus);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // view retenu achat
                viewRetenuAchat: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Retenus: {
                            id: id
                        }
                    };
                    var url = api_url() + "retenus/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.retenu = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.retenu);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //list commande for user
                listUserCommande: function (dataUser) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/index_user";
                    //console.log(dataUser);
                    $http.post(url, dataUser)
                            .success(function (data, status) {
                                factory.commandesuser = data;
                                deferred.resolve(factory.commandesuser);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //list commande for user
                listUserDevis: function (dataUser) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/devis_user";
                    //console.log(dataUser);
                    $http.post(url, dataUser)
                            .success(function (data, status) {
                                factory.devisuser = data;
                                deferred.resolve(factory.devisuser);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list commande for commerciale
                listCommercialeCommande: function (dataUser) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/index_commerciale";
                    //console.log(dataUser);
                    $http.post(url, dataUser)
                            .success(function (data, status) {
                                factory.commandescommerciale = data;
                                deferred.resolve(factory.commandescommerciale);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                listCommandesFinalisee: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_finalisee";
                    $http.post(url)
                            .success(function (data, status) {
//                                factory.finalisees = $.parseJSON(data);
                                factory.finalisees = data;
                                deferred.resolve(factory.finalisees);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                },
                listBLAvoir: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_avoir";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.listblavoir = data;
                                deferred.resolve(factory.listblavoir);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listBLUser: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/commandes_finalisee_user";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.finalisees = data.data;
                                deferred.resolve(factory.finalisees);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                },
                listBLFilterUser: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/commandes_user";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.filteruser = data;
                                deferred.resolve(factory.filteruser);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                showReglement: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Commande: {
                            id: id
                        }
                    };
                    var url = api_url() + "commandes/show_reglement";
                    $http.post(url, data)
                            .success(function (data, status) {
                                var reglements = [
                                    {
                                        'Commandes': data.text,
                                        'Ttc_reglement': data.ttc_reglement
                                    }
                                ];
                                factory.reglement = reglements;
                                factory.payments = data.payements;
                                $timeout(function () {
                                    deferred.resolve(factory.reglement);
                                    deferred.resolve(factory.payments);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                passerReglement: function (dataReglement) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/passerReglement";
                    $http.post(url, dataReglement)
                            .success(function (data, status) {
                                factory.reglement = data;
                                $timeout(function () {
                                    deferred.resolve(factory.reglement);
                                }, 1);

                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                passerCommande: function (dataCommande) {
                    
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/add";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                genererFacture: function (dataFacture) {
                    var deferred = $q.defer();
                    //console.log(dataFacture);
                    var url = api_url() + "commandes/generer_facture";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                groupedReglement: function (dataRegle) {
                    var deferred = $q.defer();
                    console.log(dataRegle);
                    var url = api_url() + "factures/reglement_grouped";
                    $http.post(url, dataRegle)
                            .success(function (data, status) {
                                factory.reglementgouped = data;
                                $timeout(function () {
                                    deferred.resolve(factory.reglementgouped);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editCommande: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/edit";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                showCommande: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Commande: {
                            id: id
                        }
                    };
                    var url = api_url() + "commandes/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.commande = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                showConfig: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/config";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.config = data;
                                deferred.resolve(factory.config);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                showConfigGlobal: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "pages/show_config";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.config = data;
                                deferred.resolve(factory.config);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                livraisonCommande: function (dataCommandeLivraison) {
                    var deferred = $q.defer();
                    var url = api_url() + "devis/change_livraison";
                    $http.put(url, dataCommandeLivraison)
                            .success(function (data, status) {
                                factory.commande = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                livraisonFacture: function (dataFactureLivraison) {
                    var deferred = $q.defer();
                    //console.log(dataFactureLivraison);
                    var url = api_url() + "devis/bon_livraison_facture";
                    $http.put(url, dataFactureLivraison)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteCommande: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/delete";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                deleteBon: function (dataBon) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/delete_bon";
                    $http.post(url, dataBon)
                            .success(function (data, status) {
                                factory.bon = data;
                                $timeout(function () {
                                    deferred.resolve(factory.bon);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Devis
                listDevis: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "devis/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandes = data;
                                deferred.resolve(factory.commandes);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                passerDevis: function (dataCommande) {
                    var deferred = $q.defer();
                    //console.log(dataCommande);
                    var url = api_url() + "devis/add";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editDevis: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "devis/edit";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
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
                showDevis: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Commande: {
                            id: id
                        }
                    };
                    var url = api_url() + "devis/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.commande = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteDevi: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "devis/delete";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Commerciale
                listCommerciales: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "users/list_commerciales";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commerciales = data;
                                deferred.resolve(factory.commerciales);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutCommerciale: function (dataCommerciale) {
                    var deferred = $q.defer();
                    //console.log(dataCommerciale);
                    var url = api_url() + "users/add_commerciale";
                    $http.post(url, dataCommerciale)
                            .success(function (data, status) {
                                factory.commerciale = data;
                                deferred.resolve(factory.commerciale);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editCommerciale: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "users/edit";
                    $http.put(url, {User: $scope.User})
                            .success(function (data, status) {
                                factory.commerciale = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commerciale);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Client
                listClients: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "users/list_clients";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.clients = data;
                                deferred.resolve(factory.clients);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //Client Export
                listClientsExport: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "clients/list_clients";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.clients = data;
                                deferred.resolve(factory.clients);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutClient: function (dataClient) {
                    var deferred = $q.defer();
                    var url = api_url() + "users/add_client";
                    $http.post(url, dataClient)
                            .success(function (data, status) {
                                factory.client = data;
                                deferred.resolve(factory.client);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // add client for modal
                ajoutNewClient: function (dataClient) {
                    var deferred = $q.defer();
                    var url = api_url() + "users/add_client";
                    $http.post(url, dataClient)
                            .success(function (data, status) {
                                factory.client = data;
                                deferred.resolve(factory.client);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editClient: function (dataUser) {
                    var deferred = $q.defer();
                    var url = api_url() + "users/edit_client";
                    $http.put(url, dataUser)
                            .success(function (data, status) {
                                factory.client = data;
                                $timeout(function () {
                                    deferred.resolve(factory.client);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewClient: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        User: {
                            id: id
                        }
                    };
                    var url = api_url() + "users/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.client = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.client);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                deleteClient: function (dataClient) {
                    var deferred = $q.defer();
                    var url = api_url() + "users/delete";
                    $http.post(url, dataClient)
                            .success(function (data, status) {
                                factory.client = data;
                                $timeout(function () {
                                    deferred.resolve(factory.client);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //User
                listUsers: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "users/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.users = data;
                                deferred.resolve(factory.users);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutUser: function (dataClient) {
                    var deferred = $q.defer();
                    var url = api_url() + "users/add";
                    $http.post(url, dataClient)
                            .success(function (data, status) {
                                factory.user = data;
                                deferred.resolve(factory.user);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editUtilisateur: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "users/edit";
                    $http.put(url, {User: $scope.User})
                            .success(function (data, status) {
                                factory.client = data;
                                $timeout(function () {
                                    deferred.resolve(factory.client);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                checkStuff: function (DataRegle) {
                    var deferred = $q.defer();
                    var url = api_url() + "reglements/edit_reglement";
                    $http.put(url, DataRegle)
                            .success(function (data, status) {
                                factory.reglement = data;
                                $timeout(function () {
                                    deferred.resolve(factory.reglement);
                                }, 1);

                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                },
                editBon: function (DataBon) {
                    var deferred = $q.defer();
                    console.log(DataBon);
                    var url = api_url() + "bons/send_avoir_by_product";
                    $http.put(url, DataBon)
                            .success(function (data, status) {
                                factory.bon = data;
                                $timeout(function () {
                                    deferred.resolve(factory.bon);
                                }, 1);

                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                },
                avoirArticle: function (dataArticle) {
                    var deferred = $q.defer();
                    console.log(dataArticle);
                    var url = api_url() + "factures/avoir_by_product";
                    $http.put(url, dataArticle)
                            .success(function (data, status) {
                                factory.avoirarticle = data;
                                $timeout(function () {
                                    deferred.resolve(factory.avoirarticle);
                                }, 1);

                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //Payment
                listPayments: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "payments/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.payments = data;
                                deferred.resolve(factory.payments);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //Notification
                listNotifications: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "notifications/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.notifications = data.notification;
                                factory.count = data.count;
                                deferred.resolve(factory.notifications);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //Facture
                // list factures ventes
                listFactures: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.factures = data;
                                deferred.resolve(factory.factures);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // list Factures ventes avoir
                listFacturesAvoir: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/index_avoir";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.facturesavoir = data;
                                deferred.resolve(factory.facturesavoir);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // facture en avoir
                avoirFacture: function (DataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/avoir";
                    $http.put(url, DataFacture)
                            .success(function (data, status) {
                                factory.avoirfacture = data;
                                $timeout(function () {
                                    deferred.resolve(factory.avoirfacture);
                                }, 1);

                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                },
                declarationFiscale: function (dataFacture) {
                    console.log(dataFacture);
                    var deferred = $q.defer();
                    var url = api_url() + "factures/declaration_fiscale";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                var DataFacture = {
                                    'declarations': data.data,
                                    'facturesavoir': data.facturesavoir,
                                    'count': data.count,
                                    'count_avoir': data.count_avoir
                                };
                                factory.declarations = DataFacture;
                                deferred.resolve(factory.declarations);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                etatFacturesVentes: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/etat_facture_vente";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.facturesventes = data;
                                deferred.resolve(factory.facturesventes);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listFactureFournisseur: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/achats_fournisseur";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.facturesfournisseur = data;
                                deferred.resolve(factory.facturesfournisseur);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                },
                listPaymentsUser: function (dataPayment) {
                    var deferred = $q.defer();
                    var url = api_url() + "paymentsUsers/index";
                    $http.post(url, dataPayment)
                            .success(function (data, status) {
                                var paymentsusersTable = {
                                    'user': data.user,
                                    'payments': data.payments
                                };
                                factory.paymentsusers = paymentsusersTable;
                                factory.payments = data.payments;
                                deferred.resolve(factory.paymentsusers);
                                deferred.resolve(factory.payments);
                            }).error(function (data, status) {
//                        deferred.reject('impossible !!!');
                    });
                    return deferred.promise;
                },
                //list facture for commerciale
                listCommercialeFacture: function (dataCommerciale) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/index_commerciale";
                    //console.log(dataCommerciale);
                    $http.post(url, dataCommerciale)
                            .success(function (data, status) {
                                factory.facturescommerciale = data;
                                deferred.resolve(factory.facturescommerciale);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //prime for commercial
                PrimeCommercial: function (dataCommercial) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/prime_commercial";
                    //console.log(dataCommerciale);
                    $http.post(url, dataCommercial)
                            .success(function (data, status) {
                                factory.primecommercial = data;
                                deferred.resolve(factory.primecommercial);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                showReglementFacture: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Facture: {
                            id: id
                        }
                    };
                    var url = api_url() + "factures/show_reglement_fournisseur";
                    $http.post(url, data)
                            .success(function (data, status) {
                                var reglements = [
                                    {
                                        'Factures': data.text,
                                        'Ttc_reglement': data.ttc_reglement
                                    }
                                ];
                                factory.reglement = reglements;
                                factory.payments = data.payements;
                                $timeout(function () {
                                    deferred.resolve(factory.reglement);
                                    deferred.resolve(factory.payments);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                passerReglementFournisseur: function (dataReglement) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/add_reglement_fournisseur";
                    $http.post(url, dataReglement)
                            .success(function (data, status) {
                                factory.reglement = data;
                                $timeout(function () {
                                    deferred.resolve(factory.reglement);
                                }, 1);

                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //Facture for user in fiche client
                listFactureUser: function (dataUser) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/index_user";
                    $http.post(url, dataUser)
                            .success(function (data, status) {
                                factory.facturesuser = data;
                                deferred.resolve(factory.facturesuser);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //Facture for Fournisseur in fiche client
                listFactureFournisseur: function (dataFournisseur) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/index_fournisseur";
                    $http.post(url, dataFournisseur)
                            .success(function (data, status) {
                                factory.facturesfournisseur = data;
                                deferred.resolve(factory.facturesfournisseur);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutFacture: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/add";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.facture = data;
                                deferred.resolve(factory.facture);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                genererFactureAvoir: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/generer_avoir";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.factureavoir = data;
                                deferred.resolve(factory.factureavoir);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                genererBLAvoir: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/generer_avoir";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.blavoir = data;
                                deferred.resolve(factory.blavoir);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                editFacture: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/edit";
                    $http.put(url, {Facture: $scope.Facture})
                            .success(function (data, status) {
                                factory.facture = data;
                                $timeout(function () {
                                    deferred.resolve(factory.facture);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                viewFacture: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Facture: {
                            id: id
                        }
                    };
                    var url = api_url() + "factures/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.facture = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.facture);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                viewFactureCommande: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Facture: {
                            id: id
                        }
                    };
                    var url = api_url() + "factures/view_facturescommande";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.facturecommandes = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.facturecommandes);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                deleteFacture: function (dataProduct) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/delete";
                    $http.post(url, dataProduct)
                            .success(function (data, status) {
                                factory.facture = data;
                                $timeout(function () {
                                    deferred.resolve(factory.facture);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!')
                    });
                    return deferred.promise;
                },
                //Facture Achat
                listFacturesAchat: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/index_achat";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.facturesAchat = data;
                                deferred.resolve(factory.facturesAchat);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutCommandeAchat: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/add_achat";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.commandeAchat = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeAchat);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                editCommandeAchat: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/edit_achat";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.commandeAchatEdit = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeAchatEdit);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                confirmCommandeAchat: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/confirm_achat";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.blAchat = data;
                                $timeout(function () {
                                    deferred.resolve(factory.blAchat);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // générer facture achat
                generateFactureAchat: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/generer_facture_achat";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.factureAchat = data;
                                $timeout(function () {
                                    deferred.resolve(factory.factureAchat);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // générer facture achat avec bon réception
                generateFactureBRAchat: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/generer_br_facture_achat";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.factureAchat = data;
                                $timeout(function () {
                                    deferred.resolve(factory.factureAchat);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //List Commande Achat
                listCommandesAchat: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/index_achat";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandesachat = data;
                                deferred.resolve(factory.commandesachat);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //List Demande prix
                listDemandePrix: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/index_demande_prix";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.demandesprix = data;
                                deferred.resolve(factory.demandesprix);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                //Bon de réception Achat
                listBonReception: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/index_bon_reception";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.bonreceptions = data.data;
                                deferred.resolve(factory.bonreceptions);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                ajoutFactureAchat: function (dataFacture) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/add_achat";
                    $http.post(url, dataFacture)
                            .success(function (data, status) {
                                factory.facture = data;
                                deferred.resolve(factory.facture);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                // Module reglement
                // liste reglement ventes
                listReglementsVentes: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "reglements/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.reglementsventes = data.data;
                                deferred.resolve(factory.reglementsventes);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // liste reglement achats
                listReglementsAchats: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "reglements/index_fournisseur";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.reglementsachats = data.data;
                                deferred.resolve(factory.reglementsachats);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client
                listCommandeEspaceclient: function (dataUser) {
                    console.log(dataUser);
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_espaceclient";
                    $http.post(url, dataUser)
                            .success(function (data, status) {
                                factory.commandesespaceclient = data.data;
                                deferred.resolve(factory.commandesespaceclient);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list client commande ramassage ou depot
                listClientRamassageDepot: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/ramassages_par_client";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.clientsramassage = data;
                                deferred.resolve(factory.clientsramassage);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list client commande ramassage ou depot
                listClientRamassageDepotPaginate: function (pageNumber, limit, searchKey, ville) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            limit: limit,
                            searchKey: searchKey,
                            ville_id: ville
                        }
                    };
                    var url = api_url() + "commandes/ramassages_par_client_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.clientsramassage = data;
                                deferred.resolve(factory.clientsramassage);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list client commande transporteur
                listClientTransporteur: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/all_commandes_for_client";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.clientstransporteur = data.data;
                                deferred.resolve(factory.clientstransporteur);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list client commande ramassage ou depot
                listClientRecuperees: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/recuperer_par_client";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.clientsrecuperer = data;
                                deferred.resolve(factory.clientsrecuperer);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listClientRecupereesPaginate: function (pageNumber, limit, searchKey, ville) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            limit: limit,
                            searchKey: searchKey,
                            ville_id: ville
                        }
                    };
                    var url = api_url() + "commandes/recuperer_par_client_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.clientsrecuperer = data;
                                deferred.resolve(factory.clientsrecuperer);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client liste commande en attente livraison
                listCommandeEnattenteLivraisonEspaceclient: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_enattentelivraison_espaceclient";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandeseEnattentelivraisonspaceclient = data;
                                deferred.resolve(factory.commandeseEnattentelivraisonspaceclient);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client liste commande en attente livraison
                listCommandeEnattenteLivraisonEspaceclientPaginate: function (pageNumber, limit, searchKey, dataFilter) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: dataFilter.ville_id,
                            user_id: dataFilter.user_id,
                            livreur_id: dataFilter.livreur_id
                        }
                    };
                    var url = api_url() + "commandes/commandes_enattentelivraison_espaceclient_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandeseEnattentelivraisonspaceclient = data;
                                deferred.resolve(factory.commandeseEnattentelivraisonspaceclient);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client
                listCommandeEncoursEspaceclient: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_encours_espaceclient";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandesencoursespaceclient = data.data;
                                deferred.resolve(factory.commandesencoursespaceclient);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list commandes for client
                listEncoursUser: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/encours_in_client";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.encoursinclient = data.data;
                                deferred.resolve(factory.encoursinclient);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client
                listCommandeEnstocks: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_enstock_espaceclient";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandesenstock = data;
                                deferred.resolve(factory.commandesenstock);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listCommandeEnstocksPaginate: function (pageNumber, limit, searchKey, ville) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville
                        }
                    };
                    var url = api_url() + "commandes/commandes_enstock_espaceclient_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandesenstock = data;
                                deferred.resolve(factory.commandesenstock);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list bon chargement
                listBonChargement: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/bon_chargement";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.bonchargements = data.data;
                                deferred.resolve(factory.bonchargements);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                bonChargement: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Chargement: {
                            id: id
                        }
                    };
                    var url = api_url() + "commandes/view_bon_chargement";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.bonchargement = data;
                                $timeout(function () {
                                    deferred.resolve(factory.bonchargement);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client commandes livrées
                listCommandeLivreeEspaceclient: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_livree_espaceclient";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandeslivrees = data;
                                deferred.resolve(factory.commandeslivrees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client commandes livrées paginate
                listCommandeLivreeEspaceclientPaginate: function (pageNumber, limit, searchKey, ville) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville
                        }
                    };
                    var url = api_url() + "commandes/commandes_livree_espaceclient_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandeslivrees = data;
                                deferred.resolve(factory.commandeslivrees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client commandes retours
                listCommandeRetoursEspaceclient: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_retour_espaceclient";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandesretours = data;
                                deferred.resolve(factory.commandesretours);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listCommandeRetoursEspaceclientPaginate: function (pageNumber, limit, searchKey, ville, etatRetoure) {
                    var deferred = $q.defer();
                    console.log(etatRetoure);
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville,
                            etatRetoure: etatRetoure
                        }
                    };
                    console.log(dataCmd);
                    var url = api_url() + "commandes/commandes_retour_espaceclient_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandesretours = data;
                                deferred.resolve(factory.commandesretours);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client commanedes annulées
                listCommandeAnnuleeEspaceclient: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_annulee_espaceclient";
                    $http.post(url)
                            .success(function (response, status) {
                                factory.commandesannulee = {
                                    data: response.data,
                                    count: response.count,
                                    countfacture: response.countfacture,
                                    countnotfacture: response.countnotfacture
                                };
                                deferred.resolve(factory.commandesannulee);
                            }).error(function (error, status) {
                    });
                    return deferred.promise;
                },
                listCommandeAnnuleeEspaceclientPaginate: function (pageNumber, limit, searchKey, ville, etatFacture) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville,
                            etatFacture: etatFacture
                        }
                    };
                    var url = api_url() + "commandes/commandes_annulee_espaceclient_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandesannulee = data;
                                deferred.resolve(factory.commandesannulee);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // espace client commanedes facturées
                listCommandeFacturees: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/list_commandes_facturees";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.commandesfacturees = data;
                                deferred.resolve(factory.commandesfacturees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listCommandeFactureesPaginate: function (pageNumber, limit, searchKey, ville) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville
                        }
                    };
                    var url = api_url() + "commandes/list_commandes_facturees_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.commandesfacturees = data;
                                deferred.resolve(factory.commandesfacturees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // commandes retournées à l'expéditeur
                listRetoursExpediteur: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/commandes_retourexpediteur";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.listretoursexpediteur = data;
                                deferred.resolve(factory.listretoursexpediteur);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listRetoursExpediteurPaginate: function (pageNumber, limit, searchKey, ville) {
                    var deferred = $q.defer();
                    var dataCmd = {
                        Commande: {
                            searchKey: searchKey,
                            limit: limit,
                            ville_id: ville
                        }
                    };
                    var url = api_url() + "commandes/commandes_retourexpediteur_paginate?page=" + pageNumber;
                    $http.post(url, dataCmd)
                            .success(function (data, status) {
                                factory.listretoursexpediteur = data;
                                deferred.resolve(factory.listretoursexpediteur);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // passer commande client
                ajoutCommandeClient: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/add_commande_client";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.ajoutcommande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.ajoutcommande);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //affecter commaande à un commercial
                affecterCommercial: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/affecter_commercial";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.commandeCommercial = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeCommercial);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //affecter ensemble de commande à un livreur
                affecterGroupeCommandeLivreur: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/generer_bon_chargement";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commandeLivreur = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeLivreur);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // generer factures groupe bl
                genererFacturerGrouped: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/generer_facturer_grouped";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.facturesgrouped = data;
                                $timeout(function () {
                                    deferred.resolve(factory.facturesgrouped);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //affecter commaande à un livreur
                affecterLivreur: function (dataCommandeLivreur) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/affecter_commercial";
                    $http.put(url, dataCommandeLivreur)
                            .success(function (data, status) {
                                factory.commandeLivreur = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeLivreur);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //affecter multi commande à un commercial
                affecterGroupeCommercial: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/affecter_groupe_commercial";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commandeGroupeCommercial = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeGroupeCommercial);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //affecter multi commande ramassage à un commercial 
                affecterGroupeRamassage: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/affecter_groupe_commercial";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commandeGroupeCommercial = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeGroupeCommercial);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //affecter multi commande ramassage par multi client 
                affectercommandesClients: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/affecter_commandes_clients";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.affectercommandesClients = data;
                                $timeout(function () {
                                    deferred.resolve(factory.affectercommandesClients);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // validate commande for code barre
                viewCommandeBarrecode: function (ref) {
                    var deferred = $q.defer();
                    var data = {
                        Commande: {
                            ref: ref
                        }
                    };
                    var url = api_url() + "commandes/view_commandebarrecode";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.commandeBarrecode = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeBarrecode);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // validate commande for code barre
                viewCommandeBarrecodeStock: function (ref) {
                    var deferred = $q.defer();
                    var data = {
                        Commande: {
                            ref: ref
                        }
                    };
                    var url = api_url() + "commandes/view_commandebarrecode_stock";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.commandeBarrecode = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeBarrecode);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // validate commande for code barre for bon chargement
                viewCommandeBarrecodeBonchargement: function (ref) {
                    var deferred = $q.defer();
                    var data = {
                        Commande: {
                            ref: ref
                        }
                    };
                    var url = api_url() + "commandes/view_commandebarrecode_bonchargement";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.commandeBarrecode = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commandeBarrecode);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // entrer commande en stock transporteur
                ValidateCommande: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/validercommandebarrecode";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.vildeCommande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.vildeCommande);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // entrer commande en stock gestion commercial
                ValidateCommandeStock: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/enter_stock";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.vildeCommande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.vildeCommande);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // valider commande depot 
                ValidateRamassage: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/validerramassagemanu";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.vildeCommande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.vildeCommande);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // valider commande en attente livraison 
                validerAttenteLivraison: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/validerattentelivraison";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.livreurcommandelivree = data;
                                $timeout(function () {
                                    deferred.resolve(factory.livreurcommandelivree);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // livrée commande
                livreecommande: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/livreecommande";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.livreecommande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.livreecommande);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // List ramassage et dépôt
                listRamassageDepot: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/list_ramassage_depot";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.listramassagedepots = data.data;
                                $timeout(function () {
                                    deferred.resolve(factory.listramassagedepots);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // valider commande depot 
                facturerAnnule: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "factures/facturer_annulee";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.facturerCommande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.facturerCommande);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // activer réaffection annulation
                activerReaffectation: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/activer_reaffectation_annulation";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.activerReaffectation = data;
                                $timeout(function () {
                                    deferred.resolve(factory.activerReaffectation);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // activer livraison vers stock
                activerLivraisonStock: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/modif_state_livree";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.modifstatelivree = data;
                                $timeout(function () {
                                    deferred.resolve(factory.modifstatelivree);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // valider annulation de commande
                ValidateAnnulationCommande: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/validerannulecommande";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.vildeannuleeCommande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.vildeannuleeCommande);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // valider retour de commande à l'expéditeur
                retourcommandeExpediteur: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/retourcommandeExpediteur";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.retourExpediteur = data;
                                $timeout(function () {
                                    deferred.resolve(factory.retourExpediteur);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // gestion livreurs
                //list Livreur
                listLivreurs: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "livreurs/list_livreurs";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.livreurs = data;
                                deferred.resolve(factory.livreurs);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // add livreur
                ajoutLivreur: function (dataLivreur) {
                    var deferred = $q.defer();
                    //console.log(dataLivreur);
                    var url = api_url() + "livreurs/add_livreur";
                    $http.post(url, dataLivreur)
                            .success(function (data, status) {
                                factory.livreur = data;
                                deferred.resolve(factory.livreur);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // edit livreur
                editLivreur: function ($scope) {
                    var deferred = $q.defer();
                    var url = api_url() + "livreurs/edit";
                    $http.put(url, {Livreur: $scope.Livreur})
                            .success(function (data, status) {
                                factory.livreur = data;
                                $timeout(function () {
                                    deferred.resolve(factory.livreur);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                viewLivreur: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Livreur: {
                            id: id
                        }
                    };
                    var url = api_url() + "livreurs/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.livreur = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.livreur);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list commande for user
                listRecupereesLivreur: function (dataLivreur) {
                    var deferred = $q.defer();
                    var url = api_url() + "livreurs/commandes_recuperees";
                    //console.log(dataUser);
                    $http.post(url, dataLivreur)
                            .success(function (data, status) {
                                factory.recuperees = data.data;
                                deferred.resolve(factory.recuperees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list commande for user
                listEnAttenteLivreur: function (dataLivreur) {
                    var deferred = $q.defer();
                    var url = api_url() + "livreurs/commandes_enattente";
                    //console.log(dataUser);
                    $http.post(url, dataLivreur)
                            .success(function (data, status) {
                                factory.enattentes = data.data;
                                deferred.resolve(factory.enattentes);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list commande for user
                listLivreeLivreur: function (dataLivreur) {
                    var deferred = $q.defer();
                    var url = api_url() + "livreurs/commandes_livrees";
                    //console.log(dataUser);
                    $http.post(url, dataLivreur)
                            .success(function (data, status) {
                                factory.livrees = data.data;
                                deferred.resolve(factory.livrees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list commande for user
                listRetoursLivreur: function (dataLivreur) {
                    var deferred = $q.defer();
                    var url = api_url() + "livreurs/commandes_retours";
                    //console.log(dataUser);
                    $http.post(url, dataLivreur)
                            .success(function (data, status) {
                                factory.retours = data.data;
                                deferred.resolve(factory.retours);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list commande for user
                listAnnulationsLivreur: function (dataLivreur) {
                    var deferred = $q.defer();
                    var url = api_url() + "livreurs/commandes_annulees";
                    //console.log(dataUser);
                    $http.post(url, dataLivreur)
                            .success(function (data, status) {
                                factory.annulations = data.data;
                                deferred.resolve(factory.annulations);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                editCommandeTransport: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "commandes/edit_transport";
                    $http.put(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //purge cache
                purgeCache: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "pages/purge_cache";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.purge_cache = data.success;
                                $timeout(function () {
                                    deferred.resolve(factory.purge_cache);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                /**
                 * Module MailBOX
                 * @methode getAllInbox()
                 * @param {type} userEmailData
                 * @returns {$q@call;defer.promise}
                 */
                getAllInbox: function (userEmailData) {
                    var deferred = $q.defer();
                    var url = api_url() + "messages/inbox";
                    $http.post(url, userEmailData)
                            .success(function (data, status) {
                                factory.inbox = data;
                                $timeout(function () {
                                    deferred.resolve(factory.inbox);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // module note de frais
                listFrais: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "frais/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.frais = data;
                                deferred.resolve(factory.frais);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                listFraisFilter: function (dataFrai) {
                    var deferred = $q.defer();
                    var url = api_url() + "frais/index_filter";
                    $http.post(url, dataFrai)
                            .success(function (data, status) {
                                factory.fraisfilter = data.data;
                                deferred.resolve(factory.fraisfilter);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                addNoteFrais: function (dataFrais) {
                    var deferred = $q.defer();
                    console.log(dataFrais);
//                    console.log(file);
                    var url = api_url() + "frais/add_ajax";
                    var fd = new FormData();
                    fd.append('designation', dataFrais.Frai.designation);
                    fd.append('motif', dataFrais.Frai.motif);
                    fd.append('montant', dataFrais.Frai.montant);
                    fd.append('file', dataFrais.Frai.preuve);
                    $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                            .success(function (data, status) {
                                factory.notefrais = data;
                                $timeout(function () {
                                    deferred.resolve(factory.notefrais);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                deleteFrais: function (dataProduct) {
                    var deferred = $q.defer();
                    var url = api_url() + "frais/delete";
                    $http.post(url, dataProduct)
                            .success(function (data, status) {
                                factory.frais = data;
                                $timeout(function () {
                                    deferred.resolve(factory.frais);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list delegations costom ville
                listLocaliteVille: function (dataLocalite) {
                    var deferred = $q.defer();
                    var url = api_url() + "villes/list_localites_delegation";
                    //console.log(dataUser);
                    $http.post(url, dataLocalite)
                            .success(function (data, status) {
                                factory.localitees = data.data;
                                deferred.resolve(factory.localitees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list emplacement costom entrepot
                listCostomEmplacement: function (dataStock) {
                    var deferred = $q.defer();
                    var url = api_url() + "emplacements/emplacement_stock";
                    $http.post(url, dataStock)
                            .success(function (data, status) {
                                factory.emplacementsStock = data;
                                deferred.resolve(factory.emplacementsStock);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list emplacement costom entrepot
                listCostomSousEmplacement: function (dataEmplacement) {
                    var deferred = $q.defer();
                    var url = api_url() + "emplacements/sousemplacement_stock";
                    $http.post(url, dataEmplacement)
                            .success(function (data, status) {
                                factory.sousemplacementsStock = data;
                                deferred.resolve(factory.sousemplacementsStock);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list emplacement costom entrepot
                costomStock: function (page, dataStock) {
                    var deferred = $q.defer();
                    var url = api_url() + "emplacements/custom_stock?page=" + page;
                    $http.post(url, dataStock)
                            .success(function (data, status) {
                                factory.costomstock = data;
                                deferred.resolve(factory.costomstock);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list product for custom emplacement
                productEmplacement: function (page, dataEmplacement) {
                    var deferred = $q.defer();
                    var url = api_url() + "emplacements/products_emplacement?page=" + page;
                    $http.post(url, dataEmplacement)
                            .success(function (data, status) {
                                factory.productsemplacement = data;
                                deferred.resolve(factory.productsemplacement);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list emplacement costom entrepot
                listcustomProduct: function (page, SousEmplacement) {
                    var deferred = $q.defer();
                    var url = api_url() + "emplacements/custom_product?page=" + page;
                    $http.post(url, SousEmplacement)
                            .success(function (data, status) {
                                factory.sousproduct = data;
                                deferred.resolve(factory.sousproduct);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list emplacement costom entrepot
                productStock: function (dataStock) {
                    var deferred = $q.defer();
                    var url = api_url() + "emplacements/product_stock";
                    $http.post(url, dataStock)
                            .success(function (data, status) {
                                factory.productstock = data;
                                deferred.resolve(factory.productstock);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //generer bon sortie
                genererBonSortie: function (dataCommande) {
                    var deferred = $q.defer();
                    var url = api_url() + "sorties/generer_bon_sortie";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.genererbonsortie = data;
                                $timeout(function () {
                                    deferred.resolve(factory.genererbonsortie);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list bon sorties
                listBonSortie: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "sorties/index";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.bonsorties = data.data;
                                deferred.resolve(factory.bonsorties);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                //list bon entrées
                listBonEntree: function () {
                    var deferred = $q.defer();
                    var url = api_url() + "sorties/index_entree";
                    $http.post(url)
                            .success(function (data, status) {
                                factory.bonentrees = data.data;
                                deferred.resolve(factory.bonentrees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                viewBonSortie: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Sortie: {
                            id: id
                        }
                    };
                    var url = api_url() + "sorties/view";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.bonsortie = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.bonsortie);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                viewBonEntree: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Entree: {
                            id: id
                        }
                    };
                    var url = api_url() + "sorties/view_entree";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.bonentree = data.text;
                                $timeout(function () {
                                    deferred.resolve(factory.bonentree);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                showHistorique: function (id) {
                    var deferred = $q.defer();
                    var data = {
                        Commande: {
                            id: id
                        }
                    };
                    var url = api_url() + "historiques/index";
                    $http.post(url, data)
                            .success(function (data, status) {
                                factory.historiques = data.data;
                                $timeout(function () {
                                    deferred.resolve(factory.historiques);
                                }, 1);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // stock
                // list bon sorties paginate
                listBonSortiePaginate: function (pageNumber, searchKey) {
                    var deferred = $q.defer();
                    var dataSortie = {
                        Sortie: {
                            searchKey: searchKey
                        }
                    };
                    var url = api_url() + "sorties/sorties_paginate?page=" + pageNumber;
                    $http.post(url, dataSortie)
                            .success(function (data, status) {
                                factory.bonsorties = data;
                                deferred.resolve(factory.bonsorties);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list bon sorties paginate
                listBonSortiePaginate: function (pageNumber, searchKey) {
                    var deferred = $q.defer();
                    var dataSortie = {
                        Sortie: {
                            searchKey: searchKey
                        }
                    };
                    var url = api_url() + "sorties/sorties_paginate?page=" + pageNumber;
                    $http.post(url, dataSortie)
                            .success(function (data, status) {
                                factory.bonsorties = data;
                                deferred.resolve(factory.bonsorties);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                // list bon d'entrée paginate
                listBonEntreePaginate: function (pageNumber, searchKey) {
                    var deferred = $q.defer();
                    var dataEntree = {
                        Entree: {
                            searchKey: searchKey
                        }
                    };
                    var url = api_url() + "sorties/entrees_paginate?page=" + pageNumber;
                    $http.post(url, dataEntree)
                            .success(function (data, status) {
                                factory.bonentrees = data;
                                deferred.resolve(factory.bonentrees);
                            }).error(function (data, status) {
                    });
                    return deferred.promise;
                },
                valide_Livraison: function (dataCommande) {
                    //console.log(dataCommande);
                    var deferred = $q.defer();
                    var url = api_url() + "caisses/valide_Livraison";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                valide_Devis: function (dataCommande) {
                    //console.log(dataCommande);
                    var deferred = $q.defer();
                    var url = api_url() + "caisses/valide_Devis";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
                valide_panier: function (dataCommande) {
                    //console.log(dataCommande);
                    var deferred = $q.defer();
                    var url = api_url() + "caisses/valide_panier";
                    $http.post(url, dataCommande)
                            .success(function (data, status) {
                                factory.commande = data;
                                $timeout(function () {
                                    deferred.resolve(factory.commande);
                                }, 1);
                            }).error(function (data, status) {
//                        deferred.reject('Echec de connxion !!!');
                    });
                    return deferred.promise;
                },
            };
            return factory;
        });
 