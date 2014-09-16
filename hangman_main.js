$(function(){
	$("#table").hide();
	$("p").hide();
	start_game();
	$("td").click(function(){
		$("#"+this.id).hide();
		if (is_in_word(this.id))
		{
			display_word();
			if (is_game_over())
			{
				$("#winner").show();
				$("td").hide();
				$("#name").show();
				$("#sub_name").show();
				$("#rules").hide();
			}
		}
		else
		{
			wrong_guess();
			if (is_game_over())
			{
				show_word();
				$("#loser").show();
				$("td").hide();
			}
		}	
	});
	$("#reset").click(function(){
		start_game();
	});
	$("#name").click(function(){
		var name = $("#sub_name").val();
		$("#table").show();
		$("#win_table").append("<br>", name);
		$("#sub_name").val("");
	});
	$("#rules").click(function(){
		$("p").toggle();
	});
});