$(document).ready( function() {
	if ($('#Pop').val() == "ok")
	myProcedure();

	function getXMLHttpRequest() {
		if (window.XMLHttpRequest || window.ActiveXObject) {
			if (window.ActiveXObject) {
				try {
					xhr = new ActiveXObject("Msxml2.XMLHTTP");
				} catch(e) {
					xhr = new ActiveXObject("Microsoft.XMLHTTP");
				}
			} else {
				xhr = new XMLHttpRequest();
			}
		} else {
			alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
			return null;
		}

		return xhr;
	}

	function myProcedure(){
		$('.central').empty();
		$('.central').append(
			'<div class="container" style="width: 100%;margin: 0;padding: 0;text-align: center;">'+
			'<div id="more">'+
			'<div id="target" class="list-inline-pop" style="width: 100%;padding-top:110px;">'+
			'</div>'+
			'</div>'
		);
		var xhr = null;
		var filter;

		function request(){
			if (xhr && xhr.readyState != 0){
				xhr.abort();
			}
			xhr = getXMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
					var data = jQuery.parseJSON(xhr.responseText);
					dataMovie(data);
				}
			};
			xhr.open("POST", "/movie/populate", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send();
		}

		function dataMovie(movie){
			var i = 0;
			var listId = [];
			$.getScript( "/js/popup.js", function( data, textStatus, jqxhr ) {
				$("#loadpopup").remove();
				$("head").append("<script id='loadpopup'>"+data+"</script>");
			});
			for (let i = 0; i < movie[0].length; i++) {
				listId[i] = movie[0][i].id;

				$(".list-inline-pop").append(
					'<img id="img_'+movie[0][i].id+'" class="img-movie hvr-grow" src="'+((movie[0][i].poster && movie[0][i].poster != 'N/A') ? movie[0][i].poster : '/images/movie_not_found.jpg')+'" alt="'+movie[0][i].title+'"/>'
				)
				for (let j = 0; j < movie[2].length; j++) {
					if (movie[2][j].id_movie == movie[0][i].id){
						$("#img_"+movie[0][i].id+"").css("border-bottom", "5px solid red");
						$("#img_"+movie[0][i].id+"").css("opacity", "0.4");
						$("#img_"+movie[0][i].id+"").mouseenter(function(){
							$("#img_"+movie[0][i].id+"").css("opacity", "1");
						})
						$("#img_"+movie[0][i].id+"").mouseout(function(){
							$("#img_"+movie[0][i].id+"").css("opacity", "0.4");
						})
					}
				}
				$("#img_"+movie[0][i].id).click(function (){
					$('.block-search').remove();
					$('#more').append(
						'<div class="block-search block-'+movie[0][i].id+'">'+
						'<input id="close-search'+movie[0][i].id+'" class="close-search button-size" type="submit" value="&#xf057;">'+
						'<img class="img-movie" src="'+((movie[0][i].poster && movie[0][i].poster != 'N/A') ? movie[0][i].poster : '/images/movie_not_found.jpg')+'" alt="'+movie[0][i].title+'"/>'+
						'<div class="block-info" id="'+movie[0][i].id+'">'+
						'<div class="block-info-text">'+
						'<h2 class="title-movie">'+movie[0][i].title+'</h2>'+
						'<p class="content-movie"> Note IMDB : '+(!movie[0][i].note ? 'N/A' : movie[0][i].note)+'</p>'+
						'<p class="content-movie">Year : '+movie[0][i].year+'</p>'+
						'<p class="content-movie">Quality : '+movie[0][i].resolution.replace(/all,/, "")+'</p>'+
						'</div>'+
						'<input type="hidden" name="magnet_link" value="'+movie[0][i].magnet+'">'+
						'<input type="hidden" name="title_movie" value="'+movie[0][i].title+'">'+
						'<input id="play-'+movie[0][i].id+'" class="button-size button-inline go-play send_movie" type="submit" name="play" onclick="xD(\''+movie[0][i].id+'\')" value="&#xf16a;">'+
						"<div id='_comment"+movie[0][i].id+"'>"+
						"</div>"+
						'<input id="active-com'+movie[0][i].id+'" type="submit" class="button-size button-inline" name="Spectator_button" class="Spectator" onclick="comment(\'_comment'+movie[0][i].id+'\',\''+movie[1]+'\')" value="&#xf0e6;">'+
						'</div></div>'
					)
					$("#close-search"+movie[0][i].id).click(function (){
						$(this).remove();
						$(".block-"+movie[0][i].id).remove();
					})
					$("#play-"+movie[0][i].id).click(function (){
						$(this).remove();
						$(".block-"+movie[0][i].id).remove();
					})
					$("#active-com"+movie[0][i].id).click(function (){
						$(this).remove();
						$("#play-"+movie[0][i].id).css("position", "fixed")
						$("#play-"+movie[0][i].id).css("margin-top", "120px")
						$("#play-"+movie[0][i].id).css("font-size", "5em")
					})
				})
			}
		}
		request(dataMovie);
	}
});
