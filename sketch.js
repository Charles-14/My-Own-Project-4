var PLAY = 1;
var END = 0;
var gameState = PLAY;
var backG,Zombie,Zombie_running,Zombie_attack,ZombieAttacked,Obstacle1,obstaclesGroup;
var ground,invisible_ground,Distance,goldCoins,Golds,GoldGroup,Gold;
var Pirate, PirateImg,PirateDead;
var JumpSound,dieSound,checkpointSound;
var RestartIcon,GameOverImg,gameOver,restart;

function preload(){
  backG = loadImage("Images/Background.png");
  Zombie_running = loadAnimation("Images/walk (1).png","Images/walk (2).png","Images/walk (3).png","Images/walk (4).png","Images/walk (5).png","Images/walk (6).png","Images/walk (7).png","Images/walk (8).png","Images/walk (9).png","Images/walk (10).png");
  Zombie_attack = loadAnimation("Images/Attack (2).png","Images/Attack (3).png","Images/Attack (4).png","Images/Attack (5).png","Images/Attack1.png");
  Obstacle1 = loadImage("Images/obstacle1.png");
  goldCoins = loadImage("Images/gold coins.png");
  PirateImg = loadAnimation("Pirate1.png","Pirate2.png","Pirate3.png","Pirate5.png","Pirate6.png","Pirate7.png");
  PirateDead = loadImage("PirateDead.png");
  JumpSound = loadSound("Sounds/jump.mp3");
  dieSound = loadSound("Sounds/DieSound.wav");
  checkpointSound = loadSound("Sounds/checkPoint.mp3");
  RestartIcon = loadImage("Images/restart1.png");
  GameOverImg = loadImage("Images/gameOver1.png");
  ZombieAttacked = loadImage("Zombie.png");
  
}

function setup(){
  createCanvas(1200,700);
  ground=createSprite(0,0,0,0);
  ground.shapeColor = "white";
  ground.addImage("ground_image",backG);
  ground.scale = 1.8;
  ground.velocityX=-5;

  Pirate=createSprite(530,420,600,10);
  Pirate.addAnimation("pirate_running",PirateImg);
  Pirate.addImage("pirate_collided",PirateDead);
  Pirate.scale=2;
  Pirate.debug=false;
  Pirate.setCollider("rectangle",0,0,Pirate.width,Pirate.height)

  Zombie=createSprite(110,490,600,10);
  Zombie.addAnimation("zombie_running",Zombie_running);
  Zombie.addAnimation("zombie_Attack",Zombie_attack);
  Zombie.addImage("zombie",ZombieAttacked);
  Zombie.scale=0.4;
  Zombie.debug=false;
  Zombie.setCollider("rectangle",0,0,Zombie.width,Zombie.height);

  invisible_ground=createSprite(600,608,1200,10);
  invisible_ground.visible=false;

  gameOver = createSprite(600,210);
  gameOver.addImage(GameOverImg);
  gameOver.scale = 1.4
  
  restart = createSprite(600,300);
  restart.addImage(RestartIcon);

  obstaclesGroup=new Group();
  GoldGroup=new Group();

  Distance=0;
  Golds=0;
}

function draw(){
  background("black");

  Zombie.velocityY = Zombie.velocityY + 0.8;
  Zombie.collide(invisible_ground); 

  Pirate.velocityY = Pirate.velocityY + 0.9;
  Pirate.collide(invisible_ground);

  if (gameState===PLAY){
    gameOver.visible=false;
    restart.visible=false;
    ground.velocityX=-5;

    Distance = Distance + Math.round(getFrameRate()/60);
     
   if(GoldGroup.isTouching(Pirate)){
     Golds = Golds + 1;
     GoldGroup.destroyEach();
   }

  if (ground.x < 0){
    ground.x = ground.width/2;
  }

  if (obstaclesGroup.isTouching(Zombie)){
    Zombie.velocityY=-16;
  }

  spawnObstacles();
  spawnGoldCoins();

  if(Distance > 0 && Distance % 100 === 0){
    checkpointSound.play();
 }
  
  if((keyDown("space")&& Pirate.y >= 250)) {
    Pirate.velocityY = -20;
    JumpSound.play();
   } 

   if (Pirate.isTouching(obstaclesGroup)){
      gameState=END;
      dieSound.play();
  }
}
  
else if ( gameState===END) {
   gameOver.visible=true;
   restart.visible=true;
   ground.velocityX = 0;
   Pirate.velocityY = 0
   Zombie.changeImage("zombie",ZombieAttacked);
   Pirate.y =590;
  
   Zombie.x=Pirate.x;

  if (Zombie.isTouching(Pirate)) {
    Pirate.changeImage("pirate_collided",PirateDead);
     
  }

   //set lifetime of the game objects so that they are never destroyed
   obstaclesGroup.setLifetimeEach(-1);
   obstaclesGroup.setVelocityXEach(0);

   GoldGroup.setLifetimeEach(-1);
   GoldGroup.setVelocityXEach(0);
   GoldGroup.destroyEach();

   if(mousePressedOver(restart)) {
    reset();
  }
}


  drawSprites();

  fill("lightpink");
  textSize(25);
  text("Distance: "+ Distance, 1000,50);

   fill("lightpink");
   textSize(25);
   text("Gold: "+ Golds, 1000,90);
  
}
  
function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  Pirate.changeAnimation("pirate_running",PirateImg);
  Zombie.changeAnimation("zombie_running",Zombie_running);
  obstaclesGroup.destroyEach();
  Distance=0;
  Golds=0;
  Zombie.x=110;
}


function spawnObstacles(){
  if (frameCount % 180 === 0){
      var obstacle = createSprite(1250,570,10,40);
      obstacle.velocityX = -5 ;
    
     //to generate random obstacles
     Math.round(random(1,6));
     obstacle.addImage(Obstacle1);
     obstacle.scale=0.2;
     obstaclesGroup.add(obstacle);
     obstacle.debug=false;
     obstacle.setCollider("circle",0,0,1);
  }
} 

function spawnGoldCoins(){
  if (frameCount % 150 === 0){
      var Gold = createSprite(1250,370,10,10);
      Gold.velocityX = -6;
      Math.round(random(1,6));
      Gold.addImage(goldCoins);
      Gold.scale = 0.12;
      GoldGroup.add(Gold);
      Gold.debug = false;
      Gold.setCollider("circle",40,1);
  }
}