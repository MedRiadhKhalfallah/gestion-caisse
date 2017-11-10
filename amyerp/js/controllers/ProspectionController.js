angular.module('MetronicApp')
         .controller('SoftphoneCtrl', function ($scope, ProspectionFatcory, $location, PostFactory) {
             
         })
        .controller('EmailCtrl', function ($scope, ProspectionFatcory, $location, PostFactory) {

            $scope.model = {
                second: "Oh yeah! <strong>HTML ftw!</strong>"
            };

            $scope.config = {toolbar: 'bold | italic'};

            $scope.changeConfig = function () {
                $scope.config = {toolbar: 'bold'};
            };
            var id = parseInt($location.path().split('/')[2]);
            if (id) {
                PostFactory.viewClient(id).then(function (user) {
                    $scope.viewclient = user;
                    console.log(user);
                });
            }

            $scope.addemail = function ($event) {
                $event.preventDefault();
                var dataemail = {
                    Prospection: {
                        user_id: $('#email_user').attr('data-user_id'),
                        content: $("#tinymce1").val(),
//                        content: 'jkhjgjg',
                        type: 'Email'
                    }
                };
                console.log(dataemail);
                $scope.ajouter = ProspectionFatcory.addemail(dataemail).then(function (email) {

                    if (email.type === "success") {
                        toastr.info(email.text);
//                        $location.path("/gestion-msg");
                    }
                });


            };
        })
        .controller('prospectionController', function ($rootScope, $scope, $http, $timeout, ProspectionFatcory, PostFactory, $location, $cookieStore) {
//            $scope.adduser = function ($event) {
//                $event.preventDefault();
//                var datauser = {
//                    User: {
//                        login: $('#login_user').val(),
//                        password: $('#password_user').val(),
//                        firstname: $('#firstname_user').val(),
//                        lastname: $('#lasttname_user').val(),
//                        phone: $('#phone_user').val(),
//                        email: $('#email_user').val(),
//                    }
//                }
//                console.log(datauser);
//                $scope.useradd = ProspectionFatcory.adduser(datauser).then(function (user) {
//                    console.log(user);
//                })
////            }
//            ProspectionFatcory.listuser().then(function (users) {
//                console.log(users);
//                $scope.listeruser = users.data;
//            });
            $scope.historiqueID = $cookieStore.get('userID');
            $scope.locationHistorySMS = function () {
                var historiqueID = $cookieStore.get('userID');
                console.log(historiqueID);
                $location.path('/historique-msg/' + historiqueID);
            }; 
            $scope.locationHistoryEmail = function () {
                var historiqueID = $cookieStore.get('userID');
                console.log(historiqueID);
                $location.path('/historique-email/' + historiqueID);
            };
            var id = parseInt($location.path().split('/')[2]);
            if (id) {
                $scope.client = PostFactory.viewClient(id).then(function (client) {
                    $scope.viewclient = client;
                    console.log(client);
                });
            }
            $scope.ajoutermsg = function ($event) {
                $event.preventDefault();
                var datamsg = {
                    Prospection: {
                        user_id: $('#phone_user').attr('data-user_id'),
                        content: $('#content_user').val(),
                        type: 'Message'
                    }
                };
                $scope.ajouter = ProspectionFatcory.ajoutermsg(datamsg).then(function (Prospections) {

                    if (Prospections.type === "success") {
                        toastr.info(Prospections.text);
//                        $location.path("/gestion-msg");
                    }
                });


            };
            ProspectionFatcory.listermsg().then(function (msgs) {

                $scope.listermsg = msgs.data;
            });
// Put cookie

            $scope.addCookies = function ($val) {
//                $event.preventDefault();
                var tableUser = {
                    User: []
                };
                $("#listUser tr").each(function (index, value) {
                    if ($(value).children().eq(8).children().is(":checked")) {
                        tableUser.User.push({id: $(value).attr('data-data-id')});
                        $cookieStore.put('tableUser', tableUser.User);
//                        console.log(favoriteCookie);
                    }
                });
                console.log(tableUser.User);
                var favoriteCookie = $cookieStore.get('tableUser');
                console.log(favoriteCookie);
                if ($val == 'msg') {
                    if (tableUser.User.length == 0) {
                        toastr.error("Veuillez sélèctionner un client...");
                    } else {
                        $location.path("/prospectiontt");
                    }
                }
                if ($val == 'email') {
                    if (tableUser.User.length == 0) {
                        toastr.error("Veuillez sélèctionner un client...");
                    } else {
                        $location.path("/prospectionemailtt");
                    }
                }

                // Get cookie



                $(".checkSingle").click(function () {
                    if ($(this).is(":checked")) {
                        var isAllChecked = 0;
                        $(".checkSingle").each(function () {
                            if (!this.checked)
                                isAllChecked = 1;
                        })
                        if (isAllChecked == 0) {
                            $("#checkedAll").prop("checked", true);
                        }
                    } else {
                        $("#checkedAll").prop("checked", false);
                    }
                });

            };
            $scope.ajoutermultimsg = function ($event) {
                $event.preventDefault();
                var listUser = $cookieStore.get('tableUser');
                console.log(listUser);
                var datamultimsg = {
                    Prospection: {
                        content: $('#content_user').val(),
                        type: 'Message'
                    },
                    User: listUser
                };
                $scope.ajouter = ProspectionFatcory.ajoutermultimsg(datamultimsg).then(function (prospections) {
                    if (prospections.type === "success") {
                        toastr.info(prospections.text);
//                        $location.path("/gestion-msg");
                    }
                });
            }
            $scope.ajoutermultiemail = function ($event) {
                $event.preventDefault();
                var listUser = $cookieStore.get('tableUser');
                var datamultiemail = {
                    Prospection: {
                        content: $('#tinymce1').val(),
                        type: 'Email'
                    },
                    User: listUser
                };
                $scope.ajouter = ProspectionFatcory.ajoutermultiemail(datamultiemail).then(function (prospections) {
                    if (prospections.type === "success") {
                        toastr.info(prospections.text);
//                        $location.path("/gestion-msg");
                    }
                });
            }
            var id = parseInt($location.path().split('/')[2]);
            var dataMsgHistorique = {
                Prospection: {
                    user_id: id,
                },
            };
            $scope.user_id = id;
            ProspectionFatcory.historiquemsg(dataMsgHistorique).then(function (prospections) {
                $scope.dataMsgHistorique = prospections.data;
                console.log(prospections.data);
            });
            var dataEmailHistorique = {
                Prospection: {
                    user_id: id,
                },
            };
            console.log(dataEmailHistorique);
//             $scope.user_id = id;
            ProspectionFatcory.historiqueemail(dataEmailHistorique).then(function (prospections) {
                $scope.dataEmailHistorique = prospections.data;
            });
        })