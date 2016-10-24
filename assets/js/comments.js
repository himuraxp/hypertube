function  comment(popId, userId) {
	io.socket.off(popId+"get"+userId);
	io.socket.off(popId);
	if(!document.getElementById("textarea"+popId)){
		document.getElementById(popId).style.width = "auto%";
		document.getElementById(popId).style.height = "520px";
		document.getElementById(popId).style.color = "black";
		document.getElementById(popId).style.overflow = "auto";
		var el = document.getElementById(popId),
		elChild = document.createElement('div');
		elChild.innerHTML = '<div class="content-inner com-post">'+
		'<div class="form-group">'+
		'<textarea name="textarea'+popId+'" rows="3" style="resize:none; width: 100%;margin-bottom:0;" id="textarea'+popId+'"></textarea>'+
		'</div>'+
		'<button class="btn-hp hvr-bounce-to-bottom"><input class="button-input" type="submit" onclick="saveComment(\''+popId+'\')" name="image" value="Save comment" id="save"></button>'+
		'</div>'+
		'<div id="ul'+popId+'" name="'+popId+'" class="com-user">'+
		'</div>';
		// Prepend it
		el.insertBefore(elChild, el.firstChild);
		io.socket.post('/movie/get', {titleMovie: popId},function(resData, jwres){
		});
		io.socket.on(popId+"get"+userId, function(data){
			data.listComment.forEach(function(listComment){
				var el = document.getElementById('ul'+popId),
				elChild = document.createElement('div');
				elChild.setAttribute("id", "_commentDel"+listComment.id);
				var photo;
				var del;
				if(listComment.photoUser && listComment.photoUser != 'N/A'){
					photo = listComment.photoUser;
				}
				else {
					photo = "/images/pic_default.jpg";
				}
				if(listComment.idUser == userId){
					del = '<div id="delete">'+
					'<input onclick="delComment(\''+listComment.id+'\', \''+popId+'\',\''+userId+'\' )" type=image name="imagedel" value="&#xf00d;" style="font-family: FontAwesome;float:right" align="middle" >'+
					'</div></br>';
				}
				else {
					del = '</br>';
				}
				elChild.innerHTML =  '<p></p>'+
				'<div class="event">'+
				'<div class="content">'+
				'<div class="content-inner">'+
				del+
				'<img src="'+photo+'" style="width:40px;height:40px;border-radius:50%;box-shadow:1px 1px 2px #333;float:left;" alt="photo user" />'+
				'</br>'+
				'<p class="com">'+listComment.contenu+'</p>'+
				'</div>'+
				'</div>'+
				'</div>';

				// Prepend it
				el.insertBefore(elChild, el.firstChild);
			});
		});

		io.socket.on(popId+"del", function(data){
			$("#_commentDel"+data.idMovie).remove();
		});

		io.socket.on(popId, function(data){
			if (data.contenu) {
				var el = document.getElementById('ul'+popId),
				elChild = document.createElement('div');
				elChild.setAttribute("id", "_commentDel"+data.listComment.id);
				var photo;
				var del;
				if(data.photoUser && data.photoUser != 'N/A'){
					photo = data.photoUser;
				}
				else {
					photo = "/images/pic_default.jpg";
				}
				if(data.idUser == userId){
					del = '<div id="delete">'+
					'<input onclick="delComment(\''+data.listComment.id+'\', \''+popId+'\',\''+userId+'\')" type=image name="imagedel" value="&#xf00d;" style="font-family: FontAwesome;float:right" align="middle" >'+
					'</div></br>';
				}
				else {
					del = '</br>';
				}
				elChild.innerHTML =  '</br>'+
				'<div class="event">'+
				'<div class="content">'+
				'<div class="content-inner" >'+
				del+
				'<img src="'+photo+'" style="float: left;border-radius: 50%;box-shadow: 1px 1px 2px #333;width: 40px;height: 40px;" alt="photo user" />'+
				'</br>'+
				'<p class="com">'+data.contenu+'</p>'+
				'</div>'+
				'</div>'+
				'</div>';

				// Prepend it
				el.insertBefore(elChild, el.firstChild);
			}
		});
	}

}
function strip_tags(html)
{
	//PROCESS STRING
	console.log("coucou");
	if(arguments.length < 3) {
		html=html.replace(/<\/?(?!\!)[^>]*>/gi, '');
	} else {
		var allowed = arguments[1];
		var specified = eval("["+arguments[2]+"]" );
		if(allowed){
			var regex='</?(?!(' + specified.join('|') + '))\b[^>]*>';
			html=html.replace(new RegExp(regex, 'gi'), '');
		} else{
			var regex='</?(' + specified.join('|') + ')\b[^>]*>';
			html=html.replace(new RegExp(regex, 'gi'), '');
		}
	}
	//CHANGE NAME TO CLEAN JUST BECAUSE
	var clean_string = html;
	//RETURN THE CLEAN STRING
	return clean_string;
}

function  saveComment(popId) {
	if(document.getElementById('textarea'+popId).value)
	{
		var comment = document.getElementById('textarea'+popId).value;
		document.getElementById('textarea'+popId).value = "";
		comment = strip_tags(comment);
		io.socket.post('/movie/comment', { contenu_comment: comment, titleMovie: popId }, function (resData, jwres) {
		});
	}

}

function  delComment(idMovie, popId, userId) {
	if(confirm('Are you sure you want to delete?')){
		io.socket.post('/movie/del', { idMovie: idMovie, titleMovie: popId, userId: userId}, function (resData, jwres) {
		});
	}

}
