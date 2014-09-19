function factory(an_element, id, attr_array, attr_args){
	var some_html = "<" + an_element + ' id="' + id + '"'
					+ "></" + an_element + ">";
	$("body").append(some_html);
	var temp_id = "#" + id;
	for (var i = 0; i < attr_array.length; ++i)
	{
		$(temp_id).css(attr_array[i], attr_args[i]);
	}
}

function random_color(){
	var color = "";
	var test = $("#test");
	for (var i = 0; i < 6; ++i)
	{
		color += ["1", "2", "3", "4", "5", "6", "7",
				  "8", "9", "A", "B", "C", "D", "E", 
				  "F"][Math.floor(Math.random() * 15)];
	}
	return ("#" + color);
}

function rect(id, width, height, posX, posY, speed, color){
	this.id = id !== undefined ? id : "a_box";
	this.width = width !== undefined ? width : 100;
	this.height = height !== undefined ? height : 100;
	this.posX = posX !== undefined ? posX : 20;
	this.posY = posY !== undefined ? posY : 10;
	this.color = color !== undefined ? color : random_color();
	this.speedX = speed !== undefined ? speed : 10;
	this.speedY = this.speedX;
	this.move = function(newX, newY){
		this.posX = newX;
		this.posY = newY;
	}
	this.resize = function(new_width, new_height){
		this.width = new_width;
		this.height = new_height;
	}
	this.clear = function(){
		$("#" + this.id).remove();
	}
	this.redraw = function(){
		$("#" + this.id).css({"left" : this.posX, "top" : this.posY, 
								 "width": this.width, "height": this.height});
	}
	this.draw = function(){
		factory("div", this.id, ["width", "height", "position", "left", "top", "background-color"],
			[this.width, this.height, "absolute", this.posX, this.posY, this.color]);
	}
}
	
function random_rect(){
	var id = unique_id();
	var width = Math.ceil((Math.random() * 80) + 20);
	var height = Math.ceil((Math.random() * 80) + 20);
	var posX = Math.ceil(Math.random() * 1350);
	var posY = Math.ceil(Math.random() * 720);
	var speed = Math.ceil(Math.random() * 20);
	return (new rect(id, width, height, posX, posY, speed));
}
	
function unique_id(){
	var all_char = "1234567890qwertyiuopasdfghjklzxcvbnm";
	var id = "";
	for (var i = 0; i < 30; ++i)
	{
		id += all_char[Math.floor(Math.random() * all_char.length)];
	}
	return id;
}

function sleep(ms){
	ms += new Date().getTime();
	while (new Date().getTime() < ms);
}


	