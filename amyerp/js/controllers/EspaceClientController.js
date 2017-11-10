controllerApp
        .controller("TestController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {
//            var searchKey = $scope.search;
//            $("#filterSearch").hide('fast');
//            $("button#firstPage").hide();
//            //load page
//            $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate(1, 5, searchKey).then(function (clientsramassage) {
//                $scope.villes = clientsramassage.villes;
//                $scope.clientsramassage = clientsramassage.data.clients;
//                $scope.clientNotAffect = clientsramassage.dataNotAffect;
//                $scope.countclients = clientsramassage.countclients;
//                $scope.countcommandes = clientsramassage.countcommandes;
//                $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
//                $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
//                $scope.currentPage = clientsramassage.data.countPage.User.page;
//                $scope.pageCount = clientsramassage.data.countPage.User.pageCount;
//                var currentPage = clientsramassage.data.countPage.User.page;
//                var nbrMaxNextPages = 5;
//                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
//                    if (i < clientsramassage.data.countPage.User.pageCount) {
//                        var $html = $compile("<button class='btn btn-default' ng-click='showPage(" + i + ")'>" + i + "</button>")($scope);
//                        $("div#otherPages").append($html);
//                    }
//                }
//                if (clientsramassage.data.countPage.User.prevPage == false) {
//                    $("#nextPage").attr('disabled', false);
//                    $("#previousPage").attr('disabled', true);
//                }
//            }, 
//                    function (msg) {
//                        alert(msg);
//                    }
//            );
//            // UPDATE LIST CLIENT EN ATTENTE RAMASSAGE OU DÉPOT
//            $scope.update_client_ramassage_depot = function () {
//                var searchKey = $scope.searchRamassage;
//                $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate(1, 5, searchKey).then(function (clientsramassage) {
//                    $scope.clientsramassage = clientsramassage.data.clients;
//                    $scope.clientNotAffect = clientsramassage.dataNotAffect;
//                    $scope.countclients = clientsramassage.countclients;
//                    $scope.countcommandes = clientsramassage.countcommandes;
//                    $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
//                    $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
////                    //console.log(clientsramassage);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.searchResult = function (searchRamassage) {
//                var searchKey = searchRamassage;
//                var ville = $scope.ville;
//                console.log(searchRamassage);
//                var heightTbody = 0;
//                if (searchKey.length >= 3) {
//                    console.log("LAUNCH SEARCH");
//                    $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate(1, 5, searchKey, ville).then(function (clientsramassage) {
//                        $("div#otherPages").html("");
//
//                        $scope.pageCount = clientsramassage.data.countPage.User.pageCount;
//                        $scope.currentPage = clientsramassage.data.countPage.User.page;
//                        $scope.clientsramassage = clientsramassage.data.clients;
//                        $scope.clientNotAffect = clientsramassage.dataNotAffect;
//                        $scope.countclients = clientsramassage.countclients;
//                        $scope.countcommandes = clientsramassage.countcommandes;
//                        $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
//                        $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
//                        var currentPage = clientsramassage.data.countPage.User.page;
//                        var nbrMaxNextPages = 5 + clientsramassage.data.countPage.User.pageCount;
//                        for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
//                            if (i < clientsramassage.data.countPage.User.pageCount) {
//                                var $html = $compile("<button class='btn btn-default' ng-click='showPage(" + i + ")'>" + i + "</button>")($scope);
//                                $("div#otherPages").append($html);
//                            }
//                        }
//                        if (clientsramassage.data.countPage.User.prevPage == false) {
//                            $("#nextPage").attr('disabled', false);
//                            $("#previousPage").attr('disabled', true);
//                        }
//
//                        setTimeout(function () {
//                            heightTbody = $("tbody").height();
//                            console.log($("tbody").height());
//                        }, 500);
//                    },
//                            function (msg) {
//                                alert(msg);
//                            }
//                    );
//                } else {
//                    if (searchKey === "") {
//                        console.log("LAUNCH RESET");
//                        $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate(1, 5, searchKey).then(function (clientsramassage) {
//                            $("div#otherPages").html("");
//                            $scope.pageCount = clientsramassage.data.countPage.User.pageCount;
//                            $scope.currentPage = clientsramassage.data.countPage.User.page;
//                            $scope.clientsramassage = clientsramassage.data.clients;
//                            $scope.clientNotAffect = clientsramassage.dataNotAffect;
//                            $scope.countclients = clientsramassage.countclients;
//                            $scope.countcommandes = clientsramassage.countcommandes;
//                            $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
//                            $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
//                            var currentPage = clientsramassage.data.countPage.User.page;
//                            var nbrMaxNextPages = 5 + clientsramassage.data.countPage.User.pageCount;
//                            for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
//                                if (i < clientsramassage.data.countPage.User.pageCount && i <= 5) {
//                                    var $html = $compile("<button class='btn btn-default' ng-click='showPage(" + i + ")'>" + i + "</button>")($scope);
//                                    $("div#otherPages").append($html);
//                                }
//                            }
//                            if (clientsramassage.data.countPage.User.prevPage == false) {
//                                $("#nextPage").attr('disabled', false);
//                                $("#previousPage").attr('disabled', true);
//                            }
//                            setTimeout(function () {
////                        heightTbody = $("tbody").height();
//                                console.log($("tbody").height());
//                            }, 500);
//                        },
//                                function (msg) {
//                                    alert(msg);
//                                }
//                        );
//                    }
//                }
//            };
//            //advanced search toggle
//            $scope.showAdvancedSearch = function () {
//                $("#listVille").selectize();
//                if ($("#filterSearch").attr('style') === "display: none;") {
//                    $("#listVille option[value='']").attr('selected', 'selected');
//                    $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate(1, 5, searchKey).then(function (clientsramassage) {
//                        $("div#otherPages").html("");
//                        $scope.pageCount = clientsramassage.data.countPage.User.pageCount;
//                        $scope.currentPage = clientsramassage.data.countPage.User.page;
//                        $scope.clientsramassage = clientsramassage.data.clients;
//                        $scope.clientNotAffect = clientsramassage.dataNotAffect;
//                        $scope.countclients = clientsramassage.countclients;
//                        $scope.countcommandes = clientsramassage.countcommandes;
//                        $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
//                        $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
//                        var currentPage = clientsramassage.data.countPage.User.page;
//                        var nbrMaxNextPages = 5;
//                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
//                            if (i < clientsramassage.data.countPage.User.pageCount) {
//                                var $html = $compile("<button class='btn btn-default' ng-click='showPage(" + i + ")'>" + i + "</button>")($scope);
//                                $("div#otherPages").append($html);
//                            }
//                        }
//                        if (clientsramassage.data.countPage.User.prevPage == false) {
//                            $("button#nextPage").attr('disabled', false);
//                            $("button#previousPage").attr('disabled', true);
//                        }
//                    },
//                            function (msg) {
//                                alert(msg);
//                            }
//                    );
//                }
//                $("#filterSearch").toggle('slow');
//            };
//            $scope.filterByVille = function (ville) {
//                var searchKey = $scope.search;
//                $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate(1, 5, searchKey, ville).then(function (clientsramassage) {
//                    $scope.pageCount = clientsramassage.data.countPage.User.pageCount;
//                    $scope.currentPage = clientsramassage.data.countPage.User.page;
//                    $scope.clientsramassage = clientsramassage.data.clients;
//                    $scope.clientNotAffect = clientsramassage.dataNotAffect;
//                    $scope.countclients = clientsramassage.countclients;
//                    $scope.countcommandes = clientsramassage.countcommandes;
//                    $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
//                    $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
//                    var currentPage = clientsramassage.data.countPage.User.page;
//                    var nbrMaxNextPages = 5 + clientsramassage.data.countPage.User.page;
//                    $("div#otherPages").html("");
//                    for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
//                        if (i < clientsramassage.data.countPage.User.pageCount) {
//                            var $html = $compile("<button class='btn btn-default' ng-click='showPage(" + i + ")'>" + i + "</button>")($scope);
//                            $("div#otherPages").append($html);
//                        }
//                    }
//                    if (clientsramassage.data.countPage.User.nextPage == false) {
//                        console.log("LAST PAGE");
//                        $("button#nextPage").attr('disabled', true);
//                        $("button#previousPage").removeAttr('disabled');
//                    } else {
//                        $("button#nextPage").removeAttr('disabled');
//                    }
//                    if (clientsramassage.data.countPage.User.prevPage == false) {
//                        console.log("PAGE ONE");
//                        $("button#nextPage").removeAttr('disabled');
//                        $("button#previousPage").attr('disabled', true);
//                    } else {
//                        $("button#previousPage").removeAttr('disabled');
//                    }
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.firstPage = function () {
//                var searchKey = $scope.search;
//
//                var heightTbody = 0;
//                $("div#otherPages").html("");
//                $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate(1, 5, searchKey).then(function (clientsramassage) {
//                    $scope.clientsramassage = clientsramassage.data.clients;
//                    $scope.pageCount = clientsramassage.data.countPage.User.pageCount;
//                    $scope.currentPage = clientsramassage.data.countPage.User.page;
//                    var currentPage = clientsramassage.data.countPage.User.page;
//                    var nbrMaxNextPages = 5;
//                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
//                        if (i < clientsramassage.data.countPage.User.pageCount) {
//                            var $html = $compile("<button class='btn btn-default' ng-click='showPage(" + i + ")'>" + i + "</button>")($scope);
//                            $("div#otherPages").append($html);
//                        }
//                    }
//                    if (clientsramassage.data.countPage.User.prevPage == false) {
//                        $("button#nextPage").attr('disabled', false);
//                        $("button#previousPage").attr('disabled', true);
//                    }
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.showPage = function (index) {
//                var heightTbody = 0;
//                var searchKey = $scope.search;
//                $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate(index, 5, searchKey).then(function (clientsramassage) {
//                    $scope.clientsramassage = clientsramassage.data.clients;
//
//                    $scope.pageCount = clientsramassage.data.countPage.User.pageCount;
//                    $scope.currentPage = clientsramassage.data.countPage.User.page;
//                    if (clientsramassage.data.countPage.User.prevPage == false) {
//                        $("button#nextPage").attr('disabled', false);
//                        $("button#previousPage").attr('disabled', true);
//                        $("button#currentPage").hide();
//                        $("button#firstPage").show();
//                    }
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.limitPerPage = 5;
//            $scope.CurrentPage = 1;
//            $scope.nextPage = function () {
//                $("button#firstPage").show();
//                var heightTbody = 0;
//                var searchKey = $scope.search;
//                var categorie = $scope.categorie;
//                var fournisseur = $scope.fournisseur;
//                var famille = $scope.famille;
////        $("tbody").height(heightTbody);
//                console.log("Pages Number : " + $scope.pageCount);
//                console.log("Next : " + $scope.CurrentPage);
//                if ($scope.currentPage <= $scope.pageCount) {
//                    $scope.CurrentPage = $scope.CurrentPage + 1;
//                    $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate($scope.CurrentPage, 5, searchKey).then(function (clientsramassage) {
//                        $scope.clientsramassage = clientsramassage.data.clients;
//
//                        $scope.currentPage = clientsramassage.data.countPage.User.page;
//
//                        var currentPage = clientsramassage.data.countPage.User.page;
//                        var nbrMaxNextPages = 5 + clientsramassage.data.countPage.User.page;
//                        $("div#otherPages").html("");
//                        for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
//                            if (i < clientsramassage.data.countPage.User.pageCount) {
//                                var $html = $compile("<button class='btn btn-default' ng-click='showPage(" + i + ")'>" + i + "</button>")($scope);
//                                $("div#otherPages").append($html);
//                            }
//                        }
//                        if (clientsramassage.data.countPage.User.nextPage == false) {
//                            $("button#nextPage").attr('disabled', true);
//                            $("button#previousPage").removeAttr('disabled');
//                        } else {
//                            $("button#nextPage").removeAttr('disabled');
//                        }
//                        if (clientsramassage.data.countPage.User.previousPage == false) {
//                            $("button#previousPage").attr('disabled', true);
//                        } else {
//                            $("button#previousPage").removeAttr('disabled');
//                        }
//                    },
//                            function (msg) {
//                                alert(msg);
//                            }
//                    );
//                }
//            };
//            $scope.previousPage = function () {
//
//                var heightTbody = 0;
//                var searchKey = $scope.search;
//                var categorie = $scope.categorie;
//                var fournisseur = $scope.fournisseur;
//                var famille = $scope.famille;
////        $("tbody").height(heightTbody);
//                if ($scope.currentPage > 1) {
//                    $scope.CurrentPage = $scope.CurrentPage - 1;
//                    $scope.clientsramassage = PostFactory.listClientRamassageDepotPaginate($scope.CurrentPage, 5, searchKey).then(function (clientsramassage) {
//                        $scope.clientsramassage = clientsramassage.data.clients;
//
//                        $scope.currentPage = clientsramassage.data.countPage.User.page;
//                        var currentPage = clientsramassage.data.countPage.User.page;
//                        var nbrMaxNextPages = 5 + clientsramassage.data.countPage.User.page;
//                        $("div#otherPages").html("");
//                        for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
//                            if (i < clientsramassage.data.countPage.User.pageCount) {
//                                var $html = $compile("<button class='btn btn-default' ng-click='showPage(" + i + ")'>" + i + "</button>")($scope);
//                                $("div#otherPages").append($html);
//                            }
//                        }
//                        if (clientsramassage.data.countPage.User.nextPage == false) {
//                            console.log("LAST PAGE");
//                            $("button#nextPage").attr('disabled', true);
//                            $("button#previousPage").removeAttr('disabled');
//                        } else {
//                            $("#nextPage").removeAttr('disabled');
//                        }
//                        if (clientsramassage.data.countPage.User.prevPage == false) {
//                            console.log("PAGE ONE");
//                            $("button#firstPage").hide();
//                            $("button#nextPage").removeAttr('disabled');
//                            $("button#previousPage").attr('disabled', true);
//                        } else {
//                            $("button#previousPage").removeAttr('disabled');
//                        }
//                    },
//                            function (msg) {
//                                alert(msg);
//                            }
//                    );
//                } else {
//                    console.log("PAGE ONE");
//                    $("button#firstPage").hide();
//                    $("#nextPage").removeAttr('disabled');
//                    $("#previousPage").attr('disabled', true);
//                }
//            };
//            // UPDATE SCOPE
//            $scope.update_en_attente_livraison = function () {
//                $scope.commandeseEnattentelivraisonspaceclient = PostFactory.listCommandeEnattenteLivraisonEspaceclient().then(function (commandeseEnattentelivraisonspaceclient) {
//                    $scope.commandeseEnattentelivraisonspaceclient = commandeseEnattentelivraisonspaceclient.data;
//                    $scope.countEnattentelivraison = commandeseEnattentelivraisonspaceclient.count;
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.update_en_attente_ramassage = function () {
//                $scope.commandesespaceclient = PostFactory.listCommandeEspaceclient().then(function (commandesespaceclient) {
//                    $scope.commandesespaceclient = commandesespaceclient;
////                    //console.log(commandesespaceclient);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.update_en_recuperee = function () {
//                // list client in commandes récupérées
//                $scope.clientsrecuperer = PostFactory.listClientRecuperees().then(function (clientsrecuperer) {
//                    $scope.clientsrecuperer = clientsrecuperer.data;
//                    $scope.countRecuperees = clientsrecuperer.count;
//                    $scope.countClientrecup = clientsrecuperer.countclient;
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//                $scope.commandesencoursespaceclient = PostFactory.listCommandeEncoursEspaceclient().then(function (commandesencoursespaceclient) {
//                    $scope.commandesencoursespaceclient = commandesencoursespaceclient;
////                    //console.log(commandesencoursespaceclient);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.update_en_stock = function () {
//                $('#noFocus').blur();
//                setBarcode();
//                setTimeout(function () {
//                    $('#CodeBarre').focus();
//                }, 500);
////                    $('tbody#CommaneInStock').empty();
////                    $scope.commandesenstock = PostFactory.listCommandeEnstocks().then(function (commandesenstock) {
////                        $scope.commandesenstock = commandesenstock;
////                        //console.log(commandesenstock);
////                        setTimeout(function () {
////                            $('#noFocus').blur();
////                        }, 200);
////                    },
////                            function (msg) {
////                                alert(msg);
////                            }
////                    );
//            };
//            // liste commandes ramassage et dépôt 
//            $scope.listramassagedepots = PostFactory.listRamassageDepot().then(function (listramassagedepots) {
//                $scope.listramassagedepots = listramassagedepots;
//                //console.log(listramassagedepots);
//            },
//                    function (msg) {
//                        alert(msg);
//                    }
//            );
//            $scope.update_livraison = function () {
//                // liste commandes livrées
//                $scope.commandeslivrees = PostFactory.listCommandeLivreeEspaceclient().then(function (commandeslivrees) {
//                    $scope.commandeslivrees = commandeslivrees.data;
//                    $scope.countslivree = commandeslivrees.count;
//                    //console.log(commandeslivrees.data);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.update_annulation = function () {
//                // liste commandes annulées
//                $scope.commandesannulees = PostFactory.listCommandeAnnuleeEspaceclient().then(function (commandesannulee) {
//                    //console.log(commandesannulee.data);
//                    $scope.commandesannulee = commandesannulee.data;
//                    $scope.countannulee = commandesannulee.count;
//                    $scope.countannuleefacture = commandesannulee.countfacture;
//                    $scope.countannuleenotfacture = commandesannulee.countnotfacture;
////                    //console.log(commandesannulee);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.update_retour = function () {
//                // liste commandes commandesretours
//                $scope.commandesretours = PostFactory.listCommandeRetoursEspaceclient().then(function (commandesretours) {
//                    $scope.commandesretours = commandesretours.data;
//                    $scope.countsretours = commandesretours.count;
////                    //console.log(commandesretours);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.update_facturees = function () {
//                // liste commandes facturées
//                $scope.commandesfacturees = PostFactory.listCommandeFacturees().then(function (commandesfacturees) {
//                    $scope.commandesfacturees = commandesfacturees.data;
//                    $scope.countcommandesfacturees = commandesfacturees.count;
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
//            $scope.update_retour_expediteur = function () {
//                // liste commandes retournée à l'expediteur
//                $scope.listretoursexpediteur = PostFactory.listRetoursExpediteur().then(function (listretoursexpediteur) {
//                    $scope.listretoursexpediteur = listretoursexpediteur.data;
//                    $scope.countretoursexpediteur = listretoursexpediteur.count;
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//            };
        });
//        .controller("CmdsEnCoursLivraisonController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {
//            $scope.commandeseEnattentelivraisonspaceclient = PostFactory.listCommandeEnattenteLivraisonEspaceclientPaginate().then(function (commandeseEnattentelivraisonspaceclient) {
//                $scope.commandeseEnattentelivraisonspaceclient = commandeseEnattentelivraisonspaceclient.data;
//                $scope.countEnattentelivraison = commandeseEnattentelivraisonspaceclient.data.countPage.Commande.pageCount;
//                $scope.pageCount = commandeseEnattentelivraisonspaceclient.data.countPage.Commande.pageCount;
//            },
//                    function (msg) {
//                        alert(msg);
//                    }
//            );
//        });