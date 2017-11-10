angular.module('starter.controllers', [])
        .controller("LoginCtrl", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location) {
            var forceSSL = function () {
//                if ($location.protocol() !== 'https') {
//                    $window.location.href = $location.absUrl().replace('http', 'https');
//                }
            };
            forceSSL();
            if ($cookieStore.get('sessionConnected')) {
                $location.path('/dashboard.html');
                toastr.success("Vous êtes déjà connecté");
            } else {
//                setInterval(function () {
                $(".page-header").hide();
                $("#footerERP").hide();
                $("w-div").hide();
                $(".page-sidebar-wrapper").hide();
//                    $(".page-header").attr('style', 'display: none !important;');
//                    $("#footerERP").attr('style', 'display: none !important;');
//                    $("w-div").attr('style', 'display: none !important;');
//                    $(".page-sidebar-wrapper").attr('style', 'display: none !important;');
//                }, 100);
                $scope.users = PostFactory.loginPost().then(function (users) {
                    $scope.users = users;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.loginPost = function ($event) {
                    $event.preventDefault();
                    //                if (id) {
                    var data = {
                        User: {
                            username: $("#username").val(),
                            password: $("#password").val()
                        }
                    };
                    $scope.usersLogin = PostFactory.loginPost(data).then(function (usersLogin) {
                        if (usersLogin.type === "success") {
                            $cookies.put('sessionID', JSON.stringify(usersLogin));
                            $cookieStore.put('sessionConnected', JSON.stringify(usersLogin));
                            setTimeout(function () {
                                document.getElementById("full_name").innerHTML = usersLogin.user;
                            }, 1000);
                            $location.path('/dashboard.html');
//                            document.location.reload(app_url() + "dashboard.html");
                            $(".page-header").show();
                            $("#footerERP").show();
                            $("w-div").show();
                            $(".page-sidebar-wrapper").show();
//                            $(".page-header").attr('style', 'display: block !important;');
//                            $("#footerERP").attr('style', 'display: block !important;');
//                            $("w-div").attr('style', 'display: block !important;');
//                            $(".page-sidebar-wrapper").attr('style', 'display: block !important;');
                            toastr.success(usersLogin.text);
                            //traitement
                        } else {
                            toastr.error(usersLogin.text);
                            //traitement
                        }
                        $scope.usersLogin = usersLogin;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    //                }
                };
            }
        })
        .controller("ErpCtrl", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location) {
//            $scope.posts = PostFactory.listProducts().then(function (posts) {
//                $scope.posts = posts;
//                $scope.date = new Date();
//                var tagsData = {
//                    Article: [],
//                };
//            $scope.format = 'EEEE dd MMMM yyyy';
//            $scope.format1 = 'yyyy';
//            });
            if ($cookieStore.get('sessionConnected')) {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                console.log();
                $scope.avatar = Auth.avatar;
                $scope.logout = function ($event) {
                    $event.preventDefault();
                    $scope.usersLogout = PostFactory.logout().then(function (response) {
                        sessionStorage.setItem('ifRefresh', null);
                        sessionStorage.clear();
                        $cookieStore.remove('sessionConnected');
                        $cookies.remove('sessionID');
                        $location.path('/login');
                        $("#Menu_bar").hide();
                        $(".Menu_bar").hide();
                    });
                };
//                setTimeout(function () {
//                }, 500);


                $scope.CloseMenu = function () {
//                    //console.log('sidebar');
                    if ($('body').attr('class').search(" page-sidebar-closed") == -1) {
//                        $('body').removeClass('page-sidebar-fixed');
//                        $('body').removeClass('page-header-fixed');
//                        $('body').removeAttr('class');
//                        $('body').attr('class', 'page-sidebar-closed-hide-logo page-container-bg-solid page-sidebar-closed-hide-logo ng-scope page-sidebar-closed page-header-fixed');

//                        $('#list').addClass('page-sidebar-menu-hover-submenu'); 
                    } else {

//                        setTimeout(function () {
//                            $(".ScrolSidebar").addAttr("style", "color:red !important;");
//                        }, 500);
//                        $('body').removeAttr('class');
//                        $('body').attr('class', 'page-sidebar-closed-hide-logo page-header-fixed page-content-white page-sidebar-fixed');
//                        $('body').addClass('page-sidebar-fixed');    
//                        $('body').addClass('page-header-fixed'); 
//                        $('body').addClass('page-header-fixed'); 
//                        $('#list').removeClass('page-sidebar-menu-hover-submenu');
                    }
                };
                $scope.TypePointage = function () {
                    if ($("#TypePointage :selected").val() === 'Automatique') {
                        $scope.pointageAuto = true;
                    }
                    if ($("#TypePointage :selected").val() === 'Manuel') {
                        $scope.pointageAuto = false;
                    }
                };
                $scope.config = PostFactory.showConfigGlobal().then(function (config) {
                    $scope.config = config.data;
//                    console.log(config);
                    $scope.tableJours = config.jours_travail;
                    var tableJours = [];
                    var tableJourIndexOf = [];
                    angular.forEach(config.jours_travail, function (value, index) {
                        tableJourIndexOf.push(index);
                        tableJours.push({jour: index, date_debut: value[0], date_fin: value[1], date_debut_midi: value[2], date_fin_midi: value[3]})
                    });
                    // start append 
                    $scope.appendJour = function ($event) {
                        var jour_name = $('#jourPointage :selected').text();
                        var index = tableJourIndexOf.indexOf(jour_name);
                        if (index === -1) {
                            tableJourIndexOf.push(jour_name);
                            tableJours.push({jour: jour_name});
                        } else {
                            toastr.info('Jour déjà saisi');
                        }
                    };
                    // end append 
                    $scope.tableJours = tableJours;
                    $scope.pointageAuto = false;
//                    console.log(config.Configuration.type_pointage);
                    if (config.data.Configuration.type_pointage === 'Automatique') {
                        $scope.pointageAuto = true;
                    }
                    var type_bill = "";
                    var string = document.location.hash;
                    // indexOf if contain (if exeist mot)
                    if (string.indexOf("facture") !== -1) {
                        type_bill = "de la présente facture";
                    }
                    if (string.indexOf("commande") !== -1) {
                        type_bill = "de la présente commande";
                    }
                    if (string.indexOf("devis") !== -1) {
                        type_bill = "du présent devis";
                    }
                    $scope.type_bill = type_bill;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.TypeActivite = function () {
                    var Type = $('#TypeActivite :selected').text();
                    if (Type === "Industriel") {
                        $('#fodecBloc').show();
                    } else {
                        $('#fodecBloc').hide();
                    }
                };
                $scope.editConfig = function ($event) {
                    $event.preventDefault();
                    var file = $scope.myFile;
                    var joursTravail = [];
                    angular.forEach($('#listPRESENCE tr'), function (value, index) {
                        var heursTravail = [$(value).find("#debut_jour").val(), $(value).find("#fin_jour").val()];
//                        var heursTravail = [$scope.debutJour[index], $scope.finJour[index]];
                        var jour_name = $(value).children().eq(0).text();
                        joursTravail[jour_name] = heursTravail;
                    });
                    console.log(joursTravail);
                    $scope.configuration = PostFactory.editConfig(file, $scope.config).then(function (configuration) {
                        if (configuration.type === 'success') {
                            $location.path('/dashboard.html');
                            toastr.success(configuration.text);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                // configuration de pointage
                $scope.configPointage = function ($event) {
                    $event.preventDefault();
                    var file = $scope.myFile;
                    var joursTravail = [];
                    var joursTravails = [];
                    angular.forEach($('#listPRESENCE tr'), function (value, index) {
                        var heursTravail = [$(value).find("#debut_jour").val(), $(value).find("#fin_jour").val(), $(value).find("#debut_midi_jour").val(), $(value).find("#fin_midi_jour").val()];
//                        var heursTravail = [$scope.debutJour[index], $scope.finJour[index]];
                        var jour_name = $(value).children().eq(0).text();
                        joursTravail[jour_name] = heursTravail;
                        joursTravails.push({jour: jour_name, date_debut: $(value).find("#debut_jour").val(), jour_fin: $(value).find("#fin_jour").val(), date_debut_midi: $(value).find("#debut_midi_jour").val(), date_fin_midi: $(value).find("#fin_midi_jour").val()})
                    });
                    var config = {
                        Configuration: {
                            type_pointage: $("#TypePointage :selected").val(),
                            ip_pointeuse: $("#ip_pointeuse").val(),
                            NHT: $("#NHT").val(),
                            price_hs: $("#price_hs").val(),
                            joursTravails: joursTravails
                        }
                    };
                    PostFactory.configPointage(config).then(function (configpointage) {
                        if (configpointage.type === 'success') {
                            $location.path('/dashboard.html');
                            toastr.success(configpointage.text);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
//                var id = parseInt($location.path().split('/')[2]);
//                if (id) {
//                    $scope.editProduct = function ($event) {
//                        $event.preventDefault();
//                        var dataProduct = {
//                            Product: {
//                                id: id,
//                                name: $("#nom").val(),
//                                price: $("#PUHT").val(),
//                                marge: $("#Marge").val(),
//                                prix_achat: $("#PACHAT").val(),
//                                code_barres: $("#code_barre").val(),
//                                ref: $("#ref").val(),
//                                type: $('#typeValue :selected').val(),
//                                tva_id: $('#tvaValue :selected').val(),
//                                fournisseur_id: $('#fournisseurValue :selected').val(),
//                                famille_id: $('#familleValue :selected').val(),
//                                unite_id: $('#uniteValue :selected').val(),
//                                category_id: $('#categoryValue :selected').val(),
//                            }
//                        };
//                        var file = $scope.myFile;
//                        $scope.product = PostFactory.editProduct(file, dataProduct).then(function (product) {
//                            if (product.type === 'success') {
//                                $location.path('/products');
//                                toastr.success(product.text);
//                            }
//                        },
//                                function (msg) {
//                                    alert(msg);
//                                }
//                        );
//                    };
//                }
            } else {
                $location.path('/login');
            }
        })
        .controller("NoteFraisController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.frais = PostFactory.listFrais().then(function (frais) {
                    $scope.frais = frais;
//                    //console.log(frais);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.dateChanged = function () {
                    var jour = $("#dateChanger").val().split('-')[0];
                    var mois = $("#dateChanger").val().split('-')[1];
                    var annee = $("#dateChanger").val().split('-')[2];
                    var date = annee + "-" + mois + "-" + jour;
//                    //console.log(date);
                    $("tbody#listNoteFrais").empty();
                    var dataFrai = {
                        Frai: {
                            date: date
                        }
                    };
                    $scope.fraisfilter = PostFactory.listFraisFilter(dataFrai).then(function (fraisfilter) {
                        $scope.fraisfilter = fraisfilter;
//                        //console.log(fraisfilter);
                        setTimeout(preuvePreview, 1000);
                        setTimeout(function () {
                            if (fraisfilter.length == 0) {
                                toastr.warning("Pas de note de frais pour cette date");
                            } else {
                                $(fraisfilter).each(function (index, value) {
                                    var img = "<a href='http://api.colisexpress.tn/img/" + value.Frai.img + "' id='preuve'>\n\
                                                    <img class='thumbnail' src='http://api.colisexpress.tn/img/" + value.Frai.img + "' style='max-width: 75px;'/>\n\
                                                </a>";
                                    if (value.Frai.img == null) {
                                        img = ""
                                    }
                                    $('tbody#listNoteFrais').append("<tr id='NoteFrais'>\n\
                                                            <td>" + value.Frai.designation + "</td>\n\
                                                            <td>" + value.Frai.motif + "</td>\n\
                                                            <td>" + value.Frai.montant + "</td>\n\
                                                            <td>" + img + "</td>\n\
                                                            <td><a href='#' id='deleteNote' class='btn btn-sm btn-danger'><i class='fa fa-times'></i></a></td>\n\
                                                        </tr>");
                                });
                                setTimeout(preuvePreview, 1000);
                            }
                        }, 100);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
            } else {
                $location.path('/login');
            }
        })
        .controller("StateLivraisonController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.changeChecked = function () {
                    //console.log(this.val());
                }
                $scope.checkboxModel = {
                    value1: false
                };
                $('#checkAllRamassage').click(function () {
                    $('tbody input:checkbox').prop('checked', this.checked);
                    setTimeout(function () {
                        if ($('#checkAllRamassage').val() == 'true' || $('#checkAllRamassage').val() == true) {
                            $('tbody input:checkbox').val('true');
                        } else {
                            $('tbody input:checkbox').val('false');
                        }
                    }, 200);
                });
                $scope.checkboxModelStock = 0;
                $scope.$watch(function () {
                    return $scope.checkboxModelStock;
                }, function () {
                    $scope.checkboxModelStock = Number($scope.checkboxModelStock);
                }, true);
                // statut livrée
                $scope.checkboxLivraison = 0;
                $scope.$watch(function () {
                    return $scope.checkboxLivraison;
                }, function () {
                    $scope.checkboxLivraison = Number($scope.checkboxLivraison);
                }, true);
                // statut absence déstinataire
                $scope.checkboxAbsenceDEST = 0;
                $scope.$watch(function () {
                    return $scope.checkboxAbsenceDEST;
                }, function () {
                    $scope.checkboxAbsenceDEST = Number($scope.checkboxAbsenceDEST);
                }, true);
                // statut réporter destinataire
                $scope.checkboxReporterDEST = 0;
                $scope.$watch(function () {
                    return $scope.checkboxReporterDEST;
                }, function () {
                    $scope.checkboxReporterDEST = Number($scope.checkboxReporterDEST);
                }, true);
                // statut réporter destinataire
                $scope.checkboxReporterLivreur = 0;
                $scope.$watch(function () {
                    return $scope.checkboxReporterLivreur;
                }, function () {
                    $scope.checkboxReporterLivreur = Number($scope.checkboxReporterLivreur);
                }, true);
                // statut erreur destinataire
                $scope.checkboxErreurDEST = 0;
                $scope.$watch(function () {
                    return $scope.checkboxErreurDEST;
                }, function () {
                    $scope.checkboxErreurDEST = Number($scope.checkboxErreurDEST);
                }, true);
                // statut erreur destination
                $scope.checkboxErreurDESTINATION = 0;
                $scope.$watch(function () {
                    return $scope.checkboxErreurDESTINATION;
                }, function () {
                    $scope.checkboxErreurDESTINATION = Number($scope.checkboxErreurDESTINATION);
                }, true);
                // statut Annulation destination
                $scope.checkboxAnnulDEST = 0;
                $scope.$watch(function () {
                    return $scope.checkboxAnnulDEST;
                }, function () {
                    $scope.checkboxAnnulDEST = Number($scope.checkboxAnnulDEST);
                }, true);
                // statut Injoignable
                $scope.checkboxInjoignable = 0;
                $scope.$watch(function () {
                    return $scope.checkboxInjoignable;
                }, function () {
                    $scope.checkboxInjoignable = Number($scope.checkboxInjoignable);
                }, true);
                // statut Téléphone fermer
                $scope.checkboxTelFermer = 0;
                $scope.$watch(function () {
                    return $scope.checkboxTelFermer;
                }, function () {
                    $scope.checkboxTelFermer = Number($scope.checkboxTelFermer);
                }, true);
                // statut Autre
                $scope.checkboxAutre = 0;
                $scope.$watch(function () {
                    return $scope.checkboxAutre;
                }, function () {
                    $scope.checkboxAutre = Number($scope.checkboxAutre);
                }, true);
                $scope.autreRetour = function () {
                    setTimeout(function () {
                        if ($('#checkboxAutre').val() == 1) {
                            $('#DisplayAutreCause').show();
                        } else {
                            $('#DisplayAutreCause').hide();
                        }
                    }, 200);
                };
            } else {
                $location.path('/login');
            }
        })
        .controller("AffecterCommandeUserController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.changeChecked = function () {
                    //console.log(this.val());
                }
                $scope.checkboxModel = {
                    value1: false
                };
                $('#checkAllUser').click(function () {
                    $('tbody input:checkbox').prop('checked', this.checked);
                    setTimeout(function () {
                        if ($('#checkAllRamassage').val() == 'true' || $('#checkAllRamassage').val() == true) {
                            $('tbody input:checkbox').val('true');
                        } else {
                            $('tbody input:checkbox').val('false');
                        }
                    }, 200);
                });
                $scope.affecterGroupeClient = function () {
                    console.log('affecterGroupeClient');
                    var dataCommande = {
                        User: []
                    };
                    $('#ramassageDepotPaginate tr').each(function (i, v) {
                        if ($(v).children().eq(12).children().children().val() == 'true' || $(v).children().eq(12).children().children().val() == true) {
                            dataCommande.User.push({user_id: $(v).attr('data-data-id')});
                        }
                    });
                    $cookieStore.remove('sessionUserCommandeID');
                    $cookieStore.put('sessionUserCommandeID', dataCommande.User);
                    if ($cookieStore.get('sessionUserCommandeID').length !== 0) {
//                            $location.path('/affecter-commandes-client');
                        document.location.href = '#/affecter-commandes-client';
                    }

                    if ($cookieStore.get('sessionUserCommandeID').length === 0) {
                        toastr.warning('Veuillez choisir au moins client');
                    }
                };
                $scope.affectercommandesClients = function ($event) {
                    $event.preventDefault();
                    var dataCommande = {
                        Commercial: {
                            livreur_id: $("#commercialeValue :selected").val(),
                            com_id: $("#commercialeValue :selected").val()

                        },
                        Commande: $cookieStore.get('sessionUserCommandeID')
                    };
                    console.log(dataCommande);
                    $scope.affectercommandesClients = PostFactory.affectercommandesClients(dataCommande).then(function (affectercommandesClients) {
                        if (affectercommandesClients.type === 'success') {
                            $location.path('/module-transporteur');
                            toastr.success(affectercommandesClients.text);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                PostFactory.listLivreurs().then(function (livreurs) {
                    $scope.livreurs = livreurs;
                    //console.log(livreurs);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            } else {
                $location.path('/login');
            }
        })
        .controller("imgPreviewController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location) {
            if ($cookieStore.get('sessionConnected')) {
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
            } else {
                $location.path('/login');
            }
        })
        .controller("MailboxController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location) {
            if ($cookieStore.get('sessionConnected')) {
//                //console.log($cookieStore.get('sessionConnected'));
                var auth = $.parseJSON($cookieStore.get('sessionConnected'));
                var host = auth.email_host;
                var email = auth.email;
                var email_password = auth.email_password;
//                //console.log("-----------" + auth);
//                //console.log(host);
//                //console.log(email);
//                //console.log(email_password);
                var userEmailData = {
                    User: {
                        host: host,
                        username: email,
                        password: email_password,
                        user_id: auth.user_id
                    }
                };
//                var userEmailData = {
//                    User: {
//                        host: '{ssl0.ovh.net:993/ssl}INBOX',
//                        username: 't.mohamed@amyevolution.com',
//                        password: 'AMYMOH123'
//                    }
//                };
                $scope.inbox = PostFactory.getAllInbox(userEmailData).then(function (inbox) {
                    $scope.inbox = inbox.data;
                    $scope.countUnread = inbox.countUnread;
//                    //console.log(inbox);
                }, function (msg) {
                    alert(msg);
                });
                $scope.openMessage = function (msgView) {
//                    //console.log('open mail');
                    var msg_id = parseInt(msgView.message.Message.id);
//                    //console.log(msg_id);
                    var content = msgView.message.Message.content;
                    var from = msgView.message.Message.mail_from;
                    var subject = msgView.message.Message.subject;
                    var date = msgView.message.Message.created;
                    $("li#from").html(from);
                    $("li#subject").html(subject);
                    $("li#date").html(date);
                    var html = /\n--[^\n\r]*\r?\nContent-Type: text\/html[\s\S]*?\r?\n\r?\n([\s\S]*?)\n\r?\n--/gim.exec(content);
                    $("li p#msg").html(html);
                };
            } else {
                $location.path('/login');
            }
        })
        .controller("BonChargementController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location, $uibModal, $log, $compile) {
            if ($cookieStore.get('sessionConnected')) {
                // liste bon chargement
                $scope.bonchargements = PostFactory.listBonChargement().then(function (bonchargements) {
                    $scope.bonchargements = bonchargements;
//                    //console.log(bonchargements);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.bonchargement = PostFactory.bonChargement(id).then(function (bonchargement) {
                        $scope.bonchargement = bonchargement.text;
                        var bonchargementcommandes = bonchargement.text;
                        console.log(bonchargement);
                        var date = bonchargementcommandes.Chargement.created;
                        $scope.formatCreated = {format: 'dd/MM/yyyy', date: date};
//                        $scope.formatCreated = {format: 'EEEE dd MMMM yyyy', date: date};
                        var ref = bonchargementcommandes.Chargement.ref.toString();
                        var ref1 = ref.split('/')[0];
                        var ref2 = ref.split('/')[1].replace(" ", "");
                        var ref3 = ref1 + "/" + ref2;
                        $scope.ref3 = ref3;
                        var count = ref2;
                        if (count.toString().length === 1) {
                            count = "00" + count.toString();
                        }
                        if (count.toString().length === 2) {
                            count = "0" + count.toString();
                        }
                        $scope.count = count;
                        var ref_cex = ref1 + "/ " + count;
//                        //console.log(ref_cex);
                        $scope.ref_cex = ref_cex;
                        $scope.nbresCommandes = bonchargement.commandescount;
                        $scope.mantantChargement = bonchargement.data;
                    });
                }
                $scope.config = PostFactory.showConfig().then(function (config) {
                    $scope.config = config;
                    //console.log(config);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            } else {
                $location.path('/login');
            }
        })
        .controller("CmdsRamassageDepotController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {

        })
        .controller("CmdsEnCoursLivraisonController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {


        })
        .controller("CmdsLivreeController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {

        })
        .controller("CmdsFactureeController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {
            $("div#otherPagesFacturee").html("");
            $scope.CmdsFacturee = PostFactory.listCommandeFactureesPaginate(1, 30).then(function (commandesfacturees) {
                $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                $scope.countFacturee = commandesfacturees.data.pageCount.Commande.count;
                $scope.pageCount = commandesfacturees.data.pageCount.Commande.pageCount;
                $scope.CurrentPage = commandesfacturees.data.pageCount.Commande.page;
                $scope.currentPageFacturee = commandesfacturees.data.pageCount.Commande.page;
                $("button#firstPageFacturee").hide();
                var currentPage = commandesfacturees.data.pageCount.Commande.page;
                var nbrMaxNextPages = 5;
                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                    if (i < commandesfacturees.data.pageCount.Commande.pageCount) {
                        var $html = $compile("<button class='btn btn-default' ng-click='showPageFacturee(" + i + ")'>" + i + "</button>")($scope);
                        $("div#otherPagesFacturee").append($html);
                    }
                }
                if (commandesfacturees.data.pageCount.Commande.prevPage == false) {
                    $("#nextPageFacturee").attr('disabled', false);
                    $("#previousPageFacturee").attr('disabled', true);
                }
            },
                    function (msg) {
                        alert(msg);
                    }
            );
            $scope.nextPageFacturee = function () {
                $("button#firstPageFacturee").show();
                var searchKey = $scope.searchFacturee;
                console.log($scope.CurrentPage);
                console.log($scope.pageCount);
                if ($scope.CurrentPage <= $scope.pageCount) {
                    $scope.CurrentPage = $scope.CurrentPage + 1;
                    $scope.CmdsFacturee = PostFactory.listCommandeFactureesPaginate($scope.CurrentPage, 30, searchKey).then(function (commandesfacturees) {
                        $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                        $scope.currentPage = commandesfacturees.data.pageCount.Commande.page;
                        $scope.currentPageFacturee = commandesfacturees.data.pageCount.Commande.page;
                        var currentPage = commandesfacturees.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + commandesfacturees.data.pageCount.Commande.page;
                        $("div#otherPagesFacturee").html("");
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesfacturees.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageFacturee(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesFacturee").append($html);
                            }
                        }
                        if (commandesfacturees.data.pageCount.Commande.nextPage == false) {
                            $("button#nextPageFacturee").attr('disabled', true);
                            $("button#previousPageFacturee").removeAttr('disabled');
                        } else {
                            $("button#nextPageFacturee").removeAttr('disabled');
                        }
                        if (commandesfacturees.data.pageCount.Commande.previousPage == false) {
                            $("button#previousPageFacturee").attr('disabled', true);
                        } else {
                            $("button#previousPageFacturee").removeAttr('disabled');
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
            $scope.previousPageFacturee = function () {
                var searchKey = $scope.searchFacturee;
                if ($scope.CurrentPage > 1) {
                    $scope.CurrentPage = $scope.CurrentPage - 1;
                    $scope.CmdsFacturee = PostFactory.listCommandeFactureesPaginate($scope.CurrentPage, 30, searchKey).then(function (commandesfacturees) {
                        $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;

                        $scope.currentPage = commandesfacturees.data.pageCount.Commande.page;
                        var currentPage = commandesfacturees.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + commandesfacturees.data.pageCount.Commande.page;
                        $("div#otherPagesFacturee").html("");
                        for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesfacturees.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageFacturee(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesFacturee").append($html);
                            }
                        }
                        if (commandesfacturees.data.pageCount.Commande.nextPage == false) {
                            console.log("LAST PAGE");
                            $("button#nextPageFacturee").attr('disabled', true);
                            $("button#previousPageFacturee").removeAttr('disabled');
                        } else {
                            $("button#nextPageFacturee").removeAttr('disabled');
                        }
                        if (commandesfacturees.data.pageCount.Commande.prevPage == false) {
                            console.log("PAGE ONE");
                            $("button#firstPageFacturee").hide();
                            $("button#nextPageFacturee").removeAttr('disabled');
                            $("button#previousPageFacturee").attr('disabled', true);
                        } else {
                            $("button#previousPageFacturee").removeAttr('disabled');
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                } else {
                    console.log("PAGE ONE");
                    $("button#firstPageFacturee").hide();
                    $("button#nextPageFacturee").removeAttr('disabled');
                    $("button#previousPageFacturee").attr('disabled', true);
                }
            };
            $scope.firstPageFacturee = function () {
                var searchKey = $scope.searchFacturee;
                $("div#otherPagesFacturee").html("");
                $scope.CmdsFacturee = PostFactory.listCommandeFactureesPaginate(1, 30, searchKey).then(function (commandesfacturees) {
                    $scope.CmdsFacturee = commandesfacturees.data.clients;
                    $scope.pageCount = commandesfacturees.data.pageCount.Commande.pageCount;
                    $scope.currentPage = commandesfacturees.data.pageCount.Commande.page;
                    var currentPage = commandesfacturees.data.pageCount.Commande.page;
                    var nbrMaxNextPages = 5;
                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                        if (i < commandesfacturees.data.pageCount.Commande.pageCount) {
                            var $html = $compile("<button class='btn btn-default' ng-click='showPageFacturee(" + i + ")'>" + i + "</button>")($scope);
                            $("div#otherPagesFacturee").append($html);
                        }
                    }
                    if (commandesfacturees.data.countPage.Commande.prevPage == false) {
                        $("button#nextPageFacturee").attr('disabled', false);
                        $("button#previousPageFacturee").attr('disabled', true);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            $scope.showPageFacturee = function (index) {
                var searchKey = $scope.searchFacturee;
                $scope.CmdsFacturee = PostFactory.listCommandeFactureesPaginate(index, 30, searchKey).then(function (commandesfacturees) {
                    $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;

                    $scope.pageCount = commandesfacturees.data.pageCount.Commande.pageCount;
                    $scope.currentPage = commandesfacturees.data.pageCount.Commande.page;
                    $scope.CurrentPage = commandesfacturees.data.pageCount.Commande.page;
                    if (commandesfacturees.data.pageCount.Commande.prevPage == false) {
                        $("button#nextPageFacturee").attr('disabled', false);
                        $("button#previousPageFacturee").attr('disabled', true);
                        $("button#currentPageFacturee").hide();
                        $("button#firstPageFacturee").show();
                    }
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
                    $scope.CmdsFacturee = PostFactory.listCommandeFactureesPaginate(1, 30, searchKey, ville).then(function (commandesfacturees) {
                        $("div#otherPagesFacturee").html("");
                        $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                        $scope.pageCount = commandesfacturees.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandesfacturees.data.pageCount.Commande.page;
                        var currentPage = commandesfacturees.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + commandesfacturees.data.pageCount.Commande.pageCount;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesfacturees.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageFacturee(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesFacturee").append($html);
                            }
                        }
                        if (commandesfacturees.data.pageCount.Commande.prevPage == false) {
                            $("button#nextPageFacturee").attr('disabled', false);
                            $("button#previousPageFacturee").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                } else {
                    if (searchKey === "") {
                        console.log("LAUNCH RESET");
                        $scope.CmdsFacturee = PostFactory.listCommandeFactureesPaginate(1, 30, searchKey).then(function (commandesfacturees) {
                            $("div#otherPagesFacturee").html("");
                            $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                            $scope.pageCount = commandesfacturees.data.pageCount.Commande.pageCount;
                            $scope.currentPage = commandesfacturees.data.pageCount.Commande.page;
                            var currentPage = commandesfacturees.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandesfacturees.data.pageCount.Commande.pageCount;
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandesfacturees.data.pageCount.Commande.pageCount && i <= 5) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageFacturee(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesFacturee").append($html);
                                }
                            }
                            if (commandesfacturees.data.pageCount.Commande.prevPage == false) {
                                $("button#nextPageFacturee").attr('disabled', false);
                                $("button#previousPageFacturee").attr('disabled', true);
                            }
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
                $scope.CmdsFacturee = PostFactory.listCommandeFactureesPaginate(1, 30).then(function (commandesfacturees) {
                    $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                    $scope.countFacturee = commandesfacturees.data.pageCount.Commande.pageCount;
                    $scope.pageCount = commandesfacturees.data.pageCount.Commande.pageCount;
                    $scope.CurrentPage = commandesfacturees.data.pageCount.Commande.page;
                    $scope.currentPageFacturee = commandesfacturees.data.pageCount.Commande.page;
                    $("button#firstPageFacturee").hide();
                    var currentPage = commandesfacturees.data.pageCount.Commande.page;
                    var nbrMaxNextPages = 5;
                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                        if (i < commandesfacturees.data.pageCount.Commande.pageCount) {
                            var $html = $compile("<button class='btn btn-default' ng-click='showPageFacturee(" + i + ")'>" + i + "</button>")($scope);
                            $("div#otherPagesFacturee").append($html);
                        }
                    }
                    if (commandesfacturees.data.pageCount.Commande.prevPage == false) {
                        $("#nextPageFacturee").attr('disabled', false);
                        $("#previousPageFacturee").attr('disabled', true);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
        })
        .controller("CmdsRetourController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {

        })
        .controller("CmdsEnStockController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {
            $("div#otherPagesEnStock").html("");
            $scope.CmdsEnStock = PostFactory.listCommandeEnstocksPaginate(1, 30).then(function (commandesenstock) {
                $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                $scope.countEnStock = commandesenstock.data.pageCount.Commande.count;
                $scope.countwaitdone = commandesenstock.countwaitdone;
                $scope.countwaitcancel = commandesenstock.countwaitcancel;
                $scope.countwaitback = commandesenstock.countwaitback;
                $scope.pageCount = commandesenstock.data.pageCount.Commande.pageCount;
                $scope.CurrentPage = commandesenstock.data.pageCount.Commande.page;
                $scope.currentPageEnStock = commandesenstock.data.pageCount.Commande.page;
                $("button#firstPageEnStock").hide();
                var currentPage = commandesenstock.data.pageCount.Commande.page;
                var nbrMaxNextPages = 5;
                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                    if (i < commandesenstock.data.pageCount.Commande.pageCount) {
                        var $html = $compile("<button class='btn btn-default' ng-click='showPageEnStock(" + i + ")'>" + i + "</button>")($scope);
                        $("div#otherPagesEnStock").append($html);
                    }
                }
                if (commandesenstock.data.pageCount.Commande.prevPage == false) {
                    $("#nextPageEnStock").attr('disabled', false);
                    $("#previousPageEnStock").attr('disabled', true);
                }
            },
                    function (msg) {
                        alert(msg);
                    }
            );
            $scope.nextPageEnStock = function () {
                $("button#firstPageEnStock").show();
                var searchKey = $scope.searchEnStock;
                console.log($scope.CurrentPage);
                console.log($scope.pageCount);
                if ($scope.CurrentPage <= $scope.pageCount) {
                    $scope.CurrentPage = $scope.CurrentPage + 1;
                    $scope.CmdsEnStock = PostFactory.listCommandeEnstocksPaginate($scope.CurrentPage, 30, searchKey).then(function (commandesenstock) {
                        $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                        $scope.currentPage = commandesenstock.data.pageCount.Commande.page;
                        $scope.currentPageEnStock = commandesenstock.data.pageCount.Commande.page;
                        var currentPage = commandesenstock.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + commandesenstock.data.pageCount.Commande.page;
                        $("div#otherPagesEnStock").html("");
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesenstock.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageEnStock(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesEnStock").append($html);
                            }
                        }
                        if (commandesenstock.data.pageCount.Commande.nextPage == false) {
                            $("button#nextPageEnStock").attr('disabled', true);
                            $("button#previousPageEnStock").removeAttr('disabled');
                        } else {
                            $("button#nextPageEnStock").removeAttr('disabled');
                        }
                        if (commandesenstock.data.pageCount.Commande.previousPage == false) {
                            $("button#previousPageEnStock").attr('disabled', true);
                        } else {
                            $("button#previousPageEnStock").removeAttr('disabled');
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
            $scope.previousPageEnStock = function () {
                var searchKey = $scope.searchEnStock;
                if ($scope.CurrentPage > 1) {
                    $scope.CurrentPage = $scope.CurrentPage - 1;
                    $scope.CmdsEnStock = PostFactory.listCommandeEnstocksPaginate($scope.CurrentPage, 30, searchKey).then(function (commandesenstock) {
                        $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;

                        $scope.currentPage = commandesenstock.data.pageCount.Commande.page;
                        var currentPage = commandesenstock.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + commandesenstock.data.pageCount.Commande.page;
                        $("div#otherPagesEnStock").html("");
                        for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesenstock.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageEnStock(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesEnStock").append($html);
                            }
                        }
                        if (commandesenstock.data.pageCount.Commande.nextPage == false) {
                            console.log("LAST PAGE");
                            $("button#nextPageEnStock").attr('disabled', true);
                            $("button#previousPageEnStock").removeAttr('disabled');
                        } else {
                            $("button#nextPageEnStock").removeAttr('disabled');
                        }
                        if (commandesenstock.data.pageCount.Commande.prevPage == false) {
                            console.log("PAGE ONE");
                            $("button#firstPageEnStock").hide();
                            $("button#nextPageEnStock").removeAttr('disabled');
                            $("button#previousPageEnStock").attr('disabled', true);
                        } else {
                            $("button#previousPageEnStock").removeAttr('disabled');
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                } else {
                    console.log("PAGE ONE");
                    $("button#firstPageEnStock").hide();
                    $("button#nextPageEnStock").removeAttr('disabled');
                    $("button#previousPageEnStock").attr('disabled', true);
                }
            };
            $scope.firstPageEnStock = function () {
                var searchKey = $scope.searchEnStock;
                $("div#otherPagesEnStock").html("");
                $scope.CmdsEnStock = PostFactory.listCommandeEnstocksPaginate(1, 30, searchKey).then(function (commandesenstock) {
                    $scope.CmdsEnStock = commandesenstock.data.clients;
                    $scope.pageCount = commandesenstock.data.pageCount.Commande.pageCount;
                    $scope.currentPage = commandesenstock.data.pageCount.Commande.page;
                    var currentPage = commandesenstock.data.pageCount.Commande.page;
                    var nbrMaxNextPages = 5;
                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                        if (i < commandesenstock.data.pageCount.Commande.pageCount) {
                            var $html = $compile("<button class='btn btn-default' ng-click='showPageEnStock(" + i + ")'>" + i + "</button>")($scope);
                            $("div#otherPagesEnStock").append($html);
                        }
                    }
                    if (commandesenstock.data.countPage.Commande.prevPage == false) {
                        $("button#nextPageEnStock").attr('disabled', false);
                        $("button#previousPageEnStock").attr('disabled', true);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            $scope.showPageEnStock = function (index) {
                var searchKey = $scope.searchEnStock;
                $scope.CmdsEnStock = PostFactory.listCommandeEnstocksPaginate(index, 30, searchKey).then(function (commandesenstock) {
                    $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;

                    $scope.pageCount = commandesenstock.data.pageCount.Commande.pageCount;
                    $scope.currentPage = commandesenstock.data.pageCount.Commande.page;
                    $scope.CurrentPage = commandesenstock.data.pageCount.Commande.page;
                    if (commandesenstock.data.pageCount.Commande.prevPage == false) {
                        $("button#nextPageEnStock").attr('disabled', false);
                        $("button#previousPageEnStock").attr('disabled', true);
                        $("button#currentPageEnStock").hide();
                        $("button#firstPageEnStock").show();
                    }
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
                    $scope.CmdsEnStock = PostFactory.listCommandeEnstocksPaginate(1, 30, searchKey, ville).then(function (commandesenstock) {
                        $("div#otherPagesEnStock").html("");
                        $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                        $scope.pageCount = commandesenstock.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandesenstock.data.pageCount.Commande.page;
                        var currentPage = commandesenstock.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + commandesenstock.data.pageCount.Commande.pageCount;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesenstock.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageEnStock(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesEnStock").append($html);
                            }
                        }
                        if (commandesenstock.data.pageCount.Commande.prevPage == false) {
                            $("button#nextPageEnStock").attr('disabled', false);
                            $("button#previousPageEnStock").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                } else {
                    if (searchKey === "") {
                        console.log("LAUNCH RESET");
                        $scope.CmdsEnStock = PostFactory.listCommandeEnstocksPaginate(1, 30, searchKey).then(function (commandesenstock) {
                            $("div#otherPagesEnStock").html("");
                            $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                            $scope.pageCount = commandesenstock.data.pageCount.Commande.pageCount;
                            $scope.currentPage = commandesenstock.data.pageCount.Commande.page;
                            var currentPage = commandesenstock.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandesenstock.data.pageCount.Commande.pageCount;
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandesenstock.data.pageCount.Commande.pageCount && i <= 5) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageEnStock(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesEnStock").append($html);
                                }
                            }
                            if (commandesenstock.data.pageCount.Commande.prevPage == false) {
                                $("button#nextPageEnStock").attr('disabled', false);
                                $("button#previousPageEnStock").attr('disabled', true);
                            }
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
                $scope.CmdsEnStock = PostFactory.listCommandeEnstocksPaginate(1, 30).then(function (commandesenstock) {
                    $scope.CmdsEnStock = commandesenstock.data.commandesEnStock;
                    $scope.countEnStock = commandesenstock.data.pageCount.Commande.pageCount;
                    $scope.pageCount = commandesenstock.data.pageCount.Commande.pageCount;
                    $scope.CurrentPage = commandesenstock.data.pageCount.Commande.page;
                    $scope.currentPageEnStock = commandesenstock.data.pageCount.Commande.page;
                    $("button#firstPageEnStock").hide();
                    var currentPage = commandesenstock.data.pageCount.Commande.page;
                    var nbrMaxNextPages = 5;
                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                        if (i < commandesenstock.data.pageCount.Commande.pageCount) {
                            var $html = $compile("<button class='btn btn-default' ng-click='showPageEnStock(" + i + ")'>" + i + "</button>")($scope);
                            $("div#otherPagesEnStock").append($html);
                        }
                    }
                    if (commandesenstock.data.pageCount.Commande.prevPage == false) {
                        $("#nextPageEnStock").attr('disabled', false);
                        $("#previousPageEnStock").attr('disabled', true);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
        })
        // commande annulée module transporteur
        .controller("CmdsAnnuleeController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {

        })
        // retour expéditeur
        .controller("CmdsRetourExpediteurController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {
            $("div#otherPagesRetourExpediteur").html("");
            $scope.CmdsRetourExpediteur = PostFactory.listRetoursExpediteurPaginate(1, 30).then(function (listretoursexpediteur) {
                $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                $scope.countRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.count;
                $scope.pageCount = listretoursexpediteur.data.pageCount.Commande.pageCount;
                $scope.CurrentPage = listretoursexpediteur.data.pageCount.Commande.page;
                $scope.currentPageRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.page;
                $("button#firstPageRetourExpediteur").hide();
                var currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                var nbrMaxNextPages = 5;
                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                    if (i < listretoursexpediteur.data.pageCount.Commande.pageCount) {
                        var $html = $compile("<button class='btn btn-default' ng-click='showPageRetourExpediteur(" + i + ")'>" + i + "</button>")($scope);
                        $("div#otherPagesRetourExpediteur").append($html);
                    }
                }
                if (listretoursexpediteur.data.pageCount.Commande.prevPage == false) {
                    $("#nextPageRetourExpediteur").attr('disabled', false);
                    $("#previousPageRetourExpediteur").attr('disabled', true);
                }
            },
                    function (msg) {
                        alert(msg);
                    }
            );
            $scope.nextPageRetourExpediteur = function () {
                $("button#firstPageRetourExpediteur").show();
                var searchKey = $scope.searchRetourExpediteur;
                console.log($scope.CurrentPage);
                console.log($scope.pageCount);
                if ($scope.CurrentPage <= $scope.pageCount) {
                    $scope.CurrentPage = $scope.CurrentPage + 1;
                    $scope.CmdsRetourExpediteur = PostFactory.listRetoursExpediteurPaginate($scope.CurrentPage, 30, searchKey).then(function (listretoursexpediteur) {
                        $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                        $scope.currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                        $scope.currentPageRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.page;
                        var currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + listretoursexpediteur.data.pageCount.Commande.page;
                        console.log("pageCount-------" + listretoursexpediteur.data.pageCount.Commande.pageCount);
                        if (listretoursexpediteur.data.pageCount.Commande.pageCount == 1) {
                            $("button#nextPageRetourExpediteur").attr('disabled', true);
                            $("button#previousPageRetourExpediteur").attr('disabled', true);
                        }
                        $("div#otherPagesRetourExpediteur").html("");
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < listretoursexpediteur.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageRetourExpediteur(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesRetourExpediteur").append($html);
                            }
                        }
                        if (listretoursexpediteur.data.pageCount.Commande.nextPage == false) {
                            $("button#nextPageRetourExpediteur").attr('disabled', true);
                            $("button#previousPageRetourExpediteur").removeAttr('disabled');
                        } else {
                            $("button#nextPageRetourExpediteur").removeAttr('disabled');
                        }
                        if (listretoursexpediteur.data.pageCount.Commande.previousPage == false) {
                            $("button#previousPageRetourExpediteur").attr('disabled', true);
                        } else {
                            $("button#previousPageRetourExpediteur").removeAttr('disabled');
                        }
                        if (listretoursexpediteur.data.pageCount.Commande.pageCount == 1) {
                            $("button#nextPageRetourExpediteur").attr('disabled', true);
                            $("button#previousPageRetourExpediteur").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
            $scope.previousPageRetourExpediteur = function () {
                var searchKey = $scope.searchRetourExpediteur;
                if ($scope.CurrentPage > 1) {
                    $scope.CurrentPage = $scope.CurrentPage - 1;
                    $scope.CmdsRetourExpediteur = PostFactory.listRetoursExpediteurPaginate($scope.CurrentPage, 30, searchKey).then(function (listretoursexpediteur) {
                        $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;

                        $scope.currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                        var currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + listretoursexpediteur.data.pageCount.Commande.page;
                        $("div#otherPagesRetourExpediteur").html("");
                        for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < listretoursexpediteur.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageRetourExpediteur(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesRetourExpediteur").append($html);
                            }
                        }
                        if (listretoursexpediteur.data.pageCount.Commande.nextPage == false) {
                            console.log("LAST PAGE");
                            $("button#nextPageRetourExpediteur").attr('disabled', true);
                            $("button#previousPageRetourExpediteur").removeAttr('disabled');
                        } else {
                            $("button#nextPageRetourExpediteur").removeAttr('disabled');
                        }
                        if (listretoursexpediteur.data.pageCount.Commande.prevPage == false) {
                            console.log("PAGE ONE");
                            $("button#firstPageRetourExpediteur").hide();
                            $("button#nextPageRetourExpediteur").removeAttr('disabled');
                            $("button#previousPageRetourExpediteur").attr('disabled', true);
                        } else {
                            $("button#previousPageRetourExpediteur").removeAttr('disabled');
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                } else {
                    console.log("PAGE ONE");
                    $("button#firstPageRetourExpediteur").hide();
                    $("button#nextPageRetourExpediteur").removeAttr('disabled');
                    $("button#previousPageRetourExpediteur").attr('disabled', true);
                }
            };
            $scope.firstPageRetourExpediteur = function () {
                var searchKey = $scope.searchRetourExpediteur;
                $("div#otherPagesRetourExpediteur").html("");
                $scope.CmdsRetourExpediteur = PostFactory.listRetoursExpediteurPaginate(1, 30, searchKey).then(function (listretoursexpediteur) {
                    $scope.CmdsRetourExpediteur = listretoursexpediteur.data.clients;
                    $scope.pageCount = listretoursexpediteur.data.pageCount.Commande.pageCount;
                    $scope.currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                    var currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                    var nbrMaxNextPages = 5;
                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                        if (i < listretoursexpediteur.data.pageCount.Commande.pageCount) {
                            var $html = $compile("<button class='btn btn-default' ng-click='showPageRetourExpediteur(" + i + ")'>" + i + "</button>")($scope);
                            $("div#otherPagesRetourExpediteur").append($html);
                        }
                    }
                    if (listretoursexpediteur.data.countPage.Commande.prevPage == false) {
                        $("button#nextPageRetourExpediteur").attr('disabled', false);
                        $("button#previousPageRetourExpediteur").attr('disabled', true);
                    }
                    if (listretoursexpediteur.data.pageCount.Commande.pageCount == 1) {
                        $("button#nextPageRetourExpediteur").attr('disabled', true);
                        $("button#previousPageRetourExpediteur").attr('disabled', true);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            $scope.showPageRetourExpediteur = function (index) {
                var searchKey = $scope.searchRetourExpediteur;
                $scope.CmdsRetourExpediteur = PostFactory.listRetoursExpediteurPaginate(index, 30, searchKey).then(function (listretoursexpediteur) {
                    $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;

                    $scope.pageCount = listretoursexpediteur.data.pageCount.Commande.pageCount;
                    $scope.currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                    $scope.CurrentPage = listretoursexpediteur.data.pageCount.Commande.page;
                    if (listretoursexpediteur.data.pageCount.Commande.prevPage == false) {
                        $("button#nextPageRetourExpediteur").attr('disabled', false);
                        $("button#previousPageRetourExpediteur").attr('disabled', true);
                        $("button#currentPageRetourExpediteur").hide();
                        $("button#firstPageRetourExpediteur").show();
                    }
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
                    $scope.CmdsRetourExpediteur = PostFactory.listRetoursExpediteurPaginate(1, 30, searchKey, ville).then(function (listretoursexpediteur) {
                        $("div#otherPagesRetourExpediteur").html("");
                        $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                        $scope.pageCount = listretoursexpediteur.data.pageCount.Commande.pageCount;
                        $scope.currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                        var currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + listretoursexpediteur.data.pageCount.Commande.pageCount;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < listretoursexpediteur.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageRetourExpediteur(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesRetourExpediteur").append($html);
                            }
                        }
                        if (listretoursexpediteur.data.pageCount.Commande.prevPage == false) {
                            $("button#nextPageRetourExpediteur").attr('disabled', false);
                            $("button#previousPageRetourExpediteur").attr('disabled', true);
                        }
                        if (listretoursexpediteur.data.pageCount.Commande.pageCount == 1) {
                            $("button#nextPageRetourExpediteur").attr('disabled', true);
                            $("button#previousPageRetourExpediteur").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                } else {
                    if (searchKey === "") {
                        console.log("LAUNCH RESET");
                        $scope.CmdsRetourExpediteur = PostFactory.listRetoursExpediteurPaginate(1, 30, searchKey).then(function (listretoursexpediteur) {
                            $("div#otherPagesRetourExpediteur").html("");
                            $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                            $scope.pageCount = listretoursexpediteur.data.pageCount.Commande.pageCount;
                            $scope.currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                            var currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + listretoursexpediteur.data.pageCount.Commande.pageCount;
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < listretoursexpediteur.data.pageCount.Commande.pageCount && i <= 5) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageRetourExpediteur(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesRetourExpediteur").append($html);
                                }
                            }
                            if (listretoursexpediteur.data.pageCount.Commande.prevPage == false) {
                                $("button#nextPageRetourExpediteur").attr('disabled', false);
                                $("button#previousPageRetourExpediteur").attr('disabled', true);
                            }
                            if (listretoursexpediteur.data.pageCount.Commande.pageCount == 1) {
                                $("button#nextPageRetourExpediteur").attr('disabled', true);
                                $("button#previousPageRetourExpediteur").attr('disabled', true);
                            }
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
                $scope.CmdsRetourExpediteur = PostFactory.listRetoursExpediteurPaginate(1, 30).then(function (listretoursexpediteur) {
                    $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                    $scope.countRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.pageCount;
                    $scope.pageCount = listretoursexpediteur.data.pageCount.Commande.pageCount;
                    $scope.CurrentPage = listretoursexpediteur.data.pageCount.Commande.page;
                    $scope.currentPageRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.page;
                    $("button#firstPageRetourExpediteur").hide();
                    var currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                    var nbrMaxNextPages = 5;
                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                        if (i < listretoursexpediteur.data.pageCount.Commande.pageCount) {
                            var $html = $compile("<button class='btn btn-default' ng-click='showPageRetourExpediteur(" + i + ")'>" + i + "</button>")($scope);
                            $("div#otherPagesRetourExpediteur").append($html);
                        }
                    }
                    if (listretoursexpediteur.data.pageCount.Commande.prevPage == false) {
                        $("#nextPageRetourExpediteur").attr('disabled', false);
                        $("#previousPageRetourExpediteur").attr('disabled', true);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
        })
        .controller("CmdsClientRecupereesController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {

        })
        .controller("EspaceClientController", function ($rootScope, $scope, PostFactory, $filter, $timeout, $cookieStore, $cookies, $location, $uibModal, $log, $compile) {
            if ($cookieStore.get('sessionConnected')) {
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
                            if ($.inArray(state, ['Non Traitée', 'Non Traitée depot', 'En Cours']) !== -1) {
                                switch (state) {
                                    case "Non Traitée":
                                        $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                        textToSound("Commande En attente ramassage");
                                        $("#globalSearch").val("");
                                        $location.path('/view-commande-for-client/' + user_id);
                                        setTimeout(function () {
                                            $(document).find("input[ng-model='search']").val(refCmd).trigger("change");
                                        }, 1000);
                                        break;
                                    case "Non Traitée depot":
                                        $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                        textToSound("Commande En attente dépôt");
                                        $("#globalSearch").val("");
                                        $location.path('/view-commande-for-client/' + user_id);
                                        setTimeout(function () {
                                            $(document).find("input[ng-model='search']").val(refCmd).trigger("change");
                                        }, 1000);
                                        break;
                                    case "En Cours":
                                        $(document).find("a[data-state-cmd='" + state + "']").tab('show');
                                        textToSound("Commande récupérée");
                                        $("#globalSearch").val("");
                                        $location.path('/view-recuperee-for-client/' + user_id);
                                        setTimeout(function () {
                                            $(document).find("input[ng-model='search']").val(refCmd).trigger("change");
                                        }, 1000);
                                }
                            } else {
                                switch (state) {
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
                            }
                        });
                    }
                }
                $scope.livreurs = PostFactory.listLivreurs().then(function (livreurs) {
                    $scope.livreurs = livreurs;
                    //console.log(livreurs);
                },
                        function (msg) {
                            alert(msg);
                        }
                );

                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    // list commandes récupérer for client
                    var dataCommande = {
                        Commande: {
                            user_id: id
                        }
                    };
                    $scope.encoursinclient = PostFactory.listEncoursUser(dataCommande).then(function (encoursinclient) {
                        $scope.encoursinclient = encoursinclient;
                        //console.log(encoursinclient);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }

                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.bonchargement = PostFactory.bonChargement(id).then(function (bonchargement) {
                        $scope.bonchargement = bonchargement.text;
                        var bonchargementcommandes = bonchargement.text;
                        //console.log(bonchargement);
                        var date = bonchargementcommandes.Chargement.created;
                        $scope.formatCreated = {format: 'dd/MM/yyyy', date: date};
//                        $scope.formatCreated = {format: 'EEEE dd MMMM yyyy', date: date};
                        var ref = bonchargementcommandes.Chargement.ref.toString();
                        var ref1 = ref.split('/')[0];
                        var ref2 = ref.split('/')[1].replace(" ", "");
                        var ref3 = ref1 + "/" + ref2;
                        $scope.ref3 = ref3;
                        var count = ref2;
                        if (count.toString().length === 1) {
                            count = "00" + count.toString();
                        }
                        if (count.toString().length === 2) {
                            count = "0" + count.toString();
                        }
                        $scope.count = count;
                        var ref_cex = ref1 + "/ " + count;
//                        //console.log(ref_cex);
                        $scope.ref_cex = ref_cex;
                        $scope.nbresCommandes = bonchargement.commandescount;
                        $scope.mantantChargement = bonchargement.data;
                    });
                }
                $scope.config = PostFactory.showConfig().then(function (config) {
                    $scope.config = config;
                    //console.log(config);
                },
                        function (msg) {
                            alert(msg);
                        }
                );

                $scope.checkbox = 0;
                $scope.$watch(function () {
                    return $scope.checkbox;
                }, function () {
                    $scope.checkbox = Number($scope.checkbox);
                }, true);
                $scope.ReplaceCode = function (keyEvent) {
//                    //console.log('data');
                    var ancient_code = $("#CodeBarre").val();
                    setTimeout(function () {
                        $("#CodeBarre").val(ancient_code.replace("°", "-").replace("°", "-"));
                    }, 100);
                };
                $scope.update_en_recuperee = function () {
                    console.log($rootScope.CmdsClientRecuperees);
                    // list client in commandes récupérées
//                        $scope.yourModel.yourValue = whatever;
//                    $scope.$watch(function () {
//                        return
//                    $scope.$digest(function () {
                    $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate(1, 30).then(function (clientsrecuperer) {
                        $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                        console.log(clientsrecuperer.data.clientCommandesRecuperee);
                        $scope.countClientRecuperees = clientsrecuperer.data.pageCount.User.count;
                        $scope.countRecuperees = clientsrecuperer.count;
                        $scope.pageCount = clientsrecuperer.data.pageCount.User.pageCount;
                        $scope.CurrentPage = clientsrecuperer.data.pageCount.User.page;
                        $scope.currentPageClientRecuperees = clientsrecuperer.data.pageCount.User.page;
                        $("button#firstPageClientRecuperees").hide();
                        var currentPage = clientsrecuperer.data.pageCount.User.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < clientsrecuperer.data.pageCount.User.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageClientRecuperees(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesClientRecuperees").append($html);
                            }
                        }
                        if (clientsrecuperer.data.pageCount.User.prevPage == false) {
                            $("#nextPageClientRecuperees").attr('disabled', false);
                            $("#previousPageClientRecuperees").attr('disabled', true);
                        }
                        if (clientsrecuperer.data.pageCount.User.pageCount == 1) {
                            $("#nextPageClientRecuperees").attr('disabled', true);
                            $("#previousPageClientRecuperees").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.update_en_stock = function () {
                    $('#noFocus').blur();
                    setBarcode();
                    setTimeout(function () {
                        $('#CodeBarre').focus();
                    }, 500);
//                    $('tbody#CommaneInStock').empty();
//                    $scope.commandesenstock = PostFactory.listCommandeEnstocks().then(function (commandesenstock) {
//                        $scope.commandesenstock = commandesenstock;
//                        //console.log(commandesenstock);
//                        setTimeout(function () {
//                            $('#noFocus').blur();
//                        }, 200);
//                    },
//                            function (msg) {
//                                alert(msg);
//                            }
//                    );
                };
                // liste commandes ramassage et dépôt 
//                $scope.listramassagedepots = PostFactory.listRamassageDepot().then(function (listramassagedepots) {
//                    $scope.listramassagedepots = listramassagedepots;
//                    //console.log(listramassagedepots);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
//                 liste CLIENT TRANSPORTEUR
                $scope.clientstransporteur = PostFactory.listClientTransporteur().then(function (clientstransporteur) {
                    $scope.clientstransporteur = clientstransporteur;
//                    console.log(clientstransporteur);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.ficheExpediteur = function () {
//                    $event.preventDefault();
                    setTimeout(function () {
                        console.log($scope.ficheExpediteurTRS);
                        var expediteur_id = $scope.ficheExpediteurTRS;
                        if (expediteur_id === 'undefined' || expediteur_id == undefined) {
                            toastr.error('Veuillez choisir un expediteur');
                        } else {
                            document.location.href = '#/fiche-expediteur/' + expediteur_id;
//                            $location.path('/fiche-expediteur/' + expediteur_id);
                        }
                    }, 200);
                }
                $scope.update_facturees = function () {
                    // liste commandes facturées
//                    $scope.commandesfacturees = PostFactory.listCommandeFacturees().then(function (commandesfacturees) {
//                        $scope.commandesfacturees = commandesfacturees.data;
//                        $scope.countcommandesfacturees = commandesfacturees.count;
//                    },
//                            function (msg) {
//                                alert(msg);
//                            }
//                    );
                    $("div#otherPagesFacturee").html("");
                    $scope.CmdsFacturee = PostFactory.listCommandeFactureesPaginate(1, 30).then(function (commandesfacturees) {
                        $scope.CmdsFacturee = commandesfacturees.data.commandesFacturee;
                        $scope.countFacturee = commandesfacturees.data.pageCount.Commande.count;
                        $scope.pageCount = commandesfacturees.data.pageCount.Commande.pageCount;
                        $scope.CurrentPage = commandesfacturees.data.pageCount.Commande.page;
                        $scope.currentPageFacturee = commandesfacturees.data.pageCount.Commande.page;
                        $("button#firstPageFacturee").hide();
                        var currentPage = commandesfacturees.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesfacturees.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageFacturee(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesFacturee").append($html);
                            }
                        }
                        if (commandesfacturees.data.pageCount.Commande.prevPage == false) {
                            $("#nextPageFacturee").attr('disabled', false);
                            $("#previousPageFacturee").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.update_retour_expediteur = function () {
                    // liste commandes retournée à l'expediteur
                    $("div#otherPagesRetourExpediteur").html("");
                    $scope.CmdsRetourExpediteur = PostFactory.listRetoursExpediteurPaginate(1, 30).then(function (listretoursexpediteur) {
                        $scope.CmdsRetourExpediteur = listretoursexpediteur.data.commandesRetourExpediteur;
                        $scope.countRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.count;
                        $scope.pageCount = listretoursexpediteur.data.pageCount.Commande.pageCount;
                        $scope.CurrentPage = listretoursexpediteur.data.pageCount.Commande.page;
                        $scope.currentPageRetourExpediteur = listretoursexpediteur.data.pageCount.Commande.page;
                        $("button#firstPageRetourExpediteur").hide();
                        var currentPage = listretoursexpediteur.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < listretoursexpediteur.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageRetourExpediteur(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesRetourExpediteur").append($html);
                            }
                        }
                        if (listretoursexpediteur.data.pageCount.Commande.prevPage == false) {
                            $("#nextPageRetourExpediteur").attr('disabled', false);
                            $("#previousPageRetourExpediteur").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
//                    $scope.listretoursexpediteur = PostFactory.listRetoursExpediteur().then(function (listretoursexpediteur) {
//                        $scope.listretoursexpediteur = listretoursexpediteur.data;
//                        $scope.countretoursexpediteur = listretoursexpediteur.count;
//                    },
//                            function (msg) {
//                                alert(msg);
//                            }
//                    );
                };
                $scope.myFunct = function (keyEvent) {
                    keyEvent.stopPropagation();
                    if (keyEvent.which === 13) {
                        var ref = "";
                        var str = $.trim($("#CodeBarre").val());
                        if (str.indexOf(")") == -1) {
                            ref = $("#CodeBarre").val();
                        } else {
                            ref = decodeBarcode($("#CodeBarre").val());
                        }
                        $("#CodeBarre").val(ref);
                        setTimeout(function () {
                            $("#CodeBarre").val(ref);
                        }, 100);
                        $scope.commandeBarrecode = PostFactory.viewCommandeBarrecodeStock(ref).then(function (commandeBarrecode) {
                            $scope.commandeBarrecode = commandeBarrecode;
                            var commandeBarre = commandeBarrecode.text;
                            if (commandeBarrecode.type == 'error') {
                                toastr.error(commandeBarrecode.text);
                                $("#CodeBarre").val("");
                            } else if (commandeBarrecode.type == 'warning') {
                                toastr.warning(commandeBarrecode.text);
                                $("#CodeBarre").val("");
                            } else {
                                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                                $scope.Auth = Auth.user;
                                var state = 'En stock';
                                var cause_nonlivraison = null;
                                var countRetour = commandeBarre.Commande.countRetour || 0;
                                var newCount = countRetour;
                                if (commandeBarre.Commande.state == 'Retour' || commandeBarre.Commande.state == 'AttenteLivraison') {
                                    state = 'Retour';
                                    if (parseInt(countRetour) > 1) {
                                        state = 'Annulée';
                                    }
                                    if (commandeBarre.Commande.state == 'AttenteLivraison') {
                                        cause_nonlivraison = 'Opération système';

                                    }
                                    if (commandeBarre.Commande.state == 'Retour') {
                                        cause_nonlivraison = commandeBarre.Commande.cause_nonlivraison;
                                    }
                                    newCount = newCount + 1;
                                }
                                if (commandeBarre.Commande.state == 'Annulée') {
                                    state = 'Annulée';
                                    cause_nonlivraison = commandeBarre.Commande.cause_nonlivraison;
                                    newCount = newCount + 1;
                                }

                                setTimeout(function () {
                                    var dataCommande = {
                                        Commande: {
                                            id: commandeBarre.Commande.id,
                                            state: state,
                                            source: Auth.user,
                                            isStock: 1,
                                            countRetour: newCount,
                                            cause_nonlivraison: cause_nonlivraison,
                                        }
                                    };
                                    $scope.vildeCommande = PostFactory.ValidateCommande(dataCommande).then(function (vildeCommande) {
                                        $scope.vildeCommande = vildeCommande;
                                        if (vildeCommande.type == 'success') {
                                            toastr.success(vildeCommande.text);
                                            $("#CodeBarre").val("");
                                            var recuperateur = '';
                                            var state = commandeBarre.Commande.state;
                                            var retour = '';
                                            if (commandeBarre.Commande.type_remettre == 'Ramassage') {
//                                                recuperateur = '<div><a href="#/fiche-commerciale/' + commandeBarre.Getby.id + '" class="btn btn-info btn-sm">' + commandeBarre.Getby.first_name + '" "' + commandeBarre.Getby.last_name + '</a></div>';
                                                recuperateur = commandeBarre.Livreur.first_name + " " + commandeBarre.Livreur.last_name;
                                            }
                                            if (commandeBarre.Commande.type_remettre == 'Depot') {
                                                recuperateur = 'Déposée';
                                            }
                                            if (commandeBarre.Commande.state == 'Retour' || commandeBarre.Commande.state == 'AttenteLivraison') {
                                                state = '<label class="label label-info label-sm">Retour (' + (parseInt(commandeBarre.Commande.countRetour) + 1) + ')</label>';
                                                if ((parseInt(commandeBarre.Commande.countRetour) + 1) > 2) {
                                                    state = '<label class="label label-danger label-sm">Annulation (' + (parseInt(commandeBarre.Commande.countRetour) + 1) + ')</label>';
                                                }
                                                retour = commandeBarre.Commande.cause_nonlivraison;
                                                if (commandeBarre.Commande.cause_nonlivraison == null) {
                                                    retour = 'Opération système';
                                                }
                                            }
                                            if (commandeBarre.Commande.state == 'Annulée') {
                                                state = '<label class="label label-danger label-sm">Annulation (' + (parseInt(commandeBarre.Commande.countRetour) + 1) + ')</label>';
//                                                    retour = '<label class="btn btn-sm btn-danger">' + commandeBarre.Commande.cause_nonlivraison + '(' + commandeBarre.Commande.countRetour + ')' + '</label>'
                                                retour = commandeBarre.Commande.cause_nonlivraison;
                                            }
                                            if (commandeBarre.Commande.state == 'Non Traitée' || commandeBarre.Commande.state == 'Non Traitée depot' || commandeBarre.Commande.state == 'En Cours') {
                                                state = '<label class="label label-success label-sm">En attente livraison</label>';
                                            }
                                            var affect = "<ul class='nav nav-pills'><li><div><a href='#/affecter-commande-livreur/" + commandeBarre.Commande.id + "' class='btn btn-success btn-sm'>Affecter livreur</a></div></li></ul>";
                                            if ((parseInt(commandeBarre.Commande.countRetour) + 1) > 2) {
                                                affect = '';
                                            }
                                            var waitTotal = parseInt($.trim($("#countTotal").text()));
                                            var waitdone = parseInt($.trim($("#countwaitdone").text()));
                                            var countwaitback = parseInt($.trim($("#countwaitback").text()));
                                            var countwaitcancel = parseInt($.trim($("#countwaitcancel").text()));
                                            setTimeout(function () {
                                                $("#countTotal").text(waitTotal + 1);
                                                if (commandeBarre.Commande.state == 'Retour' || commandeBarre.Commande.state == 'AttenteLivraison') {
                                                    if ((parseInt(commandeBarre.Commande.countRetour) + 1) > 2) {
                                                        $("#countwaitcancel").text(countwaitcancel + 1);
                                                    } else {
                                                        $("#countwaitback").text(countwaitback + 1);
                                                    }
                                                }
                                                if (commandeBarre.Commande.state == 'Annulée') {
                                                    $("#countwaitcancel").text(countwaitcancel + 1);
                                                }
                                                if (commandeBarre.Commande.state == 'Non Traitée' || commandeBarre.Commande.state == 'Non Traitée depot' || commandeBarre.Commande.state == 'En Cours') {
                                                    $("#countwaitdone").text(waitdone + 1);
                                                }
                                                $scope.checkboxModelStock = 0;
                                                $scope.$watch(function () {
                                                    return $scope.checkboxModelStock;
                                                }, function () {
                                                    $scope.checkboxModelStock = Number($scope.checkboxModelStock);
                                                }, true);
                                                if (parseInt($("#CommaneInStock tr").length) == 0) {
                                                    //console.log('append0');
                                                    var $items0 = $compile("<tr id='CommandeEnterStock' data-data-id='" + commandeBarre.Commande.id + "'>\n\
                                                            <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + commandeBarre.Commande.id + ", " + commandeBarre.Commande.ref + ")'></span></div> </td>\n\
                                                            <td>" + commandeBarre.Commande.modified + "</td>\n\
                                                            <td>" + commandeBarre.Commande.ref + "</td>\n\
                                                            <td>" + state + "</td>\n\
                                                            <td>" + retour + "</td>\n\
                                                            <td>" + commandeBarre.Commande.source + "</td>\n\
                                                            <td>" + recuperateur + "</td>\n\
                                                            <td>" + commandeBarre.User.full_name + "</td>\n\
                                                            <td>" + commandeBarre.Receiver.full_name + "</td>\n\
                                                            <td>" + commandeBarre.Receiver.adresse + "</td>\n\
                                                            <td>" + commandeBarre.Receiver.Ville.name + "</td>\n\
                                                            <td>\n\
                                                                <ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + commandeBarre.Commande.id + "'  class='btn btn-info btn-sm'>\n\
                                                                    <i class='fa fa-eye'></i></a></div></li>\n\
                                                                </ul>\n\
                                                            </td>\n\
                                                            <td>" + affect + "</td>\n\
                                                            <td>\n\
                                                                <form name='myForm'><input  type='checkbox' id='CheckedBox' value='false' ng-model='checkboxModel.value'></form>\n\
                                                            </td>\n\
                                                        </tr>")($scope);
                                                    $('tbody#CommaneInStock').append($items0);
                                                    $scope.checkboxModel = {
                                                        value1: false
                                                    };

                                                } else {
                                                    //console.log('append1');
                                                    var $items = $compile("<tr id='CommandeEnterStock' data-data-id='" + commandeBarre.Commande.id + "'>\n\
                                                            <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + commandeBarre.Commande.id + ", " + commandeBarre.Commande.ref + ")'></span></div> </td>\n\
                                                            <td>" + commandeBarre.Commande.modified + "</td>\n\
                                                            <td>" + commandeBarre.Commande.ref + "</td>\n\
                                                            <td>" + state + "</td>\n\
                                                            <td>" + retour + "</td>\n\
                                                            <td>" + commandeBarre.Commande.source + "</td>\n\
                                                            <td>" + recuperateur + "</td>\n\
                                                            <td>" + commandeBarre.User.full_name + "</td>\n\
                                                            <td>" + commandeBarre.Receiver.full_name + "</td>\n\
                                                            <td>" + commandeBarre.Receiver.adresse + "</td>\n\
                                                            <td>" + commandeBarre.Receiver.Ville.name + "</td>\n\
                                                            <td>\n\
                                                                <ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + commandeBarre.Commande.id + "'  class='btn btn-info btn-sm'>\n\
                                                                    <i class='fa fa-eye'></i></a></div></li>\n\
                                                                </ul>\n\
                                                            </td>\n\
                                                            <td>" + affect + "</td>\n\
                                                            <td><div>\n\
                                                                <form name='myForm' ng-controller='StateLivraisonController'><input  type='checkbox' id='CheckedBox' value='false' ng-model='checkboxModel.value'></form>\n\
                                                            </div></td>\n\
                                                        </tr>")($scope);
                                                    $('tbody#CommaneInStock tr:first').before($items);
                                                }
                                                PostFactory.ValidateCommandeStock(dataCommande)
                                                        .then(function (response) {

                                                        },
                                                                function (error) {
                                                                    console.log(error);
                                                                });
                                            }, 100);
//                                                }
//                                                //console.log(commandeBarrecode);
                                        }
                                        if (vildeCommande.type == 'error') {
                                            toastr.error(vildeCommande.text);
//                                                //console.log(vildeCommande);
                                            $("#CodeBarre").val("");
                                        }
                                    }
                                    );
//                                        alert($("#CodeBarre").val());
                                }, 300);
                            }
                        });
//                            }, 200);
                    }
//                    }, 200);
                };
                $scope.myAffect = function (keyEvent) {
                    keyEvent.stopPropagation();
                    var ancient_code = $("#CodeBarreAffect").val();
                    setTimeout(function () {
                        var ref = decodeBarcode($("#CodeBarreAffect").val());
                        if (keyEvent.which === 13) {
                            $("#CodeBarreAffect").val(ref);
                            setTimeout(function () {
                                $scope.commandeBarrecode = PostFactory.viewCommandeBarrecode(ref).then(function (commandeBarrecode) {
                                    $scope.commandeBarrecodeAffect1 = commandeBarrecode;
                                    //console.log(commandeBarrecode);
                                    if (commandeBarrecode.type == 'error') {
                                        toastr.error(commandeBarrecode.text);
                                        $("#CodeBarreAffect").val('');
                                    } else if (commandeBarrecode.text.Commande.isStock == 'false' || commandeBarrecode.text.Commande.isStock == false || commandeBarrecode.text.Commande.isStock == 0) {
                                        toastr.error("Commande n'est pas en stock");
                                        $("#CodeBarreAffect").val('');
                                    } else {
                                        var commandeBarre = commandeBarrecode.text;
                                        var id = commandeBarre.Commande.id;
                                        setTimeout(function () {
//                                        //console.log(id);
                                            $scope.items = ['item1', 'item2', 'item3'];
                                            $scope.animationsEnabled = true;
//                                    $scope.open = function (cmd_id, index) {
                                            setTimeout(function () {
                                                $scope.commandeBarrecodeAffect = commandeBarre;
//                                            //console.log(commandeBarre);
                                                $("#modal-affecter-commande").attr('data-index', commandeBarre.Commande.id);
                                                $("#modal-affecter-commande").attr('data-cmdid', 'commandeBarre.Commande.id');
                                                $("#titleCommande").text(commandeBarre.Commande.ref);
                                                $("#ExpediteurName").text(commandeBarre.User.full_name);
                                                $("#ExpediteurPhone").text(commandeBarre.User.phone);
                                                $("#ExpediteurEmail").text(commandeBarre.User.email);
                                                $("#ExpediteurAdresse").text(commandeBarre.User.adress);
                                                $("#ExpediteurVille").text(commandeBarre.User.Ville.name);
                                                $("#ExpediteurIDName").text(commandeBarre.User.full_name);
                                                $("#ExpediteurIDPhone").text(commandeBarre.User.phone);
                                                $("#ExpediteurIDAdresse").text(commandeBarre.User.adress);
                                                $("#ReceiverName").text(commandeBarre.Receiver.full_name);
                                                $("#ReceiverAdresse").text(commandeBarre.Receiver.adresse);
                                                $("#ReceiverPhone").text(commandeBarre.Receiver.phone);
                                                $("#ReceiverEmail").text(commandeBarre.Receiver.email);
                                                $("#ReceiverBon").text(commandeBarre.Bon.length);
                                                $("#LinkAffect").html('<a href="#/affecter-commande-livreur/' + commandeBarre.Commande.id + '" class="btn btn-success btn-sm">Affecter</a>');
                                                $("#IMGCode").html("<svg id='barcode' class='col-xs-7'></svg><img src='https://chart.googleapis.com/chart?cht=qr&chl=" + commandeBarre.Commande.ref + "&chs=180x180&choe=UTF-8&chld=L|2' alt='qr code'>");
                                                setTimeout(function () {
                                                    var refCommande = commandeBarre.Commande.ref.toString();
                                                    JsBarcode("#barcode", refCommande);
                                                    var BarcodesScanner = {
                                                        barcodeData: '',
                                                        deviceId: '',
                                                        symbology: '',
                                                        timestamp: 0,
                                                        dataLength: 0
                                                    };
                                                    function onScannerNavigate(barcodeData, deviceId, symbology, timestamp, dataLength) {
                                                        BarcodesScanner.barcodeData = barcodeData;
                                                        BarcodesScanner.deviceId = deviceId;
                                                        BarcodesScanner.symbology = symbology;
                                                        BarcodesScanner.timestamp = timestamp;
                                                        BarcodesScanner.dataLength = dataLength;
                                                        $(BarcodesScanner).trigger('scan');
                                                    }

                                                    BarcodesScanner.tmpTimestamp = 0;
                                                    BarcodesScanner.tmpData = '';
                                                    $(document).on('keypress', function (e) {
                                                        e.stopPropagation();
                                                        var keycode = (e.keyCode ? e.keyCode : e.which);
                                                        if (BarcodesScanner.tmpTimestamp < Date.now() - 500) {
                                                            BarcodesScanner.tmpData = '';
                                                            BarcodesScanner.tmpTimestamp = Date.now();
                                                        }
                                                        if (keycode == 13 && BarcodesScanner.tmpData.length > 0) {
                                                            onScannerNavigate(BarcodesScanner.tmpData, 'FAKE_SCANNER', 'WEDGE', BarcodesScanner.tmpTimestamp, BarcodesScanner.tmpData.length);
                                                            BarcodesScanner.tmpTimestamp = 0;
                                                            BarcodesScanner.tmpData = '';
                                                        } else if (e.charCode && e.charCode > 0) {
                                                            BarcodesScanner.tmpData += String.fromCharCode(e.charCode);
                                                        }
                                                    });
                                                    $(BarcodesScanner).on('scan', function (e) {
                                                        //$("#ProductCodeBarres").val(BarcodesScanner.barcodeData);
//                                                    alert(BarcodesScanner.barcodeData.replace("°", "-").replace("°", "-"));
                                                    });
                                                }, 1000);
                                            }, 300);
                                            var modalInstance = $uibModal.open({
                                                animation: $scope.animationsEnabled,
                                                templateUrl: 'myModalAffectCommande.html',
                                                controller: 'ModalInstanceCtrl',
                                                resolve: {
                                                    items: function () {
                                                        return $scope.items;
                                                    }
                                                }
                                            });
                                            modalInstance.result.then(function (selectedItem) {
                                                $scope.selected = selectedItem;
                                            }, function () {
//                                        $log.info('Modal dismissed at: ' + new Date());
                                            });
//                                    };
                                            $scope.toggleAnimation = function () {
                                                $scope.animationsEnabled = !$scope.animationsEnabled;
                                            };
                                        }, 500);
                                    }
                                });
                            }, 500);
                        }
                    }, 100);
                };
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
//                //console.log(Auth);
//                //console.log(Auth.user);
                // list client commandes en attente ramassage ou depot
                $("div#otherPagesRamassageDepot").html("");
                $scope.CmdsRamassageDepot = PostFactory.listClientRamassageDepotPaginate(1, 30).then(function (clientsramassage) {
                    $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                    $scope.paging = clientsramassage.data.pageCount.User;
                    $scope.itemsPerPage = $scope.paging.limit;
                    $scope.totalItems = $scope.paging.count;
                    console.log(clientsramassage.data.commandesRamassageDepot);
                    $scope.countRamassageDepot = clientsramassage.data.pageCount.User.count;
                    console.log(clientsramassage.data.pageCount.User.count);
                    $scope.clientNotAffect = clientsramassage.dataNotAffect;
                    $scope.countclients = clientsramassage.data.pageCount.User.count;
                    $scope.countcommandes = clientsramassage.countcommandes;
                    $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
                    $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
                    $scope.countRamassage = clientsramassage.countRamassage;
                    $scope.countDepot = clientsramassage.countDepot;
                    $scope.pageCount = clientsramassage.data.pageCount.User.pageCount;
                    $scope.CurrentPage = clientsramassage.data.pageCount.User.page;
                    $scope.currentPageRamassageDepot = clientsramassage.data.pageCount.User.page;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChanged = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    $scope.CmdsRamassageDepot = PostFactory.listClientRamassageDepotPaginate(page, 30, searchKey).then(function (clientsramassage) {
                        $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                        $scope.paging = clientsramassage.data.pageCount.User;
                        $scope.itemsPerPage = $scope.paging.limit;
                        $scope.totalItems = $scope.paging.count;
                        console.log(clientsramassage.data.commandesRamassageDepot);
                        $scope.countRamassageDepot = clientsramassage.data.pageCount.User.count;
                        console.log(clientsramassage.data.pageCount.User.count);
                        $scope.clientNotAffect = clientsramassage.dataNotAffect;
                        $scope.countclients = clientsramassage.data.pageCount.User.count;
                        $scope.countcommandes = clientsramassage.countcommandes;
                        $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
                        $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
                        $scope.countRamassage = clientsramassage.countRamassage;
                        $scope.countDepot = clientsramassage.countDepot;
                        $scope.pageCount = clientsramassage.data.pageCount.User.pageCount;
                        $scope.CurrentPage = clientsramassage.data.pageCount.User.page;
                        $scope.currentPageRamassageDepot = clientsramassage.data.pageCount.User.page;
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
                        $scope.CmdsRamassageDepot = PostFactory.listClientRamassageDepotPaginate(1, 30, searchKey, ville).then(function (clientsramassage) {
                            $("div#otherPagesRamassageDepot").html("");
                            $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                            $scope.pageCount = clientsramassage.data.pageCount.User.pageCount;
                            $scope.currentPage = clientsramassage.data.pageCount.User.page;
                            var currentPage = clientsramassage.data.pageCount.User.page;
                            var nbrMaxNextPages = 5 + clientsramassage.data.pageCount.User.pageCount;
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < clientsramassage.data.pageCount.User.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageRamassageDepot(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesRamassageDepot").append($html);
                                }
                            }
                            if (clientsramassage.data.pageCount.User.prevPage == false) {
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
                            $scope.CmdsRamassageDepot = PostFactory.listClientRamassageDepotPaginate(1, 30, searchKey).then(function (clientsramassage) {
                                $("div#otherPagesRamassageDepot").html("");
                                $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                                $scope.pageCount = clientsramassage.data.pageCount.User.pageCount;
                                $scope.currentPage = clientsramassage.data.pageCount.User.page;
                                var currentPage = clientsramassage.data.pageCount.User.page;
                                var nbrMaxNextPages = 5 + clientsramassage.data.pageCount.User.pageCount;
                                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                    if (i < clientsramassage.data.pageCount.User.pageCount && i <= 5) {
                                        var $html = $compile("<button class='btn btn-default' ng-click='showPageRamassageDepot(" + i + ")'>" + i + "</button>")($scope);
                                        $("div#otherPagesRamassageDepot").append($html);
                                    }
                                }
                                if (clientsramassage.data.pageCount.User.prevPage == false) {
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
                    $scope.CmdsRamassageDepot = PostFactory.listClientRamassageDepotPaginate(1, 30).then(function (clientsramassage) {
                        $scope.CmdsRamassageDepot = clientsramassage.data.commandesRamassageDepot;
                        console.log(clientsramassage.data.commandesRamassageDepot);
                        $scope.countRamassageDepot = clientsramassage.data.pageCount.User.count;
                        $scope.clientNotAffect = clientsramassage.dataNotAffect;
                        $scope.countclients = clientsramassage.data.pageCount.User.count;
                        $scope.countcommandes = clientsramassage.countcommandes;
                        $scope.countcommandesaffectees = clientsramassage.countcommandesaffectees;
                        $scope.countcommandesnotaffectees = clientsramassage.countcommandesnotaffectees;
                        $scope.countRamassage = clientsramassage.countRamassage;
                        $scope.countDepot = clientsramassage.countDepot;
                        $scope.pageCount = clientsramassage.data.pageCount.User.pageCount;
                        $scope.CurrentPage = clientsramassage.data.pageCount.User.page;
                        $scope.currentPageRamassageDepot = clientsramassage.data.pageCount.User.page;
                        $("button#firstPageRamassageDepot").hide();
                        var currentPage = clientsramassage.data.pageCount.User.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < clientsramassage.data.pageCount.User.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageRamassageDepot(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesRamassageDepot").append($html);
                            }
                        }
                        if (clientsramassage.data.pageCount.User.prevPage == false) {
                            $("#nextPageRamassageDepot").attr('disabled', false);
                            $("#previousPageRamassageDepot").attr('disabled', true);
                        }
                        if (clientsramassage.data.pageCount.User.pageCount == 1) {
                            $("#nextPageRamassageDepot").attr('disabled', true);
                            $("#previousPageRamassageDepot").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                // list client commandes récuperées
                $("div#otherPagesClientRecuperees").html("");
                $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate(1, 30).then(function (clientsrecuperer) {
                    $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                    console.log(clientsrecuperer.data.clientCommandesRecuperee);
                    $scope.countClientRecuperees = clientsrecuperer.data.pageCount.User.count;
                    console.log(clientsrecuperer.data.pageCount.User.count);
                    $scope.countRecuperees = clientsrecuperer.count;
                    $scope.pageCount = clientsrecuperer.data.pageCount.User.pageCount;
                    $scope.CurrentPage = clientsrecuperer.data.pageCount.User.page;
                    $scope.currentPageClientRecuperees = clientsrecuperer.data.pageCount.User.page;
                    $("button#firstPageClientRecuperees").hide();
                    var currentPage = clientsrecuperer.data.pageCount.User.page;
                    var nbrMaxNextPages = 5;
                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                        if (i < clientsrecuperer.data.pageCount.User.pageCount) {
                            var $html = $compile("<button class='btn btn-default' ng-click='showPageClientRecuperees(" + i + ")'>" + i + "</button>")($scope);
                            $("div#otherPagesClientRecuperees").append($html);
                        }
                    }
                    if (clientsrecuperer.data.pageCount.User.prevPage == false) {
                        $("#nextPageClientRecuperees").attr('disabled', false);
                        $("#previousPageClientRecuperees").attr('disabled', true);
                    }
                    if (clientsrecuperer.data.pageCount.User.pageCount == 1) {
                        $("#nextPageClientRecuperees").attr('disabled', true);
                        $("#previousPageClientRecuperees").attr('disabled', true);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.nextPageClientRecuperees = function () {
                    $("button#firstPageClientRecuperees").show();
                    var searchKey = $scope.searchClientRecuperees;
                    console.log($scope.CurrentPage);
                    console.log($scope.pageCount);
                    if ($scope.CurrentPage <= $scope.pageCount) {
                        $scope.CurrentPage = $scope.CurrentPage + 1;
                        $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate($scope.CurrentPage, 30, searchKey).then(function (clientsrecuperer) {
                            $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                            $scope.currentPage = clientsrecuperer.data.pageCount.User.page;
                            $scope.currentPageClientRecuperees = clientsrecuperer.data.pageCount.User.page;
                            var currentPage = clientsrecuperer.data.pageCount.User.page;
                            var nbrMaxNextPages = 5 + clientsrecuperer.data.pageCount.User.page;
                            $("div#otherPagesClientRecuperees").html("");
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < clientsrecuperer.data.pageCount.User.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageClientRecuperees(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesClientRecuperees").append($html);
                                }
                            }
                            if (clientsrecuperer.data.pageCount.User.nextPage == false) {
                                $("button#nextPageClientRecuperees").attr('disabled', true);
                                $("button#previousPageClientRecuperees").removeAttr('disabled');
                            } else {
                                $("button#nextPageClientRecuperees").removeAttr('disabled');
                            }
                            if (clientsrecuperer.data.pageCount.User.previousPage == false) {
                                $("button#previousPageClientRecuperees").attr('disabled', true);
                            } else {
                                $("button#previousPageClientRecuperees").removeAttr('disabled');
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                };
                $scope.previousPageClientRecuperees = function () {
                    var searchKey = $scope.searchClientRecuperees;
                    if ($scope.CurrentPage > 1) {
                        $scope.CurrentPage = $scope.CurrentPage - 1;
                        $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate($scope.CurrentPage, 30, searchKey).then(function (clientsrecuperer) {
                            $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;

                            $scope.currentPage = clientsrecuperer.data.pageCount.User.page;
                            var currentPage = clientsrecuperer.data.pageCount.User.page;
                            var nbrMaxNextPages = 5 + clientsrecuperer.data.pageCount.User.page;
                            $("div#otherPagesClientRecuperees").html("");
                            for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < clientsrecuperer.data.pageCount.User.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageClientRecuperees(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesClientRecuperees").append($html);
                                }
                            }
                            if (clientsrecuperer.data.pageCount.User.nextPage == false) {
                                console.log("LAST PAGE");
                                $("button#nextPageClientRecuperees").attr('disabled', true);
                                $("button#previousPageClientRecuperees").removeAttr('disabled');
                            } else {
                                $("button#nextPageClientRecuperees").removeAttr('disabled');
                            }
                            if (clientsrecuperer.data.pageCount.User.prevPage == false) {
                                console.log("PAGE ONE");
                                $("button#firstPageClientRecuperees").hide();
                                $("button#nextPageClientRecuperees").removeAttr('disabled');
                                $("button#previousPageClientRecuperees").attr('disabled', true);
                            } else {
                                $("button#previousPageClientRecuperees").removeAttr('disabled');
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        console.log("PAGE ONE");
                        $("button#firstPageClientRecuperees").hide();
                        $("button#nextPageClientRecuperees").removeAttr('disabled');
                        $("button#previousPageClientRecuperees").attr('disabled', true);
                    }
                };
                $scope.firstPageClientRecuperees = function () {
                    var searchKey = $scope.searchClientRecuperees;
                    $("div#otherPagesClientRecuperees").html("");
                    $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate(1, 30, searchKey).then(function (clientsrecuperer) {
                        $scope.CmdsClientRecuperees = clientsrecuperer.data.clients;
                        $scope.pageCount = clientsrecuperer.data.pageCount.User.pageCount;
                        $scope.currentPage = clientsrecuperer.data.pageCount.User.page;
                        var currentPage = clientsrecuperer.data.pageCount.User.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < clientsrecuperer.data.pageCount.User.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageClientRecuperees(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesClientRecuperees").append($html);
                            }
                        }
                        if (clientsrecuperer.data.countPage.User.prevPage == false) {
                            $("button#nextPageClientRecuperees").attr('disabled', false);
                            $("button#previousPageClientRecuperees").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.showPageClientRecuperees = function (index) {
                    var searchKey = $scope.searchClientRecuperees;
                    $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate(index, 30, searchKey).then(function (clientsrecuperer) {
                        $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;

                        $scope.pageCount = clientsrecuperer.data.pageCount.User.pageCount;
                        $scope.currentPage = clientsrecuperer.data.pageCount.User.page;
                        $scope.CurrentPage = clientsrecuperer.data.pageCount.User.page;
                        if (clientsrecuperer.data.pageCount.User.prevPage == false) {
                            $("button#nextPageClientRecuperees").attr('disabled', false);
                            $("button#previousPageClientRecuperees").attr('disabled', true);
                            $("button#currentPageClientRecuperees").hide();
                            $("button#firstPageClientRecuperees").show();
                        }
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
                        $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate(1, 30, searchKey, ville).then(function (clientsrecuperer) {
                            $("div#otherPagesClientRecuperees").html("");
                            $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                            $scope.pageCount = clientsrecuperer.data.pageCount.User.pageCount;
                            $scope.currentPage = clientsrecuperer.data.pageCount.User.page;
                            var currentPage = clientsrecuperer.data.pageCount.User.page;
                            var nbrMaxNextPages = 5 + clientsrecuperer.data.pageCount.User.pageCount;
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < clientsrecuperer.data.pageCount.User.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageClientRecuperees(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesClientRecuperees").append($html);
                                }
                            }
                            if (clientsrecuperer.data.pageCount.User.prevPage == false) {
                                $("button#nextPageClientRecuperees").attr('disabled', false);
                                $("button#previousPageClientRecuperees").attr('disabled', true);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate(1, 30, searchKey).then(function (clientsrecuperer) {
                                $("div#otherPagesClientRecuperees").html("");
                                $scope.CmdsClientRecuperees = clientsrecuperer.data.clientCommandesRecuperee;
                                $scope.pageCount = clientsrecuperer.data.pageCount.User.pageCount;
                                $scope.currentPage = clientsrecuperer.data.pageCount.User.page;
                                var currentPage = clientsrecuperer.data.pageCount.User.page;
                                var nbrMaxNextPages = 5 + clientsrecuperer.data.pageCount.User.pageCount;
                                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                    if (i < clientsrecuperer.data.pageCount.User.pageCount && i <= 5) {
                                        var $html = $compile("<button class='btn btn-default' ng-click='showPageClientRecuperees(" + i + ")'>" + i + "</button>")($scope);
                                        $("div#otherPagesClientRecuperees").append($html);
                                    }
                                }
                                if (clientsrecuperer.data.pageCount.User.prevPage == false) {
                                    $("button#nextPageClientRecuperees").attr('disabled', false);
                                    $("button#previousPageClientRecuperees").attr('disabled', true);
                                }
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    }
                };
                // commandes retour paginate 
                $("div#otherPagesRetour").html("");
                $scope.CmdsRetour = PostFactory.listCommandeRetoursEspaceclientPaginate(1, 30).then(function (commandesretours) {
                    $scope.CmdsRetour = commandesretours.data.commandesRetour;
                    $scope.countRetour = commandesretours.data.pageCount.Commande.count;
                    $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                    $scope.CurrentPage = commandesretours.data.pageCount.Commande.page;
                    $scope.currentPageRetour = commandesretours.data.pageCount.Commande.page;
                    $("button#firstPageRetour").hide();
                    var currentPage = commandesretours.data.pageCount.Commande.page;
                    var nbrMaxNextPages = 5;
                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                        if (i < commandesretours.data.pageCount.Commande.pageCount) {
                            var $html = $compile("<button class='btn btn-default' ng-click='showPageRetour(" + i + ")'>" + i + "</button>")($scope);
                            $("div#otherPagesRetour").append($html);
                        }
                    }
                    if (commandesretours.data.pageCount.Commande.prevPage == false) {
                        $("button#nextPageRetour").attr('disabled', false);
                        $("button#previousPageRetour").attr('disabled', true);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.nextPageRetour = function () {
                    $("button#firstPageRetour").show();
                    var searchKey = $scope.searchRetour;
                    var etatRetoure = $("select#searchRetourees :selected").val();
                    var ville = $scope.ville;
                    console.log($scope.CurrentPage);
                    console.log($scope.pageCount);
                    if ($scope.CurrentPage <= $scope.pageCount) {
                        $scope.CurrentPage = $scope.CurrentPage + 1;
                        $scope.CmdsRetour = PostFactory.listCommandeRetoursEspaceclientPaginate($scope.CurrentPage, 30, searchKey, ville, etatRetoure).then(function (commandesretours) {
                            $scope.CmdsRetour = commandesretours.data.commandesRetour;
                            $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                            $scope.currentPageRetour = commandesretours.data.pageCount.Commande.page;
                            var currentPage = commandesretours.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandesretours.data.pageCount.Commande.page;
                            $("div#otherPagesRetour").html("");
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandesretours.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageRetour(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesRetour").append($html);
                                }
                            }
                            if (commandesretours.data.pageCount.Commande.nextPage == false) {
                                $("button#nextPageRetour").attr('disabled', true);
                                $("button#previousPageRetour").removeAttr('disabled');
                            } else {
                                $("button#nextPageRetour").removeAttr('disabled');
                            }
                            if (commandesretours.data.pageCount.Commande.previousPage == false) {
                                $("button#previousPageRetour").attr('disabled', true);
                            } else {
                                $("button#previousPageRetour").removeAttr('disabled');
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                };
                $scope.previousPageRetour = function () {
                    var etatRetoure = $("select#searchRetourees :selected").val();
                    var ville = $scope.ville;
                    var searchKey = $scope.searchRetour;
                    if ($scope.CurrentPage > 1) {
                        $scope.CurrentPage = $scope.CurrentPage - 1;
                        $scope.CmdsRetour = PostFactory.listCommandeRetoursEspaceclientPaginate($scope.CurrentPage, 30, searchKey, ville, etatRetoure).then(function (commandesretours) {
                            $scope.CmdsRetour = commandesretours.data.commandesRetour;

                            $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                            var currentPage = commandesretours.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandesretours.data.pageCount.Commande.page;
                            $("div#otherPagesRetour").html("");
                            for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandesretours.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageRetour(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesRetour").append($html);
                                }
                            }
                            if (commandesretours.data.pageCount.Commande.nextPage == false) {
                                console.log("LAST PAGE");
                                $("button#nextPageRetour").attr('disabled', true);
                                $("button#previousPageRetour").removeAttr('disabled');
                            } else {
                                $("button#nextPageRetour").removeAttr('disabled');
                            }
                            if (commandesretours.data.pageCount.Commande.prevPage == false) {
                                console.log("PAGE ONE");
                                $("button#firstPageRetour").hide();
                                $("button#nextPageRetour").removeAttr('disabled');
                                $("button#previousPageRetour").attr('disabled', true);
                            } else {
                                $("button#previousPageRetour").removeAttr('disabled');
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        console.log("PAGE ONE");
                        $("button#firstPageRetour").hide();
                        $("button#nextPageRetour").removeAttr('disabled');
                        $("button#previousPageRetour").attr('disabled', true);
                    }
                };
                $scope.firstPageRetour = function () {
                    var searchKey = $scope.searchRetour;
                    var etatRetoure = $("select#searchRetourees :selected").val();
                    var ville = $scope.ville;
                    $("div#otherPagesRetour").html("");
                    $scope.CmdsRetour = PostFactory.listCommandeRetoursEspaceclientPaginate(1, 30, searchKey, ville, etatRetoure).then(function (commandesretours) {
                        $scope.CmdsRetour = commandesretours.data.clients;
                        $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                        var currentPage = commandesretours.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesretours.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageRetour(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesRetour").append($html);
                            }
                        }
                        if (commandesretours.data.countPage.Commande.prevPage == false) {
                            $("button#nextPageRetour").attr('disabled', false);
                            $("button#previousPageRetour").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.showPageRetour = function (index) {
                    var searchKey = $scope.searchRetour;
                    var etatRetoure = $("select#searchRetourees :selected").val();
                    var ville = $scope.ville;
                    $scope.CmdsRetour = PostFactory.listCommandeRetoursEspaceclientPaginate(index, 30, searchKey, ville, etatRetoure).then(function (commandesretours) {
                        $scope.CmdsRetour = commandesretours.data.commandesRetour;

                        $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                        $scope.CurrentPage = commandesretours.data.pageCount.Commande.page;
                        if (commandesretours.data.pageCount.Commande.prevPage == false) {
                            $("button#nextPageRetour").attr('disabled', false);
                            $("button#previousPageRetour").attr('disabled', true);
                            $("button#currentPageRetour").hide();
                            $("button#firstPageRetour").show();
                        }
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
                    console.log(searchRetour);
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsRetour = PostFactory.listCommandeRetoursEspaceclientPaginate(1, 30, searchKey, ville, etatRetoure).then(function (commandesretours) {
                            $("div#otherPagesRetour").html("");
                            $scope.CmdsRetour = commandesretours.data.commandesRetour;
                            $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                            $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                            var currentPage = commandesretours.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandesretours.data.pageCount.Commande.pageCount;
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandesretours.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageRetour(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesRetour").append($html);
                                }
                            }
                            if (commandesretours.data.pageCount.Commande.prevPage == false) {
                                $("button#nextPageRetour").attr('disabled', false);
                                $("button#previousPageRetour").attr('disabled', true);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsRetour = PostFactory.listCommandeRetoursEspaceclientPaginate(1, 30, searchKey).then(function (commandesretours) {
                                $("div#otherPagesRetour").html("");
                                $scope.CmdsRetour = commandesretours.data.commandesRetour;
                                $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                                $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                                var currentPage = commandesretours.data.pageCount.Commande.page;
                                var nbrMaxNextPages = 5 + commandesretours.data.pageCount.Commande.pageCount;
                                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                    if (i < commandesretours.data.pageCount.Commande.pageCount && i <= 5) {
                                        var $html = $compile("<button class='btn btn-default' ng-click='showPageRetour(" + i + ")'>" + i + "</button>")($scope);
                                        $("div#otherPagesRetour").append($html);
                                    }
                                }
                                if (commandesretours.data.pageCount.Commande.prevPage == false) {
                                    $("button#nextPageRetour").attr('disabled', false);
                                    $("button#previousPageRetour").attr('disabled', true);
                                }
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
                    console.log(searchKey);
                    console.log(etatRetoure);
                    var ville = $scope.ville;
                    $("div#otherPagesRetour").html("");
                    $scope.CmdsRetour = PostFactory.listCommandeRetoursEspaceclientPaginate(1, 30, searchKey, ville, etatRetoure).then(function (commandesretours) {
                        $("div#otherPagesRetour").html("");
                        $scope.CmdsRetour = commandesretours.data.commandesRetour;
                        $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandesretours.data.pageCount.Commande.page;
                        var currentPage = commandesretours.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5 + commandesretours.data.pageCount.Commande.pageCount;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesretours.data.pageCount.Commande.pageCount && i <= 5) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageRetour(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesRetour").append($html);
                            }
                        }
                        if (commandesretours.data.pageCount.Commande.prevPage == false) {
                            $("button#nextPageRetour").attr('disabled', false);
                            $("button#previousPageRetour").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
                $scope.update_retour = function () {
                    $("div#otherPagesRetour").html("");
                    $scope.CmdsRetour = PostFactory.listCommandeRetoursEspaceclientPaginate(1, 30).then(function (commandesretours) {
                        $scope.CmdsRetour = commandesretours.data.commandesRetour;
                        $scope.countRetour = commandesretours.data.pageCount.Commande.count;
                        $scope.pageCount = commandesretours.data.pageCount.Commande.pageCount;
                        $scope.CurrentPage = commandesretours.data.pageCount.Commande.page;
                        $scope.currentPageRetour = commandesretours.data.pageCount.Commande.page;
                        $("button#firstPageRetour").hide();
                        var currentPage = commandesretours.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesretours.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageRetour(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesRetour").append($html);
                            }
                        }
                        if (commandesretours.data.pageCount.Commande.prevPage == false) {
                            $("button#nextPageRetour").attr('disabled', false);
                            $("button#previousPageRetour").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                //commandes annulees patination
                $("div#otherPagesAnnulee").html("");
                $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30).then(function (commandesannulee) {
                    $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                    $scope.countAnnuleeTotal = commandesannulee.data.pageCount.Commande.count;
                    $scope.countannuleefacture = commandesannulee.countfacture;
                    $scope.countannuleenotfacture = commandesannulee.countnotfacture;
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
                $scope.nextPageAnnulee = function () {
                    var etatFacture = $("select#etatFactures :selected").val();
                    var searchKey = $scope.searchAnnulee;
                    var ville = $scope.ville;
                    $("button#firstPageAnnulee").show();
                    console.log($scope.CurrentPage);
                    console.log($scope.pageCount);
                    if ($scope.CurrentPage <= $scope.pageCount) {
                        $scope.CurrentPage = $scope.CurrentPage + 1;
                        $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate($scope.CurrentPage, 30, searchKey, ville, etatFacture).then(function (commandesannulee) {
                            $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                            $scope.currentPage = commandesannulee.data.pageCount.Commande.page;
                            $scope.currentPageAnnulee = commandesannulee.data.pageCount.Commande.page;
                            var currentPage = commandesannulee.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandesannulee.data.pageCount.Commande.page;
                            $("div#otherPagesAnnulee").html("");
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandesannulee.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageAnnulee(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesAnnulee").append($html);
                                }
                            }
                            if (commandesannulee.data.pageCount.Commande.nextPage == false) {
                                $("button#nextPageAnnulee").attr('disabled', true);
                                $("button#previousPageAnnulee").removeAttr('disabled');
                            } else {
                                $("button#nextPageAnnulee").removeAttr('disabled');
                            }
                            if (commandesannulee.data.pageCount.Commande.previousPage == false) {
                                $("button#previousPageAnnulee").attr('disabled', true);
                            } else {
                                $("button#previousPageAnnulee").removeAttr('disabled');
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                };
                $scope.previousPageAnnulee = function () {
                    var etatFacture = $("select#etatFactures :selected").val();
                    var searchKey = $scope.searchAnnulee;
                    var ville = $scope.ville;
                    if ($scope.CurrentPage > 1) {
                        $scope.CurrentPage = $scope.CurrentPage - 1;
                        $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate($scope.CurrentPage, 30, searchKey, ville, etatFacture).then(function (commandesannulee) {
                            $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;

                            $scope.currentPage = commandesannulee.data.pageCount.Commande.page;
                            var currentPage = commandesannulee.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandesannulee.data.pageCount.Commande.page;
                            $("div#otherPagesAnnulee").html("");
                            for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandesannulee.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageAnnulee(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesAnnulee").append($html);
                                }
                            }
                            if (commandesannulee.data.pageCount.Commande.nextPage == false) {
                                console.log("LAST PAGE");
                                $("button#nextPageAnnulee").attr('disabled', true);
                                $("button#previousPageAnnulee").removeAttr('disabled');
                            } else {
                                $("button#nextPageAnnulee").removeAttr('disabled');
                            }
                            if (commandesannulee.data.pageCount.Commande.prevPage == false) {
                                console.log("PAGE ONE");
                                $("button#firstPageAnnulee").hide();
                                $("button#nextPageAnnulee").removeAttr('disabled');
                                $("button#previousPageAnnulee").attr('disabled', true);
                            } else {
                                $("button#previousPageAnnulee").removeAttr('disabled');
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        console.log("PAGE ONE");
                        $("button#firstPageAnnulee").hide();
                        $("button#nextPageAnnulee").removeAttr('disabled');
                        $("button#previousPageAnnulee").attr('disabled', true);
                    }
                };
                $scope.firstPageAnnulee = function () {
                    var etatFacture = $("select#etatFactures :selected").val();
                    var searchKey = $scope.searchAnnulee;
                    var ville = $scope.ville;
                    $("div#otherPagesAnnulee").html("");
                    $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30, searchKey, ville, etatFacture).then(function (commandesannulee) {
                        $scope.CmdsAnnulee = commandesannulee.data.clients;
                        $scope.pageCount = commandesannulee.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandesannulee.data.pageCount.Commande.page;
                        var currentPage = commandesannulee.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandesannulee.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageAnnulee(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesAnnulee").append($html);
                            }
                        }
                        if (commandesannulee.data.countPage.Commande.prevPage == false) {
                            $("button#nextPageAnnulee").attr('disabled', false);
                            $("button#previousPageAnnulee").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.showPageAnnulee = function (index) {
                    var etatFacture = $("select#etatFactures :selected").val();
                    var searchKey = $scope.searchAnnulee;
                    var ville = $scope.ville;
                    $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate(index, 30, searchKey, ville, etatFacture).then(function (commandesannulee) {
                        $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;

                        $scope.pageCount = commandesannulee.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandesannulee.data.pageCount.Commande.page;
                        $scope.CurrentPage = commandesannulee.data.pageCount.Commande.page;
                        if (commandesannulee.data.pageCount.Commande.prevPage == false) {
                            $("button#nextPageAnnulee").attr('disabled', false);
                            $("button#previousPageAnnulee").attr('disabled', true);
                            $("button#currentPageAnnulee").hide();
                            $("button#firstPageAnnulee").show();
                        }
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
                        $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30, searchKey, ville, etatFacture).then(function (commandesannulee) {
                            $("div#otherPagesAnnulee").html("");
                            $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                            $scope.pageCount = commandesannulee.data.pageCount.Commande.pageCount;
                            $scope.currentPage = commandesannulee.data.pageCount.Commande.page;
                            var currentPage = commandesannulee.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandesannulee.data.pageCount.Commande.pageCount;
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandesannulee.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageAnnulee(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesAnnulee").append($html);
                                }
                            }
                            if (commandesannulee.data.pageCount.Commande.prevPage == false) {
                                $("button#nextPageAnnulee").attr('disabled', false);
                                $("button#previousPageAnnulee").attr('disabled', true);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30, searchKey).then(function (commandesannulee) {
                                $("div#otherPagesAnnulee").html("");
                                $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                                $scope.pageCount = commandesannulee.data.pageCount.Commande.pageCount;
                                $scope.currentPage = commandesannulee.data.pageCount.Commande.page;
                                var currentPage = commandesannulee.data.pageCount.Commande.page;
                                var nbrMaxNextPages = 5 + commandesannulee.data.pageCount.Commande.pageCount;
                                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                    if (i < commandesannulee.data.pageCount.Commande.pageCount && i <= 5) {
                                        var $html = $compile("<button class='btn btn-default' ng-click='showPageAnnulee(" + i + ")'>" + i + "</button>")($scope);
                                        $("div#otherPagesAnnulee").append($html);
                                    }
                                }
                                if (commandesannulee.data.pageCount.Commande.prevPage == false) {
                                    $("button#nextPageAnnulee").attr('disabled', false);
                                    $("button#previousPageAnnulee").attr('disabled', true);
                                }
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
                    $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30, searchKey, ville, etatFacture).then(function (commandesannulee) {
                        $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                        $scope.countAnnuleeTotal = commandesannulee.data.pageCount.Commande.count;
                        $scope.countannuleefacture = commandesannulee.countfacture;
                        $scope.countannuleenotfacture = commandesannulee.countnotfacture;
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
                }
                $scope.update_annulation = function () {
                    $("div#otherPagesAnnulee").html("");
                    $scope.CmdsAnnulee = PostFactory.listCommandeAnnuleeEspaceclientPaginate(1, 30).then(function (commandesannulee) {
                        $scope.CmdsAnnulee = commandesannulee.data.commandesAnnulee;
                        $scope.countAnnuleeTotal = commandesannulee.data.pageCount.Commande.count;
                        $scope.countannuleefacture = commandesannulee.countfacture;
                        $scope.countannuleenotfacture = commandesannulee.countnotfacture;
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
                };
                // commande livrée pagination 
                $("div#otherPagesLivree").html("");
                $scope.CmdsLivree = PostFactory.listCommandeLivreeEspaceclientPaginate(1, 30).then(function (commandeslivrees) {
                    $scope.CmdsLivree = commandeslivrees.data.commandesLivree;
                    $scope.countLivree = commandeslivrees.data.pageCount.Commande.count;
                    $scope.pageCount = commandeslivrees.data.pageCount.Commande.pageCount;
                    $scope.CurrentPage = commandeslivrees.data.pageCount.Commande.page;
                    $scope.currentPageLivree = commandeslivrees.data.pageCount.Commande.page;
                    $("button#firstPageLivree").hide();
                    var currentPage = commandeslivrees.data.pageCount.Commande.page;
                    var nbrMaxNextPages = 5;
                    for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                        if (i < commandeslivrees.data.pageCount.Commande.pageCount) {
                            var $html = $compile("<button class='btn btn-default' ng-click='showPageLivree(" + i + ")'>" + i + "</button>")($scope);
                            $("div#otherPagesLivree").append($html);
                        }
                    }
                    if (commandeslivrees.data.pageCount.Commande.prevPage == false) {
                        $("#nextPageLivree").attr('disabled', false);
                        $("#previousPageLivree").attr('disabled', true);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.nextPageLivree = function () {
                    $("button#firstPageLivree").show();
                    var searchKey = $scope.searchLivree;
                    console.log($scope.CurrentPage);
                    console.log($scope.pageCount);
                    if ($scope.CurrentPage <= $scope.pageCount) {
                        $scope.CurrentPage = $scope.CurrentPage + 1;
                        $scope.CmdsLivree = PostFactory.listCommandeLivreeEspaceclientPaginate($scope.CurrentPage, 30, searchKey).then(function (commandeslivrees) {
                            $scope.CmdsLivree = commandeslivrees.data.commandesLivree;
                            $scope.currentPage = commandeslivrees.data.pageCount.Commande.page;
                            $scope.currentPageLivree = commandeslivrees.data.pageCount.Commande.page;
                            var currentPage = commandeslivrees.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandeslivrees.data.pageCount.Commande.page;
                            $("div#otherPagesLivree").html("");
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandeslivrees.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageLivree(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesLivree").append($html);
                                }
                            }
                            if (commandeslivrees.data.pageCount.Commande.nextPage == false) {
                                $("button#nextPageLivree").attr('disabled', true);
                                $("button#previousPageLivree").removeAttr('disabled');
                            } else {
                                $("button#nextPageLivree").removeAttr('disabled');
                            }
                            if (commandeslivrees.data.pageCount.Commande.previousPage == false) {
                                $("button#previousPageLivree").attr('disabled', true);
                            } else {
                                $("button#previousPageLivree").removeAttr('disabled');
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                };
                $scope.previousPageLivree = function () {
                    var searchKey = $scope.searchLivree;
                    if ($scope.CurrentPage > 1) {
                        $scope.CurrentPage = $scope.CurrentPage - 1;
                        $scope.CmdsLivree = PostFactory.listCommandeLivreeEspaceclientPaginate($scope.CurrentPage, 30, searchKey).then(function (commandeslivrees) {
                            $scope.CmdsLivree = commandeslivrees.data.commandesLivree;

                            $scope.currentPage = commandeslivrees.data.pageCount.Commande.page;
                            var currentPage = commandeslivrees.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandeslivrees.data.pageCount.Commande.page;
                            $("div#otherPagesLivree").html("");
                            for (i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandeslivrees.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageLivree(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesLivree").append($html);
                                }
                            }
                            if (commandeslivrees.data.pageCount.Commande.nextPage == false) {
                                console.log("LAST PAGE");
                                $("button#nextPageLivree").attr('disabled', true);
                                $("button#previousPageLivree").removeAttr('disabled');
                            } else {
                                $("button#nextPageLivree").removeAttr('disabled');
                            }
                            if (commandeslivrees.data.pageCount.Commande.prevPage == false) {
                                console.log("PAGE ONE");
                                $("button#firstPageLivree").hide();
                                $("button#nextPageLivree").removeAttr('disabled');
                                $("button#previousPageLivree").attr('disabled', true);
                            } else {
                                $("button#previousPageLivree").removeAttr('disabled');
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        console.log("PAGE ONE");
                        $("button#firstPageLivree").hide();
                        $("button#nextPageLivree").removeAttr('disabled');
                        $("button#previousPageLivree").attr('disabled', true);
                    }
                };
                $scope.firstPageLivree = function () {
                    var searchKey = $scope.searchLivree;
                    $("div#otherPagesLivree").html("");
                    $scope.CmdsLivree = PostFactory.listCommandeLivreeEspaceclientPaginate(1, 30, searchKey).then(function (commandeslivrees) {
                        $scope.CmdsLivree = commandeslivrees.data.clients;
                        $scope.pageCount = commandeslivrees.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandeslivrees.data.pageCount.Commande.page;
                        var currentPage = commandeslivrees.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandeslivrees.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageLivree(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesLivree").append($html);
                            }
                        }
                        if (commandeslivrees.data.countPage.Commande.prevPage == false) {
                            $("button#nextPageLivree").attr('disabled', false);
                            $("button#previousPageLivree").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.showPageLivree = function (index) {
                    var searchKey = $scope.searchLivree;
                    $scope.CmdsLivree = PostFactory.listCommandeLivreeEspaceclientPaginate(index, 30, searchKey).then(function (commandeslivrees) {
                        $scope.CmdsLivree = commandeslivrees.data.commandesLivree;

                        $scope.pageCount = commandeslivrees.data.pageCount.Commande.pageCount;
                        $scope.currentPage = commandeslivrees.data.pageCount.Commande.page;
                        $scope.CurrentPage = commandeslivrees.data.pageCount.Commande.page;
                        if (commandeslivrees.data.pageCount.Commande.prevPage == false) {
                            $("button#nextPageLivree").attr('disabled', false);
                            $("button#previousPageLivree").attr('disabled', true);
                            $("button#currentPageLivree").hide();
                            $("button#firstPageLivree").show();
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.searchLivreeFunc = function (searchLivree) {
                    var searchKey = $scope.searchLivree;
                    var ville = $scope.ville;
                    console.log(searchKey);
                    console.log(searchLivree);
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsLivree = PostFactory.listCommandeLivreeEspaceclientPaginate(1, 30, searchKey, ville).then(function (commandeslivrees) {
                            $("div#otherPagesLivree").html("");
                            $scope.CmdsLivree = commandeslivrees.data.commandesLivree;
                            $scope.pageCount = commandeslivrees.data.pageCount.Commande.pageCount;
                            $scope.currentPage = commandeslivrees.data.pageCount.Commande.page;
                            var currentPage = commandeslivrees.data.pageCount.Commande.page;
                            var nbrMaxNextPages = 5 + commandeslivrees.data.pageCount.Commande.pageCount;
                            for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                if (i < commandeslivrees.data.pageCount.Commande.pageCount) {
                                    var $html = $compile("<button class='btn btn-default' ng-click='showPageLivree(" + i + ")'>" + i + "</button>")($scope);
                                    $("div#otherPagesLivree").append($html);
                                }
                            }
                            if (commandeslivrees.data.pageCount.Commande.prevPage == false) {
                                $("button#nextPageLivree").attr('disabled', false);
                                $("button#previousPageLivree").attr('disabled', true);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    } else {
                        if (searchKey === "") {
                            console.log("LAUNCH RESET");
                            $scope.CmdsLivree = PostFactory.listCommandeLivreeEspaceclientPaginate(1, 30, searchKey).then(function (commandeslivrees) {
                                $("div#otherPagesLivree").html("");
                                $scope.CmdsLivree = commandeslivrees.data.commandesLivree;
                                $scope.pageCount = commandeslivrees.data.pageCount.Commande.pageCount;
                                $scope.currentPage = commandeslivrees.data.pageCount.Commande.page;
                                var currentPage = commandeslivrees.data.pageCount.Commande.page;
                                var nbrMaxNextPages = 5 + commandeslivrees.data.pageCount.Commande.pageCount;
                                for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                                    if (i < commandeslivrees.data.pageCount.Commande.pageCount && i <= 5) {
                                        var $html = $compile("<button class='btn btn-default' ng-click='showPageLivree(" + i + ")'>" + i + "</button>")($scope);
                                        $("div#otherPagesLivree").append($html);
                                    }
                                }
                                if (commandeslivrees.data.pageCount.Commande.prevPage == false) {
                                    $("button#nextPageLivree").attr('disabled', false);
                                    $("button#previousPageLivree").attr('disabled', true);
                                }
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
                    $scope.CmdsLivree = PostFactory.listCommandeLivreeEspaceclientPaginate(1, 30).then(function (commandeslivrees) {
                        $scope.CmdsLivree = commandeslivrees.data.commandesLivree;
                        $scope.countLivree = commandeslivrees.data.pageCount.Commande.count;
                        $scope.pageCount = commandeslivrees.data.pageCount.Commande.pageCount;
                        $scope.CurrentPage = commandeslivrees.data.pageCount.Commande.page;
                        $scope.currentPageLivree = commandeslivrees.data.pageCount.Commande.page;
                        $("button#firstPageLivree").hide();
                        var currentPage = commandeslivrees.data.pageCount.Commande.page;
                        var nbrMaxNextPages = 5;
                        for (var i = currentPage + 1; i <= nbrMaxNextPages; i++) {
                            if (i < commandeslivrees.data.pageCount.Commande.pageCount) {
                                var $html = $compile("<button class='btn btn-default' ng-click='showPageLivree(" + i + ")'>" + i + "</button>")($scope);
                                $("div#otherPagesLivree").append($html);
                            }
                        }
                        if (commandeslivrees.data.pageCount.Commande.prevPage == false) {
                            $("#nextPageLivree").attr('disabled', false);
                            $("#previousPageLivree").attr('disabled', true);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                //init filters
                $scope.limits = [{
                        l: 10,
                    },
                    {
                        l: 20,
                    },
                    {
                        l: 30
                    }];
                $scope.limit = 10;
                //init en cours livraison
                var dataFilter = {
                    user_id: $scope.clientAttLivraison,
                    livreur_id: $scope.livreurAttLivraison,
                    ville_id: $scope.villeAttLivraison
                };
                var searchRamassageDepot = $scope.searchRamassageDepot;
                $scope.CmdsEnCoursLivraison = PostFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(1, $scope.limit, searchRamassageDepot, dataFilter).then(function (commandeseEnattentelivraisonspaceclient) {
                    $scope.CmdsEnCoursLivraison = commandeseEnattentelivraisonspaceclient.data.commandesAttLivraison;
                    $scope.countEnattentelivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande.count;
                    $scope.pagingAttLivraison = commandeseEnattentelivraisonspaceclient.data.pageCount.Commande;
                    $scope.itemsPerPageAttLivraison = $scope.pagingAttLivraison.limit;
                    $scope.totalItemsAttLivraison = $scope.pagingAttLivraison.count;
                    $("#limitPerPageAttLivraison option[value='10']").attr('selected', 'selected');
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.pageChangedAttLivraison = function (page) {
                    var searchKey = $scope.searchRamassageDepot;
                    var dataFilter = {
                        user_id: $scope.clientAttLivraison,
                        livreur_id: $scope.livreurAttLivraison,
                        ville_id: $scope.villeAttLivraison
                    };
                    $scope.CmdsEnCoursLivraison = PostFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(page, $scope.limit, searchKey, dataFilter).then(function (commandeseEnattentelivraisonspaceclient) {
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
                    var dataFilter = {
                        user_id: $scope.clientAttLivraison,
                        livreur_id: $scope.livreurAttLivraison,
                        ville_id: $scope.villeAttLivraison
                    };
                    if (searchKey.length >= 3) {
                        console.log("LAUNCH SEARCH");
                        $scope.CmdsEnCoursLivraison = PostFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(1, 5, searchKey, dataFilter).then(function (commandeseEnattentelivraisonspaceclient) {
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
                            $scope.CmdsEnCoursLivraison = PostFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(1, 5, searchKey).then(function (commandeseEnattentelivraisonspaceclient) {
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
                $scope.filterAttLivraison = function () {
                    var searchKey = $scope.searchAttLivraison;
                    var dataFilter = {
                        user_id: $scope.clientAttLivraison,
                        livreur_id: $scope.livreurAttLivraison,
                        ville_id: $scope.villeAttLivraison
                    };
                    $scope.CmdsEnCoursLivraison = PostFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(1, $scope.limit, searchKey, dataFilter).then(function (commandeseEnattentelivraisonspaceclient) {
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
                $scope.update_en_attente_livraison = function () {
                    var searchKey = $scope.searchAttLivraison;
                    var dataFilter = {
                        user_id: $scope.clientAttLivraison,
                        livreur_id: $scope.livreurAttLivraison,
                        ville_id: $scope.villeAttLivraison
                    };
                    $scope.CmdsEnCoursLivraison = PostFactory.listCommandeEnattenteLivraisonEspaceclientPaginate(1, $scope.limit, searchKey, dataFilter).then(function (commandeseEnattentelivraisonspaceclient) {
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

                $scope.isEchange = function () {
                    setTimeout(function () {
                        var isEchange = $("#isEchange").val();
//                        ////console.log(isEchange);
                        if (isEchange == "1") {
                            $('#NoneEchange').show();
                        } else {
                            $('#NoneEchange').hide();
                        }
                    }, 500);
                };
                $scope.checkboxEchange = 0;
                $scope.$watch(function () {
                    return $scope.checkboxEchange;
                }, function () {
                    $scope.checkboxEchange = Number($scope.checkboxEchange);
                }, true);

            } else {
                $location.path('/login');
            }
        })
        .controller("AddCMDClientController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location, $uibModal, $log, $compile) {
            if ($cookieStore.get('sessionConnected')) {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
//                //console.log(Auth);
//                //console.log(Auth.user);

                $scope.isEchange = function () {
                    setTimeout(function () {
                        var isEchange = $("#isEchange").val();
//                        ////console.log(isEchange);
                        if (isEchange == "1") {
                            $('#NoneEchange').show();
                        } else {
                            $('#NoneEchange').hide();
                        }
                    }, 500);
                };
                $scope.config = PostFactory.showConfig().then(function (config) {
                    $scope.config = config;
                    //console.log(config);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.checkboxEchange = 0;
                $scope.$watch(function () {
                    return $scope.checkboxEchange;
                }, function () {
                    $scope.checkboxEchange = Number($scope.checkboxEchange);
                }, true);
                $scope.checkbox = 0;
                $scope.$watch(function () {
                    return $scope.checkbox;
                }, function () {
                    $scope.checkbox = Number($scope.checkbox);
                }, true);
                // ng-change type de distinataire 
                $scope.TypeDestinataire = function () {
                    var Type = $('#TypeDestinataire :selected').text();
                    if (Type === "Particulier") {
                        $('#HiddenRaisonSociale').hide();
                    } else if (Type === "") {
                        $('#HiddenRaisonSociale').hide();
                    } else {
                        $('#HiddenRaisonSociale').show();
                    }
                };
                // ng-change type de distinataire 
                $scope.isContreRembourcement = function () {
                    setTimeout(function () {
                        var isContreRembourcement = $("#isContreRembourcement").val();
//                        //console.log(isContreRembourcement);
                        if (isContreRembourcement == "1") {
                            $('#avecContreRenbourcement').show();
                        } else {
                            $('#avecContreRenbourcement').hide();
                        }
                    }, 500);
                };

                $scope.villes = PostFactory.listVilles().then(function (villes) {
                    $scope.villes = villes;
                    setTimeout(initSelectize, 500);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.payments = PostFactory.listPayments().then(function (payments) {
                    $scope.payments = payments;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                var currentTabClient = sessionStorage.getItem('currentTab');
                console.log(sessionStorage.getItem('currentTab'));
                $scope.changeLocalitee = function () {
                    ////console.log('change localitee');
                    var dataLocalite = {
                        Localite: {
                            id: $("#select-localite :selected").val()
                        }
                    };
                    $scope.localitees = PostFactory.listLocaliteVille(dataLocalite).then(function (localitees) {
                        $scope.localitees = localitees;
                        //console.log(localitees);
                        //console.log(localitees.Localite);
                        var zip_code = localitees.Localite.zip_code;
                        //console.log(zip_code);
                        $('#zip_code').empty();
                        setTimeout(function () {
                            $("#zip_code").append('<div class="form-group">\n\
                                    <label class="col-md-3 control-label" style="text-align: left;">Code Postal</label>\n\
                                    <div class="col-md-7">\n\
                                        <div class="input-group">\n\
                                            <span class="input-group-addon">\n\
                                                <i class="fa fa-pencil"></i>\n\
                                            </span>\n\
                                            <input type="text" id="postal" disabled value="' + localitees.Localite.zip_code + '" placeholder="Code Postal" name="Code Postal" class="form-control" /> </div>\n\
                                    </div>\n\
                                </div>');
                        }, 100);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );

                };
                $scope.ajoutCommandeClient = function ($event) {
                    $event.preventDefault();
                    var isContreRembourcement = $("#isContreRembourcement").val();
                    if (isContreRembourcement == "1") {
                        var mode_paiement = $('#TypePaiement :selected').text();
                        var mantant = $('#Mantant').val();
                    } else {
                        var mode_paiement = null;
                        var mantant = 0;
                    }
                    var Type = $('#TypeDestinataire :selected').text();
                    if (Type === "Particulier") {
                        var raison_sociale = null;
                    } else {
                        var raison_sociale = $("#raison_sociale").val();
                    }
                    var isEchange = $("#isEchange").val();
                    var cause_echange = $("#descriptifEchange").val();
//                    ////console.log(isContreRembourcement);
                    if ($("#isEchange").val() == '') {
                        isEchange = 0;
                        cause_echange = null;
                    }
                    if ($("#descriptifEchange").val() == '') {
                        cause_echange = null;
                    }
                    var type_colis = 'Normal';
                    if ($("#TypeColis :selected").val() != '') {
                        type_colis = $("#TypeColis :selected").val();
                    }
                    var dataCommande = {
                        Commande: {
                            type_remettre: 'Depot',
                            point_depot: $("#villeID :selected").text(),
                            state: 'En stock',
                            isStock: true,
                            isContreRembourcement: $("#isContreRembourcement").val(),
                            mode_paiement: mode_paiement,
                            mantant: mantant,
                            type_colie: type_colis,
                            source: Auth.user,
                            user_id: $("#SelectUser").val(),
                            cause_echange: cause_echange,
                            isEchange: isEchange,
                        },
                        Receiver: {
                            name: $("#first_name").val(),
                            last_name: $("#last_name").val(),
                            type: $("#TypeDestinataire :selected").text(),
                            adresse: $("#Adresse").val(),
                            email: $("#Email").val(),
                            raison_sociale: $("#raison_sociale").val(),
                            phone: $("#Phone").val(),
                            code_postal: $("#postal").val(),
                            ville_id: $("#villeValue :selected").val(),
                            localite_id: $("#select-localite :selected").val(),
                            delegation_id: $("#select-country :selected").val()
                        },
                        Bon: []
                    };
//                    $('div#DimensionColis').each(function (i, v) {
//                        var name = $(v).children().eq(4).children().children().val();
//                        if ($(v).children().eq(4).children().children().val() == '') {
//                            name = null;
//                        }
//                        dataCommande.Bon.push({longueur: $(v).children().eq(0).children().children().eq(1).val(), largeur: $(v).children().eq(1).children().children().val(), hauteur: $(v).children().eq(2).children().children().val(), poid: $(v).children().eq(3).children().children().val(), content: name});
//                    });
                    var countName = 0;
                    $('div#DimensionColis').each(function (i, v) {
                        var name = $(v).children().eq(4).children().children().val();
                        if ($(v).children().eq(4).children().children().val() == '') {
//                            name = null;
                            countName += 1;
                        }
                        // longueur
                        var longueur = $(v).children().eq(0).children().children().eq(1).val();
                        if ($(v).children().eq(0).children().children().eq(1).val() == '') {
                            longueur = 0;
                        }
                        // largeur
                        var largeur = $(v).children().eq(1).children().children().val();
                        if ($(v).children().eq(1).children().children().val() == '') {
                            largeur = 0;
                        }
                        // largeur
                        var hauteur = $(v).children().eq(2).children().children().val();
                        if ($(v).children().eq(2).children().children().val() == '') {
                            hauteur = 0;
                        }
                        // largeur
                        var poid = $(v).children().eq(3).children().children().val();
                        if ($(v).children().eq(3).children().children().val() == '') {
                            poid = 0;
                        }
                        dataCommande.Bon.push({longueur: longueur, largeur: largeur, hauteur: hauteur, poid: poid, content: name});
                    });
//                    //console.log(dataCommande.Bon);
                    if ($("#SelectUser").val() == '') {
                        toastr.error("Veuillez Choisir un Expéditeur...");
                    } else if ($("#villeID :selected").val() == '') {
                        toastr.error("Veuillez Choisir le point de dépôt...");
                    } else if ($("#first_name").val() === "") {
                        toastr.error("Veuillez Saisir le nom de Destinataire...");
                    } else if ($("#last_name").val() === "") {
                        toastr.error("Veuillez Saisir le prenom de Destinataire...");
                    } else if ($("#TypeDestinataire :selected").text() === "") {
                        toastr.error("Veuillez Saisir le type de Destinataire...");
                    } else if (parseInt(countName) > 0) {
                        toastr.error("Le contenu du colis est obligatoire...");
                    } else if ($("#Adresse").val() === "") {
                        toastr.error("Veuillez Saisir l'adresse de Destinataire...");
                    } else if ($("#Phone").val() === "") {
                        toastr.error("Veuillez Saisir le téléphone de Destinataire...");
                    } else if ($("#villeValue :selected").val() === "") {
                        toastr.error("Veuillez Saisir la ville de Destinataire...");
                    } else if ($("#isContreRembourcement").val() == 1 || $("#isContreRembourcement").val() == '1') {
                        if ($('#TypePaiement :selected').val() === "") {
                            toastr.error("Veuillez Saisir le mode de paiement...");
                        } else if ($('#Mantant').val() === "") {
                            toastr.error("Veuillez Saisir le mantant...");
                        } else {
                            $("button#submitCmdClient").attr('disabled', true);
                            $("button#submitCmdClient").text("Chargement...");
                            $scope.ajoutcommande = PostFactory.ajoutCommandeClient(dataCommande).then(function (ajoutcommande) {
                                $scope.ajoutcommande = ajoutcommande;
                                $location.path('/gestion-commandes-client');
                                toastr.success(ajoutcommande.text);
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        }
                    } else {
                        $scope.ajoutcommande = PostFactory.ajoutCommandeClient(dataCommande).then(function (ajoutcommande) {
                            $scope.ajoutcommande = ajoutcommande;
                            $location.path('/module-transporteur');
                            toastr.success(ajoutcommande.text);
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
            } else {
                $location.path('/login');
            }
        })
        .controller("ContactController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $location, $compile) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.focusCodebarrre = function () {
                    $('#CodeBarreGroupe').focus();
                };
                $scope.focusSelectCodebarrre = function () {
                    setTimeout(function () {
                        $('#CodeBarreGroupe').focus();
                    }, 100);
                };
                var id = parseInt($location.path().split('/')[2]);
                var dataUser = {
                    Commande: {
                        user_id: id
                    }
                };
                if (id) {
                    $scope.commandesespaceclient = PostFactory.listCommandeEspaceclient(dataUser).then(function (commandesespaceclient) {
                        $scope.commandesespaceclient = commandesespaceclient;
                        //console.log(commandesespaceclient);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
                $scope.livreurs = PostFactory.listLivreurs().then(function (livreurs) {
                    $scope.livreurs = livreurs;
                    //console.log(livreurs);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
//                $scope.commerciales = PostFactory.listCommerciales().then(function (commerciales) {
//                    $scope.commerciales = commerciales;
//                    //////console.log(commerciales);
////                    //console.log('testt');
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
                // affecter commercial a une commande client 
                var id = parseInt($location.path().split('/')[2]);
                $scope.affecterCommercial = function ($event) {
                    $event.preventDefault();
                    var dataCommande = {
                        Commande: {
                            id: id,
                            livreur_id: $("#commercialeValue :selected").val(),
                            com_id: $("#commercialeValue :selected").val()
                        }
                    };
                    if ($("#commercialeValue :selected").val() == '') {
                        toastr.error('Veuillez choisir le livreur');
                    } else {
                        $scope.commandeCommercial = PostFactory.affecterCommercial(dataCommande).then(function (commandeCommercial) {
                            if (commandeCommercial.type === 'success') {
//                                $location.path('/view-commande-for-client/' + commandeCommercial.user_id);
                                $location.path('/module-transporteur');
                                toastr.success(commandeCommercial.text);

                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                };
                // affecter livreur à une commande 
                var id = parseInt($location.path().split('/')[2]);
                $scope.affecterLivreur = function ($event) {
                    $event.preventDefault();
                    var date = $("#DateLivraison").val();
                    var date_livraison = date.split('-')[2] + '/' + date.split('-')[1] + '/' + date.split('-')[0];
                    //console.log(date_livraison);
                    var dataCommandeLivreur = {
                        Commande: {
                            id: id,
                            livreur_id: $("#commercialeValue :selected").val(),
                            isLivraison: 1,
                            date_livraison: date_livraison,
                            state: 'AttenteLivraison',
                            isStock: 0
                        }
                    };
                    if ($("#commercialeValue :selected").val() == '') {
                        toastr.error('Veuillez choisir le livreur');
                    } else if ($("#DateLivraison").val() == '') {
                        toastr.error('Veuillez choisir la date de livraison');
                    } else {
                        $scope.commandeLivreur = PostFactory.affecterLivreur(dataCommandeLivreur).then(function (commandeLivreur) {
                            if (commandeLivreur.type === 'success') {
                                $location.path('/module-transporteur');
                                toastr.success(commandeLivreur.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                };
                $scope.checkboxModel = {
                    value1: false
                };
                $scope.affecterGroupeCommande = function ($val) {
//                    $event.preventDefault();
                    var dataCommande = {
                        Commande: []
                    };
                    if ($val == 0) {
                        $('#commandeEspaceClient tr').each(function (i, v) {
//                        //console.log($(v).children().eq(12).children().children().val());
//                            if ($(v).children().eq(9).children().children().val() == true || $(v).children().eq(9).children().children().val() == 'true') {
                            if ($(v).children().eq(9).children().children().is(':checked')) {
//                            //console.log('true');
                                dataCommande.Commande.push({id: $(v).attr('data-data-id')});
                            }
                        });
//                    //console.log('dataCommande.Commande');
//                    //console.log(dataCommande.Commande);
//                    $cookies.put('CommandeID', JSON.stringify(dataCommande.Commande));

//                        $cookieStore.remove('sessionCommandeID');
//                        $cookieStore.put('sessionCommandeID', dataCommande.Commande);
//                        setTimeout(function () {
////                        //console.log($cookieStore.get('sessionCommandeID'));
////                        //console.log($cookieStore.get('sessionCommandeID').length);
//                        }, 1000);
////                    //console.log($cookieStore.get('sessionCommandeID').length !== 0);
//                        if ($cookieStore.get('sessionCommandeID').length !== 0) {
//                            $location.path('/affecter-multi-commande-client');
//                        }
//                        if ($cookieStore.get('sessionCommandeID').length === 0) {
//                            toastr.warning('Veuillez choisir au moins une commande');
//                        }
                    }
                    if ($val == 1) {
                        $('tr#CommandeEnterStock').each(function (i, v) {
                            if ($(v).children().eq(13).children().children().children().val() == true || $(v).children().eq(13).children().children().children().val() == 'true' || $(v).children().eq(13).children().children().children().is(':checked') == true) {
                                dataCommande.Commande.push({id: $(v).attr('data-data-id')});
                            }
                        });
                    }
                    if ($val == 3) {
                        $('#enCoursLivraison tr').each(function (i, v) {
                            if ($(v).children().eq(11).children().children().val() == true || $(v).children().eq(11).children().children().val() == 'true') {
                                dataCommande.Commande.push({id: $(v).attr('data-data-id')});
                            }
                        });
                    }
                    if ($val == 4) {
                        $('#commandeRetours tr').each(function (i, v) {
                            if ($(v).children().eq(12).children().children().val() == true || $(v).children().eq(12).children().children().val() == 'true') {
                                dataCommande.Commande.push({id: $(v).attr('data-data-id')});
                            }
                        });
                    }
                    $cookieStore.remove('sessionCommandeID');
                    $cookieStore.put('sessionCommandeID', dataCommande.Commande);
                    setTimeout(function () {
//                        //console.log($cookieStore.get('sessionCommandeID'));
//                        //console.log($cookieStore.get('sessionCommandeID').length);
                    }, 1000);
//                    //console.log($cookieStore.get('sessionCommandeID').length !== 0);
                    if ($cookieStore.get('sessionCommandeID').length !== 0) {
                        if ($val == 0) {
                            $location.path('/affecter-multi-commande-client');
                        } else {
                            $location.path('/affecter-multi-commande-livreur');
                        }
                    }

                    if ($cookieStore.get('sessionCommandeID').length === 0) {
                        toastr.warning('Veuillez choisir au moins une commande');
                    }
                };
                $scope.affecterGroupeCommercial = function ($event) {
                    $event.preventDefault();
                    var date = $("#dateLivraison").val();
                    var date_livraison = null;
                    var state = 'Non Traitée';
                    //console.log(date);
                    date_livraison = date.split('-')[2] + '/' + date.split('-')[1] + '/' + date.split('-')[0];
                    state = 'AttenteLivraison';
                    //console.log(date_livraison);
                    var dataCommande = {
                        Commercial: {
                            livreur_id: $("#commercialeValue :selected").val(),
                            state: state,
                            date_livraison: date_livraison,
                            isStock: 0

                        },
                        Commande: $cookieStore.get('sessionCommandeID')
                    };
                    if ($("#commercialeValue :selected").val() == '') {
                        toastr.error('Veuillez choisir le livreur');
                    } else if ($('#dateLivraison').val() == '') {
                        toastr.error('Veillez choisir la date de livraison');
                    } else {
                        $scope.commandeGroupeCommercial = PostFactory.affecterGroupeCommercial(dataCommande).then(function (commandeGroupeCommercial) {
                            if (commandeGroupeCommercial.type === 'success') {
                                id = commandeGroupeCommercial.user_id;
                                $location.path('/module-transporteur');
                                toastr.success(commandeGroupeCommercial.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                };
                $scope.affecterGroupeRamassage = function ($event) {
                    $event.preventDefault();
                    var date = $("#dateLivraison").val();
                    var date_livraison = null;
                    var state = 'Non Traitée';
                    //console.log(date_livraison);
                    if ($('#dateLivraison').val() != '' && $('#dateLivraison').val() != 'undefined' && $('#dateLivraison').val() != undefined) {
                        date_livraison = date.split('-')[2] + '/' + date.split('-')[1] + '/' + date.split('-')[0];
                        state = 'AttenteLivraison';
                    }
                    var dataCommande = {
                        Commercial: {
                            livreur_id: $("#commercialeValue :selected").val(),
                            com_id: $("#commercialeValue :selected").val(),
                            state: state,
                            date_livraison: date_livraison,
                            isStock: 0

                        },
                        Commande: $cookieStore.get('sessionCommandeID')
                    };
                    $scope.commandeGroupeCommercial = PostFactory.affecterGroupeRamassage(dataCommande).then(function (commandeGroupeCommercial) {
                        if (commandeGroupeCommercial.type === 'success') {
                            id = commandeGroupeCommercial.user_id;
                            $location.path('/module-transporteur');
                            toastr.success(commandeGroupeCommercial.text);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                $scope.myGroupecommande = function (keyEvent) {
                    var ancient_code = $("#CodeBarreGroupe").val();
//                    setTimeout(function () {
                    if (keyEvent.which === 13) {
                        var ref = "";
                        var str = $.trim($("#CodeBarreGroupe").val());
                        if (str.indexOf(")") == -1) {
                            ref = $("#CodeBarreGroupe").val();
                        } else {
                            ref = decodeBarcode($("#CodeBarreGroupe").val());
                        }
                        $("#CodeBarreGroupe").val(ref);
                        setTimeout(function () {
                            var lengthCB = ref.split("-").length;
                            if (lengthCB == 3 || ref === "") {
                                $scope.commandeBarrecode = PostFactory.viewCommandeBarrecodeBonchargement(ref).then(function (commandeBarrecode) {
                                    $scope.commandeBarrecode = commandeBarrecode.text;
                                    var CommandeExist = commandeBarrecode.text;
                                    var listCommande = [];
                                    var commande_name = $("#CodeBarreGroupe").val().replace("°", "-").replace("°", "-");
                                    $("#CommandeLivreur tr").each(function (i, v) {
                                        var c_name = $(v).children().eq(1).text();
                                        listCommande.push(c_name);
                                    });
                                    //console.log(listCommande);
                                    //console.log(commande_name);
                                    if ($.inArray(commande_name, listCommande) !== -1) {
//                                        setTimeout(function () {
                                        $("#CodeBarreGroupe").val("");
                                        toastr.info("Commande déjà présente");
//                                        }, 100);
                                    } else {
                                        if (commandeBarrecode.type == 'error') {
//                                            setTimeout(function () {
                                            toastr.error("Commande n'existe pas");
                                            $("#CodeBarreGroupe").val("");
//                                            }, 100);
                                        } else if (commandeBarrecode.type == 'warning') {
                                            toastr.error(commandeBarrecode.text);
                                            $("#CodeBarreGroupe").val("");
                                        } else {
                                            $("#CodeBarreGroupe").val("");
                                            if (commandeBarrecode.type == 'success') {
                                                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                                                $scope.Auth = Auth.user;
                                                setTimeout(function () {
                                                    var count = $("tr#groupementCommande").length;
                                                    var mantant = "";
//                                            //console.log(CommandeExist);
                                                    if (CommandeExist.Commande.isContreRembourcement == 1) {
                                                        mantant = CommandeExist.Commande.mantant;
                                                    }

                                                    if (CommandeExist.Commande.isStock == 0) {
                                                        if (CommandeExist.Commande.type_remettre === "Ramassage" && CommandeExist.Commande.state === "En Cours") {
                                                            toastr.info("C'est une commande Ramassage récupérée, pas en stock");
                                                        } else if (CommandeExist.Commande.type_remettre === "Depot") {
                                                            toastr.info("C'est une commande dépôt non traitée");
                                                        } else if (CommandeExist.Commande.type_remettre === "Ramassage" && CommandeExist.Commande.state === "Non Traitée") {
                                                            toastr.info("C'est une commande Ramassage non traitée");
                                                        } else {
                                                            toastr.info("Cette commande n'est pas en stock");
                                                        }
                                                    } else {
//                                                        $('tbody#CommandeLivreur').append("<tr id='groupementCommande' data-data-id='" + CommandeExist.Commande.id + "'>\n\
//                                                            <td>" + parseInt(count + 1) + "</td>\n\
//                                                            <td>" + CommandeExist.Commande.ref + "</td>\n\
//                                                            <td>" + CommandeExist.User.full_name + "</td>\n\
//                                                            <td>" + CommandeExist.Receiver.full_name + "</td>\n\
//                                                            <td>" + CommandeExist.Receiver.adresse + "</td>\n\
//                                                            <td>" + CommandeExist.Receiver.Ville.name + "</td>\n\
//                                                            <td>" + CommandeExist.Receiver.code_postal + "</td>\n\
//                                                            <td>" + mantant + "</td>\n\
//                                                            <td></td>\n\
//                                                            <td><a href='#' id='deleteCommande' class='btn btn-sm btn-danger'><i class='fa fa-times'></i></a></td>\n\
//                                                        </tr>");
//                                                        
                                                        var $items = $compile("<tr id='groupementCommande' data-data-id='" + CommandeExist.Commande.id + "'>\n\
                                                            <td>" + parseInt(count + 1) + "</td>\n\
                                                            <td>" + CommandeExist.Commande.ref + "</td>\n\
                                                            <td>" + CommandeExist.User.full_name + "</td>\n\
                                                            <td>" + CommandeExist.Receiver.full_name + "</td>\n\
                                                            <td>" + CommandeExist.Receiver.adresse + "</td>\n\
                                                            <td>" + CommandeExist.Receiver.Ville.name + "</td>\n\
                                                            <td>" + CommandeExist.Receiver.code_postal + "</td>\n\
                                                            <td>" + mantant + "</td>\n\
                                                            <td></td>\n\
                                                            <td><a href='#' id='deleteCommande' class='btn btn-sm btn-danger'><i class='fa fa-times'></i></a></td>\n\
                                                        </tr>")($scope);
                                                        if (parseInt($("#CommandeLivreur tr").length) == 0) {
                                                            $('tbody#CommandeLivreur').append($items);
                                                        } else {
                                                            $('tbody#CommandeLivreur tr:first').before($items);
//                                                            $('tbody#CommandeLivreur').before($items);
                                                        }

                                                    }
                                                    $("#CodeBarreGroupe").val("");
                                                    cleanTableDuplicate();
                                                }, 100);
                                            }
                                        }
                                    }
                                });
                            } else {
                                $("#CodeBarreGroupe").val("");
                            }
                        }, 100);
                    }
//                    }, 200);
                };
                $("#CommandeLivreur").on('click', "#deleteCommande", function (e) {
                    e.preventDefault();
                    $(this).parent().parent().remove();
                });
                // affecter groupe commande à un livreur
                var id = parseInt($location.path().split('/')[2]);
                $scope.affecterGroupeCommandeLivreur = function ($event) {
                    $event.preventDefault();
                    $("#form-username").submit(function () {
                        return false;
                    });
                    var date = $("#dateLivraison").val();
                    var date_livraison = date.split('-')[2] + '/' + date.split('-')[1] + '/' + date.split('-')[0];
                    //console.log(date_livraison);
                    var dataCommande = {
                        Chargement: {
                            id: null,
                            livreur_id: $("#commercialeValue :selected").val(),
                            date_livraison: date_livraison,
                            destination: $("#Zone").val(),
                            agence: $("#Agence").val(),
                            type: 'Chargement'
                        },
                        Commande: []
                    };
                    $('tr#groupementCommande').each(function (i, v) {
                        dataCommande.Commande.push({id: $(v).attr('data-data-id'), livreur_id: $("#commercialeValue :selected").val(), date_livraison: date_livraison, state: 'AttenteLivraison'});
                    });
//                    //console.log(dataCommande.Commande);
                    if ($("#commercialeValue :selected").val() == '') {
                        toastr.error('Veuillez choisir un livreur');
                    } else if ($("#dateLivraison").val() == '') {
                        toastr.error('Veuillez choisir une date de livraison');
                    } else if (dataCommande.Commande.length == 0) {
                        toastr.error('Veuillez choisir au moins une commande');
                    } else {
                        $scope.commandeLivreur = PostFactory.affecterGroupeCommandeLivreur(dataCommande).then(function (commandeLivreur) {
                            if (commandeLivreur.type === 'success') {
                                $location.path('/gestion-bon-chargement');
                                toastr.success(commandeLivreur.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                };
            } else {
                $location.path('/login');
            }
        })
        .controller('StatsController', function ($scope, $http, $timeout, $interval, $location, PostFactory, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                //generate stats
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
                $scope.loadSalesVenteClient = PostFactory.loadSalesVenteClient().then(function (statsventeclient) {
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
                }
                ;
            } else {
                $location.path('/login');
            }
        })
        .controller('tabController', function ($scope) {
            $scope.data = {
                selectedIndex: 0,
                secondLocked: true,
                secondLabel: "2",
                bottom: false
            };
            $scope.next = function () {
                $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
            };
            $scope.previous = function () {
                $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
            };
        })
        .controller('DevisUser', function ($scope, $cookieStore, $location, PostFactory) {
            if ($cookieStore.get('sessionConnected')) {
                // start list devis in costum user
                var id = parseInt($location.path().split('/')[2]);
                var dataUser = {
                    Commande: {
                        user_id: id
                    }
                };
                $scope.devisuser = PostFactory.listUserDevis(dataUser).then(function (devisuser) {
                    $scope.devisuser = devisuser;
                    //////console.log(devisuser);
                    var total_ht = 0;
                    var total_ttc = 0;
                    var ttc = 0;
                    var ht = 0;
                    $(devisuser).each(function (i, v) {
                        $(v.Bon).each(function (index, value) {
                            var qte = value.qte;
                            if (value.qte_recue != 0) {
                                qte = value.qte_recue;
                            }
                            total_ht = total_ht + parseFloat(value.last_unit_price) * qte;
                            total_ttc = total_ttc + (parseFloat(value.last_unit_price) * (1 + value.Product.Tva.value / 100) * (1 - value.remise / 100) * qte);
                        });
                        ttc = ttc + (total_ttc * (1 - v.Commande.remise_globale / 100));
                        ht = ht + total_ht;
                    });
                    $scope.ht = ht;
                    $scope.ttc = ttc;
                    var total_reglement = 0;
                    var regle = 0;
                    $(devisuser).each(function (i, v) {
                        $(v.Reglement).each(function (index, valeur) {
                            regle = regle + parseFloat(valeur.value);
                        });
                    });
                    total_reglement = total_reglement + regle;
                    $scope.total_reglement = total_reglement;
                    $scope.total_restee = ttc - total_reglement;
                    var ReglementData = {
                        Data: []
                    };
                    $(devisuser).each(function (i, v) {
                        $(v.Reglement).each(function (index, valeur) {
                            ReglementData.Data.push({id: valeur.id, ref: v.Commande.ref, type: valeur.type, numero: valeur.numero, date: valeur.date, value: valeur.value, valide: valeur.valide});
                        });
                    });
                    $scope.dataRegle = ReglementData.Data;
                    $scope.regleValide = "true";
                    $scope.regleInValide = "false";
//                $scope.checkStuff = function (valide, id) {
////                    alert("Valide : " + valide + " - ID : " + id);
//                }
                    $scope.checkStuff = function (valide, id) {
                        var DataRegle = {
                            Reglement: {
                                id: id,
                                valide: valide
                            }
                        };
                        $scope.reglement = PostFactory.checkStuff(DataRegle).then(function (reglement) {
                            $scope.reglement = reglement;
                            if (reglement.type === 'success') {
                                toastr.success(reglement.text);
                            }

                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            } else {
                $location.path('/login');
            }
        })
        .controller('LivreurController', function ($scope, $cookieStore, $location, PostFactory) {
            if ($cookieStore.get('sessionConnected')) {
                // list villes 
                $scope.villes = PostFactory.listVilles().then(function (villes) {
                    $scope.villes = villes;
                    //////console.log(villes);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    // view livreur
                    $scope.livreur = PostFactory.viewLivreur(id).then(function (livreur) {
                        $scope.livreur = livreur;
                        //console.log(livreur);
                    });
                    // edit livreur (information générale)
                    $scope.editLivreur = function ($event) {
                        $event.preventDefault();
                        var ville_id = 0;
                        if ($("#villeValue :selected").val() != '') {
                            ville_id = $("#villeValue :selected").val();
                        }
                        var dataUser = {
                            Livreur: {
                                id: id,
                                last_name: $("#last_name").val(),
                                first_name: $("#first_name").val(),
                                phone: $("#phone").val(),
                                en_phone: $("#en_phone").val(),
                                marque_voiture: $("#marque_voiture").val(),
                                email: $("#email").val(),
                                adress: $("#adress").val(),
                                ville_id: ville_id,
                                permis_conduire: $("#permis_conduire").val(),
                                matricule_voiture: $("#matricule_voiture").val()
                            }};
                        //console.log(dataUser);
                        $scope.livreur = PostFactory.editLivreur(dataUser).then(function (livreur) {
                            if (livreur.type === 'success') {
//                                $location.path('/gestion-livreurs');
                                toastr.success(livreur.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                    // edit livreur (information de connection)
                    $scope.editConnectionLivreur = function ($event) {
                        $event.preventDefault();
                        var dataUser = {
                            Livreur: {
                                id: id,
                                username: $('#username').val(),
                                password: $('#password').val()
                            }
                        };
                        //console.log(dataUser);
                        if ($('#username').val() === '') {
                            toastr.error('Login invalide');
                        } else if ($('#password').val() === '') {
                            toastr.error('Mot de passe invalide');
                        } else if ($('#password').val() !== $('#password1').val()) {
                            toastr.error('Mot de passe invalide');
                        } else {
                            $scope.livreur = PostFactory.editLivreur(dataUser).then(function (livreur) {
                                if (livreur.type === 'success') {
                                    $location.path('/gestion-livreurs');
                                    toastr.success(livreur.text);
                                }
                            },
                                    function (msg) {
                                        alert(msg);
                                    }
                            );
                        }
                    };
                    var dataLivreur = {
                        Livreur: {
                            user_id: id
                        }
                    };
                    // commande recuperee for costom livreur
                    $scope.recuperees = PostFactory.listRecupereesLivreur(dataLivreur).then(function (recuperees) {
                        $scope.recuperees = recuperees;
                        //console.log(recuperees);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // commande en attente livraison for costom livreur
                    $scope.enattentes = PostFactory.listEnAttenteLivreur(dataLivreur).then(function (enattentes) {
                        $scope.enattentes = enattentes;
                        //console.log(enattentes);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // commande livrées for costom livreur
                    $scope.livrees = PostFactory.listLivreeLivreur(dataLivreur).then(function (livrees) {
                        $scope.livrees = livrees;
                        //console.log(livrees);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // commande retours for costom livreur
                    $scope.retours = PostFactory.listRetoursLivreur(dataLivreur).then(function (retours) {
                        $scope.retours = retours;
                        //console.log(retours);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // commande annulées for costom livreur
                    $scope.annulations = PostFactory.listAnnulationsLivreur(dataLivreur).then(function (annulations) {
                        $scope.annulations = annulations;
                        //console.log(annulations);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            } else {
                $location.path('/login');
            }
        })
        .controller('ReglementsController', function ($scope, $cookieStore, $location, PostFactory) {
            if ($cookieStore.get('sessionConnected')) {
                //liste reglements ventes
                $scope.reglementsventes = PostFactory.listReglementsVentes().then(function (reglementsventes) {
                    $scope.reglementsventes = reglementsventes;
//                    //console.log(reglementsventes);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                //liste reglements achats
                $scope.reglementsachats = PostFactory.listReglementsAchats().then(function (reglementsachats) {
                    $scope.reglementsachats = reglementsachats;
//                    //console.log(reglementsachats);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            } else {
                $location.path('/login');
            }
        })
        // controller commande produit (achats/ventes)
        .controller('CommandeProduitController', function (PostFactory, $scope, $location, $cookieStore, $cookies) {
            if ($cookieStore.get('sessionConnected')) {
                var id = parseInt($location.path().split('/')[2]);
                var string = document.location.hash;
                if (id && string.indexOf("fiche") == -1) {
                    // list commande achats/produit
                    $scope.commandesachats = PostFactory.listProductsAchat(id).then(function (commandesachats) {
                        $scope.commandesachats = commandesachats;
                        //////console.log(commandesachats);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                    // list commande ventes/produit
                    $scope.commandesventes = PostFactory.listProductsVente(id).then(function (commandesventes) {
                        $scope.commandesventes = commandesventes;
                        //////console.log(commandesventes);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
                if (id && string.indexOf("fiche") !== -1) {
                    //mouvement product (achats, ventes)
                    $scope.DataMVM = PostFactory.listMVMProducts(id).then(function (DataMVM) {
                        $scope.DataMVM = DataMVM;
                        $scope.ventes = DataMVM.ventes;
                        $scope.achats = DataMVM.achats;
                        var qte_vente = 0;
                        if (DataMVM.ventes.Commande.id !== null) {
                            $(DataMVM.ventes.Bon).each(function (i, v) {
                                if (v.product_id == id) {
                                    qte_vente += parseFloat(v.qte);
                                }
                            });
                        }
                        $scope.qte_vente = qte_vente;
                        var qte_achat = 0;
                        if (DataMVM.achats !== null) {
                            $(DataMVM.achats.Bon).each(function (i, v) {
                                if (v.product_id == id) {
                                    qte_achat += parseFloat(v.qte);
                                }
                            });
                        }
                        $scope.qte_achat = qte_achat;
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            } else {
                $location.path('/login');
            }
        })
        .controller("ProductsController", function ($scope, PostFactory, $location, $cookieStore, $cookies) {
            if ($cookieStore.get('sessionConnected')) {
                $('#exportableList').hide();
                $('#EntrepotBlock').show();
                $scope.currentPage = 1;
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
                console.log($cookieStore.get('sessionConnected'));
                // add item to panie
                $scope.items = [];
                $scope.additem = function (Product) {
                    console.log(Product);
                    console.log("hereeeee");
                    if ($scope.items.indexOf(Product) == -1)
                    {
                        $scope.items.push(Product);
                    }
                    console.log($scope.items);
                };
                $scope.deleteitem = function (Product) {
                    var index = $scope.items.indexOf(Product);
                    $scope.items.splice(index, 1);
                    
                };

                // change product achat
                $scope.productAchat = function () {
//                    //console.log('change product ');
                };
                // end change product achat
//                $scope.changeprice = function () {
//                    //////console.log('price_achat');
//                    setTimeout(function () {
//                        //////console.log('price_achat');
                //                        var price_achat = parseFloat($("#combobox :selected").attr('data-price')).toFixed(3);
//                        //////console.log(price_achat);
//                        $("#Prix_Achat").val(price_achat);
//                    }, 300);
//                };
                $scope.exportData = function () {
//                    var blob = new Blob([document.getElementById('exportable').innerHTML], {
                    //                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
                    //                    });
                    //                    saveAs(blob, "Liste Produits.xls");
                };
                //                setTimeout(function () {
//                    var price_achat = parseFloat($("#PACHAT").val());
                //                    var marge = parseFloat($("#Marge").val());
                //                    var prix_unit = parseFloat(price_achat * (1 - marge / 100)).toFixed(3); //                    $("#PU").val(prix_unit);
                //                }, 500);
                $scope.changeAchat = function () {
                    setTimeout(function () {
                        var price_achat = parseFloat($("#PACHAT").val());
                        var marge = parseFloat($("#Marge").val());
                        var prix_unit = parseFloat(price_achat * (1 + marge / 100)).toFixed(3);
                        $("#PU").val(prix_unit);
                    }, 300);
                };
                $scope.changeAchatEdit = function () {
                    setTimeout(function () {
                        var price_achat = parseFloat($("#PACHAT").val());
                        var marge = parseFloat($("#Marge").val());
                        var prix_unit = parseFloat(price_achat * (1 + marge / 100)).toFixed(3);
                        $("#PUHT").val(prix_unit);
                    }, 300);
                };
                $scope.ajoutProduct = function ($event) {
                    $event.preventDefault();
                    var dataProduct = {
                        Product: {
                            name: $("#nom").val(),
                            price: $("#PU").val(),
                            marge: $("#Marge").val(),
                            prix_achat: $("#PACHAT").val(),
                            code_barres: $("#code_barre").val(),
                            ref: $("#ref").val(),
                            type: $('#typeValue :selected').val(),
                            tva_id: $('#tvaValue :selected').val(),
                            fournisseur_id: $('#fournisseurValue :selected').val(),
                            famille_id: $('#familleValue :selected').val(),
                            unite_id: $('#uniteValue :selected').val(),
                            category_id: $('#categoryValue :selected').val()
                        }
                    };
                    $scope.product = PostFactory.ajoutProduct(dataProduct).then(function (product) {
                        $scope.product = product;
                        $location.path('/products');
                        toastr.success(product.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.currentProduct = PostFactory.viewProduct(id).then(function (product) {
                        $scope.currentProduct = product;
//                        //console.log(product);
                        var disponible = 0;
                        $.each(product.Stock, function (i, v) {
                            if (v.ProductsStock != undefined) {
                                disponible += parseFloat(v.ProductsStock.qte);
                            }
                        });
                        $scope.disponible = disponible;
                        $scope.prix_achat = parseFloat(product.Product.price / (1 + product.Product.marge / 100));
                    });
                    $scope.editProduct = function ($event) {
                        $event.preventDefault();
                        var dataProduct = {
                            Product: {
                                id: id,
                                name: $("#nom").val(),
                                price: $("#PUHT").val(),
                                marge: $("#Marge").val(),
                                prix_achat: $("#PACHAT").val(),
                                code_barres: $("#code_barre").val(),
                                ref: $("#ref").val(),
                                type: $('#typeValue :selected').val(),
                                tva_id: $('#tvaValue :selected').val(),
                                fournisseur_id: $('#fournisseurValue :selected').val(),
                                famille_id: $('#familleValue :selected').val(),
                                unite_id: $('#uniteValue :selected').val(),
                                category_id: $('#categoryValue :selected').val(),
                            }
                        };
                        var file = $scope.myFile;
                        $scope.product = PostFactory.editProduct(file, dataProduct).then(function (product) {
                            if (product.type === 'success') {
                                $location.path('/products');
                                toastr.success(product.text);
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

//        stock controller
        .controller("Stocks1Controller", function ($scope, PostFactory, $location, $cookieStore, $compile) {
            if ($cookieStore.get('sessionConnected')) {
                $('#exportableList').hide();
                $('#EntrepotBlock').show();
                $scope.currentPage = 1;
                $scope.pageSize = 9;
                $scope.meals = [];
                $scope.pageChangeHandler = function (num) {
                    ////console.log('going to page ' + num);
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
////                    //console.log(dataCommande.Commande);
//                },
//                        function (msg) {
//                            alert(msg);
//                        }
//                );
                $scope.TypeTransfert = function () {
//                    if()
                    $('#IterEntrepot').show();

                };
                $scope.emplacementsList = null;
                $scope.entrepotDepart = function () {
                    //console.log($("#entrepotValueDebut :selected").val());
                    $('#EmplacementID').empty();
                    if ($('#TypeDeTransfert :selected').val() == 'inter') {
                        $('#entrepotValueFin').empty();
                        $('#EntrepotRecept').show();
                        PostFactory.listStocks().then(function (stocks) {
                            setTimeout(function () {
                                var item = $compile("<option value=''></option>")($scope);
                                $('#entrepotValueFin').append(item);
                                $(stocks).each(function (i, v) {
                                    if ($("#entrepotValueDebut :selected").val() != v.Stock.id) {
                                        var $items = $compile("<option value=" + v.Stock.id + ">" + v.Stock.name + "</option>")($scope);
                                        $('#entrepotValueFin').append($items);
                                    }
                                });
                            }, 100);
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                    if ($('#TypeDeTransfert :selected').val() == 'intra') {
                        $('#EntrepotRecept').hide();
                    }
//                    //console.log($.trim($('#commnadeINstock').val().split(',')[0]));
                    var id = $("#entrepotValueDebut :selected").val();
                    var searchKey = $scope.searchProducts;
                    var dataStock = {
                        Stock: {
                            id: id
                        }
                    };
                    $scope.pageChanged = function (page) {
                        PostFactory.costomStock(page, dataStock).then(function (costomstock) {
                            $scope.costomstock = costomstock.data;
                            $scope.paging = costomstock.paging;
                            $scope.totalItems = costomstock.paging.count;
                            $scope.itemsPerPage = costomstock.paging.limit;
                        });
                    };
                    $scope.costomstock = PostFactory.costomStock(1, dataStock).then(function (costomstock) {
                        $scope.costomstock = costomstock.data;
                        $scope.paging = costomstock.paging;
                        $scope.totalItems = costomstock.paging.count;
                        $scope.itemsPerPage = costomstock.paging.limit;
                        $('#displayProduct').show();
                        $("#productStock").show();

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
                        console.log(searchProducts);
                        console.log(searchKey);
                        console.log(dataStock);
                        if (searchKey.length >= 3) {
                            console.log("LAUNCH SEARCH");
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
                    $scope.emplacementsStock = PostFactory.listCostomEmplacement(dataStock).then(function (emplacementsStock) {
                        $scope.emplacementsStock = emplacementsStock.data;
                        //console.log(emplacementsStock.data);
                        if (emplacementsStock.type === 'error') {
                            $('#emplacementBlock').hide();
                            $('#sousemplacementBlock').hide();
                        }
                        if (emplacementsStock.type === 'success') {
                            $('#emplacementBlock').show();
//                            $scope.emplacementsList = emplacementsStock.data;
                            console.log(emplacementsStock.data);
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
                                    $scope.costomstock = PostFactory.productEmplacement(1, dataEmplacement).then(function (costomstock) {
                                        $scope.costomstock = costomstock.data;
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
                                            console.log("LAUNCH SEARCH");
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
                                        //console.log(sousemplacementsStock.data);
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
                                                console.log('sousemplacementDepart');
                                                var SousEmplacement = {
                                                    Sousemplacement: {
                                                        id: $('#SousEmplacementID').val()
                                                    }
                                                };
                                                $scope.costomstock = PostFactory.listcustomProduct(1, SousEmplacement).then(function (costomstock) {
                                                    console.log(costomstock);
                                                    $scope.costomstock = costomstock.data;
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
                                                        console.log("LAUNCH SEARCH");
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
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.bonsortie = PostFactory.viewBonSortie(id).then(function (bonsortie) {
                        $scope.bonsortie = bonsortie;
                        console.log(bonsortie);
                    });
                    $scope.bonentree = PostFactory.viewBonEntree(id).then(function (bonentree) {
                        $scope.bonentree = bonentree;
                        console.log(bonentree);
                    });
                }

                $scope.appendProduct = function () {
                    console.log('appendProduct');
                    console.log($(this).attr('data-ref'));
                    var product = $('#commnadeINstock').val();
                    var product_name = $('#commnadeINstock').val().split(',')[0];
                    var qte = $('#Qte').val();
                    var data = {
                        dataCommande: []
                    };
                    $('tr#trProduct').each(function (index, value) {
                        data.dataCommande.push({name: $(value).attr('data-product')});
                    });
                    if (product == '') {
                        toastr.error('Veuillez mettre un produit');
                    } else if (qte == '') {
                        toastr.error('Veuillez mettre une quantité');
                    } else if ($.inArray(product_name, data.dataCommande) !== -1) {
                        toastr.info("Produit déjà présent");
                    } else {
                        var item = $compile("<tr id='trProduct' data-product='" + product_name + "'><td>" + product + "</td><td>" + product + "</td><td>" + qte + "</td><td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td></tr>")($scope);
                        $('#listProduct').append(item);
                        $('#commnadeINstock').val('');
                        $('#Qte').val('');
                        $('#genererBon').show();
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

                    console.log('appendProduct');
                    console.log($(this).attr('data-ref'));
                    console.log(data.dataCommande);
                    var product_name = $.trim($(this).attr('data-ref'));
                    var product_ref = $.trim($(this).attr('data-name'));
                    var product_id = $.trim($(this).attr('data-data-id'));
                    console.log(product_id);
                    var product = $(this).attr('data-ref');
                    console.log(product_name);
                    console.log($.inArray(product_name, data.dataCommande));
                    var item = $compile("<tr id='trProduct' data-id='" + product_id + "' data-product='" + product_name + "'><td>" + product_ref + "</td><td>" + product_name + "</td><td><input type='number' id='Qte' placeholder='Qte' name=QteTelephone' class='form-control' style='width: 100px;' /></td><td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td></tr>")($scope);
                    if ($.inArray(product_name, data.dataCommande) >= 0) {
                        toastr.info("Produit déjà présent");
                    } else {
                        $('#listProduct').append(item);
                    }
//                    $('#commnadeINstock').val('');
//                    $('#Qte').val('');
                    $('#genererBon').show();
                });

                $scope.genererBonSortie = function ($event) {
                    $event.preventDefault();
                    var dataCommande = {
                        Sortie: {
                            entrepot_depart: $.trim($("#entrepotValueDebut :selected").text()),
                            entrepot_arrivee: $.trim($("#entrepotValueFin :selected").text())
                        },
                        Bon: []
                    };
                    $('tr#trProduct').each(function (i, v) {
                        dataCommande.Bon.push({product_id: $(v).attr('data-id'), qte: $(v).children().eq(1).text(), content: $.trim($(v).attr('data-product'))});
                    });
                    console.log(dataCommande);
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
                $scope.bonsorties = PostFactory.listBonSortie().then(function (bonsorties) {
                    $scope.bonsorties = bonsorties;
                    console.log(bonsorties);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.bonentrees = PostFactory.listBonEntree().then(function (bonentrees) {
                    $scope.bonentrees = bonentrees;
                    console.log(bonentrees);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.stocks = PostFactory.listStocks().then(function (stocks) {
                    $scope.stocks = stocks;
                    ////console.log(stocks);
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
//                        //console.log(stock);
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
//                        //console.log(emplacement);
                        $scope.listproduits = emplacement.EmplacementProduct;
                        $scope.listsousemplacements = emplacement.Sousemplacement;
//                        //console.log(emplacement.Sousemplacement);
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
//                        //console.log(sousemplacement);
                        $scope.listproduitssousemplacement = sousemplacement.SousemplacementProduct;
//                        //console.log(sousemplacement.SousemplacementProduct);
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
        .controller('TvaController', function ($scope, $http, $timeout, $interval, $location, PostFactory, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.tvas = PostFactory.listTva().then(function (tvas) {
                    $scope.tvas = tvas;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.NewPrice = function () {
                    setTimeout(function () {
                        var price = parseFloat($("#PU").val());
                        var tva = parseFloat($("#NewTva :selected").attr('data-tva'));
                        var prix_unit = parseFloat(price * (1 + tva / 100)).toFixed(3);
                        $("#ttc").val(prix_unit);
                    }, 300);
                };
                $scope.ajoutTva = function ($event) {
                    $event.preventDefault();
                    var dataTva = {
                        Tva: {
                            name: $("#nom").val(),
                            value: $("#value").val()
                        }
                    };
                    $scope.tva = PostFactory.ajoutTva(dataTva).then(function (tva) {
                        $scope.tva = tva;
                        $location.path('/gestion-taxes');
                        toastr.success(tva.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.tva = PostFactory.viewTva(id).then(function (tva) {
                        $scope.tva = tva;
                    });
                    $scope.editTva = function ($event) {
                        $event.preventDefault();
                        $scope.tva = PostFactory.editTva($scope.tva).then(function (tva) {
                            if (tva.type === 'success') {
                                $location.path('/gestion-taxes');
                                toastr.success(tva.text);
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
        // controller Famille
        .controller('FamilleController', function ($scope, $http, $timeout, $interval, $location, PostFactory, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.familles = PostFactory.listFamille().then(function (familles) {
                    $scope.familles = familles;
                }, function (msg) {
                    alert(msg);
                });
                $scope.productsfamille = null;
                $scope.changeFamilleID = function () {
                    var id = $scope.familleID;
                    console.log(id);
                    var dataProduct = {
                        Product: {
                            id: $scope.familleID
                        }};
                    $scope.productsfamille = PostFactory.listProductsFamille(dataProduct).then(function (productsfamille) {
                        $scope.productsfamille = productsfamille;
//                        console.log(productsfamille);
                    }, function (msg) {
                        alert(msg);
                    });
                };
                $scope.ajoutFamille = function ($event) {
                    $event.preventDefault();
                    var dataFamille = {
                        Famille: {
                            name: $("#nom").val()
                        }};
                    $scope.famille = PostFactory.ajoutFamille(dataFamille).then(function (famille) {
                        $scope.famille = famille;
                        $location.path('/gestion-familles');
                        toastr.success(famille.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };

                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.famille = PostFactory.viewFamille(id).then(function (famille) {
                        $scope.famille = famille;
                    });
                    $scope.editFamille = function ($event) {
                        $event.preventDefault();
                        $scope.famille = PostFactory.editFamille($scope.famille).then(function (famille) {
                            if (famille.type === 'success') {
                                $location.path('/gestion-familles');
                                toastr.success(famille.text);
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
        // controller Condition de paiement
        .controller('CpController', function ($scope, $http, $timeout, $interval, $location, PostFactory, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.cps = PostFactory.listCp().then(function (cps) {
                    $scope.cps = cps;
                    //////console.log(cps);
                }, function (msg) {
                    alert(msg);
                }
                );
                $scope.ajoutCp = function ($event) {
                    $event.preventDefault();
                    var dataCp = {
                        Cp: {
                            payment_id: $("#paymentValue :selected").val(),
                            echeance: $("#echeance").val()
                        }};
                    $scope.cp = PostFactory.ajoutCp(dataCp).then(function (cp) {
                        $scope.cp = cp;
                        $location.path('/gestion-cps');
                        toastr.success(cp.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.cp = PostFactory.viewCp(id).then(function (cp) {
                        $scope.cp = cp;
                        //////console.log(cp);
                    });
                    $scope.editCp = function ($event) {
                        $event.preventDefault();
                        $scope.cp = PostFactory.editCp($scope.cp).then(function (cp) {
                            if (cp.type === 'success') {
                                $location.path('/gestion-cps');
                                toastr.success(cp.text);
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
        // controller Unite
        .controller('UniteController', function ($scope, $http, $timeout, $interval, $location, PostFactory, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.unites = PostFactory.listUnite().then(function (unites) {
                    $scope.unites = unites;
                }, function (msg) {
                    alert(msg);
                }
                );
                $scope.ajoutUnite = function ($event) {
                    $event.preventDefault();
                    var dataUnite = {
                        Unite: {
                            name: $("#nom").val()
                        }};
                    $scope.unite = PostFactory.ajoutUnite(dataUnite).then(function (unite) {
                        $scope.unite = unite;
                        $location.path('/gestion-unites');
                        toastr.success(unite.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.unite = PostFactory.viewUnite(id).then(function (unite) {
                        //////console.log(unite);
                        $scope.unite = unite;
                    });
                    $scope.editUnite = function ($event) {
                        $event.preventDefault();
                        $scope.unite = PostFactory.editUnite($scope.unite).then(function (unite) {
                            if (unite.type === 'success') {
                                $location.path('/gestion-unites');
                                toastr.success(unite.text);
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
        .controller('FournisseurController', function ($scope, $http, $timeout, $interval, $location, PostFactory, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.fournisseurs = PostFactory.listFournisseur().then(function (fournisseurs) {
                    $scope.fournisseurs = fournisseurs;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.ajoutFournisseur = function ($event) {
                    $event.preventDefault();
                    var dataFournisseur = {
                        Fournisseur: {
                            name: $("#nom").val(),
                            phone: $("#phone").val(),
                            email: $("#email").val(),
                            adresse: $("#Adresse").val(),
                            tva: $("#TVA").val(),
                            rib: $("#RIB").val(),
                            infos: $("#infos").val()
                        }
                    };
                    $scope.fournisseur = PostFactory.ajoutFournisseur(dataFournisseur).then(function (fournisseur) {
                        $scope.fournisseur = fournisseur;
                        $location.path('/gestion-fournisseurs');
                        toastr.success(fournisseur.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.fournisseur = PostFactory.viewFournisseur(id).then(function (fournisseur) {
                        $scope.fournisseur = fournisseur;
                    });
                    $scope.editFournisseur = function ($event) {
                        $event.preventDefault();
                        $scope.fournisseur = PostFactory.editFournisseur($scope.fournisseur).then(function (fournisseur) {
                            if (fournisseur.type === 'success') {
                                $location.path('/gestion-fournisseurs');
                                toastr.success(fournisseur.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    };
                }
            } else {
                $location.path('/login');
            }
        })
        .controller('CategorieController', function ($scope, $http, $timeout, $interval, $location, PostFactory, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.categories = PostFactory.listCategory().then(function (categories) {
                    $scope.categories = categories;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.ajoutCategory = function ($event) {
                    $event.preventDefault();
                    var dataCategory = {
                        Category: {
                            name: $("#nom").val()
                        }
                    };
                    $scope.categorie = PostFactory.ajoutCategory(dataCategory).then(function (categorie) {
                        $scope.categorie = categorie;
                        $location.path('/gestion-categories');
                        toastr.success(categorie.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.categorie = PostFactory.viewCategory(id).then(function (categorie) {
                        $scope.categorie = categorie;
                    });
                    $scope.editCategory = function ($event) {
                        $event.preventDefault();
                        $scope.categorie = PostFactory.editCategory($scope.categorie).then(function (categorie) {
                            if (categorie.type === 'success') {
                                $location.path('/gestion-categories');
                                toastr.success(categorie.text);
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
        .controller('PaymentsController', function ($scope, $http, $timeout, $interval, PostFactory, $cookieStore, $location) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.payments = PostFactory.listPayments().then(function (payments) {
                    $scope.payments = payments;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
//                $scope.ajoutPayment = function ($event) {
//                    $event.preventDefault();
//                    var dataPayment = {
//                        Payment: {
//                            name: $("#nom").val()
//                        }
//                    };
//                    $scope.paiement = PostFactory.ajoutPayment(dataPayment).then(function (paiement) {
//                        $scope.paiement = paiement;
//                        $location.path('/gestion-paiements');
//                        toastr.success(paiement.text);
//                    },
//                            function (msg) {
//                                alert(msg);
//                            });
//                };
//                var id = parseInt($location.path().split('/')[2]);
//                if (id) {
//                    $scope.paiement = PostFactory.viewPayment(id).then(function (paiement) {
//                        $scope.paiement = paiement;
//                    });
//                    $scope.editPayment = function ($event) {
//                        $event.preventDefault();
                //                        $scope.paiement = PostFactory.editPayment($scope.paiement).then(function (paiement) {
                //                            if (paiement.type === 'success') {
//                                $location.path('/gestion-paiements');
                //                                toastr.success(paiement.text);
                //                            }
//                        },
                //                                function (msg) {
//                                    alert(msg);
                //                                }
                //                        );
                //                    };
//                }
            } else {
                $location.path('/login');
            }
        })
        .controller('NotificationsController', function ($scope, $http, $timeout, $interval, PostFactory, $cookieStore, $location) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.notifications = PostFactory.listNotifications().then(function (notifications) {
                    $scope.notifications = notifications;
                    //////console.log(notifications);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            } else {
                $location.path('/login');
            }
        })
        .controller('ScrollController', ['$scope', '$location', '$anchorScroll',
            function ($scope, $location, $anchorScroll) {
                $scope.gotoBottom = function () {
                    // set the location.hash to the id of
                    // the element you wish to scroll to.
                    $location.hash('bottom');
                    // call $anchorScroll()
                    $anchorScroll();
                };
            }])
        .controller('BonsController', function ($scope, $http, $timeout, $interval, PostFactory, $cookieStore, $location) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.bonValide = "true";
                $scope.bonInValide = "false";
                $scope.editBon = function (valide, id, index) {
                    var commande_id = parseInt($location.path().split('/')[2]);
                    var DataBon = {
                        Bon: {
                            id: id,
                            avoir: valide,
                            qte_avoir: $("#listItem tr").eq(index).find('#qte_avoir').val(),
                            commande_id: commande_id
                        }
                    };
                    var qte = parseFloat($("#listItem tr").eq(index).find('#Qte').text());
                    if (parseFloat($("#listItem tr").eq(index).find('#qte_avoir').val()) > qte) {
                        toastr.info("Quantité en avoir du produit est supérieure à la Quantité initiale");
                    } else if ($("#listItem tr").eq(index).find('#qte_avoir').val() === "") {
                        toastr.info("Veuillez mettre une qte avant");
                    } else {
                        $scope.bon = PostFactory.editBon(DataBon).then(function (bon) {
                            $scope.bon = bon;
                            if (bon.type === 'success') {
                                toastr.success(bon.text);
                            }

                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    }
                };
            } else {
                $location.path('/login');
            }
        })
        .controller('CommandeController', function ($scope, $http, $timeout, $interval, PostFactory, $location, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
//                $scope.checkboxModel = {
//                    value1: false
//                };
//                $scope.checkbox = 0;
//                $scope.$watch(function () {
//                    return $scope.checkbox;
//                }, function () {
//                    $scope.checkbox = Number($scope.checkbox);
//                }, true);
                $scope.editcommandeClient = function () {
                    var currentValidate = $("#editcommandeClient").text().toString().replace(" ", "").replace(",", ".");
                    //console.log(currentValidate);
                    if (currentValidate !== "") {
//                        $("#editcommandeClient").html("<input type='text' id='newValidateCommande' ng-keypress='newValidateCommande($event)' value='" + currentValidate + "' />");
//                        $("#editcommandeClient").html('<input type="text" id="newValidateCommande" class="form-control" placeholder="Nouveau contre rembourcement" value="' + currentValidate + '" style="width: 100%;" ng-model="oldValue" ng-keypress="newValidateCommande($event)">');
                        $("#editcommandeClient").html('<input type="number" id="newValidateCommande" class="form-control" placeholder="Nouveau contre rembourcement" value="' + parseFloat(currentValidate) + '" style="width: 100%;margin-top: -10px;margin-left: 10px;position: relative;">');
                        setTimeout(newValidateCommande, 1000);
                    }
                };
                function newValidateCommande() {
                    $("input#newValidateCommande").on('keypress', function (e) {
                        //e.stopPropagation();
                        var code = e.keyCode || e.which;
                        if (code == 13) {
                            //Enter keycode
                            var newMontant = $("input#newValidateCommande").val();
                            //console.log(newMontant);
                            var montantParsed = 0;
                            if (newMontant.search(" ") != -1 && newMontant.search(",") != -1) {
                                montantParsed = newMontant;
                            } else if (newMontant.search(" ") != -1) {
                                montantParsed = parseFloat(newMontant.replace(/ /g, ""));
                            } else if (newMontant.search(",") != -1) {
                                montantParsed = parseFloat(newMontant.replace(",", "."));
                            } else {
                                montantParsed = parseFloat(newMontant.replace(",", ".").replace(/ /g, ""));
                            }
                            if (newMontant == '') {
                                toastr.success('Ce champ est oligatoire');
                            } else {
                                $("input#newValidateCommande").remove();
                                $("strong#editcommandeClient").text(parseFloat(newMontant).toFixed(3));
                                setTimeout(function () {
                                    console.clear();
                                    //console.log(montantParsed);
                                    var id = parseInt($location.path().split('/')[2]);
                                    var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                                    if (id) {
                                        var dataCommande = {
                                            Commande: {
                                                id: id,
                                                mantant: montantParsed,
                                                user_id: Auth.user_id
                                            }
                                        };
                                        PostFactory.editCommandeTransport(dataCommande).then(function (commande) {
                                            if (commande.type === "success") {
                                                toastr.success(commande.text);
                                            }
                                        },
                                                function (msg) {
//                                                    alert(msg);
                                                });
                                    }
                                }, 100);
                            }
                        }
                    });
                }
//                $scope.newValidateCommande = function (keyEvent) {
//                    keyEvent.stopPropagation();
//                    //console.log('Enter keycode');
//                    if (keyEvent.which === 13) { //Enter keycode
//                        var newValidate = $("input#newValidateCommande").val();
//                        if (newValidate == '') {
//                            toastr.success('Ce champ est oligatoire');
//                        } else {
//                            $("input#newValidateCommande").parent().html(newValidate);
//                        }
//                    }
//                };
                $scope.commandes = PostFactory.listCommandes().then(function (commandes) {
                    $scope.closeUrl = base_url() + "assets/pages/img/close_pop.png";
                    $scope.commandes = commandes;
                    //////console.log(commandes);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.listblavoir = PostFactory.listBLAvoir().then(function (listblavoir) {
                    $scope.closeUrl = base_url() + "assets/pages/img/close_pop.png";
                    $scope.listblavoir = listblavoir;
//                    console.log(listBLAvoir);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                //list commandes achat
                $scope.commandesachat = PostFactory.listCommandesAchat().then(function (commandesachat) {
                    $scope.closeUrl = base_url() + "assets/pages/img/close_pop.png";
                    $scope.commandesachat = commandesachat;
                    ////console.log(commandesachat);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                //list commandes achat
                $scope.demandesprix = PostFactory.listDemandePrix().then(function (demandesprix) {
                    $scope.closeUrl = base_url() + "assets/pages/img/close_pop.png";
                    $scope.demandesprix = demandesprix;
                    ////console.log(commandesachat);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                //list bon réception
                $scope.bonreceptions = PostFactory.listBonReception().then(function (bonreceptions) {
                    $scope.closeUrl = base_url() + "assets/pages/img/close_pop.png";
                    $scope.bonreceptions = bonreceptions;
                    //console.log(bonreceptions);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // groupe bl en une facture
//                $scope.changeBl = function () {
//                    setTimeout(function () {
//                        //console.log('change');
//                        //console.log($("#CheckedBox").val());
//                        //console.log($(this).attr('value'));
//                        //console.log($(this).attr('value'));
//                        //console.log($(this).parent().parent().parent().attr('data-user'));
//                    });
//                };
                $("#listBL").on('change', "#CheckedBox", function () {
                    //console.log('change');
                    //console.log($("#CheckedBox").val());
                    //console.log($(this).attr('value'));
                    //console.log($(this).attr('value'));
                    //console.log($(this).parent().parent().parent().attr('data-user'));
                });
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
                // confirmer commande d'achat (bl)
                // edit commande achat
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.confirmCommandeAchat = function ($event, $val) {
                        $event.preventDefault();
                        var dataFacture = {
                            Commande: {
                                id: id,
                                valeur: $val
                            },
                            Bon: []
                        };
                        $('tr#itemCommandeAchat').each(function (i, v) {
                            dataFacture.Bon.push({bon_id: parseInt($(v).attr('data-bon')), product_id: parseInt($(v).attr('data-data-id')), qte: $(v).children().eq(1).children().children().eq(1).val(), qte_recue: $(v).children().eq(2).children().children().eq(1).val(), remise: $(v).children().eq(3).children().children().eq(1).val(), last_unit_price: $(v).children().eq(4).children().children().eq(1).val()});
                        });
                        $scope.blAchat = PostFactory.confirmCommandeAchat(dataFacture).then(function (blAchat) {
                            $scope.blAchat = blAchat;
//                            $("#commande-produit").empty();
                            if (blAchat.type == "success") {
                                toastr.success(blAchat.text);
//                            ////console.log(commandeAchat.lastId);
                                if ($val == 0) {
                                    $location.path("/gestion-commandes-achat");
                                } else {
                                    $location.path("/gestion-bon-reception");
                                }
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    };
                    // générer facture d'achat
                    $scope.generateFactureAchat = function ($event) {
                        $event.preventDefault();
                        var acompte = $('#acompte').val();
                        if ($('#acompte').val() == '') {
                            acompte = 0;
                        }
                        var dataFacture = {
                            Commande: {
                                id: id,
                                acompte: acompte,
                                payment_id: $('#paymentValue :selected').val()
                            },
                            Bon: []
                        };
                        $('tr#itemCommandeAchat').each(function (i, v) {
                            dataFacture.Bon.push({bon_id: parseInt($(v).attr('data-bon')), product_id: parseInt($(v).attr('data-data-id')), qte: $(v).children().eq(1).children().children().eq(1).val(), qte_recue: $(v).children().eq(2).children().children().eq(1).val(), remise: $(v).children().eq(3).children().children().eq(1).val(), last_unit_price: $(v).children().eq(4).children().children().eq(1).val()});
                        });
                        if ($('#paymentValue :selected').val() == '') {
                            toastr.error('Veillez mettre le mode de paiement');
                        } else {
                            $scope.factureAchat = PostFactory.generateFactureAchat(dataFacture).then(function (factureAchat) {
                                $scope.factureAchat = factureAchat;
                                if (factureAchat.type == "success") {
                                    toastr.success(factureAchat.text);
                                    $location.path("/gestion-factures-achat");
                                }
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        }
                    };
                    // générer facture d'achat avec bon de réception
                    $scope.generateFactureBRAchat = function ($event) {
                        $event.preventDefault();
                        var acompte = $('#acompte').val();
                        if ($('#acompte').val() == '') {
                            acompte = 0;
                        }
                        var dataFacture = {
                            Commande: {
                                id: id,
                                acompte: acompte,
                                payment_id: $('#paymentValue :selected').val()
                            },
                            Bon: []
                        };
                        $('tr#itemCommandeAchat').each(function (i, v) {
                            dataFacture.Bon.push({bon_id: parseInt($(v).attr('data-bon')), product_id: parseInt($(v).attr('data-data-id')), qte: $(v).children().eq(1).children().children().eq(1).val(), qte_recue: $(v).children().eq(2).children().children().eq(1).val(), remise: $(v).children().eq(3).children().children().eq(1).val(), last_unit_price: $(v).children().eq(4).children().children().eq(1).val()});
                        });
                        if ($('#paymentValue :selected').val() == '') {
                            toastr.error('Veillez mettre le mode de paiement');
                        } else {
                            $scope.factureAchat = PostFactory.generateFactureBRAchat(dataFacture).then(function (factureAchat) {
                                $scope.factureAchat = factureAchat;
                                if (factureAchat.type == "success") {
                                    toastr.success(factureAchat.text);
                                    $location.path("/gestion-factures-achat");
                                }
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        }
                    };
                }
                // change qte achat
                $scope.QteAchat = function () {
//                    //console.log('change qte ');
                    var qte = $("#Qte").val();
//                    //console.log(qte);
                    var price = parseFloat($("#combobox :selected").attr('data-price'));
//                    //console.log(price);
                    var price_unit = price * qte;
                    $('#Prix_Unitaire').val(parseFloat(price_unit).toFixed(3));
                };
                // end change qte achat
//                $scope.choixFournisseur = $("#fournisseurID :selected").val();
                // end confirmer commande d'achat
                $scope.finalisees = PostFactory.listCommandesFinalisee().then(function (finalisees) {
                    $scope.finalisees = finalisees;
                    //console.log(finalisees);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                var id = parseInt($location.path().split('/')[2]);
                var dataFactureBL = {
                    Commande: {
                        user_id: id
                    }
                };
                $scope.nonpayees = PostFactory.listBLNonPayee(dataFactureBL).then(function (nonpayees) {
                    $scope.nonpayees = nonpayees;
//                    console.clear();
                    //////console.log(nonpayees);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
//                $scope.checkboxModel = {
//                    value1: false
//                };
                // start list commande in costum user
                var id = parseInt($location.path().split('/')[2]);
                var dataUser = {
                    Commande: {
                        user_id: id
                    }
                };
                $scope.commandesuser = PostFactory.listUserCommande(dataUser).then(function (commandesuser) {
                    $scope.commandesuser = commandesuser;
                    //////console.log(commandesuser);
                    var total_ht = 0;
                    var total_ttc = 0;
                    var ttc = 0;
                    var ht = 0;
                    $(commandesuser).each(function (i, v) {
                        $(v.Bon).each(function (index, value) {
                            var qte = value.qte;
                            if (value.qte_recue != 0) {
                                qte = value.qte_recue;
                            }
                            total_ht = total_ht + parseFloat(value.last_unit_price) * qte;
                            total_ttc = total_ttc + (parseFloat(value.last_unit_price) * (1 + value.Product.Tva.value / 100) * (1 - value.remise / 100) * qte);
                        });
                        ttc = ttc + (total_ttc * (1 - v.Commande.remise_globale / 100));
                        ht = ht + total_ht;
                    });
                    $scope.ht = ht;
                    $scope.ttc = ttc;
                    var total_reglement = 0;
                    var regle = 0;
                    $(commandesuser).each(function (i, v) {
                        $(v.Reglement).each(function (index, valeur) {
                            regle = regle + parseFloat(valeur.value);
                        });
                    });
                    total_reglement = total_reglement + regle;
                    $scope.total_reglement = total_reglement;
                    $scope.total_restee = ttc - total_reglement;
                    var ReglementData = {
                        Data: []
                    };
                    $(commandesuser).each(function (i, v) {
                        $(v.Reglement).each(function (index, valeur) {
                            ReglementData.Data.push({id: valeur.id, ref: v.Commande.ref, type: valeur.type, numero: valeur.numero, date: valeur.date, value: valeur.value, valide: valeur.valide});
                        });
                    });
                    $scope.dataRegle = ReglementData.Data;
                    $scope.regleValide = "true";
                    $scope.regleInValide = "false";
//                $scope.checkStuff = function (valide, id) {
////                    alert("Valide : " + valide + " - ID : " + id);
//                }
                    $scope.checkStuff = function (valide, id) {
                        var DataRegle = {
                            Reglement: {
                                id: id,
                                valide: valide
                            }
                        };
                        $scope.reglement = PostFactory.checkStuff(DataRegle).then(function (reglement) {
                            $scope.reglement = reglement;
                            if (reglement.type === 'success') {
                                toastr.success(reglement.text);
                            }

                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // end list commande in costum user
                $scope.deleteBon = function (index, id) {
                    //                    //////console.log(index);
                    //                    //////console.log(id);
                    var dataBon = {
                        Bon: {
                            id: id
                        }
                    };
                    $scope.bon = PostFactory.deleteBon(dataBon).then(function (bon) {
                        $scope.bon = bon;
                        setTimeout(function () {
                            totalDevis();
                        }, 300);
//                        setTimeout(function () {
//                            var total_ht = 0;
//                            var total_ttc = 0;
//                            var indicateur = 0;
//                            $('tr#itemProduct').each(function (i, v) {
//                                total_ht = total_ht + parseFloat($(v).children().eq(6).text().replace(" ", ""));
//                                ////console.log(total_ht);
//                                total_ttc = total_ttc + parseFloat($(v).children().eq(7).text().replace(" ", ""));
//                                indicateur = indicateur + (parseFloat($(v).attr('data-priceprod')) - parseFloat($(v).attr('data-achat'))) * parseFloat($.trim($(v).children().eq(4).text()));
////                                    total_ht = total_ht + $(v).children().eq(6).attr('data-ttc');
////                                    total_ttc = total_ttc + $(v).children().eq(7).attr('data-ht');
//                            });
//                            $scope.total_ttc = total_ttc;
//                            $scope.indicateur = indicateur;
//                            ////console.log(parseFloat(indicateur));
//                            $scope.total_ht = total_ht;
//                            ////console.log(total_ht);
//                            var timbre = parseFloat($("#timbre_fiscale").text());
//                            $('#total_ttc').text(total_ttc.toFixed(3));
//                            $('#total_ht').text(total_ht.toFixed(3));
//                            var remiseGlobal = parseFloat($("#remiseglobale").text());
//                            var finalIndic = parseFloat(indicateur) - parseFloat($("#remiseglobale").text());
//                            ////console.log(finalIndic);
//                            $('#Indicateur').text(parseFloat(finalIndic).toFixed(3));
//                            var remiseTotal = parseFloat($("#RemiseGlob").val());
//                            $('#remiseglobale').text(total_ttc * remiseTotal / 100);
//                            ////console.log(remiseTotal);
//                            $('#net_ttc').text((total_ttc - remiseGlobal + timbre).toFixed(3));
//                        }, 500);
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.commande = PostFactory.showCommande(id).then(function (commande) {
                        $scope.commande = commande;
                        ////console.log(commande);
                        // filter tva
                        $scope.tvas = PostFactory.listTva().then(function (tvas) {
                            $scope.tvas = tvas;
//                            ////console.log(tvas);
                            var TableTVA = {
                                TVA: [],
                                TVAACHAT: []
                            };
                            $(tvas).each(function (i, v) {
                                var mantant_tva = 0;
                                var base_ht = 0;
                                var base_ht_achat = 0;
                                var mantant_tva_achat = 0;
                                $(commande.Bon).each(function (index, value) {
                                    if (value.Product.Tva.id === v.Tva.id) {
                                        base_ht = base_ht + parseFloat(value.last_unit_price) * parseFloat(value.qte) * (1 - value.remise / 100) * (1 - commande.Commande.remise_globale / 100);
                                        mantant_tva = mantant_tva + parseFloat(value.last_unit_price) * parseFloat(value.qte) * (1 - parseFloat(value.remise) / 100) * (1 - parseFloat(commande.Commande.remise_globale) / 100) * value.Product.Tva.value / 100;
                                        // bon reception
                                        base_ht_achat = base_ht_achat + parseFloat(value.last_unit_price) * parseFloat(value.qte_recue) * (1 - value.remise / 100) * (1 - commande.Commande.remise_globale / 100);
                                        mantant_tva_achat = mantant_tva_achat + parseFloat(value.last_unit_price) * parseFloat(value.qte_recue) * (1 - parseFloat(value.remise) / 100) * (1 - parseFloat(commande.Commande.remise_globale) / 100) * value.Product.Tva.value / 100;
                                    }
                                });
                                TableTVA.TVA.push({price: parseFloat(base_ht).toFixed(3), tva: v.Tva.name, mantant: mantant_tva.toFixed(3)});
                                // bon reception
                                TableTVA.TVAACHAT.push({price: parseFloat(base_ht_achat).toFixed(3), tva: v.Tva.name, mantant: mantant_tva_achat.toFixed(3)});
                            });
//                            ////console.log(TableTVA.TVA);
                            var Taux = {
                                TVA: [],
                                TVAACHAT: []
                            };
                            var total_price_ht = 0;
                            var total_taux = 0;
                            $(TableTVA.TVA).each(function (i, v) {
                                if (v.price != 0.000 || v.price != '0.000') {
                                    Taux.TVA.push({price_ht: v.price, taux: v.tva, mantant: v.mantant});
                                }
                            });
                            $scope.taux = Taux.TVA;
                            // bon réception
                            var total_price_ht = 0;
                            var total_taux = 0;
                            $(TableTVA.TVAACHAT).each(function (i, v) {
                                if (v.price != 0.000 || v.price != '0.000') {
                                    Taux.TVAACHAT.push({price_ht: v.price, taux: v.tva, mantant: v.mantant});
                                }
                            });
                            $scope.tauxReception = Taux.TVAACHAT;
                            ////console.log(Taux.TVA);
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                        // end filter tva

                        // list payment for commande user
                        var id_iser = commande.User.id;
                        var dataPayment = {
                            Payment: {
                                id: id_iser
                            }};
                        $scope.paymentsusers = PostFactory.listPaymentsUser(dataPayment).then(function (paymentsusers) {
                            $scope.paymentsusers = paymentsusers.paymentsusers;
                            ////console.log(paymentsusers.paymentsusers);
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
                                if ($.inArray(v.Payment.id, dataPaymentUser.PaymentUser) === -1) {
                                    dataPaymentUser.Data.push({id: v.Payment.id, name: v.Payment.name, valide: true});
                                }
                            });
                            $scope.PaymentUser = dataPaymentUser.Data;
//                            ////console.log(dataPaymentUser.Data);
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                        // end list payment for commande.user
                        //                        $scope.commande.Commande.remise_globale = parseFloat(commande.Commande.remise_globale);
                        var date = commande.Commande.created;
                        $scope.formatCreated = {format: 'EEEE dd MMMM yyyy', date: date};
                        $scope.formatCreated1 = {format: 'dd/MM/yyyy', date: date};
                        var ref = commande.Commande.ref.toString();
                        var ref1 = ref.split('-')[0];
                        var ref2 = ref.split('-')[1];
                        var ref22 = ref.split('-')[2];
                        var ref23 = ref.split('-')[3];
                        //console.log(ref1);
                        //console.log(ref2);
                        //console.log(ref22);
                        //console.log(ref23);
                        var ref3 = ref1 + "-" + ref2 + "-" + ref22;
                        $scope.ref3 = ref3;
                        var count = ref.split('-')[3];
                        if (count.toString().length === 1) {
                            count = "000" + count.toString();
                        }
                        if (count.toString().length === 2) {
                            count = "00" + count.toString();
                        }
                        $scope.count = count;
                        var total_ht = 0;
                        var total_ht_net = 0;
                        var total_ttc = 0;
                        var total_tva = 0;
                        var remiseProduit = 0; //                        //////console.log(commande.Bon);
                        $(commande.Bon).each(function (index, value) {
                            var qte = value.qte;
                            if (value.qte_recue != 0) {
                                qte = value.qte_recue;
                            }
                            total_ht = total_ht + parseFloat(value.last_unit_price) * qte * (1 - value.remise / 100);
                            total_ht_net = total_ht_net + parseFloat(value.last_unit_price) * qte;
                            total_ttc = total_ttc + (parseFloat(value.last_unit_price) * (1 + value.Product.Tva.value / 100) * (1 - value.remise / 100) * qte);
                            total_tva = total_tva + (parseFloat(value.last_unit_price) * value.Product.Tva.value / 100 * (1 - value.remise / 100) * qte);
                            remiseProduit = remiseProduit + (parseFloat(value.last_unit_price) * value.remise / 100 * qte);
                        });
                        var total_ht_final = total_ht * (1 - (commande.Commande.remise_globale / 100));
                        var total_tva_final = total_tva * (1 - (commande.Commande.remise_globale / 100));
                        $scope.total_ht = total_ht * (1 - (commande.Commande.remise_globale / 100));
                        $scope.total_ht_net = total_ht_net;
                        $scope.total_tva = total_tva * (1 - (commande.Commande.remise_globale / 100));
                        $scope.remiseProduit = remiseProduit;
//                        //////console.log(remiseProduit);
                        //                var total_ttc = total_ht * 1.18;
                        $scope.total_ttc = (parseFloat(total_ht_final) + parseFloat(total_tva_final)).toFixed(3);
                        var total_net = (parseFloat(total_ht_final) + parseFloat(total_tva_final) + parseFloat(commande.Commande.last_timbre_price)).toFixed(3);
                        var totalFinal = total_net.toString().split('.');
                        $scope.totalFinal = totalFinal;
                        ////console.log(total_net);
                        ////console.log(totalFinal);
                        $scope.totalFinalText = PostFactory.MoneyText(totalFinal.toString().replace(",", ".")).then(function (tft) {
                            //                            //////console.log(tft);
                            $scope.totalFinalText = tft;
                        });
                    });
                    $scope.editCommande = function ($event) {
                        $event.preventDefault();
                        var dataCommande = {
                            Commande: {
                                id: id,
                                remise_globale: $("#RemiseGlob").val(),
                                object: $("#Object").val(),
                                validate: $("#Validation").val(),
                                pourcentage: $("#Pourcentage").val(),
                                user_id: $("#SelectUser :selected").val(),
                                commerciale_id: $("#SelectUser :selected").attr('data-commerciale')
                            },
                            Bon: []
                        };
                        $('tr#itemProduct').each(function (i, v) {
                            dataCommande.Bon.push({bon_id: parseInt($(v).attr('data-bon')), product_id: parseInt($(v).attr('data-data-id')), last_unit_price: parseFloat($(v).children().eq(2).text()).toFixed(3), qte: $(v).children().eq(4).text(), remise: $(v).children().eq(5).text()});
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
                            $scope.commandesEdit = PostFactory.editCommande(dataCommande).then(function (commandesEdit) {
                                $scope.commandesEdit = commandesEdit;
                                $("#space-for-buttons").empty();
                                $("#total_ht").text("0");
                                $("#total_ttc").text("0");
                                $("#remiseglobale").text("0");
                                $("#net_ttc").text("0");
                                $("#space-for-buttons").empty();
                                $location.path("/gestion-commandes");
                                toastr.success(commandesEdit.text);
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        }
                    };
                }
                $scope.products = PostFactory.listProducts().then(function (products) {
                    $scope.products = products;
                    $scope.data = {
                        model: null,
                        products: products
                    };
                    console.log($scope.data);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.AddModifProduct = function () {
                    setTimeout(function () {
//                        if()
                        ////console.log('add product');
                    }, 300);
                };
                $scope.changeQte = function () {
                    setTimeout(function () {
                        var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                        var ht = parseFloat($('#combobox :selected').val());
                        var qte = parseInt($('#Qte').val());
                        $("#PU").val(ht.toFixed(3));
                        $("#ttc").val((tva * ht).toFixed(3));
                        //                        $("#Qte").focus();
                    }, 300);
                };
                $scope.initQte = function () {
                    $scope.qte = 0;
                    setTimeout(function () {
                        $scope.qte = "";
                    }, 500);
                };
                $scope.myFunc = function () {
                    setTimeout(function () {
                        $("#Qte").focus();
                        var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                        var ht = parseFloat($("#PU").val());
                        $("#ttc").val((tva * ht).toFixed(3));
                        $("#Qte").focus();
                    }, 300);
                };
                $scope.change = function () {
                    var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                    var ht = parseFloat($("#PU").val());
                    $("#ttc").val((tva * ht).toFixed(3));
                };
                $scope.remiseByProduct = "0";
                $scope.remiseGlobal = "0";
                $scope.passerCommande = function ($event) {
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
                        Bon: []
                    };
                    $('tr#itemProduct').each(function (i, v) {
                        dataCommande.Bon.push({product_id: parseInt($(v).attr('data-data-id')), last_unit_price: parseFloat($(v).children().eq(2).text()), qte: $(v).children().eq(4).text(), remise: $(v).children().eq(5).text()});
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
                        $scope.commandesAdd = PostFactory.passerCommande(dataCommande).then(function (commandesAdd) {
                            $scope.commandesAdd = commandesAdd;
                            $("#space-for-buttons").empty();
                            $("#total_ht").text("0");
                            $("#total_ttc").text("0");
                            $("#remiseglobale").text("0");
                            $("#net_ttc").text("0");
                            $("#space-for-buttons").empty();
                            toastr.success(commandesAdd.text);
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
                // generate facture in bl 
                var id = parseInt($location.path().split('/')[2]);
                $scope.genererFacture = function ($event) {
                    $event.preventDefault();
                    var dataFacture = {
                        Facture: {
                            user_id: id,
                            total_grouped: parseFloat($('#totalToPay').text()),
                            limit_date: $("#DateEcheance").val(),
                            numero: $("#numero").val(),
                            object: $("#Object").val(),
                            validate: $("#Validation").val(),
                            pourcentage: $("#Pourcentage").val(),
                            payment_id: $("#paymentValue :selected").val(),
                            type: $("#paymentValue :selected").text()
                        },
                        FactureProduct: []
                    };
                    $("tr#CommandeRows").each(function (index, value) {
                        var acompte = parseFloat($(value).children().eq(4).text());
                        if ($(value).children().eq(0).children().children().val() === true || $(value).children().eq(0).children().children().val() === "true") {
                            dataFacture.FactureProduct.push({id: parseInt($(value).attr('data-commande')), restant: parseFloat($(value).children().eq(5).text())});
                        }
                    });
                    $scope.generer = PostFactory.genererFacture(dataFacture).then(function (generer) {
                        $scope.generer = generer;
                        toastr.success(generer.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                $scope.config = PostFactory.showConfig().then(function (config) {
                    $scope.config = config;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.remiseglobale = function () {
                    totalDevis();
//                    var remise_product = 0;
//                    $('tr#itemProduct').each(function (i, v) {
//                        var ttc = parseFloat($(v).children().eq(3).text().replace(" ", ""))
//                        var qte = parseFloat($(v).children().eq(4).text().replace(" ", ""))
//                        var remise_net = parseFloat($(v).children().eq(5).text().replace(" ", ""))
//                        remise_product = remise_product + (ttc * qte * remise_net / 100);
//                    });
//
//                    var remise = parseFloat($("#RemiseGlob").val());
//                    var remiseglobale = parseFloat($('#total_ttc').text()) * remise / 100;
//                    var ttc = parseFloat($('#total_ttc').text());
//                    var timbre = parseFloat($("#timbre_fiscale").text());
//                    ////console.log(parseFloat(remise_product));
//                    $("#remiseglobale").text((remiseglobale + parseFloat(remise_product)).toFixed(3));
//                    var indicateur = parseFloat($('#Indicateur').text());
//                    ////console.log(indicateur);
//                    ////console.log('here');
//                    $('#Indicateur').text((parseFloat(parseFloat(indicateur) - parseFloat(remiseglobale))).toFixed(3));
//                    $("#net_ttc").text((ttc - remiseglobale + timbre).toFixed(3));
                }
                $("#space-for-buttons").on('click', "#deleteItem", function (e) {
                    e.preventDefault();
                    var total_ht = parseFloat($("#total_ht").text().replace(" ", ""));
                    var total_ttc = parseFloat($("#total_ttc").text().replace(" ", ""));
                    //                    var remise_globale = parseFloat($("total_ttc").text());
                    var ht = parseFloat($(this).parent().parent().children().eq(6).text().replace(" ", ""));
                    var ttc = parseFloat($(this).parent().parent().children().eq(7).text().replace(" ", ""));
                    var new_total_ht = total_ht - ht;
                    var new_total_ttc = total_ttc - ttc;
                    var new_remise_globale = new_total_ttc * parseFloat($('#RemiseGlob').val() / 100);
                    var new_net_ttc = new_total_ttc - new_remise_globale;
                    $(this).parent().parent().remove();
                    $("#total_ht").text(parseFloat(new_total_ht).toFixed(3));
                    $("#total_ttc").text(parseFloat(new_total_ttc).toFixed(3));
                    $("#remiseglobale").text(parseFloat(new_remise_globale).toFixed(3));
                    $("#net_ttc").text(parseFloat(new_net_ttc).toFixed(3));
                });
                //reglements
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.reglement = PostFactory.showReglement(id).then(function (reglement, ttc_reglement) {
                        $scope.reglement = reglement[0].Commandes;
                        var acompte = reglement[0].Commandes.Commande.acompte;
                        $scope.acompte = acompte;
                        $scope.ttc_reglement = parseFloat(reglement[0].Ttc_reglement) + parseFloat(acompte);
                        var ht_total = 0;
                        var ttc_total = 0;
                        //////console.log(reglement[0]);
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
                }
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
                            commande_id: parseInt($location.path().split('/')[2])
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
                            var id = parseInt($location.path().split('/')[2]);
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
                }
                ;
            } else {
                $location.path('/login');
            }
        })
        // Fiche client 
        .controller('FicheController', function ($scope, $http, $timeout, $interval, PostFactory, $location, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                var id = parseInt($location.path().split('/')[2]);
                var dataUser = {
                    Facture: {
                        user_id: id
                    }
                };
                $scope.facturesuser = PostFactory.listFactureUser(dataUser).then(function (facturesuser) {
                    $scope.facturesuser = facturesuser;
                    //////console.log(facturesuser);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            } else {
                $location.path('/login');
            }
        })
        // Controlleur Retenu à la source
        .controller('RetenusController', function ($scope, $http, $timeout, $interval, PostFactory, $location, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {

                $scope.retenus = PostFactory.listRetenusAchat().then(function (retenus) {
                    $scope.retenus = retenus;
                    ////console.log(retenus);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.retenu = PostFactory.viewRetenuAchat(id).then(function (retenu) {
                        $scope.retenu = retenu;
                        ////console.log(retenu);
                        var dataFacture = {
                            Data: []
                        };
                        $(retenu.Facture).each(function (i, v) {
                            var total_brut = 0;
                            $(v.Product).each(function (index, value) {
                                total_brut = total_brut + (parseFloat(value.FacturesProduct.last_unit_price) * (1 + value.Tva.value / 100) * (1 - value.FacturesProduct.remise / 100) * value.FacturesProduct.qte);
                            });
                            var retenu = parseFloat(total_brut) * 1.5 / 100;
                            var net_peyee = (parseFloat(total_brut) - parseFloat(retenu)).toFixed(3);
                            dataFacture.Data.push({id: v.id, code_facture: v.code_facture, created: v.created.split(" ")[0], total_brut: parseFloat(total_brut).toFixed(3), retenu: parseFloat(retenu).toFixed(3), net_peyee: net_peyee});
                        });
                        $scope.dataRetenu = dataFacture.Data;
                        ////console.log(dataFacture.Data);
                    });
                }
                $scope.config = PostFactory.showConfig().then(function (config) {
                    $scope.config = config;
                    ////console.log(config);
                    var matricule0 = config.Configuration.matricule_fiscale.split('/')[0];
                    var matricule1 = config.Configuration.matricule_fiscale.split('/')[1];
                    var code_tva = config.Configuration.matricule_fiscale.split('/')[2];
                    var code_category = config.Configuration.matricule_fiscale.split('/')[3];
                    var num_etab = config.Configuration.matricule_fiscale.split('/')[4];
                    ////console.log(matricule0 + matricule1);
                    $scope.matricule = matricule0 + matricule1;
                    ////console.log(code_tva);
                    $scope.code_tva = code_tva;
                    ////console.log(code_category);
                    $scope.code_category = code_category;
                    ////console.log(num_etab);
                    $scope.num_etab = num_etab;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            } else {
                $location.path('/login');
            }
        })
        // Fiche commerciale 
        .controller('FicheCommercialeController', function ($scope, $http, $timeout, $interval, PostFactory, $location, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                var id = parseInt($location.path().split('/')[2]);
                var dataUser = {
                    Commande: {
                        commerciale_id: id
                    }
                };
                $scope.commandescommerciale = PostFactory.listCommercialeCommande(dataUser).then(function (commandescommerciale) {
                    $scope.commandescommerciale = commandescommerciale;
                    ////console.log(commandescommerciale);
                    var total_ht = 0;
                    var total_ttc = 0;
                    var ttc = 0;
                    var ht = 0;
                    $(commandescommerciale).each(function (i, v) {
                        $(v.Bon).each(function (index, value) {
                            total_ht = total_ht + parseFloat(value.last_unit_price) * value.qte;
                            total_ttc = total_ttc + (parseFloat(value.last_unit_price) * (1 + value.Product.Tva.value / 100) * (1 - value.remise / 100) * value.qte);
                        });
                        ttc = ttc + (total_ttc * (1 - v.Commande.remise_globale / 100));
                        ht = ht + total_ht;
                    });
                    $scope.ht = ht;
                    $scope.ttc = ttc;
                    var total_reglement = 0;
                    var regle = 0;
                    $(commandescommerciale).each(function (i, v) {
                        $(v.Reglement).each(function (index, valeur) {
                            if (valeur.part == 0) {
                                var value_regle = valeur.value;
                            } else {
                                var value_regle = valeur.part;
                            }
                            ////console.log(value_regle);
                            regle = regle + parseFloat(value_regle);
                        });
                    });
                    total_reglement = total_reglement + regle;
                    $scope.total_reglement = total_reglement;
                    $scope.total_restee = ttc - total_reglement;
                    var ReglementData = {
                        Data: []
                    };
                    $(commandescommerciale).each(function (i, v) {
                        $(v.Reglement).each(function (index, valeur) {
                            var ifGrouped = "";
                            var value_regle = 0;
                            var factureID = valeur.facture_id;
                            var factureRef = "NO-REF";
                            var label = "success";
                            if (valeur.Facture.code_facture !== undefined) {
                                factureRef = valeur.Facture.code_facture;
                            }
                            if (valeur.part == 0) {
                                ifGrouped = "Non groupée";
                                value_regle = valeur.value;
                            } else {
                                ifGrouped = "Facture Groupée";
                                label = "info";
                                value_regle = valeur.part;
                            }
//                            ////console.log(value_regle);
                            ReglementData.Data.push({id: valeur.id, factureID: factureID, commandeID: valeur.commande_id, label: label, factureRef: factureRef, ifGrouped: ifGrouped, ref: v.Commande.ref, type: valeur.type, numero: valeur.numero, date: valeur.date, value: value_regle, valide: valeur.valide});
                        });
                    });
                    $scope.dataRegle = ReglementData.Data;
                    $scope.regleValide = "true";
                    $scope.regleInValide = "false";
//                $scope.checkStuff = function (valide, id) {
////                    alert("Valide : " + valide + " - ID : " + id);
//                }
                    $scope.checkStuff = function (valide, id) {
                        var DataRegle = {
                            Reglement: {
                                id: id,
                                valide: valide
                            }
                        };
                        $scope.reglement = PostFactory.checkStuff(DataRegle).then(function (reglement) {
                            $scope.reglement = reglement;
                            if (reglement.type === 'success') {
                                toastr.success(reglement.text);
                            }

                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.config = PostFactory.showConfig().then(function (config) {
                    $scope.config = config;
                    ////console.log(config);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // start prime commercial
                var id = parseInt($location.path().split('/')[2]);
                var dataCommercial = {
                    Commercial: {
                        commerciale_id: id
                    }
                };
                $scope.primecommercial = PostFactory.PrimeCommercial(dataCommercial).then(function (primecommercial) {
                    $scope.primecommercial = primecommercial;
                    ////console.log(primecommercial);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // end fiche commercil
                var dataCommerciale = {
                    Facture: {
                        commerciale_id: id
                    }
                };
                $scope.facturescommerciale = PostFactory.listCommercialeFacture(dataCommerciale).then(function (facturescommerciale) {
                    $scope.facturescommerciale = facturescommerciale;
                    //////console.log(facturescommerciale);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            } else {
                $location.path('/login');
            }
        })
        // Fiche Fournisseur
        .controller('FicheFournisseurController', function ($scope, $http, $timeout, $interval, PostFactory, $location, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                var id = parseInt($location.path().split('/')[2]);
                var dataFournisseur = {
                    Facture: {
                        fournisseur_id: id
                    }
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.facture = PostFactory.viewFacture(id).then(function (facture) {
                        $scope.facture = facture;
//                        //console.log(facture);
//                        $(facture.Product).each(function (i, v) {
//                            TableTVA.TVA.push({})
//                        });
                    });
                }
                if (id) {
                    $scope.reglement = PostFactory.showReglementFacture(id).then(function (reglement, ttc_reglement) {
                        $scope.reglement = reglement[0].Factures;
                        var acompte = reglement[0].Factures.Facture.acompte;
                        $scope.acompte = acompte;
                        $scope.ttc_reglement = parseFloat(reglement[0].Ttc_reglement) + parseFloat(acompte);
                        var ht_total = 0;
                        var ttc_total = 0;
                        //////console.log(reglement);
                        $(reglement[0].Factures.Product).each(function (index, value) {
                            ht_total = ht_total + parseFloat(value.FacturesProduct.last_unit_price) * value.FacturesProduct.qte;
                            ttc_total = ttc_total + (parseFloat(value.FacturesProduct.last_unit_price) * (1 + value.Tva.value / 100) * (1 - value.FacturesProduct.remise / 100) * value.FacturesProduct.qte);
                        });
                        $scope.ht_total = ht_total;
                        var total_ttc = ttc_total * (1 - reglement[0].Factures.Facture.remise_globale / 100);
                        $scope.ttc_total = total_ttc;
                        //////console.log(total_ttc);
                        var reste_regle = parseFloat(total_ttc - reglement[0].Ttc_reglement).toFixed(3);
                        $scope.url_image = base_url() + "assets/pages/img/paye.jpg";
                        $scope.reste_regle = reste_regle;
                        //////console.log(reste_regle);
                        $scope.int_rest_reglement = parseInt(reste_regle);
                        //////console.log(parseInt(reste_regle));
                    });
                }
                // liste facture de fournisseur 

                // passer reglement de fournisseur
                $scope.passerReglementFournisseur = function ($event) {
                    $event.preventDefault();
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
                            fournisseur_id: $("#raison_social_reglement").attr('data-fournisseur'),
                            isAchat: 1,
                            facture_id: parseInt($location.path().split('/')[2])
                        },
                        Retenus: {
                            mantant: $.trim($("#ttc_reglement").text().replace(" ", "").replace(",", "."))
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
                        $scope.reglement = PostFactory.passerReglementFournisseur(dataReglement).then(function (reglement) {
                            $scope.reglement = reglement;
                            toastr.success(reglement.text);
                            $location.path("/suivi-cheque");
                            var id = parseInt($location.path().split('/')[2]);
                            $scope.reglement = PostFactory.showReglementFacture(id).then(function (reglement, ttc_reglement) {
                                $scope.reglement = reglement[0].Factures;
                                var acompte = reglement[0].Factures.Facture.acompte;
                                $scope.acompte = acompte;
                                $scope.ttc_reglement = parseFloat(reglement[0].Ttc_reglement) + parseFloat(acompte);
                                var ht_total = 0;
                                var ttc_total = 0;
                                //////console.log(reglement);
                                $(reglement[0].Factures.Product).each(function (index, value) {
                                    ht_total = ht_total + parseFloat(value.FacturesProduct.last_unit_price) * value.FacturesProduct.qte;
                                    ttc_total = ttc_total + (parseFloat(value.FacturesProduct.last_unit_price) * (1 + value.Tva.value / 100) * (1 - value.FacturesProduct.remise / 100) * value.FacturesProduct.qte);
                                });
                                $scope.ht_total = ht_total;
                                var total_ttc = ttc_total * (1 - reglement[0].Factures.Facture.remise_globale / 100);
                                $scope.ttc_total = total_ttc;
                                //////console.log(total_ttc);
                                var reste_regle = parseFloat(total_ttc - reglement[0].Ttc_reglement).toFixed(3);
                                $scope.url_image = base_url() + "assets/pages/img/paye.jpg";
                                $scope.reste_regle = reste_regle;
                                $scope.int_rest_reglement = parseInt(reste_regle);
                                //////console.log(parseInt(reste_regle));
                            });
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
                $scope.facturesfournisseur = PostFactory.listFactureFournisseur(dataFournisseur).then(function (facturesfournisseur) {
                    $scope.facturesfournisseur = facturesfournisseur;
//                    ////console.log(facturesfournisseur);
                    var ttc = 0;
                    var ht = 0;
                    $(facturesfournisseur).each(function (i, v) {
                        var total_ttc = 0;
                        var total_ht = 0;
                        $(v.Product).each(function (index, value) {
                            total_ht = total_ht + parseFloat(value.FacturesProduct.last_unit_price) * value.FacturesProduct.qte;
                            total_ttc = total_ttc + (parseFloat(value.FacturesProduct.last_unit_price) * value.FacturesProduct.qte * (1 + value.Tva.value / 100) * (1 - value.FacturesProduct.remise / 100));
                        });
//                        ////console.log(total_ttc);
                        ttc = ttc + (total_ttc * (1 - v.Facture.remise_globale / 100));
//                        ////console.log(total_ht);
                        ht = ht + total_ht;
                    });
//                    $scope.total_ttc = total_ttc;
                    $scope.ht = ht;
                    $scope.ttc = ttc;
                    var total_reglement = 0;
                    var regle = 0;
                    $(facturesfournisseur).each(function (i, v) {
                        $(v.Reglement).each(function (index, valeur) {
                            if (valeur.part === 0 || valeur.part === "0") {
                                var valeur_regle = parseFloat(valeur.value);
                            } else {
                                var valeur_regle = parseFloat(valeur.part);
                            }
                            regle = regle + valeur_regle;
                        });
                    });
                    total_reglement = total_reglement + regle;
                    $scope.total_reglement = total_reglement;
                    $scope.total_restee = ttc - total_reglement;
                    var ReglementData = {
                        Data: []
                    };
                    $(facturesfournisseur).each(function (i, v) {
                        $(v.Reglement).each(function (index, valeur) {
                            ReglementData.Data.push({id: valeur.id, code_facture: v.Facture.code_facture, type: valeur.type, numero: valeur.numero, date: valeur.date, value: valeur.value, valide: valeur.valide, part: valeur.part});
                        });
                    });
                    $scope.dataRegle = ReglementData.Data;
                    $scope.regleValide = "true";
                    $scope.regleInValide = "false";
                    $scope.checkStuff = function (valide, id) {
                        var DataRegle = {
                            Reglement: {
                                id: id,
                                valide: valide
                            }
                        };
                        $scope.reglement = PostFactory.checkStuff(DataRegle).then(function (reglement) {
                            $scope.reglement = reglement;
                            if (reglement.type === 'success') {
                                toastr.success(reglement.text);
                            }

                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                    var AchatData = {
                        Facture: [],
                    };
                    $(facturesfournisseur).each(function (i, v) {
                        var total_achat_ttc = 0;
                        var total_achat_regle = 0;
                        $(v.Reglement).each(function (index, value) {
                            total_achat_regle = total_achat_regle + value.value;
                        });
                        $(v.Product).each(function (index, value) {
                            total_achat_ttc = total_achat_ttc + (parseFloat(value.FacturesProduct.last_unit_price) * value.FacturesProduct.qte * (1 + value.Tva.value / 100) * (1 - value.FacturesProduct.remise / 100));
                        });
                        var rastant_achat = parseFloat(total_achat_ttc) - parseFloat(total_achat_regle);
                        var lastTimbre = parseFloat(v.Facture.last_timbre_price);
                        var totalTtc = parseFloat(total_achat_ttc);
                        AchatData.Facture.push({id: v.Facture.id, code_facture: v.Facture.code_facture, retenu: v.Facture.retenu_id, name: v.Fournisseur.name, total_ttc: (lastTimbre + totalTtc).toFixed(3), total_reglee: parseFloat(total_achat_regle).toFixed(3), total_retant: parseFloat(rastant_achat).toFixed(3), created: v.Facture.created});
                    });
                    $scope.listachats = AchatData.Facture;
                    ////console.log(AchatData.Facture);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.groupedReglement = function ($event) {
                    var dataRegle = {
                        Reglement: []
                    };
                    var id = parseInt($location.path().split('/')[2]);
                    $("tr#CommandeRows").each(function (index, value) {
                        var acompte = parseFloat($(value).children().eq(4).text());
                        if ($(value).children().eq(0).children().children().val() === true || $(value).children().eq(0).children().children().val() === "true") {
                            dataRegle.Reglement.push({facture_id: parseInt($(value).attr('data-facture')), fournisseur_id: id, value: parseFloat($("#totalToPay").text().split(" ")[0]), part: parseFloat($(value).children().eq(5).text()), ref: $('#refReglement').val(), date: $("#DateReglement").val(), type: $("#paymentValue :selected").text()});
                        }
                    });
                    $scope.reglementgouped = PostFactory.groupedReglement(dataRegle).then(function (reglementgouped) {
                        $scope.reglementgouped = reglementgouped;
                        toastr.success(reglementgouped.text);
//                        $location.path("/gestion-factures");
                    },
                            function (msg) {
                                alert(msg);
                            });
                }
                ;
            } else {
                $location.path('/login');
            }
        })
        //Facture
        .controller('FacturesController', function ($scope, $http, $timeout, $interval, PostFactory, $location, $cookieStore, $compile) {
            if ($cookieStore.get('sessionConnected')) {
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
                // listes factures ventes
                $scope.factures = PostFactory.listFactures().then(function (factures) {
                    $scope.factures = factures;
                    ////console.log(factures);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // listes factures ventes avoir
                $scope.facturesavoir = PostFactory.listFacturesAvoir().then(function (facturesavoir) {
                    $scope.facturesavoir = facturesavoir;
                    ////console.log(facturesavoir);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // listes factures achats
                $scope.factures = PostFactory.listFacturesAchat().then(function (facturesAchat) {
                    $scope.facturesAchat = facturesAchat;
//                    //////console.log(facturesAchat);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.changeQte = function () {
                    setTimeout(function () {
                        var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                        var ht = parseFloat($('#combobox :selected').val());
                        //                        var qte = parseInt($('#Qte').val());
                        //                        //////console.log(ht);
                        $("#PU").val(ht.toFixed(3));
                        $("#ttc").val((tva * ht).toFixed(3));
                    }, 300);
                };
                $scope.myFunc = function () {
                    setTimeout(function () {
                        //////console.log('here');
                        $("#Qte").focus();
                        var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                        var ht = parseFloat($("#PU").val());
                        $("#ttc").val((tva * ht).toFixed(3));
                        $("#Qte").focus();
                    }, 300);
                };
                $scope.change = function () {
                    var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                    var ht = parseFloat($("#PU").val());
                    $("#ttc").val((tva * ht).toFixed(3));
                };
                $scope.changeRef = function () {
                    console.log($scope.refProduct);
                    var bon_id = $('#refValue :selected').val();
                    var bon_name = $('#refValue :selected').attr('data-product');
                    var qte = $('#refValue :selected').attr('data-qte');
                    $("#selectProduct :selected").val(bon_id);
                    $("#selectProduct :selected").text(bon_name);
                    $("#Qte").val(qte);
                    $("#groupProduct  .select2-selection__placeholder").html("<p style='color: #555;padding: 0;'>" + bon_name + "</p>");
                    setTimeout(function () {
                        $('#QteAvoir').focus();
                    }, 500);
                };
                $scope.changeProduct = function () {
                    console.log($scope.refProduct);
                    var bon_id = $('#selectProduct :selected').val();
                    var bon_ref = $('#selectProduct :selected').attr('data-ref');
                    var qte = $('#selectProduct :selected').attr('data-qte');
                    $("#refValue :selected").val(bon_id);
                    $("#refValue :selected").text(bon_ref);
                    $("#Qte").val(qte);
                    $("#groupRef  .select2-selection__placeholder").html("<p style='color: #555;padding: 0;'>" + bon_ref + "</p>");
                    setTimeout(function () {
                        $('#QteAvoir').focus();
                    }, 500);
                };
                $scope.appendarticleAvoir = function ($event) {
                    $event.preventDefault();
                    var product_ref = $("#refValue :selected").text();
                    var product_name = $("#selectProduct :selected").text();
                    var qte = $("#Qte").val();
                    var qte_avoir = $("#QteAvoir").val();
                    console.log(parseInt(qte));
                    console.log(parseInt(qte_avoir));
                    var listProduct = [];
                    $("#append-article-avoir tr").each(function (i, v) {
                        var p_name = $(v).children().eq(1).text();
                        listProduct.push(p_name);
                    });
                    console.log(listProduct);
                    var $items = $compile("<tr id='listAvoirArticle' data-data-id='" + $scope.refProduct + "'>\n\
                                            <td>" + product_ref + "</td>\n\
                                            <td>" + product_name + "</td>\n\
                                            <td>" + qte + "</td>\n\
                                            <td>" + qte_avoir + "</td>\n\
                                            <td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td>\n\
                                        </tr>")($scope);
                    if ($("#QteAvoir").val() == '') {
                        toastr.error("Veuillez mettre une qte d'avoir...");
                        $('#QteAvoir').focus();
                    } else if (parseInt(qte) < parseInt(qte_avoir)) {
                        toastr.error("Veuillez rectifier votre qte d'avoir...");
                        $('#QteAvoir').focus();
                    } else if ($.inArray(product_name, listProduct) !== -1) {
                        toastr.info("Produit déjà présent");
                    } else {
                        $('tbody#append-article-avoir').append($items);
                        $('input').val('');
                    }
                };
                $scope.appendavoirEnter = function (keyEvent) {
                    keyEvent.stopPropagation();
                    if (keyEvent.which === 13) {
                        var product_ref = $("#refValue :selected").text();
                        var product_name = $("#selectProduct :selected").text();
                        var qte = $("#Qte").val();
                        var qte_avoir = $("#QteAvoir").val();
                        console.log(parseInt(qte));
                        console.log(parseInt(qte_avoir));
                        var listProduct = [];
                        $("#append-article-avoir tr").each(function (i, v) {
                            var p_name = $(v).children().eq(1).text();
                            listProduct.push(p_name);
                        });
                        console.log(listProduct);
                        var $items = $compile("<tr id='listAvoirArticle' data-data-id='" + $scope.refProduct + "'>\n\
                                            <td>" + product_ref + "</td>\n\
                                            <td>" + product_name + "</td>\n\
                                            <td>" + qte + "</td>\n\
                                            <td>" + qte_avoir + "</td>\n\
                                            <td><div id='deleteItem' ng-click='removeItem()'><i style='cursor: pointer; color: #34aadc;' class='fa fa-times fa-2x'></i></div></td>\n\
                                        </tr>")($scope);
                        if ($("#QteAvoir").val() == '') {
                            toastr.error("Veuillez mettre une qte d'avoir...");
                            $('#QteAvoir').focus();
                        } else if (parseInt(qte) < parseInt(qte_avoir)) {
                            toastr.error("Veuillez rectifier votre qte d'avoir...");
                            $('#QteAvoir').focus();
                        } else if ($.inArray(product_name, listProduct) !== -1) {
                            toastr.info("Produit déjà présent");
                        } else {
                            $('tbody#append-article-avoir').append($items);
                            $('input').val('');
                        }
                    }
                };
                $scope.avoirArticle = function ($event) {
                    $event.preventDefault();
                    var id = parseInt($location.path().split('/')[2]);
                    var dataArticle = {
                        Facture: {
                            id: id
                        },
                        FactureProduct: []
                    };
                    $('tr#listAvoirArticle').each(function (i, v) {
                        dataArticle.FactureProduct.push({id: parseInt($(v).attr('data-data-id')), qte_avoir: $.trim($(v).children().eq(3).text())});
                    });
                    console.log(dataArticle);
                    if (dataArticle.FactureProduct.length == 0) {
                        toastr.error("Veuillez choisir au moin un produit en avoir...");
                    } else {
                        $scope.avoirarticle = PostFactory.avoirArticle(dataArticle).then(function (avoirarticle) {
                            $scope.avoirarticle = avoirarticle;
                            if (avoirarticle.type == 'success') {
                                $("tbody#append-article-avoir").empty();
                                $location.path('/gestion-factures-avoir');
                                toastr.success(avoirarticle.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                }
                $("tbody#append-article-avoir").on('click', "#deleteItem", function (e) {
                    e.preventDefault();
                    $(this).parent().parent().remove();
                });
                $scope.remiseglobale = function () {
                    totalDevis();
                };
                $("#space-for-buttons").on('click', "#deleteItem", function (e) {
                    e.preventDefault();
                    $(this).parent().parent().remove();
                    setTimeout(function () {
                        totalDevis();
                    }, 300);
                });
                // avoir facture
//                $scope.avoirValide = "true";
//                $scope.avoirInValide = "false";
                $scope.avoirFacture = function (id) {
                    var DataFacture = {
                        Facture: {
                            id: id,
                            avoir: $('#checkboxAvoir').val()
                        }
                    };
                    $scope.avoirfacture = PostFactory.avoirFacture(DataFacture).then(function (avoirfacture) {
                        $scope.avoirfacture = avoirfacture;
                        if (avoirfacture.type === 'success') {
                            toastr.success(avoirfacture.text);
                        }

                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                };
                // end avoir facture
                setTimeout(function () {
                    $scope.changeMargeAchat = function () {
                        setTimeout(function () {
                            var price_achat = parseFloat($("#Prix_Achat").val());
                            var marge = parseFloat($("#NewMarge").val());
                            var price_unit = parseFloat(price_achat * (1 + marge / 100)).toFixed(3);
                            $("#NewPrixUnit").val(price_unit);
                        }, 300);
                    };
                }, 1500);
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.facture = PostFactory.viewFacture(id).then(function (facture) {
                        $scope.facture = facture;
                        $scope.factureProducts = facture.Product;
                        console.log(facture.Product);
                        var TableProduct = {
                            Product: []
                        };
                        $(facture.Product).each(function (index, value) {
                            TableProduct.Product.push(value.code_barres);
                        });
                        $scope.listsRef = TableProduct.Product;
                        // filter tva
                        $scope.tvas = PostFactory.listTva().then(function (tvas) {
                            $scope.tvas = tvas;
//                            ////console.log(tvas);
                            var TableTVA = {
                                TVA: []
                            };
                            $(tvas).each(function (i, v) {
                                var mantant_tva = 0;
                                var base_ht = 0;
                                $(facture.Product).each(function (index, value) {
                                    if (value.Tva.id === v.Tva.id) {
                                        base_ht = base_ht + parseFloat(value.FacturesProduct.last_unit_price) * parseFloat(value.FacturesProduct.qte) * (1 - value.FacturesProduct.remise / 100) * (1 - facture.Facture.remise_globale / 100);
                                        mantant_tva = mantant_tva + parseFloat(value.FacturesProduct.last_unit_price) * parseFloat(value.FacturesProduct.qte) * (1 - parseFloat(value.FacturesProduct.remise) / 100) * (1 - parseFloat(facture.Facture.remise_globale) / 100) * v.Tva.value / 100;
                                    }
                                });
                                TableTVA.TVA.push({price: parseFloat(base_ht).toFixed(3), tva: v.Tva.name, mantant: mantant_tva.toFixed(3)});
                            });
//                            ////console.log(TableTVA.TVA);
                            var Taux = {
                                TVA: []
                            };
                            var total_price_ht = 0;
                            var total_taux = 0;
                            $(TableTVA.TVA).each(function (i, v) {
                                if (v.price != 0.000 || v.price != '0.000') {
                                    Taux.TVA.push({price_ht: v.price, taux: v.tva, mantant: v.mantant});
                                }
                            });
                            $scope.taux = Taux.TVA;
                            ////console.log(Taux.TVA);
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                        // end filter tva

                        var date = facture.Facture.created;
                        $scope.formatCreated = {format: 'EEEE dd MMMM yyyy', date: date};
                        var ref = facture.Facture.code_facture.toString();
                        //                        //////console.log(ref);
                        var ref1 = ref.split('-')[0];
                        var ref2 = ref.split('-')[1];
                        var ref3 = ref1 + "-" + ref2;
                        //                        //////console.log(ref3);
                        $scope.ref3 = ref3;
                        var count = ref.split('-')[2];
                        if (count.toString().length === 1) {
                            count = "000" + count.toString();
                        }
                        if (count.toString().length === 2) {
                            count = "00" + count.toString();
                        }
                        $scope.count = count;
                        var total_ht = 0;
                        var total_ht_net = 0;
                        var total_ttc = 0;
                        var total_tva = 0;
                        var remiseProduit = 0;
                        $(facture.Product).each(function (index, value) {
                            total_ht = total_ht + parseFloat(value.FacturesProduct.last_unit_price) * value.FacturesProduct.qte * (1 - value.FacturesProduct.remise / 100);
                            total_ht_net = total_ht_net + parseFloat(value.FacturesProduct.last_unit_price) * value.FacturesProduct.qte;
                            total_ttc = total_ttc + (parseFloat(value.FacturesProduct.last_unit_price) * (1 + value.Tva.value / 100) * (1 - value.FacturesProduct.remise / 100) * value.FacturesProduct.qte);
                            total_tva = total_tva + (parseFloat(value.FacturesProduct.last_unit_price) * value.Tva.value / 100 * (1 - value.FacturesProduct.remise / 100) * value.FacturesProduct.qte);
                            remiseProduit = remiseProduit + (parseFloat(value.FacturesProduct.last_unit_price) * value.FacturesProduct.remise / 100 * value.FacturesProduct.qte);
                        });
                        $scope.remiseProduit = remiseProduit;
                        var total_tva_final = total_tva * (1 - (facture.Facture.remise_globale / 100));
                        var total_ht_final = total_ht * (1 - (facture.Facture.remise_globale / 100));
                        $scope.total_tva = total_tva * (1 - (facture.Facture.remise_globale / 100));
                        $scope.total_ht = total_ht * (1 - (facture.Facture.remise_globale / 100));
                        $scope.total_ht_net = total_ht_net;
                        ////console.log(remiseProduit);
                        ////console.log(total_tva * (1 - (facture.Facture.remise_globale / 100)));
                        ////console.log(total_ht * (1 - (facture.Facture.remise_globale / 100)));
                        //                var total_ttc = total_ht * 1.18;
                        $scope.total_ttc = (parseFloat(total_ht_final) + parseFloat(total_tva_final)).toFixed(3);
                        var total_net = (parseFloat(total_ht_final) + parseFloat(total_tva_final) + parseFloat(facture.Facture.last_timbre_price)).toFixed(3);
                        var totalFinal = total_net.toString().split('.');
                        $scope.totalFinal = totalFinal;
                        ////console.log(total_net);
                        ////console.log(totalFinal);
                        $scope.totalFinalText = PostFactory.MoneyText(totalFinal.toString().replace(",", ".")).then(function (tft) {
                            //                            //////console.log(tft);
                            $scope.totalFinalText = tft;
                        });
                    });
                    $scope.facturecommandes = PostFactory.viewFactureCommande(id).then(function (facturecommandes) {
                        $scope.facturecommandes = facturecommandes;
                        //console.log(facturecommandes);
                        var dataFactureCommande = {
                            Livree: [],
                            Livree1: [],
                            Livree2: [],
                            Annulee: []
                        };
                        var totalColis = 0;
                        var totalFraisLivraison = 0;
                        var totalcontreRembourcement = 0;
                        var total_annulation = 0;
//                        var tot
                        $(facturecommandes.Facture).each(function (i, v) {
//                            console.log(v);
//                            console.log(i);
                            var qte = parseInt(v.Colis.length);
                            if (v.state == 'Livrée') {
                                var totalFrais = parseFloat(v.frais_livraison) * qte;
                                var mantant = parseFloat(v.frais_livraison).toFixed(3);
                                var totalHT = parseFloat(v.frais_livraison) * qte;
                                if (v.isContreRembourcement == true || v.isContreRembourcement == "true") {
//                                    mantant = parseFloat(v.mantant).toFixed(3);
//                                    totalHT = parseFloat(v.mantant) * qte;
//                                    totalcontreRembourcement += parseFloat(v.mantant) - parseFloat(v.User.frais_livraison);
                                    totalcontreRembourcement += parseFloat(v.mantant);
                                }
                                dataFactureCommande.Livree.push({code_facture: v.code_facture, qte: qte, montant: mantant, totalHT: parseFloat(totalHT).toFixed(3), isContreRembourcement: parseFloat(v.mantant).toFixed(3)});
                                if (i < 29) {
                                    dataFactureCommande.Livree1.push({code_facture: v.code_facture, qte: qte, montant: mantant, totalHT: parseFloat(totalHT).toFixed(3), isContreRembourcement: parseFloat(v.mantant).toFixed(3)});
                                }
                                if (i > 28) {
                                    dataFactureCommande.Livree2.push({code_facture: v.code_facture, qte: qte, montant: mantant, totalHT: parseFloat(totalHT).toFixed(3), isContreRembourcement: parseFloat(v.mantant).toFixed(3)});
                                }
                            }
                            if (v.state == 'Annulée') {
                                total_annulation += parseFloat(v.frais_annulation) * qte;
                                var totalFrais = parseFloat(v.frais_annulation) * qte;
//                                var qteAnnule = parseInt(v.Colis.length);
//                                //console.log(qteAnnule);
                                var totalHT = parseFloat(v.frais_annulation) * qte;
                                dataFactureCommande.Annulee.push({code_facture: v.code_facture, qte: qte, montant: parseFloat(v.frais_annulation).toFixed(3), totalHT: parseFloat(totalHT).toFixed(3)});
                            }

                            totalColis += parseFloat(totalHT);
                            totalFraisLivraison += parseFloat(totalFrais);
                        });
                        //console.log('totalcontreRembourcement');
                        $scope.totalcontreRembourcement = parseFloat(totalcontreRembourcement).toFixed(3);
                        var tt_ht = parseFloat(totalFraisLivraison) * (1 - facturecommandes.Tva.value / 100);
                        $scope.totalFraisLivraison = parseFloat(tt_ht).toFixed(3);
                        var totalTvaLivraison = parseFloat(totalFraisLivraison) * facturecommandes.Tva.value / 100;
                        $scope.totalTvaLivraison = parseFloat(totalTvaLivraison).toFixed(3);
                        var totalFraisLivraisonTTC = parseFloat(totalFraisLivraison) * (1 + facturecommandes.Tva.value / 100);
                        $scope.totalFraisLivraisonTTC = parseFloat(totalFraisLivraisonTTC).toFixed(3);
//                        var totalNet = parseFloat(totalColis) - parseFloat(facturecommandes.FacturesCommande.ajustement);
                        var totalNet = parseFloat(totalColis);
                        $scope.totalNet = parseFloat(totalNet);
                        $scope.totalColis = parseFloat(totalColis).toFixed(3);
                        //console.log(parseFloat(totalcontreRembourcement));
                        //console.log(parseFloat(totalNet));
                        //console.log(parseFloat(facturecommandes.FacturesCommande.ajustement));
                        var rembourser_client = parseFloat(totalcontreRembourcement) - parseFloat(totalNet) - parseFloat(facturecommandes.FacturesCommande.ajustement);
                        //console.log(parseFloat(rembourser_client));
//                        //console.log(parseFloat(config.Configuration.price_timbre));
                        $scope.rembourser_client = parseFloat(rembourser_client);
                        $scope.annulation = dataFactureCommande.Annulee;
                        $scope.livraison = dataFactureCommande.Livree;
                        $scope.livraison1 = dataFactureCommande.Livree1;
                        $scope.livraison2 = dataFactureCommande.Livree2;
                        console.log(dataFactureCommande.Livree);
                        console.log(dataFactureCommande.Livree1);
                        console.log(dataFactureCommande.Livree2);
//                        //console.log(dataFactureCommande.Annulee);
//                        var totalFinal1 = parseFloat(totalFraisLivraisonTTC) - parseFloat(facturecommandes.FacturesCommande.ajustement) + parseFloat(facturecommandes.FacturesCommande.last_timbre_price);
//                        var totalFinal = parseFloat(totalFinal1).toFixed(3);
                        var totalFinal1 = parseFloat(totalColis) + parseFloat(facturecommandes.FacturesCommande.last_timbre_price);
                        var totalFinal = parseFloat(totalFinal1).toFixed(3);
//                        //console.log(totalFinal);
                        $scope.totalFinalText = PostFactory.MoneyText(totalFinal.toString().replace(",", ".")).then(function (tft) {
                            $scope.totalFinalText = tft;
//                            //console.log(tft);
                        });
                    });
                }
                // ajout facture vente
                $scope.ajoutFacture = function ($event) {
                    $event.preventDefault();
                    var remise_globale = 0;
                    var acompte = 0;
                    if ($("#RemiseGlob").val() != '') {
                        remise_globale = $("#RemiseGlob").val();
                    }
                    if ($("#Accompte").val() != '') {
                        acompte = $("#RemiseGlob").val();
                    }
                    var dataFacture = {
                        Facture: {
                            acompte: acompte,
                            object: $("#Object").val(),
                            validate: $("#Validation").val(),
                            pourcentage: $("#Pourcentage").val(),
                            remise_globale: remise_globale,
                            user_id: $("#clientValue :selected").val(),
                            payment_id: $("#paymentValue :selected").val(),
                        },
                        FactureProduct: []
                    };
                    $('tr#itemProduct').each(function (i, v) {
                        dataFacture.FactureProduct.push({
                            product_id: parseInt($(v).attr('data-data-id')),
                            last_unit_price: parseFloat($(v).children().eq(2).text()),
                            qte: $(v).children().eq(4).text(),
                            remise: $(v).children().eq(5).text()
                        });
                    });
                    console.log(dataFacture.FactureProduct);
//                    $('tr#itemFactureProduct').each(function (i, v) {
//                        dataFacture.FactureProduct.push({product_id: parseInt($(v).attr('data-data-id')), last_unit_price: parseFloat($(v).attr('data-price')), qte: $(v).children().eq(1).text(), remise: $(v).children().eq(2).text()});
//                    });
                    if (dataFacture.FactureProduct.length == 0) {
                        toastr.error("Veuillez choisir au moin un produit...");
                    } else if ($("#clientValue :selected").val() === "") {
                        toastr.error("Veuillez Saisir un Client...");
                    } else if ($("#paymentValue :selected").val() === "") {
                        toastr.error("Veuillez Saisir un mode de paiement...");
                    } else if ($("#Object").val() === "") {
                        toastr.error("Veuillez Saisir un Objet...");
                    } else if ($("#Validation").val() === "") {
                        toastr.error("Veuillez Saisir une Validité...");
                    } else if ($("#Pourcentage").val() === "") {
                        toastr.error("Veuillez Saisir une Modalité...");
                    } else {
                        $scope.factureAdd = PostFactory.ajoutFacture(dataFacture).then(function (factureAdd) {
                            $scope.factureAdd = factureAdd;
                            $("#facture-produit").empty();
                            toastr.success(factureAdd.text);
                            $location.path("/gestion-factures");
                        },
                                function (msg) {
                                    alert(msg);
                                });

                    }
                };
                // ajout facture achat
                $scope.ajoutFactureAchat = function ($event) {
                    $event.preventDefault();
                    var dataFacture = {
                        Facture: {
                            limit_date: $("#DateEcheance").val(),
                            remise_globale: $("#Remise_Globale").val(),
                            fournisseur_id: $("#fournisseurID :selected").val(),
                            acompte: $("#Accompte").val(),
                            payment_id: $("#paymentValue :selected").val()
                        },
                        FactureProduct: []};
                    $('tr#itemFactureProduct').each(function (i, v) {
                        dataFacture.FactureProduct.push({product_id: parseInt($(v).attr('data-id')), last_unit_price: parseFloat($(v).attr('data-price')), prix_achat: $(v).children().eq(1).text(), qte: $(v).children().eq(2).text(), remise: $(v).children().eq(3).text()});
                    });
                    $scope.factureAdd = PostFactory.ajoutFactureAchat(dataFacture).then(function (factureAdd) {
                        $scope.factureAdd = factureAdd;
                        $("#facture-produit").empty();
                        toastr.success(factureAdd.text);
                        $location.path("/gestion-factures-achat");
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                $scope.config = PostFactory.showConfig().then(function (config) {
                    $scope.config = config;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $("#facture-produit").on('click', "#deleteItem", function (e) {
                    e.preventDefault();
                    $(this).parent().parent().remove();
                });
            } else {
                $location.path('/login');
            }
        }
        )
        .controller('DevisController', function ($scope, $http, $timeout, $interval, PostFactory, $location, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.commandes = PostFactory.listDevis().then(function (commandes) {
                    $scope.commandes = commandes;
                    //////console.log(commandes);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.deleteBon = function (index, id) {
                    //                    //////console.log(index);
                    //                    //////console.log(id);
                    var dataBon = {
                        Bon: {
                            id: id
                        }
                    };
                    //                        var indexRow = $("#DeleteFamille").attr('data-index');
                    $scope.bon = PostFactory.deleteBon(dataBon).then(function (bon) {
                        $scope.bon = bon;
                        setTimeout(function () {
                            totalDevis();
                        }, 300);
                    }, function (msg) {
                        alert(msg);
                    });
                };
                $scope.closeUrl = base_url() + "assets/pages/img/close_pop.png"
                // modif qte in devis
                $("#space-for-buttons").on('click', "#ModifQte", function (e) {
                    e.preventDefault();
                    var ancienHT = $(this).parent().children().eq(2).text();
                    var newHT = $(this).parent().children().eq(6);
                    $scope.ancienHT = ancienHT;
                    var ancienTTC = $(this).parent().children().eq(3).text();
                    var newTTC = $(this).parent().children().eq(7);
                    $scope.ancienTTC = ancienTTC;
                    $scope.NewQte = $(this).parent().children().eq(4).text();
                    var encienQte = $(this).parent().children().eq(4).text();
                    var ancienRemise = $(this).parent().children().eq(5).text();
                    var encienQte1 = $(this).parent().children().eq(4);
                    $scope.items = ['item1', 'item2', 'item3'];
                    $scope.animationsEnabled = true;
                    setTimeout(function () {
                        $('#NewQte').val(encienQte);
                    }, 300);
                    $("#login-box1.login-popup").show();
                    //Getting the variable's value from a link 
                    var loginBox = $(this).attr('href');
                    //Fade in the Popup 
                    $(loginBox).fadeIn(300);
                    //Set the center alignment padding + border see css style
                    var popMargTop = ($(loginBox).height() + 24) / 2;
                    var popMargLeft = ($(loginBox).width() + 24) / 2;
                    $(loginBox).css({
                        'margin-top': -popMargTop,
                        'margin-left': -popMargLeft
                    });
                    // Add the mask to body
                    $('body').append('<div id="mask"></div>');
                    $('#mask').fadeIn(300);
//                    };
                    $scope.toggleAnimation = function () {
                        $scope.animationsEnabled = !$scope.animationsEnabled;
                    };
                    $scope.validateQte = function ($event) {
                        $event.preventDefault();
                        //                        //////console.log(ancienHT);
//                        //////console.log(ancienTTC);
                        var newqte = $('#NewQte').val();
                        encienQte1.text(newqte);
                        newHT.text(parseFloat(ancienHT * newqte).toFixed(3));
                        newTTC.text(parseFloat((ancienTTC * (1 - ancienRemise / 100)) * newqte).toFixed(3));
                        //code à vérifié
                        setTimeout(function () {
                            colorStock();
                            totalDevis();
//                            var total_ht = 0;
//                            var total_ttc = 0;
//                            var indicateur = 0;
//                            var remise_product = 0;
//                            $('tr#itemProduct').each(function (i, v) {
//                                var ttc = parseFloat($(v).children().eq(3).text().replace(" ", ""))
//                                var qte = parseFloat($(v).children().eq(4).text().replace(" ", ""))
//                                var remise_net = parseFloat($(v).children().eq(5).text().replace(" ", ""))
//                                remise_product = remise_product + (ttc * qte * remise_net / 100);
//                                total_ht = total_ht + parseFloat($(v).children().eq(6).text().replace(" ", ""));
//                                ////console.log(total_ht);
//                                total_ttc = total_ttc + parseFloat($(v).children().eq(7).text().replace(" ", ""));
//                                indicateur = indicateur + (parseFloat($(v).attr('data-priceprod')) - parseFloat($(v).attr('data-achat'))) * parseFloat($.trim($(v).children().eq(4).text()));
////                                    total_ht = total_ht + $(v).children().eq(6).attr('data-ttc');
////                                    total_ttc = total_ttc + $(v).children().eq(7).attr('data-ht');
//                            });
//                            $scope.total_ttc = total_ttc;
//                            $scope.indicateur = indicateur;
//                            ////console.log(parseFloat(indicateur));
//                            $scope.total_ht = total_ht;
//                            ////console.log(total_ht);
//                            var timbre = parseFloat($("#timbre_fiscale").text());
//                            $('#total_ttc').text(total_ttc.toFixed(3));
//                            $('#total_ht').text(total_ht.toFixed(3));
//                            var remiseGlobal = parseFloat($("#remiseglobale").text());
//                            var finalIndic = parseFloat(indicateur) - (total_ttc * parseFloat($("#RemiseGlob").val() / 100)) - remise_product;
//                            ////console.log(finalIndic);
//                            $('#Indicateur').text(parseFloat(finalIndic).toFixed(3));
//                            var remiseTotal = parseFloat($("#RemiseGlob").val());
//                            $('#remiseglobale').text((total_ttc * remiseTotal / 100 + remise_product).toFixed(3));
//                            ////console.log(remiseTotal);
//                            $('#net_ttc').text((total_ttc - remiseGlobal + timbre).toFixed(3));
                        }, 500);
                        //end code à vérifier
                        $('#mask , #login-box1.login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    };
                });
                //view action edit devis show indicateur
//                $scope.showIndicateur = function () {
//
//
//                };  
                // modif remise in devis
                $("#space-for-buttons").on('click', "#ModifRemise", function (e) {
                    e.preventDefault();
//                    //console.log
                    var ancienHT = $(this).parent().children().eq(2).text();
                    var newHT = $(this).parent().children().eq(6);
                    $scope.ancienHT = ancienHT;
                    var ancienTTC = $(this).parent().children().eq(3).text();
                    var newTTC = $(this).parent().children().eq(7);
                    $scope.ancienTTC = ancienTTC;
                    $scope.NewQte = $(this).parent().children().eq(4).text();
                    var encienQte = $(this).parent().children().eq(4).text();
                    var ancienRemise = $(this).parent().children().eq(5).text();
                    var newRemise1 = $(this).parent().children().eq(5);
                    var encienQte1 = $(this).parent().children().eq(4);
                    $scope.items = ['item1', 'item2', 'item3'];
                    $scope.animationsEnabled = true;
                    setTimeout(function () {
                        $('#NewRemise').val(ancienRemise);
                    }, 300);
                    $("#login-box2.login-popup").show();
                    //Getting the variable's value from a link 
                    var loginBox = $(this).attr('href');
                    //Fade in the Popup 
                    $(loginBox).fadeIn(300);
                    //Set the center alignment padding + border see css style
                    var popMargTop = ($(loginBox).height() + 24) / 2;
                    var popMargLeft = ($(loginBox).width() + 24) / 2;
                    $(loginBox).css({
                        'margin-top': -popMargTop,
                        'margin-left': -popMargLeft
                    });
                    // Add the mask to body
                    $('body').append('<div id="mask"></div>');
                    $('#mask').fadeIn(300);
//                    };
                    $scope.toggleAnimation = function () {
                        $scope.animationsEnabled = !$scope.animationsEnabled;
                    };
                    $scope.validateRemise = function ($event) {
                        $event.preventDefault();
                        //                        //////console.log(ancienHT);
//                        //////console.log(ancienTTC);
                        var newRemise = $('#NewRemise').val();
                        newRemise1.text(newRemise);
//                        newHT.text(parseFloat(ancienHT * newqte).toFixed(3));
                        newTTC.text(parseFloat((ancienTTC * (1 - newRemise / 100)) * encienQte).toFixed(3));
                        //code à vérifié
                        setTimeout(function () {
                            totalDevis();
                        }, 500);
//                        setTimeout(function () {
//                            var total_ht = 0;
//                            var total_ttc = 0;
//                            var indicateur = 0;
//                            var remise_product = 0;
//                            $('tr#itemProduct').each(function (i, v) {
//                                var ttc = parseFloat($(v).children().eq(3).text().replace(" ", ""))
//                                var qte = parseFloat($(v).children().eq(4).text().replace(" ", ""))
//                                var remise_net = parseFloat($(v).children().eq(5).text().replace(" ", ""))
//                                remise_product = remise_product + (ttc * qte * remise_net / 100);
//                                total_ht = total_ht + parseFloat($(v).children().eq(6).text().replace(" ", ""));
//                                ////console.log(total_ht);
//                                total_ttc = total_ttc + parseFloat($(v).children().eq(7).text().replace(" ", ""));
//                                indicateur = indicateur + (parseFloat($(v).attr('data-priceprod')) - parseFloat($(v).attr('data-achat'))) * parseFloat($.trim($(v).children().eq(4).text()));
////                                    total_ht = total_ht + $(v).children().eq(6).attr('data-ttc');
////                                    total_ttc = total_ttc + $(v).children().eq(7).attr('data-ht');
//                            });
//                            $scope.total_ttc = total_ttc;
//                            $scope.indicateur = indicateur;
//                            ////console.log(parseFloat(indicateur));
//                            $scope.total_ht = total_ht;
//                            ////console.log(total_ht);
//                            var timbre = parseFloat($("#timbre_fiscale").text());
//                            $('#total_ttc').text(total_ttc.toFixed(3));
//                            $('#total_ht').text(total_ht.toFixed(3));
//                            var remiseGlobal = parseFloat($("#remiseglobale").text());
//                            var finalIndic = parseFloat(indicateur) - (total_ttc * parseFloat($("#RemiseGlob").val() / 100)) - remise_product;
//                            ////console.log(finalIndic);
//                            $('#Indicateur').text(parseFloat(finalIndic).toFixed(3));
//                            var remiseTotal = parseFloat($("#RemiseGlob").val());
//                            $('#remiseglobale').text((total_ttc * remiseTotal / 100 + remise_product).toFixed(3));
//                            ////console.log(remiseTotal);
//                            $('#net_ttc').text((total_ttc - remiseGlobal + timbre).toFixed(3));
//                        }, 500);
                        //end code à vérifier
                        $('#mask , #login-box2.login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    };
                });
                $scope.products = PostFactory.listProducts().then(function (products) {
                    $scope.products = products;
                    $scope.data = {
                        model: null,
                        products: products
                    };
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.changeQte = function () {
                    setTimeout(function () {
                        var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                        var ht = parseFloat($('#combobox :selected').val());
                        //                        var qte = parseInt($('#Qte').val());
                        //                        //////console.log(ht);
                        $("#PU").val(ht.toFixed(3));
                        $("#ttc").val((tva * ht).toFixed(3));
                    }, 300);
                };
                $scope.changeQteFicheProduit = function () {
                    setTimeout(function () {
                        var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                        var ht = parseFloat($('#combobox :selected').val());
                        var qte = parseInt($('#QteDevis').val());
                        $("#PUDevis").val(ht.toFixed(3));
                        $("#ttcDevis").val((tva * ht).toFixed(3));
                        //                        $("#Qte").focus();
                    }, 300);
                };
                $scope.initQte = function () {
//                    $scope.qte = 0;
//                    setTimeout(function () {
//                        $scope.qte = "";
//                    }, 500);
                };
                $scope.myFunc = function () {
                    setTimeout(function () {
                        //////console.log('here');
                        $("#Qte").focus();
                        var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                        var ht = parseFloat($("#PU").val());
                        $("#ttc").val((tva * ht).toFixed(3));
                        $("#Qte").focus();
                    }, 300);
                };
                $scope.change = function () {
                    var tva = parseFloat((1 + $('#combobox :selected').attr('data-tva') / 100));
                    var ht = parseFloat($("#PU").val());
                    $("#ttc").val((tva * ht).toFixed(3));
                };
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
                            $location.path('/gestion-devis');
                        },
                                function (msg) {
                                    alert(msg);
                                });
                    }
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.commande = PostFactory.showDevis(id).then(function (commande) {
                        $scope.commande = commande;
//                        //console.log(commande);
                        // filter tva
                        $scope.tvas = PostFactory.listTva().then(function (tvas) {
                            $scope.tvas = tvas;
//                            ////console.log(tvas);
                            var TableTVA = {
                                TVA: []
                            };
                            $(tvas).each(function (i, v) {
                                var mantant_tva = 0;
                                var base_ht = 0;
                                $(commande.Bon).each(function (index, value) {
                                    if (value.Product.Tva.id === v.Tva.id) {
                                        base_ht = base_ht + parseFloat(value.last_unit_price) * parseFloat(value.qte) * (1 - value.remise / 100) * (1 - commande.Commande.remise_globale / 100);
                                        mantant_tva = mantant_tva + parseFloat(value.last_unit_price) * parseFloat(value.qte) * (1 - parseFloat(value.remise) / 100) * (1 - parseFloat(commande.Commande.remise_globale) / 100) * value.Product.Tva.value / 100;
                                    }
                                });
                                TableTVA.TVA.push({price: parseFloat(base_ht).toFixed(3), tva: v.Tva.name, mantant: mantant_tva.toFixed(3)});
                            });
//                            ////console.log(TableTVA.TVA);
                            var Taux = {
                                TVA: []
                            };
                            var total_price_ht = 0;
                            var total_taux = 0;
                            $(TableTVA.TVA).each(function (i, v) {
                                if (v.price != 0.000 || v.price != '0.000') {
                                    Taux.TVA.push({price_ht: v.price, taux: v.tva, mantant: v.mantant});
                                }
                            });
                            $scope.taux = Taux.TVA;
                            ////console.log(Taux.TVA);
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                        // end filter tva

                        var date = commande.Commande.created;
                        $scope.formatCreated = {format: 'EEEE dd MMMM yyyy', date: date};
                        //                        //////console.log(date.format('EEEE dd MMMM yyyy'));
                        var ref = commande.Commande.ref.toString();
                        //////console.log(ref);
                        var ref1 = ref.split('-')[0];
                        var ref2 = ref.split('-')[1];
                        var ref3 = ref1 + "-" + ref2;
                        //                        //////console.log(ref3);
                        $scope.ref3 = ref3;
                        var count = ref.split('-')[2];
                        if (count.toString().length === 1) {
                            count = "000" + count.toString();
                        }
                        if (count.toString().length === 2) {
                            count = "00" + count.toString();
                        }
                        $scope.count = count;
                        var total_ht = 0;
                        var total_ht_net = 0;
                        var total_ttc = 0;
                        var total_tva = 0;
                        var remiseProduit = 0; //                        //////console.log(commande.Bon);
                        $(commande.Bon).each(function (index, value) {
                            total_ht = total_ht + parseFloat(value.last_unit_price) * value.qte * (1 - value.remise / 100);
                            total_ht_net = total_ht_net + parseFloat(value.last_unit_price) * value.qte;
                            total_ttc = total_ttc + (parseFloat(value.last_unit_price) * (1 + value.Product.Tva.value / 100) * (1 - value.remise / 100) * value.qte);
                            total_tva = total_tva + (parseFloat(value.last_unit_price) * value.Product.Tva.value / 100 * (1 - value.remise / 100) * value.qte);
                            remiseProduit = remiseProduit + (parseFloat(value.last_unit_price) * value.remise / 100 * value.qte);
                        });
                        var total_ht_final = total_ht * (1 - (commande.Commande.remise_globale / 100));
                        var total_tva_final = total_tva * (1 - (commande.Commande.remise_globale / 100));
                        $scope.total_ht = total_ht * (1 - (commande.Commande.remise_globale / 100));
                        $scope.total_ht_net = total_ht_net;
                        $scope.total_tva = total_tva * (1 - (commande.Commande.remise_globale / 100));
                        $scope.remiseProduit = remiseProduit;
//                        //////console.log(remiseProduit);
                        //                var total_ttc = total_ht * 1.18;
                        $scope.total_ttc = (parseFloat(total_ht_final) + parseFloat(total_tva_final)).toFixed(3);
                        var total_net = (parseFloat(total_ht_final) + parseFloat(total_tva_final) + parseFloat(commande.Commande.last_timbre_price)).toFixed(3);
                        var totalFinal = total_net.toString().split('.');
                        $scope.totalFinal = totalFinal;
                        ////console.log(total_net);
                        ////console.log(totalFinal);
                        $scope.totalFinalText = PostFactory.MoneyText(totalFinal.toString().replace(",", ".")).then(function (tft) {
                            //                            //////console.log(tft);
                            $scope.totalFinalText = tft;
                        });
                    });
                    $scope.editDevis = function ($event) {
                        $event.preventDefault();
                        var dataCommande = {
                            Commande: {
                                id: id,
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
                            var price = $(v).children().eq(2).text().replace(" ", "");
                            dataCommande.Bon.push({
                                bon_id: parseInt($(v).attr('data-bon')),
                                product_id: parseInt($(v).attr('data-data-id')),
                                last_unit_price: parseFloat(price).toFixed(3),
                                qte: $(v).children().eq(4).text(), remise: $(v).children().eq(5).text()
                            });
//                            //console.log(dataCommande.Bon);
                            if ($(v).children().eq(8).attr('data-lvl') === "error" || $(v).children().eq(8).attr('data-lvl') === "warning") {
                                dataCommande.Notification.push({product_id: parseInt($(v).attr('data-data-id')),
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
                            $scope.commandesEdit = PostFactory.editDevis(dataCommande).then(function (commandesEdit) {
                                $scope.commandesEdit = commandesEdit;
                                $("#space-for-buttons").empty();
                                $("#total_ht").text("0");
                                $("#total_ttc").text("0");
                                $("#remiseglobale").text("0");
                                $("#net_ttc").text("0");
                                //                        $("#space-for-buttons").empty();
                                $location.path('/gestion-devis');
                                toastr.success(commandesEdit.text);
                            },
                                    function (msg) {
                                        alert(msg);
                                    });
                        }
                    };
                }
                $scope.config = PostFactory.showConfig().then(function (config) {
                    $scope.config = config;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.remiseglobale = function () {
                    totalDevis();
//                    var indicateur = 0;
//                    var remise_product = 0;
//                    $('tr#itemProduct').each(function (i, v) {
//                        var ttc = parseFloat($(v).children().eq(3).text().replace(" ", ""));
//                        var qte = parseFloat($(v).children().eq(4).text().replace(" ", ""));
//                        var remise_net = parseFloat($(v).children().eq(5).text().replace(" ", ""));
//                        remise_product = remise_product + (ttc * qte * remise_net / 100);
//                        indicateur = indicateur + (parseFloat($(v).attr('data-priceprod')) - parseFloat($(v).attr('data-achat'))) * parseFloat($.trim($(v).children().eq(4).text()));
//                    });
//                    var remise = parseFloat($("#RemiseGlob").val());
//                    var remiseglobale = parseFloat($('#total_ttc').text().replace(" ", "")) * remise / 100;
//                    var ttc = parseFloat($('#total_ttc').text().replace(" ", ""));
//                    var timbre = parseFloat($("#timbre_fiscale").text().replace(" ", ""));
//                    ////console.log(parseFloat(remise_product));
//                    $("#remiseglobale").text((remiseglobale + parseFloat(remise_product)).toFixed(3));
//                    var indicateurFinal = parseFloat(indicateur);
//                    ////console.log(parseFloat(indicateur));
//                    ////console.log(parseFloat(indicateurFinal));
//                    ////console.log(parseFloat(remiseglobale));
//                    ////console.log('here');
//                    $('#Indicateur').text((indicateurFinal - remiseglobale - remise_product).toFixed(3));
//                    $("#net_ttc").text((ttc - remiseglobale + timbre).toFixed(3));
                }
                $("#space-for-buttons").on('click', "#deleteItem", function (e) {
                    e.preventDefault();
                    $(this).parent().parent().remove();
                    setTimeout(function () {
                        totalDevis();
                    }, 300);
//                    var total_ht = parseFloat($("#total_ht").text().replace(" ", ""));
//                    //////console.log("ancien total ht: " + total_ht);
//                    var total_ttc = parseFloat($("#total_ttc").text().replace(" ", ""));
//                    //////console.log("ancien total ttc: " + total_ttc);
//                    //                    var remise_globale = parseFloat($("total_ttc").text());
//                    var ht = parseFloat($(this).parent().parent().children().eq(6).text().replace(" ", ""));
//                    var ttc = parseFloat($(this).parent().parent().children().eq(7).text().replace(" ", ""));
//                    var remise = parseFloat($(this).parent().parent().children().eq(5).text().replace(" ", ""));
//                    var qte = parseFloat($(this).parent().parent().children().eq(4).text().replace(" ", ""));
//                    var indicateur = (parseFloat($(this).parent().parent().attr('data-priceprod')) - parseFloat($(this).parent().parent().attr('data-achat'))) * parseFloat($.trim($(this).parent().parent().children().eq(4).text()));
//                    ////console.log(indicateur);
//                    var remise_product = ttc * qte * remise / 100;
//                    var ancien_indicateur = parseFloat($("#Indicateur").text());
//                    var new_indicateur = (ancien_indicateur - parseFloat(indicateur) - parseFloat(remise_product)).toFixed(3);
//                    ////console.log(new_indicateur);
//                    $("#Indicateur").text(new_indicateur);
//                    var new_total_ht = total_ht - ht;
//                    var new_total_ttc = total_ttc - ttc;
//                    var new_remise_globale = new_total_ttc * parseFloat($('#RemiseGlob').val() / 100);
//                    var new_net_ttc = new_total_ttc - new_remise_globale;
//                    $("#total_ht").text(parseFloat(new_total_ht).toFixed(3));
//                    $("#total_ttc").text(parseFloat(new_total_ttc).toFixed(3));
//                    $("#remiseglobale").text(parseFloat(new_remise_globale).toFixed(3));
//                    $("#net_ttc").text(parseFloat(new_net_ttc).toFixed(3));
                });
            } else {
                $location.path('/login');
            }
        })
        .controller('UsersController', function ($scope, $http, $timeout, $interval, $location, PostFactory, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.saveID = function ($id) {
                    console.log($id);
                    $cookieStore.remove('userID');
                    $cookieStore.put('userID', $id);
                    $location.path('/historiques/' + $id);
                };
                $scope.currentPage = 1;
                $scope.pageSize = 20;
                $scope.meals = [];
                $scope.pageChangeHandler = function (num) {
                    ////console.log('going to page ' + num);
                };
                $scope.exportDataClient = function () {
                    alasql('SELECT * INTO XLSX("liste_client.xlsx",{headers:true}) FROM ?', [$scope.items]);
                };
                $scope.items = PostFactory.listClientsExport().then(function (clients) {
                    $scope.items = clients;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                //gestion clients
                $scope.clients = PostFactory.listClients().then(function (clients) {
                    $scope.clients = clients;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // end list client
                //gestion commerciales 
                $scope.commerciales = PostFactory.listCommerciales().then(function (commerciales) {
                    $scope.commerciales = commerciales;
                    //////console.log(commerciales);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                //gestion livreur 
                $scope.livreurs = PostFactory.listLivreurs().then(function (livreurs) {
                    $scope.livreurs = livreurs;
                    //console.log(livreurs);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                // end list commerciale
                $scope.villes = PostFactory.listVilles().then(function (villes) {
                    $scope.villes = villes;
                    //////console.log(villes);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.TypeClient = function () {
                    var Type = $('#TypeClient :selected').text();
                    if (Type === "Particulier") {
                        //                        //////console.log(Type);
                        $('#HiddenForType').hide();
                        $('#HiddenCTVAForType').hide();
                        $('#HiddenMFForType').hide();
                        $('#HiddenCategoryForType').hide();
                        $('#HiddenEtabForType').hide();
                        $('#Fiscale').hide();
                        $('#HiddenCommercial').show();
                    } else {
                        //                        //////console.log(Type);
                        $('#HiddenCommercial').hide();
                        $('#HiddenForType').show();
                        $('#HiddenCTVAForType').show();
                        $('#HiddenMFForType').show();
                        $('#HiddenCategoryForType').show();
                        $('#HiddenEtabForType').show();
                        $('#Fiscale').show();
                    }

                };
                $scope.identite_fiscale = function () {
                    var matricule = $("#matricule").val();
                    var code_tva = $("#codetva").val();
                    var code_category = $("#code_category").val();
                    var num_etab = $("#num_etab").val();
                    $("#IdentiteFiscale").text(matricule + "/" + code_tva + "/" + code_category + "/" + num_etab);
                };
                $scope.data = {
                    selectedIndex: 0,
                    secondLocked: true,
                    secondLabel: "2",
                    bottom: false
                };
                $scope.next = function () {
                    $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2);
                };
                $scope.previous = function () {
                    $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
                };
                $scope.ChangePayement = function () {
                    ////console.log('here');
                    $("#PaymentUser").each(function (index, valeur) {
                        if ($(valeur).children().children().is(':checked')) {
                            $(valeur).children().children().removeAttr("checked");
                        } else {
                            $(valeur).children().children().attr("checked");
                        }
                    });
                };
                $scope.payments = PostFactory.listPayments().then(function (payments) {
                    $scope.payments = payments;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                var id = parseInt($location.path().split('/')[2]);
                var dataPayment = {
                    Payment: {
                        id: id
                    }};
                $scope.paymentsusers = PostFactory.listPaymentsUser(dataPayment).then(function (paymentsusers) {
                    $scope.paymentsusers = paymentsusers.paymentsusers;
                    ////console.log(paymentsusers.paymentsusers);
                    var id = parseInt($location.path().split('/')[2]);
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
                            username: $("#username").val(),
                            password: $("#password").val(),
                            last_name: $("#last_name").val(),
                            first_name: $("#first_name").val(),
                            type_client: type_client,
                            etat_client: etat_client,
                            phone: $("#phone").val(),
                            email: $("#email").val(),
                            adress: $("#adress").val(),
                            postal: $("#postal").val(),
                            ville_id: ville_id,
                            raison_social: raison_social,
                            nom_commercial: nom_commercial,
                            commerciale_id: commercial_id,
                            matricule: $("#matricule").val(),
                            codetva: $("#codetva").val(),
                            frais_annulation: $("#frais_annulation").val(),
                            frais_livraison: $("#frais_livraison").val(),
                            code_category: $("#code_category").val(),
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
                    $scope.client = PostFactory.ajoutClient(dataClient).then(function (client) {
                        $scope.client = client;
                        $location.path('/gestion-clients');
                        toastr.success(client.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
//                    }
                };
                //etat client
                $scope.EtatClient = function () {
                    var etat_client = $('#SelectUser :selected').attr("data-etat");
                    if (etat_client === "Normal") {
                        $("#label_etat_client").html("<label class='label label-success'>Client: " + etat_client + "</label>");
                    }
                    if (etat_client === "Sous Surveillance") {
                        $("#label_etat_client").html("<label class='label label-info'>Client: " + etat_client + "</label>");
                    }
                    if (etat_client === "Bloqué") {
                        $("#label_etat_client").html("<label class='label label-danger'>Client: " + etat_client + "</label>");
                    }
                    var adress_client = $('#SelectUser :selected').attr("data-adresse");
                    var phone_client = $('#SelectUser :selected').attr("data-phone");
                    var ville_client = $('#SelectUser :selected').attr("data-ville");
                    var email_client = $('#SelectUser :selected').attr("data-email");
                    var postal_client = $('#SelectUser :selected').attr("data-postal");
                    $("#adresseUser").text(adress_client);
                    $("#phoneUser").text(phone_client);
                    $("#codePostalUser").text(postal_client);
                    $("#villeUser").text(ville_client);
                    $("#emailUser").text(email_client);
//                    toastr.success("Client en état " + etat_client);
                };
                //new client
                $scope.NewClient = function () {
                    var name = $('#SelectUser :selected').attr("data-name");
                    var prenom = $('#SelectUser :selected').attr("data-prenom");
                    var adresse = $('#SelectUser :selected').attr("data-adresse");
                    var phone = $('#SelectUser :selected').attr("data-phone");
                    var url = $('#SelectUser :selected').attr("data-url");
//                    //console.log(name);
//                    //console.log(prenom);
//                    //console.log(adresse);
//                    //console.log(phone);
                    if (url != '' && url != null) {
                        $('.modifImg').attr('src', 'https://api.colisexpress.tn/img/' + url + '')
                    } else {
                        $('.modifImg').attr('src', 'http://www.placehold.it/200x150/EFEFEF/AAAAAA&text=no+image')
                    }
                    $("#NameUser").text(name);
                    $("#PrenomUser").text(prenom);
                    $("#AdresseUser").text(adresse);
                    $("#PhoneUser").text(phone);
                    //console.log(url);
                };
                // end add action in client 
                // start action add commerciale
                $scope.ajoutCommerciale = function ($event) {
                    $event.preventDefault();
                    var dataCommerciale = {
                        User: {
                            username: $("#username").val(),
                            password: $("#password").val(),
                            last_name: $("#last_name").val(),
                            first_name: $("#first_name").val(),
                            phone: $("#phone").val(),
                            email: $("#email").val(),
                            adress: $("#adress").val(),
                            ville_id: $("#villeValue :selected").val(),
                            raison_social: $("#raison_social").val()
                        }};
                    $scope.commerciale = PostFactory.ajoutCommerciale(dataCommerciale).then(function (commerciale) {
                        $scope.commerciale = commerciale;
                        $location.path('/gestion-commerciales');
                        toastr.success(commerciale.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                // start action add livreur
                $scope.ajoutLivreur = function ($event) {
                    $event.preventDefault();
                    var ville_id = 0;
                    if ($("#villeValue :selected").val() != '') {
                        ville_id = $("#villeValue :selected").val();
                    }
                    var dataLivreur = {
                        Livreur: {
                            username: $("#username").val(),
                            password: $("#password").val(),
                            last_name: $("#last_name").val(),
                            first_name: $("#first_name").val(),
                            phone: $("#phone").val(),
                            en_phone: $("#en_phone").val(),
                            marque_voiture: $("#marque_voiture").val(),
                            email: $("#email").val(),
                            adress: $("#adress").val(),
                            ville_id: ville_id,
                            permis_conduire: $("#permis_conduire").val(),
                            matricule_voiture: $("#matricule_voiture").val()
                        }};
//                    if ($("#username").val() == '') {
//                        toastr.error('Veuillez mettre votre login');
//                    } else if ($("#password").val() == '') {
//                        toastr.error('Veuillez mettre votre mot de passe');
//                    } else if ($("#last_name").val() == '') {
//                        toastr.error('Veuillez mettre votre nom');
//                    } else if ($("#first_name").val() == '') {
//                        toastr.error('Veuillez mettre votre prenom');
//                    } else if ($("#phone").val() == '') {
//                        toastr.error('Veuillez mettre votre numéro de téléphone');
//                    } else if ($("#villeValue :selected").val() == '') {
//                        toastr.error('Veuillez mettre votre ville');
//                    } else if ($("#permis_conduire").val() == '') {
//                        toastr.error('Veuillez mettre le numéro de votre permis');
//                    } else if ($("#matricule_voiture").val() == '') {
//                        toastr.error('Veuillez mettre le matricule de votre voiture');
//                    } else {
                    $scope.livreur = PostFactory.ajoutLivreur(dataLivreur).then(function (livreur) {
                        $scope.livreur = livreur;
                        $location.path('/gestion-livreurs');
                        toastr.success(livreur.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
//                    }

                };
                // end add action in commerciale 
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.client = PostFactory.viewClient(id).then(function (client) {
                        $scope.client = client;
                        ////console.log(client);
                        var matricule = client.User.mf.split('/')[0];
                        $scope.matricule = matricule;
                        var codetva = client.User.mf.split('/')[1];
                        $scope.codetva = codetva;
                        var codecategory = client.User.mf.split('/')[2];
                        $scope.codecategory = codecategory;
                        var numetab = client.User.mf.split('/')[3];
                        $scope.numetab = numetab;
                        //////console.log(client);
                    });
                    // view livreur
                    $scope.livreur = PostFactory.viewLivreur(id).then(function (livreur) {
                        $scope.livreur = livreur;
                        //console.log(livreur);
                    });
                    $scope.editClient = function ($event) {
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
                            raison_social = $("#raison_social").val();
                        }
                        var type_client = "Particulier";
                        if ($('#TypeClient :selected').val() != '') {
                            type_client = $('#TypeClient :selected').val();
                        }
                        var commercial_id = 0;
                        if ($('#commercialeValue :selected').val() != "") {
                            commercial_id = $('#commercialeValue :selected').val();
                        }
                        var id = parseInt($location.path().split('/')[2]);
                        var dataUser = {
                            User: {
                                id: id,
                                last_name: $("#last_name").val(),
                                first_name: $("#first_name").val(),
                                type_client: type_client,
                                etat_client: etat_client,
                                phone: $("#phone").val(),
                                email: $("#email").val(),
                                adress: $("#adress").val(),
                                postal: $("#postal").val(),
                                ville_id: ville_id,
                                raison_social: raison_social,
                                nom_commercial: nom_commercial,
                                commerciale_id: commercial_id,
                                matricule: $("#matricule").val(),
                                codetva: $("#codetva").val(),
                                frais_annulation: $("#frais_annulation").val(),
                                frais_livraison: $("#frais_livraison").val(),
                                code_category: $("#code_category").val(),
                                num_etab: $("#num_etab").val()
                            },
                            PaymentList: []
                        };
                        //console.log(dataUser);
                        $("#PaymentUser li input").each(function (index, valeur) {
                            if ($(valeur).val() === "true") {
                                var payment_id = $(valeur).attr("data-data-id");
                                ////console.log(payment_id);
                                dataUser.PaymentList.push({id: payment_id});
                            }
                        });
                        ////console.log(dataUser);
                        $scope.client = PostFactory.editClient(dataUser).then(function (client) {
                            if (client.type === 'success') {
                                $location.path('/gestion-clients');
                                toastr.success(client.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                    $scope.editConnectionClient = function ($event) {
                        $event.preventDefault();
                        var id = parseInt($location.path().split('/')[2]);
                        var dataUser = {
                            User: {
                                id: id,
                                username: $("#username").val(),
                                password: $("#password").val()
                            }
                        };
                        //console.log(dataUser);
                        $scope.client = PostFactory.editClient(dataUser).then(function (client) {
                            if (client.type === 'success') {
                                $location.path('/gestion-clients');
                                toastr.success(client.text);
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                    $scope.editCommerciale = function ($event) {
                        $event.preventDefault();
                        $scope.commerciale = PostFactory.editCommerciale($scope.client).then(function (commerciale) {
                            if (commerciale.type === 'success') {
                                $location.path('/gestion-commerciales');
                                toastr.success("Commerciale Modifié avec succès");
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                    $scope.editUtilisateur = function ($event) {
                        $event.preventDefault();
                        $scope.client = PostFactory.editUtilisateur($scope.client).then(function (client) {
                            if (client.type === 'success') {
                                $location.path('/gestion-utilisateurs');
                                toastr.success("Utilisateur Modifié avec succès");
                            }
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
                    };
                }
                // gestion utlisateurs
                $scope.users = PostFactory.listUsers().then(function (users) {
                    $scope.users = users;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.ajoutUser = function ($event) {
                    $event.preventDefault();
                    var dataUser = {
                        User: {
                            username: $("#username").val(),
                            password: $("#password").val(),
                            last_name: $("#last_name").val(),
                            first_name: $("#first_name").val(),
                            phone: $("#phone").val(),
                            email: $("#email").val(),
                            adress: $("#adress").val(),
                            postal: $("#postal").val(),
                            ville: $("#ville").val(),
                            raison_social: $("#raison_social").val(),
                            matricule: $("#matricule").val(),
                            codetva: $("#codetva").val()
                        }
                    };
                    $scope.user = PostFactory.ajoutUser(dataUser).then(function (user) {
                        $scope.user = user;
                        $location.path('/gestion-utilisateurs');
                        toastr.success(user.text);
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
            } else {
                $location.path('/login');
            }
        })
        //transform Devi in BL
        .controller('ModalLivraisonCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#modal-header-bl").attr('data-cmdid', cmd_id);
                    $("#modal-header-bl").attr('data-index', index);
                }, 300);
                var modalInstance = $uibModal.open({animation: $scope.animationsEnabled,
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        //transform Devi in BL + Facture
        .controller('ModalFactureCtrl', function ($scope, $uibModal, $log) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#modal-header-bl-f").attr('data-cmdid', cmd_id);
                    $("#modal-header-bl-f").attr('data-index', index);
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myModalContentFacture.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        //delete note de frais
        .controller('ModalFraisCtrl', function ($scope, $uibModal, $log, PostFactory) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
//            //console.log('deletefrais');
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
//                    //console.log('deletefrais');
                    $("#DeleteFrais").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteFrais").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteFrais.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //delete Product
        .controller('ModalCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteProduct").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteProduct").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteProduct.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
//            
//            $scope.open = function (cmd_id, index) {
//                setTimeout(function () {
//                    $("#DeleteProduct").attr('data-id', cmd_id);
//                    $("#DeleteProduct").attr('data-index', index);
//                }, 300);
//                var modalInstance = $uibModal.open({
//                    animation: $scope.animationsEnabled,
//                    templateUrl: 'deleteProduct.html',
//                    controller: 'ModalInstanceCtrl',
//                    cmd_id: cmd_id,
//                    resolve: {
            //                        items: function () {
            //                            return $scope.items;
//                        }
//                    }
            //                });
            //                modalInstance.result.then(function (selectedItem) {
            //                    $scope.selected = selectedItem;
//                }, function () {
            //                    $log.info('Modal dismissed at: ' + new Date());
//                });
            //            };
//            $scope.toggleAnimation = function () {
            //                $scope.animationsEnabled = !$scope.animationsEnabled;
//            };
        })
        //delete Stock
        .controller('ModalStockCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteStock").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteStock").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteStock.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
//            $scope.open = function (cmd_id, index) {
//                setTimeout(function () {
//                    $("#DeleteStock").attr('data-id', cmd_id);
//                    $("#DeleteStock").attr('data-index', index);
//                }, 300);
//                var modalInstance = $uibModal.open({
//                    animation: $scope.animationsEnabled,
//                    templateUrl: 'deleteStock.html',
//                    controller: 'ModalInstanceCtrl',
//                    cmd_id: cmd_id,
//                    resolve: {
            //                        items: function () {
            //                            return $scope.items;
//                        }
            //                    } //                });
            //                modalInstance.result.then(function (selectedItem) {
            //                    $scope.selected = selectedItem;
//                }, function () {
            //                    $log.info('Modal dismissed at: ' + new Date());
//                });
            //            };
//            $scope.toggleAnimation = function () {
            //                $scope.animationsEnabled = !$scope.animationsEnabled;
            //            };
        })
        //delete Famille
        .controller('ModalFamilleCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteFamille").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteFamille").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteFamille.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
//            $scope.open = function (cmd_id, index) {
//                setTimeout(function () {
//                    $("#DeleteFamille").attr('data-id', cmd_id);
//                    $("#DeleteFamille").attr('data-index', index);
//                }, 300);
//                var modalInstance = $uibModal.open({
//                    animation: $scope.animationsEnabled,
//                    templateUrl: 'deleteFamille.html',
//                    controller: 'ModalInstanceCtrl',
//                    cmd_id: cmd_id,
//                    resolve: {
            //                        items: function () {
            //                            return $scope.items;
//                        }
//                    }
//                });
            //                modalInstance.result.then(function (selectedItem) {
            //                    $scope.selected = selectedItem;
//                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
            //                });
//            };
            //            $scope.toggleAnimation = function () {
            //                $scope.animationsEnabled = !$scope.animationsEnabled;
            //            };
        })
        //delete Cp
        .controller('ModalCpCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteCp").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteCp").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteCp.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //delete Unite
        .controller('ModalUniteCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteUnite").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteUnite").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteUnite.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //delete Fournisseur
        .controller('ModalFournisseurCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteFournisseur").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteFournisseur").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteFournisseur.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //delete Client
        .controller('ModalClientCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteClient").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteClient").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteClient.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //delete Category
        .controller('ModalCategoryCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteCategory").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteCategory").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteCategory.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //delete Tva
        .controller('ModalTvaCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteTva").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteTva").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteTva.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //delete Facture
        .controller('ModalDelFactureCtrl', function ($scope, $uibModal, $log) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteFacture").attr('data-id', cmd_id);
                    $("#DeleteFacture").attr('data-index', index);
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled, templateUrl: 'deleteFacture.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        //Modal Add Famille 
        .controller('ModalADDFamilleCtrl', function ($scope, $uibModal, $log, $timeout, PostFactory, $location) {
            $scope.closeUrl = base_url() + "assets/pages/img/close_pop.png"
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function ($event) {
                $event.preventDefault();
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.familles = PostFactory.listFamille().then(function (familles) {
                $scope.familles = familles;
            });
            $scope.ajoutFamille = function ($event) {
                $event.preventDefault();
                var dataFamille = {
                    Famille: {
                        name: $("#nomFamilleModal").val()
                    }
                };
                $scope.famille = PostFactory.ajoutFamille(dataFamille).then(function (famille) {
                    $scope.famille = famille;
                    $scope.familles = famille.data;
                    //                    $location.path('/gestion-familles');
                    toastr.success(famille.text);
                    if (famille.type === 'success') {
                        //                        $scope.familles = PostFactory.listFamille().then(function (familles) {
                        //                            $scope.familles = familles;
                        //                        });
                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.familles = famille.data;
                            });
                        }, 500);
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //delete Commande
        .controller('ModalCommandeCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index, client) {
                setTimeout(function () {
                    $("#DeleteCommande").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteCommande").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                    $("#login-box").attr('data-client', client);
                    $("#login-box").attr('data-fournisseur', client);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        setTimeout(function () {
                            var name_client = $("#login-box").attr('data-client');
                            $("#name_client").text("Nom de Client: " + name_client);
                            var name_fournisseur = $("#login-box").attr('data-fournisseur');
                            $("#name_fournisseur").text("Nom de Fournisseur: " + name_fournisseur);
                        }, 700);
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'DeleteCommande.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //avoir facture
        .controller('ModalAvoirFactureCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, client, code_facture, index) {
                setTimeout(function () {
                    $("#avoirFacture").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#avoirFacture").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                    $("#login-box").attr('data-client', client);
                    $("#login-box").attr('data-facture', code_facture)
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        setTimeout(function () {
                            var facture_id = $("#login-box").attr('data-id');
                            $("#AvoirsFacture").attr('data-id', facture_id);
                            var code_facture = $("#login-box").attr('data-facture');
                            $("#code_facture").text("Code facture: " + code_facture);
                            var name_client = $("#login-box").attr('data-client');
                            $("#name_client").text("Nom de Client: " + name_client);
                            var name_fournisseur = $("#login-box").attr('data-fournisseur');
                            $("#name_fournisseur").text("Nom de Fournisseur: " + name_fournisseur);
                        }, 700);
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'avoirFacture.html',
                            controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //avoir facture
        .controller('ModalAvoirBLCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, client, code_facture, index) {
                setTimeout(function () {
                    $("#avoirFacture").attr('data-id', cmd_id);
                    $("#login-box-avoir").attr('data-id', cmd_id);
                    $("#avoirFacture").attr('data-index', index);
                    $("#login-box-avoir").attr('data-index', index);
                    $("#login-box-avoir").attr('data-client', client);
                    $("#login-box-avoir").attr('data-facture', code_facture)
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        console.log('blavoir');
                        setTimeout(function () {
                            var facture_id = $("#login-box-avoir").attr('data-id');
                            $("#AvoirsFacture").attr('data-id', facture_id);
                            var code_facture = $("#login-box-avoir").attr('data-facture');
                            $("#code_facture").text("Réf. : " + code_facture);
                            var name_client = $("#login-box-avoir").attr('data-client');
                            $("#name_client").text("Nom de Client: " + name_client);
                            var name_fournisseur = $("#login-box-avoir").attr('data-fournisseur');
                            $("#name_fournisseur").text("Nom de Fournisseur: " + name_fournisseur);
                        }, 700);
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'avoirBL.html',
                            controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box-avoir").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        //delete Devis
        .controller('ModalDeviCtrl', function ($scope, $uibModal, $log, PostFactory) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteCommande").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteCommande").attr('data-index', index);
                    $("#login-box").attr('data-index', index);
                }, 300);
                $(".login-popup").show();
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'DeleteDevi.html', controller: 'ModalInstanceCtrl',
                            cmd_id: $("#login-box").attr('data-id'),
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        // delete reglement 
        .controller('ModalReglementCtrl', function ($scope, $uibModal, $log) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#modal-header-reglement").attr('data-cmdid', cmd_id);
                    $("#modal-header-reglement").attr('data-index', index);
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myModalReglement.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
// add new client modal
        .controller('ModalNewClientCtrl', function ($scope, $uibModal, $log) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myModalContentNewClient.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        // valider commande dépôt 
        .controller('ModalCommandeClientCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, ref, date, user_name, user_adress, user_ville, index) {
                setTimeout(function () {
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 100);
                setTimeout(function () {
                    $("#modal-commande-depot").attr('data-cmdid', cmd_id);
                    $("#modal-commande-depot").attr('data-index', index);
                    $("#DateCommandeDepot").text(date);
                    $("#RefCommandeDepot").text(ref);
                    $("#UserNameDepot").text(user_name);
                    $("#AdressUserDepot").text(user_adress + ' | ' + user_ville);
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myCommandeDepot.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        // retour commande de l'etat livrée vers etat attente
        .controller('ModalRetourLivreeCtrl', function ($scope, $uibModal, $log, PostFactory, $location) {

            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, ref, date, user_name, user_adress, user_ville, index) {
                $(".login-popup").show();
                setTimeout(function () {
                    console.log(cmd_id);
                    $(".login-popup").attr('data-cmdid', cmd_id);
                    $(".login-popup").attr('data-ref', ref);
                    $(".login-popup").attr('data-date', date);
                    $(".login-popup").attr('data-client', user_name);
                    $(".login-popup").attr('data-adress', user_adress);
                    $(".login-popup").attr('data-ville', user_ville);
                    $("#modal-livraison-stock").attr('data-cmdid', cmd_id);
                    $("#RefActiveLivraison").text(ref);
                    $("#DateActiveLivraison").text(date);
                    $("#UserNameActiveLivraison").text(user_name);
                    $("#AdressUserActiveLivraison").text(user_adress + ' | ' + user_ville);
                }, 500);
                //Getting the variable's value from a link 
                var loginBox = $(this).attr('href');
                //Fade in the Popup 
                $(loginBox).fadeIn(300);
                //Set the center alignment padding + border see css style
                var popMargTop = ($(loginBox).height() + 24) / 2;
                var popMargLeft = ($(loginBox).width() + 24) / 2;
                $(loginBox).css({
                    'margin-top': -popMargTop,
                    'margin-left': -popMargLeft
                });
                // Add the mask to body
                $('body').append('<div id="mask"></div>');
                $('#mask').fadeIn(300);
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
            $scope.validateAction = function ($event) {
                $event.preventDefault();
                var dataRoot = {
                    Root: {
                        code: $scope.codeRoot,
                        action: 'delete'
                    }
                };
                $scope.root = PostFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        console.log('valide');
                        var id = $(".login-popup").attr('data-cmdid');
                        var ref = $(".login-popup").attr('data-ref');
                        var date = $(".login-popup").attr('data-date');
                        var user_name = $(".login-popup").attr('data-client');
                        var user_adress = $(".login-popup").attr('data-adress');
                        var user_ville = $(".login-popup").attr('data-ville');
                        console.log(id);
                        setTimeout(function () {
                            $("#modal-livraison-stock").attr('data-cmdid', id);
                            $("#RefActiveLivraison").text(ref);
                            $("#DateActiveLivraison").text(date);
                            $("#UserNameActiveLivraison").text(user_name);
                            $("#AdressUserActiveLivraison").text(user_adress + ' | ' + user_ville);
                        }, 200);
//                        $('#mask , .login-popup').fadeOut(300, function () {
//                            $('#mask').remove();
//                        });
//                        $location.path('/affecter-commande-livreur/' + id);
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'myactiveRetourLivraison.html',
                            controller: 'ModalInstanceCtrl',
                            cmd_id: id,
                            resolve: {
                                items: function () {
                                    return $scope.items;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.selected = selectedItem;
                        }, function () {
                            $log.info('Modal dismissed at: ' + new Date());
                        });
                        $('#mask , .login-popup').fadeOut(300, function () {
                            $('#mask').remove();
                        });
                    } else {
                        toastr.error('Code invalide');
                    }
                },
                        function (msg) {
                            alert(msg);
                        });
            };
        })
        // valider commande dépôt 
        .controller('ModalRamassageCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, ref, date, user_name, user_adress, user_ville, index) {
                setTimeout(function () {
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 100);
                setTimeout(function () {
                    $("#modal-ramassage").attr('data-cmdid', cmd_id);
                    $("#modal-ramassage").attr('data-index', index);
                    $("#DateRamassage").text(date);
                    $("#RefRamassage").text(ref);
                    $("#UserNameRamassage").text(user_name);
                    $("#AdressUserRamassage").text(user_adress + ' | ' + user_ville);
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myRamassage.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })

        // valider commande dépôt 
        .controller('ModalFactureeCommandeClientCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, ref, date, user_name, user_adress, user_ville, index) {
                setTimeout(function () {
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 100);
                setTimeout(function () {
                    $("#modal-facturee-annule").attr('data-cmdid', cmd_id);
                    $("#modal-facturee-annule").attr('data-index', index);
                    $("#RefCommandeFacturer").text(ref);
                    $("#DateCommandeFacturer").text(date);
                    $("#UserNameFacturer").text(user_name);
                    $("#AdressUserFacturer").text(user_adress + ' | ' + user_ville);
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myFactureeAnnule.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        // activer réaffection annule
        .controller('ModalActiveAnnulationCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, ref, date, user_name, user_adress, user_ville, index) {
                setTimeout(function () {
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 100);
                setTimeout(function () {
                    $("#modal-active-affectation").attr('data-cmdid', cmd_id);
                    $("#modal-active-affectation").attr('data-index', index);
                    $("#RefActive").text(ref);
                    $("#DateActive").text(date);
                    $("#UserNameActive").text(user_name);
                    $("#AdressUserActive").text(user_adress + ' | ' + user_ville);
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myactiveReaffectation.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        // retour commande ver expediteur  
        .controller('ModalExpediteurCommandeCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, ref, date, user_name, user_adress, user_ville, index) {
                setTimeout(function () {
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 100);
                setTimeout(function () {
                    $("#modal-commande-expediteur").attr('data-cmdid', cmd_id);
                    $("#modal-commande-expediteur").attr('data-index', index);
                    $("#RefCommandeExpediteur").text(ref);
                    $("#DateCommandeExpediteur").text(date);
                    $("#UserNameExpediteur").text(user_name);
                    $("#AdressUserExpediteur").text(user_adress + ' | ' + user_ville);
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myCommandeExpediteur.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        // valider annulation commande
        .controller('ModalAnnuleCommandeCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, ref, date, user_name, user_adress, user_ville, index) {
                setTimeout(function () {
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 100);
                setTimeout(function () {
                    $("#modal-commande-annulee").attr('data-cmdid', cmd_id);
                    $("#modal-commande-annulee").attr('data-index', index);
                    $("#DateCommandeAnnulee").text(date);
                    $("#RefCommandeAnnulee").text(ref);
                    $("#UserNameAnnulee").text(user_name);
                    $("#AdressUserAnnulee").text(user_adress + ' | ' + user_ville);
                    $(".modal-dialog").attr('style', 'width: 30% !important;');
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myAnnuleCommande.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        // historiques commande
        .controller('ModalHistorqueCommandeCtrl', function ($scope, $uibModal, $log, PostFactory) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, ref) {
                setTimeout(function () {
                    console.log(ref);
                    $(".modal-dialog").attr('style', 'width: 50% !important;');
                    $scope.historiques = PostFactory.showHistorique(cmd_id).then(function (historiques) {
                        console.log(historiques);
//                    });
//                    $scope.commande = PostFactory.showCommande(cmd_id).then(function (commande) {
//                        $scope.commande = commande;
                        //console.log(commande);
                        setTimeout(function () {
                            $(historiques).each(function (index, value) {
                                var mantant = 0;
                                if (value.Commande.isContreRembourcement == true || value.Commande.isContreRembourcement == 'true') {
                                    mantant = parseFloat(value.Commande.mantant).toFixed(3);
                                }
                                var isEchane = null;
                                if (value.Commande.isEchange == true || value.Commande.isEchange == 'true') {
                                    isEchane = 'Échange';
                                }
                                var nbrColis = value.Commande.Bon.length;
                                var created = value.Historique.created;
                                var date = created.split(' ')[0].split('-')[2] + '-' + created.split(' ')[0].split('-')[1] + '-' + created.split(' ')[0].split('-')[0];
                                var time = created.split(' ')[1];
                                var date_livraison = null;
                                if (value.Historique.operation === 'AttenteLivraison') {
                                    date_livraison = value.Commande.date_livraison.split(' ')[0].split('-')[2] + '-' + value.Commande.date_livraison.split(' ')[0].split('-')[1] + '-' + value.Commande.date_livraison.split(' ')[0].split('-')[0];
                                }
                                var historique = null;
                                if (value.Historique.operation === 'En attente ramassage' || value.Historique.operation === 'En attente dépôt') {
                                    if (mantant == 0) {
                                        historique = "<img src='/assets/pages/img/img-transporteur/creer.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;line-height: 30px;'> Créée le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + " <br> nombre de colis : " + nbrColis + "</strong>";
                                    }
                                    if (mantant != 0 && isEchane == null) {
                                        historique = "<img src='/assets/pages/img/img-transporteur/creer.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;line-height: 30px;'> Crée le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + " <br> nombre de colis : " + nbrColis + " <br> contre rembourcement : " + mantant + "</strong>";
                                    }
                                    if (mantant != 0 && isEchane != null) {
                                        historique = "<img src='/assets/pages/img/img-transporteur/creer.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;line-height: 30px;'> Crée le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + " <br> nombre de colis : " + nbrColis + " <br> contre rembourcement : " + mantant + " <br> Échange </strong>";
                                    }
                                }
                                if (value.Historique.operation == 'Récupérée' || value.Historique.operation == 'En Cours') {
                                    historique = "<img src='/assets/pages/img/img-transporteur/recuperer.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;line-height: 30px;'> Récupérée le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + " <br> Livreur : " + value.User.full_name + "</strong>";
                                }
                                if (value.Historique.operation == 'Modification CR') {
                                    historique = "<img src='/assets/pages/img/img-transporteur/recuperer.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;line-height: 30px;'> Modification CR le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + " par " + value.User.full_name + " <br> contre rembourcement : " + value.montant + "</strong>";
                                }
                                if (value.Historique.operation == 'AttenteLivraison') {
                                    historique = "<img src='/assets/pages/img/img-transporteur/attentelivraison.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;line-height: 30px;' class='col-xs-9'> En cours de livraison le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + " <br> Date de livraison : <i class='fa fa-calendar-o'></i> " + date_livraison + " <br> Livreur : <i class='fa fa-user'></i> " + value.User.full_name + " <br> Num livreur :  <i class='fa fa-phone'></i> " + value.User.phone + "</strong>";
                                }
                                if (value.Historique.operation === 'Retour') {
                                    historique = "<img src='/assets/pages/img/img-transporteur/retour.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;line-height: 30px;' class='col-xs-9'> Retour le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + " <br> Cause : " + value.Historique.cause_operation + " <br> Livreur :  <i class='fa fa-user'></i> " + value.User.full_name + " <br> Num livreur :  <i class='fa fa-phone'></i> " + value.User.phone + "</strong>";
                                }
                                if (value.Historique.operation === 'Retour Expéditeur') {
                                    historique = "<img src='/assets/pages/img/img-transporteur/retour.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;' class='col-xs-9'> Retour à l'expéditeur : <i class='fa fa-calendar-o'></i> " + date + " à " + time + "</strong>";
                                }
                                if (value.Historique.operation === 'Annulée') {
                                    historique = "<img src='/assets/pages/img/img-transporteur/annulee.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;line-height: 30px;'> Annulée le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + " <br> Cause : " + value.Historique.cause_operation + " <br> Livreur : <i class='fa fa-user'></i> " + value.User.full_name + " <br> Num livreur :  <i class='fa fa-phone'></i> " + value.User.phone + "</strong>";
                                }
                                if (value.Historique.operation === 'En Stock') {
                                    historique = "<img src='/assets/pages/img/img-transporteur/en stock.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;'> Reçue à l'entrepôt le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + "</strong>";
                                }
                                if (value.Historique.operation === 'Livrée') {
                                    historique = "<img src='/assets/pages/img/img-transporteur/reçu.jpg' style='max-width: 150px; float: left;'/><strong style='float: left;padding-left: 50px;line-height: 30px;'> Livrée le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + " <br> Livreur : <i class='fa fa-user'></i> " + value.User.full_name + " <br> Num livreur :  <i class='fa fa-phone'></i> " + value.User.phone + "</strong>";
                                }
                                if (value.Historique.operation === 'Facturée') {
                                    historique = "<strong> Facturée le : <i class='fa fa-calendar-o'></i> " + date + " à " + time + "</strong>";
                                }
                                if (value.Historique.operation != 'appel') {
                                    $("#HistoriquesCommande").append('<li class="list-group-item" style="min-height: 140px;margin-bottom: 5px;border-radius: 5px;"> ' + historique + '</li>');
                                }
                                $("#refCommandeHistorique").text(ref);
                                $(".modal-dialog").attr('style', 'width: 50% !important;');
                            });
                        }, 100);
                    });
                }, 100);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myHistoriqueCommande.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        // valider commande dépôt 
        .controller('ModalLivraisonRetourCommandeCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $("#buttonRetour").on('click', function () {
                $("#causeNonlivree").show();
                $("#buttonLivree").hide();
            });
            $scope.open = function (cmd_id, ref, dest_name, user_name, user_adress, user_ville) {
//                $(".modal-dialog").attr('style', 'width: 40% !important;');
                setTimeout(function () {
                    $(".modal-dialog").attr('style', 'width: 40% !important;');
                    boutonrtourLivraison();
                }, 100);
                setTimeout(function () {
                    $("#valideAttente").attr('data-cmdid', cmd_id);
//                    $("#modal-commande-depot").attr('data-index', index);
                    $("#ref_commande").text("Réf commande: " + ref);
                    $("#user_commande").text("Expéditeur: " + user_name);
                    $("#userville_commande").text("Adresse | Ville : " + user_adress + ' | ' + user_ville);
                    $("#destinataire_commande").text("Destinataire: " + dest_name);
                }, 100);
//                setTimeout(function () {
//                    $("#valideCommande").attr('data-id', cmd_id);
//                    $("#ref_commande").text("Réf commande: " + ref);
//                    $("#ref_commande").text("Client commande: " + ref);
//                }, 100);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'valideLivraisonCommande.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
        // valider commande dépôt 
        .controller('ModalLivraisonRetourCommandeCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $("#buttonRetour").on('click', function () {
                $("#causeNonlivree").show();
                $("#buttonLivree").hide();
            });
            $scope.open = function (cmd_id, ref, dest_name, user_name, user_adress, user_ville) {
//                $(".modal-dialog").attr('style', 'width: 40% !important;');
                setTimeout(function () {
                    $(".modal-dialog").attr('style', 'width: 40% !important;');
                    boutonrtourLivraison();
                }, 100);
                setTimeout(function () {
                    $("#valideAttente").attr('data-cmdid', cmd_id);
//                    $("#modal-commande-depot").attr('data-index', index);
                    $("#ref_commande").text("Réf commande: " + ref);
                    $("#user_commande").text("Expéditeur: " + user_name);
                    $("#userville_commande").text("Adresse | Ville : " + user_adress + ' | ' + user_ville);
                    $("#destinataire_commande").text("Destinataire: " + dest_name);
                }, 100);
//                setTimeout(function () {
//                    $("#valideCommande").attr('data-id', cmd_id);
//                    $("#ref_commande").text("Réf commande: " + ref);
//                    $("#ref_commande").text("Client commande: " + ref);
//                }, 100);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'valideLivraisonCommande.html',
                    controller: 'ModalInstanceCtrl',
                    cmd_id: cmd_id, resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };
        })
//        .controller('ModalLivraisonRetourCommandeCtrl', function ($scope, $uibModal, $log, PostFactory) {
//            $scope.items = ['item1', 'item2', 'item3'];
//            $scope.animationsEnabled = true;
//            $scope.open = function (cmd_id, ref, created, full_name, adress_user, user_ville) {
////                setTimeout(function () {
//                setTimeout(function () {
//                    $("#valideCommande").attr('data-id', cmd_id);
//                    $("#ref_commande").text("Réf commande: " + ref);
//                    $("#ref_commande").text("Client commande: " + ref);
//                }, 700);
//                
//                var modalInstance = $uibModal.open({
//                    animation: $scope.animationsEnabled,
//                    templateUrl: 'valideLivraisonCommande.html', 
//                    controller: 'ModalInstanceCtrl',
//                    cmd_id: cmd_id,
//                    resolve: {
//                        items: function () {
//                            return $scope.items;
//                        }
//                    }
//                });
//                modalInstance.result.then(function (selectedItem) {
//                    $scope.selected = selectedItem;
//                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
//                });
//                $('#mask , .login-popup').fadeOut(300, function () {
//                    $('#mask').remove();
//                });
////                }, 300);
////                $("#DeleteCommande").show();
//                //Getting the variable's value from a link 
//                var loginBox = $(this).attr('href');
//                //Fade in the Popup 
//                $(loginBox).fadeIn(300);
//                //Set the center alignment padding + border see css style
//                var popMargTop = ($(loginBox).height() + 24) / 2;
//                var popMargLeft = ($(loginBox).width() + 24) / 2;
//                $(loginBox).css({
//                    'margin-top': -popMargTop,
//                    'margin-left': -popMargLeft
//                });
//                // Add the mask to body
//                $('body').append('<div id="mask"></div>');
//                $('#mask').fadeIn(300);
//            };
//            $scope.toggleAnimation = function () {
//                $scope.animationsEnabled = !$scope.animationsEnabled;
//            };
//        })
        .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, PostFactory, $cookieStore, $location) {
            // passe facture avoir
            $scope.avoirFacture = function () {
                var facture_id = $("#AvoirsFacture").attr('data-id');
                var dataFacture = {
                    Facture: {
                        id: facture_id,
                        avoir: true
                    }
                };
                console.log(dataFacture);
                $scope.factureavoir = PostFactory.genererFactureAvoir(dataFacture).then(function (factureavoir) {
                    $scope.factureavoir = factureavoir;
                    if (factureavodeir.type === 'success') {
                        $uibModalInstance.close();
                        toastr.success(factureavoir.text);
                        $("table").find("tr[data-facture = '" + facture_id + "']").fadeOut('slow', function () {
                            $(this).remove();
                        });
                        $location.path('/gestion-factures-avoir');
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            // passe bl avoir
            $scope.avoirBL = function () {
                var commande_id = $("#AvoirsFacture").attr('data-id');
                var dataCommande = {
                    Commande: {
                        id: commande_id
                    }
                };
                console.log(dataCommande);
                $scope.blavoir = PostFactory.genererBLAvoir(dataCommande).then(function (blavoir) {
                    $scope.blavoir = blavoir;
                    if (blavoir.type === 'success') {
                        $uibModalInstance.close();
                        toastr.success(blavoir.text);
                        $("table").find("tr[data-bl = '" + commande_id + "']").fadeOut('slow', function () {
                            $(this).remove();
                        });
                        $location.path('/gestion-bl-avoir');
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            // cancel reglement
            $scope.cancelReglement = function () {
                var dataReglement = {
                    Reglement: {
                        id: $("#modal-header-reglement").attr('data-cmdid')
                    }
                };
                var indexRow = $("#modal-header-reglement").attr('data-index');
                $scope.reglement = PostFactory.cancelReglement(dataReglement).then(function (reglement) {
                    $uibModalInstance.close($("#reglementSumbit").attr('data-cmd'));
                    $uibModalInstance.close();
                    $scope.reglement = reglement;
                    toastr.success(reglement.text);
                    $("tr#ReglementRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //valider commande dépôt
            $scope.ValidateCommande = function () {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                $scope.AuthId = Auth;
//                //console.log(Auth);
                var dataCommande = {
                    Commande: {
                        id: $("#modal-commande-depot").attr('data-cmdid'),
                        state: 'En stock',
                        source: Auth.user,
                        isStock: 1
                    }
                };
                var indexRow = $("#modal-commande-depot").attr('data-index');
                $scope.vildeCommande = PostFactory.ValidateCommande(dataCommande).then(function (vildeCommande) {
                    $uibModalInstance.close();
                    $scope.vildeCommande = vildeCommande;
                    toastr.success(vildeCommande.text);
                    $("tr#CommandeRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //valider commande dépôt
            $scope.ValidateRamassage = function () {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                $scope.AuthId = Auth;
//                //console.log(Auth);
                var dataCommande = {
                    Commande: {
                        id: $("#modal-ramassage").attr('data-cmdid'),
                        state: 'En Cours'
                    }
                };
                var indexRow = $("#modal-ramassage").attr('data-index');
                $scope.vildeCommande = PostFactory.ValidateRamassage(dataCommande).then(function (vildeCommande) {
                    $uibModalInstance.close();
                    $scope.vildeCommande = vildeCommande;
                    toastr.success(vildeCommande.text);
                    $("table").find("tr[data-commandeuser = '" + $("#modal-ramassage").attr('data-cmdid') + "']").fadeOut('slow', function () {
                        $(this).remove();
                    });
                    $location.path('/view-commande-for-client/' + vildeCommande.user_id);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //valider commande livraison ou retour
            $scope.livreecommande = function () {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                $scope.AuthId = Auth;
//                //console.log(Auth);
                var dataCommande = {
                    Commande: {
                        id: $("#modal-commande-livree").attr('data-cmdid'),
                        state: 'Livrée',
                        isStock: 0
                    }
                };
                $scope.livreecommande = PostFactory.livreecommande(dataCommande).then(function (livreecommande) {
                    $uibModalInstance.close();
                    $scope.livreecommande = livreecommande;
                    toastr.success(livreecommande.text);
                    $("table").find("tr[data-livree = '" + $("#modal-commande-livree").attr('data-cmdid') + "']").fadeOut('slow', function () {
                        $(this).remove();
                    });
//                    $("tr#CommandeRows:eq(" + indexRow + ")").fadeOut('slow', function () {
//                        $(this).remove();
//                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //facturer commande annulée
            $scope.facturerAnnule = function () {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                $scope.AuthId = Auth;
//                //console.log(Auth);
                var dataCommande = {
                    Commande: {
                        id: $("#modal-facturee-annule").attr('data-cmdid'),
                    }
                };
                var indexRow = $("#modal-facturee-annule").attr('data-index');
                $scope.facturerCommande = PostFactory.facturerAnnule(dataCommande).then(function (facturerCommande) {
                    $uibModalInstance.close();
                    $scope.facturerCommande = facturerCommande;
                    if (facturerCommande.type == 'success') {
                        toastr.success(facturerCommande.text);
                        $scope.commandesannulee = PostFactory.listCommandeAnnuleeEspaceclient().then(function (commandesannulee) {
                            $scope.commandesannulee = commandesannulee;
//                    //console.log(commandesannulee);
                        },
                                function (msg) {
                                    alert(msg);
                                }
                        );
//                        $("tr.CommandeRowsAnnulee:eq(" + indexRow + ")").fadeOut('slow', function () {
//                            $(this).remove();
//                        });
                        var id = $("#modal-facturee-annule").attr('data-cmdid');
//                        $("tr#CommandeRowsAnnulee:eq(" + indexRow + ") #showFacturerCommande button").fadeOut('slow', function () {
//                            $(this).remove();
//                        });
//                        $("tr#CommandeRowsAnnulee:eq(" + indexRow + ") #showAnnulationCommande button").fadeOut('slow', function () {
//                            $(this).remove();
//                        });
                        $("table").find("tr[data-annulation-id = '" + id + "'] #showFacturerCommande button").fadeOut('slow', function () {
                            $(this).remove();
                        });
                        $("table").find("tr[data-annulation-id = '" + id + "'] #showAnnulationCommande button").fadeOut('slow', function () {
                            $(this).remove();
                        });
//                        setTimeout(function () {
//                            $("tr#CommandeRowsAnnulee:eq(" + indexRow + ") #showFacturerCommande").html('<label class="label label-sm label-info" style="background-color: #4285F4; border-color: #4285F4;">Attente facturation</label>');
//                        }, 500);
                        setTimeout(function () {
                            $("table").find("tr[data-annulation-id = '" + id + "'] #showFacturerCommande").html('<label class="label label-sm label-info" style="background-color: #4285F4; border-color: #4285F4;">Attente facturation</label>');
                        }, 500);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //activer réaffection annule
            $scope.activerReaffectation = function () {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                $scope.AuthId = Auth;
//                //console.log(Auth);
                var dataCommande = {
                    Commande: {
                        id: $("#modal-active-affectation").attr('data-cmdid')
                    }
                };
                var indexRow = $("#modal-active-affectation").attr('data-index');
                $scope.activerReaffectation = PostFactory.activerReaffectation(dataCommande).then(function (activerReaffectation) {
                    $uibModalInstance.close();
                    $scope.activerReaffectation = activerReaffectation;
                    if (activerReaffectation.type == 'success') {
                        toastr.success(activerReaffectation.text);
                        $("tr#CommandeRowsAnnulee:eq(" + indexRow + ") #showAnnulationCommande button").fadeOut('slow', function () {
                            $(this).remove();
                        });
                        $scope.checkboxModel = {
                            value1: false
                        };
                        $("table").find("tr#CommandeEnterStock[data-data-id = '" + $("#modal-active-affectation").attr('data-cmdid') + "'] #Annulationcmd").html('<a href="#/affecter-commande-livreur/' + $("#modal-active-affectation").attr('data-cmdid') + '" class="btn btn-success btn-sm">Affecter livreur</a>');
                        $("table").find("tr#CommandeEnterStock[data-data-id = '" + $("#modal-active-affectation").attr('data-cmdid') + "'] #formAnnulation").html('<form name="myForm"><input  type="checkbox" id="CheckedBox" value="{{checkboxModel.value}}" ng-model="checkboxModel.value"></form>');
//                        setTimeout(function () {
//                        }, 500);
//                        setTimeout(function () {
//                        }, 500);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //activer réaffection livraison stock
            $scope.activerLivraisonStock = function () {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                $scope.AuthId = Auth;
//                //console.log(Auth);
                var dataCommande = {
                    Commande: {
                        id: $("#modal-livraison-stock").attr('data-cmdid')
                    }
                };
                var indexRow = $("#modal-livraison-stock").attr('data-index');
                $scope.activerReaffectation = PostFactory.activerLivraisonStock(dataCommande).then(function (modifstatelivree) {
                    $uibModalInstance.close();
                    $scope.modifstatelivree = modifstatelivree;
                    if (modifstatelivree.type == 'success') {
                        toastr.success(modifstatelivree.text);
                        $("table").find("tr[data-data-id = '" + $("#modal-livraison-stock").attr('data-cmdid') + "']").fadeOut('slow', function () {
                            $(this).remove();
                        });
                        var id = $("#modal-livraison-stock").attr('data-cmdid');
                        $scope.commande = PostFactory.showCommande(id).then(function (commandeBarre) {
                            $scope.commandeview = commandeBarre;
                            var recuperateur = '';
                            var state = commandeBarre.Commande.state;
                            var retour = '';
                            if (commandeBarre.Commande.type_remettre == 'Ramassage') {
                                recuperateur = commandeBarre.Livreur.first_name + " " + commandeBarre.Livreur.last_name;
                            }
                            if (commandeBarre.Commande.type_remettre == 'Depot') {
                                recuperateur = 'Déposée';
                            }
                            if (commandeBarre.Commande.state == 'Retour' || commandeBarre.Commande.state == 'AttenteLivraison') {
                                state = '<label class="label label-info label-sm">Retour (' + (parseInt(commandeBarre.Commande.countRetour)) + ')</label>';
                                retour = commandeBarre.Commande.cause_nonlivraison;
                                if (commandeBarre.Commande.cause_nonlivraison == null) {
                                    retour = 'Opération système';
                                }
                            }
                            if (commandeBarre.Commande.state == 'Annulée') {
                                state = '<label class="label label-danger label-sm">Annulation (' + (parseInt(commandeBarre.Commande.countRetour) + 1) + ')</label>';
//                                                    retour = '<label class="btn btn-sm btn-danger">' + commandeBarre.Commande.cause_nonlivraison + '(' + commandeBarre.Commande.countRetour + ')' + '</label>'
                                retour = commandeBarre.Commande.cause_nonlivraison;
                            }
                            if (commandeBarre.Commande.state == 'Non Traitée' || commandeBarre.Commande.state == 'Non Traitée depot' || commandeBarre.Commande.state == 'En Cours') {
                                state = '<label class="label label-success label-sm">En attente livraison</label>';
                            }
                            var affect = "<ul class='nav nav-pills'><li><div><a href='#/affecter-commande-livreur/" + commandeBarre.Commande.id + "' class='btn btn-success btn-sm'>Affecter livreur</a></div></li></ul>";
                            var affect1 = "<form name='myForm'><input  type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form>";
                            if ((parseInt(commandeBarre.Commande.countRetour)) > 2) {
                                affect = '';
                                affect1 = '';
                            }
                            var waitTotal = parseInt($.trim($("#countTotal").text()));
                            var waitdone = parseInt($.trim($("#countwaitdone").text()));
                            var countwaitback = parseInt($.trim($("#countwaitback").text()));
                            var countwaitcancel = parseInt($.trim($("#countwaitcancel").text()));
                            setTimeout(function () {
                                $("#countTotal").text(waitTotal + 1);
                                if (commandeBarre.Commande.state == 'Retour' || commandeBarre.Commande.state == 'AttenteLivraison') {
                                    if ((parseInt(commandeBarre.Commande.countRetour) + 1) > 2) {
                                        $("#countwaitcancel").text(countwaitcancel + 1);
                                    } else {
                                        $("#countwaitback").text(countwaitback + 1);
                                    }
                                }
                                if (commandeBarre.Commande.state == 'Annulée') {
                                    $("#countwaitcancel").text(countwaitcancel + 1);
                                }
                                if (commandeBarre.Commande.state == 'Non Traitée' || commandeBarre.Commande.state == 'Non Traitée depot' || commandeBarre.Commande.state == 'En Cours') {
                                    $("#countwaitdone").text(waitdone + 1);
                                }
                                $('tbody#CommaneInStock tr:first').before("<tr id='CommandeEnterStock' data-data-id='" + commandeBarre.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + commandeBarre.Commande.id + ", " + commandeBarre.Commande.ref + ")'></span></div> </td>\n\
                                                <td>" + commandeBarre.Commande.modified + "</td>\n\
                                                <td>" + commandeBarre.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + retour + "</td>\n\
                                                <td>" + commandeBarre.Commande.source + "</td>\n\
                                                <td>" + recuperateur + "</td>\n\
                                                <td>" + commandeBarre.User.full_name + "</td>\n\
                                                <td>" + commandeBarre.Receiver.full_name + "</td>\n\
                                                <td>" + commandeBarre.Receiver.adresse + "</td>\n\
                                                <td>" + commandeBarre.Receiver.Ville.name + "</td>\n\
                                                <td>\n\
                                                    <ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + commandeBarre.Commande.id + "'  class='btn btn-info btn-sm'>\n\
                                                        <i class='fa fa-eye'></i></a></div></li>\n\
                                                    </ul>\n\
                                                </td>\n\
                                                <td>" + affect + "</td>\n\
                                                <td>" + affect1 + "</td>\n\
                                            </tr>");
                            }, 200);
                        });
//                        $scope.checkboxModel = {
//                            value1: false
//                        };
//                        $("table").find("tr#CommandeEnterStock[data-data-id = '" + $("#modal-livraison-stock").attr('data-cmdid') + "']").html('<a href="#/affecter-commande-livreur/' + $("#modal-active-affectation").attr('data-cmdid') + '" class="btn btn-success btn-sm">Affecter livreur</a>');
//                        $("table").find("tr#CommandeEnterStock[data-data-id = '" + $("#modal-livraison-stock").attr('data-cmdid') + "'] #formAnnulation").html('<form name="myForm"><input  type="checkbox" id="CheckedBox" value="{{checkboxModel.value}}" ng-model="checkboxModel.value"></form>');
//                        setTimeout(function () {
//                        }, 500);
//                        setTimeout(function () {
//                        }, 500);
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //facturer commande annulée
            $scope.retourcommandeExpediteur = function () {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                $scope.AuthId = Auth;
//                //console.log(Auth);
                var dataCommande = {
                    Commande: {
                        id: $("#modal-commande-expediteur").attr('data-cmdid'),
                    }
                };
                var indexRow = $("#modal-commande-expediteur").attr('data-index');
                $scope.retourExpediteur = PostFactory.retourcommandeExpediteur(dataCommande).then(function (retourExpediteur) {
                    $uibModalInstance.close();
                    $scope.retourExpediteur = retourExpediteur;
                    if (retourExpediteur.type == 'success') {
                        toastr.success(retourExpediteur.text);
//                        $("tr.CommandeRowsAnnulee:eq(" + indexRow + ")").fadeOut('slow', function () {
//                            $(this).remove();
//                        });
                        $("tr#CommandeRowsAnnulee:eq(" + indexRow + ")").fadeOut('slow', function () {
                            $(this).remove();
                        });
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //valider commande dépôt
            $scope.ValidateAnnulationCommande = function () {
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                $scope.AuthId = Auth;
//                //console.log(Auth);
                var dataCommande = {
                    Commande: {
                        id: $("#modal-commande-annulee").attr('data-cmdid'),
                        state: 'Annulée',
                        isAnnule: true
                    }
                };
                var indexRow = $("#modal-commande-annulee").attr('data-index');
                $scope.vildeannuleeCommande = PostFactory.ValidateAnnulationCommande(dataCommande).then(function (vildeannuleeCommande) {
                    $uibModalInstance.close();
                    $scope.vildeannuleeCommande = vildeannuleeCommande;
                    if (vildeannuleeCommande.type == 'success') {
                        toastr.success(vildeannuleeCommande.text);
                        $("tr#CommandeRowsRetours:eq(" + indexRow + ")").fadeOut('slow', function () {
                            $(this).remove();
                        });
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete note de frais
            $scope.deleteFrais = function () {
                var dataFrais = {
                    Frai: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.frais = PostFactory.deleteFrais(dataFrais).then(function (frais) {
                    $uibModalInstance.close();
                    $scope.frais = frais;
                    toastr.success(frais.text);
                    $("tr#NoteFrais:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete product
            $scope.deleteProduct = function () {
                var dataProduct = {
                    Product: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.product = PostFactory.deleteProduct(dataProduct).then(function (product) {
                    $uibModalInstance.close($("#productSumbit").attr('data-product'));
                    $uibModalInstance.close();
                    $scope.product = product;
                    toastr.success(product.text);
                    $("tr#ProductRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete stock
            $scope.deleteStock = function () {
                var dataStock = {
                    Stock: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.stock = PostFactory.deleteStock(dataStock).then(function (stock) {
                    $uibModalInstance.close($("#stockSumbit").attr('data-stock'));
                    $uibModalInstance.close();
                    $scope.stock = stock;
                    toastr.success(stock.text);
                    $("tr#StockRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete famille
            $scope.deleteFamille = function () {
                var dataFamille = {
                    Famille: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.famille = PostFactory.deleteFamille(dataFamille).then(function (famille) {
                    $uibModalInstance.close($("#familleSumbit").attr('data-famille'));
                    $uibModalInstance.close();
                    $scope.famille = famille;
                    toastr.success(famille.text);
                    $("tr#FamilleRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete prime
            $scope.deletePrime = function () {
                var dataPrime = {
                    Prime: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.prime = PostFactory.deletePrime(dataPrime).then(function (prime) {
                    if (prime.type === 'success') {
                        $uibModalInstance.close($("#primeSumbit").attr('data-prime'));
                        $uibModalInstance.close();
                        toastr.success(prime.text);
                        $("table").find("tr[data-prime = '" + $("#login-box").attr('data-id') + "']").fadeOut('slow', function () {
                            $(this).remove();
                        });
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete cp
            $scope.deleteCp = function () {
                var dataCp = {
                    Cp: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.cp = PostFactory.deleteCp(dataCp).then(function (cp) {
                    $uibModalInstance.close($("#cpSumbit").attr('data-cp'));
                    $uibModalInstance.close();
                    $scope.cp = cp;
                    toastr.success(cp.text);
                    $("tr#CpRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete unite
            $scope.deleteUnite = function () {
                var dataUnite = {
                    Unite: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.unite = PostFactory.deleteUnite(dataUnite).then(function (unite) {
                    $uibModalInstance.close($("#uniteSumbit").attr('data-unite'));
                    $uibModalInstance.close();
                    $scope.unite = unite;
                    toastr.success(unite.text);
                    $("tr#UniteRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete fournisseur
            $scope.deleteFournisseur = function () {
                var dataFournisseur = {
                    Fournisseur: {
                        id: $("#login-box").attr('data-id')
                    }};
                var indexRow = $("#login-box").attr('data-index');
                $scope.fournisseur = PostFactory.deleteFournisseur(dataFournisseur).then(function (fournisseur) {
                    $uibModalInstance.close($("#fournisseurSumbit").attr('data-fournisseur'));
                    $uibModalInstance.close();
                    $scope.fournisseur = fournisseur;
                    toastr.success(fournisseur.text);
                    $("tr#FournisseurRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete client
            $scope.deleteClient = function () {
                var dataClient = {
                    User: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.client = PostFactory.deleteClient(dataClient).then(function (client) {
                    $uibModalInstance.close($("#clientSumbit").attr('data-client'));
                    $uibModalInstance.close();
                    $scope.client = client;
                    var string = document.location.hash;
                    if (string.indexOf("livreurs") !== -1) {
                        toastr.success('Livreur supprimé avec succès');
                    } else if (string.indexOf("employees") !== -1) {
                        toastr.success('Employé supprimé avec succès');
                    } else {
                        toastr.success(client.text);
                    }
                    $("table").find("tr[data-userclient = '" + $("#login-box").attr('data-id') + "']").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete categorie
            $scope.deleteCategory = function () {
                var dataCategory = {
                    Category: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.categorie = PostFactory.deleteCategory(dataCategory).then(function (categorie) {
                    $uibModalInstance.close($("#categorieSumbit").attr('data-categorie'));
                    $uibModalInstance.close();
                    $scope.categorie = categorie;
                    toastr.success(categorie.text);
                    $("tr#CategoryRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete tva
            $scope.deleteTva = function () {
                var dataTva = {
                    Tva: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.tva = PostFactory.deleteTva(dataTva).then(function (tva) {
                    $uibModalInstance.close($("#tvaSumbit").attr('data-tva'));
                    $uibModalInstance.close();
                    $scope.tva = tva;
                    toastr.success(tva.text);
                    $("tr#TvaRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete facture
            $scope.deleteFacture = function () {
                var dataFacture = {
                    Facture: {
                        id: $("#DeleteFacture").attr('data-id')
                    }
                };
                var indexRow = $("#DeleteFacture").attr('data-index');
                $scope.facture = PostFactory.deleteFacture(dataFacture).then(function (facture) {
                    $uibModalInstance.close($("#factureSumbit").attr('data-facture'));
                    $uibModalInstance.close();
                    $scope.facture = facture;
                    toastr.success(facture.text);
                    $("tr#FactureRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete commande
            $scope.deleteCommande = function () {
                var dataCommande = {
                    Commande: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.commande = PostFactory.deleteCommande(dataCommande).then(function (commande) {
                    $uibModalInstance.close($("#commandeSumbit").attr('data-commande'));
                    $uibModalInstance.close();
                    $scope.commande = commande;
                    toastr.success(commande.text);
                    $("tr#CommandeRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete commande transport
            $scope.deleteCommandeTransport = function () {
                var dataCommande = {
                    Commande: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.commande = PostFactory.deleteCommande(dataCommande).then(function (commande) {
                    $uibModalInstance.close($("#commandeSumbit").attr('data-commande'));
                    $uibModalInstance.close();
                    $scope.commande = commande;
                    toastr.success(commande.text);
//                    $("tr#CommandeRows:eq(" + indexRow + ")").fadeOut('slow', function () {
//                        $(this).remove();
//                    });
                    $("table").find("tr[data-commandeuser = '" + $("#login-box").attr('data-id') + "']").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //delete devis
            $scope.deleteDevi = function () {
                var dataCommande = {
                    Commande: {
                        id: $("#login-box").attr('data-id')
                    }
                };
                var indexRow = $("#login-box").attr('data-index');
                $scope.commande = PostFactory.deleteDevi(dataCommande).then(function (commande) {
                    $uibModalInstance.close($("#commandeSumbit").attr('data-commande'));
                    $uibModalInstance.close();
                    $scope.commande = commande;
                    toastr.success(commande.text);
                    $("tr#CommandeRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            // tranform devis in BL
            $scope.livraisonCommande = function () {
                var dataFactureLivraison = {
                    Commande: {
                        id: $("#modal-header-bl").attr('data-cmdid'),
                        date_livraison: $("#date_livraison").val(),
                        acompte: $("#acompte").val(),
                        isLivraison: false
                    }
                };
                var indexRow = $("#modal-header-bl").attr('data-index');
                $scope.commande = PostFactory.livraisonCommande(dataFactureLivraison).then(function (commande) {
                    $uibModalInstance.close($("#Livaraison_commande").attr('data-cmd'));
                    $uibModalInstance.close();
                    //                    $('#myModalContent.html').hide();

                    $scope.commande = commande;
                    toastr.success("Changement Bon de commande en bon de livraison");
                    $("tr#CommandeRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                        $(this).remove();
                    });
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            //            tranform devis in BL + Facture
            $scope.livraisonFacture = function () {
                var dataFactureLivraison = {
                    Commande: {
                        id: $("#modal-header-bl-f").attr('data-cmdid'),
                        date_livraison: null,
                        payment_id: $("#SelectPayment").val(),
                        acompte: $("#acompte").val(),
                        isLivraison: false
                    }
                };
                var indexRow = $("#modal-header-bl-f").attr('data-index');
                $scope.commande = PostFactory.livraisonFacture(dataFactureLivraison).then(function (commande) {
                    $uibModalInstance.close($("#Livaraison_facture").attr('data-cmd'));
                    $uibModalInstance.close();
                    $scope.commande = commande;
//                    //console.log(commande);
                    if (commande.type == 'success') {
                        toastr.success(commande.text);
                        $location.path('/gestion-factures');
                    } else {
                        toastr.success('Erreur de changement');
                    }
                    var string = document.location.hash;
                    // indexOf if contain (if exeist mot)
                    if (string.indexOf("livraison") == -1) {
                        $("tr#CommandeRows:eq(" + indexRow + ")").fadeOut('slow', function () {
                            $(this).remove();
                        });
                    } else {
                        $("tr#CommandeRows:eq(" + indexRow + ") #Livaraison_facture").fadeOut('slow', function () {
                            $(this).remove();
                        });
                    }
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
            // start add client
            $scope.ajoutNewClient = function ($event) {
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
                var dataClient = {
                    User: {
                        last_name: $("#last_name").val(),
                        first_name: $("#first_name").val(),
                        type_client: $('#TypeClient :selected').val(),
                        etat_client: etat_client,
                        phone: $("#phone").val(),
                        email: $("#email").val(),
                        adress: $("#adress").val(),
                        postal: $("#postal").val(),
                        ville_id: ville_id,
                        raison_social: $("#raison_social").val(),
                        commerciale_id: $('#commercialeValue :selected').val(),
                        matricule: $("#matricule").val(),
                        codetva: $("#codetva").val(),
                        code_category: $("#code_category").val(),
                        num_etab: $("#num_etab").val()
                    },
//                    Data: []
                };
                $("#PaymentUser li input").each(function (index, valeur) {
                    if ($(valeur).is(':checked')) {
                        var payment_id = $(valeur).attr("data-data-id");
                        ////console.log(payment_id);
                        dataClient.Data.push({id: payment_id});
                    }
                });
                ////console.log(dataClient.Data);
                $scope.client = PostFactory.ajoutNewClient(dataClient).then(function (client) {
                    $uibModalInstance.close();
                    $scope.client = client;
                    toastr.success(client.text);
//                    //console.log(client);
                    setTimeout(function () {
                        $("#SelectUser").append("<option value=" + client.data.id + " data-etat=" + client.data.etat_client + " data-name=" + client.data.last_name + " data-prenom=" + client.data.first_name + " data-adresse=" + client.data.adress + " data-phone=" + client.data.phone + " data-commerciale=" + client.data.commerciale_id + ">" + client.data.full_name + "</option>");
                    }, 300);
                    setTimeout(function () {
                        $("select#SelectUser option[value='" + client.data.id + "']").attr('selected', 'selected');
                        $("#select2-SelectUser-container .select2-selection__placeholder").text($("select#SelectUser option[value='" + client.data.id + "']").text());
                        $("#NameUser").text(client.data.first_name);
                        $("#PrenomUser").text(client.data.last_name);
                        $("#AdresseUser").text(client.data.adress);
                        $("#PhoneUser").text(client.data.phone);
                    }, 500);
                },
                        function (msg) {
                            alert(msg);
                        });
            };
            //validation commande par livreur
            $scope.validerAttenteLivraison = function ($event) {
                $event.preventDefault();
                var cause = null;
                var state = null;
                var isAnnule = false;
                var count = 0;
                var isStock = 1;
                if ($("#checkboxLivraison").val() == 1) {
                    state = 'Livrée';
                    count = count + 1;
                    isStock = 0;
                }
                if ($("#checkboxAbsenceDEST").val() == 1) {
                    state = 'Retour';
                    cause = 'Absence Destinataire';
                    count = count + 1;
                }
                if ($("#checkboxReporterDEST").val() == 1) {
                    state = 'Retour';
                    cause = 'Reporter Destinataire';
                    count = count + 1;
                }
                if ($("#checkboxReporterLivreur").val() == 1) {
                    state = 'Retour';
                    cause = 'Reporter Livreur';
                    count = count + 1;
                }
                if ($("#checkboxErreurDEST").val() == 1) {
                    state = 'Retour';
                    cause = 'Erreur de Destinataire';
                    count = count + 1;
                }
                if ($("#checkboxErreurDESTINATION").val() == 1) {
                    state = 'Retour';
                    cause = 'Erreur Destination';
                    count = count + 1;
                }
                if ($("#checkboxTelFermer").val() == 1) {
                    state = 'Retour';
                    cause = 'Téléphone fermé';
                    count = count + 1;
                }
                if ($("#checkboxAutre").val() == 1) {
                    state = 'Retour';
                    cause = $("#autreCause").val();
                    count = count + 1;
                }
                if ($("#checkboxInjoignable").val() == 1) {
                    state = 'Retour';
                    cause = 'Injoignable';
                    count = count + 1;
                }
                if ($("#checkboxAnnulDEST").val() == 1) {
                    state = 'Annulée';
                    isAnnule = true;
                    cause = 'Annulation Destinataire';
                    count = count + 1;
                }
                //console.log(count);
                var dataCommande = {
                    Commande: {
                        id: $("#valideAttente").attr('data-cmdid'),
                        state: state,
                        cause_nonlivraison: cause,
                        isStock: isStock
                    }
                };
                var indexRow = $("#valideCommande").attr('data-index');
                if (parseInt(count) == 0) {
                    toastr.error("Veuillez choisir la statut de livraison de commande");
                } else if (parseInt(count) > 1) {
                    toastr.error('Plusieurs statuts choisis');
                } else {
                    $scope.livreurcommandelivree = PostFactory.validerAttenteLivraison(dataCommande).then(function (livreurcommandelivree) {
                        $scope.livreurcommandelivree = livreurcommandelivree;
                        if (livreurcommandelivree.type == 'success') {
                            $uibModalInstance.close();
                            toastr.success(livreurcommandelivree.text);
                            $("table").find("tr[data-livree = '" + $("#valideAttente").attr('data-cmdid') + "']").fadeOut('slow', function () {
                                $(this).remove();
                            });
                            var id = $("#valideAttente").attr('data-cmdid');
                            $scope.commande = PostFactory.showCommande(id).then(function (commandeBarre) {
                                $scope.commandeview = commandeBarre;
                                var recuperateur = '';
                                var state = commandeBarre.Commande.state;
                                var retour = '';
                                if (commandeBarre.Commande.type_remettre == 'Ramassage') {
                                    recuperateur = commandeBarre.Livreur.first_name + " " + commandeBarre.Livreur.last_name;
                                }
                                if (commandeBarre.Commande.type_remettre == 'Depot') {
                                    recuperateur = 'Déposée';
                                }
                                if (commandeBarre.Commande.state == 'Retour' || commandeBarre.Commande.state == 'AttenteLivraison') {
                                    state = '<label class="label label-info label-sm">Retour (' + (parseInt(commandeBarre.Commande.countRetour)) + ')</label>';
                                    retour = commandeBarre.Commande.cause_nonlivraison;
                                    if (commandeBarre.Commande.cause_nonlivraison == null) {
                                        retour = 'Opération système';
                                    }
                                }
                                if (commandeBarre.Commande.state == 'Annulée') {
                                    state = '<label class="label label-danger label-sm">Annulation (' + (parseInt(commandeBarre.Commande.countRetour) + 1) + ')</label>';
//                                                    retour = '<label class="btn btn-sm btn-danger">' + commandeBarre.Commande.cause_nonlivraison + '(' + commandeBarre.Commande.countRetour + ')' + '</label>'
                                    retour = commandeBarre.Commande.cause_nonlivraison;
                                }
                                if (commandeBarre.Commande.state == 'Non Traitée' || commandeBarre.Commande.state == 'Non Traitée depot' || commandeBarre.Commande.state == 'En Cours') {
                                    state = '<label class="label label-success label-sm">En attente livraison</label>';
                                }
                                var affect = "<ul class='nav nav-pills'><li><div><a href='#/affecter-commande-livreur/" + commandeBarre.Commande.id + "' class='btn btn-success btn-sm'>Affecter livreur</a></div></li></ul>";
                                var affect1 = "<form name='myForm'><input  type='checkbox' id='CheckedBox' value='{{checkboxModel.value}}' ng-model='checkboxModel.value'></form>";
                                if ((parseInt(commandeBarre.Commande.countRetour)) > 2) {
                                    affect = '';
                                    affect1 = '';
                                }
                                var waitTotal = parseInt($.trim($("#countTotal").text()));
                                var waitdone = parseInt($.trim($("#countwaitdone").text()));
                                var countwaitback = parseInt($.trim($("#countwaitback").text()));
                                var countwaitcancel = parseInt($.trim($("#countwaitcancel").text()));
                                setTimeout(function () {
                                    $("#countTotal").text(waitTotal + 1);
                                    if (commandeBarre.Commande.state == 'Retour' || commandeBarre.Commande.state == 'AttenteLivraison') {
                                        if ((parseInt(commandeBarre.Commande.countRetour) + 1) > 2) {
                                            $("#countwaitcancel").text(countwaitcancel + 1);
                                        } else {
                                            $("#countwaitback").text(countwaitback + 1);
                                        }
                                    }
                                    if (commandeBarre.Commande.state == 'Annulée') {
                                        $("#countwaitcancel").text(countwaitcancel + 1);
                                    }
                                    if (commandeBarre.Commande.state == 'Non Traitée' || commandeBarre.Commande.state == 'Non Traitée depot' || commandeBarre.Commande.state == 'En Cours') {
                                        $("#countwaitdone").text(waitdone + 1);
                                    }
                                    $('tbody#CommaneInStock tr:first').before("<tr id='CommandeEnterStock' data-data-id='" + commandeBarre.Commande.id + "'>\n\
                                                <td><div><span class='glyphicon glyphicon-info-sign' ng-controller='ModalHistorqueCommandeCtrl' ng-click='open(" + commandeBarre.Commande.id + ", " + commandeBarre.Commande.ref + ")'></span></div> </td>\n\
                                                <td>" + commandeBarre.Commande.modified + "</td>\n\
                                                <td>" + commandeBarre.Commande.ref + "</td>\n\
                                                <td>" + state + "</td>\n\
                                                <td>" + retour + "</td>\n\
                                                <td>" + commandeBarre.Commande.source + "</td>\n\
                                                <td>" + recuperateur + "</td>\n\
                                                <td>" + commandeBarre.User.full_name + "</td>\n\
                                                <td>" + commandeBarre.Receiver.full_name + "</td>\n\
                                                <td>" + commandeBarre.Receiver.adresse + "</td>\n\
                                                <td>" + commandeBarre.Receiver.Ville.name + "</td>\n\
                                                <td>\n\
                                                    <ul class='nav nav-pills'><li><div><a href='#/view-commande-client/" + commandeBarre.Commande.id + "'  class='btn btn-info btn-sm'>\n\
                                                        <i class='fa fa-eye'></i></a></div></li>\n\
                                                    </ul>\n\
                                                </td>\n\
                                                <td>" + affect + "</td>\n\
                                                <td>" + affect1 + "</td>\n\
                                            </tr>");
                                }, 200);
                            });
                        } else {
                            toastr.error(livreurcommandelivree.text);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            }
                    );
                }
            };
        });
