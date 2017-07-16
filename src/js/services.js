export class dataSerivce {
    constructor() {
        'ngInject'

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
    }
}
export class apiService {
    constructor($http) {
        let urlBase = '/api/';
        let apiService = {};

        apiService.get = function(Str) {
            return $http.get(urlBase + Str);
        };

        apiService.post = function(Str, params) {
            return $http.post(urlBase + Str, params);
        };
        return apiService;
    }
}
