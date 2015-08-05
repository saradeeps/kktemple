var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')({lazy:true});
var del = require('del');
var config = require('./gulp.config')();
var port =process.env.PORT || config.defaultPort;

gulp.task('help',$.taskListing);

gulp.task('default',['help']);
gulp.task('vet',function(){

	log("Analyzing-------------");
	return gulp.src(config.alljs)
	.pipe($.if(args.verbose,$.print()))
	.pipe($.jscs())
	.pipe($.jshint())
	.pipe($.jshint.reporter('jshint-stylish',{verbose:true}));
	
});

gulp.task('styles',['clean-styles'],function(){

	log('compiling less to css....');

	return gulp

			.src(config.less)
			.pipe($.plumber())
			.pipe($.less())
			.pipe($.autoprefixer({browser:['last 2 version','> 5%']}))
			.pipe(gulp.dest(config.temp));
});

gulp.task('fonts',['clean-fonts'],function(){

	log('copying fonts....');

	return gulp
			.src(config.fonts)
			.pipe(gulp.dest(config.build+'fonts'));
});

gulp.task('images',['clean-images'],function(){

	log('copying images....');

	return gulp
			.src(config.images)
			.pipe($.imagemin({optimizationLevel:4}))
			.pipe(gulp.dest(config.build+'images'));
});

gulp.task('clean',function(done){
	var delconfig = [].concat(config.build,config.temp);
	log('cleaning...'+$.util.colors.blue(delconfig));
	del(delconfig,done);
});

gulp.task('clean-styles',function(done){
	clean(config.temp+'**/*.css',done);
});

gulp.task('clean-images',function(done){
	clean(config.build+'images/**/*.*',done);
});
gulp.task('clean-fonts',function(done){
	clean(config.build+'fonts/**/*.*',done);
});

gulp.task('clean-code',function(done){
	var files =[].concat(

			config.temp+'**/*.js',
			config.build+'**/*.html',
			config.build+'js/**/*.js'
		);
	clean(files,done);
});

gulp.task('less-watcher',function(){

	gulp.watch([config.less],['styles']);
});

gulp.task('templatecache',['clean-code'],function(){

	log('Creating angular template cache....');
	return gulp 
			.src(config.htmltemplates)
			.pipe($.minifyHtml({empty:true}))
			.pipe($.angularTemplatecache(config.templateCache.file,config.templateCache.options))
			.pipe(gulp.dest(config.temp));
});


gulp.task('wiredep',function(){
	log('wire up the bower css js and our app js into the html');
	var options = config.getWitreDepDefaultOptions();
	var wiredep = require('wiredep').stream;

	return gulp 
			.src(config.index)
			.pipe(wiredep(options))
			.pipe($.inject(gulp.src(config.js)))
			.pipe(gulp.dest(config.client));
});

gulp.task('inject',['wiredep','styles','templatecache'],function(){
	log('wire up the app css  into the html , and call wiredep');
	return gulp 
			.src(config.index)
			.pipe($.inject(gulp.src(config.css)))
			.pipe(gulp.dest(config.client));
});

gulp.task('optimize',['inject','fonts','images'],function(){

log('optimizing css html js...');

var templateCache = config.temp + config.templateCache.file;
var assets =  $.useref.assets({searchPath :'./'});
var cssFilter = $.filter('**/*.css');
var jsappFilter = $.filter('**/app.js');
var jslibFilter = $.filter('**/lib.js');
	return gulp 
			.src(config.index)
			.pipe($.plumber())
			.pipe($.inject(gulp.src(templateCache,{read:false}),{

					starttag:'<!-- inject:templates:js -->'
			}))
			.pipe(assets)
			.pipe(cssFilter)
			.pipe($.csso())
			.pipe(cssFilter.restore())

			.pipe(jslibFilter)
			.pipe($.uglify())
			.pipe(jslibFilter.restore())

			.pipe(jsappFilter)
			.pipe($.ngAnnotate())
			.pipe($.uglify())
			.pipe(jsappFilter.restore())

			.pipe($.rev())

			.pipe(assets.restore())
			.pipe($.useref())
			.pipe($.revReplace())
			.pipe(gulp.dest(config.build))
			.pipe($.rev.manifest())
			.pipe(gulp.dest(config.build));
});

gulp.task('bump',function(){
	
	var msg = 'Bumping Version';
	var type=args.type;
	var version = args.version;
	var options={};
	if(version){

		options.version = version;
		msg +='to' + version;

	}else{

		options.type = type;
		msg +='to' + type;

	}

	log(msg);

	return gulp 
			.src(config.packages)
			.pipe($.print())
			.pipe($.bump(options))
			.pipe(gulp.dest(config.root));
});

gulp.task('serve-build',['optimize'],function(){
	
	serve(false);
});


gulp.task('serve-dev',['inject'],function(){
	serve(true);

});

function serve(isDev){

var nodeOptions = {

	script :config.nodeServer,
	delayTime :1,
	env:{
		'PORT':port,
		'NODE_ENV':isDev ? 'dev' :'build'
	},
	watch:[config.server]
};
	return $.nodemon(nodeOptions)
			.on('restart',function(ev){
				log('re started');
				log('file chnaged on restart'+ev);
				setTimeout(function(){
						browserSync.notify('reloading now....');
						browserSync.reload({stream:false});

				},config.browserReloadDelay);
			})
			.on('start',function(ev){
				log('started');
				startBrowserSync(isDev);
			})
			.on('crash',function(){
				log('crashed');
			})
			.on('exit',function(){
				log('exitt');
			});
}
function clean(path,done){

	log("cleaning"+$.util.colors.blue(path) );
	del(path,done);
}

function changeEvent(event){
	var srcPattern = new RegExp('./.*(?=/'+config.source+')/');
	log('File xx '+event.path.replace(srcPattern,'')+' '+ event.type);
}
function startBrowserSync(isDev){

	if(args.nosync || browserSync.active){
		return;
	}

	log("starting browser synccc");
	if(isDev){
	gulp.watch([config.less],['styles'])
		.on('change',function(event){changeEvent(event);});
}else{
gulp.watch([config.less,config.js,config.html],['optimize',browserSync.reload])
		.on('change',function(event){changeEvent(event);});

}
	var options = {

		proxy :'localhost:'+port,
		port :3000,
		files:isDev ? [config.client+'**/**',
				'!'+config.less,
				config.temp+'**/^.*'

		] : [],
		ghostMode:{
			clicks :true,
			locations :false,
			forms :true,
			scroll :true
		},
		injectChnages :true,
		logFileChanges :true,
		logLevel :'debug',
		logPrefix :'gulp-patterns',
		notify:true,
		reloadDelay :1000
	};
	browserSync(options);
}
function log(msg){

	if(typeof(msg)=='object'){

		for (var item in msg){

			if(msg.hasOwnProperty(item)){

				$.util.log($.util.colors.blue(msg[item]));
			}
		}
	}else {

		$.util.log($.util.colors.blue(msg));
	}
}
