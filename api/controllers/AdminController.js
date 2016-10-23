/**
* AdminController
*
* @description :: Server-side logic for managing admins
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {
	listUsers: function(req, res) {
		var page = 1;
		var update = 0;
		var msg = "";
		var me = req.session.user;
		var query = User.find();
		var error_msg = [
			"Format email incorrect !",
			"Format firstName incorrect !",
			"Le firstName peut possèder: 2 à 35 charactères",
			"Format lastName incorrect !",
			"Le lastName peut possèder: 2 à 35 charactères",
			"Format pseudo incorrect !",
			"Le pseudo peut possèder: 2 à 35 charactères",
			"Permission incorrect !",
			"Language incorrect !",
			"Vous devez avoir une photo pour pouvoir la supprimer",
			"Le codeActive doit possèder au minimum 2 charactères",
			"Error"
		];
		if (req.url.match("page=")) {
			url = req.url.split("page=")
			if (url[1].match("OK=update")) {
				url = url[1].split("\?OK=update")
				url[1] = url[0]
				update = 1
			} else if (url[1].match("OFF=update")) {
				url = url[1].split("\?OFF=update")
				url[1] = url[0]
				update = 2
				check_msg = url[1].split("-")
				msg = check_msg[1]
				if (msg === "email") {
					msg = error_msg[0]
				} else if (msg === "firstName0") {
					msg = error_msg[1]
				} else if (msg === "firstName1") {
					msg = error_msg[2]
				} else if (msg === "lastName0") {
					msg = error_msg[3]
				} else if (msg === "lastName1") {
					msg = error_msg[4]
				} else if (msg === "peudo0") {
					msg = error_msg[5]
				} else if (msg === "pseudo1") {
					msg = error_msg[6]
				} else if (msg === "permit") {
					msg = error_msg[7]
				} else if (msg === "language") {
					msg = error_msg[8]
				} else if (msg === "pic") {
					msg = error_msg[9]
				} else if (msg === "codeActive0") {
					msg = error_msg[10]
				} else if (msg === "error") {
					msg = error_msg[11]
				}

			}
			// if (url[1]) {
			// 	if (Number(url[1])) {
			// 		page = url[1]
			// 		User.find().paginate({page: page, limit: 10}).exec(function(err, found){
			// 			if (err)
			// 				return res.serverError(err);
			// 			return res.view('gestionUsers', {listUsers: found, page: page, update: update, msg: msg});
			// 		});
			// 	} else {
			// 		User.find().paginate({page: page, limit: 10}).exec(function(err, found){
			// 			if (err)
			// 				return res.serverError(err);
			// 			return res.view('gestionUsers', {listUsers: found, page: page, update: update, msg: msg});
			// 		});
			// 	}
			// }
			User.find().exec(function(err, found){
				if (err)
					return res.serverError(err);
				return res.view('gestionUsers', {listUsers: found, update: update, msg: msg});
			});
		} else {
			if (req.url.match("OK=update")) {
				update = 1
			} else if (req.url.match("OFF=update")) {
				check_msg = req.url.split("-")
				msg = check_msg[1]
				if (msg === "email") {
					msg = error_msg[0]
				} else if (msg === "firstName0") {
					msg = error_msg[1]
				} else if (msg === "firstName1") {
					msg = error_msg[2]
				} else if (msg === "lastName0") {
					msg = error_msg[3]
				} else if (msg === "lastName1") {
					msg = error_msg[4]
				} else if (msg === "peudo0") {
					msg = error_msg[5]
				} else if (msg === "pseudo1") {
					msg = error_msg[6]
				} else if (msg === "permit") {
					msg = error_msg[7]
				} else if (msg === "language") {
					msg = error_msg[8]
				} else if (msg === "pic") {
					msg = error_msg[9]
				} else if (msg === "codeActive0") {
					msg = error_msg[10]
				}
				update = 2
			}
			if (me.admin === 2) {
				query.where({'admin': [1,0]}).paginate({page: page, limit: 10}).exec(function(err, found){
					if (err)
						return res.serverError(err);
					return res.view('gestionUsers', {listUsers: found, page: page, update: update, msg: msg, me: me});
				});
			} else if (me.admin === 1) {
				query.where({'admin': 0}).paginate({page: page, limit: 10}).exec(function(err, found){
					if (err)
						return res.serverError(err);
					return res.view('gestionUsers', {listUsers: found, page: page, update: update, msg: msg, me: me});
				});
			} else {
				return res.redirect('/');
			}
		}
	},

///////////////////////////////////////////////////////ADMIN UPDATE////////////////////////////////////////////////////////////////////////////////////////////////

	adminUpdateUser: function(req, res) {
		User.find({ id: req.param("id_user") }).exec(function(err, user){
			const fs = require('fs');
			var temp = user.pop();
			var newUrl = "";
			var backURL = req.header('Referer') || '/';
			if (err) {
				return res.serverError(err);
			} else {
				if (backURL.match("OFF=update") || backURL.match("OK=update")) {
					parseUrl = backURL.split("\?");
					if (parseUrl[1] && (parseUrl[1].match("OFF=update") || parseUrl[1].match("OK=update"))) {
						newUrl = parseUrl[0]
					} else if (parseUrl[2] && (parseUrl[2].match("OFF=update") || parseUrl[1].match("OK=update"))) {
						newUrl = parseUrl[0] + "?" + parseUrl[1]
					} else {
						newUrl = backURL
					}
				}
				if (newUrl !== "") {
					backURL = newUrl
				}
				if (req.param("action") === "active") {
					temp.active = 1
				} else if (req.param("action") === "desactive") {
					temp.active = 0
				} else if (req.param("action") === "delete_pic") {
					if (temp.photo && temp.photo !== "") {
						var tmp_dir = temp.photo
						fs.unlink('./assets' + tmp_dir, (err) => {
							if (err) {
							} else {
								temp.photo = "";
								temp.save(function(err) {
									if (err) throw err;
								});
							}
						});
					} else {
						if (backURL.match("OK=update")) {
							parseUrl = backURL.split("\?");
							if (parseUrl[1] && parseUrl[1] === "OK=update") {
								parseUrl[1] = "OFF=update-pic"
								newUrl = parseUrl[0] + "?" + parseUrl[1]
							} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
								parseUrl[2] = "OFF=update-pic"
								newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
							} else {
								newUrl = backURL
							}
							return res.redirect(newUrl)
						} else {
							return res.redirect(backURL + "?OFF=update-pic")
						}
					}
				} else {
					var permit = 0
					if (req.param("permit") === "admin")
						permit = 1
					if (req.param("email") !== temp.email || req.param("firstName") !== temp.firstName || req.param("lastName") !== temp.lastName || req.param("pseudo") !== temp.pseudo || req.param("codeActive") !== temp.codeActive || permit !== temp.admin || req.param("language") !== temp.language) {
						if (req.param("email") !== "" && req.param("email") !== undefined && req.param("email") !== temp.email) {
									if (req.param("email").match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/)) {
										temp.email = req.param("email")
									} else {
										if (backURL.match("OK=update")) {
											parseUrl = backURL.split("\?");
											if (parseUrl[1] && parseUrl[1] === "OK=update") {
												parseUrl[1] = "OFF=update-email"
												newUrl = parseUrl[0] + "?" + parseUrl[1]
											} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
												parseUrl[2] = "OFF=update-email"
												newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
											} else {
												newUrl = backURL
											}
											return res.redirect(newUrl)
										} else {
											return res.redirect(backURL + "?OFF=update-email")
										}
									}
						}

						if (req.param("firstName") !== "" && req.param("firstName") !== undefined  && req.param("firstName") !== temp.firstName) {
							count = req.param("firstName").length
							if (count > 1 && count < 35) {
								var check = req.param("firstName").match(/[A-z\- éèàç]/g).length
								if (check === count) {
									temp.firstName = req.param("firstName")
								} else {
									if (backURL.match("OK=update")) {
										parseUrl = backURL.split("\?");
										if (parseUrl[1] && parseUrl[1] === "OK=update") {
											parseUrl[1] = "OFF=update-firstName0"
											newUrl = parseUrl[0] + "?" + parseUrl[1]
										} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
											parseUrl[2] = "OFF=update-firstName0"
											newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
										} else {
											newUrl = backURL
										}
										return res.redirect(newUrl)
									} else {
										return res.redirect(backURL + "?OFF=update-firstName0")
									}
								}
							} else {
								if (backURL.match("OK=update")) {
									parseUrl = backURL.split("\?");
									if (parseUrl[1] && parseUrl[1] === "OK=update") {
										parseUrl[1] = "OFF=update-firstName1"
										newUrl = parseUrl[0] + "?" + parseUrl[1]
									} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
										parseUrl[2] = "OFF=update-firstName1"
										newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
									} else {
										newUrl = backURL
									}
									return res.redirect(newUrl)
								} else {
									return res.redirect(backURL + "?OFF=update-firstName1")
								}
							}
						}
						if (req.param("lastName") !== "" && req.param("lastName") !== undefined && req.param("lastName") !== temp.lastName) {
							count = req.param("lastName").length
							if (count > 1 && count < 35) {
								var check = req.param("lastName").match(/[A-z\- éèàç]/g).length
								if (check === count) {
									temp.lastName = req.param("lastName")
								} else {
									if (backURL.match("OK=update")) {
										parseUrl = backURL.split("\?");
										if (parseUrl[1] && parseUrl[1] === "OK=update") {
											parseUrl[1] = "OFF=update-lastName0"
											newUrl = parseUrl[0] + "?" + parseUrl[1]
										} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
											parseUrl[2] = "OFF=update-lastName0"
											newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
										} else {
											newUrl = backURL
										}
										return res.redirect(newUrl)
									} else {
										return res.redirect(backURL + "?OFF=update-lastName0")
									}
								}
							} else {
								if (backURL.match("OK=update")) {
									parseUrl = backURL.split("\?");
									if (parseUrl[1] && parseUrl[1] === "OK=update") {
										parseUrl[1] = "OFF=update-lastName1"
										newUrl = parseUrl[0] + "?" + parseUrl[1]
									} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
										parseUrl[2] = "OFF=update-lastName1"
										newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
									} else {
										newUrl = backURL
									}
									return res.redirect(newUrl)
								} else {
									return res.redirect(backURL + "?OFF=update-lastName1")
								}
							}
						}
						if (req.param("pseudo") !== "" && req.param("pseudo") !== undefined && req.param("pseudo") !== temp.pseudo) {
							count = req.param("pseudo").length
							if (count > 1 && count < 36) {
								var check = req.param("pseudo").match(/[A-z0-9\- éèàç]/g).length
								if (check === count) {
									temp.pseudo = req.param("pseudo")
								} else {
									if (backURL.match("OK=update")) {
										parseUrl = backURL.split("\?");
										if (parseUrl[1] && parseUrl[1] === "OK=update") {
											parseUrl[1] = "OFF=update-pseudo0"
											newUrl = parseUrl[0] + "?" + parseUrl[1]
										} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
											parseUrl[2] = "OFF=update-pseudo0"
											newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
										} else {
											newUrl = backURL
										}
										return res.redirect(newUrl)
									} else {
										return res.redirect(backURL + "?OFF=update-pseudo0")
									}
								}
							} else {
								if (backURL.match("OK=update")) {
									parseUrl = backURL.split("\?");
									if (parseUrl[1] && parseUrl[1] === "OK=update") {
										parseUrl[1] = "OFF=update-pseudo1"
										newUrl = parseUrl[0] + "?" + parseUrl[1]
									} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
										parseUrl[2] = "OFF=update-pseudo1"
										newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
									} else {
										newUrl = backURL
									}
									return res.redirect(newUrl)
								} else {
									return res.redirect(backURL + "?OFF=update-pseudo1")
								}
							}
						}
						if (req.param("codeActive") !== "" && req.param("codeActive") !== undefined && req.param("codeActive") !== temp.codeActive) {
							if (req.param("codeActive").length > 1) {
								temp.codeActive = req.param("codeActive")
							} else {
								if (backURL.match("OK=update")) {
									parseUrl = backURL.split("\?");
									if (parseUrl[1] && parseUrl[1] === "OK=update") {
										parseUrl[1] = "OFF=update-codeActive0"
										newUrl = parseUrl[0] + "?" + parseUrl[1]
									} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
										parseUrl[2] = "OFF=update-codeActive0"
										newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
									} else {
										newUrl = backURL
									}
									return res.redirect(newUrl)
								} else {
									return res.redirect(backURL + "?OFF=update-codeActive0")
								}
							}
						}
						if (req.param("permit") !== "" && req.param("permit") !== undefined) {
							if (req.param("permit") === "member") {
								temp.admin = 0
							} else if (req.param("permit") === "admin") {
								temp.admin = 1
							} else {
								if (backURL.match("OK=update")) {
									parseUrl = backURL.split("\?");
									if (parseUrl[1] && parseUrl[1] === "OK=update") {
										parseUrl[1] = "OFF=update-permit"
										newUrl = parseUrl[0] + "?" + parseUrl[1]
									} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
										parseUrl[2] = "OFF=update-permit"
										newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
									} else {
										newUrl = backURL
									}
									return res.redirect(newUrl)
								} else {
									return res.redirect(backURL + "?OFF=update-permit")
								}
							}
						}
						if (req.param("language") !== "" && req.param("language") !== undefined) {
							if (req.param("language") === "English" || req.param("language") === "Français") {
								temp.language = req.param("language")
							} else {
								if (backURL.match("OK=update")) {
									parseUrl = backURL.split("\?");
									if (parseUrl[1] && parseUrl[1] === "OK=update") {
										parseUrl[1] = "OFF=update-language"
										newUrl = parseUrl[0] + "?" + parseUrl[1]
									} else if (parseUrl[2] && parseUrl[2] === "OK=update") {
										parseUrl[2] = "OFF=update-language"
										newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
									} else {
										newUrl = backURL
									}
									return res.redirect(newUrl)
								} else {
									return res.redirect(backURL + "?OFF=update-language")
								}
							}
						}
					} else {
						if (backURL.match("OK=update") || backURL.match("OFF=update")) {
							parseUrl = backURL.split("\?");
							if (parseUrl[1] && (parseUrl[1] === "OK=update" || parseUrl[1] === "OFF=update")) {
								newUrl = parseUrl[0]
							} else if (parseUrl[2] && (parseUrl[2] === "OK=update" || parseUrl[2] === "OFF=update")) {
									newUrl = parseUrl[0] + "?" + parseUrl[1]
							} else {
								newUrl = backURL
							}
							return res.redirect(newUrl)
						} else {
							return res.redirect(backURL)
						}
					}
				}

				temp.save(function(err){
					if (err)
					{
						if (backURL.match("OK=update") || backURL.match("OFF=update")) {
							parseUrl = backURL.split("\?");
							if (parseUrl[1] && (parseUrl[1] === "OK=update" || parseUrl[1] === "OFF=update")) {
								newUrl = parseUrl[0]
							} else if (parseUrl[2] && (parseUrl[2] === "OK=update" || parseUrl[2] === "OFF=update")) {
									newUrl = parseUrl[0] + "?" + parseUrl[1]
							} else {
								newUrl = backURL
							}
							return res.redirect(newUrl)
						} else {
							return res.redirect(backURL + "?OFF=update-error")
						}
					}
					if (backURL.match("OK=update")) {
						return res.redirect(backURL)
					} else if (backURL.match("OFF=update")){
						parseUrl = backURL.split("\?");
						if (parseUrl[1] && parseUrl[1] === "OFF=update") {
							parseUrl[1] = "OK=update"
							newUrl = parseUrl[0] + "?" + parseUrl[1]
						} else if (parseUrl[2] && parseUrl[2] === "OFF=update") {
							parseUrl[2] = "OK=update"
							newUrl = parseUrl[0] + "?" + parseUrl[1] + "?" + parseUrl[2]
						} else {
							newUrl = backURL
						}
						return res.redirect(newUrl)
					}  else {
						return res.redirect(backURL + "?OK=update")
					}
				});
			}

		});
	},

};
