var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

///////////////////////strategie local////////////////////////////
passport.use(new LocalStrategy({
	usernameField: 'pseudo',
	passwordField: 'password'
},
function(pseudo, password, done) {
	User.findOne({ pseudo: pseudo }).exec(function(err, user) {
		if(err) { return done(err); }
		if(!user) { return done(null, false, { message: 'Unknown user ' + pseudo }); }
		bcrypt.compare(password, user.password, function(err, res) {
			if(!res) return done(null, false, {message: 'Invalid Password'});
			return done(null, user);
		});
	});
}
));

///////////////////////strategie facebook////////////////////////////
var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;

function findById(id, fn) {
	User.findOne(id, function(err,user){
		if (err) {
			return fn(null, null);
		} else {
			return fn(null, user);
		}
	});
}

function findByFacebookId(id, fn) {
	User.findOne({facebookId: id}, function(err,user){
		if (err) {
			return fn(null, null);
		} else {
			return fn(null, user);
		}
	});
}

passport.use(new FacebookStrategy({
	clientID: "1145451882188370",
	clientSecret: "dbee56ae724bcd010f8abeb3d6923b1c",
	callbackURL: "http://localhost:1337/user/facebook/callback",
	profileFields: [ 'email' , 'name' , 'birthday', 'bio', 'gender',
	'interested_in', 'languages', 'link', 'locale', "picture"],
}, function (accessToken, refreshToken, profile, done) {
	findByFacebookId(profile.id, function (err, user) {
		User.find({facebookId: profile.id

		}).exec(function(err, found){
			if(!found[0]){
				User.create({facebookId: profile.id,
					twitterId: "twitterId-"+profile.id,
					googleId: "googleId-"+profile.id,
					firstName: profile.name.givenName,
					id_42: "id_42-"+profile.id,
					lastName: profile.name.familyName,
					email: profile.emails[0].value+".fb",
					pseudo:  profile.name.givenName+profile.id,
					password: profile.name.givenName+profile.id+profile.name.familyName,
					language: "English",
					active: 1},
					function(err,user){

						if (user) {
							return done(null, user, {
								message: 'Logged In Successfully'
							});
						} else {
							return done(err, null, {

								message: 'There was an error logging you in with Facebook'
							});
						}
					});
				} else{
					found.forEach(function(result){
						return done(null, user, {
							message: 'Logged In Successfully'
						});

					});
				}
			});
		});
	}
));

///////////////////////strategie twitter////////////////////////////
var passport = require('passport'),
TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
	consumerKey: "7k8t0pMDJifKgehTeVT6GKrPq",
	consumerSecret: "H4sRXsH183DnG0e3XfPWxKt8msFnvGI8GpUGzDTFSiXesRJNIP",
	callbackURL: "http://localhost:1337/user/twitter/callback",
},
function(token, tokenSecret, profile, done) {
	var Name = profile._json.name.toString().split(" ");
	User.find({twitterId: profile._json.id

	}).exec(function(err, found){
		if(!found[0]){
			User.create({facebookId: "facebookId-"+profile._json.id,
			twitterId: profile._json.id,
			googleId: "googleId-"+profile._json.id,
			id_42: "id_42-"+profile._json.id,
			firstName: Name[0],
			lastName: Name[1],
			email: Name[0]+"@"+Name[1]+".tw",
			pseudo:  Name+profile._json.id,
			password: Name+profile._json.id+Name,
			language: "English",
			active: 1},
			function(err,user){

				if (user) {
					return done(null, user, {
						message: 'Logged In Successfully'
					});
				} else {
					return done(err, null, {

						message: 'There was an error logging you in with Twitter'
					});
				}
			});
		} else {
			return done(null, found[0], {
				message: 'Logged In Successfully'
			});
		}
	});
}
));

///////////////////////strategie google plus////////////////////////////
var passport = require('passport'),
GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
	clientID:"705176183911-ndkijc17kf01faa1at213uam7jm6i3f6.apps.googleusercontent.com",
	clientSecret: "Na9I5dFMc_szvDjX5W3WRbOB",
	callbackURL: "http://localhost:1337/auth/authcallback",
}, function(accessToken,regreshToken,profile,done) {
	process.nextTick(function(){
		User.findOne({googleId:profile.id}, function(err,user){
			if(err){
				return done(null,err);
			} else {
				if(!user){
					User.create({googleId:profile.id,
						facebookId: "facebookId-"+profile.id,
						twitterId: "twitterId-"+profile.id,
						id_42: "id_42-"+profile.id,
						firstName: profile.name.givenName,
						lastName: profile.name.givenName,
						email: profile.emails[0].value+".gp",
						pseudo:  profile.name.givenName+profile.id,
						password: profile.name.givenName+profile.id+profile.name.familyName,
						language: "English",
						active: 1},
						function(err,user){
							if (user) {
								return done(null, user, {
									message: 'Logged In Successfully'
								});
							} else {
								return done(err, null, {

									message: 'There was an error logging you in with Facebook'
								});
							}
						});
					} else {
						return done(null, user, {
							message: 'Logged In Successfully'
						});
					}
				}
			});
		});
	}));

	///////////////////////strategie 42////////////////////////////
	var passport = require('passport'),
	Strategy_42 = require('passport-oauth2');
	passport.use(new Strategy_42({
		authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
		tokenURL: 'https://api.intra.42.fr/oauth/token',
		clientID: "766e24e2222187890dc61ae7b0bdf5645b346659231122886d57acd0cddf229c",
		clientSecret: "1fdc874de6cb47f114c194e12e0bce42ecad927dc6b372a191b8b48a4aee24dd",
		callbackURL: "http://localhost:1337/user/auth_42/callback",
	}, function(accessToken, refreshToken, profile, done) {
		const request = require('request');
		request({
			url: 'https://api.intra.42.fr/v2/me',
			auth: {
				'bearer': accessToken
			}
		}, function(err, res) {
			var user = JSON.parse(res.body);
			User.find({Id_42: user.id}).exec(function(err, found){
				if(!found[0]){
					User.find({pseudo:  user.login}).exec(function(err, found2){
						if (!found2){
							User.create({facebookId: "facebookId-"+user.id,
							twitterId: "twitterId-"+user.id,
							googleId: "googleId-"+user.id,
							id_42: user.id,
							firstName: user.first_name,
							lastName: user.last_name,
							email: user.email,
							pseudo:  user.login,
							password: user.displayname+user.id+user.displayname,
							language: "English",
							active: 1},
							function(err, created){

								if (created) {
									return done(null, created, {
										message: 'Logged In Successfully'
									});
								} else {
									return done(err, null, {
										message: 'There was an error logging you in with Twitter'
									});
								}
							});
						} else {
							User.create({facebookId: "facebookId-"+user.id,
							twitterId: "twitterId-"+user.id,
							googleId: "googleId-"+user.id,
							id_42: user.id,
							firstName: user.first_name,
							lastName: user.last_name,
							email: user.email,
							pseudo:  user.login+user.id,
							password: user.displayname+user.id+user.displayname,
							language: "English",
							active: 1},
							function(err, created){

								if (created) {
									return done(null, created, {
										message: 'Logged In Successfully'
									});
								} else {
									return done(err, null, {
										message: 'There was an error logging you in with Twitter'
									});
								}
							});
						}
					})

				} else {
					return done(null, found[0], {
						message: 'Logged In Successfully'
					});
				}
			});
		});
	}));
