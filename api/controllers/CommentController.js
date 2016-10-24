/**
* CommentController
*
* @description :: Server-side logic for managing comments
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {

	getComment: function(req, res) {
		if(req.param('titleMovie')){
			Comment.find({where:{videos: req.param('titleMovie')}}).exec(function(err, found){
				if (err)
				return res.serverError(err);
				sails.sockets.join(req, req.param('titleMovie')+"get"+req.session.user.id);
				sails.sockets.blast(req.param('titleMovie')+"get"+req.session.user.id, {listComment: found, titleMovie: req.param('titleMovie')});
			});
		}
		else {
			sails.log("You don't have permission to see the page you're trying to reach.");
			return res.redirect("/");
		}
	},
	delComment: function(req, res) {
		if(!req.param('idMovie') || !req.param('titleMovie') || !req.param('userId') || (req.param('userId') != req.session.user.id)){
			req.session.errSignup = "signupIncomplete";
			return res.redirect("/");
		}
		else{
			Comment.destroy({id: req.param('idMovie')}).exec(function (err){
				if (err) {
					return res.negotiate(err);
				}
				sails.log('Deleted comment');
				req.session.deletedComment = "delete";
				sails.sockets.join(req, req.param('titleMovie')+"del");
				sails.sockets.blast(req.param('titleMovie')+"del", {idMovie: req.param('idMovie')});
			});
		}
	},
	comment: function (req, res){
		if(req.param('titleMovie') && req.param('contenu_comment')){
			Comment.create({contenu:  req.param('contenu_comment'),
			idUser: req.session.user.id,
			pseudoUser: req.session.user.pseudo,
			photoUser: req.session.user.photo,
			videos: req.param('titleMovie')
		},
		function(err, created){
			if (created) {
				if (err)
				return res.serverError(err);
				sails.sockets.join(req, req.param('titleMovie'));
				sails.sockets.blast(req.param('titleMovie'), {listComment: created, contenu: req.param('contenu_comment'), posterMovie: req.param('posterMovie'), pseudoUser: req.session.user.pseudo, idUser: req.session.user.id, photoUser: req.session.user.photo});
			} else {
			}
		});
	}
	else {
		sails.log("You don't have permission to see the page you're trying to reach.");
		return res.redirect("/");
	}
}
};
