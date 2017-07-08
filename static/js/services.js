/*jslint node: true */
'use strict';

angular.module('dragonfly.services', [])

    .factory('dataService', function() {
        let data = {};
        let selection;
        return {
            selection: function() {
                return selection;
            },
            data: function() {
                return data;
            },
            set: function(info) {
                data = info;
            },
            select: function(name) {
                selection = name;
            },
        };
    })

    .factory('apiService', ['$http', function($http) {
        let urlBase = '/api/';
        let apiService = {};

        apiService.get = function(Str) {
            return $http.get(urlBase + Str);
        };

        apiService.post = function(Str, params) {
            return $http.post(urlBase + Str, params);
        };
        return apiService;
    }, ]);
