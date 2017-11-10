angular.module('MetronicApp')
        .controller('simulateurController', function ($rootScope, $scope, $http, $timeout, PointageFactory, $location, $cookieStore) {
            $scope.checkboxModel = {
                value1: false
            };
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
                var salaire_net = parseFloat($("#salaire_n").val()).toFixed(3);
                var chef_famille = $("#ch_famille").val();
                if ($("#ch_famille").val() == "true" || $("#ch_famille").val() == true || $("#ch_famille").val() == 1) {
                    chef_famille = 150;
                } else {
                    chef_famille = 0;
                }
                var enfant_encharge = $("#enfant_charge").val();
                if (enfant_encharge == 0) {
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
//                calculer salaire net * 12 
                var deux_bruts = false;
                var salaire12 = parseFloat(salaire_net * 12).toFixed(3);
                var total_deduct_A = parseFloat(chef_famille) + parseFloat(enfant_encharge);
                var irpp2 = 0;
                var salaire_imp_brut_50000 = parseFloat((salaire12 - (0.3565 * total_deduct_A) - 4430.25) / 8.1498).toFixed(3);
                var salaire_imp_brut_20000_1 = parseFloat((salaire12 - (0.307 * total_deduct_A) - 1955.25) / 8.6844).toFixed(3);
                var salaire_imp_brut_20000_2 = parseFloat((salaire12 - (0.3 * total_deduct_A) - 1975) / 8.76).toFixed(3);
                var salaire_imp_brut_10000 = parseFloat((salaire12 - (0.25 * total_deduct_A) - 975) / 9.3).toFixed(3);
                var salaire_imp_brut_5000 = parseFloat((salaire12 - (0.2 * total_deduct_A) - 475) / 9.84).toFixed(3);
                var salaire_imp_brut_inf_5000 = salaire_net;
                var b1 = (10.8 * salaire_imp_brut_50000) - total_deduct_A;
                var b2 = (10.8 * salaire_imp_brut_20000_1) - total_deduct_A;
                var b3 = (10.8 * salaire_imp_brut_20000_2) - total_deduct_A;
                var b4 = (10.8 * salaire_imp_brut_10000) - total_deduct_A;
                var b5 = (10.8 * salaire_imp_brut_5000) - total_deduct_A;
                var b6 = (10.8 * salaire_imp_brut_inf_5000) - total_deduct_A;
//                calculer irpp
                var irpp, sib;
                if (b1 > 50000) {
                    irpp = parseFloat((((b1 - 50000) * (35 / 100)) + parseFloat(13025)) / 12).toFixed(3);
//b = parseFloat(b1 / 12).toFixed(3);
                    sib = salaire_imp_brut_50000;
                } else if (((b2 > 20000) && (b2 <= 50000)) && (((0.7 * b2) + 1975) > 20000)) {
                    irpp = parseFloat((((b2 - 20000) * (30 / 100)) + parseFloat(4025)) / 12).toFixed(3);
//b = parseFloat(b2 / 12).toFixed(3);
                    sib = salaire_imp_brut_20000_1;
                } else if (((b3 > 20000) && (b3 <= 50000)) && (((0.7 * b3) + 1975) <= 20000)) {
                    irpp = parseFloat((((b3 - 20000) * (30 / 100)) + parseFloat(4025)) / 12).toFixed(3);
//b = parseFloat(b3 / 12).toFixed(3);
                    sib = salaire_imp_brut_20000_2;
                } else if ((b4 > 10000) && (b4 <= 20000)) {
                    irpp = parseFloat((((b4 - 10000) * (25 / 100)) + parseFloat(1525)) / 12).toFixed(3);
//b = parseFloat(b4 / 12).toFixed(3);
                    sib = salaire_imp_brut_10000;
                } else if ((b5 > 5000) && (b5 <= 10000)) {
                    irpp = parseFloat((((b5 - 5000) * (20 / 100)) + parseFloat(525)) / 12).toFixed(3);
//b = parseFloat(b5 / 12).toFixed(3);
                    sib = salaire_imp_brut_5000;
                    if (b6 < 5000) {
                        var deux_bruts = true;
                        irpp2 = 0;
//b2 = parseFloat(b6 / 12).toFixed(3);
                        var sib2 = salaire_imp_brut_inf_5000;
//                        message = "2ème valeur : compte tenu de l'exonération du revenu annuel net qui ne dépasse pas 5000 DT";
                    }
                } else if (b6 < 5000) {
                    irpp = 0;
//b = parseFloat(b6 / 12).toFixed(3);
                    sib = salaire_imp_brut_inf_5000;
//                    message = "Compte tenu de l'exonération du revenu annuel net qui ne dépasse pas 5000 DT.";
                }
                var cnss = parseFloat(sib * 0.10108).toFixed(3);
                var brut = parseFloat(sib) + parseFloat(cnss);
                brut = brut.toFixed(3);
                console.log(deux_bruts);
                if (deux_bruts) {
                    var cnss2 = parseFloat(sib2 * 0.108932).toFixed(3);
                    var brut2 = parseFloat(sib2) + parseFloat(cnss2);
                    brut2 = brut2.toFixed(3);
                    if (deux_bruts) {
                        var cnss2 = parseFloat(sib2 * 0.10108).toFixed(3);
                        var brut2 = parseFloat(sib2) + parseFloat(cnss2);
                        brut2 = brut2.toFixed(3);
                        brut = brut + brut2;
                        cnss = cnss + cnss2;
                        irpp = irpp + irpp2;
                    }
                }
                console.log(brut);
                $("#showNet").show();
                $("#brut_salaire").text(brut);
                $("#cnssbrut").text(cnss);
                $("#irppbrut").text(irpp);
                $("#salaire_net").text(salaire_net);
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
        });
