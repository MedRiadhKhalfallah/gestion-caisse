angular.module('starter.directives', [])
        .directive("myCurrentTime", function (dateFilter) {
            return function (scope, element, attrs) {
                var format;
                scope.$watch(attrs.myCurrentTime, function (value) {
                    format = value.format;
                    updateTime(value.date);
                });
                function updateTime(dateToFormat) {
//                    ////console.log(dateToFormat);
                    var dt = null;
                    if (dateToFormat == null || dateToFormat == undefined) {
                        dt = dateFilter(new Date(), format)
                    } else {
                        dt = dateFilter(new Date(dateToFormat), format)
                    }
                    element.text(dt);
                }
            }
        })
        .directive("addbuttonsbutton", function () {
            return {
                restrict: "E",
                template: "<i addbuttons id='addProfile' class='glyphicon glyphicon-plus btn btn-info btn-sm btn-embossed icon' style='width: 35px !important;height: 25px !important;'></i>"
            }
        })
//Directive for adding buttons on click that show an alert on click
        .directive("addbuttons", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
                    element.bind("click", function () {
                        var tableLength = $("tbody#space-for-buttons tr").length;
                        var remise = 1 - $("#Remise").val() / 100;
                        var total_ht = $("#PU").val() * remise * $("#Qte").val();
                        var total_ttc = parseFloat($("#ttc").val()) * remise * $("#Qte").val();
                        var ht = $("#PU").val() * remise;
                        var ttc = parseFloat($("#ttc").val()) * remise;
                        var total_net_ttc = parseFloat(total_ttc) * (1 - $("#RemiseGlob").val() / 100);
//                            $("input#Set_Remise[data-focus='1']").attr('data-focus', 0);
                        var qte = $("#Qte").val();
                        var qteInt = parseInt($("#Qte").val());
                        if (qteInt == 0 || qte == "") {
                            toastr.error('Veuillez donner une QTE');
                        }
                        if (qte > 0) {
                            if ($("#SelectNewTva").is(":visible") == true) {
//                                scope.ajoutProduct = function ($event) {
//                                    $event.preventDefault();
                                var dataProduct = {
                                    Product: {
                                        name: $(".custom-combobox-input").val(),
                                        price: $("#PU").val(),
                                        marge: 0,
                                        prix_achat: $("#PU").val(),
                                        ref: $("#NewRef").val(),
                                        tva_id: $('#NewTva :selected').val(),
                                        fournisseur_id: $('#NewFournisseur :selected').val(),
                                        famille_id: $('#NewFamille :selected').val(),
                                        category_id: $('#NewCategory :selected').val()
                                    }
                                };
                                scope.product = PostFactory.ajoutProduct(dataProduct).then(function (product) {
                                    scope.product = product;
                                    setTimeout(function () {
                                        angular.element(document.getElementById('space-for-buttons')).append($compile("<tr data-bon='0' data-data-id='" + product.LastId + "' id='itemProduct'>\n\
                                                                                <td>" + $("#NewRef").val() + "</td>\n\
                                                                                <td>" + $(".custom-combobox-input").val() + "</td>\n\
                                                                                <td data-ht='" + parseFloat($("#PU").val()) + "'>" + parseFloat($("#PU").val()).toFixed(3) + "</td>\n\
                                                                                <td data-ttc='" + parseFloat($("#ttc").val()) + "'>" + parseFloat($("#ttc").val()).toFixed(3) + "</td>\n\
                                                                                <td id='ModifQte'>" + $("#Qte").val() + "</td>\n\
                                                                                <td id='ModifRemise'>" + $("#Remise").val() + "</td>\n\
                                                                                <td data-ht='" + total_ht.toFixed(3) + "'>" + total_ht.toFixed(3) + "</td>\n\
                                                                                <td data-ttc='" + total_ttc.toFixed(3) + "'>" + total_ttc.toFixed(3) + "</td>\n\\n\
                                                                                <td>0</td>\n\
                                                                                <td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td>\n\
                                                                                </tr>")(scope));
                                        $("#SelectNewTva").hide();
                                        $("#NewRef").hide();
                                        $("#Qte").val("");
                                        $("input#PU").val("");
                                        $("input#ttc").val("");
                                        $(".custom-combobox-input").val("");
                                        $("input#Remise").val("0");
                                    }, 500);
                                },
                                        function (msg) {
                                            alert(msg);
                                        });
//                                };
//                                setTimeout(function () {

//                                }, 500);
                            } else {
                                if ($(".custom-combobox-input").val() == "") {
                                    toastr.error('Veuillez choisir un produit');
                                } else if ($("#Remise").val() == "") {
                                    toastr.error('Veuillez donner une remise');
                                } else if ($("#PU").val() == "") {
                                    toastr.error('Veuillez donner le prix ht de cette produit');
                                } else if ($("#ttc").val() == "") {
                                    toastr.error('Veuillez donner le prix ttc de cette produit');
                                } else {
//                                var entree_stock = parseFloat($('#combobox :selected').attr('data-stock-entree'));
//                                var sortie_stock = parseFloat($('#combobox :selected').attr('data-stock-sortie'));
//                                var stock_total = entree_stock - sortie_stock;
                                    var dataHT = $("#PU").val();
                                    if ($.trim($(".custom-combobox-input").val()) == "Main d'oeuvre") {
                                        dataHT = 0;
                                    }
                                    var jsonStr = $('#combobox :selected').attr('data-stock-entree');
                                    var obj = $.parseJSON(jsonStr);
                                    console.log(obj);
                                    var entree_stock = 0;
                                    var sortie_stock = 0;
                                    $(obj).each(function (i, v) {
                                        entree_stock = entree_stock + parseFloat(v[0].qte);
                                        sortie_stock = sortie_stock + parseFloat(v.qte_out);
                                    });
                                    var stock_total = entree_stock - sortie_stock;
                                    var countTable = parseInt($("#space-for-buttons tr").length);
                                    angular.element(document.getElementById('space-for-buttons')).append($compile("<tr data-bon='0' data-achat='" + $('#combobox :selected').attr('data-achat') + "' data-marge='" + $('#combobox :selected').attr('data-marge') + "' data-priceprod='" + $('#combobox :selected').val() + "'  data-data-id='" + $('#combobox :selected').attr('data-id') + "' id='itemProduct'>\n\
                                                                        <td>" + $('#combobox :selected').attr('data-ref') + "</td>\n\
                                                                        <td>" + $(".custom-combobox-input").val() + "</td>\n\
                                                                        <td data-ht='" + parseFloat($("#PU").val()) + "' data-ht-indicateur='" + dataHT + "'>" + parseFloat($("#PU").val()).toFixed(3) + "</td>\n\
                                                                        <td data-ttc='" + parseFloat($("#ttc").val()) + "' data-tva='" + $('#combobox :selected').attr('data-tva') + "'>" + parseFloat($("#ttc").val()).toFixed(3) + "</td>\n\
                                                                        <td id='ModifQte'>" + $("#Qte").val() + "</td>\n\
                                                                        <td id='ModifRemise'>" + $("#Remise").val() + "</td>\n\
                                                                        <td data-ht='" + total_ht.toFixed(3) + "'>" + total_ht.toFixed(3) + "</td>\n\
                                                                        <td data-ttc='" + total_ttc.toFixed(3) + "'>" + total_ttc.toFixed(3) + "</td>\n\
                                                                        <td data-index='" + countTable + "' id='currentStock'>" + stock_total + "</td>\n\
                                                                        <td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td>\n\
                                                                        </tr>")(scope));
                                    $("#Qte").val("");
                                    scope.qte = "";
                                    $("input#PU").val("");
                                    $("input#ttc").val("");
                                    $(".custom-combobox-input").val("");
                                    $("input#Remise").val("0");
                                    colorStock();
                                }
                            }
                            setTimeout(function () {
                                totalDevis();
                            }, 500);
                        }
                        setTimeout(function () {
                            $(".Qte" + tableLength).val("1");
                            $(".Rse" + tableLength).val("0");
                        }, 300);
                    });
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.changeMarge = function () {
                        setTimeout(function () {
                            var price_achat = parseFloat($("#NewPrixAchat").val());
                            var marge = parseFloat($("#NewMarge").val());
                            var price_unit_float = parseFloat(price_achat * (1 + marge / 100));
                            var price_unit = parseFloat(price_achat * (1 + marge / 100)).toFixed(3);
                            $("#PU").val(price_unit);
                            var ttc = price_unit_float * (1 + parseFloat($("#NewTva :selected").attr('data-tva') / 100));
//                            ////console.log(ttc);
                            $("#ttc").val(ttc.toFixed(3));
                        }, 300);
                    };
                }
            };
//            }
        })
//Directive for adding buttons on click that show an alert on click
        .directive("customSelect", function () {
            return {
                restrict: "E",
                template: '<select style="height: 40px;" ng-model="selectedName" id="SelectClient">\n\
                            <option ng-repeat="product in products" value="{{product.Product.id}}">{{product.Product.name}}</option>\n\
                        </select>'
            };
        })
        .directive("customSelect", function ($compile) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
//                scope.clients = dataFactory.listClients(attrs.clients);
                    element.bind("change", function () {
                        $('#refProduit').val(product.Product.price);
                        if ($("#SelectClient :selected").text() === "") {
                            toastr.success('Veuillez choisir un client');
                        } else {
                            var user_id = $("#SelectClient :selected").val();
                            $("tbody#space-for-commande").empty();
                            $(scope.filters).each(function (index, value) {
                                if (value.Commande.user_id === user_id) {
                                    angular.element(document.getElementById('space-for-commande')).append($compile("<tr>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + $("#SelectClient :selected").text() + "</td>\n\
                                                <td>" + value.Commercial.first_name + " " + value.Commercial.last_name + "</td>\n\
                                                <td>" + value.Commande.created + "</td>\n\
                                                <td>" + value.Commande.modified + "</td>\n\
                                                <td><div ng-click='showReglement(" + value.Commande.id + ")'><a href='#/reglement/" + value.Commande.id + " '  class='btn btn-success btn-sm'>Reglement</a></div></td>\n\
                                                </tr>")(scope));
                                }

                            });
                        }
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    var dataCommerciale = {
                        Commande: {
                            commerciale_id: $("#menuBarAccount").attr('data-com'),
                            user_id: $("#SelectClient :selected").val(),
                            role: $("#menuBarAccount").attr('data-usertype')
                        }
                    };
                    if ($("#SelectNewTva").is(":visible") == true) {

                    }
                    $scope.products = PostFactory.listProducts().then(function (products) {
                        $scope.products = products;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    setTimeout(function () {
                        $scope.filters = PostFactory.listCommandesFilter(dataCommerciale).then(function (filters) {
                            $scope.filters = filters;
                            ////console.log(filters);
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
//                        }

                    }, 300);
                }
            }
        })
        .directive("addbuttonsfacture", function () {
            return {
                restrict: "E",
                template: "<i addfacture id='addProfile' class='glyphicon glyphicon-plus btn btn-info btn-sm btn-embossed icon' style='width: 35px !important;height: 25px !important;'></i>"
            };
        })
        //Directive for adding buttons on click that show an alert on click
        .directive("addfacture", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
                    element.bind("click", function () {
                        var tableLength = $("tbody#space-for-buttons tr").length;
                        var remise = 1 - $("#Remise").val() / 100;
                        var total_ht = $("#PU").val() * remise * $("#Qte").val();
                        var total_ttc = parseFloat($("#ttc").val()) * remise * $("#Qte").val();
                        var ht = $("#PU").val() * remise;
                        var ttc = parseFloat($("#ttc").val()) * remise;
                        var total_net_ttc = parseFloat(total_ttc) * (1 - $("#RemiseGlob").val() / 100);
//                            $("input#Set_Remise[data-focus='1']").attr('data-focus', 0);
                        var qte = $("#Qte").val();
                        var qteInt = parseInt($("#Qte").val());
                        if (qteInt == 0 || qte == "") {
                            toastr.error('Veuillez donner une QTE');
                        }
                        if (qte > 0) {
                            if ($(".custom-combobox-input").val() == "") {
                                toastr.error('Veuillez choisir un produit');
                            } else if ($("#Remise").val() == "") {
                                toastr.error('Veuillez donner une remise');
                            } else if ($("#PU").val() == "") {
                                toastr.error('Veuillez donner le prix ht de cette produit');
                            } else if ($("#ttc").val() == "") {
                                toastr.error('Veuillez donner le prix ttc de cette produit');
                            } else {
//                                var entree_stock = parseFloat($('#combobox :selected').attr('data-stock-entree'));
//                                var sortie_stock = parseFloat($('#combobox :selected').attr('data-stock-sortie'));
//                                var stock_total = entree_stock - sortie_stock;
                                var dataHT = $("#PU").val();
                                if ($.trim($(".custom-combobox-input").val()) == "Main d'oeuvre") {
                                    dataHT = 0;
                                }
                                var jsonStr = $('#combobox :selected').attr('data-stock-entree');
                                var obj = $.parseJSON(jsonStr);
                                console.log(obj);
                                angular.element(document.getElementById('space-for-buttons')).append($compile("<tr data-bon='0' data-achat='" + $('#combobox :selected').attr('data-achat') + "' data-marge='" + $('#combobox :selected').attr('data-marge') + "' data-priceprod='" + $('#combobox :selected').val() + "'  data-data-id='" + $('#combobox :selected').attr('data-id') + "' id='itemProduct'>\n\
                                                                        <td>" + $('#combobox :selected').attr('data-ref') + "</td>\n\
                                                                        <td>" + $(".custom-combobox-input").val() + "</td>\n\
                                                                        <td data-ht='" + parseFloat($("#PU").val()) + "' data-ht-indicateur='" + dataHT + "'>" + parseFloat($("#PU").val()).toFixed(3) + "</td>\n\
                                                                        <td data-ttc='" + parseFloat($("#ttc").val()) + "' data-tva='" + $('#combobox :selected').attr('data-tva') + "'>" + parseFloat($("#ttc").val()).toFixed(3) + "</td>\n\
                                                                        <td id='ModifQte'>" + $("#Qte").val() + "</td>\n\
                                                                        <td id='ModifRemise'>" + $("#Remise").val() + "</td>\n\
                                                                        <td data-ht='" + total_ht.toFixed(3) + "'>" + total_ht.toFixed(3) + "</td>\n\
                                                                        <td data-ttc='" + total_ttc.toFixed(3) + "'>" + total_ttc.toFixed(3) + "</td>\n\
                                                                        <td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td>\n\
                                                                        </tr>")(scope));
                                $("#Qte").val("");
                                scope.qte = "";
                                $("input#PU").val("");
                                $("input#ttc").val("");
                                $(".custom-combobox-input").val("");
                                $("input#Remise").val("0");
                            }
                            setTimeout(function () {
                                totalDevis();
                            }, 500);
                        }
                        setTimeout(function () {
                            $(".Qte" + tableLength).val("1");
                            $(".Rse" + tableLength).val("0");
                        }, 300);
                    });
                },
//                controller: function ($scope, PostFactory, $element) {
//                    $scope.remiseglobale = function () {
//                        totalDevis();
//                    };
//                }
            };
        })
//        .directive("addfacture", function ($compile, PostFactory) {
//            return function (scope, element, attrs) {
////                require: 'ngChange',
//                element.bind("click", function () {
//                    var qte = $("#Qte").val();
////                    ////console.log(qte);
//                    var qteInt = parseInt($("#Qte").val());
//                    if ($(".custom-combobox-input").val() == "") {
//                        toastr.success('Veuillez choisir un produit');
//                    }
//                    if (qteInt == 0 || qte == "") {
//                        toastr.success('Veuillez donner une QTE');
//                    }
//                    if (qte > 0 && $(".custom-combobox-input").val() != "") {
//                        angular.element(document.getElementById('facture-produit')).append($compile("<tr data-id='" + $("#combobox :selected").val() + "' data-price='" + $("#combobox :selected").attr('data-price') + "' id='itemFactureProduct'>\n\
//                                <td style='text-align: left !important;'>" + $.trim($("#combobox :selected").text()) + "</td>\n\
//                                <td style='text-align: left !important;'>" + $("#Qte").val() + "</td>\n\
//                                <td style='text-align: left !important;'>" + $("#Remise").val() + "</td>\n\
//                                <td style='text-align: left !important;'><div id='deleteItem' ng-click='removeItem()'><i style='color: #34aadc;cursor: pointer;' class='fa fa-times fa-2x'></i></div></td>\n\
//                                </tr>")(scope));
//                        $("#Qte").val("");
//                        $(".custom-combobox-input").val("");
////                        }
//                    }
//                });
//            };
//        })

        .directive("addbuttonsfactureachat", function () {
            return {
                restrict: "E",
                template: "<i addfactureachat id='addProfileAchat' class='glyphicon glyphicon-plus btn btn-info btn-sm btn-embossed icon'  style='width: 35px !important;height: 25px !important;'></i>"
            }
        })
        //Directive for adding buttons on click that show an alert on click
        .directive("addfactureachat", function ($compile, PostFactory) {
            return function (scope, element, attrs) {
//                require: 'ngChange',
                element.bind("click", function () {
                    var qte = $("#Qte").val();
//                    ////console.log(qte);
                    var qteInt = parseInt($("#Qte").val());
                    if ($(".custom-combobox-input").val() == "") {
                        toastr.success('Veuillez choisir un produit');
                    }
                    if (qteInt == 0 || qte == "") {
                        toastr.success('Veuillez donner une QTE');
                    }
                    if (qte > 0 && $(".custom-combobox-input").val() != "") {
                        if ($("#SelectNewTva").is(":visible") == true) {
//                                scope.ajoutProduct = function ($event) {
//                                    $event.preventDefault();
                            var dataProduct = {
                                Product: {
                                    name: $(".custom-combobox-input").val(),
                                    price: $("#NewPrixUnit").val(),
                                    marge: 0,
                                    prix_achat: $("#Prix_Achat").val(),
                                    ref: $("#NewRef").val(),
                                    tva_id: $('#NewTva :selected').val(),
                                    fournisseur_id: $('#NewFournisseur :selected').val(),
                                    famille_id: $('#NewFamille :selected').val(),
                                    category_id: $('#NewCategory :selected').val()
                                }
                            };
                            scope.product = PostFactory.ajoutProduct(dataProduct).then(function (product) {
                                scope.product = product;
                                setTimeout(function () {
                                    angular.element(document.getElementById('facture-produit')).append($compile("<tr data-id='" + product.LastId + "' data-price='" + $("#NewPrixUnit").val() + "' id='itemFactureProduct'>\n\
                                        <td style='text-align: left !important;'>" + $.trim($(".custom-combobox-input").val()) + "</td>\n\
                                        <td style='text-align: left !important;'>" + $("#Prix_Achat").val() + "</td>\n\
                                        <td style='text-align: left !important;'>" + $("#Qte").val() + "</td>\n\
                                        <td style='text-align: left !important;'>" + $("#Remise").val() + "</td>\n\
                                        <td style='text-align: left !important;'><div id='deleteItem' ng-click='removeItem()'><i style='color: #34aadc;cursor: pointer;' class='fa fa-times fa-2x'></i></div></td>\n\
                                        </tr>")(scope));
                                    $("#SelectNewTva").hide();
                                    $("#Qte").val("");
                                    $(".custom-combobox-input").val("");
                                }, 500);
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
//                                };
//                                setTimeout(function () {

//                                }, 500);
                        } else {
                            angular.element(document.getElementById('facture-produit')).append($compile("<tr data-id='" + $("#combobox :selected").val() + "' data-price='" + $("#combobox :selected").attr('data-price') + "' id='itemFactureProduct'>\n\
                                <td style='text-align: left !important;'>" + $.trim($("#combobox :selected").text()) + "</td>\n\
                                <td style='text-align: left !important;'>" + $("#Prix_Achat").val() + "</td>\n\
                                <td style='text-align: left !important;'>" + $("#Qte").val() + "</td>\n\
                                <td style='text-align: left !important;'>" + $("#Remise").val() + "</td>\n\
                                <td style='text-align: left !important;'><div id='deleteItem' ng-click='removeItem()'><i style='color: #34aadc;cursor: pointer;' class='fa fa-times fa-2x'></i></div></td>\n\
                                </tr>")(scope));
                            $("#Qte").val("");
                            $(".custom-combobox-input").val("");
                        }
                    }
                });
            };
        })
        //Solde client
        .directive("customSelect1", function () {
            return {
                restrict: "E",
                template: '<select selectclient class="form-control input-xlarge select2me col-sm-12" data-placeholder="Select Client..." style="height: 42px; width: 100%" ng-model="selectedName" id="SelectClient">\n\\n\
                            <option value=""></option>\n\
                            <option ng-repeat="name in clients" value="{{name.User.id}}">{{name.User.full_name}}</option>\n\
                        </select>\n\
'
            };
        })
        .directive("selectclient", function ($compile) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange', 
//                scope.clients = dataFactory.listClients(attrs.clients);
                    element.bind("change", function () {
                        if ($("#SelectClient :selected").text() === "") {
                            toastr.success('Veuillez choisir un client');
                        } else {
                            var user_id = $("#SelectClient :selected").val();
                            $("tbody#space-for-commande").empty();
                            $(scope.filters).each(function (index, value) {
                                if (value.Commande.user_id === user_id) {
                                    angular.element(document.getElementById('space-for-commande')).append($compile("<tr>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + $("#SelectClient :selected").text() + "</td>\n\
                                                <td>" + value.Commande.created + "</td>\n\
                                                <td>" + value.Commande.modified + "</td>\n\
                                                <td><div ng-click='showReglement(" + value.Commande.id + ")'><a href='#/reglement/" + value.Commande.id + " '  class='btn btn-success btn-sm'>Reglement</a></div></td>\n\
                                                </tr>")(scope));
                                }

                            });
                        }
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.clients = PostFactory.listClients().then(function (clients) {
                        $scope.clients = clients;
                        ////console.log(clients);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    setTimeout(function () {
                        $scope.filters = PostFactory.listCommandesFinalisee().then(function (filters) {
                            $scope.filters = filters;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
//                        }

                    }, 300);
                }
            };
        })
        //solde client caisse
             .directive("customSelect1caisse", function () {
            return {
                restrict: "E",
                template: '<select selectclientcaisse class="form-control input-xlarge select2me col-sm-12" data-placeholder="Select Client..." style="height: 42px; width: 100%" ng-model="selectedName" id="SelectClient">\n\\n\
                            <option value=""></option>\n\
                            <option ng-repeat="name in clients" value="{{name.User.id}}">{{name.User.full_name}}</option>\n\
                        </select>\n\
'
            };
        })
        .directive("selectclientcaisse", function ($compile) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange', 
//                scope.clients = dataFactory.listClients(attrs.clients);
                    element.bind("change", function () {
                        if ($("#SelectClient :selected").text() === "") {
                            toastr.success('Veuillez choisir un client');
                        } else {
                            var user_id = $("#SelectClient :selected").val();
                            $("tbody#space-for-commande").empty();
                            $(scope.filters).each(function (index, value) {
                                if (value.Commande.user_id === user_id) {
                                    angular.element(document.getElementById('space-for-commande')).append($compile("<tr>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + $("#SelectClient :selected").text() + "</td>\n\
                                                <td>" + value.Commande.created + "</td>\n\
                                                <td>" + value.Commande.modified + "</td>\n\
                                                <td><div ng-click='showReglement(" + value.Commande.id + ")'><a ng-click='addparammodal("+value.Commande.id+")' href='#' data-toggle='modal' role='button' data-target='#myModal_commande' id='sample_editable_2_new' class='btn btn-sm sbold green'> Add New<i class='fa fa-plus'></i></a></div></td>\n\
                                                </tr>")(scope));
                                }

                            });
                        }
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.clients = PostFactory.listClients().then(function (clients) {
                        $scope.clients = clients;
                        ////console.log(clients);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    setTimeout(function () {
                        $scope.filters = PostFactory.listCommandesFinalisee().then(function (filters) {
                            $scope.filters = filters;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
//                        }

                    }, 300);
                }
            };
        })
        //Solde Fournisseur
        .directive("customSelectFournisseur", function () {
            return {
                restrict: "E",
                template: '<select selectfournisseur class="form-control input-xlarge select2me col-sm-12" data-placeholder="Select Fournisseur..." style="height: 42px; width: 100%" ng-model="selectedName" id="SelectFournisseur">\n\\n\
                            <option value=""></option>\n\
                            <option ng-repeat="item in fournisseurs" value="{{item.Fournisseur.id}}">{{item.Fournisseur.name}}</option>\n\
                        </select>'
            };
        })
        .directive("selectfournisseur", function ($compile) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
//                scope.clients = dataFactory.listFournisseur(attrs.clients);
                    element.bind("change", function () {
                        if ($("#SelectFournisseur :selected").text() === "") {
                            toastr.success('Veuillez choisir un fournisseur');
                        } else {
                            var fournisseur_id = $("#SelectFournisseur :selected").val();
                            $("tbody#space-for-facture-fournisseur").empty();
                            $(scope.facturesAchat).each(function (index, value) {
                                var ttc = 0;
                                $(value.Product).each(function (i, v) {
                                    ttc = ttc + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * (1 + v.Tva.value / 100);
                                });
                                var total_reglement = 0;
                                $(value.Reglement).each(function (i, v) {
                                    if (v.part === 0 || v.part === '0') {
                                        var reglee = v.value;
                                    } else {
                                        var reglee = v.part;
                                    }
                                    total_reglement = total_reglement + parseFloat(reglee);
                                });
                                //console.log(total_reglement);
                                //console.log(ttc);
                                if (value.Facture.fournisseur_id === fournisseur_id) {
                                    if (parseInt(total_reglement) === parseInt(ttc)) {
                                        var etat = "payee";
                                    } else {
                                        var etat = "impayee";
                                    }
                                    if (value.Facture.retenu_id == 0 || value.Facture.retenu_id == '0' || etat === "impayee") {
                                        angular.element(document.getElementById('space-for-facture-fournisseur')).append($compile("<tr data-facture='" + value.Facture.id + "'>\n\
                                                <td>" + value.Facture.code_facture + "</td>\n\
                                                <td><a href='#/fiche-fournisseur/" + value.Facture.fournisseur_id + "'>" + $("#SelectFournisseur :selected").text() + "</a></td>\n\
                                                <td>" + value.Facture.created + "</td>\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td><label class='label label-info'>" + (parseFloat(ttc) - parseFloat(total_reglement)).toFixed(3) + "</label></td>\n\
                                                <td><div ng-click='showReglementFacture(" + value.Facture.id + ")'><a href='#/reglement-fournisseur/" + value.Facture.id + " '  class='btn btn-success btn-sm'>Reglement</a></div></td>\n\
                                                </tr>")(scope));
                                    } else {
                                        angular.element(document.getElementById('space-for-facture-fournisseur')).append($compile("<tr data-facture='" + value.Facture.id + "'>\n\
                                                <td>" + value.Facture.code_facture + "</td>\n\
                                                <td><a href='#/fiche-fournisseur/" + value.Facture.fournisseur_id + "'>" + $("#SelectFournisseur :selected").text() + "</a></td>\n\
                                                <td>" + value.Facture.created + "</td>\n\
                                                <td>" + parseFloat(ttc).toFixed(3) + "</td>\n\
                                                <td><label class='label label-success'>payée</label></td>\n\
                                                <td><label class='label label-success'>payée</label></td>\n\
                                                </tr>")(scope));
                                    }

                                }
                            });
                            setTimeout(function () {
                                var dataFournisseur = {
                                    Fournisseur: []
                                };
                                $('#space-for-facture-fournisseur tr').each(function (i, v) {
                                    //console.log(parseInt($(v).children().eq(3).text()));
                                    if (parseInt($(v).children().eq(3).text()) === 0 || parseInt($(v).children().eq(3).text()) === '0') {
                                        dataFournisseur.Fournisseur.push({id: $("#SelectFournisseur :selected").val(), facture_id: $(v).attr('data-facture')});
                                    }
                                });
                                //console.log(dataFournisseur.Fournisseur);
                                setTimeout(function () {
                                    if (dataFournisseur.Fournisseur.length > 1) {
                                        ////console.log('yes');
                                        $("#RegrementReglement").html("<a href='#/reglement-grouper/" + $("#SelectFournisseur :selected").val() + "'  class='btn btn-info btn-sm pull-right'>générer</a>");
                                    }
                                }, 300);
                            }, 1000);
                        }
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.fournisseurs = PostFactory.listFournisseur().then(function (fournisseurs) {
                        $scope.fournisseurs = fournisseurs;
//                        ////console.log(fournisseurs);

                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    setTimeout(function () {
                        $scope.facturesAchat = PostFactory.listFacturesAchat().then(function (facturesAchat) {
                            $scope.facturesAchat = facturesAchat;
                            //console.log(facturesAchat);
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
//                        }

                    }, 300);
                }
            };
        })

//  declaration fiscale facture vente
        .directive("declarationfiscalefacture", function () {
            return {
                restrict: "E",
                template: "<button type='submit' declarationfiscale id='declarationFiscale' class='btn purple'  style='float: right'><i class='fa fa-check'></i> Envoyer</button>"
            };
        })
        .directive("declarationfiscale", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
//                scope.clients = dataFactory.listClients(attrs.clients);
                    element.bind("click", function ($event) {
                        $event.preventDefault();
//                        setInterval(function () {
                        if ($("#DateDebut").val() === "") {
                            toastr.info('Veuillez choisir la date de debut');
                        } else if ($("#DateFin").val() === "") {
                            toastr.info('Veuillez choisir la date de fin');
                        } else {
                            $("tbody#list-factures").empty();
                            var jourDebut = $("#DateDebut").val().split('-')[0];
                            var moisDebut = $("#DateDebut").val().split('-')[1];
                            var anneeDebut = $("#DateDebut").val().split('-')[2];
                            var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                            var jourFin = $("#DateFin").val().split('-')[0];
                            var moisFin = $("#DateFin").val().split('-')[1];
                            var anneeFin = $("#DateFin").val().split('-')[2];
                            var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
                            var dataFacture = {
                                Facture: {
                                    first_date: date_debut,
                                    last_date: date_fin
                                }
                            };
//                    setInterval(function () {
//                        if ($("#DateDebut").val() !== "" && $("#DateFin").val() !== "") {
                            scope.declarations = PostFactory.declarationFiscale(dataFacture).then(function (declarations) {
                                scope.declarations = declarations.declarations;
                                scope.facturesavoir = declarations.facturesavoir;
                                scope.count = declarations.count;
                                scope.count_avoir = declarations.count_avoir;
                                //console.log(declarations.facturesavoir);
//                                //console.log(declarations.count);
//                                //console.log(declarations.count_avoir);

//                            var first_date = new Date($("#DateDebut").val() + " 00:00:00");
//                            var last_date = new Date($("#DateFin").val() + " 23:59:59");
//                            var first_date = new Date($("#DateDebut").val() + " 00:00:00");
//                            var last_date = new Date($("#DateFin").val() + " 23:59:59");
//                            ////console.log(first_date);
//                            ////console.log(last_date);
                                $(declarations.declarations).each(function (index, value) {
//                                var date_created = new Date(value.Facture.created);
//                                ////console.log(date_created);
                                    var user_id = $("#ClientID :selected").val();
                                    var ht = 0;
                                    var ttc = 0;
                                    var marge = 0;
                                    var tva = 0;
                                    $(value.Product).each(function (i, v) {
                                        ht = ht + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte;
                                        ttc = ttc + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * (1 + v.Tva.value / 100);
                                        tva = tva + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * v.Tva.value / 100;
                                        marge = marge + ((v.FacturesProduct.last_unit_price - v.prix_achat) * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * (1 + v.Tva.value / 100));
                                    });
                                    if (user_id === "" || user_id === "0") {
//                                    if (date_created < last_date && first_date < date_created) {
                                        angular.element(document.getElementById('list-factures')).append($compile("<tr class='odd gradeX' id='FacturesRows'>\n\
                                                <td>" + (value.Facture.created).split(" ")[0] + "</td>\n\
                                                <td>" + (value.Facture.code_facture).split("-")[2] + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(tva).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(value.Facture.last_timbre_price).toFixed(3) + "</td>\n\
                                                <td data-marge='" + parseFloat(marge * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "' data-value='" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "'>" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                </tr>")(scope));
//                                    }
                                    } else {
                                        if (user_id == value.Facture.user_id) {
//                                        ////console.log(value.Facture.user_id);
//                                        ////console.log(user_id);
                                            angular.element(document.getElementById('list-factures')).append($compile("<tr class='odd gradeX' id='FacturesRows'>\n\
                                                <td>" + (value.Facture.created).split(" ")[0] + "</td>\n\
                                                <td>" + (value.Facture.code_facture).split("-")[2] + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\\n\
                                                <td>" + parseFloat(tva).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(value.Facture.last_timbre_price).toFixed(3) + "</td>\n\
                                                <td data-marge='" + parseFloat(marge * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "' data-value='" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "'>" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                </tr>")(scope));
                                        }
                                    }
                                });
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                            setTimeout(function () {
                                //console.log('here');
                                var total_ht = 0;
                                var total_tva = 0;
                                var total_ttc = 0;
                                var total_timbre = 0;
                                var indicateur = 0;
                                $('tr#FacturesRows').each(function (i, v) {
                                    total_ht = total_ht + parseFloat($.trim($(v).children().eq(3).text()));
                                    total_tva = total_tva + parseFloat($.trim($(v).children().eq(4).text()));
                                    total_ttc = total_ttc + parseFloat($.trim($(v).children().eq(6).text()));
                                    total_timbre = total_timbre + parseFloat($.trim($(v).children().eq(5).text()));
                                    indicateur = indicateur + parseFloat($.trim($(v).children().eq(6).attr('data-marge')));
                                });
                                //console.log(parseFloat(total_ht).toFixed(3));
                                $("#Total_Ht").text(parseFloat(total_ht).toFixed(3));
                                $("#Total_TVA").text(parseFloat(total_tva).toFixed(3));
                                $("#Total_TTC").text((parseFloat(total_ttc) + parseFloat(scope.config.Configuration.price_timbre)).toFixed(3));
                                $("#Total_Timbre").text(parseFloat(total_timbre).toFixed(3));
                                $("#Marge_Total").text(parseFloat(indicateur).toFixed(3));
//                                scope.total_ht = total_ht;
//                                scope.total_ttc = total_ttc;
//                                scope.indicateur = indicateur;

                            }, 1000);
                        }
//                        }, 1000);
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.config = PostFactory.showConfig().then(function (config) {
                        $scope.config = config;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // start action list client
                    $scope.clients = PostFactory.listClients().then(function (clients) {
                        $scope.clients = clients;
                        ////console.log(clients);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // end action list client

//                        }
//                    }, 10000);

                }

            };
        })
////  declaration fiscale facture vente
        .directive("etatfacturesvente", function () {
            return {
                restrict: "E",
                template: "<button type='submit' facturevente id='factureVente' class='btn purple'  style='float: right'><i class='fa fa-check'></i> Envoyer</button>"
            };
        })
        .directive("facturevente", function ($compile) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("click", function ($event) {
                        $event.preventDefault();
                        if ($("#DateDebut").val() === "") {
                            toastr.info('Veuillez choisir la date de debut');
                        } else if ($("#DateFin").val() === "") {
                            toastr.info('Veuillez choisir la date de fin');
                        } else {
                            $("tbody#list-factures").empty();
                            var first_date = new Date($("#DateDebut").val() + " 00:00:00");
                            var last_date = new Date($("#DateFin").val() + " 23:59:59");
//                            //console.log(first_date);
//                            //console.log(last_date);
                            $(scope.facturesventes).each(function (index, value) {
                                var date_created = new Date(value.Commande.created);
//                                //console.log(date_created);
                                var user_id = $("#ClientID :selected").val();
                                var ht = 0;
                                var ttc = 0;
                                var marge = 0;
                                var tva = 0;
                                $(value.Bon).each(function (i, v) {
                                    ht = ht + v.last_unit_price * v.qte;
                                    ttc = ttc + v.last_unit_price * v.qte * (1 - v.remise / 100) * (1 + v.Product.Tva.value / 100);
                                    tva = tva + v.last_unit_price * v.qte * (1 - v.remise / 100) * v.Product.Tva.value / 100;
                                    marge = marge + ((v.Product.price - v.Product.prix_achat) * v.qte * (1 - v.remise / 100) * (1 + v.Product.Tva.value / 100));
                                });
                                var total_reglement = 0;
                                $(value.Reglement).each(function (i, v) {
                                    if (v.part === 0 || v.part === '0') {
                                        var reglee = v.value;
                                    } else {
                                        var reglee = v.part;
                                    }
                                    total_reglement = total_reglement + parseFloat(reglee);
                                });
                                //console.log(total_reglement);
                                var total_restant = parseFloat(ttc * (1 - value.Commande.remise_globale / 100)) + parseFloat(value.Commande.last_timbre_price) - parseFloat(total_reglement);
                                if (user_id === "" || user_id === "0") {
                                    if (date_created < last_date && first_date < date_created) {
                                        if (parseInt(total_reglement) === parseInt(ttc)) {
                                            var etat = "payee";
                                        } else {
                                            var etat = "impayee";
                                        }
                                        if (etat === "payee") {
                                            angular.element(document.getElementById('list-factures')).append($compile("<tr class='odd gradeX' id='FacturesRows'>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(tva).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(value.Commande.last_timbre_price).toFixed(3) + "</td>\n\
                                                <td data-marge='" + parseFloat(marge * (1 - value.Commande.remise_globale / 100)).toFixed(3) + "' data-value='" + (parseFloat(ttc * (1 - value.Commande.remise_globale / 100)) + parseFloat(value.Commande.last_timbre_price)).toFixed(3) + "'>" + (parseFloat(ttc * (1 - value.Facture.remise_globale / 100)) + parseFloat(value.Facture.last_timbre_price)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Commande.remise_globale / 100)).toFixed(3) + "</td>\n\\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td><label class='label label-success'>payée</label></td>\n\
                                                <td>" + value.Commande.created + "</td>\n\
                                                <td><a href='#/view-commande/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        } else {
                                            angular.element(document.getElementById('list-factures')).append($compile("<tr class='odd gradeX' id='FacturesRows'>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(tva).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(value.Commande.last_timbre_price).toFixed(3) + "</td>\n\
                                                <td data-marge='" + parseFloat(marge * (1 - value.Commande.remise_globale / 100)).toFixed(3) + "' data-value='" + (parseFloat(ttc * (1 - value.Commande.remise_globale / 100)) + parseFloat(value.Commande.last_timbre_price)).toFixed(3) + "'>" + (parseFloat(ttc * (1 - value.Commande.remise_globale / 100)) + parseFloat(value.Commande.last_timbre_price)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Commande.remise_globale / 100)).toFixed(3) + "</td>\n\\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td><label class='label label-info'>" + parseFloat(total_restant).toFixed(3) + "</label></td>\n\
                                                <td>" + value.Commande.created + "</td>\n\
                                                <td><a href='#/view-commande/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        }
                                    }
                                } else {
                                    if (date_created < last_date && first_date < date_created && user_id == value.Commande.user_id) {
//                                        //console.log(value.Facture.user_id);
//                                        //console.log(user_id);
                                        if (etat === "payee") {
                                            angular.element(document.getElementById('list-factures')).append($compile("<tr class='odd gradeX' id='FacturesRows'>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\\n\
                                                <td>" + parseFloat(tva).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(value.Commande.last_timbre_price).toFixed(3) + "</td>\n\
                                                <td data-marge='" + parseFloat(marge * (1 - value.Commande.remise_globale / 100)).toFixed(3) + "' data-value='" + (parseFloat(ttc * (1 - value.Commande.remise_globale / 100)) + parseFloat(value.Commande.last_timbre_price)).toFixed(3) + "'>" + (parseFloat(ttc * (1 - value.Commande.remise_globale / 100)) + parseFloat(value.Commande.last_timbre_price)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Commande.remise_globale / 100)).toFixed(3) + "</td>\n\\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td><label class='label label-success'>payée</label></td>\n\
                                                <td>" + value.Commande.created + "</td>\n\
                                                <td><a href='#/view-commande/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        } else {
                                            angular.element(document.getElementById('list-factures')).append($compile("<tr class='odd gradeX' id='FacturesRows'>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\\n\
                                                <td>" + parseFloat(tva).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(value.Commande.last_timbre_price).toFixed(3) + "</td>\n\
                                                <td data-marge='" + parseFloat(marge * (1 - value.Commande.remise_globale / 100)).toFixed(3) + "' data-value='" + (parseFloat(ttc * (1 - value.Commande.remise_globale / 100)) + parseFloat(value.Commande.last_timbre_price)).toFixed(3) + "'>" + (parseFloat(ttc * (1 - value.Commande.remise_globale / 100)) + parseFloat(value.Commande.last_timbre_price)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Commande.remise_globale / 100)).toFixed(3) + "</td>\n\\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td><label class='label label-info'>" + parseFloat(total_restant).toFixed(3) + "</label></td>\n\
                                                <td>" + value.Commande.created + "</td>\n\
                                                <td><a href='#/view-commande/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        }
                                    }
                                }
                            });
                            setTimeout(function () {
                                var total_ht = 0;
                                var total_tva = 0;
                                var total_ttc = 0;
                                var indicateur = 0;
                                var total_peyee = 0;
                                var total_restant = 0;
                                $('tr#FacturesRows').each(function (i, v) {
                                    total_ht = total_ht + parseFloat($.trim($(v).children().eq(2).text()));
                                    total_tva = total_tva + parseFloat($.trim($(v).children().eq(3).text()));
                                    total_ttc = total_ttc + parseFloat($.trim($(v).children().eq(5).text()));
                                    total_peyee = total_peyee + parseFloat($.trim($(v).children().eq(7).text()));
                                    if ($.trim($(v).children().eq(8).text()) != "payée") {
                                        total_restant = total_restant + parseFloat($.trim($(v).children().eq(8).text()));
                                    }
                                    indicateur = indicateur + parseFloat($.trim($(v).children().eq(5).attr('data-marge')));
                                });
                                $("#Total_Ht").text(parseFloat(total_ht).toFixed(3));
                                $("#Total_TVA").text(parseFloat(total_tva).toFixed(3));
                                $("#Total_TTC").text((parseFloat(total_ttc)).toFixed(3));
                                $("#Marge_Total").text(parseFloat(indicateur).toFixed(3));
                                $("#Total_Payee").text(parseFloat(total_peyee).toFixed(3));
                                $("#Total_Restant").text(parseFloat(total_restant).toFixed(3));
//                                scope.total_ht = total_ht;
//                                scope.total_ttc = total_ttc;
//                                scope.indicateur = indicateur;

                            }, 500);
                        }
                    });
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.config = PostFactory.showConfig().then(function (config) {
                        $scope.config = config;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
//                    // start action list client
                    $scope.clients = PostFactory.listClients().then(function (clients) {
                        $scope.clients = clients;
                        ////console.log(clients);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
//                    // end action list client

                    $scope.facturesventes = PostFactory.etatFacturesVentes().then(function (facturesventes) {
                        $scope.facturesventes = facturesventes;
                        //console.log(facturesventes);
                    },
                            function (msg) {
                                alert(msg);
                            });
                }

            };
        })
//  etat facture Achat
        .directive("declarationfiscalefacturesachat", function () {
            return {
                restrict: "E",
                template: "<button type='submit' declarationfiscaleachat id='declarationFiscaleAchat' class='btn purple'  style='float: right'><i class='fa fa-check'></i> Envoyer</button>"
            };
        })
        .directive("declarationfiscaleachat", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
//                scope.clients = dataFactory.listClients(attrs.clients);
                    element.bind("click", function ($event) {
                        $event.preventDefault();
//                        setInterval(function () {
                        if ($("#DateDebutAchat").val() === "") {
                            toastr.info('Veuillez choisir la date de debut');
                        } else if ($("#DateFinAchat").val() === "") {
                            toastr.info('Veuillez choisir la date de fin');
                        } else {
                            var jourDebut = $("#DateDebutAchat").val().split('-')[0];
                            var moisDebut = $("#DateDebutAchat").val().split('-')[1];
                            var anneeDebut = $("#DateDebutAchat").val().split('-')[2];
                            var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                            var jourFin = $("#DateFinAchat").val().split('-')[0];
                            var moisFin = $("#DateFinAchat").val().split('-')[1];
                            var anneeFin = $("#DateFinAchat").val().split('-')[2];
                            var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
                            $("tbody#list-factures-achat").empty();
//                            var first_date = new Date($("#DateDebutAchat").val() + " 00:00:00");
//                            var last_date = new Date($("#DateFinAchat").val() + " 23:59:59");
                            var first_date = new Date(date_debut + " 00:00:00");
                            var last_date = new Date(date_fin + " 23:59:59");
                            var DataFournisseur = {
                                Fournisseur: [],
                                Data: []
                            };
                            var ht_fournisseur = 0;
                            var chart = null;
                            $(scope.facturesAchat).each(function (index, value) {
                                var date_created = new Date(value.Facture.created);
                                ////console.log(date_created);
                                var fournisseur_id = $("#FournisseurID :selected").val();
                                var ht = 0;
                                var ttc = 0;
                                var marge = 0;
                                $(value.Product).each(function (i, v) {
                                    ht = ht + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte;
                                    ttc = ttc + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * (1 + v.Tva.value / 100);
                                    marge = marge + ((v.FacturesProduct.last_unit_price - v.prix_achat) * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * (1 + v.Tva.value / 100));
                                });
                                var total_reglement = 0;
                                $(value.Reglement).each(function (i, v) {
                                    if (v.part === 0 || v.part === '0') {
                                        var reglee = v.value;
                                    } else {
                                        var reglee = v.part;
                                    }
                                    total_reglement = total_reglement + parseFloat(reglee);
                                });
                                var total_restant = parseFloat(ttc) - parseFloat(total_reglement);
                                ////console.log(total_reglement);
                                if (fournisseur_id === "" || fournisseur_id === "0") {
                                    if (date_created < last_date && first_date < date_created) {
                                        if (parseInt(total_reglement) === parseInt(ttc)) {
                                            var etat = "payee";
                                        } else {
                                            var etat = "impayee";
                                        }
                                        if (etat === "payee") {
                                            angular.element(document.getElementById('list-factures-achat')).append($compile("<tr class='odd gradeX " + value.Fournisseur.name + "' id='FacturesAchatRows' data-index='" + value.Fournisseur.id + "'>\n\
                                                <td>" + value.Facture.code_facture + "</td>\n\
                                                <td id='" + value.Fournisseur.name + "' data-data-id='" + value.Fournisseur.id + "'>" + value.Fournisseur.name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td ng-if='etat == payee'><label class='label label-success'>payée</label></td>\n\
                                                <td>" + value.Facture.created + "</td>\n\
                                                <td><a href='#/view-facture-achat/" + value.Facture.id + "' class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        } else {
                                            angular.element(document.getElementById('list-factures-achat')).append($compile("<tr class='odd gradeX " + value.Fournisseur.name + "' id='FacturesAchatRows' data-index='" + value.Fournisseur.id + "'>\n\
                                                <td>" + value.Facture.code_facture + "</td>\n\
                                                <td id='" + value.Fournisseur.name + "' data-data-id='" + value.Fournisseur.id + "'>" + value.Fournisseur.name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td ng-if='etat == impayee'><label class='label label-info'>" + parseFloat(total_restant).toFixed(3) + "</label></td>\n\
                                                <td>" + value.Facture.created + "</td>\n\
                                                <td><a href='#/view-facture-achat/" + value.Facture.id + "' class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        }
                                        setTimeout(function () {
                                            DataFournisseur.Data.push({y: ht, name: value.Fournisseur.name, legendMarkerType: "triangle"});
                                            var dataInterval = {
                                                Facture: {
                                                    first_date: first_date,
                                                    last_date: last_date
                                                }
                                            };
                                            scope.loadSalesAchats = PostFactory.loadSalesAchat(dataInterval).then(function (statsachats) {
//                    var chart = null;
                                                ////console.log(statsachats);
                                                if (statsachats.length !== 0) {
                                                    var chart = new CanvasJS.Chart("chartContainerAchatFournisseur",
                                                            {
                                                                title: {
                                                                    text: "Statistique des achats/fournisseur",
                                                                    fontFamily: "arial black",
                                                                    fontSize: 14
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
                                            $('tr#FacturesAchatRows.' + value.Fournisseur.name + '').each(function (i, v) {
                                                ht_fournisseur = ht_fournisseur + parseFloat($(v).children().eq(2).text());
                                                ////console.log(value.Fournisseur.name);
                                            });
                                            DataFournisseur.Fournisseur.push({id: value.Fournisseur.id, name: value.Fournisseur.name, value: ht_fournisseur});
                                            ////console.log(ht_fournisseur);
                                            ////console.log(DataFournisseur.Fournisseur);
                                        }, 500);
                                    }
                                } else {
                                    if (date_created < last_date && first_date < date_created && fournisseur_id == value.Facture.fournisseur_id) {
//                                        ////console.log(value.Facture.user_id);
//                                        ////console.log(user_id);
                                        if (parseInt(total_reglement) === parseInt(ttc)) {
                                            var etat = "payee";
                                        } else {
                                            var etat = "impayee";
                                        }
                                        if (etat === "payee") {
                                            angular.element(document.getElementById('list-factures-achat')).append($compile("<tr class='odd gradeX " + value.Fournisseur.name + "' id='FacturesAchatRows' data-index='" + value.Fournisseur.id + "'>\n\
                                                <td>" + value.Facture.code_facture + "</td>\n\
                                                <td id='" + value.Fournisseur.name + "' data-data-id='" + value.Fournisseur.id + "'>" + value.Fournisseur.name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td ng-if='etat == payee'><label class='label label-success'>payée</label></td>\n\
                                                <td>" + value.Facture.created + "</td>\n\
                                                <td><a href='#/view-facture-achat/" + value.Facture.id + "' class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        } else {
                                            angular.element(document.getElementById('list-factures-achat')).append($compile("<tr class='odd gradeX " + value.Fournisseur.name + "' id='FacturesAchatRows' data-index='" + value.Fournisseur.id + "'>\n\
                                                <td>" + value.Facture.code_facture + "</td>\n\
                                                <td id='" + value.Fournisseur.name + "' data-data-id='" + value.Fournisseur.id + "'>" + value.Fournisseur.name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td ng-if='etat == impayee'><label class='label label-info'>" + parseFloat(total_restant).toFixed(3) + "</label></td>\n\
                                                <td>" + value.Facture.created + "</td>\n\
                                                <td><a href='#/view-facture-achat/" + value.Facture.id + "' class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        }

                                    }
                                    setTimeout(function () {
                                        var dataFournisseur = {
                                            Fournisseur: {
                                                id: $("#FournisseurID :selected").val()
                                            },
                                            Facture: {
                                                first_date: first_date,
                                                last_date: last_date
                                            }
                                        };
                                        scope.statsachatsfournisseur = PostFactory.loadSalesAchatFournisseur(dataFournisseur).then(function (statsachatsfournisseur) {
                                            ////console.log(statsachatsfournisseur);
                                            if (statsachatsfournisseur.length !== 0) {
                                                var chart = new CanvasJS.Chart("chartContainerAchatFournisseur",
                                                        {
                                                            animationEnabled: true,
                                                            title: {
                                                                text: "Statistique des achats de " + value.Fournisseur.name + "/mois",
                                                                fontSize: 15
                                                            },
                                                            data: [
                                                                {
                                                                    type: "column", //change type to bar, line, area, pie, etc
                                                                    dataPoints: statsachatsfournisseur
                                                                }
                                                            ]
                                                        });
                                                chart.render();
                                            }
                                        });
                                    }, 500);
                                }
                            });
                            setTimeout(function () {
                                var total_ht = 0;
                                var total_ttc = 0;
                                var total_peyee = 0;
                                var total_restant = 0;
                                var indicateur = 0;
                                $('tr#FacturesAchatRows').each(function (i, v) {
                                    total_ht = total_ht + parseFloat($.trim($(v).children().eq(2).text()));
                                    total_ttc = total_ttc + parseFloat($.trim($(v).children().eq(3).text()));
                                    total_peyee = total_peyee + parseFloat($.trim($(v).children().eq(5).text()));
                                    if ($.trim($(v).children().eq(6).text()) != "payée") {
                                        total_restant = total_restant + parseFloat($.trim($(v).children().eq(6).text()));
                                    }
                                    indicateur = indicateur + parseFloat($.trim($(v).children().eq(4).text()));
                                });
                                $("#Total_Ht").text(parseFloat(total_ht).toFixed(3));
                                $("#Total_TTC").text(parseFloat(total_ttc).toFixed(3));
//                                $("#Marge_Total").text(parseFloat(indicateur).toFixed(3));
                                $("#Total_Payee").text(parseFloat(total_peyee).toFixed(3));
                                $("#Total_Restant").text(parseFloat(total_restant).toFixed(3));
//                                scope.total_ht = total_ht;
//                                scope.total_ttc = total_ttc;
//                                scope.indicateur = indicateur;

                            }, 500);
                        }
//                        }, 1000);
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    // start action list fournisseur
                    $scope.fournisseurs = PostFactory.listFournisseur().then(function (fournisseurs) {
                        $scope.fournisseurs = fournisseurs;
                        ////console.log(fournisseurs);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // end action list fournisseur
                    // start action list factures achat 
                    $scope.facturesAchat = PostFactory.listFacturesAchat().then(function (facturesAchat) {
                        $scope.facturesAchat = facturesAchat;
                        ////console.log(facturesAchat);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // end action list factures achat 
//                    window.onload = function () {
//                        ////console.log('here');

//                    }
                }

            };
        })
//  etat facture Achat facture non reglé
        .directive("etatfacturesachatinpayee", function () {
            return {
                restrict: "E",
                template: "<button type='submit' etatachatimpyee id='etatAchatImpyee' class='btn purple'  style='float: right'><i class='fa fa-check'></i> Envoyer</button>"
            };
        })
        .directive("etatachatimpyee", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
//                scope.clients = dataFactory.listClients(attrs.clients);
                    element.bind("click", function ($event) {
                        $event.preventDefault();
//                        setInterval(function () {
                        if ($("#DateDebutAchat").val() === "") {
                            toastr.info('Veuillez choisir la date de debut');
                        } else if ($("#DateFinAchat").val() === "") {
                            toastr.info('Veuillez choisir la date de fin');
                        } else {
                            $("tbody#list-factures-achat").empty();
//
                            var jourDebut = $("#DateDebutAchat").val().split('-')[0];
                            var moisDebut = $("#DateDebutAchat").val().split('-')[1];
                            var anneeDebut = $("#DateDebutAchat").val().split('-')[2];
                            var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                            var jourFin = $("#DateFinAchat").val().split('-')[0];
                            var moisFin = $("#DateFinAchat").val().split('-')[1];
                            var anneeFin = $("#DateFinAchat").val().split('-')[2];
                            var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
                            //
                            var first_date = new Date(date_debut + " 00:00:00");
                            var last_date = new Date(date_fin + " 23:59:59");
//                            var first_date = new Date($("#DateDebutAchat").val() + " 00:00:00");
//                            var last_date = new Date($("#DateFinAchat").val() + " 23:59:59");
                            var DataFournisseur = {
                                Fournisseur: [],
                                Data: []
                            };
                            var ht_fournisseur = 0;
                            var chart = null;
                            $(scope.facturesAchat).each(function (index, value) {
                                var date_created = new Date(value.Facture.created);
                                ////console.log(date_created);
                                var fournisseur_id = $("#FournisseurID :selected").val();
                                var ht = 0;
                                var ttc = 0;
                                var marge = 0;
                                $(value.Product).each(function (i, v) {
                                    ht = ht + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte;
                                    ttc = ttc + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * (1 + v.Tva.value / 100);
                                    marge = marge + ((v.FacturesProduct.last_unit_price - v.prix_achat) * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * (1 + v.Tva.value / 100));
                                });
                                var total_reglement = 0;
                                $(value.Reglement).each(function (i, v) {
                                    if (v.part === 0 || v.part === '0') {
                                        var reglee = v.value;
                                    } else {
                                        var reglee = v.part;
                                    }
                                    total_reglement = total_reglement + parseFloat(reglee);
                                });
                                var total_restant = parseFloat(ttc) - parseFloat(total_reglement);
                                ////console.log(total_reglement);
                                if (fournisseur_id === "" || fournisseur_id === "0") {
                                    if (date_created < last_date && first_date < date_created) {
                                        if (parseInt(total_reglement) === parseInt(ttc)) {
                                            var etat = "payee";
                                        } else {
                                            var etat = "impayee";
                                        }
                                        if (etat === "impayee") {
                                            angular.element(document.getElementById('list-factures-achat')).append($compile("<tr class='odd gradeX " + value.Fournisseur.name + "' id='FacturesAchatRows' data-index='" + value.Fournisseur.id + "'>\n\
                                                <td>" + value.Facture.code_facture + "</td>\n\
                                                <td id='" + value.Fournisseur.name + "' data-data-id='" + value.Fournisseur.id + "'>" + value.Fournisseur.name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td><label class='label label-info'>" + parseFloat(total_restant).toFixed(3) + "</label></td>\n\
                                                <td>" + value.Facture.created + "</td>\n\
                                                <td><a href='#/view-facture-achat/" + value.Facture.id + "' class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        }

                                        setTimeout(function () {

                                            $('tr#FacturesAchatRows.' + value.Fournisseur.name + '').each(function (i, v) {
                                                ht_fournisseur = ht_fournisseur + parseFloat($(v).children().eq(2).text());
                                                ////console.log(value.Fournisseur.name);
                                            });
                                            DataFournisseur.Fournisseur.push({id: value.Fournisseur.id, name: value.Fournisseur.name, value: ht_fournisseur});
                                            ////console.log(ht_fournisseur);
                                            ////console.log(DataFournisseur.Fournisseur);
                                        }, 500);
                                    }
                                } else {
                                    if (date_created < last_date && first_date < date_created && fournisseur_id == value.Facture.fournisseur_id) {
//                                        ////console.log(value.Facture.user_id);
//                                        ////console.log(user_id);
                                        if (parseInt(total_reglement) === parseInt(ttc)) {
                                            var etat = "payee";
                                        } else {
                                            var etat = "impayee";
                                        }
                                        if (etat === "impayee") {
                                            angular.element(document.getElementById('list-factures-achat')).append($compile("<tr class='odd gradeX " + value.Fournisseur.name + "' id='FacturesAchatRows' data-index='" + value.Fournisseur.id + "'>\n\
                                                <td>" + value.Facture.code_facture + "</td>\n\
                                                <td id='" + value.Fournisseur.name + "' data-data-id='" + value.Fournisseur.id + "'>" + value.Fournisseur.name + "</td>\n\
                                                <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(marge * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + parseFloat(total_reglement).toFixed(3) + "</td>\n\
                                                <td><label class='label label-info'>" + parseFloat(total_restant).toFixed(3) + "</label></td>\n\
                                                <td>" + value.Facture.created + "</td>\n\
                                                <td><a href='#/view-facture-achat/" + value.Facture.id + "' class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                        }

                                    }

                                }
                            });
                            setTimeout(function () {
                                var total_ht = 0;
                                var total_ttc = 0;
                                var total_peyee = 0;
                                var total_restant = 0;
                                var indicateur = 0;
                                $('tr#FacturesAchatRows').each(function (i, v) {
                                    total_ht = total_ht + parseFloat($.trim($(v).children().eq(2).text()));
                                    total_ttc = total_ttc + parseFloat($.trim($(v).children().eq(3).text()));
                                    total_peyee = total_peyee + parseFloat($.trim($(v).children().eq(5).text()));
                                    total_restant = total_restant + parseFloat($.trim($(v).children().eq(6).text()));
                                    indicateur = indicateur + parseFloat($.trim($(v).children().eq(4).text()));
                                });
                                $("#Total_Ht").text(parseFloat(total_ht).toFixed(3));
                                $("#Total_TTC").text(parseFloat(total_ttc).toFixed(3));
//                                $("#Marge_Total").text(parseFloat(indicateur).toFixed(3));
                                $("#Total_Payee").text(parseFloat(total_peyee).toFixed(3));
                                $("#Total_Restant").text(parseFloat(total_restant).toFixed(3));
//                                scope.total_ht = total_ht;
//                                scope.total_ttc = total_ttc;
//                                scope.indicateur = indicateur;

                            }, 500);
                        }
//                        }, 1000);
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    // start action list fournisseur
                    $scope.fournisseurs = PostFactory.listFournisseur().then(function (fournisseurs) {
                        $scope.fournisseurs = fournisseurs;
                        ////console.log(fournisseurs);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // end action list fournisseur
                    // start action list factures achat 
                    $scope.facturesAchat = PostFactory.listFacturesAchat().then(function (facturesAchat) {
                        $scope.facturesAchat = facturesAchat;
                        ////console.log(facturesAchat);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // end action list factures achat 
//                    window.onload = function () {
//                        ////console.log('here');

//                    }
                }

            };
        })
        //Sales Product
        .directive("selectsalesproduct", function () {
            return {
                restrict: "E",
                template: '<select salesproduct class="form-control input-xlarge select2me col-sm-12" data-placeholder="Select Product..." style="height: 42px; width: 100%" ng-model="selectedName" id="SelectProduct">\n\\n\
                            <option value=""></option>\n\
                            <option ng-repeat="item in products" value="{{item.Product.id}}">{{item.Product.name}}</option>\n\
                        </select>'
            };
        })
        .directive("salesproduct", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        if ($("#SelectProduct :selected").text() === "") {
                            toastr.success('Veuillez choisir un produit');
                        } else {
                            var dataProduct = {
                                Product: {
                                    id: $("#SelectProduct :selected").val(),
                                    name: $("#SelectProduct :selected").text()
                                },
                                Stat: {
                                    first_date: "",
                                    last_date: ""
                                }
                            };
                            scope.loadSalesProducts = PostFactory.loadSalesProducts(dataProduct).then(function (statsachats) {
                                var chart = new CanvasJS.Chart("chartContainerProduct",
                                        {
                                            title: {
                                                text: "État comparatif produit vente"
                                            },
                                            animationEnabled: true,
                                            axisY: {
                                                titleFontFamily: "arial",
                                                titleFontSize: 12,
                                                includeZero: false
                                            },
                                            toolTip: {
                                                shared: true
                                            },
                                            data: [
                                                {
                                                    type: "spline",
                                                    name: dataProduct.Product.name,
                                                    showInLegend: true,
                                                    dataPoints: statsachats.ventes
                                                }
                                            ],
                                            legend: {
                                                cursor: "pointer",
                                                itemclick: function (e) {
                                                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                                        e.dataSeries.visible = false;
                                                    } else {
                                                        e.dataSeries.visible = true;
                                                    }
                                                    chart.render();
                                                }
                                            }
                                        });
                                chart.render();
                            });
                        }
//                    }
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.products = PostFactory.listProducts().then(function (products) {
                        $scope.products = products;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
        })
//        //Sales Product
        .directive("selectsalesachatqteproduct", function () {
            return {
                restrict: "E",
                template: '<select salesachatqteproduct class="form-control input-xlarge select2me col-sm-12" data-placeholder="Select Product..." style="height: 42px; width: 100%" ng-model="selectedNameQte" id="SelectProductQte">\n\\n\
                            <option value=""></option>\n\
                            <option ng-repeat="item in products" value="{{item.Product.id}}">{{item.Product.name}}</option>\n\
                        </select>'
            };
        })
        .directive("salesachatqteproduct", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        if ($("#SelectProductQte :selected").text() === "") {
                            toastr.success('Veuillez choisir un produit');
                        } else {
                            var dataProduct = {
                                Product: {
                                    id: $("#SelectProductQte :selected").val(),
                                    name: $("#SelectProductQte :selected").text()
                                },
                                Stat: {
                                    first_date: "",
                                    last_date: ""
                                }
                            };
                            scope.loadSalesProducts = PostFactory.loadSalesAchatProducts(dataProduct).then(function (statsachats) {
                                var chart = new CanvasJS.Chart("chartContainerProductQte",
                                        {
                                            title: {
                                                text: "État comparatif produit vente/achat"
                                            },
                                            animationEnabled: true,
                                            axisY: {
                                                titleFontFamily: "arial",
                                                titleFontSize: 12,
                                                includeZero: false
                                            },
                                            toolTip: {
                                                shared: true
                                            },
                                            data: [
                                                {
                                                    type: "spline",
                                                    name: "Achat Qte : " + dataProduct.Product.name,
                                                    showInLegend: true,
                                                    dataPoints: statsachats.achats
                                                },
                                                {
                                                    type: "spline",
                                                    name: "Vente Qte : " + dataProduct.Product.name,
                                                    showInLegend: true,
                                                    dataPoints: statsachats.ventes
                                                }
                                            ],
                                            legend: {
                                                cursor: "pointer",
                                                itemclick: function (e) {
                                                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                                        e.dataSeries.visible = false;
                                                    } else {
                                                        e.dataSeries.visible = true;
                                                    }
                                                    chart.render();
                                                }
                                            }
                                        });
                                chart.render();
                            });
                        }
//                    }
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.products = PostFactory.listProducts().then(function (products) {
                        $scope.products = products;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
        })
        //  mouvement de stock
        .directive("validatemouvementstock", function () {
            return {
                restrict: "E",
                template: "<button type='submit' mouvementstock id='mouvementStock' class='btn purple'  style='float: right'><i class='fa fa-check'></i> Envoyer</button>"
            };
        })
        .directive("mouvementstock", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
//                scope.clients = dataFactory.listClients(attrs.clients);
                    element.bind("click", function ($event) {
                        $event.preventDefault();
//                        setInterval(function () {
                        if ($("#DateDebutStock").val() === "") {
                            toastr.info('Veuillez choisir la date de debut');
                        } else if ($("#DateFinStock").val() === "") {
                            toastr.info('Veuillez choisir la date de fin');
                        } else {
                            $("tbody#list-client").empty();
//                            var first_date = new Date($("#DateDebutAchat").val() + " 00:00:00");
//                            var last_date = new Date($("#DateFinAchat").val() + " 23:59:59");
                            var jourDebut = $("#DateDebutStock").val().split('-')[0];
                            var moisDebut = $("#DateDebutStock").val().split('-')[1];
                            var anneeDebut = $("#DateDebutStock").val().split('-')[2];
                            var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                            var jourFin = $("#DateFinStock").val().split('-')[0];
                            var moisFin = $("#DateFinStock").val().split('-')[1];
                            var anneeFin = $("#DateFinStock").val().split('-')[2];
                            var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
                            var DataStock = {
                                Stock: {
                                    product_id: $("#ProductID :selected").val(),
                                    qte: $("#Qte").val(),
                                    first_date: date_debut,
                                    last_date: date_fin
                                }
                            };
                            scope.mouvementstock = PostFactory.mouvementStock(DataStock).then(function (mouvementstock) {
                                scope.mouvementstock = mouvementstock;
                                $("#NameProduct").html("<strong>Nom de produit: <strong><label class='label label-success'>" + $("#ProductID :selected").text() + "</label>");
                                $(mouvementstock).each(function (index, value) {
                                    angular.element(document.getElementById('list-client')).append($compile("<tr class='odd gradeX " + value.full_name + "' id='ClientRows' data-index='" + value.user_id + "'>\n\
                                                <td><a href='#/fiche-client/" + value.user_id + "' target='_blank'>" + value.full_name + "</a></td>\n\
                                                <td>" + value.phone + "</td>\n\
                                                <td>" + value.adress + "</td>\n\
                                                <td>" + value.raison_social + "</td>\n\
                                                <td>" + value.qte + "</td>\n\
                                                </tr>")(scope));
                                });
                            });
                        }
                    });
                },
                controller: function ($scope, PostFactory, $element) {
                    // start action list produits
                    $scope.products = PostFactory.listProducts().then(function (products) {
                        $scope.products = products;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }

            };
        })

        //  etat comparatif achats ventes
        .directive("etatcomparatifachatsventes", function () {
            return {
                restrict: "E",
                template: "<button type='submit' comparatifachatsventes id='comparatifAchatsVentes' class='btn purple'  style='float: right'><i class='fa fa-check'></i> Envoyer</button>"
            };
        })
        .directive("comparatifachatsventes", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
//                scope.clients = dataFactory.listClients(attrs.clients);
                    element.bind("click", function ($event) {
                        $event.preventDefault();
//                        setInterval(function () {
                        if ($("#DateDebutAchat").val() === "") {
                            toastr.info('Veuillez choisir la date de debut');
                        } else if ($("#DateFinAchat").val() === "") {
                            toastr.info('Veuillez choisir la date de fin');
                        } else {
                            var jourDebut = $("#DateDebutAchat").val().split('-')[0];
                            var moisDebut = $("#DateDebutAchat").val().split('-')[1];
                            var anneeDebut = $("#DateDebutAchat").val().split('-')[2];
                            var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                            var jourFin = $("#DateFinAchat").val().split('-')[0];
                            var moisFin = $("#DateFinAchat").val().split('-')[1];
                            var anneeFin = $("#DateFinAchat").val().split('-')[2];
                            var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
                            $("tbody#list-factures-ventes").empty();
                            $("tbody#list-factures-achat").empty();
//                            var first_date = new Date($("#DateDebutAchat").val() + " 00:00:00");
//                            var last_date = new Date($("#DateFinAchat").val() + " 23:59:59");
                            var first_date = new Date(date_debut + " 00:00:00");
                            var last_date = new Date(date_fin + " 23:59:59");
//                            var DataFournisseur = {
//                                Data: []
//                            };
                            var ht_fournisseur = 0;
                            var chart = null;
//                            DataFournisseur.Data.push({y: ht, name: value.Fournisseur.name, legendMarkerType: "triangle"});
                            var dataInterval = {
                                Facture: {
                                    first_date: first_date,
                                    last_date: last_date
                                }
                            };
                            scope.loadSalesAchats = PostFactory.loadSalesAchat(dataInterval).then(function (statsachats) {
//                    var chart = null;
                                //console.log(statsachats);
                                if (statsachats.length !== 0) {
                                    var chart = new CanvasJS.Chart("chartContainerAchatFournisseur",
                                            {
                                                title: {
                                                    text: "Statistique des achats/fournisseur",
                                                    fontFamily: "arial black",
                                                    fontSize: 14
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
                            scope.loadSalesVentes = PostFactory.loadSalesVentes(dataInterval).then(function (statsventes) {
                                //                    var chart = null;
                                //console.log(statsventes);
                                if (statsventes.stats.length !== 0) {
                                    var chart = new CanvasJS.Chart("chartContainerVentesUser",
                                            {
                                                title: {
                                                    text: "Statistique des ventes/client",
                                                    fontFamily: "arial black",
                                                    fontSize: 14
                                                },
                                                animationEnabled: true,
                                                legend: {
                                                    verticalAlign: "bottom", horizontalAlign: "center"
                                                }, theme: "theme1",
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
                                                        dataPoints: statsventes.stats
                                                    }
                                                ]
                                            });
                                    chart.render();
                                }
                                $(statsventes.ventes).each(function (index, value) {
                                    var ht = 0;
                                    var ttc = 0;
                                    var marge = 0;
                                    $(value.Bon).each(function (i, v) {
                                        ht = ht + v.last_unit_price * v.qte;
                                        ttc = ttc + v.last_unit_price * v.qte * (1 - v.remise / 100) * (1 + v.Product.Tva.value / 100);
//                                        marge = marge + ((v.last_unit_price - v.prix_achat) * v.qte * (1 - v.remise / 100) * (1 + v.Product.Tva.value / 100));
                                    });
                                    ////console.log(total_reglement);   
                                    angular.element(document.getElementById('list-factures-ventes')).append($compile("<tr class='odd gradeX' id='FacturesVentesRows'>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                 <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                 <td>" + parseFloat(ttc * (1 - value.Commande.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + value.Commande.modified + "</td>\n\
                                                <td><a href='#/view-commande/" + value.Commande.id + "' class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                });
                            });
                            $(scope.facturesAchat).each(function (index, value) {
                                var date_created = new Date(value.Facture.created);
                                ////console.log(date_created);
                                var fournisseur_id = $("#FournisseurID :selected").val();
                                var ht = 0;
                                var ttc = 0;
                                var marge = 0;
                                $(value.Product).each(function (i, v) {
                                    ht = ht + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte;
                                    ttc = ttc + v.FacturesProduct.last_unit_price * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * (1 + v.Tva.value / 100);
                                    marge = marge + ((v.FacturesProduct.last_unit_price - v.prix_achat) * v.FacturesProduct.qte * (1 - v.FacturesProduct.remise / 100) * (1 + v.Tva.value / 100));
                                });
                                ////console.log(total_reglement);   
                                if (date_created < last_date && first_date < date_created) {
                                    angular.element(document.getElementById('list-factures-achat')).append($compile("<tr class='odd gradeX " + value.Fournisseur.name + "' id='FacturesAchatRows' data-index='" + value.Fournisseur.id + "'>\n\
                                                <td>" + value.Facture.code_facture + "</td>\n\
                                                <td id='" + value.Fournisseur.name + "' data-data-id='" + value.Fournisseur.id + "'>" + value.Fournisseur.name + "</td>\n\
                                                 <td>" + parseFloat(ht).toFixed(3) + "</td>\n\
                                                 <td>" + parseFloat(ttc * (1 - value.Facture.remise_globale / 100)).toFixed(3) + "</td>\n\
                                                <td>" + value.Facture.created + "</td>\n\
                                                <td><a href='#/view-facture-achat/" + value.Facture.id + "' class='btn btn-info btn-sm'><i class='fa fa-eye fa-2x'></i></a></td>\n\
                                                </tr>")(scope));
                                }
                            });
                            setTimeout(function () {
                                var total_ht_achat = 0;
                                var total_ttc_achat = 0;
                                var total_ht_vente = 0;
                                var total_ttc_vente = 0;
                                $('tr#FacturesAchatRows').each(function (i, v) {
                                    total_ht_achat = total_ht_achat + parseFloat($.trim($(v).children().eq(2).text()));
                                    total_ttc_achat = total_ttc_achat + parseFloat($.trim($(v).children().eq(3).text()));
                                });
                                $('tr#FacturesVentesRows').each(function (i, v) {
                                    total_ht_vente = total_ht_vente + parseFloat($.trim($(v).children().eq(2).text()));
                                    total_ttc_vente = total_ttc_vente + parseFloat($.trim($(v).children().eq(3).text()));
                                });
                                var marge_ht = parseFloat(total_ht_vente) - parseFloat(total_ht_achat);
                                var marge_ttc = parseFloat(total_ttc_vente) - parseFloat(total_ttc_achat);
                                //console.log(total_ht_achat);
                                //console.log(total_ht_vente);
                                //console.log(total_ttc_achat);
                                //console.log(total_ttc_vente);
                                $("#Total_Ht_Achat").text(parseFloat(total_ht_achat).toFixed(3));
                                $("#Total_Ht_Vente").text(parseFloat(total_ht_vente).toFixed(3));
                                $("#Total_TTC_Achat").text(parseFloat(total_ttc_achat).toFixed(3));
                                $("#Total_TTC_Vente").text(parseFloat(total_ttc_vente).toFixed(3));
                                $("#Marge_HT").text(parseFloat(marge_ht).toFixed(3));
                                $("#Marge_TTC").text(parseFloat(marge_ttc).toFixed(3));
                            }, 2500);
//                            setTimeout(function () {
                            var dataFacture = {
                                Stat: {
                                    first_date: first_date,
                                    last_date: last_date
                                }
                            };
                            scope.loadSalesGlobalComparatif = PostFactory.loadSalesGlobalComparatif(dataFacture).then(function (statscoparatifs) {
                                //console.log(dataFacture);
                                var chart = new CanvasJS.Chart("chartContainerComaratifGlobal",
                                        {
                                            title: {
                                                text: "État comparatif global achats & ventes"
                                            },
                                            animationEnabled: true,
                                            axisY: {
                                                titleFontFamily: "arial",
                                                titleFontSize: 12,
                                                includeZero: false
                                            },
                                            toolTip: {
                                                shared: true
                                            },
                                            data: [
                                                {
                                                    type: "spline",
                                                    name: "Achats",
                                                    showInLegend: true,
                                                    dataPoints: statscoparatifs.achats
                                                },
                                                {
                                                    type: "spline",
                                                    name: "Ventes",
                                                    showInLegend: true,
                                                    dataPoints: statscoparatifs.ventes
                                                }
                                            ],
                                            legend: {
                                                cursor: "pointer",
                                                itemclick: function (e) {
                                                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                                        e.dataSeries.visible = false;
                                                    } else {
                                                        e.dataSeries.visible = true;
                                                    }
                                                    chart.render();
                                                }
                                            }
                                        });
                                chart.render();
                            });
//                            }, 1200);
                        }
//                        }, 1000);
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    // start action list factures achat 
                    $scope.facturesAchat = PostFactory.listFacturesAchat().then(function (facturesAchat) {
                        $scope.facturesAchat = facturesAchat;
                        ////console.log(facturesAchat);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // end action list factures achat 
                }

            };
        })
        //Directive for adding buttons on click that show an alert on click
        .directive("customSelectFilterProduct", function () {
            return {
                restrict: "E",
                template: '<select filterproduct id="first-disabled2" class="selectpicker" title="Type calcul" multiple data-hide-disabled="true" data-size="5">\n\
                            <option></option>\n\
                            <option value="Stockable">Stockable</option>\n\
                            <option value="Consommable">Consommable</option>\n\
                            <option value="Service">Service</option>\n\
                        </select>'
            };
        })
        .directive("filterproduct", function ($compile) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        //console.log('here');
                        $("#FilterShow").empty();
                        var type = $("#first-disabled2 :selected").val();
                        $(scope.listproduits).each(function (index, value) {
                            setTimeout(function () {
                                $('.bootstrap-select button.dropdown-toggle').attr('title').split(",");
                                $($('.bootstrap-select button.dropdown-toggle').attr('title').replace(" ", "").split(",")).each(function (i, v) {
                                    console.log(v);
                                    if (v === "Typecalcul") {
                                        angular.element(document.getElementById('FilterShow')).append($compile('\
                                            <div class="col-md-4">\n\
                                            <div class="panel panel-primary">\n\
                                             <div class="oe_kanban_details">\n\
                                                 <div class="panel-heading" style="height: 60px;font-size: 13px;"><strong>' + value.name + '</strong></div>\n\
                                                 <div class="panel-body" style="height: 180px;padding: 7px 0px 0px 3px;">\n\
                                                     <div class="col-md-4" style="padding: 0;">\n\
                                                         <img src="http://api.colisexpress.tn/img/' + value.url + '" class="thumbnail center-block img-responsive " />\n\
                                                     </div>\n\
                                                     <div class="col-md-8" style="padding: 0 0 0 3px;">\n\
                                                         <ul class="list-group">\n\
                                                             <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Référence Produit :</strong> <span>' + value.ref + '</span></li>\n\
                                                             <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Fournisseur :</strong> ' + value.Fournisseur.name + '</li>\n\
                                                             <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Catégorie :</strong> ' + value.Category.name + '</li>\n\
                                                             <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Famille :</strong> ' + value.Famille.name + '</li>\n\
                                                         </ul>\n\
                                                     </div>\n\
                                                 </div>\n\
                                             <div class="panel-footer" style="height: 50px;">\n\
                                                 <ul class="nav nav-pills pull-right">\n\
                                                     <li>\n\
                                                         <div ng-click="editProduct(' + value.id + ')">\n\
                                                             <a href="#/edit-product/' + value.id + '" class="btn btn-sm btn-success"><i class="fa fa-pencil"></i></a>\n\
                                                         </div>\n\
                                                     </li>\n\
                                                     <li>\n\
                                                     <div ng-controller="ModalCtrl">\n\
                                                         <button id="productSumbit" data-index="' + index + '" data-product="' + value.id + '"  ng-click="open(' + value.id + '"," ' + index + ')" data-name="' + value.name + '" data-cmd="' + value.id + '" class="btn btn-danger btn-embossed btn-sm">\n\
                                                         <i class="fa fa-times"></i></button>\n\
                                                     </div>\n\
                                                     </li>\n\
                                                 </ul>\n\
                                             <div class="clearfix"></div>\n\
                                             </div>\n\
                                             </div>\n\
                                             </div>\n\
                                             </div>')(scope));
                                    } else if (v === value.type) {
                                        angular.element(document.getElementById('FilterShow')).append($compile('\
                                                           <div class="col-md-4">\n\
                                                           <div class="panel panel-primary">\n\
                                                            <div class="oe_kanban_details">\n\
                                                                <div class="panel-heading" style="height: 60px;font-size: 13px;"><strong>' + value.name + '</strong></div>\n\
                                                                <div class="panel-body" style="height: 180px;padding: 7px 0px 0px 3px;">\n\
                                                                    <div class="col-md-4" style="padding: 0;">\n\
                                                                        <img src="http://api.colisexpress.tn/img/' + value.url + '" class="thumbnail center-block img-responsive " />\n\
                                                                    </div>\n\
                                                                    <div class="col-md-8" style="padding: 0 0 0 3px;">\n\
                                                                        <ul class="list-group">\n\
                                                                            <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Référence Produit :</strong> <span>' + value.ref + '</span></li>\n\
                                                                            <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Fournisseur :</strong> ' + value.Fournisseur.name + '</li>\n\
                                                                            <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Catégorie :</strong> ' + value.Category.name + '</li>\n\
                                                                            <li class="list-group-item" style=" line-height: 16px;font-size: 12px;"><strong>Famille :</strong> ' + value.Famille.name + '</li>\n\
                                                                        </ul>\n\
                                                                    </div>\n\
                                                                </div>\n\
                                                            <div class="panel-footer" style="height: 50px;">\n\
                                                                <ul class="nav nav-pills pull-right">\n\
                                                                    <li>\n\
                                                                        <div ng-click="editProduct(' + value.id + ')">\n\
                                                                            <a href="#/edit-product/' + value.id + '" class="btn btn-sm btn-success"><i class="fa fa-pencil"></i></a>\n\
                                                                        </div>\n\
                                                                    </li>\n\
                                                                    <li>\n\
                                                                    <div ng-controller="ModalCtrl">\n\
                                                                        <button id="productSumbit" data-index="' + index + '" data-product="' + value.id + '"  ng-click="open(' + value.id + '"," ' + index + ')" data-name="' + value.name + '" data-cmd="' + value.id + '" class="btn btn-danger btn-embossed btn-sm">\n\
                                                                        <i class="fa fa-times"></i></button>\n\
                                                                    </div>\n\
                                                                    </li>\n\
                                                                </ul>\n\
                                                            <div class="clearfix"></div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                                    }
                                });
                            }, 500);
                        });
                    });
                },
                controller: function ($scope, PostFactory, $element, $location) {
                    $scope.stocks = PostFactory.listStocks().then(function (stocks) {
                        $scope.stocks = stocks;
                        //console.log('stocks');
                        //console.log(stocks);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    var id = parseInt($location.path().split('/')[2]);
                    if (id) {
                        $scope.currentStock = PostFactory.viewStock(id).then(function (stock) {
                            $scope.currentStock = stock;
                            //console.log(stock);
                            $scope.listproduits = stock.StockProduct;
                            //console.log(stock.StockProduct);
                        });
                    }
                }
            };
        })
        .directive("addbuttonscommandeachat", function () {
            return {
                restrict: "E",
                template: "<i addcommandeachat id='addCommandeAchat' class='glyphicon glyphicon-plus btn btn-info btn-sm btn-embossed icon' style='width: 35px !important;height: 25px !important;position: relative;right: 30px;'></i>"
            }
        })
        //Directive for adding buttons on click that show an alert on click
        .directive("addcommandeachat", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
                    element.bind("click", function () {
                        var qte = $("#Qte").val();
//                    ////console.log(qte);
                        var qteInt = parseInt($("#Qte").val());
                        if ($(".custom-combobox-input").val() == "") {
                            toastr.success('Veuillez choisir un produit');
                        }
                        if (qteInt == 0 || qte == "") {
                            toastr.success('Veuillez donner une QTE');
                        }
                        if (qte > 0 && $(".custom-combobox-input").val() != "") {
                            if ($("#SelectNewTva").is(":visible") == true) {
//                                scope.ajoutProduct = function ($event) {
//                                    $event.preventDefault();
                                var dataProduct = {
                                    Product: {
                                        name: $(".custom-combobox-input").val(),
                                        price: $("#NewPrixUnit").val(),
                                        marge: 0,
                                        prix_achat: $("#Prix_Achat").val(),
                                        ref: $("#NewRef").val(),
                                        tva_id: $('#NewTva :selected').val(),
                                        fournisseur_id: $('#NewFournisseur :selected').val(),
                                        famille_id: $('#NewFamille :selected').val(),
                                        category_id: $('#NewCategory :selected').val()
                                    }
                                };
                                scope.product = PostFactory.ajoutProduct(dataProduct).then(function (product) {
                                    scope.product = product;
                                    setTimeout(function () {
                                        angular.element(document.getElementById('commande-produit')).append($compile("<tr data-id='" + product.LastId + "' data-price='" + $("#NewPrixUnit").val() + "' id='itemFactureProduct'>\n\
                                        <td style='text-align: left !important;'>" + $.trim($(".custom-combobox-input").val()) + "</td>\n\
                                        <td style='text-align: left !important;'>" + $("#Qte").val() + "</td>\n\
                                        <td style='text-align: left !important;'>" + $("#QteReçue").val() + "</td>\n\
                                        <td style='text-align: left !important;'>" + $("#Remise").val() + "</td>\n\
                                        <td style='text-align: left !important;'>" + $("#Prix_Achat").val() + "</td>\n\
                                        <td style='text-align: left !important;'><div id='deleteItem' ng-click='removeItem()'><i style='color: #34aadc;cursor: pointer;' class='fa fa-times fa-2x'></i></div></td>\n\
                                        </tr>")(scope));
                                        $("#SelectNewTva").hide();
                                        $("#Qte").val("");
                                        $(".custom-combobox-input").val("");
                                    }, 500);
                                },
                                        function (msg) {
                                            alert(msg);
                                        });
//                                };
//                                setTimeout(function () {

//                                }, 500);
                            } else {
                                angular.element(document.getElementById('commande-produit')).append($compile("<tr data-data-id='" + $("#combobox :selected").val() + "' data-price='" + $("#combobox :selected").attr('data-price') + "' data-bon='0' id='itemCommandeAchat'>\n\
                                <td style='text-align: left !important;'>" + $.trim($("#combobox :selected").text()) + "</td>\n\
                                <td style='text-align: left !important;'><div class='input-group'><span class='input-group-addon'><i class='fa fa-check'></i></span>\n\
                                            <input type='number' min='1' id='QteLivrais' placeholder='Quantité' value='" + $("#Qte").val() + "' name='Quantité' class='form-control' />\n\
                                </div></td>\n\
                                <td style='text-align: left !important;'>" + $("#QteReçue").val() + "</td>\n\
                                <td style='text-align: left !important;'>" + $("#Remise").val() + "</td>\n\
                                <td style='text-align: left !important;'>" + $("#Prix_Unitaire").val() + "</td>\n\
                                <td style='text-align: left !important;'><div id='deleteItem' ng-click='removeItem()'><i style='color: #34aadc;cursor: pointer;' class='fa fa-times fa-2x'></i></div></td>\n\
                                </tr>")(scope));
                                $("#Qte").val("");
                                $(".custom-combobox-input").val("");
                            }
                        }
                    });
                },
                controller: function ($scope, PostFactory, $element, $location) {
                    // ajout commande achat
                    $scope.ajoutCommandeAchat = function ($event, $val) {
                        $event.preventDefault();
                        var dataFacture = {
                            Commande: {
                                fournisseur_id: $("#fournisseurID :selected").val(),
                                isDemandeprix: $val
                            },
                            Bon: []
                        };
                        $('tr#itemCommandeAchat').each(function (i, v) {
                            dataFacture.Bon.push({product_id: parseInt($(v).attr('data-data-id')), qte: $(v).children().eq(1).children().children().eq(1).val(), qte_recue: $(v).children().eq(2).text(), remise: $(v).children().eq(3).text(), last_unit_price: $(v).children().eq(4).text()});
                        });
                        $scope.commandeAdd = PostFactory.ajoutCommandeAchat(dataFacture).then(function (commandeAchat) {
                            $scope.commandeAdd = commandeAchat;
//                            $("#commande-produit").empty();
                            toastr.success(commandeAchat.text);
                            //console.log(commandeAchat.lastId);
                            if ($val == 0) {
                                $location.path("/gestion-commandes-achat");
                            }
                            if ($val == 1) {
                                $location.path("/gestion-demande-prix");
                            }
//                            else {
//                                $location.path("/gestion-demande-prix");
//                            }
//                            $location.path("/confirm-commande-achat/" + commandeAchat.lastId);
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    };
                    // edit commande achat
                    var id = parseInt($location.path().split('/')[2]);
                    if (id) {
                        $scope.editCommandeAchat = function ($event) {
                            $event.preventDefault();
                            var dataFacture = {
                                Commande: {
                                    id: id,
                                    fournisseur_id: $("#fournisseurID :selected").val()
                                },
                                Bon: []
                            };
                            $('tr#itemCommandeAchat').each(function (i, v) {
                                dataFacture.Bon.push({bon_id: parseInt($(v).attr('data-bon')), product_id: parseInt($(v).attr('data-data-id')), qte: $(v).children().eq(1).children().children().eq(1).val(), qte_recue: $(v).children().eq(2).text(), remise: $(v).children().eq(3).text(), last_unit_price: $(v).children().eq(4).text()});
                            });
                            $scope.commandeAchatEdit = PostFactory.editCommandeAchat(dataFacture).then(function (commandeAchatEdit) {
                                $scope.commandeAchatEdit = commandeAchatEdit;
//                            $("#commande-produit").empty();
                                toastr.success(commandeAchatEdit.text);
//                            //console.log(commandeAchat.lastId);
                                $location.path("/confirm-commande-achat/" + id);
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        };
                    }
                }
            };
        })
        //Calcul stock
        .directive("customSelectStock", function () {
            return {
                restrict: "E",
                template: '<select selectstock class="selectpicker" empty="Select Type Calcul..." style="height: 42px; width: 100%"  ng-model="selectedNameStock" id="SelectStock">\n\
                            <option value="">Select Type Calcul...</option>\n\
                            <option value="apprivisonnementHT">Approvisionnement en HT</option>\n\
                            <option value="apprivisonnementTTC">Approvisionnement en TTC</option>\n\
                            <option value="sortieachatHT">Sortie au prix achat HT</option>\n\
                            <option value="sortieachatTTC">Sortie au prix achat TTC</option>\n\
                            <option value="sortieventeHT">Sortie au prix vente HT</option>\n\
                            <option value="sortieventeTTC">Sortie au prix vente TTC</option>\n\
                            <option value="restantachatHT">Restant au prix achat HT</option>\n\
                            <option value="restantachatTTC">Restant au prix achat TTC</option>\n\
                            <option value="restantventeHT">Restant au prix vente HT</option>\n\
                            <option value="restantventeTTC">Restant au prix vente TTC</option>\n\
                        </select>'
            };
        })
        .directive("selectstock", function ($compile) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        //console.log('here');
                        $("#CalculStock").empty();
                        var jourDebut = $("#DateDebut").val().split('-')[0];
                        var moisDebut = $("#DateDebut").val().split('-')[1];
                        var anneeDebut = $("#DateDebut").val().split('-')[2];
                        var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                        var jourFin = $("#DateFin").val().split('-')[0];
                        var moisFin = $("#DateFin").val().split('-')[1];
                        var anneeFin = $("#DateFin").val().split('-')[2];
                        var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
                        if ($("#DateDebut").val() == '' || $("#DateFin").val() == '') {
                            // entree 
                            var total_ht_achat = 0;
                            var total_ht = 0;
                            var total_ttc_achat = 0;
                            var total_ttc = 0;
//                            sortie
                            var total_ht_achat_sortant = 0;
                            var total_vente_ht_sortant = 0;
                            var total_ttc_achat_sortant = 0;
                            var total_vente_ttc_sortant = 0;
//                            restant
                            var total_restant_achat_ht = 0;
                            var total_vente_restant_ht = 0;
                            var total_vente_restant_ttc = 0;
                            var total_achat_restant_ttc = 0;
                            $(scope.listproduits).each(function (i, v) {
                                // entree
                                var qte = v.ProductsStock.qte;
                                var qte_sortant = -v.countOut;
                                var qte_restant = v.ProductsStock.qte - v.countOut;
                                var ht_achat = v.prix_achat;
                                var ttc_achat = v.prix_achat * (1 + v.Tva.value / 100);
                                var ht_vente = v.price;
                                var ttc_vente = v.price * (1 + v.Tva.value / 100);
                                total_ht = total_ht + parseFloat(ht_achat) * qte;
                                total_ttc = total_ttc + parseFloat(ttc_achat) * qte;
//                                total_ttc_achat = total_ttc_achat + parseFloat($(v).attr('data-achat-ttc')) * $(v).attr('data-qte');
//                              sortie
                                total_ht_achat_sortant = total_ht_achat_sortant + parseFloat(ht_achat) * qte_sortant;
                                total_ttc_achat_sortant = total_ttc_achat_sortant + parseFloat(ttc_achat) * qte_sortant;
                                total_vente_ht_sortant = total_vente_ht_sortant + parseFloat(ht_vente) * qte_sortant;
                                total_vente_ttc_sortant = total_vente_ttc_sortant + parseFloat(ttc_vente) * qte_sortant;
                                //  restant
                                total_restant_achat_ht = total_restant_achat_ht + parseFloat(ht_achat) * qte_restant;
                                total_achat_restant_ttc = total_achat_restant_ttc + parseFloat(ttc_achat) * qte_restant;
                                total_vente_restant_ht = total_vente_restant_ht + parseFloat(ht_vente) * qte_restant;
                                total_vente_restant_ttc = total_vente_restant_ttc + parseFloat(ttc_vente) * qte_restant;
                            });
                            //console.log(total_ht);
                            //console.log(total_ttc);
                            //console.log(total_ht_achat_sortant);
                            //console.log(total_ttc_achat_sortant);
                            //console.log(total_vente_ht_sortant);
                            //console.log(total_restant_achat_ht);
                            //console.log(total_achat_restant_ttc);
                            //console.log(total_vente_restant_ht);
                            //console.log(total_vente_restant_ttc);
                            if ($('#SelectStock :selected').val() === 'apprivisonnementHT') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Apprivisonnement en HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_ht).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'apprivisonnementTTC') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Apprivisonnement en TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_ttc).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'sortieachatHT') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Sortie au prix achat HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_ht_achat_sortant).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'sortieachatTTC') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Sortie au prix achat TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_ttc_achat_sortant).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'sortieventeHT') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Sortie au prix vente HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_vente_ttc_sortant).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'sortieventeTTC') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Sortie au prix vente TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_restant_achat_ht).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'restantachatHT') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Restant au prix achat HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_restant_achat_ht).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'restantachatTTC') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Restant au prix achat TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_achat_restant_ttc).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'restantventeHT') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Restant au prix vente HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_vente_restant_ht).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'restantventeTTC') {
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Restant au prix vente TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_vente_restant_ttc).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                        } else {
                            // entree 
                            var total_ht_achat = 0;
                            var total_ht = 0;
                            var total_ttc_achat = 0;
                            var total_ttc = 0;
//                            sortie
                            var total_ht_achat_sortant = 0;
                            var total_vente_ht_sortant = 0;
                            var total_ttc_achat_sortant = 0;
                            var total_vente_ttc_sortant = 0;
//                            restant
                            var total_restant_achat_ht = 0;
                            var total_vente_restant_ht = 0;
                            var total_vente_restant_ttc = 0;
                            var total_achat_restant_ttc = 0;
                            var jourDebut = $("#DateDebut").val().split('-')[0];
                            var moisDebut = $("#DateDebut").val().split('-')[1];
                            var anneeDebut = $("#DateDebut").val().split('-')[2];
                            var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                            var jourFin = $("#DateFin").val().split('-')[0];
                            var moisFin = $("#DateFin").val().split('-')[1];
                            var anneeFin = $("#DateFin").val().split('-')[2];
                            var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
                            var first_date = new Date(date_debut + " 00:00:00");
                            var last_date = new Date(date_fin + " 23:59:59");
                            $(scope.listproduits).each(function (i, v) {
                                var date_created = new Date(v.created)
                                //console.log(first_date);
                                //console.log(last_date);
                                //console.log(date_created);
                                if (date_created < last_date && first_date < date_created) {
                                    //console.log('yees');
                                    // entree
                                    var qte = v.ProductsStock.qte;
                                    var qte_sortant = -v.countOut;
                                    var qte_restant = v.ProductsStock.qte - v.countOut;
                                    var ht_achat = v.prix_achat;
                                    var ttc_achat = v.prix_achat * (1 + v.Tva.value / 100);
                                    var ht_vente = v.price;
                                    var ttc_vente = v.price * (1 + v.Tva.value / 100);
                                    total_ht = total_ht + parseFloat(ht_achat) * qte;
                                    total_ttc = total_ttc + parseFloat(ttc_achat) * qte;
//                                total_ttc_achat = total_ttc_achat + parseFloat($(v).attr('data-achat-ttc')) * $(v).attr('data-qte');
//                              sortie
                                    total_ht_achat_sortant = total_ht_achat_sortant + parseFloat(ht_achat) * qte_sortant;
                                    total_ttc_achat_sortant = total_ttc_achat_sortant + parseFloat(ttc_achat) * qte_sortant;
                                    total_vente_ht_sortant = total_vente_ht_sortant + parseFloat(ht_vente) * qte_sortant;
                                    total_vente_ttc_sortant = total_vente_ttc_sortant + parseFloat(ttc_vente) * qte_sortant;
                                    //  restant
                                    total_restant_achat_ht = total_restant_achat_ht + parseFloat(ht_achat) * qte_restant;
                                    total_achat_restant_ttc = total_achat_restant_ttc + parseFloat(ttc_achat) * qte_restant;
                                    total_vente_restant_ht = total_vente_restant_ht + parseFloat(ht_vente) * qte_restant;
                                    total_vente_restant_ttc = total_vente_restant_ttc + parseFloat(ttc_vente) * qte_restant;
                                }
                            });
                            //console.log(total_ht);
                            //console.log(total_ttc);
                            //console.log(total_ht_achat_sortant);
                            //console.log(total_ttc_achat_sortant);
                            //console.log(total_vente_ht_sortant);
                            //console.log(total_restant_achat_ht);
                            //console.log(total_achat_restant_ttc);
                            //console.log(total_vente_restant_ht);
                            //console.log(total_vente_restant_ttc);

                            if ($('#SelectStock :selected').val() === 'apprivisonnementHT') {
                                var label = 'Apprivisonnement en HT';
                                var value = parseFloat(total_ht).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Apprivisonnement en HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_ht).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'apprivisonnementTTC') {
                                var label = 'Apprivisonnement en TTC';
                                var value = parseFloat(total_ttc).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Apprivisonnement en TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_ttc).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'sortieachatHT') {
                                var label = 'Sortie au prix achat HT';
                                var value = parseFloat(total_ht_achat_sortant).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Sortie au prix achat HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_ht_achat_sortant).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'sortieachatTTC') {
                                var label = 'Sortie au prix achat TTC';
                                var value = parseFloat(total_ttc_achat_sortant).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Sortie au prix achat TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_ttc_achat_sortant).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'sortieventeHT') {
                                var label = 'Sortie au prix vente HT';
                                var value = parseFloat(total_vente_ttc_sortant).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Sortie au prix vente HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_vente_ttc_sortant).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'sortieventeTTC') {
                                var label = 'Sortie au prix vente TTC';
                                var value = parseFloat(total_restant_achat_ht).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Sortie au prix vente TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_restant_achat_ht).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'restantachatHT') {
                                var label = 'Restant au prix achat HT';
                                var value = parseFloat(total_restant_achat_ht).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Restant au prix achat HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_restant_achat_ht).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'restantachatTTC') {
                                var label = 'Restant au prix achat TTC';
                                var value = parseFloat(total_achat_restant_ttc).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Restant au prix achat TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_achat_restant_ttc).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'restantventeHT') {
                                var label = 'Restant au prix vente HT';
                                var value = parseFloat(total_vente_restant_ht).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Restant au prix vente HT</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_vente_restant_ht).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                            if ($('#SelectStock :selected').val() === 'restantventeTTC') {
                                var label = 'Restant au prix vente TTC';
                                var value = parseFloat(total_vente_restant_ttc).toFixed(3);
                                angular.element(document.getElementById('CalculStock')).append($compile('\
                                                            <div class="col-md-12">\n\
                                                            <div class="panel panel-default">\n\
                                                            <div class="panel-heading">\n\
                                                            <h3 class="panel-title"><strong>Restant au prix vente TTC</strong></h3>\n\
                                                            </div>\n\
                                                            <div class="panel-body">\n\
                                                            <div class="input-group">\n\
                                                            <span id="Total_Achat">' + parseFloat(total_vente_restant_ttc).toFixed(3) + '</span>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>\n\
                                                            </div>')(scope));
                            }
                        }
//                        $(scope.listproduits).each(function (index, value) {
//                                    //console.log(v);
//                        });
//                        }
//                        ;
                    });
                },
                controller: function ($scope, PostFactory, $element, $location) {
                    $scope.stocks = PostFactory.listStocks().then(function (stocks) {
                        $scope.stocks = stocks;
                        //console.log('stocks');
                        //console.log(stocks);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    var id = parseInt($location.path().split('/')[2]);
                    if (id) {
                        $scope.currentStock = PostFactory.viewStock(id).then(function (stock) {
                            $scope.currentStock = stock;
                            //console.log(stock);
                            $scope.listproduits = stock.StockProduct;
                            //console.log(stock.StockProduct);
                        });
                    }
                }
            };
        })
        //filter product in fournisseur
        .directive("customSelectFournisseurAchat", function () {
            return {
                restrict: "E",
                template: '<select selectfournisseurachat class="form-control input-xlarge select2me col-sm-12" data-placeholder="Select Fournisseur..." style="height: 42px; width: 100%" ng-model="selectedName" id="fournisseurID">\n\\n\
                            <option value=""></option>\n\
                            <option ng-repeat="item in fournisseurs" value="{{item.Fournisseur.id}}">{{item.Fournisseur.name}}</option>\n\
                        </select>'
            };
        })
        .directive("selectfournisseurachat", function ($compile) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        if ($("#fournisseurID :selected").text() === "") {
                            toastr.success('Veuillez choisir un fournisseur');
                        } else {
                            var fournisseur_id = $("#fournisseurID :selected").val();
                            $("#combobox").empty();
                            $(scope.products).each(function (index, value) {
                                if (value.Product.fournisseur_id === fournisseur_id) {
                                    angular.element(document.getElementById('combobox')).append($compile('<option value="' + value.Product.id + '" data-price="' + value.Product.prix_achat + '">' + value.Product.name + '</option>')(scope));
                                }
                            });
                        }
                    });
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.fournisseurs = PostFactory.listFournisseur().then(function (fournisseurs) {
                        $scope.fournisseurs = fournisseurs;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    $scope.products = PostFactory.listProducts().then(function (products) {
                        $scope.products = products;
                        ////console.log(products);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
        })
        //  etat facture Achat
        .directive("mouvementstockcommandesproduct", function () {
            return {
                restrict: "E",
                template: "<button type='submit' stockcommandesproduct id='stockcommandesproduct' class='btn purple'  style='float: right'><i class='fa fa-check'></i> Envoyer</button>"
            };
        })
        .directive("stockcommandesproduct", function ($compile, PostFactory, $location) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("click", function ($event) {
                        $event.preventDefault();
                        if ($("#DateDebutAchat").val() === "") {
                            toastr.info('Veuillez choisir la date de debut');
                        } else if ($("#DateFinAchat").val() === "") {
                            toastr.info('Veuillez choisir la date de fin');
                        } else {
                            var id = parseInt($location.path().split('/')[2]);
                            console.log(id);
                            var jourDebut = $("#DateDebutAchat").val().split('-')[0];
                            var moisDebut = $("#DateDebutAchat").val().split('-')[1];
                            var anneeDebut = $("#DateDebutAchat").val().split('-')[2];
                            var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                            var jourFin = $("#DateFinAchat").val().split('-')[0];
                            var moisFin = $("#DateFinAchat").val().split('-')[1];
                            var anneeFin = $("#DateFinAchat").val().split('-')[2];
                            var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
                            $("tbody#list-commandes-product").empty();
                            var first_date = new Date(date_debut + " 00:00:00");
                            var last_date = new Date(date_fin + " 23:59:59");
                            if ($("#TypeID :selected").val() === "ventes") {
                                $(scope.commandesventesfinaliseesproducts).each(function (index, value) {
                                    var date_created = new Date(value.Commande.modified);
                                    if (date_created < last_date && first_date < date_created) {
                                        var qte_vente = 0;
                                        $(value.Bon).each(function (i, v) {
                                            if (v.product_id == id) {
                                                qte_vente += parseFloat(v.qte);
                                            }
                                        });
                                        angular.element(document.getElementById('list-commandes-product')).append($compile("<tr class='odd gradeX' id='FacturesAchatRows'>\n\
                                                <td>" + qte_vente + "</td>\n\
                                                <td>" + value.Commande.type + "</td>\n\
                                                <td><a href='#/view-commande/" + value.Commande.id + "'>" + value.Commande.ref + "</a></td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>-</td>\n\
                                                <td>" + value.Commande.modified + "</td>\n\
                                                </tr>")(scope));
                                    }
                                });
                            }
                            if ($("#TypeID :selected").val() === "achats") {
                                $(scope.commandesachatsfinaliseesproducts).each(function (index, value) {
                                    var date_created = new Date(value.Commande.modified);
                                    if (date_created < last_date && first_date < date_created) {
                                        var qte_achat = 0;
                                        $(value.Bon).each(function (i, v) {
                                            if (v.product_id == id) {
                                                qte_achat += parseFloat(v.qte);
                                            }
                                        });
                                        angular.element(document.getElementById('list-commandes-product')).append($compile("<tr class='odd gradeX " + value.Fournisseur.name + "' id='FacturesAchatRows' data-index='" + value.Fournisseur.id + "'>\n\
                                                <td>" + qte_achat + "</td>\n\
                                                <td>" + value.Commande.type + "</td>\n\
                                                <td><a href='#/view-commande/" + value.Commande.id + "'>" + value.Commande.ref + "</a></td>\n\
                                                <td>-</td>\n\
                                                <td>" + value.Fournisseur.name + "</td>\n\
                                                <td>" + value.Commande.modified + "</td>\n\
                                                </tr>")(scope));
                                    }
                                });
                            }
                        }
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element, $location) {
                    var id = parseInt($location.path().split('/')[2]);
                    // list commande finalisee achats/produit
                    $scope.commandesachatsfinaliseesproducts = PostFactory.listCommandeAchatsFinaliseeProducts(id).then(function (commandesachatsfinaliseesproducts) {
                        $scope.commandesachatsfinaliseesproducts = commandesachatsfinaliseesproducts;
                        console.log(commandesachatsfinaliseesproducts);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // list commande finalisee ventes/produit
                    $scope.commandesventesfinaliseesproducts = PostFactory.listCommandeVentesFinaliseeProducts(id).then(function (commandesventesfinaliseesproducts) {
                        $scope.commandesventesfinaliseesproducts = commandesventesfinaliseesproducts;
                        console.log(commandesventesfinaliseesproducts);
                        var dataVentes = {
                            Vente: []
                        };
                        $(commandesventesfinaliseesproducts).each(function (index, value) {
                            var mantant = 0;
                            $(value.Bon).each(function (i, v) {
                                if (v.product_id == id) {
                                    mantant += parseFloat(v.last_unit_price) * parseFloat(v.qte);
                                }
                            });
                            var modified = value.Commande.modified.split(' ')[0];
                            var date = modified.split('-')[2] + '-' + modified.split('-')[1] + '-' + modified.split('-')[0];
                            dataVentes.Vente.push({date: date, mantant: mantant.toFixed(3)});
                            console.log(dataVentes.Vente);
                        });
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    window.onload = function () {
                        var chart = new CanvasJS.Chart("chartContainer",
                                {
                                    title: {
                                        text: "Site Traffic",
                                        fontSize: 30
                                    },
                                    animationEnabled: true,
                                    axisX: {
                                        gridColor: "Silver",
                                        tickColor: "silver",
                                        valueFormatString: "DD/MMM"

                                    },
                                    toolTip: {
                                        shared: true
                                    },
                                    theme: "theme2",
                                    axisY: {
                                        gridColor: "Silver",
                                        tickColor: "silver"
                                    },
                                    legend: {
                                        verticalAlign: "center",
                                        horizontalAlign: "right"
                                    },
                                    data: [
                                        {
                                            type: "line",
                                            showInLegend: true,
                                            lineThickness: 2,
                                            name: "Visits",
                                            markerType: "square",
                                            color: "#F08080",
                                            dataPoints: [
                                                {x: new Date(2010, 0, 3), y: 650},
                                                {x: new Date(2010, 0, 5), y: 700},
                                                {x: new Date(2010, 0, 7), y: 710},
                                                {x: new Date(2010, 0, 9), y: 658},
                                                {x: new Date(2010, 0, 11), y: 734},
                                                {x: new Date(2010, 0, 13), y: 963},
                                                {x: new Date(2010, 0, 15), y: 847},
                                                {x: new Date(2010, 0, 17), y: 853},
                                                {x: new Date(2010, 0, 19), y: 869},
                                                {x: new Date(2010, 0, 21), y: 943},
                                                {x: new Date(2010, 0, 23), y: 970}
                                            ]
                                        },
                                        {
                                            type: "line",
                                            showInLegend: true,
                                            name: "Unique Visits",
                                            color: "#20B2AA",
                                            lineThickness: 2,
                                            dataPoints: [
                                                {x: new Date(2010, 0, 3), y: 510},
                                                {x: new Date(2010, 0, 5), y: 560},
                                                {x: new Date(2010, 0, 7), y: 540},
                                                {x: new Date(2010, 0, 9), y: 558},
                                                {x: new Date(2010, 0, 11), y: 544},
                                                {x: new Date(2010, 0, 13), y: 693},
                                                {x: new Date(2010, 0, 15), y: 657},
                                                {x: new Date(2010, 0, 17), y: 663},
                                                {x: new Date(2010, 0, 19), y: 639},
                                                {x: new Date(2010, 0, 21), y: 673},
                                                {x: new Date(2010, 0, 23), y: 660}
                                            ]
                                        }


                                    ],
                                    legend: {
                                        cursor: "pointer",
                                        itemclick: function (e) {
                                            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                                                e.dataSeries.visible = false;
                                            } else {
                                                e.dataSeries.visible = true;
                                            }
                                            chart.render();
                                        }
                                    }
                                });
                        chart.render();
                    }
                }

            };
        })
        .directive("addbuttonscommandeachatproduct", function () {
            return {
                restrict: "E",
                template: "<i addcommandeachatproduct id='addCommandeAchatProduct' class='glyphicon glyphicon-plus btn btn-info btn-sm btn-embossed icon' style='width: 35px !important; height: 25px !important;'></i>"
            }
        })
        //Directive for adding buttons on click that show an alert on click
        .directive("addcommandeachatproduct", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
                    element.bind("click", function () {
                        var qte = $("#Qte").val();
//                    ////console.log(qte);
                        var qteInt = parseInt($("#Qte").val());
                        if ($(".custom-combobox-input").val() == "") {
                            toastr.success('Veuillez choisir un produit');
                        }
                        if (qteInt == 0 || qte == "") {
                            toastr.success('Veuillez donner une QTE');
                        }
                        if (qte > 0 && $(".custom-combobox-input").val() != "") {
                            angular.element(document.getElementById('commande-produit')).append($compile("<tr data-data-id='" + $("#combobox :selected").val() + "' data-price='" + $("#combobox :selected").attr('data-price') + "' data-bon='0' id='itemCommandeAchat'>\n\
                                <td style='text-align: left !important;'>" + $.trim($("#combobox :selected").text()) + "</td>\n\
                                <td style='text-align: left !important;'><div class='input-group'><span class='input-group-addon'><i class='fa fa-check'></i></span>\n\
                                            <input type='number' min='1' id='QteLivrais' placeholder='Quantité' value='" + $("#Qte").val() + "' name='Quantité' class='form-control' />\n\
                                </div></td>\n\
                                <td style='text-align: left !important;'><div class='input-group'><span class='input-group-addon'><i class='fa fa-check'></i></span>\n\
                                            <input type='number' min='1' id='QteLivrais' placeholder='Quantité' value='" + $("#Remise").val() + "' name='Quantité' class='form-control' />\n\
                                </div></td>\n\
                                <td style='text-align: left !important;'><div class='input-group'><span class='input-group-addon'><i class='fa fa-check'></i></span>\n\
                                            <input type='number' min='1' id='QteLivrais' placeholder='Quantité' value='" + $("#Prix_Unitaire").val() + "' name='Quantité' class='form-control' />\n\
                                </div></td>\n\
                                <td style='text-align: left !important;'><div id='deleteItem' ng-click='removeItem()'><i style='color: #34aadc;cursor: pointer;' class='fa fa-times fa-2x'></i></div></td>\n\
                                </tr>")(scope));
                            $("#Qte").val("");
                            $(".custom-combobox-input").val("");
                        }
                    });
                },
                controller: function ($scope, PostFactory, $element, $location) {
                    $("#commande-produit").on('click', "#deleteItem", function (e) {
                        e.preventDefault();
                        $(this).parent().parent().remove();
                    });
                    // ajout commande achat
                    $scope.ajoutCommandeAchat = function ($event, $val) {
                        $event.preventDefault();
                        var dataFacture = {
                            Commande: {
                                fournisseur_id: $('#commande-produit').attr('data-fournisseur'),
                                isDemandeprix: $val
                            },
                            Bon: []
                        };
                        $('tr#itemCommandeAchat').each(function (i, v) {
                            dataFacture.Bon.push({product_id: parseInt($(v).attr('data-data-id')), qte: $(v).children().eq(1).children().children().eq(1).val(), remise: $(v).children().eq(2).children().children().eq(1).val(), last_unit_price: $(v).children().eq(3).children().children().eq(1).val()});
                        });
                        $scope.commandeAdd = PostFactory.ajoutCommandeAchat(dataFacture).then(function (commandeAchat) {
                            $scope.commandeAdd = commandeAchat;
//                            $("#commande-produit").empty();
                            toastr.success(commandeAchat.text);
                            //console.log(commandeAchat.lastId);
                            if ($val == 0) {
                                $location.path("/gestion-commandes-achat");
                            } else {
                                $location.path("/gestion-demande-prix");
                            }
//                            $location.path("/confirm-commande-achat/" + commandeAchat.lastId);
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    };
                    // edit commande achat
                    var id = parseInt($location.path().split('/')[2]);
                    if (id) {
                        $scope.editCommandeAchat = function ($event) {
                            $event.preventDefault();
                            var dataFacture = {
                                Commande: {
                                    id: id,
                                    fournisseur_id: $("#fournisseurID :selected").val()
                                },
                                Bon: []
                            };
                            $('tr#itemCommandeAchat').each(function (i, v) {
                                dataFacture.Bon.push({bon_id: parseInt($(v).attr('data-bon')), product_id: parseInt($(v).attr('data-data-id')), qte: $(v).children().eq(1).children().children().eq(1).val(), qte_recue: $(v).children().eq(2).text(), remise: $(v).children().eq(3).text(), last_unit_price: $(v).children().eq(4).text()});
                            });
                            $scope.commandeAchatEdit = PostFactory.editCommandeAchat(dataFacture).then(function (commandeAchatEdit) {
                                $scope.commandeAchatEdit = commandeAchatEdit;
//                            $("#commande-produit").empty();
                                toastr.success(commandeAchatEdit.text);
//                            //console.log(commandeAchat.lastId);
                                $location.path("/confirm-commande-achat/" + id);
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        };
                    }
                }
            };
        })
        // module contact 
        // filter commande par type espace client
        .directive("filterSelectCommandeType", function () {
            return {
                restrict: "E",
                template: '<select selectcommandetype class="selectpicker" title="Select type commande..." style="min-height: 34px !important; min-width: 200px !important" ng-model="typeCommande" id="typeCommande">\n\
                            <option value="" style="display: none;"></option>\n\
                            <option value="tous">Tous</option>\n\
                            <option value="Ramassage">Ramassage</option>\n\
                            <option value="Depot">Dépôt</option>\n\
                        </select>'
            };
        })
        .directive("selectcommandetype", function ($compile) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        var type_commande = $("#typeCommande :selected").val();
                        console.log('type_commande');
                        console.log(type_commande);
                        var jourDebut = $("#DateDebutRamassage").val().split('-')[0];
                        var moisDebut = $("#DateDebutRamassage").val().split('-')[1];
                        var anneeDebut = $("#DateDebutRamassage").val().split('-')[2];
                        var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                        var jourFin = $("#DateFinRamassgage").val().split('-')[0];
                        var moisFin = $("#DateFinRamassgage").val().split('-')[1];
                        var anneeFin = $("#DateFinRamassgage").val().split('-')[2];
                        var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
//                        console.log('jourDebut ' + jourDebut);
                        var first_date = new Date(date_debut + " 00:00:00");
                        var last_date = new Date(date_fin + " 23:59:59");
                        console.log(first_date);
                        console.log(last_date);
                        $("tbody#commandeEspaceClient").empty();
                        $(scope.commandesespaceclient).each(function (index, value) {
                            var date_created = new Date(value.Commande.created);
                            console.log(date_created);
                            var ville_id = "";
                            if (value.User.ville_id != 0) {
                                var ville_id = value.User.Ville.name;
                            }
                            if (value.User.adress == null || value.User.adress == "") {
                                var adress = "";
                            } else {
                                var adress = value.User.adress;
                            }
                            var state = "Ramassage";
                            if (value.Commande.type_remettre == 'Depot') {
                                state = "Dépôt";
                            }
                            var nom_commercial = value.User.nom_commercial;
                            if (value.User.nom_commercial == null) {
                                nom_commercial = value.User.raison_social;
                            }
                            var date_created0 = value.Commande.modified.split(' ')[0];
                            var date_created1 = value.Commande.modified.split(' ')[1];
//                            var date_created = date_created0.split('-')[2] + '-' + date_created0.split('-')[1] + '-' + date_created0.split('-')[0];
                            var date_created = date_created0.split('-')[2] + '-' + date_created0.split('-')[1] + '-' + date_created0.split('-')[0] + ' ' + date_created1;
                            var commercial_id = '<li><div><button ng-controller="ModalCommandeClientCtrl" type="button" class="btn btn-warning btn-sm" style="background: #673ab7 !important; border:  #673ab7 !important;" ng-click="open(' + value.Commande.id + ', ' + value.Commande.ref + ', ' + value.Commande.created + ', ' + value.User.full_name + ', ' + value.User.adress + ', ' + value.User.Ville.name + ', $index)">\n\
                                                    Valider dépôt</button></div></li>';
                            if (value.Commande.type_remettre == 'Ramassage') {
                                if (value.Commande.livreur_id == 0) {
                                    var commercial_id = "<li><div><a href='#/affecter-commande-client/" + value.Commande.id + "' class='btn btn-success btn-sm'>Affecter</a></div></li>"
                                } else {
                                    var commercial_id = '<li><div><a href="#/fiche-livreur/' + value.Livreur.id + '" class="btn btn-info btn-sm">' + value.Livreur.full_name + '</a></div></li><li><div><a href="#/affecter-commande-client/' + value.Commande.id + '" class="btn btn-success btn-sm">Réaffecter</a></div></li>\n\
                                                        <li><div><button ng-controller="ModalRamassageCtrl" type="button" class="btn btn-warning btn-sm" style="background: #673ab7 !important; border:  #673ab7 !important;" ng-click="open(' + value.Commande.id + ', \'' + value.Commande.ref + '\', \'' + date_created + '\', \'' + nom_commercial + '\', \'' + value.User.adress + '\', \'' + value.User.Ville.name + '\', $index)">Valider ramassage</button></div></li>'
                                }
                            }
                            if ($("#DateFinRamassgage").val() != "") {
                                if (date_created < last_date && first_date < date_created) {
                                    if (value.Commande.type_remettre === type_commande && $("#typeCommande :selected").val() != "tous") {
                                        angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                    }
                                    if ($("#typeCommande :selected").val() === "tous") {
                                        angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                    }
                                }
                            } else if (value.Commande.type_remettre === type_commande) {
//                                if (value.Commercial.id == null) {
//                                    var commercial_id = "<li><div><a href='#/affecter-commande-client/" + value.Commande.id + "' class='btn btn-success btn-sm'>Affecter</a></div></li>"
//                                } else {
//                                    var commercial_id = "<li><div><a href='#/fiche-commerciale/" + value.Commercial.id + "' class='btn btn-info btn-sm'>" + value.Commercial.first_name + " " + value.Commercial.first_name + "</a></div></li>"
//                                }
//                                if (value.User.ville_id == 0) {
//                                    var ville_id = "";
//                                } else {
//                                    var ville_id = value.User.Ville.name;
//                                }
//                                if (value.User.adress == null || value.User.adress == "") {
//                                    var adress = "";
//                                } else {
//                                    var adress = value.User.adress;
//                                }
                                angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                            } else if (type_commande == 'tous') {
//                                if (value.Commercial.id == null) {
//                                    var commercial_id = "<li><div><a href='#/affecter-commande-client/" + value.Commande.id + "' class='btn btn-success btn-sm'>Affecter</a></div></li>"
//                                } else {
//                                    var commercial_id = "<li><div><a href='#/fiche-commerciale/" + value.Commercial.id + "' class='btn btn-info btn-sm'>" + value.Commercial.first_name + " " + value.Commercial.first_name + "</a></div></li>"
//                                }
//                                if (value.User.ville_id == 0) {
//                                    var ville_id = "";
//                                } else {
//                                    var ville_id = value.User.Ville.name;
//                                }
//                                if (value.User.adress == null || value.User.adress == "") {
//                                    var adress = "";
//                                } else {
//                                    var adress = value.User.adress;
//                                }
                                angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                            }
                        });
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.commandesespaceclient = PostFactory.listCommandeEspaceclient().then(function (commandesespaceclient) {
                        $scope.commandesespaceclient = commandesespaceclient;
                        console.log(commandesespaceclient);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
        })
        // filter commande par type espace client
        .directive("filterSelectRamassageCommande", function () {
            return {
                restrict: "E",
                template: '<select selectramassagecommande class="selectpicker" title="Select état de commande..." style="min-height: 34px !important; min-width: 200px !important" ng-model="affectORnotAffect" id="affectORnotAffect">\n\
                            <option value="" style="display: none;"></option>\n\
                            <option value="tous">Tous</option>\n\
                            <option value="affect">Affectées</option>\n\
                            <option value="notaffect">Non Affectées</option>\n\
                        </select>'
            };
        })
        .directive("selectramassagecommande", function ($compile, $location) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        var type_commande = $("#affectORnotAffect :selected").val();
                        var jourDebut = $("#DateDebutRamassage").val().split('-')[0];
                        var moisDebut = $("#DateDebutRamassage").val().split('-')[1];
                        var anneeDebut = $("#DateDebutRamassage").val().split('-')[2];
                        var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                        var jourFin = $("#DateFinRamassgage").val().split('-')[0];
                        var moisFin = $("#DateFinRamassgage").val().split('-')[1];
                        var anneeFin = $("#DateFinRamassgage").val().split('-')[2];
                        var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
//                        console.log('jourDebut ' + jourDebut);
                        var first_date = new Date(date_debut + " 00:00:00");
                        var last_date = new Date(date_fin + " 23:59:59");
                        $("tbody#commandeEspaceClient").empty();
                        $(scope.commandesespaceclient).each(function (index, value) {
                            var id = parseInt($location.path().split('/')[2]);
                            console.log(id);
                            if (value.Commande.user_id == id) {
                                var date_created = new Date(value.Commande.created);
                                var ville_id = "";
                                if (value.User.ville_id != 0) {
                                    var ville_id = value.User.Ville.name;
                                }
                                if (value.User.adress == null || value.User.adress == "") {
                                    var adress = "";
                                } else {
                                    var adress = value.User.adress;
                                }
                                var state = "Ramassage";
                                if (value.Commande.type_remettre == 'Depot') {
                                    state = "Dépôt";
                                }
                                var nom_commercial = value.User.nom_commercial;
                                if (value.User.nom_commercial == null) {
                                    nom_commercial = value.User.raison_social;
                                }
                                var date_created0 = value.Commande.modified.split(' ')[0];
                                var date_created1 = value.Commande.modified.split(' ')[1];
//                            var date_created = date_created0.split('-')[2] + '-' + date_created0.split('-')[1] + '-' + date_created0.split('-')[0];
                                var date_created = date_created0.split('-')[2] + '-' + date_created0.split('-')[1] + '-' + date_created0.split('-')[0] + ' ' + date_created1;
                                var commercial_id = '<li><div><button ng-controller="ModalCommandeClientCtrl" type="button" class="btn btn-warning btn-sm" style="background: #673ab7 !important; border:  #673ab7 !important;" ng-click="open(' + value.Commande.id + ', ' + value.Commande.ref + ', ' + value.Commande.created + ', ' + value.User.full_name + ', ' + value.User.adress + ', ' + value.User.Ville.name + ', $index)">\n\
                                                    Valider dépôt</button></div></li>';
                                if (value.Commande.livreur_id == 0) {
                                    var commercial_id = "<li><div><a href='#/affecter-commande-client/" + value.Commande.id + "' class='btn btn-success btn-sm'>Affecter</a></div></li>"
                                } else {
                                    var commercial_id = '<li><div><a href="#/fiche-livreur/' + value.Livreur.id + '" class="btn btn-info btn-sm">' + value.Livreur.full_name + '</a></div></li><li><div><a href="#/affecter-commande-client/' + value.Commande.id + '" class="btn btn-success btn-sm">Réaffecter</a></div></li>\n\
                                                        <li><div><button ng-controller="ModalRamassageCtrl" type="button" class="btn btn-warning btn-sm" style="background: #673ab7 !important; border:  #673ab7 !important;" ng-click="open(' + value.Commande.id + ', \'' + value.Commande.ref + '\', \'' + date_created + '\', \'' + nom_commercial + '\', \'' + value.User.adress + '\', \'' + value.User.Ville.name + '\', $index)">Valider ramassage</button></div></li>'
                                }
                                console.log('type_commande --------- ' + type_commande);
                                if ($("#DateFinRamassgage").val() != "") {
                                    if (date_created < last_date && first_date < date_created) {
                                        if (type_commande === "notaffect") {
                                            if (value.Commande.livreur_id === 0) {
                                                angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                            }
                                        }
                                        if (type_commande === "affect") {
                                            if (value.Commande.livreur_id != 0) {
                                                angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                            }
                                        }
                                    }
                                } else {
                                    if (type_commande === "tous") {
                                        angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                    }
                                    if (type_commande === "notaffect") {
                                        console.log(value.Commande.livreur_id);
                                        if (value.Commande.livreur_id == 0) {
                                            angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                        }
                                    }
                                    if (type_commande === "affect") {
                                        if (value.Commande.livreur_id != 0) {
                                            angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                        }
                                    }
                                }
                            }
                        });
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.commandesespaceclient = PostFactory.listCommandeEspaceclient().then(function (commandesespaceclient) {
                        $scope.commandesespaceclient = commandesespaceclient;
                        console.log(commandesespaceclient);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
        })
        // filter commandes annulaées (passer à la facturation ou pas)
        .directive("filterSelectAnnulation", function () {
            return {
                restrict: "E",
                template: '<select selectannulation class="selectpicker" title="Select état de facturation..." style="min-height: 34px !important; min-width: 200px !important" ng-model="etatFacturation" id="etatFacturation">\n\
                            <option value="" style="display: none;"></option>\n\
                            <option value="tous">Tous</option>\n\
                            <option value="facturer">Attente facturation</option>\n\
                            <option value="notfacture">En cours d\'annulation</option>\n\
                            <option value="annuleactive">Annulation activé</option>\n\
                            <option value="enstock">En stock</option>\n\
                            <option value="horsstock">Hors stock</option>\n\
                        </select>'
            };
        })
        .directive("selectannulation", function ($compile, $location) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        var etat_commande = $("#etatFacturation :selected").val();
                        $("tbody#CommandeannulationAll").empty();
                        $(scope.CmdsAnnulee).each(function (index, value) {
                            var date_livraison = value.Commande.date_livraison.split('-')[2] + "-" + value.Commande.date_livraison.split('-')[1] + "-" + value.Commande.date_livraison.split('-')[0];
                            var livreur_id = '<div><a href="#/fiche-livreur/' + value.Commande.livreur_id + '" class="btn btn-info btn-sm">' + value.Livreur.full_name + '</a></div>';
                            var acction_menu = '';
                            var acction_menu_facturation = '';
                            var acction_menu_facturationpassee = '';
                            var nom_commercial = value.User.nom_commercial;
                            if (value.User.nom_commercial == null) {
                                nom_commercial = value.User.raison_social;
                            }
                            var date_created0 = value.Commande.modified.split(' ')[0];
                            var date_created1 = value.Commande.modified.split(' ')[1];
                            var date_created = date_created0.split('-')[2] + '-' + date_created0.split('-')[1] + '-' + date_created0.split('-')[0];
//                            var date_created = date_created0.split('-')[2] + '-' + date_created0.split('-')[1] + '-' + date_created0.split('-')[0] + ' ' + date_created1;
                            if (value.Commande.isAnnule == true && value.Commande.isFacture == true) {
                                acction_menu = '<li><div id="showAnnulationCommande"><button ng-controller="ModalActiveAnnulationCtrl" type="button" class="btn btn-default btn-sm" style="border: none;color: #673ab7; font-size: 13px; font-weight: bold;" ng-click="open(' + value.Commande.id + ', \'' + value.Commande.ref + '\', \'' + date_created + '\', \'' + nom_commercial + '\', \'' + value.User.adress + '\', \'' + value.User.Ville.name + '\', $index)">Activer l\'affectation</button></div></li>'
                            }
                            if (value.Commande.isFacture == true) {
                                acction_menu_facturation = '<li><div id="showFacturerCommande"><button ng-controller="ModalFactureeCommandeClientCtrl" type="button" class="btn btn-default btn-sm" style="border: none;color: #36c6d3; font-size: 13px; font-weight: bold;" ng-click="open(' + value.Commande.id + ', \'' + value.Commande.ref + '\', \'' + date_created + '\', \'' + nom_commercial + '\', \'' + value.User.adress + '\', \'' + value.User.Ville.name + '\', $index)">Passer à la facturation</button></div></li>'
                            }
                            if (value.Commande.isFacture == false) {
                                acction_menu_facturationpassee = '<li><div id="showFacturerCommande" style="padding-top: 5px;"><label class="label label-sm label-info" style="background-color: #4285F4; border-color: #4285F4;">Attente facturation</label></div></li>'
                            }
                            var action = '<div class="btn-group"><a href="#/view-commande-client/' + value.Commande.id + '"  class="btn btn-info btn-sm"><i class="fa fa-eye"></i>  Voir </a>\n\
                                           <button type="button" class="btn btn-info btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="border-left: solid 1px #ddd;">\n\
                                                            <span class="caret"></span><span class="sr-only">Listes actions</span></button>\n\
                                        <ul class="dropdown-menu">' + acction_menu + acction_menu_facturation + acction_menu_facturationpassee + ' </ul>'
                            if (etat_commande === "tous") {
                                angular.element(document.getElementById('CommandeannulationAll')).append($compile("<tr  id='CommandeRowsAnnulee' class='CommandeRowsAnnulee' data-data-id='" + value.Commande.id + "' data-annulation-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + date_livraison + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + livreur_id + "</td>\n\
                                                <td>" + value.Receiver.full_name + "</td>\n\
                                                <td>" + value.Receiver.adresse + "</td>\n\
                                                <td>" + value.Receiver.Ville.name + "</td>\n\
                                                <td style='min-width: 150px;'>" + action + "</td>\n\
                                                </tr>")(scope));
                            }
                            if (etat_commande === "facturer") {
                                if (value.Commande.isFacture == false) {
                                    angular.element(document.getElementById('CommandeannulationAll')).append($compile("<tr  id='CommandeRowsAnnulee' class='CommandeRowsAnnulee' data-data-id='" + value.Commande.id + "' data-annulation-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + date_livraison + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + livreur_id + "</td>\n\
                                                <td>" + value.Receiver.full_name + "</td>\n\
                                                <td>" + value.Receiver.adresse + "</td>\n\
                                                <td>" + value.Receiver.Ville.name + "</td>\n\
                                                <td style='min-width: 150px;'>" + action + "</td>\n\
                                                </tr>")(scope));
                                }
                            }
                            if (etat_commande === "notfacture") {
                                if (value.Commande.isFacture == true) {
                                    angular.element(document.getElementById('CommandeannulationAll')).append($compile("<tr  id='CommandeRowsAnnulee' class='CommandeRowsAnnulee' data-data-id='" + value.Commande.id + "' data-annulation-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + date_livraison + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + livreur_id + "</td>\n\
                                                <td>" + value.Receiver.full_name + "</td>\n\
                                                <td>" + value.Receiver.adresse + "</td>\n\
                                                <td>" + value.Receiver.Ville.name + "</td>\n\
                                                <td style='min-width: 150px;'>" + action + "</td>\n\
                                                </tr>")(scope));
                                }
                            }
                            if (etat_commande === "annuleactive") {
                                if (value.Commande.isAnnule == false) {
                                    angular.element(document.getElementById('CommandeannulationAll')).append($compile("<tr  id='CommandeRowsAnnulee' class='CommandeRowsAnnulee' data-data-id='" + value.Commande.id + "' data-annulation-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + date_livraison + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + livreur_id + "</td>\n\
                                                <td>" + value.Receiver.full_name + "</td>\n\
                                                <td>" + value.Receiver.adresse + "</td>\n\
                                                <td>" + value.Receiver.Ville.name + "</td>\n\
                                                <td style='min-width: 150px;'>" + action + "</td>\n\
                                                </tr>")(scope));
                                }
                            }
                            if (etat_commande === "horsstock") {
                                console.log(value.Commande.isStock);
                                if (value.Commande.isStock == false) {
                                    angular.element(document.getElementById('CommandeannulationAll')).append($compile("<tr  id='CommandeRowsAnnulee' class='CommandeRowsAnnulee' data-data-id='" + value.Commande.id + "' data-annulation-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + date_livraison + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + livreur_id + "</td>\n\
                                                <td>" + value.Receiver.full_name + "</td>\n\
                                                <td>" + value.Receiver.adresse + "</td>\n\
                                                <td>" + value.Receiver.Ville.name + "</td>\n\
                                                <td style='min-width: 150px;'>" + action + "</td>\n\
                                                </tr>")(scope));
                                }
                            }
                            if (etat_commande === "enstock") {
                                if (value.Commande.isStock == true) {
                                    angular.element(document.getElementById('CommandeannulationAll')).append($compile("<tr  id='CommandeRowsAnnulee' class='CommandeRowsAnnulee' data-data-id='" + value.Commande.id + "' data-annulation-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + date_livraison + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + livreur_id + "</td>\n\
                                                <td>" + value.Receiver.full_name + "</td>\n\
                                                <td>" + value.Receiver.adresse + "</td>\n\
                                                <td>" + value.Receiver.Ville.name + "</td>\n\
                                                <td style='min-width: 150px;'>" + action + "</td>\n\
                                                </tr>")(scope));
                                }
                            }
                        });
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $("div#otherPagesAnnulee").html("");
                    $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30).then(function (commandesannulee) {
                        $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                        $scope.countAnnulee = commandesannulee.data.pageCount.Commande.pageCount;
                        $scope.pageCount = commandesannulee.data.pageCount.Commande.pageCount;
                        $scope.CurrentPage = commandesannulee.data.pageCount.Commande.page;
                        $scope.currentPageAnnulee = commandesannulee.data.pageCount.Commande.page;
                        $("button#firstPageAnnulee").hide();
                        var currentPage = commandesannulee.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesannulee.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageAnnulee(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesAnnulee").append($html);
                            }
                        }
                        if (commandesannulee.data.pageCount.Commande.prevPage == false) {
                            $("#nextPageAnnulee").attr('disabled', false);
                            $("#previousPageAnnulee").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
//                    $scope.commandesannulee = PostFactory.listCommandeAnnuleeEspaceclient().then(function (commandesannulee) {
//                        $scope.commandesannulee = commandesannulee;
////                    console.log(commandesannulee);
//                    },
//                            function (msg) {
//                                alert(msg);
//                            }
//                    );
                }
            };
        })
        // filter commande par type espace client
        .directive("filterSelectCommandeTypeDate", function () {
            return {
                restrict: "E",
                template: '<button type="submit" selectcommandetypedate class="btn purple" style="float: right"><i class="fa fa-check"></i> Recherche</button>'
            };
        })
        .directive("selectcommandetypedate", function ($compile, $location) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("click", function () {
                        var type_commande = $("#typeCommande :selected").val();
                        console.log('type_commande');
                        console.log(type_commande);
                        var jourDebut = $("#DateDebutRamassage").val().split('-')[0];
                        var moisDebut = $("#DateDebutRamassage").val().split('-')[1];
                        var anneeDebut = $("#DateDebutRamassage").val().split('-')[2];
                        var date_debut = anneeDebut + "-" + moisDebut + "-" + jourDebut;
                        var jourFin = $("#DateFinRamassgage").val().split('-')[0];
                        var moisFin = $("#DateFinRamassgage").val().split('-')[1];
                        var anneeFin = $("#DateFinRamassgage").val().split('-')[2];
                        var date_fin = anneeFin + "-" + moisFin + "-" + jourFin;
//                        console.log('jourDebut ' + jourDebut);
                        var first_date = new Date(date_debut + " 00:00:00");
                        var last_date = new Date(date_fin + " 23:59:59");
                        console.log(first_date);
                        console.log(last_date);
                        if ($("#DateDebutRamassage").val() == '') {
                            toastr.error('Veuillez donner une Date de début');
                        } else if ($("#DateFinRamassgage").val() == '') {
                            toastr.error('Veuillez donner une Date de fin');
                        } else {
                            $("tbody#commandeEspaceClient").empty();
                            $(scope.commandesespaceclient).each(function (index, value) {
                                var id = parseInt($location.path().split('/')[2]);
                                console.log(id);
                                if (value.Commande.user_id == id) {
                                    var date_created = new Date(value.Commande.created);
                                    console.log(date_created);
                                    var ville_id = "";
                                    if (value.User.ville_id != 0) {
                                        var ville_id = value.User.Ville.name;
                                    }
                                    if (value.User.adress == null || value.User.adress == "") {
                                        var adress = "";
                                    } else {
                                        var adress = value.User.adress;
                                    }
                                    var state = "Ramassage";
                                    if (value.Commande.type_remettre == 'Depot') {
                                        state = "Dépôt";
                                    }
                                    var commercial_id = '<li><div><button ng-controller="ModalCommandeClientCtrl" type="button" class="btn btn-warning btn-sm" style="background: #673ab7 !important; border:  #673ab7 !important;" ng-click="open(' + value.Commande.id + ', ' + value.Commande.ref + ', ' + value.Commande.created + ', ' + value.User.full_name + ', ' + value.User.adress + ', ' + value.User.Ville.name + ', $index)">\n\
                                                    Valider dépôt</button></div></li>';
                                    if (value.Commande.type_remettre == 'Ramassage') {
                                        if (value.Commande.livreur_id == 0) {
                                            var commercial_id = "<li><div><a href='#/affecter-commande-client/" + value.Commande.id + "' class='btn btn-success btn-sm'>Affecter</a></div></li>"
                                        } else {
                                            var commercial_id = "<li><div><a href='#/fiche-livreur/" + value.Livreur.id + "' class='btn btn-info btn-sm'>" + value.Livreur.full_name + "</a></div></li><li><div><a href='#/affecter-commande-client/" + value.Commande.id + "' class='btn btn-success btn-sm'>Réaffecter</a></div></li>"
                                        }
                                    }
                                    if (date_created < last_date && first_date < date_created) {
                                        if ($("#typeCommande :selected").val() != "") {
                                            if (value.Commande.type_remettre === type_commande && $("#typeCommande :selected").val() != "tous") {
                                                angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                            }
                                            if ($("#typeCommande :selected").val() == "tous") {
                                                angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                            }
                                        } else {
                                            angular.element(document.getElementById('commandeEspaceClient')).append($compile("<tr id='CommandeRows' data-data-id='" + value.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + value.Commande.id + ", " + value.Commande.ref + ")'></span></div> </td>\n\
                                                <td style='width: 160px;'>" + value.Commande.modified + "</td>\n\
                                                <td>" + value.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + value.User.full_name + "</td>\n\
                                                <td>" + value.User.adress + "</td>\n\
                                                <td>" + ville_id + "</td>\n\
                                                <td><ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + value.Commande.id + "'  class='btn btn-info btn-sm'><i class='fa fa-eye'></i></a>\n\
                                                        </div></li><li><div ng-controller='ModalCommandeCtrl'>\n\
                                                      <button id='commandeSumbit' data-index='{{$index}}' data-commande='{{commande.Commande.id}}'  ng-click='open(commande.Commande.id, $index, commande.User.full_name)' data-name='{{commande.Commande.ref}}' data-cmd='{{commande.Commande.id}}' class='btn btn-danger btn-embossed btn-sm'>\n\
                                                      <i class='fa fa-times'></i></button></div></li></ul></td>\n\
                                                <td style='width: 236px;'><ul class='nav nav-pills'>" + commercial_id + "</ul></td>\n\
                                                <td><form name='myForm' ng-controller='StateLivraisonController'><input type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form></td>\n\
                                                </tr>")(scope));
                                        }
                                    }
                                }
                            });
                        }
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.commandesespaceclient = PostFactory.listCommandeEspaceclient().then(function (commandesespaceclient) {
                        $scope.commandesespaceclient = commandesespaceclient;
                        console.log(commandesespaceclient);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
        })
        .value('uiTinymceConfig', {})
        .directive('uiTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
                uiTinymceConfig = uiTinymceConfig || {};
                var generatedIds = 0;
                return {
                    require: 'ngModel',
                    link: function (scope, elm, attrs, ngModel) {
                        var expression, options, tinyInstance;
                        // generate an ID if not present
                        if (!attrs.id) {
                            attrs.$set('id', 'uiTinymce' + generatedIds++);
                        }
                        options = {
                            // Update model when calling setContent (such as from the source editor popup)
                            setup: function (ed) {
                                ed.on('init', function (args) {
                                    ngModel.$render();
                                });
                                // Update model on button click
                                ed.on('ExecCommand', function (e) {
                                    ed.save();
                                    ngModel.$setViewValue(elm.val());
                                    if (!scope.$$phase) {
                                        scope.$apply();
                                    }
                                });
                                // Update model on keypress
                                ed.on('KeyUp', function (e) {
                                    console.log(ed.isDirty());
                                    ed.save();
                                    ngModel.$setViewValue(elm.val());
                                    if (!scope.$$phase) {
                                        scope.$apply();
                                    }
                                });
                            },
                            mode: 'exact',
                            elements: attrs.id
                        };
                        if (attrs.uiTinymce) {
                            expression = scope.$eval(attrs.uiTinymce);
                        } else {
                            expression = {};
                        }
                        angular.extend(options, uiTinymceConfig, expression);
                        setTimeout(function () {
                            tinymce.init(options);
                        });
                        ngModel.$render = function () {
                            if (!tinyInstance) {
                                tinyInstance = tinymce.get(attrs.id);
                            }
                            if (tinyInstance) {
                                tinyInstance.setContent(ngModel.$viewValue || '');
                            }
                        };
                    }
                };
            }])
        // espace client
        // type de colis
        .directive("customTypeColis", function () {
            return {
                restrict: "E",
                template: '<div class="input-group"><span class="input-group-addon"><i class="fa fa-barcode"></i></span>\n\
                            <select typecolis class="selectpicker" title="Select type colis..." id="TypeColis">\n\
                            <option value="" style="display: none;"></option>\n\
                            <option value="Normal">Normal</option>\n\
                            <option value="Fragile">Fragile</option>\n\
                            <option value="Dangereuse">Dangereuse</option>\n\
                        </select></div>'
            };
        })
        .directive("typecolis", function ($compile) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        var type_colis = $("#TypeColis :selected").val();
                        $("#MessageId").empty();
                        if (type_colis === "Dangereuse") {
                            angular.element(document.getElementById('MessageId')).append($compile("<div class='clearfix'></div></br>\n\
                                        <strong>Attention !</strong> <span>L‘expédition de matières dangereuses est soumise à certaines rèles et restrictions et n‘est pas possible depuis Cliquez Envoyez. Pour obtenir une autorisation, contactez notre Service Clients.</span>\n\
                                        ")(scope));
                        }
                    });
                }
            };
        })
        // type de colis
        .directive("typeremettrecolis", function () {
            return {
                restrict: "E",
                template: '<label class="col-md-5 control-label" style="text-align: left;"><strong>Dépôt ou Ramassage ? </strong></label><div class="input-group col-md-7"><span class="input-group-addon"><i class="fa fa-barcode"></i></span>\n\
                            <select remettrecolis class="form-control input-xlarge select2me col-md-12" data-placeholder="Type de Transfert de colis..." id="remettreColis">\n\
                            <option value=""></option>\n\
                            <option value="Ramassage">Ramassage</option>\n\
                            <option value="Depot">Dépôt en point de proximité</option>\n\
                        </select></div>'
            };
        })
        .directive("remettrecolis", function ($compile) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        var type_colis = $("#remettreColis :selected").val();
                        $("#MessageId").empty();
                        if (type_colis === "Ramassage") {
                            $('#TypeRemettre').hide();
                            $('#AdresseRamassage').show();
                        }
                        if (type_colis === "Depot") {
                            $('#AdresseRamassage').hide();
                            $('#TypeRemettre').show();
                        }
                        if (type_colis === "") {
                            $('#AdresseRamassage').hide();
                            $('#TypeRemettre').hide();
                        }
                    });
                },
                controller: function ($scope, PostFactory, $element) {
                    // list ville
                    $scope.villes = PostFactory.listVilles().then(function (villes) {
                        $scope.villes = villes;
                        ////console.log(villes);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
        })
// dimonssion product table bon
//  declaration fiscale facture vente
        .directive("listdimensioncolis", function () {
            return {
                restrict: "E",
                template: "<i dimensioncolis id='dimensioncolis' class='glyphicon glyphicon-plus btn btn-info btn-sm btn-embossed icon'></i> <a href='#'> ajouter</a>"
            };
        })
        .directive("dimensioncolis", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("click", function ($event) {
                        $event.preventDefault();
                        var count = $("div#DimensionColis").length;
                        angular.element(document.getElementById('ListDimension')).append($compile("<div class='col-md-12' style='padding-left: 0; padding-right: 0; margin-top: 20px;' id='DimensionColis'><div class='col-md-3'><div class='input-group'><span class='input-group-addon'>N°" + parseInt(count + 1) + "</span>\n\
                                                <input type='number' id='longueur' placeholder='Longueur(cm)' name='longueur' class='form-control' /></div></div>\n\
                                                <div class='col-md-2'><div class='input-group'><input type='number' id='largeur' placeholder='Largeur(cm)' name='largeur' class='form-control' /></div></div>\n\
                                                <div class='col-md-2'><div class='input-group'><input type='number' id='hauteur' placeholder='Hauteur(cm)' name='hauteur' class='form-control' /></div></div>\n\
                                                <div class='col-md-2'><div class='input-group'><input type='number' id='poid' placeholder='Poid(cm)' name='poid' class='form-control' /></div></div>\n\
                                                <div class='col-md-2'><div class='input-group'><input type='text' id='Contenu' placeholder='Contenu' name='content' class='form-control' /></div></div>\n\
                                                <div style='text-align: left !important;' class='col-md-1'><div id='deleteItem' ng-click='removeItem()'><i style='color: #34aadc;cursor: pointer;' class='fa fa-times fa-2x'></i></div></td>\n\
                                           </div></div><div class='clearfix'></div>")(scope));
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element) {
                    $("#ListDimension").on('click', "#deleteItem", function (e) {
                        e.preventDefault();
                        $(this).parent().parent().remove();
                    });
                }

            };
        })
        .directive("addbuttonsdevisficheproduit", function () {
            return {
                restrict: "E",
                template: "<i addbuttonsdevis id='addProfile' class='glyphicon glyphicon-plus btn btn-info btn-sm btn-embossed icon'  style='width: 35px !important;height: 25px !important;'></i>"
            }
        })
////Directive for adding buttons on click that show an alert on click
        .directive("addbuttonsdevis", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
//                require: 'ngChange',
                    element.bind("click", function () {
                        var tableLength = $("tbody#space-for-buttons tr").length;
                        var remise = 1 - $("#RemiseDevis").val() / 100;
                        var total_ht = $("#PUDevis").val() * remise * $("#QteDevis").val();
                        var total_ttc = parseFloat($("#ttcDevis").val()) * remise * $("#QteDevis").val();
                        var ht = $("#PUDevis").val() * remise;
                        var ttc = parseFloat($("#ttcDevis").val()) * remise;
                        var total_net_ttc = parseFloat(total_ttc) * (1 - $("#RemiseGlob").val() / 100);
//                            $("input#Set_Remise[data-focus='1']").attr('data-focus', 0);
                        var qte = $("#QteDevis").val();
                        var qteInt = parseInt($("#QteDevis").val());
                        if (qteInt == 0 || qte == "") {
                            toastr.success('Veuillez donner une QTE');
                        }
                        if (qte > 0) {
//                            var entree_stock = parseFloat($('#combobox :selected').attr('data-stock-entree'));
//                            var sortie_stock = parseFloat($('#combobox :selected').attr('data-stock-sortie'));
                            var dataHT = $("#PUDevis").val();
                            if ($.trim($(".custom-combobox-input").val()) == "Main d'oeuvre") {
                                dataHT = 0;
                            }
                            var jsonStr = $('#combobox :selected').attr('data-stock-entree');
                            var obj = $.parseJSON(jsonStr);
                            console.log(obj);
                            var entree_stock = 0;
                            var sortie_stock = 0;
                            $(obj).each(function (i, v) {
                                entree_stock = entree_stock + parseFloat(v[0].qte);
                                sortie_stock = sortie_stock + parseFloat(v.qte_out);
                            });
                            var stock_total = entree_stock - sortie_stock;
//                            console.log(entree_stock);
//                            console.log(sortie_stock);
//                            console.log(stock_total);
                            var countTable = parseInt($("#space-for-buttons tr").length);
                            angular.element(document.getElementById('space-for-buttons')).append($compile("<tr data-bon='0' data-achat='" + $('#combobox :selected').attr('data-achat') + "' data-marge='" + $('#combobox :selected').attr('data-marge') + "' data-priceprod='" + $('#combobox :selected').val() + "'  data-data-id='" + $('#combobox :selected').attr('data-id') + "' id='itemProduct'>\n\
                                                                        <td>" + $('#combobox :selected').attr('data-ref') + "</td>\n\
                                                                        <td>" + $('#combobox :selected').text() + "</td>\n\
                                                                        <td data-ht='" + parseFloat($("#PUDevis").val()) + "' data-ht-indicateur='" + dataHT + "'>" + parseFloat($("#PUDevis").val()).toFixed(3) + "</td>\n\
                                                                        <td data-ttc='" + parseFloat($("#ttcDevis").val()) + "' data-tva='" + $('#combobox :selected').attr('data-tva') + "'>" + parseFloat($("#ttcDevis").val()).toFixed(3) + "</td>\n\
                                                                        <td id='ModifQte'>" + $("#QteDevis").val() + "</td>\n\
                                                                        <td id='ModifRemise'>" + $("#RemiseDevis").val() + "</td>\n\
                                                                        <td data-ht='" + total_ht.toFixed(3) + "'>" + total_ht.toFixed(3) + "</td>\n\
                                                                        <td data-ttc='" + total_ttc.toFixed(3) + "'>" + total_ttc.toFixed(3) + "</td>\n\
                                                                        <td data-index='" + countTable + "' id='currentStock'>" + stock_total + "</td>\n\
                                                                        <td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td>\n\
                                                                        </tr>")(scope));
                            $("#QteDevis").val("");
                            scope.qte = "";
                            $("input#PUDevis").val("");
                            $("input#ttcDevis").val("");
                            $(".custom-combobox-input").val("");
                            $("input#RemiseDevis").val("0");
                            colorStock();
                            setTimeout(function () {
                                totalDevisFiche();
                            }, 500);
                        }
                        setTimeout(function () {
                            $(".Qte" + tableLength).val("1");
                            $(".Rse" + tableLength).val("0");
                        }, 300);
                    });
                },
                controller: function ($scope, PostFactory, $element) {
                    $scope.changeMarge = function () {
                        setTimeout(function () {
                            var price_achat = parseFloat($("#NewPrixAchat").val());
                            var marge = parseFloat($("#NewMarge").val());
                            var price_unit_float = parseFloat(price_achat * (1 + marge / 100));
                            var price_unit = parseFloat(price_achat * (1 + marge / 100)).toFixed(3);
                            $("#PU").val(price_unit);
                            var ttc = price_unit_float * (1 + parseFloat($("#NewTva :selected").attr('data-tva') / 100));
//                            ////console.log(ttc);
                            $("#ttc").val(ttc.toFixed(3));
                        }, 300);
                    };
                }
            };
//            }
        })
        //facture multi bl
        .directive("customSelectFacture", function () {
            return {
                restrict: "E",
                template: '<select selectclientfacture class="form-control input-xlarge select2me col-sm-12" data-placeholder="Select Client..." style="height: 42px; width: 100%" ng-model="selectedName" id="SelectClient">\n\\n\
                            <option value=""></option>\n\
                            <option ng-repeat="name in clients" value="{{name.User.id}}">{{name.User.nom_commercial}} {{name.User.raison_social}}</option>\n\
                        </select>\n\
'
            };
        })
        .directive("selectclientfacture", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("change", function () {
                        if ($("#SelectClient :selected").text() === "") {
                            toastr.error('Veuillez choisir un client');
                        } else {
                            var user_id = $("#SelectClient :selected").val();
                            $("tbody#listBL").empty();
                            var dataCommande = {
                                Commande: {
                                    user_id: user_id
                                }
                            };
                            scope.filteruser = PostFactory.listBLFilterUser(dataCommande).then(function (filteruser) {
                                scope.filteruser = filteruser;
                                var annulees = filteruser.annulee;
                                var livrees = filteruser.data;
                                var dataFilter = {
                                    Livree: [],
                                    Annulee: []
                                };
                                if (parseInt(livrees.length) == 0 && parseInt(annulees.length) == 0) {
                                    toastr.warning("Pas de commandes pour ce client");
                                } else {
                                    $(livrees).each(function (index, value) {
                                        if (value.Facture.id == null) {
                                            dataFilter.Livree.push({id: value.Commande.id, ref: value.Commande.ref, modified: value.Commande.modified, created: value.Commande.created, user: value.User.full_name, state: value.Commande.state});
                                        }
                                    });
                                    if (parseInt(dataFilter.Livree.length) != 0) {
                                        angular.element(document.getElementById('listBL')).append($compile("<tr data-data-id='0'>\n\
                                                <td colspan='4'><label class='label label-sm label-success'>Les commandes livrées</label></td>\n\
                                                <td><form name='myForm' class='nav nav-pills' ng-controller='StateLivraisonController'><input  type='checkbox' id='checkAllLivree' value='{{checkboxModel.value}}'></form></td>\n\
                                                </tr>")(scope));
                                        $(dataFilter.Livree).each(function (index, value) {
                                            angular.element(document.getElementById('listBL')).append($compile("<tr data-data-id='" + value.id + "'>\n\
                                                    <td>" + value.ref + "</td>\n\
                                                    <td>" + value.modified + "</td>\n\
                                                    <td>" + $("#SelectClient :selected").text() + "</td>\n\
                                                    <td><label class='label label-sm label-success'>Livrée</label></td>\n\
                                                    <td><form name='myForm' class='nav nav-pills' ng-controller='StateLivraisonController'><input  type='checkbox' class='CheckedBoxLivree' value='{{checkboxModel.value}}'></form> </td>\n\
                                                    </tr>")(scope));
                                        });
                                    }
                                    setTimeout(function () {
//                                    if (annulees.length == 0 || annulees.length == '0') {
//                                        toastr.warning("Pas de commandes annulées pour cet client");
//                                    } else {
                                        $(annulees).each(function (index, value) {
                                            if (value.Facture.id == null && value.Commande.isFacture == false) {
                                                dataFilter.Annulee.push({id: value.Commande.id, ref: value.Commande.ref, modified: value.Commande.modified, created: value.Commande.created, user: value.User.full_name, state: value.Commande.state});
                                            }
                                        });
                                        if (parseInt(dataFilter.Annulee.length) != 0) {
                                            angular.element(document.getElementById('listBL')).append($compile("<tr data-data-id='0'>\n\
                                                <td colspan='4'><label class='label label-sm label-danger'>Les commandes annulées</label></td>\n\
                                                <td><form name='myForm' class='nav nav-pills'><input  type='checkbox' id='checkAllAnnulee' value='{{checkboxModel.value}}'></form> </td>\n\
                                                </tr>")(scope));
                                            $(dataFilter.Annulee).each(function (index, value) {
                                                angular.element(document.getElementById('listBL')).append($compile("<tr data-data-id='" + value.id + "'>\n\
                                                    <td>" + value.ref + "</td>\n\
                                                    <td>" + value.modified + "</td>\n\
                                                    <td>" + $("#SelectClient :selected").text() + "</td>\n\
                                                    <td><label class='label label-sm label-danger'>Annulée</label></td>\n\
                                                    <td><form name='myForm' class='nav nav-pills' ng-controller='StateLivraisonController'><input  type='checkbox' class='CheckedBoxAnnulee' value='{{checkboxModel.value}}'></form></td>\n\
                                                    </tr>")(scope));
                                            });
                                        }
                                    }, 200);
                                }
                                setTimeout(function () {
                                    $('#checkAll').click(function () {
                                        $('tbody input:checkbox').prop('checked', this.checked);
                                        setTimeout(function () {
                                            if ($('#checkAll').val() == 'true' || $('#checkAll').val() == true) {
                                                $('tbody input:checkbox').val('true');
                                            } else {
                                                $('tbody input:checkbox').val('false');
                                            }
                                        }, 200);
                                    });
                                    $('#checkAllLivree').click(function () {
                                        $('tbody input.CheckedBoxLivree:checkbox').prop('checked', this.checked);
                                        if ($(this).val() == 'true' || $(this).val() == true) {
                                            $('tbody input.CheckedBoxLivree:checkbox').val('true');
                                        } else {
                                            $('tbody input.CheckedBoxLivree:checkbox').val('false');
                                        }
                                    });
                                    $('#checkAllAnnulee').click(function () {
                                        $('tbody input.CheckedBoxAnnulee:checkbox').prop('checked', this.checked);
                                        if ($(this).val() == 'true' || $(this).val() == true) {
                                            $('tbody input.CheckedBoxAnnulee:checkbox').val('true');
                                        } else {
                                            $('tbody input.CheckedBoxAnnulee:checkbox').val('false');
                                        }
                                    });
                                }, 500);
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    });
//            }
                },
                controller: function ($scope, PostFactory, $element, $location, $cookieStore) {
                    $scope.clients = PostFactory.listClients().then(function (clients) {
                        $scope.clients = clients;
                        ////console.log(clients);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    setTimeout(function () {
                        $scope.filters = PostFactory.listBLUser().then(function (filters) {
                            $scope.filters = filters;
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
//                        }

                    }, 300);
                    // groupe bl en une facture
                    $scope.facturerGroupeBL = function () {
//                    $event.preventDefault();
                        var dataCommande = {
                            Commande: []
                        };
                        $('#listBL tr').each(function (i, v) {
                            if ($(v).children().eq(4).children().children().is(':checked') == true || $(v).children().eq(4).children().children().is(':checked') == 'true') {
                                dataCommande.Commande.push({id: $(v).attr('data-data-id')});
                            }
                        });
                        $cookieStore.remove('sessionBLID');
                        $cookieStore.put('sessionBLID', dataCommande.Commande);
                        setTimeout(function () {
                            //console.log($cookieStore.get('sessionBLID'));
                            //console.log($cookieStore.get('sessionBLID').length);
                        }, 1000);
                        //console.log($cookieStore.get('sessionBLID').length !== 0);
//                    if ($cookieStore.get('sessionBLID').length !== 0) {
//                        $location.path('/affecter-multi-commande-client');
//                    }
                        if ($cookieStore.get('sessionBLID').length === 0) {
                            toastr.warning('Veuillez choisir au moins une commande');
                        } else {
                            $('#genererBLGrouped').attr('disabled', true);
                            var ajustement = $("#Ajustement").val();
                            if ($("#Ajustement").val() == '') {
                                ajustement = 0;
                            }
                            var dataCommande = {
                                Facture: {
                                    user_id: $("#SelectClient :selected").val(),
                                    ajustement: ajustement
                                },
                                Commande: $cookieStore.get('sessionBLID')
                            }
                            ;
                            //console.log(dataCommande);
                            $scope.facturesgrouped = PostFactory.genererFacturerGrouped(dataCommande).then(function (facturesgrouped) {
                                if (facturesgrouped.type === 'success') {
                                    $location.path('/gestion-factures');
                                    toastr.success(facturesgrouped.text);
                                }
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    };
                }
            };
        })
//Directive for showing an alert on click 
//        .directive("alert", function () {
//            return function (scope, element, attrs) {
//                element.bind("click", function () {
//                    ////console.log(attrs);
//                    alert("This is alert #" + attrs.alert);
//                });
//            };
//        });

        // module note de frais 
        .directive("addbuttonnotefrais", function () {
            return {
                restrict: "E",
                template: '<button addnotefrais class="btn btn-sm btn-info pull-right" ng-click="" style="margin-right: 0 !important;">Ajout Note de frais&nbsp;<i class="fa fa-plus"></i></button>'
            };
        })
        //Directive for adding buttons on click that show an alert on click
        .directive("addnotefrais", function ($compile, PostFactory) {
            return {
                link: function (scope, element, attrs) {
                    element.bind("click", function () {
                        //traitement
                        if ($("#designation").val() === "" || $("#motif").val() === "" || $("#montant").val() === "") {
                            toastr.error("Un champ ou plusieurs sont manquants");
                        } else {
                            var imgSrc = $("#imgPreview").attr('ng-src');
                            var line = "<tr id='NoteFrais'>\n\
                                            <td>" + $("#designation").val() + "</td>\n\
                                            <td>" + $("#motif").val() + "</td>\n\
                                            <td>" + $("#montant").val() + "</td>\n\
                                            <td><img class='thumbnail' src='" + imgSrc + "' style='max-width: 75px;'/></td>\n\
                                            <td><a href='#' id='deleteNote' class='btn btn-sm btn-danger'><i class='fa fa-times'></i></a></td>\n\
                                        </tr>";
                            angular.element(document.getElementById('listNoteFrais')).append($compile(line)(scope));
                            setTimeout(function () {
//                                scope.addNoteFrais = function ($event) {
//                                    $event.preventDefault();
                                var file = scope.myFile;
                                var dataFrais = {
                                    Frai: {
                                        designation: $("#designation").val(),
                                        motif: $("#motif").val(),
                                        montant: $("#montant").val(),
                                        preuve: file
                                    }
                                };
                                scope.notefrais = PostFactory.addNoteFrais(dataFrais).then(function (notefrais) {
                                    if (notefrais.type === 'success') {
                                        toastr.success(notefrais.text);
                                        $("#designation").val("");
                                        $("#motif").val("");
                                        $("#montant").val("");
//                                        deleteNote();
                                    }
                                },
                                        function (msg) {
                                            alert(msg);
                                        }
                                );
//                                };
                            }, 500);
                        }
                    });
                },
                controller: function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location) {

                    $scope.setFile = function (element) {
                        $scope.currentFile = element.files[0];
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            $scope.image_source = event.target.result;
                            $scope.$apply();
                        };
                        // when the file is read it triggers the onload event above.
                        reader.readAsDataURL(element.files[0]);
                    };
                }
            };
        })

        //preview image
        .directive("ngFileSelect", function () {
            return {
                link: function ($scope, el) {
                    el.bind("change", function (e) {
                        $scope.file = (e.srcElement || e.target).files[0];
                        $scope.getFile();
                    });
                }
            };
        })
//        .directive('myEnter', function () {
//            return function (scope, element, attrs) {
//                element.bind("keydown keypress", function (event) {
//                    if (event.which === 13) {
//                        scope.$apply(function () {
//                            scope.$eval(attrs.myEnter);
//                        });
//                        alert('enter');
//
//                        event.preventDefault();
//                    }
//                });
//            };
//        })
        // upload file
        .directive('fileModel', ['$parse', function ($parse) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        var model = $parse(attrs.fileModel);
                        var modelSetter = model.assign;
                        element.bind('change', function () {
                            scope.$apply(function () {
                                modelSetter(scope, element[0].files[0]);
                            });
                        });
                    }
                };
            }])
        .directive('dynamicModel', ['$compile', '$parse', function ($compile, $parse) {
                return {
                    restrict: 'A',
                    terminal: true,
                    priority: 100000,
                    link: function (scope, elem) {
                        var name = $parse(elem.attr('dynamic-model'))(scope);
                        elem.removeAttr('dynamic-model');
                        elem.attr('ng-model', name);
                        $compile(elem)(scope);
                    }
                };
            }]);
        