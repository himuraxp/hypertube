$(document).ready( function() {
	$('#button-user').click(goUsers);

	function goUsers(e){
		io.socket.off("users");
		var listeUsers = jQuery.get('/Users', function(data) {
			//process text file line by line
			var parse = data.split("<start>");
			parse = parse[1].split("<end>");
			var result = parse[0];
			$('#central').html(result);
		});

		io.socket.on('users', function(data){
			$('#central').append(listUsers);
		})
	}
})
