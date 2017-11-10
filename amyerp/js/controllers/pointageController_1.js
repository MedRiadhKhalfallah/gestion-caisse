angular.module('MetronicApp')
        .controller('pointagesController', function ($rootScope, $scope, $http, $timeout, PointageFactory, $location, $cookieStore) {
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
                            isFamille: $('#CheckedBox').val(),
                            count_kids: $('#enfant_employ').val() || 0,
                            phone: $('#phone_employ').val(),
                            email: $('#email_employ').val(),
                            salaire: $('#salaire_employ').val() || 0,
                            role_id: 7

//
                        }
                    };
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
            });
            $scope.editsalaire = function ($event) {
                $event.preventDefault();
                angular.element($event.target).hide();
                angular.element($event.target).parent().children().eq(1).show();
            };
            setTimeout(function ()
            {
                $scope.$apply(function () {
                    var total = 0;
                    angular.forEach($("#listBL1 tr"), function (value, index) {
                        total += parseFloat($(value).children().eq(9).children().eq(0).text());
                    });
                    $scope.total = total;
                })

            }, 2000);
            $scope.checkboxModel = {
                value1: false
            };
            var id = parseInt($location.path().split('/')[2]);
            if (id) {
                $scope.employedit = PointageFactory.viewEmployee(id).then(function (employe) {
                    $scope.employedit = employe.text;
                });
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
                if ($event.which === 13) {
                    var datasalaire = {
                        User: {
                            salaire: angular.element($event.target).val(),
                            id: angular.element($event.target).attr('data-employee'),
                        }
                    };
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
                PointageFactory.addemail(dataemail).then(function (email) {
                    if (email.type === "success") {
                        toastr.info(email.text);
                    }
                });
            };
            $scope.exportDataemploye = function () {
                alasql('SELECT * INTO XLSX("list_employee.xlsx",{headers:true}) FROM ?', [$scope.items]);
            };
            $scope.items = PointageFactory.listEmployeesExport().then(function (users) {
                $scope.items = users;
            },
                    function (msg) {
                        alert(msg);
                    }
            );
            $scope.generatePDF = function () {
                alasql('SELECT * INTO XLSX("list_employee.xlsx",{headers:true}) FROM ?', [$scope.items]);
            };
            $scope.items = PointageFactory.listEmployeesExport().then(function (users) {
                $scope.items = users;
            },
                    function (msg) {
                        alert(msg);
                    }
            );
        })
        .controller('PointagesCtrl', function ($scope, $location, $uibModal, $log, $cookieStore, PointageFactory) {
            $scope.checkbox = 0;
            $scope.$watch(function () {
                return $scope.checkbox;
            }, function () {
                $scope.checkbox = Number($scope.checkbox);
            }, true);
            // change cause absence 
            $scope.isAbsence = false;
            $scope.causeAbsence = function () {
                var value_cause = $("#causeAbsence :selected").val();
                if (value_cause === "Absent") {
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.isAbsence = true;
                        });
                    }, 200);
                } else {
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.isAbsence = false;
                        });
                    }, 200);
                }
            };
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
            $scope.setFileAbsence = function (element) {
                $scope.currentFile = element.files[0];
                var reader = new FileReader();
                reader.onload = function (event) {
                    $scope.image_source = event.target.result;
                    $scope.$apply();
                };
                // when the file is read it triggers the onload event above.
                reader.readAsDataURL(element.files[0]);
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
            // update entree matin pointage
            $scope.updateEmPointage = function (obj, $index) {
                angular.forEach(obj, function (value, index) {
                    if (index == "emPointage") {
                        $("#tableId table tbody tr:eq(" + $index + ")").find("button#submitPointage").attr('data-empointage', currentDateTime(value[$index]));
                    }
                });
            };
            // update sortie matin pointage
            $scope.updateSmPointage = function (obj, $index) {
                angular.forEach(obj, function (value, index) {
                    if (index == "smPointage") {
                        $("#tableId table tbody tr:eq(" + $index + ")").find("button#submitPointage").attr('data-smpointage', currentDateTime(value[$index]));
                    }
                });
            };
            // update entree soir pointage
            $scope.updateEsPointage = function (obj, $index) {
                angular.forEach(obj, function (value, index) {
                    if (index == "esPointage") {
                        $("#tableId table tbody tr:eq(" + $index + ")").find("button#submitPointage").attr('data-espointage', currentDateTime(value[$index]));
                    }
                });
            };
            // update sortie soir pointage
            $scope.updateSsPointage = function (obj, $index) {
                angular.forEach(obj, function (value, index) {
                    if (index == "ssPointage") {
                        $("#tableId table tbody tr:eq(" + $index + ")").find("button#submitPointage").attr('data-sspointage', currentDateTime(value[$index]));
                    }
                });
            };
            // update entree pointageSortie
            $scope.updateEmPointageSortie = function (obj, $index) {
                angular.forEach(obj, function (value, index) {
                    if (index == "emPointageSortie") {
                        $("#tableSortieId table tbody tr:eq(" + $index + ")").find("button#reloadPointageSortie").attr('data-empointage', currentDateTime(value[$index]));
                    }
                });
            };
            // update sortie pointageSortie
            $scope.updateSmPointageSortie = function (obj, $index) {
                angular.forEach(obj, function (value, index) {
                    if (index == "smPointageSortie") {
                        $("#tableSortieId table tbody tr:eq(" + $index + ")").find("button#reloadPointageSortie").attr('data-smpointage', currentDateTime(value[$index]));
                    }
                });
            };
            // update entree pointageHS
            $scope.updateEmPointageHS = function (obj, $index) {
                angular.forEach(obj, function (value, index) {
                    if (index == "emPointageHS") {
                        $("#tableHSId table tbody tr:eq(" + $index + ")").find("button#reloadPointageHS").attr('data-empointage', currentDateTime(value[$index]));
                    }
                });
            };
            // update sortie pointageHS
            $scope.updateSmPointageHS = function (obj, $index) {
                angular.forEach(obj, function (value, index) {
                    if (index == "smPointageHS") {
                        $("#tableHSId table tbody tr:eq(" + $index + ")").find("button#reloadPointageHS").attr('data-smpointage', currentDateTime(value[$index]));
                    }
                });
            };

            // update pointageSortie
            $scope.reloadPointageSortie = function ($event, $id, pointage_id) {
                var date_entree = null;
                var date_sortie = null;
                if ($event.currentTarget.getAttribute('data-empointage') !== "")
                {
                    date_entree = $event.currentTarget.getAttribute('data-empointage');
                }
                if ($event.currentTarget.getAttribute('data-smpointage') !== "")
                {
                    date_sortie = $event.currentTarget.getAttribute('data-smpointage');
                }
                var dataSortie = {
                    SortiesPointage: {
                        id: $id,
                        date_entree: date_entree,
                        date_sortie: date_sortie
                    }
                };
                PointageFactory.editpointageSortie(dataSortie).then(function (newSortie) {
                    if (newSortie.type === "success") {
                        toastr.success(newSortie.text);
                        PointageFactory.viewPointage(pointage_id).then(function (pointage) {
                            $scope.pointagesSortie = pointage.SortiesPointage;
                        });
                        setTimeout(preuvePreview, 1000);
                    }
                });
            };
            // add Heure supplimentaire
            $scope.addPointageHS = function ($event) {
                var date_sortie = null;
                var date = $("#modalAbscence").attr('data-date');
                if ($('#sortieHS').val() !== "") {
                    date_sortie = date + " " + $('#sortieHS').val() + ":00";
                }
                var pointage_id = $scope.pointage_id;
                var dataHS = {
                    SortiesPointage: {
                        pointage_id: pointage_id,
                        date_entree: date + " " + $('#entreeHS').val() + ":00",
                        date_sortie: date_sortie,
                        type: 'HS',
                        descriptif: $('#descriptifHS').val()
                    }
                };
                if ($('#entreeHS').val() === "") {
                    toastr.error('Veuillez mettre la date d\'entrée');
                } else {
                    PointageFactory.addpointageHS(dataHS).then(function (newHS) {
                        if (newHS.type === "success") {
                            toastr.success(newHS.text);
                            PointageFactory.listHS(pointage_id).then(function (pointageHS) {
                                if (pointageHS.type === 'error') {
                                    $scope.listVide = true;
                                }
                                if (pointageHS.type === 'success') {
                                    $scope.listVide = false;
                                }
                                $scope.pointagesHS = pointageHS.data;
                            });
                            setTimeout(preuvePreview, 1000);
                            $('#entreeHS').val('');
                            $('#sortieHS').val('');
                            $('#descriptifHS').val('');
                        }
                    });
                }
            };
            // update HS
            $scope.reloadPointageHS = function ($event, $id, pointage_id) {
                var date_entree = null;
                var date_sortie = null;
                if ($event.currentTarget.getAttribute('data-empointage') !== "")
                {
                    date_entree = $event.currentTarget.getAttribute('data-empointage');
                }
                if ($event.currentTarget.getAttribute('data-smpointage') !== "")
                {
                    date_sortie = $event.currentTarget.getAttribute('data-smpointage');
                }
                var dataSortie = {
                    SortiesPointage: {
                        id: $id,
                        date_entree: date_entree,
                        date_sortie: date_sortie
                    }
                };
                PointageFactory.editpointageSortie(dataSortie).then(function (newSortie) {
                    if (newSortie.type === "success") {
                        toastr.success(newSortie.text);
                        PointageFactory.listHS(pointage_id).then(function (pointageHS) {
                            if (pointageHS.type === 'error') {
                                $scope.listVide = true;
                            }
                            if (pointageHS.type === 'success') {
                                $scope.listVide = false;
                            }
                            $scope.pointagesHS = pointageHS.data;
                        });
                        setTimeout(preuvePreview, 1000);
                    }
                });
            };
            $scope.Ctrl = function ()
            {
                $scope.date = new Date();
            };
            $scope.newPointage = function ($event, user_id) {
                console.log('pointage');
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
                var date = null;
                if ($('#dateChanger').val() != '') {
                    date = $('#dateChanger').val().split('-')[2] + '-' + $('#dateChanger').val().split('-')[1] + '-' + $('#dateChanger').val().split('-')[0];
                }
                var datapointage = {
                    Pointage: {
                        user_id: user_id,
                        date_entree: date_entree_matin,
                        date_sortie: date_sortie_matin,
                        date_entree_midi: date_entre_midi,
                        date_sortie_midi: date_sorti_midi,
                        date: date
                    }
                };
                PointageFactory.newPointage(datapointage).then(function (employe) {
                    if (employe.type === "success") {
                        toastr.info(employe.text);
                        var jour = $("#dateChanger").val().split('-')[0];
                        var mois = $("#dateChanger").val().split('-')[1];
                        var annee = $("#dateChanger").val().split('-')[2];
                        var date = null;
                        if ($("#dateChanger").val() !== '') {
                            var date = annee + "-" + mois + "-" + jour;
                        }
                        var dataP = {
                            Pointage: {
                                date: date
                            }
                        };
                        PointageFactory.newListpointage(dataP).then(function (newemploye) {
                            $scope.listerpointage = newemploye.data;
                            setTimeout(preuvePreview, 1000);
                        });
                    }
                });
            };
            $scope.reloadInfo = function ($user_id, $user_name, $pointage_id, $isAbsent, $lenght) {
                $scope.user_id = $user_id;
                $scope.user_name = $user_name;
                $scope.pointage_id = $pointage_id;
                $scope.isAbcent = $isAbsent;
                $scope.lenght = $lenght;
                if ($pointage_id !== undefined) {
                    PointageFactory.viewPointage($pointage_id).then(function (pointage) {
//                        $scope.pointage = pointage;
                        $scope.pointagesSortie = pointage.SortiesPointage;
                        $scope.pointagesAbsent = pointage.Pointage;
                    });

                }
            };
            $scope.reloadInfoHS = function ($user_id, $user_name, $pointage_id, $isAbsent, $lenght) {
                $scope.user_id = $user_id;
                $scope.user_name = $user_name;
                $scope.pointage_id = $pointage_id;
                $scope.isAbcent = $isAbsent;
                $scope.lenght = $lenght;
                if ($pointage_id !== undefined) {
                    PointageFactory.listHS($pointage_id).then(function (pointageHS) {
                        if (pointageHS.type === 'error') {
                            $scope.listVide = true;
                        }
                        if (pointageHS.type === 'success') {
                            $scope.listVide = false;
                        }
                        $scope.pointagesHS = pointageHS.data;
                    });
                }
            };
            $scope.reloadPointage = function ($event) {
                var pointage_id = $scope.pointage_id;
                var date = $("#modalAbscence").attr('data-date');
                var file = $scope.myFile;
                var date_entree = null;
                if ($('#entreeSortie').val() !== "") {
                    date_entree = date + " " + $('#entreeSortie').val() + ":00";
                }
                var dataSortie = {
                    SortiesPointage: {
                        pointage_id: pointage_id,
                        date_entree: date_entree,
                        date_sortie: date + " " + $('#sortieSortie').val() + ":00",
                        cause: $('#causeSortieAdd :selected').val(),
                        file: file,
                        descriptif: $('#descriptifSortie').val()
                    }
                };
                if ($('#sortieSortie').val() === "") {
                    toastr.error('Veuillez mettre la date sortie');
                } else {
                    PointageFactory.addpointageSortie(dataSortie).then(function (newSortie) {
                        if (newSortie.type === "success") {
                            toastr.success(newSortie.text);
                            PointageFactory.viewPointage(pointage_id).then(function (pointage) {
                                $scope.pointagesSortie = pointage.SortiesPointage;
                            });
                            setTimeout(preuvePreview, 1000);
                        }
                    });
                    $('#sortieSortie').val('');
                    $('#descriptifSortie').val('');
                }
            };
            // pointage absence 
            $scope.validerAbsence = function ($event) {
                $event.preventDefault();
                var user_id = $scope.user_id;
                var date = null;
                if ($('#dateChanger').val() != '') {
                    date = $('#dateChanger').val().split('-')[2] + '-' + $('#dateChanger').val().split('-')[1] + '-' + $('#dateChanger').val().split('-')[0];
                }
                var file = $scope.myFileAbsence;
                var datapointage = {
                    Pointage: {
                        user_id: user_id,
                        isAbsent: true,
                        cause: $('#causeAbsence :selected').val(),
                        isAutorise: $("#isAutorise").val(),
                        descriptif: $('#descriptifAbsence').val() || null,
                        file: file,
                        date: date
                    }
                };
                PointageFactory.newPointageAbsence(datapointage).then(function (newPointageAbsentce) {
                    if (newPointageAbsentce.type === "success") {
                        toastr.info(newPointageAbsentce.text);
                        var jour = $("#dateChanger").val().split('-')[0];
                        var mois = $("#dateChanger").val().split('-')[1];
                        var annee = $("#dateChanger").val().split('-')[2];
                        var date = null;
                        if ($("#dateChanger").val() !== '') {
                            var date = annee + "-" + mois + "-" + jour;
                        }
                        var dataP = {
                            Pointage: {
                                date: date
                            }
                        };
                        PointageFactory.newListpointage(dataP).then(function (newemploye) {
                            $scope.listerpointage = newemploye.data;
                            setTimeout(preuvePreview, 1000);
                        });
                        $(".myModal_Absence").modal('toggle');
                    }
                });
            };
            PointageFactory.newListpointage().then(function (employe) {
                $scope.listerpointage = employe.data;
                setTimeout(preuvePreview, 1000);
            });
            $scope.dateChanged = function () {
                var jour = $("#dateChanger").val().split('-')[0];
                var mois = $("#dateChanger").val().split('-')[1];
                var annee = $("#dateChanger").val().split('-')[2];
                var date = annee + "-" + mois + "-" + jour;
                $("tbody#gestion_pointage").empty();
                var dataP = {
                    Pointage: {
                        date: date
                    }
                };
                PointageFactory.newListpointage(dataP).then(function (employe) {
                    $scope.listerpointage = employe.data;
                    $scope.date = date;
                });
            };
        })
        .controller('PointagesAutoCtrl', function ($scope, $location, $uibModal, $log, $cookieStore, PointageFactory) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.date = new Date();
                PointageFactory.listPointageAuto().then(function (pointagesAuto) {
                    $scope.notAbsent = pointagesAuto.notabsent;
                    $scope.Absent = pointagesAuto.absent;
                    $scope.times = pointagesAuto.times;
                    $scope.names = pointagesAuto.names;
                    $scope.names_absent = pointagesAuto.names_absent;
                    var notAbsent = pointagesAuto.notabsent;
                    var max_length = 0;
                    angular.forEach(notAbsent, function (value, index) {
                        angular.forEach(value, function (v, i) {
                            if (max_length < v.length) {
                                max_length = v.length;
                            }
                        });
                    });
                    $scope.max_length = max_length;
                    var in_out = [];
                    for (var i = 0; i < max_length; i++) {
                        if (i % 2 == 0) {
                            in_out.push('IN');
                        } else {
                            in_out.push('Out');
                        }
                    }
                    $scope.in_out = in_out;
                }, function (msg) {
                    alert(msg);
                });
                $scope.dateChanged = function () {
                    var jour = $("#dateChanger").val().split('-')[0];
                    var mois = $("#dateChanger").val().split('-')[1];
                    var annee = $("#dateChanger").val().split('-')[2];
                    var date = annee + "-" + mois + "-" + jour;
//                    $("tbody#gestion_pointage").empty();
                    var dataPointage = {
                        Pointage: {
                            date: date
                        }
                    };
                    $scope.date = $("#dateChanger").val();
                    PointageFactory.listPointageAuto(dataPointage).then(function (pointagesAuto) {
                        $scope.notAbsent = pointagesAuto.notabsent;
                        $scope.Absent = pointagesAuto.absent;
                        $scope.times = pointagesAuto.times;
                        $scope.names = pointagesAuto.names;
                        $scope.names_absent = pointagesAuto.names_absent;
                        var notAbsent = pointagesAuto.notabsent;
                        var max_length = 0;
                        angular.forEach(notAbsent, function (value, index) {
                            angular.forEach(value, function (v, i) {
                                if (max_length < v.length) {
                                    max_length = v.length;
                                }
                            });
                        });
                        $scope.max_length = max_length;
                        var in_out = [];
                        for (var i = 0; i < max_length; i++) {
                            if (i % 2 == 0) {
                                in_out.push('IN');
                            } else {
                                in_out.push('Out');
                            }
                        }
                        $scope.in_out = in_out;
                    });
                };
            } else {
                $location.path('/login');
            }
        })
        .controller('PointagesAutomatiqueCtrl', function ($scope, $location, $uibModal, $log, $cookieStore, PointageFactory) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.date = new Date();
                PointageFactory.listpointageAutomatique().then(function (pointagesAuto) {
                    PointageFactory.savePointageAutomatique().then(function (savepointagesAuto) {
                        $scope.listPointagesAuto = pointagesAuto.data;
                        var max_length = pointagesAuto.length;
                        $scope.max_length_auto = max_length;
                        var in_out = [];
                        for (var i = 0; i < max_length; i++) {
                            if (i % 2 == 0) {
                                in_out.push('IN');
                            } else {
                                in_out.push('Out');
                            }
                        }
                        $scope.in_out_auto = in_out;
                    });
                });
                $scope.dateChangedAuto = function () {
                    var jour = $("#dateChanger").val().split('-')[0];
                    var mois = $("#dateChanger").val().split('-')[1];
                    var annee = $("#dateChanger").val().split('-')[2];
                    var date = annee + "-" + mois + "-" + jour;
                    var dataPointage = {
                        Pointage: {
                            date: date
                        }
                    };
                    $scope.date = $("#dateChanger").val();
                    PointageFactory.listpointageAutomatique(dataPointage).then(function (pointagesAuto) {
                        $scope.listPointagesAuto = pointagesAuto.data;
                        var max_length = pointagesAuto.length;
                        $scope.max_length_auto = max_length;
                        var in_out = [];
                        for (var i = 0; i < max_length; i++) {
                            if (i % 2 == 0) {
                                in_out.push('IN');
                            } else {
                                in_out.push('Out');
                            }
                        }
                        $scope.in_out_auto = in_out;
                    });
                };
            } else {
                $location.path('/login');
            }
        })
        .controller('PaieCtrl', function ($scope, $location, $uibModal, $log, $cookieStore, PointageFactory) {
            if ($cookieStore.get('sessionConnected')) {
                // list des années de pointages
                PointageFactory.listAnneesPointage().then(function (anneespointage) {
                    $scope.anneespointage = anneespointage;
                },
                        function (msg) {
                            alert(msg);
                        }
                );
                $scope.datePaie = function ($val) {
                    var TablePresence = {
                        Pointage: {
                            mois: $("#moisPointage :selected").val(),
                            annee: $("#anneePointage :selected").val()
                        }
                    };

                    if ($val === 'annee') {
                        if ($("#moisPointage :selected").val() === '') {
                            toastr.info('Veuillez choisir un mois');
                        } else {
                            PointageFactory.listepointagePaie(TablePresence).then(function (pointages) {
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
                                $scope.Table = T.Table;
                            });
                        }
                    } else {
                        PointageFactory.listepointagePaie(TablePresence).then(function (pointages) {
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
                            $scope.Table = T.Table;
                        });
                    }
                    setTimeout(function () {
                        $('a[data-toggle="popover"]').popover();
                    }, 3000);
                };
                $scope.changeEmployerPoitage = function ($val) {
                    var TablePresence = {
                        Pointage: {
                            user_id: $("#SelectEmploye :selected").val()
                        }
                    };
                    PointageFactory.listepointagePaie(TablePresence).then(function (pointages) {
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
                        $scope.Table = T.Table;
                    });
                };
                PointageFactory.listepointagePaie().then(function (pointages) {
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
                    $scope.Table = T.Table;
                });
                //
//                affiche hs sur 
                $scope.appendHS = function ($event) {
                    // append heure supplémentaires
                    $($event.target).parent().parent().find('#listHS').empty();
                    $($event.target).parent().parent().find('#listSortie').empty();
                    var hs = JSON.parse($event.currentTarget.getAttribute('data-hs'));
                    var hs_length = hs.length;
                    if (hs_length > 0) {
                        $($event.target).parent().parent().find('#listHS').append('<h4>Heure(s) supplémentaire(s)</h4>');
                        angular.forEach(hs, function (value, index) {
                            var date_entree = value.SortiesPointage.date_entree;
                            var date_sortie = value.SortiesPointage.date_sortie;
                            $($event.target).parent().parent().find('#listHS').append('<li><strong>Entrée</strong> : ' + date_entree + '</li><li><strong>Sortie</strong> : ' + date_sortie + '</li>');
                        });
                    }
                    // append sorties
                    var sorties = JSON.parse($event.currentTarget.getAttribute('data-sortie'));
                    var sorties_length = sorties.length;
                    if (sorties_length > 0) {
                        $($event.target).parent().parent().find('#listSortie').append('<h4>Les sorties : </h4>');
                        angular.forEach(sorties, function (value, index) {
                            var date_entree = value.SortiesPointage.date_entree;
                            var date_sortie = value.SortiesPointage.date_sortie;
                            $($event.target).parent().parent().find('#listSortie').append('<li><strong>Sortie</strong> : ' + date_sortie + '</li><li><strong>Entrée</strong> : ' + date_entree + '</li>');
                        });
                    }
                };
                $scope.Ctrl = function ()
                {
                    $scope.date = new Date();
                };
                var Auth = $.parseJSON($cookieStore.get('sessionConnected'));
                $scope.Auth = Auth.user;
                $scope.autorisation = function () {
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
            } else {
                $location.path('/login');
            }
        })
        // controller Prime
        .controller('PrimeController', function ($scope, $http, $timeout, $interval, $location, PointageFactory, $cookieStore) {
            if ($cookieStore.get('sessionConnected')) {
                $scope.primes = PointageFactory.listPrime().then(function (primes) {
                    $scope.primes = primes;
                }, function (msg) {
                    alert(msg);
                });
                // ajouter un prime
                $scope.ajoutPrime = function ($event) {
                    $event.preventDefault();
                    var dataPrime = {
                        Prime: {
                            name: $("#nom").val()
                        }};
                    PointageFactory.ajoutPrime(dataPrime).then(function (prime) {
                        if (prime.type === 'success') {
                            $location.path('/gestion-primes');
                            toastr.success(prime.text);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                // ajouter un prime pour un employé
                $scope.ajoutPrimeEmploye = function ($event) {
                    $event.preventDefault();
                    var user_id = parseInt($location.path().split('/')[2]);
                    var date = null;
                    if ($('#DatePrime').val() !== '') {
                        date = $('#DatePrime').val().split('-')[2] + "-" + $('#DatePrime').val().split('-')[1] + "-" + $('#DatePrime').val().split('-')[0];
                    }
                    var dataPrime = {
                        PrimesUser: {
                            montant: $("#Montant_Prime").val(),
                            user_id: user_id,
                            prime_id: $('#name_prime :selected').val(),
                            date: date,
                            note: $("#note_prime").val()
                        }
                    };
                    PointageFactory.ajoutPrimeEmploye(dataPrime).then(function (primeEmploye) {
                        if (primeEmploye.type === 'success') {
                            $location.path('/gestion-employees');
                            toastr.success(primeEmploye.text);
                        }
                    },
                            function (msg) {
                                alert(msg);
                            });
                };
                var id = parseInt($location.path().split('/')[2]);
                if (id) {
                    $scope.prime = PointageFactory.viewPrime(id).then(function (prime) {
                        $scope.prime = prime;
                    });
                    $scope.editPrime = function ($event) {
                        $event.preventDefault();
                        $scope.prime = PointageFactory.editPrime($scope.prime).then(function (prime) {
                            if (prime.type === 'success') {
                                $location.path('/gestion-primes');
                                toastr.success(prime.text);
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
        //delete Prime
        .controller('ModalPrimeCtrl', function ($scope, $uibModal, $log, PostFactory) {
            $scope.items = ['item1', 'item2', 'item3'];
            $scope.animationsEnabled = true;
            $scope.open = function (cmd_id, index) {
                setTimeout(function () {
                    $("#DeletePrime").attr('data-id', cmd_id);
                    $("#login-box").attr('data-id', cmd_id);
                    $("#DeletePrime").attr('data-index', index);
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
                            templateUrl: 'deletePrime.html', controller: 'ModalInstanceCtrl',
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