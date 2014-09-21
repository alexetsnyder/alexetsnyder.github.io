var rects = new Array();

function animate_rects(width, height){
	var counter = 0;
	var clock = 20;
	$("#rem_time").text("Time: " + clock);
	var time = setInterval(function(){
			++counter;
			for (var i = 0; i < rects.length; ++i)
			{
				var posX = rects[i].posX;
				var posY = rects[i].posY;
				if (posX >= width || posX <= 0)
					rects[i].speedX = -rects[i].speedX;
				if (posY >= height || posY <= 0)
					rects[i].speedY = -rects[i].speedY;
			
				rects[i].move(posX + rects[i].speedX, posY + rects[i].speedY);
				rects[i].redraw();
			}
			if (counter == 20)
			{
				counter = 0;
				--clock;
				$("#rem_time").text("Time: " + clock);
				if (clock == 0)
				{
					clearInterval(time);
					$("#loser").show();
					for (var i = 0; i < rects.length; ++i)
					{
						$("#" + rects[i].id).off("click");
					}
				}
			}
		}, 50);
	return time;
}

function destroy_rect(rect){
	var index = 0;
	while (index < rects.length && rects[index].id !== rect.id)
		++index;
	if (index < rects.length)
	{
		var temp = rects[index];
		rects = rects.slice(0, index).concat(rects.slice(index + 1));
		temp.clear();
	}	
}

function win(){
	$("#winner").show();
}

$(function(){
	var WINDOW_WIDTH = $(document).width();
	var WINDOW_HEIGHT = $(document).height();
	var generate = false;
	var move_time;
	
	$("#winner").hide();
	$("#loser").hide();
	
	$("#timed").click(function(){
		$("#winner").hide();
		$("#loser").hide();
		if (!generate)
		{
			generate = true;
			for (var i = 0; i < 20; ++i)
			{
				rects.push(random_rect());
				var temp = rects.slice(-1)[0]
				temp.draw();
				$("#" + temp.id).on("click", function(){
					destroy_rect(this);
					$("#count").text("Remaining: " + rects.length);
					if (rects.length == 0)
					{
						win();
						clearInterval(move_time);
						generate = false;
					}		
				});
			}
			$("#count").text("Remaining: " + rects.length);
			animate = true;
			move_time = animate_rects(WINDOW_WIDTH, WINDOW_HEIGHT);
		}
	});
	$("#quit").click(function(){
		$("#winner").hide();
		$("#loser").hide();
		generate = false;
		clearInterval(move_time);
		$("#rem_time").text("Time: 0");
		var len = rects.length;
		for (var i = 0; i < len; ++i)
		{
			var temp = rects.pop();
			temp.clear();
		}
		$("#count").text("Remaining: 0");
	});	
});