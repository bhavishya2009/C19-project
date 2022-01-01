var gameState = "PLAY";

var fox,fox_running,sad_fox;
var bird,bird_flying;
var background, invisibleGround, backgroundImage;

var obstaclesGroup, icicle, iceberg, ice_hole;

var score;
var gameOverImg,restartImg;

function preload(){
  fox_running = loadAnimation("arctic_fox1.png","arctic_fox2.png","arctic_fox3.png","arctic_fox4.png");
  sad_fox = loadImage("sad_fox.png");
  flat_fox = loadImage("flat_fox.png");

  bird_flying = loadAnimation("bird1.png","bird2.png","bird3.png","bird4.png","bird3.png","bird2.png");
  
  backgroundImage = loadImage("arctic_background1.png");
  
  icicle = loadImage("icicle.png");
  iceberg = loadImage("iceberg.png");
  iceberg2 = loadImage("iceberg2.png");
  ice_hole = loadImage("ice_hole.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("game_over.png")
}

function setup() {
  createCanvas(600,250);
  var message = "This is a message";
  console.log(message);

  background = createSprite(320,100,10,20);
  background.addImage("ground",backgroundImage);
  background.scale = 0.8;
  //background.x = background.width /2;

  fox = createSprite(500,190,20,50);
  fox.addAnimation("running", fox_running);
  fox.addAnimation("sad", sad_fox);
  fox.addAnimation("flat", flat_fox);
  fox.scale = 0.35;

  bird = createSprite(70,50,20,20);
  bird.addAnimation("flying",bird_flying, bird_flying);
  bird.scale = 0.2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,160);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.3;
  restart.scale = 0.1;
  
  invisibleGround = createSprite(200,210,600,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  
  fox.setCollider("rectangle",-30,20,400,270);
  fox.debug = true;
  
  score = 0;
}

function draw() {
    
    //displaying score
    
    if(gameState === "PLAY"){

        gameOver.visible = false;
        restart.visible = false;
        
        //background.velocityX = -(4 + 3* score/100)
        //scoring
        score = score + Math.round(getFrameRate()/60);
        
        
        /*if (background.x < 0){
          background.x = background.width/2;
        }*/
        
        //jump when the arrow key is pressed
        if(keyDown("up")&& fox.y >= 100) {
            fox.velocityY = -12;
        }

        if(keyDown("down")) {
            fox.setAnimation("flat",flat_fox);
            fox.setCollider("rectangle",-30,20,400,130);
        }

        
        //add gravity
        fox.velocityY = fox.velocityY + 0.8;
      
        //spawn obstacles on the ground
        spawnObstacles();
        
        if(obstaclesGroup.isTouching(fox)){
            //fox.velocityY = -12;
            gameState = "END";
        }
      }
       else if (gameState === "END") {
          gameOver.visible = true;
          restart.visible = true;
         
         //change the fox animation
         //fox.changeAnimation("sad", sad_fox);
         fox.pause();
        
          if(mousePressedOver(restart)) {
            reset();
          }
         
          //background.velocityX = 0;
          fox.velocityY = 0;
          bird.velocityX = -5;
          
          if (bird.x <= -5){
            bird.destroy();
          }
         
          //set lifetime of the game objects so that they are never destroyed
          obstaclesGroup.setLifetimeEach(-1);
          obstaclesGroup.setVelocityXEach(0);    
    
       }
      
     
      //stop fox from falling down
      fox.collide(invisibleGround);
      
      drawSprites();
      text("Score: "+ score, 500,50);  
    
}

function reset(){
    gameState = "PLAY";
    gameOver.visible = false;
    restart.visible = false;
    obstaclesGroup.destroyEach();
    fox.play();
    bird = createSprite(70,50,20,20);
    bird.addAnimation("flying",bird_flying, bird_flying);
    bird.scale = 0.2;
    bird.setVelocityY = 0;
    score = 0;
  }
  
  
  function spawnObstacles(){
   if (frameCount % 60 === 0){
     var obstacle = createSprite(0,0,10,40);
     obstacle.velocityX = (6 + score/100);
     obstacle.scale = 0.3;
     
      //generate random obstacles
      var rand = Math.round(random(1,4));
      switch(rand) {
        case 1: obstacle.addImage(icicle);
                obstacle.y = 70;
                obstacle.setCollider("rectangle",-20,0,50,200);
                obstacle.scale = 0.45;
                break;
        case 2: obstacle.addImage(iceberg);
                obstacle.y = 180;
                obstacle.setCollider("rectangle",0,0,70,150);
                obstacle.scale = 0.2;
                break;
        case 3: obstacle.addImage(iceberg2);
                obstacle.y = 180;
                obstacle.setCollider("rectangle",0,0,70,150);
                obstacle.scale = 0.2;
        break;
        case 4: obstacle.addImage(ice_hole);
                obstacle.y = 200;
                obstacle.setCollider("rectangle",0,0,18,20);
                break;
        default: break;
      }
     
      //assign depth and lifetime to the obstacle           
      obstacle.lifetime = 300;
      obstacle.depth = fox.depth - 1;
      obstacle.debug = true;
     
     //add each obstacle to the group
      obstaclesGroup.add(obstacle);
   }
  }