angular.module('MetronicApp')
        .controller('AdduserController', function ($rootScope, $scope, $http, $timeout, PointageFactory, $location) {
            $scope.adduser = function ($event) {
                $event.preventDefault();
                var datauser = {
                    Userr: {
                        login: $('#login_user').val(),
                        password: $('#password_user').val(),
                        first_name: $('#firstname_user').val(),
                        last_name: $('#lasttname_user').val(),
                        phone: $('#phone_user').val(),
                        email: $('#email_user').val()
                    }
                };
                $scope.useradd = PointageFactory.adduser(datauser).then(function (user) {
                    if (user.type === "success") {
                        toastr.info(user.text);
                        $location.path("/listeuser");
                    }
                });
            };
            PointageFactory.listeusers().then(function (list) {
                $scope.listeruser = list.data;
            });
        })
        .controller('pointageController', function ($rootScope, $scope, $http, $timeout, PointageFactory, $location, $cookieStore) {
            $scope.path_pointage = function () {
                PointageFactory.showConfigGlobal().then(function (config) {
                    $scope.config = config.data;
                    console.log(config);
                    if (config.data.Configuration.type_pointage === "Manuel") {
                        $location.path('/gestion-presences');
                    } else {
                        $location.path('/gestion-presences-automatique');
                    }

                });
            }
            //initialisation de fichier type image 
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
            //list ville 
            PointageFactory.listVilles().then(function (villes) {
                $scope.villes = villes;
            },
                    function (msg) {
                        alert(msg);
                    }
            );
            $scope.addemployee = function ($event) {
                $event.preventDefault();
                function ifEmptyFormAddEmployee() {
                    var ifValideForm = true;
                    if ($scope.first_name == undefined) {
                        ifValideForm = false;
                        $scope.msgErrorFirstName = "Veuillez saisir un first name";
                    } else {
                        $scope.msgErrorFirstName = null;
                    }
                    if ($scope.last_name == undefined) {
                        ifValideForm = false;
                        $scope.msgErrorLastName = "Veuillez saisir un last name";
                    } else {
                        $scope.msgErrorLastName = null;
                    }

                    return ifValideForm;
                }
                if (ifEmptyFormAddEmployee() == true) {
                    var dataemploye = {
                        User: {
                            first_name: $('#firstname_employ').val(),
                            last_name: $('#lasttname_employ').val(),
                            num_cin: $('#cin_employ').val(),
                            statu: $('#statu_employ').val(),
                            num_cnss: $('#cnss_employ').val(),
                            situation_familiale: $('#situationFamiliale :selected').val(),
                            ville_id: $('#villeValue :selected').val() || 0,
                            isFamille: $('#CheckedBox').val(),
                            adress: $('#adress').val(),
                            count_kids: $('#enfant_employ').val() || 0,
                            phone: $('#phone_employ').val(),
                            email: $('#email_employ').val(),
                            salaire: $('#salaire_employ').val() || 0,
                            role_id: 7
                        }
                    };
//                    console.log(dataemploye);
                    $scope.employadd = PointageFactory.addemployee(dataemploye).then(function (employe) {
                        if (employe.type === "success") {
                            toastr.info(employe.text);
                            $location.path("/gestion-employees");
                        }
                    });
                }
            };
            PointageFactory.listemploye().then(function (employe) {
                $scope.listeremploy = employe.data;
                console.log(employe.data);
            });
            $scope.editsalaire = function ($event) {
                $event.preventDefault();
                angular.element($event.target).hide();
                angular.element($event.target).parent().children().eq(1).show();
            };
            setTimeout(function () {
                $scope.$apply(function () {
                    var total = 0;
                    angular.forEach($("#listBL1 tr"), function (value, index) {
                        total += parseFloat($(value).children().eq(8).children().eq(0).text());
                    });
                    $scope.total = total;
                });
            }, 2000);
            $scope.checkboxModel = {
                value1: false
            };
            var id = parseInt($location.path().split('/')[2]);
            if (id) {
                var date = new Date();
                $scope.moisFiche = {format: 'MMMM', date: date};
                $scope.anneeFiche = {format: 'yyyy', date: date};
                $scope.employedit = PointageFactory.viewEmployee(id).then(function (employe) {
                    $scope.employedit = employe.text;
                    var TH = employe.TH;
                    if (TH > employe.TH_glob) {
                        TH = employe.TH_glob;
                    }
                    $scope.TH = TH;
                    $scope.HS = employe.hs_total;
                    setTimeout(function () {
                        var total_net = 0;
                        angular.forEach($('#rowsFiche tr.rowFiche'), function (value, index) {
                            console.log($(value).children().eq(4).text());
                            total_net += parseFloat($(value).children().eq(4).text());
                        });
                        $scope.$apply(function () {
                            $scope.total_net = parseFloat(total_net).toFixed(3);
                        });
                    }, 2000);
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.checkboxModel = {
                                value1: employe.text.User.isFamille
                            };
                        });
                    }, 1000);
                });
                $scope.config = PointageFactory.showConfig().then(function (config) {
                    $scope.config = config;
                    console.log(config);
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.editEmployee = function ($event) {
                    $event.preventDefault();
                    var dataemploye = {
                        User: {
                            id: id,
                            first_name: $('#first_name').val(),
                            last_name: $('#last_name').val(),
                            num_cin: $('#num_cin').val(),
                            status: $('#statu').val(),
                            num_cnss: $('#num_cnss').val(),
                            situation_familiale: $('#situationFamiliale :selected').val(),
                            ville_id: $('#villeValue :selected').val() || 0,
                            adress: $('#adress').val(),
                            isFamille: $('#CheckedBox').val(),
                            count_kids: $('#count_kids').val(),
                            phone: $('#phone').val(),
                            email: $('#email').val(),
                            salaire: $('#salaire').val()
                        }
                    };
                    $scope.employedit = PointageFactory.editEmployee(dataemploye).then(function (employe) {
                        if (employe.type === 'success') {
                            $location.path('/gestion-employees');
                            toastr.success(employe.text);
                        }
                    });
                };
            }


            $scope.calculer_net = function ($event) {
                $event.preventDefault();
                var salaire_brut = $("#salaire_brut").val();
                var chef_famille = $("#chef_famille").val();
                var enfant_encharge = $("#enfant_encharge").val();
            }
            $scope.salaireBrut = 0;
            $scope.changebrut = function () {

                var salaire_brut = parseFloat($("#salaire_b").val()).toFixed(3);
//                console.log(salaire_brut);

                var retenuecnss = parseFloat(salaire_brut * parseFloat(9.18 / 100)).toFixed(3);
                var salaireimposablebrut = parseFloat(salaire_brut - retenuecnss).toFixed(3);
                var frais_prof = (salaireimposablebrut * 12) * 0.1;
                if (frais_prof > 2000) {
                    frais_prof = 2000;
                }
                var chef_famille_val = $("#chef_famille").val();
                var chef_famille = 0;
                setTimeout(function () {
                    if ($("#chef_famille").val() == "true" || $("#chef_famille").val() == true || $("#chef_famille").val() == 1) {

                        chef_famille = 150;
                        console.log(chef_famille);
                        console.log(chef_famille_val);
                    }
                }, 300);
                var enfant_encharge = $("#enfant_encharge").val();
                if (enfant_encharge == 0 || "") {
                    enfant_encharge = 0;
                } else if (enfant_encharge == 1) {
                    enfant_encharge = 90;
                } else if (enfant_encharge == 2) {
                    enfant_encharge = 165;
                } else if (enfant_encharge == 3) {
                    enfant_encharge = 225;
                } else if (enfant_encharge == 4) {
                    enfant_encharge = 270;
                } else {
                    enfant_encharge = 270;
                }
                setTimeout(function () {
                    var brut = parseFloat((salaireimposablebrut * 12) - frais_prof - chef_famille - enfant_encharge).toFixed(3);
                    var irpp = 0;
                    if (brut <= 5000) {
                        irpp = parseFloat(0).toFixed(3);
                    } else {
                        if (brut > 50000) {
                            irpp = parseFloat((((brut - 50000) * (35 / 100)) + parseFloat(13100)) / 12).toFixed(3);
                        } else if (brut > 30000) {
                            irpp = parseFloat((((brut - 30000) * (32 / 100)) + parseFloat(6700)) / 12).toFixed(3);
                        } else if (brut > 20000) {
                            irpp = parseFloat((((brut - 20000) * (28 / 100)) + parseFloat(3900)) / 12).toFixed(3);
                        } else if (brut > 5000) {
                            irpp = parseFloat((brut - 5000) * (26 / 100) / 12).toFixed(3);
                        }
                    }
//                    console.log(brut);
//                    console.log(chef_famille);
                    var net = parseFloat(salaire_brut - retenuecnss - irpp).toFixed(3);
                    $("#shownet").hide();
                    $("#showSalaire").show();
                    $("#salaire_brut").text(salaire_brut);
                    $("#retenuecnss").text(retenuecnss);
                    $("#irpp").text(irpp);
                    $("#net").text(net);
                }, 500);
            }
            $scope.salaireNet = 0;
            $scope.changenet = function () {
                console.log('here');
                setTimeout(function () {
                    $scope.$apply(function () {
                        var salaire_net = parseFloat($("#salaire_n").val()).toFixed(3);
                        var salairen = $("#salaire_n").val();
                        var chef_famille = $("#ch_famille").val();
                        if ($("#ch_famille").val() == "true" || $("#ch_famille").val() == true || $("#ch_famille").val() == 1) {
                            chef_famille = 150;
                        } else {
                            chef_famille = 0;
                        }
                        var enfant_encharge = $("#enfant_charge").val();
                        if (enfant_encharge == 0 || "") {
                            enfant_encharge = 0;
                        } else if (enfant_encharge == 1) {
                            enfant_encharge = 90;
                        } else if (enfant_encharge == 2) {
                            enfant_encharge = 165;
                        } else if (enfant_encharge == 3) {
                            enfant_encharge = 225;
                        } else if (enfant_encharge == 4) {
                            enfant_encharge = 270;
                        } else {
                            enfant_encharge = 270;
                        }
                        var deux_bruts = false;
                        var snfois12 = parseFloat(salairen * 12).toFixed(3);
                        var total_deduct_A = parseFloat(chef_famille) + parseFloat(enfant_encharge);
                        var irpp2 = "0.000";
                        var salaire_imp_brut_50000 = parseFloat((snfois12 - (0.35 * total_deduct_A) - 5100) / 7.8).toFixed(3);
                        var salaire_imp_brut_30000 = parseFloat((snfois12 - (0.32 * total_deduct_A) - 3540) / 8.16).toFixed(3);
                        var salaire_imp_brut_20000 = parseFloat((snfois12 - (0.28 * total_deduct_A) - 2260) / 8.64).toFixed(3);
                        var salaire_imp_brut_5000_1 = parseFloat((snfois12 - (0.26 * total_deduct_A) - 1820) / 8.88).toFixed(3);
                        var salaire_imp_brut_5000_2 = parseFloat((snfois12 - (0.26 * total_deduct_A) - 1300) / 9.192).toFixed(3);
                        var salaire_imp_brut_inf_5000 = salairen;

                        function frais_prof(salaireimposablebrut) {
                            var fp = (salaireimposablebrut * 12) * 0.1;
                            if (fp > 2000) {
                                fp = 2000;
                            }
                            return fp;
                        }
                        var b1 = (/*10.8 * */ 12 * salaire_imp_brut_50000) - total_deduct_A - frais_prof(salaire_imp_brut_50000);
                        var b2 = (/*10.8 * */ 12 * salaire_imp_brut_30000) - total_deduct_A - frais_prof(salaire_imp_brut_30000);
                        var b3 = (/*10.8 * */ 12 * salaire_imp_brut_20000) - total_deduct_A - frais_prof(salaire_imp_brut_20000);
                        var b4 = (/*10.8 * */ 12 * salaire_imp_brut_5000_1) - total_deduct_A - frais_prof(salaire_imp_brut_5000_1);
                        var b5 = (/*10.8 * */ 12 * salaire_imp_brut_5000_2) - total_deduct_A - frais_prof(salaire_imp_brut_5000_2);
                        var b6 = (/*10.8 * */ 12 * salaire_imp_brut_inf_5000) - total_deduct_A - frais_prof(salaire_imp_brut_inf_5000);
                        /******************calcul de IRPP**********************/
//                var message = "";
                        var irpp, sib;
                        if (b1 > 50000) {
                            irpp = parseFloat((((b1 - 50000) * (35 / 100)) + parseFloat(13100)) / 12).toFixed(3);
                            //b = parseFloat(b1 / 12).toFixed(3);
                            sib = salaire_imp_brut_50000;
                        } else if ((b2 > 30000) && (b2 <= 50000)) {
                            irpp = parseFloat((((b2 - 30000) * (32 / 100)) + parseFloat(6700)) / 12).toFixed(3);
                            //b = parseFloat(b2 / 12).toFixed(3);
                            sib = salaire_imp_brut_30000;
                        } else if ((b3 > 20000) && (b3 <= 30000)) {
                            irpp = parseFloat((((b3 - 20000) * (28 / 100)) + parseFloat(3900)) / 12).toFixed(3);
                            //b = parseFloat(b3 / 12).toFixed(3);
                            sib = salaire_imp_brut_20000;
                        } else if ((b4 > 5000) && (b4 <= 20000) && (salaire_imp_brut_5000_1 > 2000 / 1.2)) {
                            irpp = parseFloat(((b4 - 5000) * (26 / 100)) / 12).toFixed(3);
                            //b = parseFloat(b4 / 12).toFixed(3);
                            sib = salaire_imp_brut_5000_1;
//                    if (b6 < 5000) {
//                        deux_bruts = true;
//                        irpp2 = 0;
////                     b2 = parseFloat(b6 / 12).toFixed(3);
//                        var sib2 = salaire_imp_brut_inf_5000;
////                     message = "2ème valeur : compte tenu de l'exonération du revenu annuel net qui ne dépasse pas 5000 DT";
//                    }
                        } else if ((b5 > 5000) && (b5 <= 20000)) {
                            irpp = parseFloat(((b5 - 5000) * (26 / 100)) / 12).toFixed(3);
                            //b = parseFloat(b5 / 12).toFixed(3);
                            sib = salaire_imp_brut_5000_2;
//                    if (b6 < 5000) {
//                        deux_bruts = true;
//                        irpp2 = 0;
//                        //b2 = parseFloat(b6 / 12).toFixed(3);
//                        var sib2 = salaire_imp_brut_inf_5000;
////                     message = "2ème valeur : compte tenu de l'exonération du revenu annuel net qui ne dépasse pas 5000 DT";
//                    }
                        } else if (b6 <= 5000) {
                            irpp = 0;
                            //b = parseFloat(b6 / 12).toFixed(3);
                            sib = salaire_imp_brut_inf_5000;
//                    message = "Compte tenu de l'exonération du revenu annuel net qui ne dépasse pas 5000 DT.";
                        }
                        var cnss = parseFloat(sib * 0.10108).toFixed(3);
                        var brut = parseFloat(sib) + parseFloat(cnss);
                        brut = brut.toFixed(3);
                        if (deux_bruts) {
                            var cnss2 = parseFloat(sib2 * 0.10108).toFixed(3);
                            var brut2 = parseFloat(sib2) + parseFloat(cnss2);
                            brut2 = brut2.toFixed(3);
                            brut = brut + brut2;
                            cnss = cnss + cnss2;
                            irpp = irpp + irpp2;
                        }
                        $("#showNet").show();
                        $("#brut_salaire").text(brut);
                        $("#cnssbrut").text(cnss);
                        $("#irppbrut").text(irpp);
                        $("#salaire_net").text(salaire_net);

                    });
                }, 500);

            }

            $scope.clique_net = function ($event) {
                $event.preventDefault();
                $("#s_net").hide();
                $("#s_brut").show();
            }
            $scope.clique_brut = function ($event) {
                $event.preventDefault();
                $("#s_brut").hide();
                $("#s_net").show();
            };
            $scope.edits = function ($event) {
//                $event.preventDefault();
                console.log('datasalaire');
                if ($event.which === 13) {
//                    console.log('jgjhghyf');
                    var datasalaire = {
                        User: {
                            salaire: angular.element($event.target).val(),
                            id: angular.element($event.target).attr('data-employee'),
                        }
                    };
                    console.log(datasalaire);
                    PointageFactory.editemployee(datasalaire).then(function (employe) {


                        if (employe.type === "success") {
                            toastr.info(employe.text);
                            PointageFactory.listemploye().then(function (employe) {
                                $scope.listeremploy = employe.data;
                            });
//                            $location.path("/listemploye");
                            angular.element($event.target).show();
                            angular.element($event.target).parent().children().eq(1).hide();
                        }
                    });
                }
            };

            $scope.addemail = function ($event) {
                $event.preventDefault();
                var file = $scope.myFile;
                var dataemail = {
                    User: {
                        email: $('#email').val(),
                        objet: $("#objet").val(),
                        content: $("#content").val(),
                        preuve: file

                    }
                };
                console.log(dataemail);
                PointageFactory.addemail(dataemail).then(function (email) {
                    if (email.type === "success") {
                        toastr.info(email.text);
                        $('.myModal_Email').modal('toggle');
                    }
                });
            };
            PointageFactory.listEmployeesExport().then(function (users) {
                $scope.items = users;
                console.log(users);
            },
                    function (msg) {
                        alert(msg);
                    }
            );
            $scope.exportDataemploye = function () {
                alasql('SELECT * INTO XLSX("list_employee.xlsx",{headers:true}) FROM ?', [$scope.items]);
            };
            $scope.generatePDF = function () {
                alasql('SELECT * INTO XLSX("list_employee.xlsx",{headers:true}) FROM ?', [$scope.items]);
            };
            $scope.items = PointageFactory.listEmployeesExport().then(function (users) {
                $scope.items = users;
//                console.log(users)
            },
                    function (msg) {
                        alert(msg);
                    }
            );
        })
        .controller('PresenceCtrl', function ($scope, $location, $uibModal, $log, $cookieStore, PointageFactory) {
            $scope.pointage = function ($event, user_id) {
                $event.preventDefault();
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var datecurent = yyyy + "-" + mm + "-" + dd;
                var date_entree_matin = null;
                var date_sortie_matin = null;
                var date_entre_midi = null;
                var date_sorti_midi = null;
                if ($event.currentTarget.getAttribute('data-empointage') !== "")
                {
//                    date_entree_matin = datecurent + " " + angular.element($event.target.parentNode.parentNode.parentNode.parentNode).children().eq(1).children().children().children().val() + ":00";
                    date_entree_matin = $event.currentTarget.getAttribute('data-empointage');
                }
                if ($event.currentTarget.getAttribute('data-smpointage') !== "")
                {
                    date_sortie_matin = $event.currentTarget.getAttribute('data-smpointage');
                }
                if ($event.currentTarget.getAttribute('data-espointage') !== "")
                {
                    date_entre_midi = $event.currentTarget.getAttribute('data-espointage');
                }
                if ($event.currentTarget.getAttribute('data-sspointage') !== "")
                {
                    date_sorti_midi = $event.currentTarget.getAttribute('data-sspointage');
                }
                var datapresence = {
                    Presence: {
                        user_id: user_id,
                        date_entree: date_entree_matin,
                        date_sortie: date_sortie_matin,
                        date_entree_midi: date_entre_midi,
                        date_sortie_midi: date_sorti_midi,
                        date: $('#dateChanger').val().split('-')[2] + '-' + $('#dateChanger').val().split('-')[1] + '-' + $('#dateChanger').val().split('-')[0]
                    }
                };
                console.log(datapresence);
                PointageFactory.pointage(datapresence).then(function (employe) {
                    if (employe.type === "success") {
                        toastr.info(employe.text);
                    }
                });
            };

            function currentDateTime(time) {
                var hours = time.getHours();
                var minutes = time.getMinutes();
                hours = hours < 10 ? '0' + hours : hours; // the hour '0' should be '12';
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var dateTime = new Date().toISOString().slice(0, 10).replace('T', ' ') + " " + hours + ":" + minutes + ":00";
                if ($('#dateChanger').val() !== '') {
                    var data = $('#dateChanger').val().split('-')[2] + '-' + $('#dateChanger').val().split('-')[1] + '-' + $('#dateChanger').val().split('-')[0];
                    var dateTime = new Date(data).toISOString().slice(0, 10).replace('T', ' ') + " " + hours + ":" + minutes + ":00";
                }
                return dateTime;
            }
            $scope.updateEmPointage = function (obj, $index) {
                console.clear();
                angular.forEach(obj, function (value, index) {
                    if (index == "emPointage") {
                        console.log(currentDateTime(value[$index]));
                        $("#tableId table tbody tr:eq(" + $index + ")").find("button#submitPointage").attr('data-empointage', currentDateTime(value[$index]));
                    }
                });
            };
            $scope.updateSmPointage = function (obj, $index) {
                console.clear();
                angular.forEach(obj, function (value, index) {
                    if (index == "smPointage") {
                        console.log(currentDateTime(value[$index]));
                        $("#tableId table tbody tr:eq(" + $index + ")").find("button#submitPointage").attr('data-smpointage', currentDateTime(value[$index]));
                    }
                });
            };
            $scope.updateEsPointage = function (obj, $index) {
                console.clear();
                angular.forEach(obj, function (value, index) {
                    if (index == "esPointage") {
                        console.log(currentDateTime(value[$index]));
                        $("#tableId table tbody tr:eq(" + $index + ")").find("button#submitPointage").attr('data-espointage', currentDateTime(value[$index]));
                    }
                });
            };
            $scope.updateSsPointage = function (obj, $index) {
                console.clear();
                angular.forEach(obj, function (value, index) {
                    if (index == "ssPointage") {
                        console.log(currentDateTime(value[$index]));
                        $("#tableId table tbody tr:eq(" + $index + ")").find("button#submitPointage").attr('data-sspointage', currentDateTime(value[$index]));
                    }
                });
            };
            PointageFactory.listpresence().then(function (employe) {
                $scope.listerpresence = employe.data;
//                console.log(employe.data);
            });
            PointageFactory.listAnneesPointage().then(function (anneespointage) {
                $scope.anneespointage = anneespointage;
                console.log(anneespointage);
            },
                    function (msg) {
                        alert(msg);
                    }
            );
            PointageFactory.listemploye().then(function (employe) {
                $scope.listeremploy = employe.data;
                console.log(employe.data);
            });
            $scope.datePaie = function ($val) {
                var TablePresence = {
                    Presence: {
                        mois: $("#moisPointage :selected").val(),
                        annee: $("#anneePointage :selected").val()
                    }
                };

                if ($val === 'annee') {
                    if ($("#moisPointage :selected").val() === '') {
                        toastr.info('Veuillez choisir un mois');
                    } else {
                        PointageFactory.listepointage(TablePresence).then(function (pointages) {
                            $scope.listeEmpJour = true;
                            $scope.collapseDays = function () {
                                if ($scope.listeEmpJour == true) {
                                    $scope.listeEmpJour = false;
                                } else {
                                    $scope.listeEmpJour = true;
                                }
                            };
                            $scope.pointages = pointages;
                            var now = new Date();
                            var mois = $("#moisPointage :selected").val();
                            var annee = $("#anneePointage :selected").val();
                            console.log(annee);
                            $scope.daysInMonth = daysInMonth(mois, annee);
                            $scope.mois = mois + "-" + annee;
                            var T = {
                                Table: []
                            };
                            for (var i = 1; i <= daysInMonth(mois, annee); i++) {
                                if (i < 10) {
                                    var jour = "0" + i;
                                    T.Table.push(
                                            {date: jour + "-" + mois + "-" + annee, dateSql: annee + "-" + mois + "-0" + i}
                                    );
                                } else {
                                    var jour = i;
                                    T.Table.push(
                                            {date: i + "-" + mois + "-" + annee, dateSql: annee + "-" + mois + "-" + i}
                                    );
                                }

                            }
//                        console.log(T.Table);
                            $scope.Table = T.Table;
                        });
                    }
                } else {
                    PointageFactory.listepointage(TablePresence).then(function (pointages) {
                        $scope.listeEmpJour = true;
                        $scope.collapseDays = function () {
                            if ($scope.listeEmpJour == true) {
                                $scope.listeEmpJour = false;
                            } else {
                                $scope.listeEmpJour = true;
                            }
                        };
                        $scope.pointages = pointages;
                        var now = new Date();
                        var mois = $("#moisPointage :selected").val();
                        var annee = $("#anneePointage :selected").val() || new Date().getFullYear();
                        $scope.daysInMonth = daysInMonth(mois, annee);
                        $scope.mois = mois + "-" + annee;
                        var T = {
                            Table: []
                        };
                        for (var i = 1; i <= daysInMonth(mois, annee); i++) {
                            if (i < 10) {
                                var jour = "0" + i;
                                T.Table.push(
                                        {date: jour + "-" + mois + "-" + annee, dateSql: annee + "-" + mois + "-0" + i}
                                );
                            } else {
                                var jour = i;
                                T.Table.push(
                                        {date: i + "-" + mois + "-" + annee, dateSql: annee + "-" + mois + "-" + i}
                                );
                            }

                        }
//                        console.log(T.Table);
                        $scope.Table = T.Table;
                    });
                }
            };
            $scope.changeEmployerPoitage = function ($val) {
                var TablePresence = {
                    Presence: {
                        user_id: $("#SelectEmploye :selected").val()
                    }
                };
                PointageFactory.listepointage(TablePresence).then(function (pointages) {
                    $scope.listeEmpJour = true;
                    $scope.collapseDays = function () {
                        if ($scope.listeEmpJour == true) {
                            $scope.listeEmpJour = false;
                        } else {
                            $scope.listeEmpJour = true;
                        }
                    };
                    $scope.pointages = pointages;
                    var now = new Date();
                    var mois = $("#moisPointage :selected").val() || ("0" + (now.getMonth() + 1)).slice(-2);
                    var annee = $("#anneePointage :selected").val() || new Date().getFullYear();
                    $scope.daysInMonth = daysInMonth(mois, annee);
                    $scope.mois = mois + "-" + annee;
                    var T = {
                        Table: []
                    };
                    for (var i = 1; i <= daysInMonth(mois, annee); i++) {
                        if (i < 10) {
                            var jour = "0" + i;
                            T.Table.push(
                                    {date: jour + "-" + mois + "-" + annee, dateSql: annee + "-" + mois + "-0" + i}
                            );
                        } else {
                            var jour = i;
                            T.Table.push(
                                    {date: i + "-" + mois + "-" + annee, dateSql: annee + "-" + mois + "-" + i}
                            );
                        }

                    }
//                        console.log(T.Table);
                    $scope.Table = T.Table;
                });
            };
            PointageFactory.listepointage().then(function (pointages) {
                $scope.listeEmpJour = true;
                $scope.collapseDays = function () {
                    if ($scope.listeEmpJour == true) {
                        $scope.listeEmpJour = false;
                    } else {
                        $scope.listeEmpJour = true;
                    }
                };
                $scope.pointages = pointages;
                var now = new Date();
                var mois = ("0" + (now.getMonth() + 1)).slice(-2);
                var annee = new Date().getFullYear();
                $scope.daysInMonth = daysInMonth(mois, annee);
                $scope.mois = mois + "-" + annee;
                var T = {
                    Table: []
                };
                for (var i = 1; i <= daysInMonth(mois, annee); i++) {
                    if (i < 10) {
                        var jour = "0" + i;
                        T.Table.push(
                                {date: jour + "-" + mois + "-" + annee, dateSql: annee + "-" + mois + "-0" + i}
                        );
                    } else {
                        var jour = i;
                        T.Table.push(
                                {date: i + "-" + mois + "-" + annee, dateSql: annee + "-" + mois + "-" + i}
                        );
                    }

                }
//                        console.log(T.Table);
                $scope.Table = T.Table;
            });

            $scope.Ctrl = function ()
            {
                $scope.date = new Date();
            };
            $scope.dateChanged = function () {
                var jour = $("#dateChanger").val().split('-')[0];
                var mois = $("#dateChanger").val().split('-')[1];
                var annee = $("#dateChanger").val().split('-')[2];
                var date = annee + "-" + mois + "-" + jour;
//                    //console.log(date);
                $("tbody#gestion_presence").empty();
                var dataP = {
                    Presence: {
                        date: date
                    }
                };
                PointageFactory.listpresence(dataP).then(function (employe) {
                    $scope.listerpresence = employe.data;
                    console.log(employe.data);
                    $scope.date = date;
                });
            };

            var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
            $scope.Auth = Auth.user;
            $scope.autorisation = function () {
                console.log($scope.refcause);
                if ($('#causeid :selected').val() == '') {
                    $("#showaut").hide();
                } else if ($('#causeid :selected').val() == "congé") {
                    $("#showaut").hide();
                } else if ($('#causeid :selected').val() == "absence") {
                    $("#showaut").show();
                } else {
                    $("#showaut").show();
                }
            }
        })

        .controller('ModalEmailCtrl', function ($scope, $uibModal, $log) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
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
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteFacture").attr('data-id', cmd_id);
                    $("#DeleteFacture").attr('data-index', index);
                }, 300);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled, templateUrl: 'mail.html',
                    controller: 'pointageController',
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
            }
            ;
        })
        .controller('ModalEmployeeCtrl', function ($scope, $uibModal, $log, PointageFactory) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeleteEmployee").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeleteEmployee").attr('data-index', index);
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
                $scope.root = PointageFactory.validateAction(dataRoot).then(function (root) {
                    if (root.type === 'success') {
                        var modalInstance = $uibModal.open({
                            animation: $scope.animationsEnabled,
                            templateUrl: 'deleteEmployee.html', controller: 'ModalInstanceCtrl',
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
        });
