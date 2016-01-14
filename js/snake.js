$(document).ready(function(){
  //Canvas stuff
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext("2d");
  var width = $("#canvas").width();
  var height = $("#canvas").height();


  //Lets save the cell width in a variable for easy control
  var cellWidth = 10;
  var defaultSnakeLength;
  var defaultSankeSpeed;
  var rateOfSpeedIncrement = 6;
  var direction;
  var food;
  var score;
  var level;
  var highScore = 0;
  var bitesToLevelUp = 2;
  var snakeOutlineColor = "white";
  var backgorundColor = "white";
  var foregroundColor = "green";
  var trulyRandom = false;
  var colors = ["#000000", "#6699CC", "#003366", "#C0C0C0", "#000044", "#FFFFFF"]
  
  //Lets create the snake now
  var snake_array; //an array of cells to make up the snake
  
  function init()
  {
    defaultSnakeLength = 5;
    defaultSankeSpeed = 80;
    direction = "right"; //default direction
    create_snake(defaultSnakeLength);
    create_food(); //Now we can see the food particle
    //finally lets display the score
    
    
    score = 0;
    level = 1;
    backgorundColor = "white";
    foregroundColor = "#000044";
    
    //Lets move the snake now using a timer which will trigger the paint function
    //every 60ms
    if(typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, defaultSankeSpeed);
  }
  init();

  function nextLevel(){
    defaultSankeSpeed -= rateOfSpeedIncrement;
    level++;
    backgorundColor = getRandomColor();
    foregroundColor = getRandomColor();

    create_food(); //Now we can see the food particle
    //finally lets display the score

    clearInterval(game_loop);
    game_loop = setInterval(paint, defaultSankeSpeed);
  }


    
  function create_snake(length)
  {
    snake_array = []; //Empty array to start with
    for(var i = length-1; i>=0; i--)
    {
      //This will create a horizontal snake starting from the top left
      snake_array.push({x: i, y:0});
    }
  }
  
  //Lets create the food now
  function create_food()
  {
    food = {
      x: Math.round(Math.random()*( width - cellWidth)/cellWidth), 
      y: Math.round(Math.random()*( height - cellWidth)/cellWidth), 
    };
    //This will create a cell with x/y between 0-44
    //Because there are 45(450/10) positions accross the rows and columns
  }
  
  //Lets paint the snake now
  function paint()
  {
    //To avoid the snake trail we need to paint the BG on every frame
    //Lets paint the canvas now
    if (level == 1){
      ctx.fillStyle = "white";
    } else {
      ctx.fillStyle = backgorundColor;
    }
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, width, height);
    ctx.fillStyle = foregroundColor;
    var level_disp = level;
    ctx.font="250px Impact";
    ctx.fillText(level_disp, width/2 - 50, height/2 + 70);
    
    //The movement code for the snake to come here.
    //The logic is simple
    //Pop out the tail cell and place it infront of the head cell
    var nx = snake_array[0].x;
    var ny = snake_array[0].y;
    //These were the position of the head cell.
    //We will increment it to get the new head position
    //Lets add proper direction based movement now
    if(direction == "right"){
       nx++;
    } else if(direction == "left"){
      nx--;
    } else if(direction == "up"){
      ny--;
    } else if(direction == "down"){
      ny++;
    }
    
    //Lets add the game over clauses now
    //This will restart the game if the snake hits the wall
    //Lets add the code for body collision
    //Now if the head of the snake bumps into its body, the game will restart
    if(nx == -1 || nx == width/cellWidth || ny == -1 || ny == height/cellWidth || check_collision(nx, ny, snake_array))
    {
      //restart game
      init();
      //Lets organize the code a bit now.
      return;
    }
    
    //Lets write the code to make the snake eat the food
    //The logic is simple
    //If the new head position matches with that of the food,
    //Create a new head instead of moving the tail
    if(nx == food.x && ny == food.y)
    {
      var tail = {x: nx, y: ny};
      score++;
      if(score > highScore){
        highScore = score;
      }
      if (score >= bitesToLevelUp*level){
        nextLevel();
        return;
      }

      //Create new food
      create_food();
    }
    else
    {
      var tail = snake_array.pop(); //pops out the last cell
      tail.x = nx; tail.y = ny;
    }
    //The snake can now eat the food.
    
    snake_array.unshift(tail); //puts back the tail as the first cell
    
    for(var i = 0; i < snake_array.length; i++)
    {
      var c = snake_array[i];
      //Lets paint 10px wide cells
      paint_cell( c.x, c.y );
    }
    
    //Lets paint the food
    paint_cell( food.x, food.y );
    //Lets paint the score
    
    var level_text = "Level: " + level;
    ctx.font = "10px sans-serif";
    ctx.fillText(level_text, 5, height - 5);
    var score_text = "Score: " + score;
    ctx.fillText(score_text, 5, height - 15);
    var highScore_text = "High Score: " + highScore;
    ctx.fillText(highScore_text, 5, height - 25);
  }

  function getRandomColor() {
    var color;
    if(trulyRandom) {
      var letters = '0123456789ABCDEF'.split('');
      color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
    } else {
      color = colors[getRandomIntInclusive(0, colors.length-1)];
      if(color === "#FFFFFF" || color === "#C0C0C0") {
        snakeOutlineColor = "#000000"
      } else {
        snakeOutlineColor = "#FFFFFF"
      }
    }
      return color;
  }
  
  //Lets first create a generic function to paint cells
  function paint_cell(x, y, color)
  {
    ctx.fillStyle = foregroundColor;
    ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    ctx.strokeStyle = snakeOutlineColor;
    ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
  }
  
  function check_collision(x, y)
  {
    //This function will check if the provided x/y coordinates exist
    //in an array of cells or not
    for(var i = 0; i < snake_array.length; i++)
    {
      if(snake_array[i].x == x && snake_array[i].y == y){
         return true;
      }
    }
    return false;
  }
  
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  //Lets add the keyboard controls now
  $(document).keydown(function(e){
    var key = e.which;
    //We will add another clause to prevent reverse gear
    if(key == "37" && direction != "right"){
      direction = "left";	
    } else if(key == "38" && direction != "down"){ 
      direction = "up";
    } else if(key == "39" && direction != "left"){
       direction = "right";
    } else if(key == "40" && direction != "up"){
      direction = "down";	
    }
    //The snake is now keyboard controllable
  })
})




