(function () {
    "use strict";
	angular
		.module("temple")
	    .controller('EventsCtrl',['dataservices', eventsCtrl]);

	    function eventsCtrl(dataservices){

	    	var vm = this;
	    	vm.eventList = [];

			activate();

	    	function activate(){
	    		return dataservices.eventsList().then(function(data){
	    			console.log(data.data);
	    			return vm.eventList = data.data;
	    			
	    		})
	    		.catch(function(err){
	    			console.log("Error occured when fetching events!!!");
	    		});
	    	}
	    }
}());

