angular.module('starter.controllers.caisse', [])
//caisse controller
        .controller("CaisseController", function ($scope, PostFactory, $location, $cookieStore, $cookies,$window) {
            if ($cookieStore.get('sessionConnected')) {
                $('#exportableList').hide();
                $('#EntrepotBlock').show();
                $scope.currentPage = 1;
                $scope.t = 0;
                $scope.pageSize = 12;
                $scope.meals = [];
                $scope.pageChangeHandler = function (num) {
                    ////console.log('going to page ' + num);
                };
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
                $scope.products = PostFactory.listProducts().then(function (products) {
                    $scope.products = products;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                //liste gategorie
                $scope.categories = PostFactory.listCategory().then(function (categories) {
                    $scope.categories = categories;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // liste famille
                $scope.familles = PostFactory.listFamille().then(function (familles) {
                    $scope.familles = familles;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // liste Fournisseur 
                $scope.fournisseurs = PostFactory.listFournisseur().then(function (fournisseurs) {
                    $scope.fournisseurs = fournisseurs;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // add item to panie
                $scope.tab_items_att = [];
                $scope.mettre_attente = function (items_att, nom) {
                    console.log("atttttttttttt");
                    if ($scope.tab_items_att.indexOf({'items_att': items_att, 'nom': nom}) == -1)
                    {
                        $scope.tab_items_att.push({'items_att': items_att, 'nom': nom});
                        $scope.items = [];
                    } else {

                    }
                    $("#nom_item").modal('toggle');

                    console.log($scope.tab_items_att);
                };
                $scope.charger_attente = function (item11) {
                    console.log("charge");
                    $scope.items = [];
                    $scope.items = item11.items_att;
                    var index = $scope.tab_items_att.indexOf(item11);
                    $scope.tab_items_att.splice(index, 1);
                    $("#list_att").modal('toggle');

                    console.log($scope.tab_items_att);
                };

                $scope.items = [];
                $scope.additem = function (Product) {
                    console.log("hereeeeesdsdfsdfds");
                    if ($scope.items.indexOf(Product) == -1)
                    {
                        $scope.items.push(Product);
                    } else {
                        $scope.items[$scope.items.indexOf(Product)].Bon[0].qte++;
                    }
                    console.log($scope.items);
                };
//                $scope.ff = function (index) {
//                    console.log(index);
//                    
//                };
                $scope.input_change = function (index) {
//                    console.log($scope.items[index].Bon[0].qte);
//                    console.log($window.variable_test);
//                    console.log("$scope.items[index].Bon[0].qte");
                    $scope.items[index].Bon[0].qte=$window.variable_test;
                    
                };
                $scope.input_remise = function (index) {
//                    console.log($scope.items[index].Bon[0].remise);
//                    console.log($window.variable_test);
//                    console.log("$scope.items[index].Bon[0].qte");
                    $scope.items[index].Bon[0].remise=$window.variable_test;
                    
                };

$scope.reglements=[];
                $scope.journal_caisse = function (dd, df) {
                    if (dd == undefined)
                        toastr.error("Veuillez ajouter date debut");
                    if (df == undefined)
                        toastr.error("Veuillez ajouter date de fin");

                    var datadate = {
                        date: {
                            date_debut: dd,
                            date_fin: df,
                        }
                    };
                    console.log(datadate);
                    PostFactory.journale_caisse(datadate).then(function (reglements) {
                        $scope.reglements = reglements;
                    }, function (msg) {
                        alert(msg);
                    });
                };
                $scope.totalEspece = function (reg) {
                    
                    var t = 0;
                    for (var i = 0; i < reg.length; i++) {
                        if (reg[i].Reglement.type == "Espèce") {
                            t = t + parseFloat(reg[i].Reglement.value);
                        }
                    }
                    return t;
                };
                $scope.totalCheque = function (reg) {
                    var t = 0;
                    for (var i = 0; i < reg.length; i++) {
                        if (reg[i].Reglement.type == "Chèque") {
                            t = t + parseFloat(reg[i].Reglement.value);
                        }
                    }
                    return t;
                };
                $scope.totalvirement = function (reg) {
                    var t = 0;
                    for (var i = 0; i < reg.length; i++) {
                        if (reg[i].Reglement.type == "virement bancaire") {
                            t = t + parseFloat(reg[i].Reglement.value);
                        }
                    }
                    return t;
                };
                $scope.extractitem = function (Product) {
                    console.log("hereeeeesdsdfsdfds");
                    if ($scope.items.indexOf(Product) == -1)
                    {

                    } else {
                        $scope.items[$scope.items.indexOf(Product)].Bon[0].qte--;
                        if ($scope.items[$scope.items.indexOf(Product)].Bon[0].qte <= 0)
                        {
                            $scope.items[$scope.items.indexOf(Product)].Bon[0].qte = 1;
                            $scope.deleteitem(Product);
                        }
                    }
                    console.log($scope.items);
                };
                $scope.deleteitem = function (Product) {
                    if (confirm("delete item") == true) {
                    var index = $scope.items.indexOf(Product);
                    $scope.items.splice(index, 1);
                    }
                    
                };
                //valide panier    
                $scope.userr;
                $scope.addclient = function (client) {
                    $scope.userr = client;
                    toastr.success("client selectionner");
                    console.log($scope.userr);
                };
                $scope.raz = function () {
                    $scope.userr = undefined;
                    $scope.tab_items_att = [];
                    $scope.items = [];
                    $scope.id_comm = undefined;

                };
                $scope.validePanier = function () {
                    if ($scope.items == "")
                    {
                        toastr.error("Veuillez ajouter produit");
                    }
                    else if ($scope.userr == undefined)
                    {
                        toastr.error("Veuillez ajouter client");
                    }
                    else {
                        var dataCommande = {
                            Bon: $scope.items, Commande: {user_id: $scope.userr.id}
                        };
//                    console.log($scope.userr);
//                    console.log($scope.userr.id);
//                    console.log(dataCommande);
                        $scope.commandesAdd = PostFactory.valide_panier(dataCommande).then(function (commandesAdd) {
                            $scope.commandesAdd = commandesAdd;
                            console.log($scope.commandesAdd);
                            toastr.success("panier valider");
                            //console.log($scope.commandesAdd);
                            $("#space-for-buttons").empty();
                            $("#total_ht").text("0");
                            $("#total_ttc").text("0");
                            $("#remiseglobale").text("0");
                            $("#net_ttc").text("0");
                            $("#space-for-buttons").empty();
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
                $scope.valideLivraison = function () {
                    if ($scope.items == "")
                    {
                        toastr.error("Veuillez ajouter produit");
                    }
                    else if ($scope.userr == undefined)
                    {
                        toastr.error("Veuillez ajouter client");
                    }
                    else {
                        var dataCommande = {
                            Bon: $scope.items, Commande: {user_id: $scope.userr.id}
                        };
//                    console.log($scope.userr);
//                    console.log($scope.userr.id);
//                    console.log(dataCommande);
                        $scope.commandesAdd = PostFactory.valide_Livraison(dataCommande).then(function (commandesAdd) {
                            $scope.commandesAdd = commandesAdd;
                            console.log($scope.commandesAdd);
                            toastr.success("panier valider");
                            //console.log($scope.commandesAdd);
                            $("#space-for-buttons").empty();
                            $("#total_ht").text("0");
                            $("#total_ttc").text("0");
                            $("#remiseglobale").text("0");
                            $("#net_ttc").text("0");
                            $("#space-for-buttons").empty();
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
                $scope.valideDevis = function () {
                    if ($scope.items == "")
                    {
                        toastr.error("Veuillez ajouter produit");
                    }
                    else if ($scope.userr == undefined)
                    {
                        toastr.error("Veuillez ajouter client");
                    }
                    else {
                        var dataCommande = {
                            Bon: $scope.items, Commande: {user_id: $scope.userr.id}
                        };
//                    console.log($scope.userr);
//                    console.log($scope.userr.id);
//                    console.log(dataCommande);
                        $scope.commandesAdd = PostFactory.valide_Devis(dataCommande).then(function (commandesAdd) {
                            $scope.commandesAdd = commandesAdd;
                            console.log($scope.commandesAdd);
                            toastr.success("panier valider");
                            //console.log($scope.commandesAdd);
                            $("#space-for-buttons").empty();
                            $("#total_ht").text("0");
                            $("#total_ttc").text("0");
                            $("#remiseglobale").text("0");
                            $("#net_ttc").text("0");
                            $("#space-for-buttons").empty();
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
                $scope.getTotal = function (it) {
                    var t = 0;
                    for (var i = 0; i < it.length; i++) {
                        t = t + $scope.getTotalTTC($scope.getTtcPrice(it[i].Product.price, it[i].Tva.value), it[i].Bon[0].qte);
                    }
                    return t;
                };

                $scope.getTtcPrice = function (price, tva) {
                    var ttc = price * (1 + (tva / 100));
                    return ttc;
                };
                $scope.getTotalTTC = function (ttc, qte) {
                    var t_ttc = ttc * qte;
                    return t_ttc;
                };
                $scope.id_comm;
                $scope.addparammodal = function (id) {
                    $scope.id_comm = id;
                    $scope.reglement = PostFactory.showReglement(id).then(function (reglement, ttc_reglement) {
                        $scope.reglement = reglement[0].Commandes;
                        var acompte = reglement[0].Commandes.Commande.acompte;
                        $scope.acompte = acompte;
                        $scope.ttc_reglement = parseFloat(reglement[0].Ttc_reglement) + parseFloat(acompte);
                        var ht_total = 0;
                        var ttc_total = 0;
                        console.log(reglement);
                        $(reglement[0].Commandes.Bon).each(function (index, value) {
                            ht_total = ht_total + parseFloat(value.last_unit_price) * value.qte;
                            ttc_total = ttc_total + (parseFloat(value.last_unit_price) * (1 + value.Product.Tva.value / 100) * (1 - value.remise / 100) * value.qte);
                        });
                        $scope.ht_total = ht_total;
//                var total_ttc = total_ht * 1.18;
                        $scope.ttc_total = ttc_total;
                        var reste_regle = parseFloat((ttc_total * (1 - reglement[0].Commandes.Commande.remise_globale / 100)) - reglement[0].Ttc_reglement).toFixed(3);
                        $scope.url_image = base_url() + "assets/pages/img/paye.jpg";
                        $scope.reste_regle = reste_regle;
                        //////console.log(reste_regle);
                        $scope.int_rest_reglement = parseInt(reste_regle);
                        //////console.log(parseInt(reste_regle));
                    });

                    var dataPayment = {
                        Payment: {
                            id: $scope.id_comm
                        }};

                    $scope.paymentsusers = PostFactory.listPaymentsUser(dataPayment).then(function (paymentsusers) {
                        $scope.paymentsusers = paymentsusers.paymentsusers;
                        console.log(paymentsusers);
                        var id = $scope.id_comm;
                        var dataPaymentUser = {
                            Data: [],
                            PaymentList: [],
                            PaymentUser: []
                        };
//                    ////console.log(paymentsusers.user);
                        $(paymentsusers.payments).each(function (i, v) {
                            dataPaymentUser.PaymentList.push(v.Payment.id);
                        });
                        $(paymentsusers.user).each(function (i, v) {
                            dataPaymentUser.PaymentUser.push(v.PaymentsUser.payment_id);
                        });
                        $(paymentsusers.payments).each(function (i, v) {
                            if ($.inArray(v.Payment.id, dataPaymentUser.PaymentUser) !== -1) {
                                dataPaymentUser.Data.push({id: v.Payment.id, name: v.Payment.name, valide: true});
                            } else {
                                dataPaymentUser.Data.push({id: v.Payment.id, name: v.Payment.name, valide: false});
                            }
                        });
                        $scope.PaymentUser = dataPaymentUser.Data;
                        ////console.log(dataPaymentUser.Data);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );

                };

                $scope.passerReglement = function () {
                    var date = $("#date_reglement").val();
                    var date1 = date.split('/')[0];
                    var date2 = date.split('/')[1];
                    var date3 = date.split('/')[2];
                    var date_reglement = date3 + "/" + date2 + "/" + date1;
                    var dataReglement = {
                        Reglement: {
                            type: $("#SelectPayment :selected").text(),
                            numero: $("#refDocument").val(),
                            date: date_reglement,
                            value: $("#refValue").val(),
                            commande_id: $scope.id_comm
                        }
                    };
                    var value_regle = parseFloat($("#refValue").val());
                    var reste_regle = parseFloat($("#reste_reglement").attr('data-value'));
                    $scope.url_image = base_url() + "img/paye.jpg";
                    var reste = parseFloat($("#reste_reglement").attr('data-value'));
                    if ($("#SelectPayment :selected").text() == '') {
                        toastr.error("Veuillez donner le mode paiement");
                    } else if ($("#date_reglement").val() == '') {
                        toastr.error("Veuillez donner la date de règlement");
                    } else if (value_regle > reste || $("#refValue").val() == '') {
                        toastr.error("rectifiez votre règlement");
                    } else {
                        //////console.log(value_regle);
                        //////console.log(reste);
                        $scope.reglement = PostFactory.passerReglement(dataReglement).then(function (reglement) {
                            $scope.reglement = reglement;
                            toastr.success(reglement.text);
                            var id = $scope.id_comm;
                            $scope.reglement = PostFactory.showReglement(id).then(function (reglement, ttc_reglement) {
                                $scope.reglement = reglement[0].Commandes;
                                $scope.ttc_reglement = reglement[0].Ttc_reglement;
                                $scope.reste_regle = reste_regle;
                                $scope.int_rest_reglement = parseInt(reste_regle);
                                //////console.log(parseInt(reste_regle));
                                $scope.url_image = base_url() + "assets/pages/img/paye.jpg";
                                var ht_total = 0;
                                var ttc_total = 0;
                                $(reglement[0].Commandes.Bon).each(function (index, value) {
                                    ht_total = ht_total + parseFloat(value.last_unit_price) * value.qte;
                                    ttc_total = ttc_total + (parseFloat(value.last_unit_price) * (1 + value.Product.Tva.value / 100) * (1 - value.remise / 100) * value.qte);
                                });
                                $scope.ht_total = ht_total;
                                $scope.ttc_total = ttc_total;
                            });
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };

                $scope.clients = PostFactory.listClients().then(function (clients) {
                    $scope.clients = clients;
                    console.log($scope.clients);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // start add client
                $scope.ajoutClient = function ($event) {
                    $event.preventDefault();
                    if ($("#villeValue :selected").val() == '') {
                        var ville_id = 0;
                    } else {
                        ville_id = $("#villeValue :selected").val();
                    }
                    if ($('#EtatClient :selected').val() === '') {
                        var etat_client = 'Normal';
                    } else {
                        etat_client = $('#EtatClient :selected').val();
                    }
                    var nom_commercial = null;
                    if ($("#nom_commercial").val() != '') {
                        nom_commercial = $("#nom_commercial").val();
                    }
                    var raison_social = null;
                    if ($("#raison_social").val() != '') {
                        nom_commercial = $("#raison_social").val();
                    }
                    var type_client = "Particulier";
                    if ($('#TypeClient :selected').val() != '') {
                        type_client = $('#TypeClient :selected').val();
                    }
                    var commercial_id = 0;
                    if ($('#commercialeValue :selected').val() != "") {
                        commercial_id = $('#commercialeValue :selected').val();
                    }
                    var dataClient = {
                        User: {
                            last_name: $("#last_name").val(),
                            first_name: $("#first_name").val(),
                            phone: $("#phone").val(),
                            email: $("#email").val(),
                            adress: $("#adress").val(),
                            postal: $("#postal").val(),
                            ville_id: ville_id,
                            raison_social: raison_social,
                            nom_commercial: nom_commercial,
                            commerciale_id: commercial_id,
                            num_etab: $("#num_etab").val()
                        },
                        Data: []
                    };
                    $("#PaymentUser li input").each(function (index, valeur) {
                        if ($(valeur).is(':checked')) {
                            var payment_id = $(valeur).attr("data-data-id");
                            ////console.log(payment_id);
                            dataClient.Data.push({id: payment_id});
                        }
                    });
                    ////console.log(dataClient.Data);
//                    if ($('#commercialeValue :selected').val() === '') {
//                        toastr.success("Veillez donner le commercial de cet client");
//                    } else {
                    PostFactory.ajoutClient(dataClient).then(function (client) {
                        $scope.client = client;
                        $("#myModal").modal('toggle');
                        PostFactory.listClients().then(function (clients) {
                            $scope.clients = clients;
                            $("#username").val("");
                            $("#last_name").val("");
                            $("#first_name").val("");
                            $("#phone").val("");
                            $("#email").val("");
                            $("#adress").val("");
                            $("#postal").val("");

                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                        toastr.success(client.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                //statistique *********************************

                //generate stats
                $scope.loadTopSeven = PostFactory.loadTopSeven().then(function (stats) {
                    var chart = null;
                    ////console.log(stats);
                    if (stats.top.length !== 0) {
                        chart = new CanvasJS.Chart("chartContainer",
                                {
                                    title: {
                                        text: "Top 7 des produits Vendus vvvvv"
                                    },
                                    animationEnabled: true,
                                    legend: {
                                        verticalAlign: "bottom",
                                        horizontalAlign: "center"
                                    },
                                    data: [
                                        {
                                            indexLabelFontSize: 10,
                                            indexLabelFontFamily: "Monospace",
                                            indexLabelFontColor: "darkgrey",
                                            indexLabelLineColor: "darkgrey",
                                            indexLabelPlacement: "outside",
                                            type: "pie",
                                            showInLegend: true,
                                            toolTipContent: "{y} - <strong>#percent%</strong>",
                                            dataPoints: stats.top
                                        }
                                    ]
                                });
                        chart.render();
                    }
                    var chart2 = null;
                    if (stats.sales.length !== 0) {
                        chart2 = new CanvasJS.Chart("chartContainer2",
                                {
                                    theme: "theme2",
                                    title: {
                                        text: "Vente du Mois HT (" + stats.month + ")",
                                        fontSize: 17,
                                        FontWeight: 100
                                    },
                                    animationEnabled: true,
                                    axisX: {
                                        valueFormatString: "MMM",
                                        interval: 1,
                                        intervalType: "month"
                                    },
                                    axisY: {
                                        includeZero: false
                                    },
                                    data: [
                                        {
                                            type: "line",
                                            //lineThickness: 3,        
                                            dataPoints: stats.sales
                                        }
                                    ]
                                });
                        chart2.render();
                    }

                });
                // revenue mensuel sur vente par mois
                $scope.loadSalesVente = PostFactory.loadSalesVente().then(function (statsvente) {
                    var chart = null;
                    ////console.log(statsvente);
                    if (statsvente.length !== 0) {
                        var chart = new CanvasJS.Chart("chartContainerVente",
                                {
                                    animationEnabled: true,
                                    title: {
                                        text: "Statistique de vente/mois"
                                    },
                                    data: [
                                        {
                                            type: "column", //change type to bar, line, area, pie, etc
                                            dataPoints: statsvente
                                        }
                                    ]
                                });
                        chart.render();
                    }
                });
                // revenue mensuel sur vente par client
                $scope.loadSalesVenteClient = PostFactory.loadSalesVenteClient().then(function (statsventeclient) {
//                    var chart = null;
                    //console.log(statsventeclient);
                    if (statsventeclient.length !== 0) {
                        var chart = new CanvasJS.Chart("chartContainerVenteClient",
                                {
                                    title: {
                                        text: "Top 7 ventes client"
                                    },
                                    animationEnabled: true,
                                    legend: {
                                        verticalAlign: "bottom",
                                        horizontalAlign: "center"
                                    },
                                    data: [
                                        {
                                            indexLabelFontSize: 20,
                                            indexLabelFontFamily: "Monospace",
                                            indexLabelFontColor: "darkgrey",
                                            indexLabelLineColor: "darkgrey",
                                            indexLabelPlacement: "outside",
                                            type: "pie",
                                            showInLegend: true,
                                            toolTipContent: "{y} - <strong>#percent%</strong>",
                                            dataPoints: statsventeclient
                                        }
                                    ]
                                });
                        chart.render();
                    }
                });
                // revenue mensuel des achats par fournisseur
                $scope.loadSalesAchats = PostFactory.loadSalesAchat().then(function (statsachats) {
//                    var chart = null;
                    ////console.log(statsachats);
                    if (statsachats.length !== 0) {
                        var chart = new CanvasJS.Chart("chartContainerAchat",
                                {
                                    title: {
                                        text: "Statistique des achats/fournisseur",
//                                        fontFamily: "arial black"
//                                        fontSize: 17,
                                        FontWeight: 100
                                    },
                                    animationEnabled: true,
                                    legend: {
                                        verticalAlign: "bottom",
                                        horizontalAlign: "center"
                                    },
                                    theme: "theme1",
                                    data: [
                                        {
                                            type: "pie",
                                            indexLabelFontFamily: "Garamond",
                                            indexLabelFontSize: 16,
//                                            indexLabelFontWeight: "normal",
                                            startAngle: 0,
                                            indexLabelFontColor: "MistyRose",
                                            indexLabelLineColor: "darkgrey",
                                            indexLabelPlacement: "inside",
                                            toolTipContent: "{name}: {y} TND",
                                            showInLegend: true,
                                            indexLabel: "#percent%",
                                            dataPoints: statsachats
                                        }
                                    ]
                                });
                        chart.render();
                    }
                });
                // mouvement de stock
                $scope.loadSalesStock = PostFactory.loadSalesStock().then(function (statsstocks) {
//                    var chart = null;
                    ////console.log(statsstocks);
                    if (statsstocks.length !== 0) {
                        var chart = new CanvasJS.Chart("chartContainerStock",
                                {
                                    title: {
                                        text: "Mouvement de Stock",
//                                        fontFamily: "arial black"
//                                        fontSize: 17,
                                        FontWeight: 100
                                    },
                                    animationEnabled: true,
                                    legend: {
                                        verticalAlign: "bottom",
                                        horizontalAlign: "center"
                                    },
                                    theme: "theme1",
                                    data: [
                                        {
                                            type: "pie",
                                            indexLabelFontFamily: "Garamond",
                                            indexLabelFontSize: 16,
//                                            indexLabelFontWeight: "normal",
                                            startAngle: 0,
                                            indexLabelFontColor: "MistyRose",
                                            indexLabelLineColor: "darkgrey",
                                            indexLabelPlacement: "inside",
                                            toolTipContent: "{name}: {y} TND",
                                            showInLegend: true,
                                            indexLabel: "#percent%",
                                            dataPoints: statsstocks
                                        }
                                    ]
                                });
                        chart.render();
                    }
                });
                $scope.ReloadSales = function ($event) {
                    $event.preventDefault();
                    //generate stats
                    var first_date = new Date($("#DateDebut").val() + " 00:00:00");
                    var last_date = new Date($("#DateFin").val() + " 23:59:59");
                    var dataInterval = {
                        Facture: {
                            first_date: first_date,
                            last_date: last_date
                        }
                    };
                    $scope.loadTopSeven = PostFactory.loadTopSeven().then(function (stats) {
                        var chart = null;
                        ////console.log(stats);
                        if (stats.top.length !== 0) {
                            chart = new CanvasJS.Chart("chartContainer",
                                    {
                                        title: {
                                            text: "Top 7 des produits Vendus"
                                        },
                                        animationEnabled: true,
                                        legend: {
                                            verticalAlign: "bottom",
                                            horizontalAlign: "center"
                                        },
                                        data: [
                                            {
                                                indexLabelFontSize: 10,
                                                indexLabelFontFamily: "Monospace",
                                                indexLabelFontColor: "darkgrey",
                                                indexLabelLineColor: "darkgrey",
                                                indexLabelPlacement: "outside",
                                                type: "pie",
                                                showInLegend: true,
                                                toolTipContent: "{y} - <strong>#percent%</strong>",
                                                dataPoints: stats.top
                                            }
                                        ]
                                    });
                            chart.render();
                        }
                        var chart2 = null;
                        if (stats.sales.length !== 0) {
                            chart2 = new CanvasJS.Chart("chartContainer2",
                                    {
                                        theme: "theme2",
                                        title: {
                                            text: "Vente du Mois HT (" + stats.month + ")",
                                            fontSize: 17,
                                            FontWeight: 100
                                        },
                                        animationEnabled: true,
                                        axisX: {
                                            valueFormatString: "MMM",
                                            interval: 1,
                                            intervalType: "month"
                                        },
                                        axisY: {
                                            includeZero: false
                                        },
                                        data: [
                                            {
                                                type: "line",
                                                //lineThickness: 3,        
                                                dataPoints: stats.sales
                                            }
                                        ]
                                    });
                            chart2.render();
                        }

                    });
                    // revenue mensuel sur vente par mois
                    $scope.loadSalesVente = PostFactory.loadSalesVente().then(function (statsvente) {
                        var chart = null;
                        ////console.log(statsvente);
                        if (statsvente.length !== 0) {
                            var chart = new CanvasJS.Chart("chartContainerVente",
                                    {
                                        animationEnabled: true,
                                        title: {
                                            text: "Statistique de vente/mois"
                                        },
                                        data: [
                                            {
                                                type: "column", //change type to bar, line, area, pie, etc
                                                dataPoints: statsvente
                                            }
                                        ]
                                    });
                            chart.render();
                        }
                    });
                    // revenue mensuel sur vente par client
                    $scope.loadSalesVenteClient = PostFactory.loadSalesVenteClient(dataInterval).then(function (statsventeclient) {
//                    var chart = null;
                        ////console.log(statsventeclient);
                        if (statsventeclient.length !== 0) {
                            var chart = new CanvasJS.Chart("chartContainerVenteClient",
                                    {
                                        title: {
                                            text: "Top 7 ventes client"
                                        },
                                        animationEnabled: true,
                                        legend: {
                                            verticalAlign: "bottom",
                                            horizontalAlign: "center"
                                        },
                                        data: [
                                            {
                                                indexLabelFontSize: 20,
                                                indexLabelFontFamily: "Monospace",
                                                indexLabelFontColor: "darkgrey",
                                                indexLabelLineColor: "darkgrey",
                                                indexLabelPlacement: "outside",
                                                type: "pie",
                                                showInLegend: true,
                                                toolTipContent: "{y} - <strong>#percent%</strong>",
                                                dataPoints: statsventeclient
                                            }
                                        ]
                                    });
                            chart.render();
                        } else {
                            $("#chartContainerVenteClient").html('<div class="alert alert-info" style="text-align: center;position: relative;top: 40%;" role="alert">Statistique non disponible</div>')
                        }
                    });
                    // revenue mensuel des achats par fournisseur
                    $scope.loadSalesAchats = PostFactory.loadSalesAchat(dataInterval).then(function (statsachats) {
//                    var chart = null;
                        ////console.log(statsachats);
                        if (statsachats.length !== 0) {
                            var chart = new CanvasJS.Chart("chartContainerAchat",
                                    {
                                        title: {
                                            text: "Statistique des achats/fournisseur",
//                                        fontFamily: "arial black"
//                                        fontSize: 17,
                                            FontWeight: 100
                                        },
                                        animationEnabled: true,
                                        legend: {
                                            verticalAlign: "bottom",
                                            horizontalAlign: "center"
                                        },
                                        theme: "theme1",
                                        data: [
                                            {
                                                type: "pie",
                                                indexLabelFontFamily: "Garamond",
                                                indexLabelFontSize: 16,
//                                            indexLabelFontWeight: "normal",
                                                startAngle: 0,
                                                indexLabelFontColor: "MistyRose",
                                                indexLabelLineColor: "darkgrey",
                                                indexLabelPlacement: "inside",
                                                toolTipContent: "{name}: {y} TND",
                                                showInLegend: true,
                                                indexLabel: "#percent%",
                                                dataPoints: statsachats
                                            }
                                        ]
                                    });
                            chart.render();
                        } else {
                            $("#chartContainerAchat").html('<div class="alert alert-info" style="text-align: center;position: relative;top: 40%;" role="alert">Statistique non disponible</div>')
                        }
                    });
                    // mouvement de stock
                    $scope.loadSalesStock = PostFactory.loadSalesStock().then(function (statsstocks) {
//                    var chart = null;
                        ////console.log(statsstocks);
                        if (statsstocks.length !== 0) {
                            var chart = new CanvasJS.Chart("chartContainerStock",
                                    {
                                        title: {
                                            text: "Mouvement de Stock",
//                                        fontFamily: "arial black"
//                                        fontSize: 17,
                                            FontWeight: 100
                                        },
                                        animationEnabled: true,
                                        legend: {
                                            verticalAlign: "bottom",
                                            horizontalAlign: "center"
                                        },
                                        theme: "theme1",
                                        data: [
                                            {
                                                type: "pie",
                                                indexLabelFontFamily: "Garamond",
                                                indexLabelFontSize: 16,
//                                            indexLabelFontWeight: "normal",
                                                startAngle: 0,
                                                indexLabelFontColor: "MistyRose",
                                                indexLabelLineColor: "darkgrey",
                                                indexLabelPlacement: "inside",
                                                toolTipContent: "{name}: {y} TND",
                                                showInLegend: true,
                                                indexLabel: "#percent%",
                                                dataPoints: statsstocks
                                            }
                                        ]
                                    });
                            chart.render();
                        }
                    });

                };

                // end statistique ************************
                $scope.remiseByProduct = "0";
                $scope.remiseGlobal = "0";
                $scope.passerDevis = function ($event) {
                    $event.preventDefault();
                    var dataCommande = {
                        Commande: {
                            remise_globale: $("#RemiseGlob").val(),
                            object: $("#Object").val(),
                            validate: $("#Validation").val(),
                            pourcentage: $("#Pourcentage").val(),
                            user_id: $("#SelectUser :selected").val(),
                            commerciale_id: $("#SelectUser :selected").attr('data-commerciale')
                        },
                        Bon: [],
                        Notification: []
                    };
                    $('tr#itemProduct').each(function (i, v) {
                        dataCommande.Bon.push({
                            product_id: parseInt($(v).attr('data-data-id')),
                            last_unit_price: parseFloat($(v).children().eq(2).text()),
                            qte: $(v).children().eq(4).text(),
                            remise: $(v).children().eq(5).text()
                        });
                        //                        if ($.trim($(v).children().eq(8).attr('data-lvl')) !== undefined || $.trim($(v).children().eq(8).attr('data-lvl')) !== "" || $.trim($(v).children().eq(8).attr('data-lvl')) !== null) {
                        //                        if ($(v).children().eq(8).attr('data-lvl') !== undefined || $(v).children().eq(8).attr('data-lvl') !== "" || $(v).children().eq(8).attr('data-lvl') !== null) {
                        if ($(v).children().eq(8).attr('data-lvl') === "error" || $(v).children().eq(8).attr('data-lvl') === "warning") {
                            dataCommande.Notification.push({
                                product_id: parseInt($(v).attr('data-data-id')),
                                msg: $(v).children().eq(8).attr('data-msg'),
                                lvl: $(v).children().eq(8).attr('data-lvl')
                            });
                        }
                    });
                    if ($("#SelectUser :selected").val() === "") {
                        toastr.error("Veuillez Saisir un Client...");
                    } else if ($("#Object").val() === "") {
                        toastr.error("Veuillez Saisir un Objet...");
                    } else if ($("#Validation").val() === "") {
                        toastr.error("Veuillez Saisir une Validité...");
                    } else if ($("#Pourcentage").val() === "") {
                        toastr.error("Veuillez Saisir une Modalité...");
                    } else {
                        $scope.commandesAdd = PostFactory.passerDevis(dataCommande).then(function (commandesAdd) {
                            $scope.commandesAdd = commandesAdd;
                            $("#total_ht").text("0");
                            $("#total_ttc").text("0");
                            $("#remiseglobale").text("0");
                            $("#net_ttc").text("0");
                            $("#Object").text("");
                            $("#space-for-buttons").empty();
                            toastr.success(commandesAdd.text);
                            $("#devis").modal('toggle');
                            $location.path('/app-caisse');
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
                //                $scope.productsfamille = null;
                $scope.changeFamilleIDCaisse = function () {
                    var id = $scope.familleID;
                    console.log(id);
                    var dataProduct = {
                        Product: {
                            id: $("#familleValue :selected").val()
                        }};
                    PostFactory.listProductsFamille(dataProduct).then(function (productsfamille) {
                        $scope.productsfamilles = productsfamille;
                        console.log(productsfamille);
                    }, function (msg) {
                        alert(msg);
                    });
                };
            } else {
                $location.path('/login');
            }
        })
        ;