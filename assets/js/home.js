$(document).ready( function() {
	$('#button-home').click(goHome);
	$('#button-hp').click(goHome);
	$('#minimize-nav').click(goMini);

	function goMini(){
		$(".navbar-fixed-top").slideUp();
		$(this).remove();
		$("#message").append(
			'<li id="maximize-nav" style="display:none;"><i class="fa fa-arrow-down" aria-hidden="true"></i></li>'
		);
		$('#maximize-nav').click(goMax);
		function goMax(){
			$(".navbar-fixed-top").slideDown();
			$("#message").append(
				'<li id="minimize-nav" style="display:none;"><i class="fa fa-arrow-up" aria-hidden="true"></i></li>'
			);
			$(this).remove();
			$('#minimize-nav').click(goMini);

		}
	}



	function goHome(e){
		io.socket.off("home");
		var home = jQuery.get('/', function(data) {
			//process text file line by line
			var parse = data.split("<start>");
			parse = parse[1].split("<end>");
			var result = parse[0];
			$('#central').html(result);
		});

		io.socket.on('home', function(data){
			$('#central').append(home);
		})
	}
})
