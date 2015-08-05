(function(){

angular.module("common.services")
.factory('dataservices', ['$http','$q',dataservices]);

function dataservices($http,$q){
            var cache;

            var service = {
            sendEmail: sendEmail,
            eventsList: fetchEvents
            };

        return service;

            function sendEmail(data) {
            return $http.post('/api/email',data);
        }

    function fetchEvents(){

         var d = $q.defer();
        if( cache ) {
            d.resolve(cache);
        }
        else {
            $http({method: 'GET', url: 'https://www.googleapis.com/calendar/v3/calendars/saradeeps14%40gmail.com/events?timeMin=2015-08-03T10%3A00%3A00%2B12%3A00&maxResults=15&fields=items(description%2Csummary%2Cstart%2Cend)&key=AIzaSyDYMo0HudbTGQof-pQ6goB22pQRddXsRq0'}).then(
                function success(response) {
                    if (!cache) {
                        cache = response;
                    }
                    d.resolve(cache);
                },
                function failure(reason) {
                    d.reject(reason);
                }
            );
        }
        return d.promise;

        }

}

}());