$(function(){
	var rects = new Array();
	var time;
	var animate = false;
	var hand_generate = false;
	var max_height = $(document).height() -50;
	var max_width = $(document).width() - 50;
	$("#quit").hide();
	$("#generate").click(function(){
		for (var i = 0; i < 10; ++i)
		{
			rects.push(random_rect());
			rects.slice(-1)[0].draw();
		}

	});
	$("#clear").click(function(){
		var temp;
		var len = rects.length;
		for (var i = 0; i < len; ++i)
		{
			temp = rects.pop();
			temp.clear();
		}
	});
	$("#animate").click(function(){
		//var max_height = 720;
		//var max_width = 1350;
		if (rects.length >= 1 && !animate)
		{
			animate = true;
			time = setInterval(function(){
				for (var i = 0; i < rects.length; ++i)
				{
					if (rects[i].posX >= max_width || rects[i].posX <= 0)
						rects[i].speedX = -rects[i].speedX;
					if (rects[i].posY >= max_height || rects[i].posY <= 0)
						rects[i].speedY = -rects[i].speedY;
					rects[i].move(rects[i].posX + rects[i].speedX,
								rects[i].posY + rects[i].speedY);
					rects[i].redraw();
				}
			}, 50)
		}
	});
	$("#stop").click(function(){
		animate = false;
		clearInterval(time);
	});
	$("#touch").click(function(){
		hand_generate = !hand_generate;
		var first = true;
		if (hand_generate)
			$(document).on("click", function(){
				if (!first)
				{
					rects.push(new rect(unique_id(), 50, 50, event.pageX, event.pageY));
					rects.slice(-1)[0].draw();
				}
				else	
					first = false;
			});
		else	
			$(document).off("click");
	});
	$("#top").click(function(){
		$("td").slideToggle("slow");
	});
});
