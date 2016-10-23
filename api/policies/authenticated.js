module.exports = function(req, res, next) {
	if (!req.isSocket) {
		if(req.isAuthenticated()) {
			return next();
		} else if(req.headers && req.headers.authorization){
			var token;
			if (req.headers && req.headers.authorization) {
				var parts = req.headers.authorization.split(' ');
				if (parts.length == 2) {
					var scheme = parts[0],
					credentials = parts[1];
					console.log(parts);
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
				next();
			});
		} else {
			// return res.send(403, { message: 'Not Authorized' });
			return res.view('403');
		}
	} else {
		return next();
	}
};
