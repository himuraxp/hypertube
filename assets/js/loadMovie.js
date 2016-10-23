$(document).ready( function() {
	$("#send_movie").click(function(){

		var movie2 = $('#magnet_link').val();
		alert(movie2);
		io.socket.post('/movie/download', {magnet_link: movie2},function(resData, jwres){
		});

		io.socket.on('stream', function(data){
			$("#player").html('<video width="100%" height="auto" controls>'+
			'<source src="'+data+'" type="video/mp4">'+
			' Your browser does not support the video tag.'+
			'</video><br>');
		});
		io.socket.on('loading', function(data){
			$("#player").html('Loading...<br/><div style="width:200px;"><div style="background-color:green;width:'+data+';"></div></div>');
		});
	})
});
