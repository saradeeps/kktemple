module.exports = function(app) {
    var api = '/api';
    var data = '/../../data/';
	var config = require('./../config/config');
    var jsonfileservice = require('./utils/jsonfileservice')();
	var sendgrid  = require('sendgrid')(config.sendgridapi);

    app.get(api + '/customer/:id', getCustomer);
    app.get(api + '/customers', getCustomers);
	  app.post(api + '/email', sendEmail);

    function getCustomer(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
        var customer = json.filter(function(c) {
            return c.id === parseInt(req.params.id);
        });
        res.send(customer[0]);
    }

    function getCustomers(req, res, next) {
        var json = jsonfileservice.getJsonFromFile(data + 'customers.json');
        res.send(json);
    }
	
	 function sendEmail(req, res, next) {
       sendgrid.send({
                        to:       'saradeeps14@gmail.com',
                        from:     'Temple Web <saradeeps14@gmail.com>',
                        subject:  'Message From ' + req.body.firstname,
                        text:     'The following message was submitted through Contact Us page.' +'\n\n'
                                   + 'Name : ' + req.body.firstname + ' '+ req.body.lastname +'\n\n' 
                                    + 'Email : ' + req.body.email +'\n\n' 
                                     + 'Phone : ' + req.body.phone +'\n\n' 
                                      + 'Message : ' + req.body.message  

                      }, function(err, json) {
                            if (err) return next(err);
                            res.sendStatus(200);
});
    }
};
