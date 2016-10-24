$('button[name=reduct]').click(reductPopup);
$('button[name=close]').click(closePopup);

function MovePopup(event){
	if ($("#clickstatus").val() == "1" ) {
		var idPop = $("#idpopup").val();
		var mY = $("#mouseY").val();
		var mX = $("#mouseX").val();
		if (!document.getElementById(idPop).style.top)
		document.getElementById(idPop).style.top = "20px";
		if(!document.getElementById(idPop).style.left)
		document.getElementById(idPop).style.left = "50px";
		var objTop = parseInt(document.getElementById(idPop).style.top) - mY + event.pageY;
		var objLeft = parseInt(document.getElementById(idPop).style.left) - mX + event.pageX;
		$("#mouseY").val(event.pageY);
		$("#mouseX").val(event.pageX);
		if (objTop < 0){
			objTop = 0;
		}
		if (objLeft < 0){
			objLeft = 0;
		}
		if (objLeft > $( window ).width() - 20){
			objLeft = $( window ).width() - 20;
		}
		if (objTop > $( window ).height() - 100){
			objTop = $( window ).height() - 100;
		}
		document.getElementById(idPop).style.top = objTop+"px";
		document.getElementById(idPop).style.left = objLeft+"px";
		document.getElementById("mouseY").value = event.pageY;
		document.getElementById("mouseX").value = event.pageX;
	}
}

function rmMovePopup(event){
	$("#clickstatus").val("0");
}

function addMovePopup(event){
	$("#clickstatus").val("1");
	$("#idpopup").val($(this).attr('id'));
	document.getElementById("mouseY").value = event.pageY;
	document.getElementById("mouseX").value = event.pageX;
	document.getElementById("Zindex").value = (parseInt(document.getElementById("Zindex").value) + 1);
	document.getElementById($(this).attr('id')).style.zIndex = ""+document.getElementById("Zindex").value;
}

function closePopup(){
	$("#little_"+$(this).parent().attr('id')).remove();
	$("#"+$(this).parent().attr('id')).remove();
}

function reductPopup(){
	$("#"+$(this).parent().attr('id')).fadeOut();
}

function openPopup(id){
	if (document.getElementById(id).style.display == "none")
	document.getElementById(id).style.display = "block";
	else
	document.getElementById(id).style.display = "none";
}
