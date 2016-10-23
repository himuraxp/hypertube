
$("#pagination").keyup(function(event) {
	if (Number($("#pagination").val())) {
		initial_page = $("#pagination").val()
		if (event.which) {
			new_val = Number(initial_page)
			$("#pagination").val(new_val)
			$("#GO").trigger("click")
		}
	}
})

$("#next").click(function() {
	if (Number($("#pagination").val())) {
		initial_page = $("#pagination").val()
		new_val = Number(initial_page) + 0.5
		$("#pagination").val(new_val)
	}
})

$("#last").click(function() {
	if (Number($("#pagination").val())) {
		initial_page = $("#pagination").val()
		if (Number(initial_page) > 1) {
			var new_val = Number(initial_page) - 0.5
			$("#pagination").val(new_val)
		}
	}
})
