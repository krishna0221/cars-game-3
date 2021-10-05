class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leadeboardTitle=createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;

  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }

update(state){
  database.ref("/").update({
    gameState:state
  })

}

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();

   car1=createSprite(width/2-200,height-100)
   car1.addImage(car1_img);
   car1.scale=0.1;
   
   car2=createSprite(width/2+150,height-100);
   car2.addImage(car2_img);
   car2.scale=0.1;
   
   cars = [car1,car2];

  obstacles = new Group();
  fuels = new Group();
  coins = new Group();


  var obstaclesPositions = [
    { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
    { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
    { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
    { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
    { x: width / 2, y: height - 2800, image: obstacle2Image },
    { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
    { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
    { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
    { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
    { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
    { x: width / 2, y: height - 5300, image: obstacle1Image },
    { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
  ];

  this.addSprites(fuels,5,fuelImg,0.03);
  this.addSprites(coins,15,coinImg,0.08);
  this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions)
  
  }

handleElements(){
  form.hide();
  form.titleImg.position(40,50);
  form.titleImg.class("gameTitleAfterEffect");

  this.resetTitle.html("Reset Game");
  this.resetTitle.class("resetText");
  this.resetTitle.position(width / 2 + 200, 40);

  this.resetButton.class("resetButton");
  this.resetButton.position(width / 2 + 230, 100);

  this.leadeboardTitle.html("Leaderboard");
  this.leadeboardTitle.class("resetText");
  this.leadeboardTitle.position(width / 3 - 60, 40);

  this.leader1.class("leadersText");
  this.leader1.position(width / 3 - 50, 80);

  this.leader2.class("leadersText");
  this.leader2.position(width / 3 - 50, 130);
}

  play(){
  this.handleElements();
  this.handleResetButton();
player.getCarsAtEnd();

  Player.getPlayersInfo();
  if(allPlayers !== undefined){
    image(track,0,-height*5,width,height*6);
    this.showLeaderBoard();
    this.showLife();
    this.showFuelBar();
    var index = 0;
    for(var plr in allPlayers){
      index =index+1;
      var x = allPlayers[plr].positionX;
      var y = height-allPlayers[plr].positionY;
      cars[index-1].position.x=x;
      cars[index-1].position.y=y;
      if(index === player.index){
        fill("red")
        ellipse(x,y,90,90)
        this.handleFuel(index);
        this.handleCoin(index);
        camera.position.x = cars[index-1].position.x;
        camera.position.y = cars[index-1].position.y;
      }
    }

    this.handlePlayerControls()
   const finishLine = height*6-90;
   if(player.positionY>finishLine){
     gameState = 2;
     player.rank+=1;
     Player.updateCarsAtEnd(player.rank);
     player.update();
     this.showRank();
     
   }
    drawSprites();
  }
  }

  handlePlayerControls(){
    if(keyIsDown(UP_ARROW)){
      player.positionY +=10;
      player.update()
      this.playerMoving=true;
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX>width/3-50){
      player.positionX -=8;
      player.update();
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionX<width/3+500){
      player.positionX +=8;
      player.update();
    }
  }

handleResetButton(){
  this.resetButton.mousePressed( ()=>{
    database.ref("/").set({
      gameState:0,
      playerCount:0,
      carsAtEnd:0,
      players:{},
      carsAtEnd:0

    });
    window.location.reload();
  })
}


  showLeaderBoard(){
    var leader1,leader2;
    var players = Object.values(allPlayers);
    if((players[0].rank === 0 && players[1].rank === 0)|| players[0].rank === 1 ){
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 = players[1].rank + 
      "&emsp;" + 
      players[1].name + 
      "&emsp;" + 
      players[1].score;

    }
    if(players[1].rank === 1){

      leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
      leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
 
  addSprites(spriteGroupName,numberOfSprites,spriteImage,scale,position=[]){
    for(var i = 0;i<numberOfSprites; i++){
    var x,y;

     
      if(position.length>0){
        x = position[i].x;
        y = position[i].y;
        spriteImage = position[i].image;
       }else{
         x= random(width/2+150,width/2-150);
         y = random(-height*4.5,height-400);
       }
       var sprite=createSprite(x,y);
       sprite.addImage(spriteImage);
       sprite.scale=scale
       spriteGroupName.add(sprite);
    }

  }
 
  handleFuel(index){
  cars[index-1].overlap(fuels,function(collector,collected){
    player.fuel=200;
    collected.remove();

  })
  if (player.fuel > 0 && this.playerMoving) {
     player.fuel -= 0.3; }
  if (player.fuel <= 0) { 
  gameState = 2; this.gameOver();
 }
  }

  handleCoin(index){
    cars[index-1].overlap(coins,function(collector,collected){
      player.score+=26;
      player.update();
      collected.remove();
    })
  }
  

  showRank() {
     swal({ 
     title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`, 
     text: "You reached the finish line successfully", 
     imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png", 
     imageSize: "100x100", 
     confirmButtonText: "Ok"
     }); 
    }
showLife(){
  push(); 
  image(lifeImage, width / 2 - 130, height - player.positionY - 100, 20, 20); 
  fill("white"); 
  rect(width / 2 - 100, height - player.positionY - 100, 185, 20); 
  fill("#f50057"); 
  rect(width / 2 - 100, height - player.positionY - 100, player.life, 20); 
  noStroke(); 
  pop(); }

  showFuelBar() { 
    push(); 
    image(fuelImg, width / 2 - 130, height - player.positionY - 50, 20, 20); 
    fill("white"); 
    rect(width / 2 - 100, height - player.positionY - 50, 185, 20); 
    fill("#ffc400"); 
    rect(width / 2 - 100, height - player.positionY - 50, player.fuel, 20); 
    noStroke(); 
    pop(); 
  }

    gameOver() { 
      swal({ title: `Game Over`, 
      text: "Oops you lost the race....!!!",
     imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png", 
     imageSize: "100x100", 
     confirmButtonText: "Thanks For Playing" 
    });
     }


  }





