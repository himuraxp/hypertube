var passport = require('passport');

module.exports = {

	login: function(req, res) {
		res.view('../views/login');
	},

	process: function(req, res) {
		User.find({pseudo: req.param('pseudo')}).exec(function(err, found){
			if (err){
				return res.send(err);
			}
			else if(found == ""){
				return res.view('login', {badmail: "pseudo"});
			}
			else {
				found.forEach(function(result){
					if (result.active != "1")
					return res.view('../views/login', {error: "notActive"});
					else {
						passport.authenticate('local', function(err, user, info) {
							if( (err)||(!user) ) {
								return res.view('../views/login', {error: "badlog"});
							}
							req.logIn(user, function(err) {
								if(err) res.send(err);
								req.session.etat = "connecté";
								req.session.user = user;
								req.session.me = req.param('pseudo');
								return res.redirect('/');
							});
						}) (req, res);
					}
				});
			}
		});
	},

	postAuth: function(req, res) {
		User.find({pseudo: req.param('pseudo')}).exec(function(err, found){
			if (err) {
				return res.send(err);
			} else if(found == ""){
				return res.view('login', {badmail: "pseudo"});
			} else {
				found.forEach(function(result){
					if (result.active != "1")
					return res.view('../views/login', {error: "notActive"});
					else {
						passport.authenticate('local', function(err, user, info) {
							if( (err)||(!user) ) {
								return res.view('../views/login', {error: "badlog"});
							}
							req.logIn(user, function(err) {
								if(err) res.send(err);
								return res.json(200, user.token);
							});
						}) (req, res);
					}
				});
			}
		});
	},

	restAuth: function(req, res) {
		if (req.headers && req.headers.authorization) {
			var token;
			if (req.headers && req.headers.authorization) {
				var parts = req.headers.authorization.split(' ');
				if (parts.length == 2) {
					var scheme = parts[0],
					credentials = parts[1];
					if (/^Bearer$/i.test(scheme)) {
						token = credentials;
					}
				} else {
					return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
				}
			} else if (req.param('token')) {
				token = req.param('token');
				// We delete the token from param to not mess with blueprints
				delete req.query.token;
			} else {
				return res.json(401, {err: 'No Authorization header was found'});
			}

			jwToken.verify(token, function (err, token) {
				if (err) return res.json(401, {err: 'Invalid Token!'});
				req.token = token; // This is the decrypted token or the payload you provided
				return res.json(200, {success: 'Token Verified'});
			});
		} else {
			if (req.session.user) {
				User.find({token : req.session.user.token}).exec(function(err, users){
					if (err){
						return res.json(401, "Error: " + err);
					}
					else if(users == ""){
						return res.json(401, "Error: pseudo not found");
					}
					else {
						users.forEach(function(user){
							if (user.active !== 1)
							return res.json(401, "Error: account not actived");
							else {
								return res.json(200, user.token);
							}
						});
					}
				});
			} else {
				res.view('apiauth');
			}
		}
	},

	logout: function(req, res) {
		req.logOut();
		req.session.etat = "déconnecté";
		req.session.me = "";
		req.session.user = "";
		res.redirect('/');
	},

	authenticate: function(req,res){
		passport.authenticate('google',{scope:['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']},
		function (err, user) {
			req.logIn(user, function (err) {
				if(err) {
					req.session.flash = 'There was an error';
					res.redirect('login');
				} else {
					req.session.etat = "connecté";
					req.session.user = user;
					req.session.me = user.firstName;
					res.redirect('/');
				}
			});
		})(req,res);
	},
	authcallback: function(req,res){
		passport.authenticate('google', {failureRedirect: 'login',successRedirect:'/'},
		function (err, user) {
			req.logIn(user, function (err) {
				if(err) {
					req.session.flash = 'There was an error';
					res.redirect('login');
				} else {
					req.session.etat = "connecté";
					req.session.user = user;
					req.session.me = user.firstName;
					res.redirect('/');
				}
			});
		})(req,res);
	}

};

module.exports.blueprints = {
	actions: true,
	rest: true,
	shortcuts: true
};
