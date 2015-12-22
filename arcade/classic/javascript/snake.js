//----------------------------------------------------------------
//-
//- Name: Alex Snyder
//-	Email: alexetsnyder@gmail.com
//-
//- Program: Snake Game
//- 
//- Description: The classic game of snake with html5. Move 
//-				 the snake around with the w s d a keys and 
//-				 grow when you get food. You lose if you hit 
//-				 yourself or the walls.
//- 
//- Based Upon: The Snake Game video by Max Wihlborg. Watched
//- 			his video and then made it myself. Went back 
//-				for only minor reference.
//-	Link: https://www.youtube.com/watch?v=uU5YPIvJ24Y
//-
//- Date: December 17, 2015
//-
//----------------------------------------------------------------
$(function() { 	//Wait for html page to load

	/**
	* Constants.
	*/
	var ROWS = 35, COLS = 35, SIZE = 20;

	/**
	* Enum Constants. 
	*/
	var keys = {W: 87, S: 83, D: 68, A: 65};
	var states = {EMPTY: 0, SNAKE: 1, FOOD: 2};
	var dirs = {UP:0, DOWN: 1, LEFT: 2, RIGHT: 3};

	/**
	* Game Variables and Objects.
	*/
	var 

	canvas, 	//HTML5 Canvas.
	ctx, 		//Canvas Rendering Context 2d.

	keystate,	//Holds keyboard inputs.
	frames,   	//number for animations.
	animate, 	//Wheter to animate or not.
	score;		//number, player score.

	/**
	* Grid that is just a 2d array datastructer.
	*
	* @type {Object}
	*/
	var grid = {
		ROWS: null,		//Number of rows.
		COLS: null, 	//Number of columns.
		_grid: null,	//The grid (2d array).

		/**
		* Initialize a rows x cols 2d grid with 
		* the value val.
		*
		* @param {any} val, value to fill with.
		* @param {number} rows, number of rows.
		* @param {number} cols, number of columns.
		*/
		init: function(val, rows, cols) {
			this.ROWS = rows;	
			this.COLS = cols;

			this._grid = [];
			for (var i = 0; i < rows; ++i) {
				this._grid.push([]);
				for (var j = 0; j < cols; ++j) {
					this._grid[i].push(val);
				}
			}
		},

		/**
		* Set the grid at row i, col j to val.
		*
		* @param {any} val, the value to set the grid to.
		* @param {number} i, row index.
		* @param {number} j, column index.
		*/
		set: function(val, i, j) {
			this._grid[i][j] = val;
		},

		/**
		* Get the value stored at row i, col j of grid.
		*
		* @param {number} i, the row index.
		* @param {number} j, the column index.
		*/
		get: function(i, j) {
			return this._grid[i][j];
		}
	};

	/**
	* The snake, is a queue data structer (FIFO) it holds
	* all current positions of the snake. The first element 
	* is the tail. The last element is the front.
	*
	* @type {Object}
	*/
	var snake = {
		direction: null,	//direction snake is moving.
		_queue: null,		//array<Object>, The queue.

		/**
		* Initialize the queue to have one value which 
		* is the position (x, y) and the direction dir.
		*
		* @param {any} dir, the direction.
		* @param {number} x, the row number.
		* @param {number} y, the column number.
		*/
		init: function(dir, x, y) {
			this._queue = [];
			this._queue.push({x:x, y:y});
			this.direction = dir;
		},

		/**
		* Return a pointer to the last element in 
		* the queue.
		*
		* @return {Object} the last element.
		*/
		front: function() {
			return this._queue[this._queue.length-1];
		},

		/**
		* Adds an element to the queue.
		*
		* @param {number} x, row number.
		* @param {number} y, column number.
		*/
		push: function(x, y) {
			this._queue.push({x:x, y:y});
		},

		/**
		* Remove the first element from the 
		* queue and return in.
		*
		* @return {Object} the first element.
		*/
		pop: function() {
			//Removes the first element form an array.
			return this._queue.shift();
		}
	};

	/**
	* Find a random empty cells on the grid and
	* place the food there. 
	*/
	function setFood() {
		var empty = [];
		//Find all empty cells on the grid.
		for (var i = 0; i < grid.ROWS; ++i) {
			for (var j = 0; j < grid.COLS; ++j) {
				if (grid.get(i, j) === states.EMPTY) {
					empty.push({i:i, j:j});
				}
			}
		}

		//Choose a random empty cell.
		var pos = empty[Math.floor(Math.random()*empty.length)];

		grid.set(states.FOOD, pos.i, pos.j);
	}

	/**
	* Sets up the game before it is started. Starts
	* the program.
	*/
	function main() {
		//Create, initialize and add canvas element to body.
		$('body').append('<canvas id="snake"></canvas>');
		canvas = $('#snake')[0];
		canvas.width = COLS*SIZE;
		canvas.height = ROWS*SIZE;
		ctx = canvas.getContext('2d');
		
		//Keep track of keyboard input.
		keystate = {};
		$(document).on('keydown', function(evt) {
			keystate[evt.which] = true;
		});
		$(document).on('keyup', function(evt) {
			delete keystate[evt.which];
		});

		//Set a callback to start the game.
		waitToPlay();
	}

	/**
	* Draws and init game, but sets a callback on 
	* the canvas that when clicked starts the game.
	* Called at the beginning and when player loses.
	*/
	function waitToPlay() {
		//Save old score if player loses
		var oldScore = score;

		//Set up game
		init();
		draw();

		//Set up start condition
		$('#snake').on('click', start);

		//Tell user how to start and show previous score
		ctx.save();
		ctx.font = "40px Arial";
		ctx.fillStyle = "#000";
		ctx.fillText("Click on Game to Start!", 5, 40);
		if (oldScore) {
			ctx.font = "20px Arial";
			ctx.fillText("Previous Score: " + oldScore, 10, 70);
		}
		ctx.restore();
	}

	/**
	* Resets and initializes game and game objects.
	*/
	function init() {
		animate = false;
		score = 0;
		frames = 0;

		grid.init(states.EMPTY, ROWS, COLS);

		//Set the snake starting position.
		var pos = {x: Math.floor(ROWS/2), y:Math.floor(COLS/2)};
		snake.init(dirs.UP, pos.x, pos.y);
		grid.set(states.SNAKE, pos.x, pos.y);

		setFood();
	}

	/**
	* Starts the game by removing the click event on 
	* the canvas, setting animate to true and calling
	* the game loop.
	*/
	function start() {
		//Removes click callback on canvas.
		$('#snake').unbind();
		animate = true;
		loop();
	}

	/**
	* The main game loop, updates the game logic
	* and then draws to the canvas. Keeps looping
	* as long as animate is true.
	*/
	function loop() {
		update();
		draw();

		if (animate) {
			//When ready call the loop function. 
			//About 60 frames a second.
			window.requestAnimationFrame(loop);
		}
		else {  //If animate is false do not animate.
			waitToPlay();
		}
	}

	/**
	* Updates the game logic.
	*/ 
	function update() {

		//Direction of snake depends on what keys are pressed.
		if (keystate[keys.W] && snake.direction != dirs.DOWN) {
			snake.direction = dirs.UP;
		}
		if (keystate[keys.S] && snake.direction != dirs.UP) {
			snake.direction = dirs.DOWN;
		}
		if (keystate[keys.D] && snake.direction != dirs.LEFT) {
			snake.direction = dirs.RIGHT;
		}
		if (keystate[keys.A] && snake.direction != dirs.RIGHT) {
			snake.direction = dirs.LEFT;
		}

		//Every 5 frames update game state.
		if (frames % 5 === 0) {
			//Get position of snake head.
			var next = snake.front();
			var nx = next.x;
			var ny = next.y;
		
			//Depending on direction change position of head.
			switch (snake.direction) {
				case dirs.UP:
					ny--;
					break;
				case dirs.LEFT:
					nx--;
					break;
				case dirs.DOWN:
					ny++;
					break;
				case dirs.RIGHT:
					nx++;
					break;
			}

			//Checks gameover conditions.
			if (nx < 0 || nx > grid.COLS-1 || ny < 0 || ny > grid.ROWS-1 ||
				grid.get(nx, ny) === states.SNAKE) {
				animate = false;
				return;
			}

			//Checks if new position is on food.
			if (grid.get(nx, ny) === states.FOOD) {
				score++;
				setFood();	
			}
			else {
				//Remove tail and remove id from grid.
				var tail = snake.pop();
				grid.set(states.EMPTY, tail.x, tail.y);
			}

			//Add new position to grid and snake.
			grid.set(states.SNAKE, nx, ny);
			snake.push(nx, ny);
		}

		frames++;
	}

	/**
	* Draw the grid to the canvas.
	*/
	function draw() {
		//Get the tile width and height.
		var tw = canvas.width / grid.COLS;
		var th = canvas.height / grid.ROWS;

		//Iterate through grid and draw all cells.
		for (var i = 0; i < grid.ROWS; ++i) {
			for (var j = 0; j < grid.COLS;  ++j) {
				//Changes fillStyle depending on the grid id 
				//of each cell.
				switch (grid.get(i, j)) {
					case states.EMPTY:
						ctx.fillStyle = '#fff'
						break;
					case states.SNAKE:
						ctx.fillStyle = '#8A2BE2'
						break;
					case states.FOOD:
						ctx.fillStyle = '#f00'
						break;
				}

				ctx.fillRect(i*tw, j*th, tw, th);
			}
		}

		//Draws the score to the canvas.
		ctx.fillStyle = '#000';
		ctx.font = "20px Arial";
		ctx.fillText('Score: ' + score, 5, COLS*SIZE - 5);
	}

	//Start the program.
	main();
});