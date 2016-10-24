
function  xD(popId) {
	var addPopup = $("#typ1").val();
	if(!(document.getElementById("pop_"+popId))) {
		shortText = jQuery.trim($("#"+popId).children("input[name=title_movie]").val()+" |").substring(0, 12).split(" ").slice(0, -1).join(" ") + "...";

		$("#all_popup").append('<div class="popup ui-widget-content ui-draggable ui-draggable-handle" value="1" id="pop_'+popId+'">'+
		'<button class="reduct" name="close"  type="button">X</button>'+
		'<button class="reduct"  name="reduct" type="button" style="letter-spacing:-2px!important">---</button>'+
		'<h2 style="text-align:center;">'+$("#"+popId).children("input[name=title_movie]").val()+
		'</h2><div class="player">'+
		'<div class="percentDl"><i style="font-size:80%;">Loading</i></div>'+
		'<img src="/images/loading.gif" style="width:100px;" />'+
		'	</div>'+
		'</div>');

		$("#popbot").append('<div onclick="openPopup(\'pop_'+popId+'\')" class="littleBar" value="1" id="little_pop_'+popId+'">'+
		'<div style="float:right;" class="percentDl2"><i style="font-size:80%;">Loading</i></div>'+
		shortText+
		'</div>');

		$("pop_"+popId).fadeIn();
		$.getScript( "/js/actionPopup.js", function( data, textStatus, jqxhr ) {
			$("#loadactionopup").remove();
			var kebab = "</scr";
			var kebab2 = "ipt>";
			$("head").append('<script id="loadactionopup">'+data+kebab+kebab2);
		});

		var movie2 = $("#"+popId).children("input[name=magnet_link]").val();
		var title_movie = $("#"+popId).children("input[name=title_movie]").val();
		var loadPop = popId+Date.now();
		io.socket.post('/movie/download', {magnet_link: movie2, eventpop: popId, loadpop: loadPop, title_movie: title_movie},function(resData, jwres){
		});
		io.socket.on('stream_'+popId, function(data){
			var valvtt = "";
			if (data[0] != "path")
			valvtt = '<track label="English" kind="subtitles" srclang="en" src="'+data[0]+'" default>';
			$("#little_pop_"+popId).children(".percentDl2").html('<i style="font-size:80%;color:green;">Ready</i>');
			$("#pop_"+popId).children(".player").html('<video style="margin:auto;" width="100%" height="auto" controls>'+
			'<source src="'+data[1]+'" type="video/mp4">'+
			valvtt+
			' Your browser does not support the video tag.'+
			'</video><br>');
		});
		io.socket.on("load_"+loadPop, function(data){
			$("#pop_"+popId).children(".player").children(".percentDl").html('<b style="color:#ccc;">'+data+'%</b></div></div>');
			$("#little_pop_"+popId).children(".percentDl2").html(' [<span style="color:#00BFFF;"> '+data+'% </span>]');
		});
	}
	else {

		popObj =  document.getElementById("pop_"+popId);
		popObj.style.display = "block";

	}
}
