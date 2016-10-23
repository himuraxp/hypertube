$(document).ready( function() {
	$('#button-login').click(goLogin);

	function goLogin(e){
		io.socket.off("login");
		var listeUsers = jQuery.get('/login', function(data) {
			//process text file line by line
			var parse = data.split("<start>");
			parse = parse[1].split("<end>");
			var result = parse[0];
			$('#central').html(result);
		});

		io.socket.on('login', function(data){
			$('#central').append(listUsers);
		})
	}
})
