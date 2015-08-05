(function() {

	angular
		.module("temple")
		.controller('FooterCtrl', ['CgMailChimpService', footerCtrl]);

	function footerCtrl(CgMailChimpService) {
		var vm = this;

		vm.subscribe = subscribeToMailList;

		function subscribeToMailList() {

			var data = {
				EMAIL: vm.email
			};

			CgMailChimpService.subscribe(data).then(function(data) {
					vm.email = '';
					toastr.success('Please confirm your email (chk yur inbox) after which yu are subscribed. Yipppeee');

				})
				.catch(function(err) {

					vm.email = '';
					if (err.msg) {

						if (err.msg.indexOf("already subscribed") > -1) {

							toastr.error('Already subscribed...');
						} else {

							toastr.error('An error Occured while sending.....');
						}


					} else {

						toastr.error('An error Occured while sending.....');
					}

				});
		}

	}

}());