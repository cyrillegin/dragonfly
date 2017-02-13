angular.module('dragonfly.services', [])


.factory('apiService', ['$http', function($http){
    var urlBase = '/dragonfly/';
    var apiService = {};

    apiService.get = function(Str){
        return $http.get(urlBase+Str);
    };

    apiService.put = function(Str, params){
        return $http.put(urlBase+Str, params);
    };

    apiService.post = function(Str, params){
        return $http.post(urlBase+Str, params);
    };

    return apiService;
}]);

