/**
* RestController
*
* @description :: Server-side logic for managing Rests
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {
	me: function(req, res) {
		var token = req.token;
		var me = req.session.user;
		if (me) {
			delete(me.password);
			return res.json(200, me);
		} else {
			return res.json(401, "Your are not authentified");
		}
	},

	users: function(req, res) {
		User.find({active: 1}).exec(function(err, users){
			if (err){
				return res.json(401, "Error: " + err);
			}
			else if(users == ""){
				return res.json(401, "Error: pseudo not found");
			}
			else {
				var data = [];
				var i;
				i = 0;
				users.forEach(function(user){
					delete(user.password);
					data[i] = user;
					i++;
				});
				return res.json(200, data);
			}
		});
	},

	createUserApi: function (req, res) {
		var str = req.param('password');
		var mail = req.param('Email');
		var regexpMaj = /[A-Z]/g;
		var regexpMin = /[a-z]/g;
		var regexpNum = /[0-9]/gi;
		var regexpMail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/;
		if (!req.param('firstName') || !req.param('lastName') || !req.param('Email') || !req.param('pseudo') ||
		!req.param('password'))
		{
			return res.json(401, "Error informations requiers: firstName, lastName, Email, pseudo, password");
		}
		else if (!mail.match(regexpMail)) {
			return res.json(401, "Error email used");
		}
		else if (str.length <= 7 || !str.match(regexpMaj) || !str.match(regexpMin) || !str.match(regexpNum)){
			return res.json(401, "Error need MAJ, MIN, NUM with 8 characters");
		}else {
			var bcrypt = require('bcrypt');
			bcrypt.genSalt(12, function(err, salt) {
				bcrypt.hash(req.param('firstName')+req.param('lastName'), salt, function(err, hash) {
					if(err) {
					} else {
						var code = hash.replace(/\\/g, "");
						code = code.replace(/\//g, "");
						User.create( {facebookId : "fb_Id"+code,
						twitterId: "tw_Id"+code,
						googleId: "g+_eId"+code,
						id_42: "42_id"+code,
						firstName: req.param('firstName'),
						lastName: req.param('lastName'),
						email: req.param('Email'),
						pseudo: req.param('pseudo'),
						password: req.param('password'),
						language: "English",
						codeActive: code},
						function(err, created){
							if (!err){
								var nodemailer = require('nodemailer');
								var transporter = nodemailer.createTransport({
									service: 'Gmail',
									auth: {
										user: 'michaelbouhier66@gmail.com',
										pass: 'bikernumber13'
									}
								});
								var mailOptions = {
									from: '"Admin Hyper" <no-reply@hypertube.com>', // sender address
									to: req.param('Email'), // list of receivers
									subject: 'Inscription', // Subject line
									html: '<b>Cliquez sur ce lien pour activez votre compte :</b>'+
									'<a href="http://localhost:1337/Users/activedAccount/'+req.param('Email')+'&'+code+'">Activez votre compte</a>'// html body
								};
								transporter.sendMail(mailOptions, function(error, info){
									if(error){
									}
								});
								return res.json(200,  "this account created");
							} else {
								var re =  new RegExp('\\bemail\\b','i');
								var match = [];
								match[0] = re.exec(err);
								match[1] = req.param('Email');
								if (match && match[0] == "email"){
									req.session.match = match;
									return res.json(401,  "Error email");
								}
								else {
									match[0] = "pseudo";
									match[2] = req.param('pseudo');
									req.session.match = match;
									return res.json(401,  "Error pseudo");
								}
							}
						});
					}
				});
			});
		}
	},

	findBy: function(req, res) {
		var me = req.session.user;
		if (me) {
			if (req.param('pseudo') !== undefined) {
				User.find({pseudo: req.param('pseudo')}).exec(function(err, users){
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
								delete(user.password);
								return res.json(200, user);
							}
						});
					}
				});
			} else {
				return res.json(401, "It is unknown params");
			}
		} else {
			return res.json(401, "Your are not authentified");
		}
	},

	findById: function(req, res) {
		var me = req.session.user;
		if (me) {
			if (req.param('id') !== undefined) {
				User.find({id: req.param('id')}).exec(function(err, users){
					if (err){
						return res.json(401, "Error: " + err);
					}
					else if(users == ""){
						return res.json(401, "Error: id not found");
					}
					else {
						users.forEach(function(user){
							if (user.active !== 1)
							return res.json(401, "Error: account not actived");
							else {
								delete(user.password);
								return res.json(200, user);
							}
						});
					}
				});
			} else {
				return res.json(401, "It is unknown params");
			}
		} else {
			return res.json(401, "Your are not authentified");
		}
	},

	findAll: function(req, res) {
		var me = req.session.user;
		if (me) {
			User.find({active: 1}).exec(function(err, users){
				if (err){
					return res.json(401, "Error: " + err);
				}
				else if(users == ""){
					return res.json(401, "Error: pseudo not found");
				}
				else {
					var data = [];
					var i;
					i = 0;
					users.forEach(function(user){
						delete(user.password);
						data[i] = user;
						i++;
					});
					return res.json(200, data);
				}
			});
		} else {
			return res.json(401, "Your are not authentified");
		}
	},

	findByToken: function(req, res) {
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
			if(req.session.token) {
				token = req.session.token;
			} else {
				// return res.send(403, { message: 'Not Authorized' });
				return res.view('403');
			}
		}

		jwToken.verify(token, function (err, token) {
			if (err) return res.json(401, {err: 'Invalid Token!'});
			req.token = token; // This is the decrypted token or the payload you provided
			User.find({token: credentials}).exec(function(err, users){
				if (err){
					return res.json(401, "Error: " + err);
				}
				else if(users == ""){
					return res.json(401, "Error: user not found");
				}
				else {
					var data = [];
					var i;
					i = 0;
					users.forEach(function(user){
						delete(user.password);
						data[i] = user;
						i++;
					});
					return res.json(200, data);
				}
			});
		});
	}
};

module.exports.blueprints = {
	actions: true,
	rest: true,
	shortcuts: true,
	pluralize: true
};
