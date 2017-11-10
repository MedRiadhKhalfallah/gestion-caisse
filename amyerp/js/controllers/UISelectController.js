/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
angular.module('MetronicApp').filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

angular.module('MetronicApp').controller('UISelectController', function($scope, $http, $timeout, $interval) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initAjax(); // initialize core components
    });

    var vm = this;

    vm.disabled = undefined;
    vm.searchEnabled = undefined;

    vm.setInputFocus = function() {
        $scope.$broadcast('UiSelectDemo1');
    };

    vm.enable = function() {
        vm.disabled = false;
    };

    vm.disable = function() {
        vm.disabled = true;
    };

    vm.enableSearch = function() {
        vm.searchEnabled = true;
    };

    vm.disableSearch = function() {
        vm.searchEnabled = false;
    };

    vm.clear = function() {
        vm.person.selected = undefined;
        vm.address.selected = undefined;
        vm.country.selected = undefined;
    };
    vm.peopleObj = {
        '1': {
            name: 'Adam'
        },
        '2': {
            name: 'Amalie'
        },
        '3': {
            name: 'Estefanía'
        },
        '4': {
            name: 'Adrian'
        },
        '5': {
            name: 'Wladimir'
        },
        '6': {
            name: 'Samantha'
        },
        '7': {
            name: 'Nicole'
        },
        '8': {
            name: 'Natasha'
        },
        '9': {
            name: 'Michael'
        },
        '10': {
            name: 'Nicolás'
        }
    };
    vm.people = [{
        name: 'Adam'
    }, {
        name: 'Amalie'
    }, {
        name: 'Estefanía'
    }, {
        name: 'Adrian'
    }, {
        name: 'Wladimir'
    }, {
        name: 'Samantha'
    }, {
        name: 'Nicole'
    }, {
        name: 'Natasha'
    }, {
        name: 'Michael'
    }, {
        name: 'Nicolás'
    }];

 
});