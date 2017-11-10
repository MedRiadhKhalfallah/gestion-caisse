angular.module('starter.controllers.stocks', [])
//        stock controller
        .controller("StocksController", function ($scope, PostFactory, $location, $cookieStore, $compile) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.changeProducts = function () {
                    console.log('sdqsdqsdqsdqsdqs');
                }
                $('#exportableList').hide();
                $('#EntrepotBlock').show();
                $scope.currentPage = 1;
                $scope.pageSize = 9;
                $scope.meals = [];
                $scope.pageChangeHandler = function (num) {
                    //////console.log('going to page ' + num);
                };
                var _selected;
                $scope.selected = undefined;
                // Any function returning a promise object can be used to load values asynchronously
                $scope.getLocation = function (val) {
                    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                        params: {
                            address: val,
                            sensor: false
                        }
                    }).then(function (response) {
                        return response.data.results.map(function (item) {
                            return item.formatted_address;
                        });
                    });
                };
                $scope.ngModelOptionsSelected = function (value) {
                    if (arguments.length) {
                        _selected = value;
                    } else {
                        return _selected;
                    }
                };
                $scope.modelOptions = {
                    debounce: {
                        default: 500,
                        blur: 250
                    },
                    getterSetter: true
                };
                // liste des commandes en stock
//                $scope.commandesenstock1 = PostFactory.listCommandeEnstocks().then(function (commandesenstock) {
//                    $scope.commandesenstock = commandesenstock.data;
//                    var dataCommande = {
//                        Commande: []
//                    };
//                    $(commandesenstock.data).each(function (i, v) {
//                        var commaercial = v.User.nom_commercial;
//                        if (v.User.nom_commercial == null || v.User.nom_commercial == '') {
//                            commaercial = v.User.raison_social;
//                        }
//                        dataCommande.Commande.push(v.Commande.ref + ',Expéditeur : ' + commaercial + ',Destinataire : ' + v.Receiver.full_name);
//                    });
//                    $scope.commandesINstock = dataCommande.Commande;
////                    ////console.log(dataCommande.Commande);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
                $scope.TypeTransfert = function () {
//                    if()
                    $('#IterEntrepot').show();
                    if ($scope.TypeDETransfert == 'inter') {
                        $('#isProductionProduct').hide();
                    } else {
                        $('#isProductionProduct').show();
                    }
                };
                $scope.changeProductRef = function ($event) {
                    setTimeout(function () {
                        $scope.$apply(function () {
                            //console.log($event.target);
                            //console.log('$event.target');
                        });
                    }, 500);
                };
                $scope.emplacementsList = null;
                $scope.entrepotDepart = function () {
                    PostFactory.listFamille().then(function (familles) {
                        $scope.familles = familles;
                    }, function (msg) {
                        alert(msg);
                    });
                    $scope.productsfamille = null;
                    // change catégorie charger list sous categorie add devis
                    $scope.countSousCategories = 0;
                    $scope.customsouscategories = null;
                    $scope.productsfamille = null;
                    // reload list product change famille list
                    $scope.changeFamilleID = function () {
                        var id = $scope.familleID;
                        //console.log(id);
                        var dataProduct = {
                            Product: {
                                id: $scope.familleID,
                                category_id: $('#categoryValue :selected').val() || 0
                            }};
                        $scope.productsfamille = PostFactory.listProductsFamille(dataProduct).then(function (productsfamille) {
                            $scope.productsfamille = productsfamille;
//                        //console.log(productsfamille);
                            if (productsfamille.length == 0) {
                                toastr.info('Pas de Produit');
                            }
                        }, function (msg) {
                            alert(msg);
                        });
                    };
                    // reload list product  chhange categories list
                    $scope.changecategoryValue = function () {
                        var dataSousCategory = {
                            Souscategory: {
//                            category_id: $scope.categoryValue
                                category_id: $('#categoryValue :selected').val()
                            }
                        };
                        $scope.customsouscategories = PostFactory.listCustomSouscategory(dataSousCategory).then(function (customsouscategories) {
                            //console.log(customsouscategories);
                            $scope.customsouscategories = customsouscategories;
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    $scope.countSousCategories = customsouscategories.length;
                                });
                            }, 500);
                        });
//                    load list product
                        var id = $scope.familleID;
                        //console.log(id);
                        var dataProduct = {
                            Product: {
                                id: $('#familleValue :selected').val() || 0,
                                category_id: $('#categoryValue :selected').val() || 0
                            }};
                        PostFactory.listProductsFamille(dataProduct).then(function (productsfamille) {
                            $scope.productsfamille = productsfamille;
                            //console.log(productsfamille);
                            if (productsfamille.length == 0) {
                                toastr.info('Pas de Produit');
                            }
                        }, function (msg) {
                            alert(msg);
                        });
                    };
//                    load list product change sous categorie list
                    $scope.changesouscategoryValue = function () {
                        var id = $scope.familleID;
                        //console.log(id);
                        var dataProduct = {
                            Product: {
                                id: $('#familleValue :selected').val() || 0,
                                category_id: $('#categoryValue :selected').val() || 0,
                                souscategory_id: $('#souscategoryValue :selected').val()
                            }};
                        $scope.productsfamille = PostFactory.listProductsFamille(dataProduct).then(function (productsfamille) {
                            $scope.productsfamille = productsfamille;
                            //console.log(productsfamille);
                            if (productsfamille.length == 0) {
                                toastr.info('Pas de Produit');
                            }
                        }, function (msg) {
                            alert(msg);
                        });
                    };

                    ////console.log($("#entrepotValueDebut :selected").val());
                    $('#EmplacementID').empty();
                    if ($('#TypeDeTransfert :selected').val() == 'inter') {
                        $('#entrepotValueFin').empty();
                        $('#EntrepotRecept').show();
                        $('#isProductionProduct').hide();
                        PostFactory.listStocks().then(function (stocks) {
                            setTimeout(function () {
                                var item = $compile("<option value=''></option>")($scope);
                                $('#entrepotValueFin').append(item);
                                $(stocks).each(function (i, v) {
//                                    if ($("#entrepotValueDebut :selected").val() != v.Stock.id) {
                                    var $items = $compile("<option value=" + v.Stock.id + ">" + v.Stock.name + "</option>")($scope);
                                    $('#entrepotValueFin').append($items);
//                                    }
                                });
                            }, 100);
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );

//                    ////console.log($.trim($('#commnadeINstock').val().split(',')[0]));
                        var id = $("#entrepotValueDebut :selected").val();
                        var searchKey = $scope.searchProducts;
                        var dataStock = {
                            Stock: {
                                id: id
                            }
                        };
                        PostFactory.costomStockNoPaginate(dataStock).then(function (costomstock) {
                            $scope.productsfamille = costomstock.data;
                            console.log(costomstock.stock);
                            if (costomstock.stock == true) {
                                $('#displayCategory').hide();
                                $("#displayFamille").hide();
                            }
                            if (costomstock.stock == false) {
                                $('#displayCategory').show();
                                $("#displayFamille").show();
                            }
                            $('#displayProduct').show();
                            $("#productStock").show();
                        });
                        $scope.pageChanged = function (page) {
                            PostFactory.costomStock(page, dataStock).then(function (costomstock) {
                                $scope.costomstock = costomstock.data;
                                $scope.paging = costomstock.paging;
                                $scope.totalItems = costomstock.paging.count;
                                $scope.itemsPerPage = costomstock.paging.limit;
                                //console.log(costomstock.data);
                            });
                        };
                        PostFactory.costomStock(1, dataStock).then(function (costomstock) {
                            if (costomstock.type === "success") {
                                console.log(costomstock);
                                $scope.costomstock = costomstock.data;
                                $scope.paging = costomstock.paging;
                                $scope.totalItems = costomstock.paging.count;
                                $scope.itemsPerPage = costomstock.paging.limit;

                            }
                        });
                        // recherche produit
                        $scope.searchProductsFunc = function (searchProducts) {
                            var searchKey = $scope.searchProducts;
                            var dataStock = {
                                Stock: {
                                    id: id,
                                    searchKey: searchKey
                                }
                            };
                            //console.log(searchProducts);
                            //console.log(searchKey);
                            //console.log(dataStock);
                            if (searchKey.length >= 3) {
                                //console.log("LAUNCH SEARCH");
                                $scope.costomstock = PostFactory.costomStock(1, dataStock).then(function (costomstock) {
                                    $scope.costomstock = costomstock.data;
                                    $scope.paging = costomstock.paging;
                                    $scope.totalItems = costomstock.paging.count;
                                    $scope.itemsPerPage = costomstock.paging.limit;
                                },
                                        function (msg) {
                                            alert(msg);
                                        }
                                );
                            }
                        };
                        PostFactory.listCostomEmplacement(dataStock).then(function (emplacementsStock) {
                            $scope.emplacementsStock = emplacementsStock.data;
                            ////console.log(emplacementsStock.data);
                            if (emplacementsStock.type === 'error') {
                                $('#emplacementBlock').hide();
                                $('#sousemplacementBlock').hide();
                            }
                            if (emplacementsStock.type === 'success') {
                                $('#emplacementBlock').show();
//                            $scope.emplacementsList = emplacementsStock.data;
                                //console.log(emplacementsStock.data);
                                setTimeout(function () {
                                    var item = $compile("<option value=''></option>")($scope);
                                    $('#EmplacementID').append(item);
                                    $(emplacementsStock.data).each(function (i, v) {
                                        var $items = $compile("<option value=" + v.Emplacement.id + ">" + v.Emplacement.name + "</option>")($scope);
                                        setTimeout(function () {
                                            $('#EmplacementID').append($items);
                                        }, 300);
                                    });
                                }, 100);
                                setTimeout(function () {
                                    // change emplacement
                                    $scope.emplacementDepart = function () {
                                        $('#SousEmplacementID').empty();
                                        if ($('#TypeDeTransfert :selected').val() == 'intra') {
                                            $('#EntrepotRecept').hide();
                                        }
                                        var id = $("#EmplacementID :selected").val();
                                        var dataEmplacement = {
                                            Emplacement: {
                                                id: id
                                            }
                                        };
                                        PostFactory.costomEmplacementNoPaginate(dataEmplacement).then(function (costomstock) {
                                            $scope.productsfamille = costomstock.data;
                                            console.log(costomstock);
                                        });
                                        $scope.costomstock = PostFactory.productEmplacement(1, dataEmplacement).then(function (costomstock) {
                                            $scope.costomstock = costomstock.data;
                                            if (costomstock.data.length == 0) {
                                                toastr.info('Pas de produits dans cette emplacement');
                                                $('#genererBonEmplacement').hide();
                                                $('#sousemplacementBlock').hide();
                                            } else {
                                                $('#genererBonEmplacement').show();
                                            }
                                            $scope.paging = costomstock.paging;
                                            $scope.totalItems = costomstock.paging.count;
                                            $scope.itemsPerPage = costomstock.paging.limit;
                                            $('#displayProduct').show();
                                            $("#productStock").show();
                                        });
                                        $scope.pageChanged = function (page) {
                                            PostFactory.productEmplacement(page, dataEmplacement).then(function (costomstock) {
                                                $scope.costomstock = costomstock.data;
                                                $scope.paging = costomstock.paging;
                                                $scope.totalItems = costomstock.paging.count;
                                                $scope.itemsPerPage = costomstock.paging.limit;
                                            });
                                        };
                                        // recherche produit
                                        $scope.searchProductsFunc = function (searchProducts) {
                                            var searchKey = $scope.searchProducts;
                                            var dataEmplacement = {
                                                Emplacement: {
                                                    id: id,
                                                    searchKey: searchKey
                                                }
                                            };
                                            if (searchKey.length >= 3) {
                                                //console.log("LAUNCH SEARCH");
                                                $scope.costomstock = PostFactory.productEmplacement(1, dataEmplacement).then(function (costomstock) {
                                                    $scope.costomstock = costomstock.data;
                                                    $scope.paging = costomstock.paging;
                                                    $scope.totalItems = costomstock.paging.count;
                                                    $scope.itemsPerPage = costomstock.paging.limit;
                                                },
                                                        function (msg) {
                                                            alert(msg);
                                                        }
                                                );
                                            }
                                        };
                                        $scope.sousemplacementsStock = PostFactory.listCostomSousEmplacement(dataEmplacement).then(function (sousemplacementsStock) {
                                            $scope.sousemplacementsStock = sousemplacementsStock.data;
                                            ////console.log(sousemplacementsStock.data);
                                            if (sousemplacementsStock.type == 'error') {
                                                $('#sousemplacementBlock').hide();
                                            }
                                            if (sousemplacementsStock.type == 'success') {
                                                $('#sousemplacementBlock').show();
                                                setTimeout(function () {
                                                    var item = $compile("<option value=''></option>")($scope);
                                                    $('#SousEmplacementID').append(item);
                                                    $(sousemplacementsStock.data).each(function (i, v) {
                                                        var $items = $compile("<option value=" + v.Sousemplacement.id + ">" + v.Sousemplacement.name + "</option>")($scope);
                                                        setTimeout(function () {
                                                            $('#SousEmplacementID').append($items);
                                                        }, 300);
                                                    });
                                                }, 100);
                                                // change sous emplacement
                                                $scope.sousemplacementDepart = function () {
                                                    //console.log('sousemplacementDepart');
                                                    var SousEmplacement = {
                                                        Sousemplacement: {
                                                            id: $('#SousEmplacementID').val()
                                                        }
                                                    };
                                                    PostFactory.costomSousemplacementNoPaginate(SousEmplacement).then(function (costomstock) {
                                                        $scope.productsfamille = costomstock.data;
                                                        //console.log(costomstock);
                                                    });
                                                    $scope.costomstock = PostFactory.listcustomProduct(1, SousEmplacement).then(function (costomstock) {
                                                        //console.log(costomstock);
                                                        $scope.costomstock = costomstock.data;
                                                        if (costomstock.data.length == 0) {
                                                            toastr.info('Pas de produits dans cette sous emplacement');
                                                            $('#genererBonSousEmplacement').hide();
                                                        } else {
                                                            $('#genererBonSousEmplacement').show();
                                                        }
                                                        $scope.paging = costomstock.paging;
                                                        $scope.totalItems = costomstock.paging.count;
                                                        $scope.itemsPerPage = costomstock.paging.limit;
                                                        $('#displayProduct').show();
                                                        $("#productStock").show();
                                                    });
                                                    $scope.pageChanged = function (page) {
                                                        PostFactory.listcustomProduct(page, SousEmplacement).then(function (costomstock) {
                                                            $scope.costomstock = costomstock.data;
                                                            $scope.paging = costomstock.paging;
                                                            $scope.totalItems = costomstock.paging.count;
                                                            $scope.itemsPerPage = costomstock.paging.limit;
                                                        });
                                                    };
                                                    // recherche produit
                                                    $scope.searchProductsFunc = function (searchProducts) {
                                                        var searchKey = $scope.searchProducts;
                                                        var SousEmplacement = {
                                                            Sousemplacement: {
                                                                id: $('#SousEmplacementID').val(),
                                                                searchKey: searchKey
                                                            }
                                                        };
                                                        if (searchKey.length >= 3) {
                                                            //console.log("LAUNCH SEARCH");
                                                            $scope.costomstock = PostFactory.listcustomProduct(1, SousEmplacement).then(function (costomstock) {
                                                                $scope.costomstock = costomstock.data;
                                                                $scope.paging = costomstock.paging;
                                                                $scope.totalItems = costomstock.paging.count;
                                                                $scope.itemsPerPage = costomstock.paging.limit;
                                                            },
                                                                    function (msg) {
                                                                        alert(msg);
                                                                    }
                                                            );
                                                        }
                                                    };
                                                };
                                            }
                                        });
                                    };
                                }, 300);
                            }
                        });

                    }
                    if ($('#TypeDeTransfert :selected').val() == 'intra') {
                        $('#EntrepotRecept').hide();
                        $('#isProductionProduct').show();
                        //console.log('intra stock');
                        var id = $("#entrepotValueDebut :selected").val();
                        var dataStock = {
                            Stock: {
                                id: id
                            }
                        };
                        $scope.emplacementsStock = PostFactory.listCostomEmplacement(dataStock).then(function (emplacementsStock) {
                            $scope.emplacementsStock = emplacementsStock.data;
                            $scope.emplacementsStockList = emplacementsStock.data;

                            if (emplacementsStock.type === 'error') {
                                $('#emplacementBlock').hide();
                                $('#sousemplacementBlock').hide();
                                toastr.info("Vous n'avez pas d'emplacement pour cet entrepôt");
                            }
                            if (emplacementsStock.type === 'success') {
                                $('#emplacementBlock').show();
                                var item = $compile("<option value=''></option>")($scope);
                                // emplacement de sortie
                                $('#EmplacementID').append(item);
                                $(emplacementsStock.data).each(function (i, v) {
                                    var $items = $compile("<option value=" + v.Emplacement.id + ">" + v.Emplacement.name + "</option>")($scope);
                                    setTimeout(function () {
                                        $('#EmplacementID').append($items);
                                    }, 300);
                                });

                                // change emplacement
                                $scope.emplacementDepart = function () {
                                    $('#SousEmplacementID').empty();
                                    var id = $("#EmplacementID :selected").val();
                                    var emplacement_depart = $scope.EmplacementsDepartNew;
                                    //console.log(emplacement_depart);
                                    var dataEmplacement = {
                                        Emplacement: {
                                            id: id
                                        }
                                    };
                                    PostFactory.costomEmplacementNoPaginate(dataEmplacement).then(function (costomstock) {
                                        $scope.productsfamille = costomstock.data;
                                        //console.log(costomstock);
                                    });
                                    $scope.costomstock = PostFactory.productEmplacement(1, dataEmplacement).then(function (costomstock) {
                                        $scope.costomstock = costomstock.data;
//                                    var countdeplacementarrivee = 0;
                                        //console.log(costomstock.data.length);
                                        if (costomstock.data.length == 0) {
                                            toastr.info('Pas de produits dans cette emplacement');
                                            $('#genererBonEmplacementIntra').hide();
                                            $('#sousemplacementBlock').hide();
                                            $('#genererBonEmplacementIntra').hide();
                                            $('#displayProduct').hide();
                                            $("#productStock").hide();
                                            $scope.countdeplacementarrivee = 0;
                                            $scope.countdsouseplacementarrivee = 0;
                                        } else {
                                            $scope.countdeplacementarrivee = costomstock.data.length - 1;
                                            $('#genererBonEmplacementIntra').show();
                                            $('#EntrepotReceptIntra').show();
                                            $('#displayProduct').show();
                                            $("#productStock").show();
                                            $("#sousemplacementBlock").show();
                                            // emplacement de réception
                                            var itemRecept = $compile("<option value=''></option>")($scope);
                                            $('#EmplacementReceptID').append(itemRecept);
                                            $(emplacementsStock.data).each(function (i, v) {
                                                var $itemsRecept = $compile("<option value=" + v.Emplacement.id + ">" + v.Emplacement.name + "</option>")($scope);
                                                setTimeout(function () {
                                                    $('#EmplacementReceptID').append($itemsRecept);
                                                }, 300);
                                            });
                                            var emplacement_arrivee_id = $scope.EmplacementsDepartRecept;
                                            var dataEmplacement = {
                                                Emplacement: {
                                                    id: emplacement_arrivee_id
                                                }
                                            };
                                            PostFactory.listCostomSousEmplacement(dataEmplacement).then(function (sousemplacementsStock) {
                                                $scope.sousemplacementsStockList = sousemplacementsStock.data;
                                                //console.log(sousemplacementsStock.data);
                                                if (sousemplacementsStock.type === 'error') {
                                                    $scope.countdsouseplacementarrivee = 0;
//                                                    $scope.countColSpan = 6;
                                                }
                                                if (sousemplacementsStock.type === 'success') {
                                                    $scope.countdsouseplacementarrivee = sousemplacementsStock.data.length;
//                                                    $scope.countColSpan = 6;
                                                }
                                            });
                                        }
                                        $scope.paging = costomstock.paging;
                                        $scope.totalItems = costomstock.paging.count;
                                        $scope.itemsPerPage = costomstock.paging.limit;
                                    });
                                    $scope.sousemplacementsStock = PostFactory.listCostomSousEmplacement(dataEmplacement).then(function (sousemplacementsStock) {
                                        $scope.sousemplacementsStock = sousemplacementsStock.data;
                                        ////console.log(sousemplacementsStock.data);
                                        if (sousemplacementsStock.type == 'error') {
                                            $('#sousemplacementBlock').hide();
                                        }
                                        if (sousemplacementsStock.type == 'success') {
                                            $('#sousemplacementBlock').show();
                                            setTimeout(function () {
                                                var item = $compile("<option value=''></option>")($scope);
                                                $('#SousEmplacementID').append(item);
                                                $(sousemplacementsStock.data).each(function (i, v) {
                                                    var $items = $compile("<option value=" + v.Sousemplacement.id + ">" + v.Sousemplacement.name + "</option>")($scope);
                                                    setTimeout(function () {
                                                        $('#SousEmplacementID').append($items);
                                                    }, 300);
                                                });
                                            }, 100);
                                            // change sous emplacement
                                            $scope.sousemplacementDepart = function () {
                                                //console.log('sousemplacementDepart');
                                                var SousEmplacement = {
                                                    Sousemplacement: {
                                                        id: $('#SousEmplacementID :selected').val()
                                                    }
                                                };
                                                PostFactory.costomSousemplacementNoPaginate(SousEmplacement).then(function (costomstock) {
                                                    $scope.productsfamille = costomstock.data;
                                                    //console.log(costomstock);
                                                });
                                                $scope.costomstock = PostFactory.listcustomProduct(1, SousEmplacement).then(function (costomstock) {
                                                    //console.log(costomstock);
                                                    $scope.costomstock = costomstock.data;
                                                    if (costomstock.data.length == 0) {
                                                        toastr.info('Pas de produits dans cette sous emplacement');
                                                        $('#genererBonSousEmplacement').hide();
                                                    } else {
                                                        $('#genererBonSousEmplacement').show();
                                                    }
                                                    $scope.paging = costomstock.paging;
                                                    $scope.totalItems = costomstock.paging.count;
                                                    $scope.itemsPerPage = costomstock.paging.limit;
                                                    $('#displayProduct').show();
                                                    $("#productStock").show();
                                                });
                                            };
                                        }
                                    });
                                };
                            }
                        });
                    }
                    var id = parseInt($location.path().split('/')[2]);
                    var string = document.location.hash;
                    if (string.indexOf("view-entrepot") !== -1) {
                        var dataStock = {
                            Stock: {
                                id: id
                            }
                        };
                        $scope.productsctock = PostFactory.costomViewStock(1, dataStock).then(function (productsctock) {
                            $scope.productsctock = productsctock.data;
                            $scope.paging = productsctock.paging;
                            $scope.totalItems = productsctock.paging.count;
                            $scope.itemsPerPage = productsctock.paging.limit;
                            $('#displayProduct').show();
                            $("#productStock").show();
                        });
                        $scope.pageChanged = function (page) {
                            PostFactory.costomViewStock(page, dataStock).then(function (productsctock) {
                                $scope.productsctock = productsctock.data;
                                //console.log(productsctock);
                                $scope.paging = productsctock.paging;
                                $scope.totalItems = productsctock.paging.count;
                                $scope.itemsPerPage = productsctock.paging.limit;
                            });
                        };
                        // recherche produit
                        $scope.searchProductsFunc = function (searchProducts) {
                            var searchKey = $scope.searchProducts;
                            var dataStock = {
                                Stock: {
                                    id: id,
                                    searchKey: searchKey
                                }
                            };
                            //console.log(searchProducts);
                            //console.log(searchKey);
                            //console.log(dataStock);
                            if (searchKey.length >= 3) {
                                //console.log("LAUNCH SEARCH");
                                $scope.productsctock = PostFactory.costomViewStock(1, dataStock).then(function (productsctock) {
                                    $scope.productsctock = productsctock.data;
                                    $scope.paging = productsctock.paging;
                                    $scope.totalItems = productsctock.paging.count;
                                    $scope.itemsPerPage = productsctock.paging.limit;
                                },
                                        function (msg) {
                                            alert(msg);
                                        }
                                );
                            }
                        };
                    }
//                    ////console.log($.trim($('#commnadeINstock').val().split(',')[0]));
                    var id = $("#entrepotValueDebut :selected").val();
                    var dataStock = {
                        Stock: {
                            id: id
                        }
                    };
                    $scope.costomstock = PostFactory.costomStock(dataStock).then(function (costomstock) {
                        $scope.costomstock = costomstock.data;
                        ////console.log(costomstock.data);
                        //console.log(costomstock.data.StockProduct);
                        $('#displayProduct').show();
                        var dataCommande = {
                            Commande: []
                        };
//                        $(costomstock.data.StockProduct).each(function (i, v) {
//                            var commaercial = v.User.nom_commercial;
//                            if (v.User.nom_commercial == null || v.User.nom_commercial == '') {
//                                commaercial = v.User.raison_social;
//                            }
//                            dataCommande.Commande.push(v.Commande.ref + ',Expéditeur : ' + commaercial + ',Destinataire : ' + v.Receiver.full_name);
//                        });
                        // append list product stock
                        $(costomstock.data.StockProduct).each(function (i, v) {
                            var commercial = v.User.nom_commercial;
                            if (v.User.nom_commercial == null || v.User.nom_commercial == '') {
                                commercial = v.User.raison_social;
                            }
//                            var $items = $compile('<div class="col-md-4"><div class="panel panel-primary"><div class="oe_kanban_details">\n\
//                                            <div class="panel-heading" style="font-size: 13px;"><strong>{{stock.name}}</strong></div>\n\
//                                            <div class="panel-body" style="padding: 7px 0px 0px 3px;"><div class="col-md-4" style="padding: 0;">\n\
//                                                    <img src="http://demoapi.amyevolution.com/img/{{stock.url}}" class="thumbnail center-block img-responsive " />\n\
//                                                </div><div class="col-md-8" style="padding: 0 0 0 3px;"><ul class="list-group">\n\
//                                                      <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Référence Produit :</strong> <span>' + v.Commande.ref + '</span></li>\n\
//                                                        <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Éxpéditeur :</strong> ' + commaercial + '</li>\n\
//                                                        <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Destinataire :</strong> ' + v.Receiver.full_name + '</li>\n\
//                                                    </ul></div></div>\n\
//                                                    <div class="panel-footer" style="height: 50px;"><ul class="nav nav-pills pull-right"><li><div>\n\
//                                                            <a href="#/fiche-produit/{{stock.id}}"  class="btn btn-sm btn-info"><i class="fa fa-eye"></i></a>\n\
//                                                        </div></li></ul><div class="clearfix"></div></div></div></div></div>')($scope);
//
//                            setTimeout(function () {
//                                $('#productStock').append($items);
//                            }, 300);
//                            dataCommande.Commande.push(v.Commande.ref + ',Expéditeur : ' + commaercial + ',Destinataire : ' + v.Receiver.full_name);
                            dataCommande.Commande.push({ref: v.Commande.ref, expediteur: commercial, destinataire: v.Receiver.full_name});
                        });
                        $("#productStock").show();
                        $scope.commandesINstock = dataCommande.Commande;

                    });
//                    $scope.productstock = PostFactory.productStock(dataStock).then(function (productstock) {
//                        $scope.productstock = productstock.data;
//                        ////console.log(productstock.data);
//                    });
                    $scope.emplacementsStock = PostFactory.listCostomEmplacement(dataStock).then(function (emplacementsStock) {
                        $scope.emplacementsStock = emplacementsStock.data;
                        ////console.log(emplacementsStock.data);
                        if (emplacementsStock.type == 'success') {
                            $('#emplacementBlock').show();
                            setTimeout(function () {
                                var item = $compile("<option value=''></option>")($scope);
                                $('#EmplacementID').append(item);
                                $(emplacementsStock.data).each(function (i, v) {
                                    var $items = $compile("<option value=" + v.Emplacement.id + ">" + v.Emplacement.name + "</option>")($scope);
                                    setTimeout(function () {
                                        $('#EmplacementID').append($items);
                                    }, 300);
                                });
                            }, 100);
                            setTimeout(function () {
                                $scope.emplacementDepart = function () {
                                    $('#SousEmplacementID').empty();
                                    if ($('#TypeDeTransfert :selected').val() == 'intra') {
                                        $('#EntrepotRecept').hide();
                                    }
                                    var id = $("#EmplacementID :selected").val();
                                    var dataEmplacement = {
                                        Emplacement: {
                                            id: id
                                        }
                                    };
                                    $scope.sousemplacementsStock = PostFactory.listCostomSousEmplacement(dataEmplacement).then(function (sousemplacementsStock) {
                                        $scope.sousemplacementsStock = sousemplacementsStock.data;
                                        ////console.log(sousemplacementsStock.data);
                                        if (sousemplacementsStock.type == 'success') {
                                            var dataCommande = {
                                                Commande: []
                                            };
                                            $(sousemplacementsStock.data).each(function (i, v) {
                                                $(v.SousemplacementProduct).each(function (ii, vv) {
                                                    var commercial = vv.User.nom_commercial;
                                                    if ($.inArray(vv.User.nom_commercial, ['', null]) !== -1) {
                                                        commercial = vv.User.raison_social;
                                                    }
                                                    dataCommande.Commande.push({ref: vv.Commande.ref, expediteur: commercial, destinataire: vv.Receiver.full_name});
//                                                    ////console.log(vv);
//                                                    dataCommande.Commande.push(vv.Commande.ref + ',Expéditeur : ' + commercial + ',Destinataire : ' + vv.Receiver.full_name);
                                                });
                                            });
                                            $scope.commandesINstock = dataCommande.Commande;
                                            //console.log(dataCommande.Commande);
                                            ////console.log(dataCommande.Commande);
                                            $('#sousemplacementBlock').show();
                                            setTimeout(function () {
                                                var item = $compile("<option value=''></option>")($scope);
                                                $('#SousEmplacementID').append(item);
                                                $(sousemplacementsStock.data).each(function (i, v) {
                                                    var $items = $compile("<option value=" + v.Sousemplacement.id + ">" + v.Sousemplacement.name + "</option>")($scope);
                                                    setTimeout(function () {
                                                        $('#SousEmplacementID').append($items);
                                                    }, 300);
                                                });
                                            }, 100);
                                            $scope.sousemplacementDepart = function () {
                                                //console.log('sousemplacementDepart');
                                                var SousEmplacement = {
                                                    Sousemplacement: {
                                                        id: $('#SousEmplacementID').val()
                                                    }
                                                };
                                                $scope.sousproduct = PostFactory.listcustomProduct(SousEmplacement).then(function (sousproduct) {
                                                    //console.log(sousproduct);
                                                    var dataCommande = {
                                                        Commande: []
                                                    };
                                                    $(sousproduct.SousemplacementProduct).each(function (ii, vv) {
                                                        var commercial = vv.User.nom_commercial;
                                                        if ($.inArray(vv.User.nom_commercial, ['', null]) !== -1) {
                                                            commercial = vv.User.raison_social;
                                                        }
                                                        dataCommande.Commande.push({ref: vv.Commande.ref, expediteur: commercial, destinataire: vv.Receiver.full_name});
//                                                        dataCommande.Commande.push(vv.Commande.ref + ',Expéditeur : ' + commercial + ',Destinataire : ' + vv.Receiver.full_name);
                                                    });
                                                    $scope.commandesINstock = dataCommande.Commande;
                                                });
                                            };
                                        }
                                    });
                                };
                            }, 300);
                        }
                    });
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.config = PostFactory.showConfig().then(function (config) {
                        $scope.config = config;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    $scope.bonsortie = PostFactory.viewBonSortie(id).then(function (bonsortie) {
                        $scope.bonsortie = bonsortie;
                        var date = bonsortie.Sortie.created;
                        $scope.formatCreated = {format: 'EEEE dd MMMM yyyy', date: date};
                        //console.log(bonsortie);
                        //console.log({format: 'EEEE dd MMMM yyyy', date: date});
                    });
                    $scope.bonentree = PostFactory.viewBonEntree(id).then(function (bonentree) {
                        $scope.bonentree = bonentree;
                        var date = bonentree.Sortie.created;
                        $scope.formatCreated = {format: 'EEEE dd MMMM yyyy', date: date};
                        //console.log({format: 'EEEE dd MMMM yyyy', date: date});
                        //console.log(bonentree);
                    });
                    $scope.valideBonEntree = function ($event) {
                        $event.preventDefault();
                        var dataEntree = {
                            Entree: {
                                id: id
                            },
                            Bon: []
                        };
                        $('tr#itemBonEntree').each(function (i, v) {
                            dataEntree.Bon.push({bon_id: $(v).attr('data-bon'), qte_recue: $(v).children().eq(3).children().val()});
                        });
                        //console.log(dataEntree);
                        $scope.entreeedit = PostFactory.valideBonEntree(dataEntree).then(function (entreeedit) {
                            $scope.entreeedit = entreeedit;
                            if (entreeedit.type == 'success') {
//                            $location.path('/gestion-entrepots');
                                toastr.success(entreeedit.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    };
                }

                $scope.appendProduct = function () {
                    //console.log('appendProduct');
                    //console.log($(this).attr('data-ref'));
                    var product_ref = $('#combobox :selected').attr('data-ref');
                    var product = $('#combobox :selected').val();
                    var product_name = $('#combobox :selected').text();
                    var max_qte = $('#combobox :selected').attr('data-qte');
                    var qte = $('#Qte').val();
                    var data = {
                        dataCommande: []
                    };
                    $('tr#trProduct').each(function (index, value) {
                        data.dataCommande.push({name: $.trim($(value).children().eq(0).text())});
                    });
                    //console.log("qte max" + parseFloat(max_qte));
                    //console.log("qte" + parseFloat(qte));
                    if (product === '') {
                        toastr.error('Veuillez mettre un produit');
                    } else if (qte === '') {
                        toastr.error('Veuillez mettre une quantité');
                    } else if (parseFloat(max_qte) < parseFloat(qte)) {
                        toastr.error("Quantité mise est supérieur à la quantité en stock (qte en stock (" + max_qte + ")");
                    } else if ($.inArray(product_name, data.dataCommande) !== -1) {
                        toastr.info("Produit déjà présent");
                    } else {
                        var emplacement_select = "<div class='input-group' style='width: 100%;'><select data-placeholder='Select Emplacement...' class='EmplacementRecept1ID' id='EmplacementRecept1ID'>\n\
                                                    <option value=''>Choisir emplacement</option>\n\
                                                    <option ng-repeat='item in emplacementsStockList' value='{{item.Emplacement.id}}'>{{item.Emplacement.name}}</option>\n\
                                                </select>\n\
                                             </div>";
                        var item = $compile("<tr id='trProduct' data-qte-max='" + max_qte + "' data-product='" + product + "'><td>" + product_name + "</td><td>" + product_ref + "</td><td>" + qte + "</td><td ng-show='countdeplacementarrivee > 0'>" + emplacement_select + "</td><td ng-show='countdsouseplacementarrivee > 0'></td><td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td></tr>")($scope);
                        $('#listProduct').append(item);
                        $('.custom-combobox-input').val('');
                        $('#Qte').val('');
                        $('#genererBon').show();
                        setTimeout(function () {
                            $("select.EmplacementRecept1ID").selectize()[0].selectize.setValue('');
                        }, 100);
                    }
                };
                $("#listProduct").on('click', "#deleteItem", function (e) {
                    e.preventDefault();
                    $(this).parent().parent().remove();
                    if ($('#trProduct').length == 0) {
                        $('#genererBon').hide();
                    }
                });
                $("#productStock").on('click', "#addbonsortie", function (e) {
                    e.preventDefault();
                    var data = {
                        dataCommande: []
                    };
                    $('tr#trProduct').each(function (index, value) {
//                        data.dataCommande.push({name: $.trim($(value).attr('data-product'))});
                        data.dataCommande.push($.trim($(value).attr('data-product')));
                    });
                    //console.log('appendProduct');
                    //console.log($(this).attr('data-ref'));
                    //console.log(data.dataCommande);
                    var product_name = $.trim($(this).attr('data-ref'));
                    var product_ref = $.trim($(this).attr('data-name'));
                    var product_id = $.trim($(this).attr('data-data-id'));
                    //console.log(product_id);
                    var product = $(this).attr('data-ref');
                    //console.log(product_name);
                    //console.log($.inArray(product_name, data.dataCommande));
                    var max_qte = $(this).attr('data-qte');
                    //console.log(max_qte);
                    var emplacement_select = "<div class='input-group'><span class='input-group-addon'><i class='fa fa-check'></i></span>\n\
                                                <select data-placeholder='Select Emplacement...' id='EmplacementRecept1ID' ng-change='changeemplacementarrivee()' ng-model='EmplacementsDepartRecept'>\n\
                                                    <option value=''>Choisir emplacement</option>\n\
                                                    <option ng-repeat='item in emplacementsStockList' value='{{item.Emplacement.id}}'>{{item.Emplacement.name}}</option>\n\
                                                </select>\n\
                                             </div>";

                    var item = $compile("<tr id='trProduct' data-id='" + product_id + "' data-product='" + product_name + "'><td>" + product_ref + "</td><td>" + product_name + "</td><td><input type='number' min='0' max='" + max_qte + "' id='Qte' placeholder='Qte' name=QteTelephone' class='form-control' style='width: 100px;' ng-model='qteStock" + product_id + "' ng-change='varifMaxQte($event)'/></td><td ng-show='countdeplacementarrivee > 0'>" + emplacement_select + "</td><td ng-show='countdsouseplacementarrivee > 0'></td><td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td></tr>")($scope);
                    if ($.inArray(product_name, data.dataCommande) >= 0) {
                        toastr.info("Produit déjà présent");
                    } else {
                        $('#listProduct').append(item);
                        setTimeout(function () {
                            $("select#EmplacementRecept1ID").selectize()[0].selectize.setValue('');
                        }, 1000);
                    }
//                    $('#commnadeINstock').val('');
//                    $('#Qte').val('');
                    $('#genererBon').show();
                });
                $scope.varifMaxQte = function ($event) {
                    //console.log($event);
                };
                $scope.countdeplacementarrivee = 0;
                $scope.countdsouseplacementarrivee = 0;
                $scope.countColSpan = 4;
                $scope.changestockarrivee = function () {
                    var arrivee_id = $scope.sortieArriveeStocks;
                    //console.log(arrivee_id);
                    var dataStock = {
                        Stock: {
                            id: arrivee_id
                        }
                    };
                    PostFactory.listCostomEmplacement(dataStock).then(function (emplacementsStock) {
                        $scope.emplacementsStockList = emplacementsStock.data;
                        //console.log(emplacementsStock.data);
                        if (emplacementsStock.type === 'success') {
                            $scope.countdeplacementarrivee = emplacementsStock.data.length;
                            $scope.countColSpan = 5;
                        }
                    });
                };
                $scope.changeemplacementarrivee = function () {
                    var emplacement_arrivee_id = $scope.EmplacementsDepartRecept;
                    var dataEmplacement = {
                        Emplacement: {
                            id: emplacement_arrivee_id
                        }
                    };
                    PostFactory.listCostomSousEmplacement(dataEmplacement).then(function (sousemplacementsStock) {
                        $scope.sousemplacementsStockList = sousemplacementsStock.data;
                        //console.log(sousemplacementsStock.data);
                        if (sousemplacementsStock.type === 'success') {
                            $scope.countdsouseplacementarrivee = sousemplacementsStock.data.length;
                            $scope.countColSpan = 6;
                        }
                    });
                };
                $scope.genererBonSortie = function ($event, $val) {
                    $event.preventDefault();
                    var type_changement = 'Externe';
                    if ($('#TypeDeTransfert :selected').val() == 'intra') {
                        type_changement = 'Interne';
                    }
                    var dataCommande = {
                        Sortie: {
                            entrepot_id: $("#entrepotValueDebut :selected").val(),
                            emplacement_id: $('#EmplacementID :selected').val() || 0,
                            sousemplacement_id: $('#SousEmplacementID :selected').val() || 0,
                            entrepot_arrivee: $("#entrepotValueFin :selected").val(),
                            emlacement_arrivee: $("#emplacementRecept :selected").val() || 0,
                            sousemlacement_arrivee: $("#SousEmplacementReceptID :selected").val() || 0,
                            isProduction: $('#isProduction').val(),
                            type_changement: type_changement,
                            val: $val
                        },
                        Bon: []
                    };
                    var emplacementArrivee = $("#entrepotValueFin :selected").val();
                    if ($('#TypeDeTransfert :selected').val() == 'intra') {
                        emplacementArrivee = $("#emplacementRecept :selected").val();
                    }
                    $('tr#trProduct').each(function (i, v) {
                        dataCommande.Bon.push({product_id: $(v).attr('data-product'), qte_max: $(v).attr('data-qte-max'), qte: $(v).children().eq(2).text(), stock_depart_id: $("#entrepotValueDebut :selected").val(), stock_arrivee_id: $("#entrepotValueFin :selected").val(), emplacement_arrivee_id: $scope.EmplacementsDepartRecept || 0, sousemplacement_arrivee_id: $scope.SousEmplacementsDepartRecept || 0});
                    });
                    //console.log(emplacementArrivee);
                    //console.log(dataCommande);
                    if ($("#entrepotValueDebut :selected").val() === "") {
                        toastr.error("Veuillez choisir l'entrepôt de départ...");
                    } else if (emplacementArrivee === "") {
                        toastr.error("Veuillez choisir l'entrepôt de réception...");
                    } else if ($val == 'emplacement') {
                        if ($("#EmplacementID :selected").val() === '') {
                            toastr.error('Veuillez choisir l\'emplacement de départ')
                        } else {
                            $scope.genererbonsortie = PostFactory.genererBonSortie(dataCommande).then(function (genererbonsortie) {
                                $scope.genererbonsortie = genererbonsortie;
                                if (genererbonsortie.type === 'success') {
                                    $("#listProduct").empty();
                                    toastr.success(genererbonsortie.text);
                                }
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        }
                    } else if ($val == 'sousemplacement') {
                        if ($scope.SousEmplacementsDepartNew == undefined) {
                            toastr.error('Veuillez choisir une sous emplacement de départ');
                        } else {
                            $scope.genererbonsortie = PostFactory.genererBonSortie(dataCommande).then(function (genererbonsortie) {
                                $scope.genererbonsortie = genererbonsortie;
                                if (genererbonsortie.type === 'success') {
                                    $("#listProduct").empty();
                                    toastr.success(genererbonsortie.text);
                                }
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        }
                    } else if ($val === 'product') {
                        if (dataCommande.Bon.length === 0) {
                            toastr.error('Veuillez choisir au moin un produit');
                        } else {
                            $scope.genererbonsortie = PostFactory.genererBonSortie(dataCommande).then(function (genererbonsortie) {
                                $scope.genererbonsortie = genererbonsortie;
                                if (genererbonsortie.type === 'success') {
                                    $("#listProduct").empty();
                                    toastr.success(genererbonsortie.text);
                                }
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        }
                    } else {
                        $scope.genererbonsortie = PostFactory.genererBonSortie(dataCommande).then(function (genererbonsortie) {
                            $scope.genererbonsortie = genererbonsortie;
                            if (genererbonsortie.type === 'success') {
                                $("#listProduct").empty();
                                toastr.success(genererbonsortie.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
                $scope.bonSortieEmplacementAll = function ($event, val) {
                    $event.preventDefault();
                    var dataCommande = {
                        Sortie: {
                            entrepot_depart: $.trim($("#entrepotValueDebut :selected").text()),
                            entrepot_arrivee: $.trim($("#entrepotValueFin :selected").text()),
                            emplacement_id: $scope.EmplacementsDepartNew || 0,
                            val: 'emplacement'
                        },
                        Bon: []
                    };
                    $('tr#trProduct').each(function (i, v) {
                        dataCommande.Bon.push({product_id: $(v).attr('data-id'), qte: $(v).children().eq(2).children().val(), stock_depart_id: $("#entrepotValueDebut :selected").val(), stock_arrivee_id: $("#entrepotValueFin :selected").val(), emplacement_arrivee_id: $scope.EmplacementsDepartRecept || 0, sousemplacement_arrivee_id: $scope.SousEmplacementsDepartRecept || 0});
                    });
                    //console.log(dataCommande);
                    if ($("#entrepotValueDebut :selected").val() === "") {
                        toastr.error("Veuillez choisir l'entrepôt de départ...");
                    } else if ($("#entrepotValueFin :selected").val() === "") {
                        toastr.error("Veuillez choisir l'entrepôt de réception...");
                    } else {
                        $scope.genererbonsortie = PostFactory.genererBonSortie(dataCommande).then(function (genererbonsortie) {
                            $scope.genererbonsortie = genererbonsortie;
                            if (genererbonsortie.type === 'success') {
                                $("#listProduct").empty();
                                toastr.success(genererbonsortie.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
//                $scope.bonsorties = PostFactory.listBonSortie().then(function (bonsorties) {
//                    $scope.bonsorties = bonsorties;
//                    //console.log(bonsorties);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
                // list bon entree no paginate
//                $scope.bonentrees = PostFactory.listBonEntree().then(function (bonentrees) {
//                    $scope.bonentrees = bonentrees;
//                    //console.log(bonentrees);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
                // list bon sortie paginate
                PostFactory.listBonSortiePaginate(1).then(function (bonsorties) {
                    $scope.bonsorties = bonsorties.data.sorties;
                    $scope.pagingSortie = bonsorties.data.pageCount.Sortie;
                    $scope.totalItemsSortie = bonsorties.data.pageCount.Sortie.count;
                    $scope.itemsPerPageSortie = bonsorties.data.pageCount.Sortie.limit;
                });
                $scope.pageChangedSortie = function (page) {
                    PostFactory.listBonSortiePaginate(page).then(function (bonsorties) {
                        $scope.bonsorties = bonsorties.data.sorties;
                        $scope.pagingSortie = bonsorties.data.pageCount.Sortie;
                        $scope.totalItemsSortie = bonsorties.data.pageCount.Sortie.count;
                        $scope.itemsPerPageSortie = bonsorties.data.pageCount.Sortie.limit;
                    });
                };
                // recherche bon d'entrée
                $scope.searchSortieFunc = function (searchSorties) {
                    var searchKey = $scope.searchSorties;
                    if (searchKey.length >= 3) {
                        $scope.bonsorties = PostFactory.listBonSortiePaginate(1, searchSorties).then(function (bonsorties) {
                            $scope.bonsorties = bonsorties.data.sorties;
                            $scope.pagingSortie = bonsorties.data.pageCount.Sortie;
                            $scope.totalItemsSortie = bonsorties.data.pageCount.Sortie.count;
                            $scope.itemsPerPageSortie = bonsorties.data.pageCount.Sortie.limit;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey == '') {
                            PostFactory.listBonSortiePaginate(1).then(function (bonsorties) {
                                $scope.bonsorties = bonsorties.data.sorties;
                                $scope.pagingSortie = bonsorties.data.pageCount.Sortie;
                                $scope.totalItemsSortie = bonsorties.data.pageCount.Sortie.count;
                                $scope.itemsPerPageSortie = bonsorties.data.pageCount.Sortie.limit;
                            });
                        }
                    }
                };
                // list bon entree paginate
                PostFactory.listBonEntreePaginate(1).then(function (bonentrees) {
                    $scope.bonentrees = bonentrees.data.entrees;
                    $scope.pagingEntree = bonentrees.data.pageCount.Entree;
                    $scope.totalItemsEntree = bonentrees.data.pageCount.Entree.count;
                    $scope.itemsPerPageEntree = bonentrees.data.pageCount.Entree.limit;
                });
                $scope.pageChangedEntree = function (page) {
                    PostFactory.listBonEntreePaginate(page).then(function (bonentrees) {
                        $scope.bonentrees = bonentrees.data.entrees;
                        $scope.pagingEntree = bonentrees.data.pageCount.Entree;
                        $scope.totalItemsEntree = bonentrees.data.pageCount.Entree.count;
                        $scope.itemsPerPageEntree = bonentrees.data.pageCount.Entree.limit;
                    });
                };
                // recherche bon d'entrée
                $scope.searchEntreeFunc = function (searchEntrees) {
                    var searchKey = $scope.searchEntrees;
                    if (searchKey.length >= 3) {
                        $scope.bonentrees = PostFactory.listBonEntreePaginate(1, searchEntrees).then(function (bonentrees) {
                            $scope.bonentrees = bonentrees.data.entrees;
                            $scope.pagingEntree = bonentrees.data.pageCount.Entree;
                            $scope.totalItemsEntree = bonentrees.data.pageCount.Entree.count;
                            $scope.itemsPerPageEntree = bonentrees.data.pageCount.Entree.limit;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey == '') {
                            PostFactory.listBonEntreePaginate(1).then(function (bonentrees) {
                                $scope.bonentrees = bonentrees.data.entrees;
                                $scope.pagingEntree = bonentrees.data.pageCount.Entree;
                                $scope.totalItemsEntree = bonentrees.data.pageCount.Entree.count;
                                $scope.itemsPerPageEntree = bonentrees.data.pageCount.Entree.limit;
                            });
                        }
                    }
                };
                $scope.stocks = PostFactory.listStocks().then(function (stocks) {
                    $scope.stocks = stocks;
                    //////console.log(stocks);
                    setTimeout(function () {
                        $("button[data-original-title='Kanban']").addClass("active");
                    }, 500);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.ShowEntrepotList = function () {
                    var oldClass = $("button[data-original-title='Kanban']").attr('class');
                    $("button[data-original-title='Kanban']").attr("class", oldClass.replace(" active", ""));
                    $('#exportableList').show();
                    $('#EntrepotBlock').hide();
                };
                $scope.ShowEntrepotBlock = function () {
                    $('#exportableList').hide();
                    $('#EntrepotBlock').show();
                };
                // valider stock
                $scope.checkboxModel = {
                    value1: false
                };
                $scope.stockValide = "true";
                $scope.stockInValide = "false";
                $scope.valideStock = function (valide, id) {
                    var dataStock = {
                        Stock: {
                            id: id,
                            valide: valide
                        }
                    };
                    $scope.validestock = PostFactory.valideStock(dataStock).then(function (validestock) {
                        $scope.validestock = validestock;
                        if (validestock.type === 'success') {
                            toastr.success(validestock.text);
                        }

                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.checkbox = 0;
                $scope.$watch(function () {
                    return $scope.checkbox;
                }, function () {
                    $scope.checkbox = Number($scope.checkbox);
                }, true);
                $scope.checkboxRetour = 0;
                $scope.$watch(function () {
                    return $scope.checkboxRetour;
                }, function () {
                    $scope.checkboxRetour = Number($scope.checkboxRetour);
                }, true);
                $scope.checkboxSAV = 0;
                $scope.$watch(function () {
                    return $scope.checkboxSAV;
                }, function () {
                    $scope.checkboxSAV = Number($scope.checkboxSAV);
                }, true);
                $scope.checkboxComsommable = 0;
                $scope.$watch(function () {
                    return $scope.checkboxComsommable;
                }, function () {
                    $scope.checkboxComsommable = Number($scope.checkboxComsommable);
                }, true);
                $scope.checkboxColis = 0;
                $scope.$watch(function () {
                    return $scope.checkboxColis;
                }, function () {
                    $scope.checkboxColis = Number($scope.checkboxColis);
                }, true);
                $scope.ajoutStock = function ($event) {
                    $event.preventDefault();
                    var dataStock = {
                        Stock: {
//                            product_id: $("#combobox :selected").val(),
                            name: $("#name").val(),
                            adresse: $("#adresse").val(),
                            isSAV: $("#isSAV").val(),
//                            isColis: $("#isColis").val(),
//                            isConsommable: $("#isConso").val(),
                            isRebut: $("#isRebut").val(),
                            isRetour: $("#isRetour").val()
                        }
                    };
                    $scope.stock = PostFactory.ajoutStock(dataStock).then(function (stock) {
                        $scope.stock = stock;
                        $location.path('/gestion-entrepots');
                        toastr.success(stock.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.currentStock = PostFactory.viewStock(id).then(function (stock) {
                        $scope.currentStock = stock;
//                        ////console.log(stock);
                        $scope.listproduits = stock.StockProduct;
                        $scope.listemplacements = stock.Emplacement;
                        $scope.checkbox = 0;
                        if (stock.Stock.isRebut == true || stock.Stock.isRebut == 1) {
                            $scope.checkbox = 1;
                        }
                        $scope.$watch(function () {
                            return $scope.checkbox;
                        }, function () {
                            $scope.checkbox = Number($scope.checkbox);
                        }, true);
                        $scope.checkboxRetour = 0;
                        if (stock.Stock.isRetour == true || stock.Stock.isRetour == 1) {
                            $scope.checkboxRetour = 1;
                        }
                        $scope.$watch(function () {
                            return $scope.checkboxRetour;
                        }, function () {
                            $scope.checkboxRetour = Number($scope.checkboxRetour);
                        }, true);
                        $scope.checkboxSAV = 0;
                        if (stock.Stock.isSAV == true || stock.Stock.isSAV == 1) {
                            $scope.checkboxSAV = 1;
                        }
                        $scope.$watch(function () {
                            return $scope.checkboxSAV;
                        }, function () {
                            $scope.checkboxSAV = Number($scope.checkboxSAV);
                        }, true);
                    });
                    $scope.editStock = function ($event) {
                        $event.preventDefault();
                        var dataStock = {
                            Stock: {
                                id: id,
                                name: $("#name").val(),
                                adresse: $("#adresse").val(),
                                isSAV: $("#isSAV").val(),
                                isRebut: $("#isRebut").val(),
                                isRetour: $("#isRetour").val()
                            }
                        };
                        $scope.stock = PostFactory.editStock(dataStock).then(function (stock) {
                            if (stock.type === 'success') {
                                $location.path('/gestion-entrepots');
                                toastr.success(stock.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                }
            } else {
                $location.path('/login');
            }
        })
//        emplacement controller
        .controller("EmplacementsController", function ($scope, PostFactory, $location, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.stocks = PostFactory.listStocks().then(function (stocks) {
                    $scope.stocks = stocks;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.emplacements = PostFactory.listEmplacements().then(function (emplacements) {
                    $scope.emplacements = emplacements;
                    setTimeout(function () {
                        $("button[data-original-title='Kanban']").addClass("active");
                    }, 500);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.ShowEntrepotList = function () {
                    var oldClass = $("button[data-original-title='Kanban']").attr('class');
                    $("button[data-original-title='Kanban']").attr("class", oldClass.replace(" active", ""));
                    $('#exportableList').show();
                    $('#EntrepotBlock').hide();
                };
                $scope.ShowEntrepotBlock = function () {
                    $('#exportableList').hide();
                    $('#EntrepotBlock').show();
                };
                // ajout emplacement
                $scope.checkbox = 0;
                $scope.$watch(function () {
                    return $scope.checkbox;
                }, function () {
                    $scope.checkbox = Number($scope.checkbox);
                }, true);
                $scope.checkboxRetour = 0;
                $scope.$watch(function () {
                    return $scope.checkboxRetour;
                }, function () {
                    $scope.checkboxRetour = Number($scope.checkboxRetour);
                }, true);
                $scope.checkboxSAV = 0;
                $scope.$watch(function () {
                    return $scope.checkboxSAV;
                }, function () {
                    $scope.checkboxSAV = Number($scope.checkboxSAV);
                }, true);
                $scope.checkboxComsommable = 0;
                $scope.$watch(function () {
                    return $scope.checkboxComsommable;
                }, function () {
                    $scope.checkboxComsommable = Number($scope.checkboxComsommable);
                }, true);
                $scope.checkboxColis = 0;
                $scope.$watch(function () {
                    return $scope.checkboxColis;
                }, function () {
                    $scope.checkboxColis = Number($scope.checkboxColis);
                }, true);
                $scope.ajoutEmplacement = function ($event) {
                    $event.preventDefault();
                    var dataEmplacement = {
                        Emplacement: {
                            stock_id: $("#entrepotValue :selected").val(),
                            name: $("#name").val(),
                            adresse: $("#adresse").val(),
                            isSAV: $("#isSAV").val(),
//                            isColis: $("#isColis").val(),
//                            isConsommable: $("#isConso").val(),
                            isRebut: $("#isRebut").val(),
                            isRetour: $("#isRetour").val()
                        }
                    };
                    $scope.emplacement = PostFactory.ajoutEmplacement(dataEmplacement).then(function (emplacement) {
                        $scope.emplacement = emplacement;
                        $location.path('/gestion-entrepots');
                        toastr.success(emplacement.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                // view and edit emplacement
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.currentEmplacement = PostFactory.viewEmplacement(id).then(function (emplacement) {
                        $scope.currentEmplacement = emplacement;
//                        ////console.log(emplacement);
                        $scope.listproduits = emplacement.EmplacementProduct;
                        $scope.listsousemplacements = emplacement.Sousemplacement;
//                        ////console.log(emplacement.Sousemplacement);
                        $scope.checkbox = 0;
                        if (emplacement.Emplacement.isRebut == true || emplacement.Emplacement.isRebut == 1) {
                            $scope.checkbox = 1;
                        }
                        $scope.$watch(function () {
                            return $scope.checkbox;
                        }, function () {
                            $scope.checkbox = Number($scope.checkbox);
                        }, true);
                        $scope.checkboxRetour = 0;
                        if (emplacement.Emplacement.isRetour == true || emplacement.Emplacement.isRetour == 1) {
                            $scope.checkboxRetour = 1;
                        }
                        $scope.$watch(function () {
                            return $scope.checkboxRetour;
                        }, function () {
                            $scope.checkboxRetour = Number($scope.checkboxRetour);
                        }, true);
                        $scope.checkboxSAV = 0;
                        if (emplacement.Emplacement.isSAV == true || emplacement.Emplacement.isSAV == 1) {
                            $scope.checkboxSAV = 1;
                        }
                        $scope.$watch(function () {
                            return $scope.checkboxSAV;
                        }, function () {
                            $scope.checkboxSAV = Number($scope.checkboxSAV);
                        }, true);
                    });
                    $scope.editEmplacement = function ($event) {
                        $event.preventDefault();
                        var dataEmplacement = {
                            Emplacement: {
                                id: id,
                                stock_id: $("#entrepotValue :selected").val(),
                                name: $("#name").val(),
                                adresse: $("#adresse").val(),
                                isSAV: $("#isSAV").val(),
                                isRebut: $("#isRebut").val(),
                                isRetour: $("#isRetour").val()
                            }
                        };
                        $scope.emplacement = PostFactory.editEmplacement(dataEmplacement).then(function (emplacement) {
                            if (emplacement.type === 'success') {
                                $location.path('/view-entrepot/' + $("#entrepotValue :selected").val());
                                toastr.success(emplacement.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                }
                // sous emplacement

            } else {
                $location.path('/login');
            }
        })
//        sous emplacement controller
        .controller("SousEmplacementsController", function ($scope, PostFactory, $location, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.stocks = PostFactory.listStocks().then(function (stocks) {
                    $scope.stocks = stocks;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.emplacements = PostFactory.listEmplacements().then(function (emplacements) {
                    $scope.emplacements = emplacements;
                    setTimeout(function () {
                        $("button[data-original-title='Kanban']").addClass("active");
                    }, 500);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.sousemplacements = PostFactory.listSousEmplacements().then(function (sousemplacements) {
                    $scope.sousemplacements = sousemplacements;
                    setTimeout(function () {
                        $("button[data-original-title='Kanban']").addClass("active");
                    }, 500);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.ShowEntrepotList = function () {
                    var oldClass = $("button[data-original-title='Kanban']").attr('class');
                    $("button[data-original-title='Kanban']").attr("class", oldClass.replace(" active", ""));
                    $('#exportableList').show();
                    $('#EntrepotBlock').hide();
                };
                $scope.ShowEntrepotBlock = function () {
                    $('#exportableList').hide();
                    $('#EntrepotBlock').show();
                };
                // ajout emplacement
                $scope.checkbox = 0;
                $scope.$watch(function () {
                    return $scope.checkbox;
                }, function () {
                    $scope.checkbox = Number($scope.checkbox);
                }, true);
                $scope.checkboxRetour = 0;
                $scope.$watch(function () {
                    return $scope.checkboxRetour;
                }, function () {
                    $scope.checkboxRetour = Number($scope.checkboxRetour);
                }, true);
                $scope.checkboxSAV = 0;
                $scope.$watch(function () {
                    return $scope.checkboxSAV;
                }, function () {
                    $scope.checkboxSAV = Number($scope.checkboxSAV);
                }, true);
                $scope.checkboxComsommable = 0;
                $scope.$watch(function () {
                    return $scope.checkboxComsommable;
                }, function () {
                    $scope.checkboxComsommable = Number($scope.checkboxComsommable);
                }, true);
                $scope.checkboxColis = 0;
                $scope.$watch(function () {
                    return $scope.checkboxColis;
                }, function () {
                    $scope.checkboxColis = Number($scope.checkboxColis);
                }, true);
                $scope.ajoutSousEmplacement = function ($event) {
                    $event.preventDefault();
                    var dataEmplacement = {
                        Sousemplacement: {
                            emplacement_id: $("#emplacementValue :selected").val(),
                            name: $("#name").val(),
                            description: $("#description").val(),
                            isSAV: $("#isSAV").val(),
//                            isColis: $("#isColis").val(),
//                            isConsommable: $("#isConso").val(),
                            isRebut: $("#isRebut").val(),
                            isRetour: $("#isRetour").val()
                        }
                    };
                    $scope.emplacement = PostFactory.ajoutSousEmplacement(dataEmplacement).then(function (emplacement) {
                        $scope.emplacement = emplacement;
                        $location.path('/gestion-entrepots');
                        toastr.success(emplacement.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                // view and edit emplacement
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.currentSousEmplacement = PostFactory.viewSousEmplacement(id).then(function (sousemplacement) {
                        $scope.currentSousEmplacement = sousemplacement;
//                        ////console.log(sousemplacement);
                        $scope.listproduitssousemplacement = sousemplacement.SousemplacementProduct;
//                        ////console.log(sousemplacement.SousemplacementProduct);
                        $scope.checkbox = 0;
                        if (sousemplacement.Sousemplacement.isRebut == true || sousemplacement.Sousemplacement.isRebut == 1) {
                            $scope.checkbox = 1;
                        }
                        $scope.$watch(function () {
                            return $scope.checkbox;
                        }, function () {
                            $scope.checkbox = Number($scope.checkbox);
                        }, true);
                        $scope.checkboxRetour = 0;
                        if (sousemplacement.Sousemplacement.isRetour == true || sousemplacement.Sousemplacement.isRetour == 1) {
                            $scope.checkboxRetour = 1;
                        }
                        $scope.$watch(function () {
                            return $scope.checkboxRetour;
                        }, function () {
                            $scope.checkboxRetour = Number($scope.checkboxRetour);
                        }, true);
                        $scope.checkboxSAV = 0;
                        if (sousemplacement.Sousemplacement.isSAV == true || sousemplacement.Sousemplacement.isSAV == 1) {
                            $scope.checkboxSAV = 1;
                        }
                        $scope.$watch(function () {
                            return $scope.checkboxSAV;
                        }, function () {
                            $scope.checkboxSAV = Number($scope.checkboxSAV);
                        }, true);
                    });
                    $scope.editSousEmplacement = function ($event) {
                        $event.preventDefault();
                        var dataEmplacement = {
                            Sousemplacement: {
                                id: id,
                                emplacement_id: $("#emplacementValue :selected").val(),
                                name: $("#name").val(),
                                description: $("#description").val(),
                                isSAV: $("#isSAV").val(),
                                isRebut: $("#isRebut").val(),
                                isRetour: $("#isRetour").val()
                            }
                        };
                        $scope.emplacement = PostFactory.editSousEmplacement(dataEmplacement).then(function (emplacement) {
                            if (emplacement.type === 'success') {
                                $location.path('/view-emplacement/' + $("#emplacementValue :selected").val());
                                toastr.success(emplacement.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                }
                // sous emplacement

            } else {
                $location.path('/login');
            }
        })
       