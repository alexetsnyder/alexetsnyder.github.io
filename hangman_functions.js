var words = ["cat", "dog", "water", "river", "time", "pencil", 
			 "center", "circle", "bottle", "ferret", "box", "rob",
			 "table", "desk", "computer", "pen", "scientific", "book",
			 "name", "keyboard", "physics", "clock", "map", "fan",
			 "chalkboard", "chalk", "apple", "cover", "eraser",
			 "cage", "projector", "cup", "solid", "news",
			 "about", "after", "join", "jump", "laid", "liquid",
			 "loud", "market", "member", "mine", "sort", "southern",
			 "station", "stream", "supply", "surprise", "vowel",
			 "twelve", "airplane", "angle", "atmosphere", "baseball",
			 "climate", "chart", "dangerous", "forget", "flower",
			 "giant", "golden", "grain", "service", "sheet", "shop",
			 "silent", "smell", "smoke", "smooth", "storm", "swim",
			 "threw", "tone", "tool", "track", "trail", "understanding",
			 "upper", "view", "wagon", "western", "whatever", "whom",
			 "fixed", "affix", "dizzy", "fritz", "czars", "fuzzy", "glaze",
			 "acquire", "inquiry", "liqueur", "liquefy", "esquire", "equinox",
			 "tax", "tent", "tonight", "trick", "pan", "outline", "feature",
			 "graph", "aid", "aloud", "arrow", "basis", "author", "becoming",
			 "bicycle", "buffalo", "burn", "collect", "complex", "create", 
			 "dig", "dirt", "fallen", "gain", "lack", "lamp", "locate", "luck",
			 "mirror", "piano", "pig", "religious", "route", "silk", "spite",
			 "tower", "transportation", "underline", "waste", "worry", ]

var tries, right, word;

function random_word(){
	var choice = Math.floor(Math.random() * words.length);
	return words[choice];
}

function contains(array, letter){
	//is the letter contained within the array.
	for (var i = 0; i < array.length; ++i)
	{
		if (array[i] == letter)
			return true;
	}
	return false;
}

function contains_all(array1, array2){
	//Is every value in array2 contained within array1.
	//If array1 is empty then it returns false.
	if (array1.length == 0)
		return false;
	else
	{
		for (var i = 0; i < array2.length; ++i)
		{
			if (!contains(array1, array2[i]))
				return false;
		}
		return true;
	}
}

function hide_html(){
	$("#name").hide();
	$("#sub_name").hide();
	$("h3").hide()
	$("#reset").hide();
}

function show_html(){
	$("#rules").show();
	$("td").show();
	$("#ether").show();
}

function start_game(){
	hide_html();
	tries = 0;
	word = random_word();
	right = new Array();
	$("#theword").empty();
	$("img").attr("src", "hang0.png");
	show_html();
	display_word();
}

function hangman(){
	$("img").attr("src", ("hang" + tries + ".png"));
}	

function display_word(){
	//show only letters guessed right.
	$("#theword").empty();
	for (var i = 0; i < word.length; ++i)
	{
		if (contains(right, word[i]))
			$("#theword").append(word[i], " ");
		else
			$("#theword").append("_ ");
	}
}

function show_word(){
	//Shows complete word.
	right = word;
	display_word();
}

function is_in_word(letter){
	if (contains(word, letter))
	{
		right.push(letter);
		return true;
	}
	else
		return false;
}

function wrong_guess(){
	++tries;
	hangman();
}
		
function is_game_over(){
	if (contains_all(right, word) || tries == 6)
		return true;
	else
		return false;
}
