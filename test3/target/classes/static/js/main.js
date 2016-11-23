var app = angular.module('myApp', [ 'ngResource', 'ngRoute' ]);
app.factory('Api', function($resource) {
	return {
		User : $resource('people/:id', {
			id : '@id'
		}, {
			update : {
				method : 'PUT'
			}
		})
	};
});
app.controller('myCtrl', function($scope, Api) {
	$scope.test1 = 'Prueba PersonalSoft';
	$scope.editUser ={};
	Api.User.get(function(data){
		$scope.users = data._embedded.people;
	});
	
	$scope.addAuthor = function () {
        $scope.newUser = {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
        };
        console.log($scope.newUser)
        Api.User.save($scope.newUser,function(){
        	Api.User.get(function(data){
        		$scope.users = data._embedded.people;
        	});
        });
    }
	$scope.removeAuthor = function (obj) {
        console.log(obj._links.self.href);
        var text = obj._links.self.href;
        var regex = /\/\d+/;
        var match = regex.exec(text);
        var sinSlash= match[0].substring(1)
        Api.User.delete({id:sinSlash},function(){
        	Api.User.get(function(data){
        		$scope.users = data._embedded.people;
        	});
        });
    }
	$scope.edit = function (obj) {
        console.log('entro a modified - ' + obj);
        angular.copy(obj,$scope.editUser);
    };
	$scope.modifiedQuote = function () {
        console.log('entro a modified - ' + $scope.editUser.lastName);
        console.log($scope.editUser._links.self.href);
        var text = $scope.editUser._links.self.href;
        var regex = /\/\d+/;
        var match = regex.exec(text);
        var sinSlash= match[0].substring(1)
        Api.User.update({
            id: sinSlash
        }, JSON.stringify($scope.editUser), function (data) {

            console.log(data);
            Api.User.get(function(data){
        		$scope.users = data._embedded.people;
        	});
        });
    };
});
app.config(function($routeProvider) {
	$routeProvider.when('/home', {
		templateUrl : 'home.html'
	}).when('/crud', {
		templateUrl : 'crud.html'
	})
});
