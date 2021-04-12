var PLAY = 1;
var END = 0;
var gameState = PLAY;
var sonic, sonic_running, sonic_collided;
var ground, invisibleGround, groundImage;
var spike
var score=0;
var gameOver, restart;

localStorage["HighestScore"] = 0;
 
function preload(){
  sonic_running =   loadImage("SonicRun.png");
  sonic_collided = loadImage("SonicStop.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  spike = loadImage("Spikes.png")
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  sonic = createSprite(50,180,20,50);
  
  sonic.addAnimation("running", sonic_running);
  sonic.addAnimation("collided", sonic_collided);
  sonic.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  
  score = 0;
}

function draw() {
  //sonic.debug = true;
  background("lightblue");
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && sonic.y >= 159) {
      sonic.velocityY = -12;
    }
  
    sonic.velocityY = sonic.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    sonic.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(spike.isTouching(sonic)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    sonic.velocityY = 0;
    cloudsGroup.setVelocityXEach(0);
    
    //change the sonic animation
    sonic.changeAnimation("collided",sonic_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = sonic.depth;
    sonic.depth = sonic.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var spike = createSprite(600,165,10,40);
    //obstacle.debug = true;
    spike.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    spike.scale = 0.5;
    spike.lifetime = 300;
    //add each obstacle to the group
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  spike.destroy();
  cloudsGroup.destroyEach();
  
  sonic.changeAnimation("running",sonic_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}