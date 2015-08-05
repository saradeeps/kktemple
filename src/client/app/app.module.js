
(function () { 
    "use strict";
    var app = angular.module("temple",
        ["ui.router",'cg.mailchimp',
         "common.services"]);

    app.run(function($rootScope){

        $rootScope.$on('$stateChangeSuccess', function(event, current, previous) {
         document.body.scrollTop = document.documentElement.scrollTop = 0;
        $rootScope.title = current.title;
         });

       });

    app.config(["$stateProvider",
            "$urlRouterProvider",'$locationProvider',
            function ($stateProvider, $urlRouterProvider,$locationProvider) {
                $locationProvider.html5Mode(true);
                $urlRouterProvider.otherwise("/");

				 $stateProvider
    .state('app',{
        url: '/',
        title: 'Home',
        views: {
            'header': {
                templateUrl: 'app/shared/header.html'
            },
            'content': {
                templateUrl: 'app/shared/content.html' 
            },
            'footer': {
                templateUrl: 'app/shared/footer.html',
                controller: 'FooterCtrl as vm'
            }
        }
    })

    .state('app.events',{
        url: 'events',
        title: 'Events',
        views: {
            'content@': {
                templateUrl: 'app/events/eventlist.html',
                controller: 'EventsCtrl as vm'
            }
        }
    })

    .state('app.eventscalendar',{
        url: 'eventscalendar',
        title: 'Event Calander',
        views: {
            'content@': {
                templateUrl: 'app/events/eventscalendar.html'
            }
        }
    })

    .state('app.contactus',{
        url: 'contactus',
        title: 'Contactus',
        views: {
            'content@' : {
                templateUrl: 'app/contactus/contact-us.html',
                controller:'ContactUsCtrl as vm'                
            }
        }
    });
    }]
    );

app.config(['CgMailChimpServiceProvider',function (CgMailChimpServiceProvider) {

    CgMailChimpServiceProvider.setConfig({
            username: 'google',
            dc: 'us11',
            u: 'bad6347e4f5c1aa49638cf47a',
            id:'75e92c8983'
        });
}]);

}());