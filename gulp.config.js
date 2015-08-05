 module.exports =function(){

var client = './src/client/';
var clientApp = client +'app/';
var temp = './.tmp/';
var root ='./'
var server ='./src/server/';
//all js for vet
	var config ={
		temp :temp,
		//all js to vet
		alljs:['./src/**/*.js'],
		build:'./build/',
		//fonts:'./bower_components/font-awesome/fonts/**/*.*',
		fonts:client+'fonts/**/*.*',
		html:clientApp+'**/*.html',
		htmltemplates:clientApp+'**/*.html',
		images:client+'images/**/*.*',
		client :client,
		css:[
		temp+'styles.css',
		client+'css/**/*.*'
		],
		index : client +'index.html',
		js:[

			clientApp +'**/*.module.js',
			clientApp +'**/*.js',
			'!'+clientApp+'**/*.spec.js'

		],
		less:client +'styles/styles.less',
		bower:{
			json :require('./bower.json'),
			directory:'./bower_components/',
			ignorePath:'../..'
		},

		packages:[

			'./package.json',
			'./bower.json'
		],
		templateCache:{

			file:'templates.js',
			options:{
				module:'common.services',
				standAlone:false,
				root:'app/' //need to check
			}
		},
		browserReloadDelay:1000,
		defaultPort:7203,
		nodeServer:'./src/server/app.js',
		server:server,
		root:root
	};

config.getWitreDepDefaultOptions = function(){

	var options = {
		bowerJson : config.bower.json,
		directory:config.bower.directory,
		ignorePath:config.bower.ignorePath

	};
	return options;
};

return config;
};