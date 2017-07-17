export default class serivces {

    constructor($http) {
        'ngInject'
        console.log('dataService');
        this.selection = "";
        this.data = {};
        this.$http = $http;
        this.urlBase = '/api/';
    }

    selection() {
        return this.selection;
    }

    data(){
        return this.data;
    }

    set(info) {
        data = info;
    }

    select  (name) {
        selection = name;
    }


    apiGet(Str) {
        return $http.get(urlBase + Str);
    };

    apiPost(Str, params){
        return $http.post(urlBase + Str, params);
    };

}
