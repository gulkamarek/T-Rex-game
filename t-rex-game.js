/************ Variables  ************/ 
let speed = 4;

var screen = 0;
let jumpBeginnTime = performance.now();
var obstacles = [];
var gameBackground = [];
var timeToCreate = 0;
var timeToCreateBackgroung = 0;
var gameStartTime;

// trex images
var imgTrex1, imgTrex2, imgTrex3;
function preload() {
	imgTrex1 = loadImage(src='https://gulkamarek.github.io/T-Rex-game/dino1.png');
	imgTrex2 = loadImage(src='https://gulkamarek.github.io/T-Rex-game/dino2.png');
	imgTrex3 = loadImage(src='https://gulkamarek.github.io/T-Rex-game/dino3.png');
	imgMrex = loadImage(src='https://gulkamarek.github.io/T-Rex-game/MRex.png');
}

/************ Setup block  ************/ 
function setup(){
	createCanvas(500, 200);
}

/************ Draw block  ************/ 
function draw(){
	
	if(screen == 0){
		initScreen();
	}else if(screen == 1){
		playScreen();
	}else if(screen == 2){
		gameOverScreen();
	}else if(screen == 3){
		winScreen();
	}
	handelKey();
	
	
}

/************ key handler  ************/ 
function handelKey(){	
	if( keyIsDown(UP_ARROW) || keyIsDown(32)){
		if (screen == 0){
			screen = 1;
			trex = new Trex();
		}else if(screen == 1){
			if(trex.onGround()){
				trex.jump();
			}
		}else if (screen == 2){
			location.reload();
		}
	}
}

/************ initScreen ************/
function initScreen(){
	background(0);
	stroke(255);
	fill(255);
	textAlign(CENTER);
	textSize(30);
	text('M-Rex', width/2, height/2);
	textSize(15);
	text('Press Space or UpArrow to start', width/2, height*0.65);
	line(0,170,width, 170);
	gameStartTime = performance.now();
	gameBackgroundGenerator();
	
}
/************ playScreen ************/
function playScreen(){
	background(0);
	stroke(255);
	fill(255);
	text('Score: ' + ((performance.now()-gameStartTime)/1000).toFixed(2), 43, 20);
	line(0,170,width, 170);
	trex.show();
	trex.controlHeight();
	obstaclesGenerator();
	gameBackgroundGenerator();

}
/************ gameOverScreen ************/ 
function gameOverScreen(){
	textAlign(CENTER);
	textSize(30);
	fill(255);
	text('GAME OVER', width/2, height/2);
	textSize(15);
	text('Press jump button to reload', width/2, height*0.65);
	
}
/************ winScreen ************/ 
function winScreen(){

}

/************ TREX ************/ 
class Trex{
	constructor(){
		this.x = 50;
		this.y = 150;
		this.r = 16;
		this.initianVelYJump = 230; // choosen by trial and error method it was easier faster to create ths variable than to change the value in the loop 
		this.acceleration = 600; // choosen by trial and error method
		this.velYJump = 0;
	}
	
	jump(){
		// bacically it is just to initial the jump by setting initial jump speed and measuring the jump duration
		if(this.onGround){
			jumpBeginnTime = performance.now();
			this.velYJump = this.initianVelYJump;
		}		
	}
	
	controlHeight(){
		// controlling the height and setting position to initial when trex touches the ground 
		let t = ((performance.now()-jumpBeginnTime)/1000).toFixed(2);

		if(this.velYJump != 0){
			this.y = 150 - this.velYJump*t +.5*this.acceleration*t*t;
			if (this.y > 150){// to avoid that this.y is less than 150
				this.y = 150;
			}
			if(this.y >= 150){
				this.velYJump = 0;
			}
		} else if ((this.velYJump = 0) || (this.y > 150)){
			this.y = 150;
		}
	}
	
	
	onGround(){
		if (this.y == 150){
			return true;
		}else if (this.y != 150){
			return false;
		}
	}
	
	show(){
		// this is the ellipse for collision detection
		//ellipse(this.x,this.y,this.r*2);
		
		if(this.onGround()){
			if (ceil(performance.now()/100) % 2 == 0){
				image(imgTrex1, this.x-18, this.y-26);
			}else{
				image(imgTrex2, this.x-18, this.y-26);
			}
		}else if (!this.onGround()){
			image(imgTrex3, this.x-18, this.y-26);
		}
		//image(imgAdd, this.x+transX+20, this.y-26-20);
		image(imgMrex,this.x+2, this.y-44 );
		//rect(this.x, this.y-35, 30, 30);
	}
}

/************ obstacle ************/ 
class Obstacle{
	
	constructor(obstacleWidht, obstacleHeight){
		this.obsWidth = obstacleWidht;
		this.obsHeight = obstacleHeight;
		this.x = width + this.obsWidth;
		this.y = 170 - this.obsHeight;
		this.color = 255;
	}
	
	// the collision if for a circle
	collisionDetector(circle){
		// when the center of the circle in below the top of the obsticle
		if(this.y <= circle.y){
			if( (this.x <= (circle.x + circle.r)) && ((this.x+this.obsWidth) >= (circle.x - circle.r)) ){
				return true;
			}else{
				return false;
			}
		// when the center of the circle in abowe the top of the obsticle but not higher than a radius length
		}else if( (this.y > circle.y) && (this.y-circle.r <= circle.y)){
			// form the jumping side
			if((this.x <= (circle.x + circle.r)) && (this.x >= circle.x ) ){
				let k = (this.y-circle.y) / Math.tan(Math.asin((this.y-circle.y)/circle.r));
				if(this.x-circle.x<k){
					return true;
				}else{
					return false;
				}
			}
			// from the landing side
			else if(( (this.x+this.obsWidth) < (circle.x) ) && ((this.x+this.obsWidth) >= (circle.x - circle.r)) ){
				let k = (this.y-circle.y) / Math.tan(Math.asin((this.y-circle.y)/circle.r));
				if(circle.y-(this.y+this.obsWidth)<k){
					return true;
				}else{
					return false;
				}
			// the middle
			}else if ((this.x <= (circle.x + circle.r)) && ((this.x+this.obsWidth) >= (circle.x - circle.r)) ){
				return true;
			}else{
				return false;
			}
		}else if (this.y-circle.r > circle.y){
			return false;
		}
	}
	
	show(){
		if(this.collisionDetector(trex)){
			this.color='red';
		}else{
			this.color=255;
		}
		fill(this.color);
		rect(this.x, this.y, this.obsWidth, this.obsHeight);		
	}
	
}
/************ obstacles generator ************/ 
function obstaclesGenerator(){
	
	for(var i = obstacles.length-1; i>=0 ; i--){
		if(obstacles[i].collisionDetector(trex)){
			screen = 2;
		}
		obstacles[i].show();
		giveSpeed(obstacles[i],speed);
		
		if(obstacles[i].x < (0 - obstacles[i].obsWidth)){
			// Deleting obticles that are behind the canvas
			obstacles.splice(i,1);
		}
	}
	
	if((timeToCreate - performance.now()/1000) <= 0){
		// Setting time of creating the next obsticle
		timeToCreate = (performance.now()/1000 + random(0.5,2)).toFixed(1);
		// creating a new obsticle and pushing it to the array
		obstacles.push(new Obstacle( ceil(random(10,30)), ceil(random(10,30)) ));
	}
}

/************ BackgroungElement ************/ 
class BackgroungElement{
	constructor(backElWidth, backElHeight){
		this.backElWidth = backElWidth;
		this.backElHeight = backElHeight;
		this.x = width + this.backElWidth;
		this.y = 50 - this.backElHeight;
		this.color = 255;
	}
	
	show(){
		fill(this.color);
		
		for(var i=0; i< ceil(this.backElWidth/3); i++){
			ellipse(this.x + i*7, this.y +7*(-1)*(i%-2), 15);
		}
		//rect(this.x, this.y, this.backElWidth, this.backElHeight);		
	}
}
/************ game Background generator ************/ 
function gameBackgroundGenerator(){
	//(var i = gameBackground.length-1; i>=0 ; i--)
	for(var i=0; i<gameBackground.length; i++){
		gameBackground[i].show();
		giveSpeed(gameBackground[i], speed/3);
		
		if(gameBackground[i].x < (0 - gameBackground[i].backElWidth)){
			// Deleting obticles that are behind the canvas
			gameBackground.splice(i,1);
		}
		
	}
	
	if((timeToCreateBackgroung - performance.now()/1000) <= 0){
		timeToCreateBackgroung = (performance.now()/1000 + random(2,4)).toFixed(1);
		gameBackground.push(new BackgroungElement(ceil(random(10,18)), ceil(random(-20,10)) ));
	}
}


/************ give speed to objects ************/ 
function giveSpeed(object, speed){
	object.x -= speed;
}