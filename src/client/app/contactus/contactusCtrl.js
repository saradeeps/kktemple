
(function () {
    "use strict";

    angular
        .module("temple")
        .controller("ContactUsCtrl",
                    ["dataservices",
                     ContactUsCtrl]);

    function ContactUsCtrl(dataservices) {
        var vm = this;
        vm.sendEmail = sendEmail;

        function sendEmail(){
            
            return dataservices.sendEmail(vm.contact).then(function(data){
                toastr.success('email sent successfully!!!');
                vm.contact={};               
            })
            .catch(function(err){
                vm.contact={}; 
                toastr.error('An error Occured while sending.....');
            });
        }        
    }
}());

