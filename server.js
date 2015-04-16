var express = require('express')
	passport = require('passport'),	//Authentication middleware
		passportLocal = require('passport-local').Strategy,	//passport local strategy
		bodyParser = require('body-parser'),	//for reading credentials from request bodies
		cookieParser = require('cookie-parser'),	//for stoting session id in browser
		expressSession = require('express-session'),	// support for sessions in express
		ejs = require('ejs');	//View engine

var app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());
app.use(expressSession({resave : false, saveUninitialized : false, secret : 'secret cat'}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(function(user, password, done) {
	if (user === password){
		userObject = {
			id : user,
			name : user,
			email : user + '@gmail.com'
		};
		done(null, userObject);	//return the user object;
	} else {
		done(null, null);
	}
}));

passport.serializeUser(function(userObject, done) {
	done(null, userObject.id);
});

passport.deserializeUser(function(userid, done) {
	done(null, {id: userid, name : 'prabhat'});
});

app.get('/', function(req, res) {
	res.render('index', { 
		isAuthenticated : req.isAuthenticated(),
		user : req.user
	});
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', passport.authenticate('local', {failureRedirect : '/login' }) , function(req, res) {
	//res.send('TODO : Authenticate');
	res.redirect('/');
});

app.listen(3000, function(){
	console.log('server listening on http://localhost:3000');
});
