$(function(){
	start_game();
	$("td").click(function(){
		if (this.id == "")
			return;
		$("#"+this.id).hide();
		if (is_in_word(this.id))
		{
			display_word();
			if (is_game_over())
			{
				$("#winner").show();
				$("#ether").hide();
				$("td").hide();
				$("#reset").show();
			}
		}
		else
		{
			wrong_guess();
			if (is_game_over())
			{
				show_word();
				$("#loser").show();
				$("#ether").hide();
				$("td").hide();
				$("#reset").show();
			}
		}	
	});
	$("#reset").click(function(){
		start_game();
	});
});