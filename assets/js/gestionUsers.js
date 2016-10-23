$(document).ready( function() {

	$('#maj_db').click(dbMovie);
	$('#button-gestion').click(goGestion);

	function goGestion(e){
		io.socket.off("gestion");
		var listeUsers = jQuery.get('/Gestion', function(data) {
			//process text file line by line
			var parse = data.split("<start>");
			parse = parse[1].split("<end>");
			var result = parse[0];
			$('#central').html(result);
		});

		io.socket.on('gestion', function(data){
			$('#central').append(listUsers);
		})
	}

	function dbMovie(){
		io.socket.post("/movie/dbMovie");
	}
})
