$(function(){
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
});