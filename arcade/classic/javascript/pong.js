//----------------------------------------------------------------
//-
//- Name: Alex Snyder
//-	Email: alexetsnyder@gmail.com
//- 
//- Program: Pong
//-
//- Description: The classic game of pong. A player controls a
//-				 paddle with the w, s, keys or the up arrow 
//-              and down arrow keys. They want to keep the ball 
//-				 from going over on their side and make it go over
//-				 on the computer's side. 
//- 
//- Based Upon: The pong game video by Max Wihlborg. Watched
//- 			his video and then made it myself. Went back 
//-				many times for reference.
//-	Link: https://www.youtube.com/watch?v=KApAJhkkqkA
//-
//- Date: December 17, 2015
//-
//----------------------------------------------------------------
$(function() {   //Wait for html page to load.

	/**
	* Constants.
	*/
	var WIDTH = 800, HEIGHT = 600;
	var PI = Math.PI, WIN_AMOUNT = 15;

	/**
	* Enum Constants.
	*/
	var keys = {W: 87, S: 83, UPARROW: 38, DOWNARROW: 40};

	/**
	* Game Variable and Objects.
	*/
	var 

	canvas,		//HTML5 canvas element.
	ctx, 		//Canvas Rendering Context 2d.

	keystate,	//Holds keyboard inputs.
	animate;	//bool, animate canvas or not

	/**
	* Draws  and updates the player paddle 
	* and allows the user to control it with 
	* the keyboard. 
	*
	* @type {Object}
	*/
	var player = {
		x: null,		//number, the x position.
		y: null,		//number, the y position.
		speed: 9,		//number, speed of player.
		width: 20,		//number, width of paddle.
		height: 100,	//number, height of paddle.
		score: null,	//number, player score.

		/**
		* Updates the y position of the paddle depending 
		* on user input.
		*/
		update: function() {
			if (keystate[keys.W] || keystate[keys.UPARROW]) {
				//Make sure they don't go off the top of the canvas.
				if (this.y > 0) {
					this.y -= this.speed;
				}
			}
			if (keystate[keys.S] || keystate[keys.DOWNARROW]) {
				//Make sure they don't go off the bottom of the canvas.
				if (this.y < (HEIGHT - this.height)) {
					this.y += this.speed;
				}
			}
		},

		/**
		* Draws the paddle to the screen.
		*/
		draw: function() {
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};

	/**
	* Draws and updates the paddle that is controlled
	* by the computer. 
	*
	* @type {Object}
	*/
	var ai = {
		x: null,		//number, the x position. 
		y: null,		//number, the y position.
		width: 20,		//number, width of paddle.
		height: 100,	//number, height of paddle
		score: null,	//number, computer score.

		/**
		* Update the y position of the computer paddle.
		* The computer has a very basic ai that just 
		* slowly moves towards the y direction of the 
		* ball.
		*/
		update: function() {
			var des = ball.y - (this.height - ball.size)/2;
			this.y += (des - this.y) * 0.15;

			//Make sure paddle doesn't go off screen
			this.y = Math.max(0, this.y);
			this.y = Math.min(HEIGHT - ai.height, this.y);
		},

		/**
		* Draws the computer paddle to the screen.
		*/
		draw: function() {
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};

	/**
	* Draws and update the position of the ball
	* depending on the velocity. Also, includes a
	* serve function.
	*
	* @type {Object}
	*/
	var ball = {
		x: null,					//number, the x position.
		y: null,					//number, the y position.
		size: 20,					//number, the size of the ball.
		speed: 11,					//number, the speed of the ball.
		vel: {x: null, y: null},	//object, the velocity of the ball.

		/**
		* Updates the position of the ball using collision
		* detection to find out when it hits the ball and 
		* changes the position and velocity as needed.
		*/
		update: function() {
			//Apply the velocity.
			this.x += this.vel.x;
			this.y += this.vel.y;

			//Ball bounces off sides.
			if (this.y < 0 || this.y > (HEIGHT - ball.size)) {
				this.y = (this.y < 0) ? 0 : HEIGHT - ball.size; 
				this.vel.y = -1 * this.vel.y;
			}

			//Which paddle is the ball approaching.
			var paddle = (this.vel.x < 0) ? player : ai;

			//Is the ball colliding with the paddle it is moving towards.
			if (BBCollision(paddle.x, paddle.y, paddle.width, paddle.height, 
							this.x, this.y, this.size, this.size)) {
				//Center y of paddle and ball.
				var py = paddle.y + paddle.height/2;
				var by = ball.y + ball.size/2;

				//Number between -1 and 1 based on where the 
				// ball hit the paddle
				var n = (by - py) / (paddle.height/2 + ball.size/2); 

				//Multiply by PI/4 to make it into an angle.
				var phi = (0.25 * PI) * n;

				//If you hit the top you get a speed boost.
				var smash = (Math.abs(phi) > 0.2*PI) ? 1.5 : 1;

				//The new x and y velocity after hitting the paddle.
				this.vel.y = smash*this.speed * Math.sin(phi);
				this.vel.x = smash*(paddle===player ? 1 : -1) * this.speed * Math.cos(phi);
			}

			//What to do if the ball goes beyond the canvas on 
			//the right or the left side. 
			if (this.x < 0 || this.x > (WIDTH - this.size)) {
				//Increment the score.
				if (this.vel.x > 0)
					player.score++;
				else
					ai.score++;

				//Winning conditions.
				if (player.score === WIN_AMOUNT || ai.score === WIN_AMOUNT) {
					animate = false;
				}
				else {
					//If no one won, then serve the ball again.
					this.serve();
				}
			}
		},

		/**
		* Draws the ball to the screen.
		*/
		draw: function() {
			ctx.fillRect(this.x, this.y, this.size, this.size);
		},

		/**
		* Serves the ball from the paddle that got the
		* point. Chooses a random y position along the 
		* paddle and places the ball there then gives
		* it velocity so that it moves towards the 
		* oposite paddle.
		*/
		serve: function() {
			//Which paddle won the point.
			var paddle = (this.vel.x < 0) ? ai : player;

			//Random y position along the paddle and appropriat x position.
			var h = paddle.y + Math.floor(Math.random() * (paddle.height - this.size));
			this.x = (paddle === player) ? 2*player.width + ball.size : WIDTH - 3*ai.width - ball.size;
			this.y = h;

			//Set the x and y velocity to move towards the other paddle.
			this.vel.x = ((paddle === player) ? -1 : 1) * this.speed;
			this.vel.y = ((this.vel.y < 0) ? -1 : 1) * this.speed;
		}
	};

	/**
	* Test whether two rectangles are colliding. 
	*
	* @param {number} x1 - left top x position of rect 1.
	* @param {number} y1 - left top y position of rect 1.
	* @param {number} w1 - width of rectangle 1.
	* @param {number} h1 - height of rectangle 1.
	* @param {number} x2 - left top x position of rect 2.
	* @param {number} y2 - left top y position of rect 2.
	* @param {number} w2 - width of rectangle 2.
	* @param {number} h2 - height of rectangle 2.
	*
	* @return {boolean} true if colliding, false otherwise.
	*/
	function BBCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
		x1 = x1 + w1/2;
		x2 = x2 + w2/2;
		y1 = y1 + h1/2;
		y2 = y2 + h2/2;
		return (Math.abs(x2 - x1) < w1/2 + w2/2 && Math.abs(y2 - y1) < h1/2 + h2/2);
	};

	/**
	* Sets up the game before it is started. Starts
	* the program.
	*/
	function main() {
		//Create, initialize and add canvas element to body.
		$('body').append('<canvas id="pong"></canvas>');
		canvas = $('#pong')[0];
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		ctx = canvas.getContext('2d');	

		//Keep track of keyboard input.
		keystate = {};
		$(document).on('keydown', function(e) {
			keystate[e.which] = true;
		});
		$(document).on('keyup', function(e) {
			delete keystate[e.which];
		});

		//Set a callback to start the game.
		waitToPlay();
	};

	/**
	* Draws and init game, but sets a callback on 
	* the canvas that when clicked starts the game.
	* Called at the beginning and when player or 
	* computer wins. Also, displays who won. 
	*/
	function waitToPlay() {
		//Keep old scores if it is not the first game.
		var playerScore = player.score;
		var aiScore = ai.score;

		//Initialize all objects and draw to screen.
		init();
		draw();

		//Add click listener to start game.
		$('#pong').on('click', start);

		//Tell the user how to start the game, 
		//and if not the first game displays 
		//the last scores.
		ctx.save();
		ctx.font = "40px Arial";
		ctx.fillStyle = '#fff';
		ctx.fillText("Click To Start!", WIDTH/2 - 130, 40);
		if (playerScore || aiScore) {
			var win;
			if (aiScore > playerScore) {
				win = 'The Computer Wins!';
			}
			else {
				win = 'The Player Wins!';
			}

			//Display old scores.
			var fsize =  30;
			ctx.font = fsize + 'px Arial';
			ctx.fillText(playerScore, fsize/2, HEIGHT - fsize/2 - 30);
			ctx.fillText(aiScore, WIDTH - 1.2*fsize, HEIGHT - fsize/2 - 30);
			ctx.fillText(win, WIDTH/2 - 130, HEIGHT/2 - 2*ball.size);
		}
		ctx.restore();
	};

	/**
	* Resets and initializes game and game objects.
	*/
	function init() {
		animate = false;
		player.score = 0;
		ai.score = 0;

		//Set player position.
		player.x = player.width;
		player.y = (HEIGHT - player.height) / 2;

		//Set computer position.
		ai.x = WIDTH - (2*ai.width);
		ai.y = (HEIGHT - ai.height) / 2;

		//Set ball position and velocity.
		ball.x = (WIDTH - ball.size) / 2;
		ball.y = (HEIGHT - ball.size) / 2;
		ball.vel.x = ball.speed;
		ball.vel.y = 0;
	};

	/**
	* Starts the game by removing the click event on 
	* the canvas, setting animate to true and calling
	* the game loop.
	*/
	function start() {
		//Removes click callback on canvas.
		$('#pong').unbind();
		animate = true;
		loop();
	};

	/**
	* The main game loop, updates the game logic
	* and then draws to the canvas. Keeps looping
	* as long as animate is true.
	*/
	function loop() {
		update();
		draw();

		if (animate) {
			//When ready call loop function.
			//About 60 frames a second.
			window.requestAnimationFrame(loop);
		}
		else {
			//If animate is false wait for player click.
			waitToPlay();
		}
	};

	/**
	* Updates the game logic.
	*/ 
	function update() {
		player.update();
		ai.update();
		ball.update();
	};

	/**
	* Draws the player paddle, the ai paddle and
	* the ball. Also, draws the net and the 
	* player and ai scores. 
	*/
	function draw() {
		//Clear the canvas
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		//Save the context before changing.
		ctx.save();
		ctx.fillStyle = '#fff';

		player.draw();
		ai.draw();
		ball.draw();

		//Draw the net in the center.
		var w = (WIDTH - 5) / 2;
		for (var h = 0; h < HEIGHT; h+= 25) {
			ctx.fillRect(w, h, 5, 20);	

		}

		//Draw the player scores.
		var fsize =  30;
		ctx.font = fsize + 'px Arial';
		ctx.fillText(player.score, fsize/2, HEIGHT - fsize/2);
		ctx.fillText(ai.score, WIDTH - 1.2*fsize, HEIGHT - fsize/2);

		ctx.restore();
	};

	//Starts the program.
	main();
});