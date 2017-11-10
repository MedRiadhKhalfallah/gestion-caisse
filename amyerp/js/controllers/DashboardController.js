angular.module('MetronicApp').controller('DashboardController', function ($rootScope, $scope, $http, $timeout, $cookieStore, $location) {
    if ($cookieStore.get('sessionConnected')) {
        console.log("test");
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            App.initAjax();
        });
        $(".page-header").show();
        $(".page-sidebar-wrapper").show();
        $("#footerERP").show();
        $("w-div").show();
        $scope.history = history;
        
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    } else {
        $location.path('/login');
    }
});