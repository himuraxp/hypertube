$(document).ready( function() {
	$('#searchSub').click(myProcedure);
	$('#movie').keydown(myProcedure);
	var xhr = null;
	var poster;
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

	function myProcedure(e){
		var aujd = new Date();
		var dateYearNow = aujd.getFullYear();
		var name_direction = $("#name_direction").val() ? $("#name_direction").val() : 'name_up';
		var note = $("#note").val() ? $("#note").val() : 0;
		var year_min = $("#year_min").val() ? $("#year_min").val() : 1900;
		var year_max = $("#year_max").val() ? $("#year_max").val() : dateYearNow;
		var genre_movie = $("#genre_movie").val() ? $("#genre_movie").val() : 'all';
		var quality = $("#quality").val() ? $("#quality").val() : 'all';
		if((e.type == "keydown" && e.keyCode == "13") || (e.type == "click")) {
			var movie2 = $('#movie').val();

			$('#central').empty();
			$('#central').append(
				'<div class="container" style="width: 100%;margin: 0;padding: 0;text-align: center;">'+
				'<div id="more">'+
				'<div class="list-inline">'+
				'</div>'+
				'</div>'
			);

			var filter;
			function request(){
				if (xhr && xhr.readyState != 0){
					xhr.abort();
				}
				xhr = getXMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
						if(xhr.responseText){
							var data = jQuery.parseJSON(xhr.responseText);
							dataMovie(data);
						}
					}
				};
				xhr.open("POST", "/movie/searchMovie", true);
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				xhr.send("movie="+movie2+"&name_direction="+name_direction+"&skip="+0+"&limit="+40+"&dateYearNow="+dateYearNow+"&note="+note+"&year_min="+year_min+"&year_max="+year_max+"&genre_movie="+genre_movie+"&quality="+quality+"");
			}
			var rech;
			function dataMovie(movie){
				var i = 0;
				var listId = [];
				$.getScript( "/js/popup.js", function( data, textStatus, jqxhr ) {
					$("#loadpopup").remove();
					$("head").append("<script id='loadpopup'>"+data+"</script>");
				});
				if (movie2){
					if(rech != 1){
						rech = 1;
						$(".list-inline").append(
							'<div class="nav-filter" style="display: flex; flex-direction: row;">'+
							'<div style="display: flex; flex-direction: column; margin: auto;">'+
							'<label style="font-weight: 400;">Choose direction filter </label>'+
							'<select id="name_direction">'+
							'<option value="name_up">Name up</option>'+
							'<option value="name_down">Name down</option>'+
							'</select>'+
							'</div>'+
							'<div style="display: flex; flex-direction: column; margin: auto;">'+
							'<label style="font-weight: 400;">Choose Note IMDB min </label>'+
							'<input type="range" id="note" value="0" max="9" min="0" step="1" oninput="document.getElementById(\'AfficheRange\').textContent=value" />'+
							'<span style="color: white;" id="AfficheRange">0</span>'+
							'</div>'+
							'<div style="display: flex; flex-direction: column; margin: auto;">'+
							'<label style="font-weight: 400;">Choose prodution year min and max </label>'+
							'<input type="number" id="year_min" min="1900" max="'+dateYearNow+'" placeholder="1900">'+
							'<input type="number" id="year_max" min="1900" max="'+dateYearNow+'" placeholder="'+dateYearNow+'">'+
							'</div>'+
							'<div style="display: flex; flex-direction: column; margin: auto;">'+
							'<label style="font-weight: 400;">Choose the genre </label>'+
							'<select id=genre_movie>'+
							'<option value="all">all</option>'+
							'<option value="Action">Action</option>'+
							'<option value="Comedy">Comedy</option>'+
							'<option value="Horror">Horror</option>'+
							'<option value="Fantasy">Fantasy</option>'+
							'<option value="Sci-Fi">Science Fiction</option>'+
							'<option value="Adventure">Adventure</option>'+
							'<option value="Romance">Romance</option>'+
							'<option value="Thriller">Thriller</option>'+
							'</select>'+
							'</div>'+
							'<div style="display: flex; flex-direction: column; margin: auto;">'+
							'<label style="font-weight: 400;">Choose the quality </label>'+
							'<select id=quality>'+
							'<option value="all">all</option>'+
							'<option value="1080">1080</option>'+
							'<option value="720">720</option>'+
							'</select>'+
							'</div>'+
							'<div style="display: flex; flex-direction: column; margin: auto;">'+
							'<input type="button" class="btn btn-default log-filter" id="filter" value="&#xf0b0;">'+
							'</div>'+
							'</br>')
						}

						$("#filter").click(myProcedure);
					}
					for (let i = 0; i < movie[0].length; i++) {
						listId[i] = movie[0][i].id;

						$(".list-inline").append(
							'<img id="img_'+movie[0][i].id+'" class="img-movie hvr-grow" src="'+((movie[0][i].poster && movie[0][i].poster != 'N/A') ? movie[0][i].poster : '/images/movie_not_found.jpg')+'" onerror="this.src=\'/images/movie_not_found.jpg\';" alt="'+movie[0][i].title+'"/>'
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
								'<img class="img-movie" src="'+((movie[0][i].poster && movie[0][i].poster != 'N/A') ? movie[0][i].poster : '/images/movie_not_found.jpg')+'" onerror="this.src=\'/images/movie_not_found.jpg\';" alt="'+movie[0][i].title+'"/>'+
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
				$(window).scroll(function(){
					if($(window).scrollTop() == ($(document).height() - $(window).height())){
						var div = $('.list-inline');
						var start = div.children().length;
						if (xhr && xhr.readyState != 0){
							xhr.abort();
						}
						xhr = getXMLHttpRequest();
						xhr.onreadystatechange = function() {
							if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
								if(xhr.responseText)
								{
									var data = jQuery.parseJSON(xhr.responseText);
									dataMovie(data);}
								}
							};
							xhr.open("POST", "/movie/searchMovie", true);
							xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
							xhr.send("movie="+movie2+"&name_direction="+name_direction+"&skip="+start+"&limit="+20+"&dateYearNow="+dateYearNow+"&note="+note+"&year_min="+year_min+"&year_max="+year_max+"&genre_movie="+genre_movie+"&quality="+quality+"");
						}
					});
					request(dataMovie);
				}
			}
		});
