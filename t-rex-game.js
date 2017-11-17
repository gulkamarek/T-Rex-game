/************ Variables  ************/ 
let speed = 4;


let jumpBeginnTime = performance.now();
var obstacles = [];
var timeToCreate = 0;
var temporaryObstContainer ;


/************ Setup block  ************/ 
function setup(){
	createCanvas(500, 200);
	
	trex = new Trex();
	
}

/************ Draw block  ************/ 
function draw(){
	playScreen();
	
	// TESTING PHASE 
	obstaclesGenerator();
}

/************ key handler  ************/ 
function handelKey(){	
	if( keyIsDown(UP_ARROW) || keyIsDown(32)){
		ellipse(300,100, 20);
		if(trex.onGround()){
			trex.jump();
		}
	}
}

/************ initScreen ************/
function initScreen(){
	
}
/************ playScreen ************/
function playScreen(){
	background(51);
	stroke(255);
	fill(255);
	line(0,170,width, 170);
	trex.show();
	trex.controlHeight();
	handelKey();
}
/************ gameOverScreen ************/ 
function gameOverScreen(){
	
}
/************ winScreen ************/ 
function winScreen(){

}

/************ TREX ************/ 
class Trex{
	constructor(){
		this.x = 50;
		this.y = 150;
		this.initianVelYJump = 300; // choosen by trial and error method it was easier faster to create ths variable than to change the value in the loop 
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
		/**/
		// THESE TO DELETE
		if (t < 3){
			text('Jump time: ' + t, 50, 50);
		}
		/**/

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
		ellipse(this.x,this.y,40);
	}
}

/************ obstacle ************/ 
class Obstacle{
	
	constructor(obstacleWidht, obstacleHeight){
		this.obsWidth = obstacleWidht;
		this.obsHeight = obstacleHeight;
		this.x = width + this.obsWidth;
		this.y = 170 - this.obsHeight;
	}
	collisionDetector(trex){
		//if(this.x<
	}
	
	show(){
		fill(255);
		rect(this.x, this.y, this.obsWidth, this.obsHeight);		
	}
	
}
/************ obstacles generator ************/ 
function obstaclesGenerator(){
	
	for(var i = obstacles.length-1; i>=0 ; i--){
		obstacles[i].show();
		giveSpeed(obstacles[i]);
		if(obstacles[i].x < (0 - obstacles[i].obsWidth)){
			// Deleting obticles that are behind the canvas
			obstacles.splice(i,1);
		}
	}
	
	if((timeToCreate - performance.now()/1000) <= 0){
		// Setting time of creating the next obsticle
		timeToCreate = (performance.now()/1000 + random(0.5,2)).toFixed(1);
		// creating a new obsticle and pushing it to the array
		obstacles.push(new Obstacle( ceil(random(10,20)), ceil(random(10,20)) ));
	}
}

/************ give speed to objects ************/ 
function giveSpeed(object){
	object.x -= speed;
}