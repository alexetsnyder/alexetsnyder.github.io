//dice_roller.js

var keys = {ENTER: 13};

//Return random int between [min, max].
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Dice(d, incr) {
	this.d = d;

	this.incr = (incr === undefined) ? 1 : incr;

	this.incr_roll = function() {
		var roll = getRandomInt(1, this.d);
		for (var i = this.incr; i <= this.d; i+=this.incr) {
			if (roll <= i) {
				return i;
			}
		}
	}

	this.roll = function() {
		if (this.incr === 1) {
			return getRandomInt(1, this.d);
		}
		return this.incr_roll();
	}
}

var dice = {
	d100: new Dice(100, 10),
	d20: new Dice(20),
	d12: new Dice(12),
	d10: new Dice(10),
	d8: new Dice(8),
	d6: new Dice(6),
	d4: new Dice(4)
};

function main() {
	var $dice = $('input[name="dice"]');
	var regExp = /[1-9]?[0-9]*d[1-9][0-9]*/g;

	$dice.on('keyup', function(event) {
		switch (event.which) {
			case keys.ENTER:
				var input = $dice.val();
				$dice.val("");
				execute(regExp, input);
				break;
			default:
				//console.log('key = ' + event.which);
		}
	});
}

function execute(regExp, input) {
	console.log('input = ' + input);
	var rollArray = input.match(regExp);
	console.log('output = ' + rollArray);

	var sum = 0;

	if (rollArray != null) {
		for(var i = 0; i < rollArray.length; ++i) {
			var roll = rollArray[i];
			var die = roll.match(/d[0-9]+/).toString();
			var times = roll.match(/[0-9]*d/).toString().slice(0,-1);

			console.log('die = ' + die);
			console.log('times = ' + times);

			try {
				if (times === '') {
					end = 1;
				}
				else {
					var end = parseInt(times);
				}
				
				for (var j = 0; j < end; ++j) {
					var cRoll = dice[die].roll();
					$('<p>').text(die + ') ' + cRoll).appendTo('body')
							.addClass(die);
					sum += cRoll;
				}
			}
			catch (e) {
				if (e instanceof TypeError) {
					console.log('No die exists with that value.');
				}
				else {
					console.log(e);
				}
			}

			$('<br>').appendTo('body');
		}
	}
	if (sum != 0) {
		$('<h3>').text('Total Sum = ' + sum).appendTo('body');
		$('<br>').appendTo('body');
	}
}

$(document).ready(main);