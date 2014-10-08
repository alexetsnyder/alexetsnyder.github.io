function transform_to_canvas(pageX, pageY)
{
	var offset = $("#world").offset();
	var canvasX = pageX - offset.left;
	var canvasY = pageY - offset.top;
	return {
		posX: canvasX,
		posY: canvasY
	};
}

function user_color(ctx, default_color){
	if (default_color || $("#color").val() == "none")
		ctx.fillStyle="black";
	else
		ctx.fillStyle=$("#color").val();
	
}

function clear(){
	$("input[name=default]").prop("checked", true);	
	$("input[name=shape]").attr("checked", false)
	.attr("disabled", false);
	$("input[name=draw]").attr("checked", false);
	$("#startX").val(0);
	$("#startY").val(0);
	$("#endX").val(0);
	$("#endY").val(0);
	$("#color").attr("disabled", true)
	.prop("selectedIndex", 0);
	$("#width").val(0);
	$("#height").val(0);
	$("#radius").val(0);
}

$(function(){
	var canvas = document.getElementById("world");
	var ctx = canvas.getContext('2d');
	var default_color = true;
	var shape_option = true;
	var begin_line = false;
	$("#world").click(function(event){
		if (shape_option)
		{
			var shape = $("input[name=shape]:checked").val();
			if (shape == "rect")
			{
				var width = $("#width").val();
				var height = $("#height").val();
				var position = transform_to_canvas(event.pageX, event.pageY);
				var posX = position.posX - (width / 2);
				var posY = position.posY - (height / 2);
				user_color(ctx, default_color);
				ctx.fillRect(posX, posY, width, height);
			}
			else if (shape == "circle")
			{
				var radius = $("#radius").val();
				var position = transform_to_canvas(event.pageX, event.pageY);
				var posX = position.posX;
				var posY = position.posY;
				user_color(ctx, default_color);
				ctx.beginPath();
				ctx.arc(posX, posY, radius, 0, 2*Math.PI, false);
				ctx.fill();
			}
			else if (shape == "triangle")
			{
				var width = parseInt($("#width").val());
				var height = parseInt($("#height").val());
				var position = transform_to_canvas(event.pageX, event.pageY);
				var posX = position.posX + (width / 2);
				var posY = position.posY + (height / 2);
				user_color(ctx, default_color);
				ctx.beginPath();
				ctx.moveTo(posX, posY);
				ctx.lineTo(posX - width, posY);
				ctx.lineTo(posX - width/2, posY - height);
				ctx.fill();
			}
		}
		else
		{
			begin_line = !begin_line;
			var transpos = transform_to_canvas(event.pageX, event.pageY);
			var posX = transpos.posX;
			var posY = transpos.posY;	
			user_color(ctx, default_color);
			if (begin_line)
			{
				ctx.beginPath();
				$("#endX").val(0);
				$("#endY").val(0);
				ctx.moveTo(posX, posY);
				$("#startX").val(posX);
				$("#startY").val(posY);
			}
			else
			{
				$("#endX").val(posX);
				$("#endY").val(posY);
				ctx.lineTo(posX, posY);
				if (default_color || $("#color").val() == "none")
					ctx.strokeStyle="black";
				else
					ctx.strokeStyle=$("#color").val();
				ctx.stroke();
			}
		}
	});
	$("input[name=default]").click(function(){
		default_color = !default_color;
		if (default_color)
			$("#color").attr("disabled", true);
		else
			$("#color").attr("disabled", false);
	});	
	$("input[name=draw]").click(function(){
		shape_option = !shape_option;
		if (shape_option)
			$("input[name=shape]").attr("disabled", false);
		else
			$("input[name=shape]").attr("disabled", true);
	});
	$("input[name=shape]").click(function(){
		var shape = $(this).val();
		if (shape == "rect" || shape == "triangle")
		{
			$("#width").val(20);
			$("#height").val(20);
		}
		else if (shape == "circle")
		{
			$("#radius").val(10);
		}
	});
	$("#reset").click(function(){
		default_color = true;
		shape_option = true;
		begin_line = false;
		clear();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	});
});