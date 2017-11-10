.controller("CmdsClientRecupereesController", function ($scope, PostFactory, $filter, $cookieStore, $cookies, $window, $location, $compile) {
            $("div#otherPagesClientRecuperees").html("");
            $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate(1, 30).then(function (clientsrecuperer) {
                $scope.CmdsClientRecuperees = clientsrecuperer.data.commandesClientRecuperees;
                console.log(clientsrecuperer.data.commandesClientRecuperees);
                $scope.countClientRecuperees = clientsrecuperer.data.pageCount.User.count;
                console.log(clientsrecuperer.data.pageCount.User.count);
                $scope.clientNotAffect = clientsrecuperer.dataNotAffect;
                $scope.countclients = clientsrecuperer.data.pageCount.User.count;
                $scope.countcommandes = clientsrecuperer.countcommandes;
                $scope.countRecuperees = clientsrecuperer.count;
                $scope.countcommandesaffectees = clientsrecuperer.countcommandesaffectees;
                $scope.countcommandesnotaffectees = clientsrecuperer.countcommandesnotaffectees;
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
                        $scope.CmdsClientRecuperees = clientsrecuperer.data.commandesClientRecuperees;
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
                        $scope.CmdsClientRecuperees = clientsrecuperer.data.commandesClientRecuperees;

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
                    $scope.CmdsClientRecuperees = clientsrecuperer.data.commandesClientRecuperees;

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
                        $scope.CmdsClientRecuperees = clientsrecuperer.data.commandesClientRecuperees;
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
                        $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate(1, 5, searchKey).then(function (clientsrecuperer) {
                            $("div#otherPagesClientRecuperees").html("");
                            $scope.CmdsClientRecuperees = clientsrecuperer.data.commandesClientRecuperees;
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
            $scope.update_en_recuperee = function () {
                $("div#otherPagesClientRecuperees").html("");
                $scope.CmdsClientRecuperees = PostFactory.listClientRecupereesPaginate(1, 30).then(function (clientsrecuperer) {
                    $scope.CmdsClientRecuperees = clientsrecuperer.data.commandesClientRecuperees;
                    $scope.countClientRecuperees = clientsrecuperer.data.pageCount.User.pageCount;
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
                },
                        function (msg) {
                            alert(msg);
                        }
                );
            };
        })