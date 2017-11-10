angular.module('starter.controllers.p2', [])
        .controller("FicheExpediteurController", function ($scope, PostFactory, TransporteurFactory, $filter, $cookieStore, $cookies, $location) {
            if ($cookieStore.get('sessionConnected')) {
                console.log('fiche expditeur');
                var id = parseInt($location.path().split('/')[2]);
                $("div#otherPagesRamassageDepot").html("");
                $scope.CmdsRamassageDepot = TransporteurFactory.listClientRamassageDepotPaginate(1, 30, null, null, id).then(function (clientsramassage) {
                    $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                    $scope.paging = clientsramassage.data.pageCount.Commande;
                    $scope.itemsPerPage = $scope.paging.limit;
                    $scope.totalItems = $scope.paging.count;
                    console.log(clientsramassage.data.commandesRamassageDepot);
                    $scope.countRamassageDepot = clientsramassage.data.pageCount.Commande.count;
                    console.log(clientsramassage.data.pageCount.Commande.count);
                    $scope.clientNotAffect = clientsramassage.dataNotAffect;
                    $scope.countclients = clientsramassage.data.pageCount.Commande.count;
                    $scope.countcommandes = clientsramassage.countcommandes;
                    $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
                    $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
                    $scope.countRamassage = clientsramassage.countRamassage;
                    $scope.countDepot = clientsramassage.countDepot;
                    $scope.pageCount = clientsramassage.data.pageCount.Commande.pageCount;
                    $scope.CurrentPage = clientsramassage.data.pageCount.Commande.page;
                    $scope.currentPageRamassageDepot = clientsramassage.data.pageCount.Commande.page;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChanged = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    $scope.CmdsRamassageDepot = TransporteurFactory.listClientRamassageDepotPaginate(page, 30, searchKey, null, id).then(function (clientsramassage) {
                        $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                        $scope.paging = clientsramassage.data.pageCount.Commande;
                        $scope.itemsPerPage = $scope.paging.limit;
                        $scope.totalItems = $scope.paging.count;
                        console.log(clientsramassage.data.commandesRamassageDepot);
                        $scope.countRamassageDepot = clientsramassage.data.pageCount.Commande.count;
                        console.log(clientsramassage.data.pageCount.Commande.count);
                        $scope.clientNotAffect = clientsramassage.dataNotAffect;
                        $scope.countclients = clientsramassage.data.pageCount.Commande.count;
                        $scope.countcommandes = clientsramassage.countcommandes;
                        $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
                        $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
                        $scope.countRamassage = clientsramassage.countRamassage;
                        $scope.countDepot = clientsramassage.countDepot;
                        $scope.pageCount = clientsramassage.data.pageCount.Commande.pageCount;
                        $scope.CurrentPage = clientsramassage.data.pageCount.Commande.page;
                        $scope.currentPageRamassageDepot = clientsramassage.data.pageCount.Commande.page;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.searchRamassageDepotFunc = function (searchRamassageDepot) {
                    var searchKey = $scope.searchRamassageDepot;
                    var ville = $scope.ville;
                    console.log(searchRamassageDepot);
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsRamassageDepot = TransporteurFactory.listClientRamassageDepotPaginate(1, 30, searchKey, ville, id).then(function (clientsramassage) {
                            $("div#otherPagesRamassageDepot").html("");
                            $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                            $scope.pageCount = clientsramassage.data.pageCount.Commande.pageCount;
                            $scope.currentPage = clientsramassage.data.pageCount.Commande.page;
                            var currentPage = clientsramassage.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + clientsramassage.data.pageCount.Commande.pageCount;
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < clientsramassage.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageRamassageDepot(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesRamassageDepot").append($html);
                                }
                            }
                            if (clientsramassage.data.pageCount.Commande.prevPage == false) {
                                $("button#nextPageRamassageDepot").attr('disabled', false);
                                $("button#previousPageRamassageDepot").attr('disabled', true);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsRamassageDepot = TransporteurFactory.listClientRamassageDepotPaginate(1, 30, searchKey, null, id).then(function (clientsramassage) {
                                $("div#otherPagesRamassageDepot").html("");
                                $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                                $scope.pageCount = clientsramassage.data.pageCount.Commande.pageCount;
                                $scope.currentPage = clientsramassage.data.pageCount.Commande.page;
                                var currentPage = clientsramassage.data.pageCount.Commande.page;
                                var nbrMaxNextPages = 5 + clientsramassage.data.pageCount.Commande.pageCount;
                                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                    if (i < clientsramassage.data.pageCount.Commande.pageCount && i <= 5) {
                                        var $html = $compile("<button class='btn btn-default' ng-click='showPageRamassageDepot(" + i + ")'>" + i + "</button>")($scope);
                                        $("div#otherPagesRamassageDepot").append($html);
                                    }
                                }
                                if (clientsramassage.data.pageCount.Commande.prevPage == false) {
                                    $("button#nextPageRamassageDepot").attr('disabled', false);
                                    $("button#previousPageRamassageDepot").attr('disabled', true);
                                }
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                $scope.update_client_ramassage_depot = function () {
                    $("div#otherPagesRamassageDepot").html("");
                    $scope.CmdsRamassageDepot = TransporteurFactory.listClientRamassageDepotPaginate(1, 30, null, null, id).then(function (clientsramassage) {
                        $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                        console.log(clientsramassage.data.commandesRamassageDepot);
                        $scope.countRamassageDepot = clientsramassage.data.pageCount.Commande.count;
                        $scope.clientNotAffect = clientsramassage.dataNotAffect;
                        $scope.countclients = clientsramassage.data.pageCount.Commande.count;
                        $scope.countcommandes = clientsramassage.countcommandes;
                        $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
                        $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
                        $scope.countRamassage = clientsramassage.countRamassage;
                        $scope.countDepot = clientsramassage.countDepot;
                        $scope.pageCount = clientsramassage.data.pageCount.Commande.pageCount;
                        $scope.CurrentPage = clientsramassage.data.pageCount.Commande.page;
                        $scope.currentPageRamassageDepot = clientsramassage.data.pageCount.Commande.page;
                        $("button#firstPageRamassageDepot").hide();
                        var currentPage = clientsramassage.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < clientsramassage.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageRamassageDepot(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesRamassageDepot").append($html);
                            }
                        }
                        if (clientsramassage.data.pageCount.Commande.prevPage == false) {
                            $("#nextPageRamassageDepot").attr('disabled', false);
                            $("#previousPageRamassageDepot").attr('disabled', true);
                        }
                        if (clientsramassage.data.pageCount.Commande.pageCount == 1) {
                            $("#nextPageRamassageDepot").attr('disabled', true);
                            $("#previousPageRamassageDepot").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                // list commandes récuperées
                $("div#otherPagesClientRecuperees").html("");
                $scope.CmdsClientRecuperees = TransporteurFactory.listClientRecupereesPaginate(1, 30, null, null, id).then(function (clientsrecuperer) {
                    $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                    $scope.countClientRecuperees = clientsrecuperer.data.pageCount.Commande.count;
                    $scope.pagingRecuperee = clientsrecuperer.data.pageCount.Commande;
                    $scope.itemsPerPageRecuperee = $scope.pagingRecuperee.limit;
                    $scope.totalItemsRecuperee = $scope.pagingRecuperee.count;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChangedRecuperee = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    $scope.CmdsClientRecuperees = TransporteurFactory.listClientRecupereesPaginate(page, 30, searchKey, null, id).then(function (clientsrecuperer) {
                        $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                        $scope.countClientRecuperees = clientsrecuperer.data.pageCount.Commande.count;
                        $scope.pagingRecuperee = clientsrecuperer.data.pageCount.Commande;
                        $scope.itemsPerPageRecuperee = $scope.pagingRecuperee.limit;
                        $scope.totalItemsRecuperee = $scope.pagingRecuperee.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.searchClientRecupereesFunc = function (searchClientRecuperees) {
                    var searchKey = $scope.searchClientRecuperees;
                    var ville = $scope.ville;
                    console.log(searchClientRecuperees);
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsClientRecuperees = TransporteurFactory.listClientRecupereesPaginate(1, 30, searchKey, ville, id).then(function (clientsrecuperer) {
                            $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                            $scope.countClientRecuperees = clientsrecuperer.data.pageCount.Commande.count;
                            $scope.pagingRecuperee = clientsrecuperer.data.pageCount.Commande;
                            $scope.itemsPerPageRecuperee = $scope.pagingRecuperee.limit;
                            $scope.totalItemsRecuperee = $scope.pagingRecuperee.count;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsClientRecuperees = TransporteurFactory.listClientRecupereesPaginate(1, 30, searchKey, null, id).then(function (clientsrecuperer) {
                                $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                                $scope.countClientRecuperees = clientsrecuperer.data.pageCount.Commande.count;
                                $scope.pagingRecuperee = clientsrecuperer.data.pageCount.Commande;
                                $scope.itemsPerPageRecuperee = $scope.pagingRecuperee.limit;
                                $scope.totalItemsRecuperee = $scope.pagingRecuperee.count;
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                $scope.update_recuperee = function () {
                    $scope.CmdsClientRecuperees = TransporteurFactory.listClientRecupereesPaginate(1, 30, null, null, id).then(function (clientsrecuperer) {
                        $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                        $scope.countClientRecuperees = clientsrecuperer.data.pageCount.Commande.count;
                        $scope.pagingRecuperee = clientsrecuperer.data.pageCount.Commande;
                        $scope.itemsPerPageRecuperee = $scope.pagingRecuperee.limit;
                        $scope.totalItemsRecuperee = $scope.pagingRecuperee.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
                // en stock
                $("div#otherPagesEnStock").html("");
                $scope.CmdsEnStock = TransporteurFactory.listCommandeEnstocksPaginate(1, 30, null, null, id).then(function (commandesenstock) {
                    $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                    $scope.countEnStock = commandesenstock.data.pageCount.Commande.count;
                    $scope.pagingStock = commandesenstock.data.pageCount.Commande;
                    $scope.itemsPerPageStock = $scope.pagingStock.limit;
                    $scope.totalItemsStock = $scope.pagingStock.count;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChangedStock = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    $scope.CmdsEnStock = TransporteurFactory.listCommandeEnstocksPaginate(page, 30, searchKey, null, id).then(function (commandesenstock) {
                        $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                        $scope.countEnStock = commandesenstock.data.pageCount.Commande.count;
                        $scope.pagingStock = commandesenstock.data.pageCount.Commande;
                        $scope.itemsPerPageStock = $scope.pagingStock.limit;
                        $scope.totalItemsStock = $scope.pagingStock.count;

                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.searchEnStockFunc = function (searchEnStock) {
                    var searchKey = $scope.searchEnStock;
                    var ville = $scope.ville;
                    console.log(searchEnStock);
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsEnStock = TransporteurFactory.listCommandeEnstocksPaginate(1, 30, searchKey, ville, id).then(function (commandesenstock) {
                            $("div#otherPagesEnStock").html("");
                            $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                            $scope.countEnStock = commandesenstock.data.pageCount.Commande.count;
                            $scope.pagingStock = commandesenstock.data.pageCount.Commande;
                            $scope.itemsPerPageStock = $scope.pagingStock.limit;
                            $scope.totalItemsStock = $scope.pagingStock.count;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsEnStock = TransporteurFactory.listCommandeEnstocksPaginate(1, 30, searchKey, null, id).then(function (commandesenstock) {
                                $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                                $scope.countEnStock = commandesenstock.data.pageCount.Commande.count;
                                $scope.pagingStock = commandesenstock.data.pageCount.Commande;
                                $scope.itemsPerPageStock = $scope.pagingStock.limit;
                                $scope.totalItemsStock = $scope.pagingStock.count;
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                $scope.update_en_stock = function () {
                    $("div#otherPagesEnStock").html("");
                    $scope.CmdsEnStock = TransporteurFactory.listCommandeEnstocksPaginate(1, 30, null, null, id).then(function (commandesenstock) {
                        $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                        $scope.countEnStock = commandesenstock.data.pageCount.Commande.count;
                        $scope.pagingStock = commandesenstock.data.pageCount.Commande;
                        $scope.itemsPerPageStock = $scope.pagingStock.limit;
                        $scope.totalItemsStock = $scope.pagingStock.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                // en cours de livraison

                $scope.CmdsEnCoursLivraison = TransporteurFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(1, 5, null, null, id).then(function (commandeseEnattentelivraisonspaceclient) {
                    $scope.CmdsEnCoursLivraison = commandeseEnattentelivraisonspaceclient.data.commandesAttLivraison;
                    $scope.countEnattentelivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande.count;
                    $scope.pagingAttLivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande;
                    $scope.itemsPerPageAttLivraison = $scope.pagingAttLivraison.limit;
                    $scope.totalItemsAttLivraison = $scope.pagingAttLivraison.count;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChangedAttLivraison = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    $scope.CmdsEnCoursLivraison = TransporteurFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(page, 30, searchKey, null, id).then(function (commandeseEnattentelivraisonspaceclient) {
                        $scope.CmdsEnCoursLivraison = commandeseEnattentelivraisonspaceclient.data.commandesAttLivraison;
                        $scope.countEnattentelivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande.count;
                        $scope.pagingAttLivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande;
                        $scope.itemsPerPageAttLivraison = $scope.pagingAttLivraison.limit;
                        $scope.totalItemsAttLivraison = $scope.pagingAttLivraison.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.searchAttLivraisonFunc = function (searchAttLivraison) {
                    var searchKey = $scope.searchAttLivraison;
                    var ville = $scope.ville;
                    console.log(searchAttLivraison);
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsEnCoursLivraison = TransporteurFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(1, 5, searchKey, ville, id).then(function (commandeseEnattentelivraisonspaceclient) {
                            $("div#otherPagesAttLivraison").html("");
                            $scope.CmdsEnCoursLivraison = commandeseEnattentelivraisonspaceclient.data.commandesAttLivraison;
                            $scope.pagingAttLivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande;
                            $scope.itemsPerPageAttLivraison = $scope.pagingAttLivraison.limit;
                            $scope.totalItemsAttLivraison = $scope.pagingAttLivraison.count;

                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsEnCoursLivraison = TransporteurFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(1, 5, searchKey, null, id).then(function (commandeseEnattentelivraisonspaceclient) {
                                $("div#otherPagesAttLivraison").html("");
                                $scope.CmdsEnCoursLivraison = commandeseEnattentelivraisonspaceclient.data.commandesAttLivraison;
                                $scope.pagingAttLivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande;
                                $scope.itemsPerPageAttLivraison = $scope.pagingAttLivraison.limit;
                                $scope.totalItemsAttLivraison = $scope.pagingAttLivraison.count;
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                $scope.update_en_attente_livraison = function () {
                    $scope.CmdsEnCoursLivraison = TransporteurFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(1, 5, null, null, id).then(function (commandeseEnattentelivraisonspaceclient) {
                        $scope.CmdsEnCoursLivraison = commandeseEnattentelivraisonspaceclient.data.commandesAttLivraison;
                        $scope.countEnattentelivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande.count;
                        $scope.pagingAttLivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande;
                        $scope.itemsPerPageAttLivraison = $scope.pagingAttLivraison.limit;
                        $scope.totalItemsAttLivraison = $scope.pagingAttLivraison.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                // retour
                // commandes retour paginate 
                $("div#otherPagesRetour").html("");
                $scope.CmdsRetour = TransporteurFactory.listCommandeRetoursEspaceclientPaginate(1, 30, null, null, null, id).then(function (commandesretours) {
                    $scope.CmdsRetour = commandesretours.data.commandesRetour;
                    $scope.countRetour = commandesretours.data.pageCount.Commande.count;
                    $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                    $scope.CurrentPage = commandesretours.data.pageCount.Commande.page;
                    $scope.currentPageRetour = commandesretours.data.pageCount.Commande.page;
                    $scope.pagingRetour = commandesretours.data.pageCount.Commande;
                    $scope.itemsPerPageRetour = $scope.pagingRetour.limit;
                    $scope.totalItemsRetour = $scope.pagingRetour.count;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChangedRetour = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    $scope.CmdsRetour = TransporteurFactory.listCommandeRetoursEspaceclientPaginate(page, 30, searchKey, null, null, id).then(function (commandesretours) {
                        $scope.CmdsRetour = commandesretours.data.commandesRetour;
                        $scope.countRetour = commandesretours.data.pageCount.Commande.count;
                        $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                        $scope.CurrentPage = commandesretours.data.pageCount.Commande.page;
                        $scope.currentPageRetour = commandesretours.data.pageCount.Commande.page;
                        $scope.pagingRetour = commandesretours.data.pageCount.Commande;
                        $scope.itemsPerPageRetour = $scope.pagingRetour.limit;
                        $scope.totalItemsRetour = $scope.pagingRetour.count;


                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.searchRetourFunc = function (searchRetour) {
                    var etatRetoure = $("select#searchRetourees :selected").val();
                    var searchKey = $scope.searchRetour;
                    var ville = $scope.ville;
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsRetour = TransporteurFactory.listCommandeRetoursEspaceclientPaginate(1, 30, searchKey, ville, etatRetoure, id).then(function (commandesretours) {
                            $("div#otherPagesRetour").html("");
                            $scope.CmdsRetour = commandesretours.data.commandesRetour;
                            $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                            $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsRetour = TransporteurFactory.listCommandeRetoursEspaceclientPaginate(1, 30, searchKey, null, null, id).then(function (commandesretours) {
                                $("div#otherPagesRetour").html("");
                                $scope.CmdsRetour = commandesretours.data.commandesRetour;
                                $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                                $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                                $scope.pagingRetour = commandesretours.data.pageCount.Commande;
                                $scope.itemsPerPageRetour = $scope.pagingRetour.limit;
                                $scope.totalItemsRetour = $scope.pagingRetour.count;
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                $scope.etatRetourees = function () {
                    var etatRetoure = $scope.etatRatoures;
                    var searchKey = $.trim($("#searchRetour").val());
                    var ville = $scope.ville;
                    $("div#otherPagesRetour").html("");
                    $scope.CmdsRetour = TransporteurFactory.listCommandeRetoursEspaceclientPaginate(1, 30, searchKey, ville, etatRetoure, id).then(function (commandesretours) {
                        $("div#otherPagesRetour").html("");
                        $scope.CmdsRetour = commandesretours.data.commandesRetour;
                        $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                        $scope.pagingRetour = commandesretours.data.pageCount.Commande;
                        $scope.itemsPerPageRetour = $scope.pagingRetour.limit;
                        $scope.totalItemsRetour = $scope.pagingRetour.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
                $scope.update_retour = function () {
                    $("div#otherPagesRetour").html("");
                    $scope.CmdsRetour = TransporteurFactory.listCommandeRetoursEspaceclientPaginate(1, 30, null, null, null, id).then(function (commandesretours) {
                        $scope.CmdsRetour = commandesretours.data.commandesRetour;
                        $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                        $scope.pagingRetour = commandesretours.data.pageCount.Commande;
                        $scope.itemsPerPageRetour = $scope.pagingRetour.limit;
                        $scope.totalItemsRetour = $scope.pagingRetour.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                // livrée
                // commande livrée pagination 
                $("div#otherPagesLivree").html("");
                $scope.CmdsLivree = TransporteurFactory.listCommandeLivreeEspaceclientPaginate(1, 30, null, null, id).then(function (commandeslivrees) {
                    $scope.CmdsLivree = commandeslivrees.data.commandesLivree;
                    $scope.countLivree = commandeslivrees.data.pageCount.Commande.count;
                    $scope.pagingLivree = commandeslivrees.data.pageCount.Commande;
                    $scope.itemsPerPageLivree = $scope.pagingLivree.limit;
                    $scope.totalItemsLivree = $scope.pagingLivree.count;

                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.searchLivreeFunc = function (searchLivree) {
                    var searchKey = $scope.searchLivree;
                    var ville = $scope.ville;
                    console.log(searchKey);
                    console.log(searchLivree);
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsLivree = TransporteurFactory.listCommandeLivreeEspaceclientPaginate(1, 30, searchKey, ville, id).then(function (commandeslivrees) {
                            $scope.CmdsLivree = commandeslivrees.data.commandesLivree;
                            $scope.countLivree = commandeslivrees.data.pageCount.Commande.count;
                            $scope.pagingLivree = commandeslivrees.data.pageCount.Commande;
                            $scope.itemsPerPageLivree = $scope.pagingLivree.limit;
                            $scope.totalItemsLivree = $scope.pagingLivree.count;

                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsLivree = TransporteurFactory.listCommandeLivreeEspaceclientPaginate(1, 30, searchKey, null, id).then(function (commandeslivrees) {
                                $("div#otherPagesLivree").html("");
                                $scope.CmdsLivree = commandeslivrees.data.commandesLivree;
                                $scope.countLivree = commandeslivrees.data.pageCount.Commande.count;
                                $scope.pagingLivree = commandeslivrees.data.pageCount.Commande;
                                $scope.itemsPerPageLivree = $scope.pagingLivree.limit;
                                $scope.totalItemsLivree = $scope.pagingLivree.count;
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                $scope.update_livraison = function () {
                    $("div#otherPagesLivree").html("");
                    $scope.CmdsLivree = TransporteurFactory.listCommandeLivreeEspaceclientPaginate(1, 30, null, null, id).then(function (commandeslivrees) {
                        $scope.CmdsLivree = commandeslivrees.data.commandesLivree;
                        $scope.countLivree = commandeslivrees.data.pageCount.Commande.count;
                        $scope.pagingLivree = commandeslivrees.data.pageCount.Commande;
                        $scope.itemsPerPageLivree = $scope.pagingLivree.limit;
                        $scope.totalItemsLivree = $scope.pagingLivree.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                //commandes annulees patination
                $("div#otherPagesAnnulee").html("");
                $scope.CmdsAnnulee = TransporteurFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30, null, null, null, id).then(function (commandesannulee) {
                    $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                    $scope.countAnnuleeTotal = commandesannulee.data.pageCount.Commande.count;
                    $scope.countannuleefacture = commandesannulee.countfacture;
                    $scope.countannuleenotfacture = commandesannulee.countnotfacture;
                    $scope.pagingAnnulee = commandesannulee.data.pageCount.Commande;
                    $scope.itemsPerPageAnnulee = $scope.pagingAnnulee.limit;
                    $scope.totalItemsAnnulee = $scope.pagingAnnulee.count;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChangedAnnulee = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    $scope.CmdsAnnulee = TransporteurFactory.listCommandeAnnuleeEspaceclientPaginate(page, 30, searchKey, null, null, id).then(function (commandesannulee) {
                        $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                        $scope.countAnnuleeTotal = commandesannulee.data.pageCount.Commande.count;
                        $scope.countannuleefacture = commandesannulee.countfacture;
                        $scope.countannuleenotfacture = commandesannulee.countnotfacture;
                        $scope.pagingAnnulee = commandesannulee.data.pageCount.Commande;
                        $scope.itemsPerPageAnnulee = $scope.pagingAnnulee.limit;
                        $scope.totalItemsAnnulee = $scope.pagingAnnulee.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.searchAnnuleeFunc = function (searchAnnulee) {
                    var etatFacture = $("select#etatFactures :selected").val();
                    var searchKey = searchAnnulee;
                    var ville = $scope.ville;
                    console.log(etatFacture);
                    console.log(searchAnnulee);
                    if (searchAnnulee.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsAnnulee = TransporteurFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30, searchKey, ville, etatFacture, id).then(function (commandesannulee) {
                            $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                            $scope.countAnnuleeTotal = commandesannulee.data.pageCount.Commande.count;
                            $scope.countannuleefacture = commandesannulee.countfacture;
                            $scope.countannuleenotfacture = commandesannulee.countnotfacture;
                            $scope.pagingAnnulee = commandesannulee.data.pageCount.Commande;
                            $scope.itemsPerPageAnnulee = $scope.pagingAnnulee.limit;
                            $scope.totalItemsAnnulee = $scope.pagingAnnulee.count;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsAnnulee = TransporteurFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30, searchKey, null, null, id).then(function (commandesannulee) {
                                $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                                $scope.countAnnuleeTotal = commandesannulee.data.pageCount.Commande.count;
                                $scope.countannuleefacture = commandesannulee.countfacture;
                                $scope.countannuleenotfacture = commandesannulee.countnotfacture;
                                $scope.pagingAnnulee = commandesannulee.data.pageCount.Commande;
                                $scope.itemsPerPageAnnulee = $scope.pagingAnnulee.limit;
                                $scope.totalItemsAnnulee = $scope.pagingAnnulee.count;
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                $scope.etatFactureAnnulees = function (etatFactures) {
                    var etatFacture = etatFactures;
                    console.log(etatFacture);
//                    var searchKey = $scope.searchAnnulee;
                    var searchKey = $.trim($("#searchAnnulees").val());
                    console.log(searchKey);
                    var ville = null;
                    $("div#otherPagesAnnulee").html("");
                    $scope.CmdsAnnulee = TransporteurFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30, searchKey, ville, etatFacture, id).then(function (commandesannulee) {
                        $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                        $scope.countAnnuleeTotal = commandesannulee.data.pageCount.Commande.count;
                        $scope.countannuleefacture = commandesannulee.countfacture;
                        $scope.countannuleenotfacture = commandesannulee.countnotfacture;
                        $scope.pagingAnnulee = commandesannulee.data.pageCount.Commande;
                        $scope.itemsPerPageAnnulee = $scope.pagingAnnulee.limit;
                        $scope.totalItemsAnnulee = $scope.pagingAnnulee.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
                $scope.update_annulation = function () {
                    $("div#otherPagesAnnulee").html("");
                    $scope.CmdsAnnulee = TransporteurFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30, null, null, null, id).then(function (commandesannulee) {
                        $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                        $scope.countAnnuleeTotal = commandesannulee.data.pageCount.Commande.count;
                        $scope.countannuleefacture = commandesannulee.countfacture;
                        $scope.countannuleenotfacture = commandesannulee.countnotfacture;
                        $scope.pagingAnnulee = commandesannulee.data.pageCount.Commande;
                        $scope.itemsPerPageAnnulee = $scope.pagingAnnulee.limit;
                        $scope.totalItemsAnnulee = $scope.pagingAnnulee.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                // facturees
                $("div#otherPagesFacturee").html("");
                $scope.CmdsFacturee = TransporteurFactory.listCommandeFactureesPaginate(1, 30, null, null, id).then(function (commandesfacturees) {
                    $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                    $scope.countFacturee = commandesfacturees.data.pageCount.Commande.count;
                    $scope.pagingFacturee = commandesfacturees.data.pageCount.Commande;
                    $scope.itemsPerPageFacturee = $scope.pagingFacturee.limit;
                    $scope.totalItemsFacturee = $scope.pagingFacturee.count;

                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChangedFacturee = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    $scope.CmdsFacturee = TransporteurFactory.listCommandeFactureesPaginate(page, 30, searchKey, null, id).then(function (commandesfacturees) {
                        $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                        $scope.countFacturee = commandesfacturees.data.pageCount.Commande.count;
                        $scope.pagingFacturee = commandesfacturees.data.pageCount.Commande;
                        $scope.itemsPerPageFacturee = $scope.pagingFacturee.limit;
                        $scope.totalItemsFacturee = $scope.pagingFacturee.count;


                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };

                $scope.searchFactureeFunc = function (searchFacturee) {
                    var searchKey = $scope.searchFacturee;
                    var ville = $scope.ville;
                    console.log(searchFacturee);
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsFacturee = TransporteurFactory.listCommandeFactureesPaginate(1, 30, searchKey, ville, id).then(function (commandesfacturees) {
                            $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                            $scope.countFacturee = commandesfacturees.data.pageCount.Commande.count;
                            $scope.pagingFacturee = commandesfacturees.data.pageCount.Commande;
                            $scope.itemsPerPageFacturee = $scope.pagingFacturee.limit;
                            $scope.totalItemsFacturee = $scope.pagingFacturee.count;

                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsFacturee = TransporteurFactory.listCommandeFactureesPaginate(1, 30, searchKey, null, id).then(function (commandesfacturees) {
                                $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                                $scope.countFacturee = commandesfacturees.data.pageCount.Commande.count;
                                $scope.pagingFacturee = commandesfacturees.data.pageCount.Commande;
                                $scope.itemsPerPageFacturee = $scope.pagingFacturee.limit;
                                $scope.totalItemsFacturee = $scope.pagingFacturee.count;

                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                $scope.update_facturees = function () {
                    $("div#otherPagesFacturee").html("");
                    $scope.CmdsFacturee = TransporteurFactory.listCommandeFactureesPaginate(1, 30, null, null, id).then(function (commandesfacturees) {
                        $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                        $scope.countFacturee = commandesfacturees.data.pageCount.Commande.count;
                        $scope.pagingFacturee = commandesfacturees.data.pageCount.Commande;
                        $scope.itemsPerPageFacturee = $scope.pagingFacturee.limit;
                        $scope.totalItemsFacturee = $scope.pagingFacturee.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                // retour expediteur
                $("div#otherPagesRetourExpediteur").html("");
                $scope.CmdsRetourExpediteur = TransporteurFactory.listRetoursExpediteurPaginate(1, 30, null, null, id).then(function (listretoursexpediteur) {
                    $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                    $scope.countRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.count;
                    $scope.pagingRetourExpediteur = listretoursexpediteur.data.pageCount.Commande;
                    $scope.itemsPerPageRetourExpediteur = $scope.pagingRetourExpediteur.limit;
                    $scope.totalItemsRetourExpediteur = $scope.pagingRetourExpediteur.count;

                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChangedRecuperee = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    $scope.CmdsRetourExpediteur = TransporteurFactory.listRetoursExpediteurPaginate(page, 30, searchKey, null, id).then(function (listretoursexpediteur) {
                        $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                        $scope.countRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.count;
                        $scope.pagingRetourExpediteur = listretoursexpediteur.data.pageCount.Commande;
                        $scope.itemsPerPageRetourExpediteur = $scope.pagingRetourExpediteur.limit;
                        $scope.totalItemsRetourExpediteur = $scope.pagingRetourExpediteur.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.searchRetourExpediteurFunc = function (searchRetourExpediteur) {
                    var searchKey = $scope.searchRetourExpediteur;
                    var ville = $scope.ville;
                    console.log(searchRetourExpediteur);
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsRetourExpediteur = TransporteurFactory.listRetoursExpediteurPaginate(1, 30, searchKey, ville, id).then(function (listretoursexpediteur) {
                            $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                            $scope.countRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.count;
                            $scope.pagingRetourExpediteur = listretoursexpediteur.data.pageCount.Commande;
                            $scope.itemsPerPageRetourExpediteur = $scope.pagingRetourExpediteur.limit;
                            $scope.totalItemsRetourExpediteur = $scope.pagingRetourExpediteur.count;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsRetourExpediteur = TransporteurFactory.listRetoursExpediteurPaginate(1, 30, searchKey, null, id).then(function (listretoursexpediteur) {
                                $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                                $scope.countRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.count;
                                $scope.pagingRetourExpediteur = listretoursexpediteur.data.pageCount.Commande;
                                $scope.itemsPerPageRetourExpediteur = $scope.pagingRetourExpediteur.limit;
                                $scope.totalItemsRetourExpediteur = $scope.pagingRetourExpediteur.count;
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                $scope.update_retour_expediteur = function () {
                    $("div#otherPagesRetourExpediteur").html("");
                    $scope.CmdsRetourExpediteur = TransporteurFactory.listRetoursExpediteurPaginate(1, 30, null, null, id).then(function (listretoursexpediteur) {
                        $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                        $scope.countRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.count;
                        $scope.pagingRetourExpediteur = listretoursexpediteur.data.pageCount.Commande;
                        $scope.itemsPerPageRetourExpediteur = $scope.pagingRetourExpediteur.limit;
                        $scope.totalItemsRetourExpediteur = $scope.pagingRetourExpediteur.count;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.searchGloablCmd = function ($event) {
                    var keycode = ($event.keyCode ? $event.keyCode : $event.which);
                    if (keycode == '13') {
                        var refCmd = "";
                        if ($scope.globalSearchRef.indexOf(")") == -1) {
                            refCmd = $scope.globalSearchRef;
                        } else {
                            refCmd = decodeBarcode($scope.globalSearchRef);
                        }
                        $("#globalSearch").val(refCmd);
                        PostFactory.viewCommandeBarrecode(refCmd).then(function (commande) {
                            var state = commande.text.Commande.state;
                            console.log(state);
                            var user_id = commande.text.Commande.user_id;
                            var clientCommande = commande.text.User.raison_social || commande.text.User.nom_commercial;
                            switch (state) {
                                case "Non Traitée":
                                    textToSound("Commande en attente ramassage");
                                    $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                    $(document).find("input[ng-model='searchRamassageDepot']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");  
                                    break;
                                case "Non Traitée depot":
                                    textToSound("Commande en attente dépôt");
                                    $(document).find("a[data-state-cmd='Non Traitée']").tab('show');
                                    $(document).find("input[ng-model='searchRamassageDepot']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");
                                    break;
                                case "En Cours":
                                    textToSound("Commande récupérée");
                                    $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                    $(document).find("input[ng-model='searchClientRecuperees']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");
                                    break;
                                case "En stock":
                                    textToSound("Commande En stock");
                                    $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                    $(document).find("input[ng-model='searchEnStock']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");
                                    break;
                                case "AttenteLivraison":
                                    textToSound("Commande En cours de livraison")
                                    $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                    $(document).find("input[ng-model='searchAttLivraison']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");
                                    break;
                                case "Livrée":
                                    textToSound("Commande livrée")
                                    $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                    $(document).find("input[ng-model='searchLivree']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");
                                    break;
                                case "Retour":
                                    textToSound("Commande En retour")
                                    $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                    $(document).find("input[ng-model='searchRetour']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");
                                    break;
                                case "Annulée":
                                    textToSound("Commande annulée")
                                    $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                    $(document).find("input[ng-model='searchAnnulee']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");
                                    break;
                                case "Facturée":
                                    textToSound("Commande facturée")
                                    $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                    $(document).find("input[ng-model='searchFacturee']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");
                                    break;
                                case "Retour Expéditeur":
                                    textToSound("Commande En Retour Expéditeur")
                                    $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                    $(document).find("input[ng-model='searchRetourExpediteur']").val(refCmd).trigger("change");
                                    $("#globalSearch").val("");
                            }
                        });
                    }
                }
            } else {
                $location.path('/login');
            }
        });
        