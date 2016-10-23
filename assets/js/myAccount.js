$(document).ready( function() {
	$('#button-myAc').click(goMe);

	function goMe(e){
		io.socket.off("me");
		var listeUsers = jQuery.get('/Users/me', function(data) {
			//process text file line by line
			var parse = data.split("<start>");
			parse = parse[1].split("<end>");
			var result = parse[0];
			$('#central').html(result);
		});

		io.socket.on('me', function(data){
			$('#central').append(listUsers);
		})
	}
})
