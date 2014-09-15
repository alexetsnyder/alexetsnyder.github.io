var words = ["cat", "dog", "water", "river", "time", "pencil", 
			 "center", "circle", "bottle", "ferret", "box", "rob",
			 "table", "desk", "computer", "pen", "bookbag", "book",
			 "name", "keyboard", "physics", "clock", "map", "fan",
			 "chalkboard", "chalk", "apple", "cover", "eraser",
			 "cage", "projector", "cup", "cupholder", "trashcan"]
	
var letters = "abcdefghijklmnopqrstuvwxyz";
	
var letters_right = new Array();
var letters_wrong = new Array();
					  
function contains(array, target){
		for (var i = 0; i < array.length; ++i)
		{
			if (array[i] == target)
				return true
		}
		return false;
}
	
function random_word(){
	var choice = Math.floor((Math.random() * words.length));
	return words[choice];
}

function display_word(word){
	$("#theword").empty();
	for (var i = 0; i < word.length; ++i)
	{
		if (contains(letters_right, word[i]))
			$("#theword").append(word[i], " ");
		else
			$("#theword").append("_ ");
	}
}

function is_letter(letter){
	if (contains(letters, letter))
		return true;
	else	
		return false;
}

function display_wrong(){
	$("#inc_letters").empty();
	for (var i = 0; i < letters_wrong.length; ++i)
	{
		$("#inc_letters").append(letters_wrong[i], " ");
	}
}

function similar(array1, array2){
	for (var i = 0; i < array1.length; ++i)
	{
		if (!contains(array2, array1[i]))
			return false
	}
	return true;
}

$(function(){
	var display = 1.0;
	$("#restart").hide();
	$("h3").hide();
	$("p").hide();
	var word = random_word();
	display_word(word);
	$("#guess").click(function(){
		var guess = $("#enter_letter").val();
		if (is_letter(guess))
		{
			if (contains(word, guess) && 
			    !contains(letters_right, guess))
				letters_right.push(guess);
			else if (!contains(letters_wrong, guess))
			{
				letters_wrong.push(guess);	
				display -= 0.1;
				$("img").fadeTo("fast", display);
			}
		}
		else
			alert("Invalid Text: Enter a letter");
		if (similar(word, letters_right))
		{	
			display_word(word);
			$("#winner").show();
			$("#restart").show();
		}
		else if (letters_wrong.length >= 10)
		{
			display_word(word);
			display_wrong();
			$("#loser").show();
			$("#restart").show();
		}
		else
		{
			display_word(word);
			display_wrong();
			$
			$("#enter_letter").focus();
		}
		$("#enter_letter").val("");
	});
	$("#restart").click(function(){
		location.reload();
	});
	$("#rules").click(function(){
		$("p").toggle();
	});
});			 