$(function(){

	start_game();
	
	$("td").click(function(){
		
		//if empty td is clicked.
		if (this.id == "")
			return;
			
		$("#"+this.id).hide();
		
		if (is_in_word(this.id))
		{
			display_word();
			if (is_game_over())
				win();
		}
		else
		{
			wrong_guess();
			if (is_game_over())
				lose();
		}
		
	});
	
	$("#reset").click(function(){
		start_game();
	});
	
});