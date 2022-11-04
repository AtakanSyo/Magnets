

let centerMass = 4000;
let centerMassWidth = 100;

const slowDownConst = 1;

let meteorArr = [];
let centralMassArr = [];

let numberOfDots = 40;

let velocityX = 0;
let velocityY = 0;

let centerMassX;
let centerMassY;

let kineticEnergyColorConstant = 0.000001;

let backgroundFade = 0;

let initialDistance = 400;

class centralMass{
  constructor(mass, width, x, y){
    this.mass = mass;
    this.width = width;
    this.x = x;
    this.y = y;
  }
}

class meteor{
  constructor(positionArr, velocityArr, meteorMass,meteorColor) {
    this.positionArr = positionArr;
    this.velocityArr = velocityArr;
    this.meteorMass = meteorMass;   
    this.momentumArr = [meteorMass*velocityArr[0],meteorMass*velocityArr[1]];
    this.meteorVelocity = Math.sqrt(velocityArr[0]**2 + velocityArr[1]**2);
    this.meteorColor = meteorColor;
    this.kineticEnergy = (meteorMass*(this.meteorVelocity**2))/2;
  }
  updateVelocity(){
    this.meteorVelocity = Math.sqrt(this.velocityArr[0]**2 + this.velocityArr[1]**2);
  }
  updateKineticEnergy(){
    this.kineticEnergy = (this.meteorMass*(this.meteorVelocity**2))/2;    
  }
}

function setup() {

  createCanvas(windowWidth,windowHeight);

  background(0);
  frameRate(60);

  for(let x = 1; x<width; x += width/numberOfDots){
    for(let y = 1; y<height; y += height/numberOfDots){
        meteorArr.push(new meteor([x,y],[velocityX,velocityY], 1, [255,255,255]));
    }
  }

  centralMassArr.push(new centralMass(centerMass,centerMassWidth,width/1.5, height/2));
  centralMassArr.push(new centralMass(centerMass,centerMassWidth,width/3, height/2));

  centerMassX = width/2;
  centerMassY = height/2;
  background(0);
}

function draw() {
  background(0,5);

  for(let i = 0; i<meteorArr.length;i++){

    let meteor = meteorArr[i];

    noFill();
    stroke(255,255,255);
    strokeWeight(1);
    for(let t = 0; t<centralMassArr.length; t++){

      circle(centralMassArr[t].x, centralMassArr[t].y, centralMassArr[t].width);

      if(!insideCircle(centralMassArr[t].x, centralMassArr[t].y, centralMassArr[t].width/2, meteor.positionArr[0], meteor.positionArr[1])){
        diffX = centralMassArr[t].x - meteor.positionArr[0];
        diffY = centralMassArr[t].y - meteor.positionArr[1];

        distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        force =  (meteor.meteorMass * centralMassArr[t].mass) / distance**2;

        angle = Math.acos(diffX / distance)*(180/PI);
        angleInRadian = (angle/180)*PI;

        if(diffY < 0 ){ 
          angleInRadian = -angleInRadian;
        }

        meteor.momentumArr[0] += cos(angleInRadian)*force;
        meteor.momentumArr[1] += sin(angleInRadian)*force;

        meteor.velocityArr[0] = meteor.momentumArr[0] / meteor.meteorMass;
        meteor.velocityArr[1] = meteor.momentumArr[1] / meteor.meteorMass;
        meteor.positionArr[0] += meteor.velocityArr[0];
        meteor.positionArr[1] += meteor.velocityArr[1];
        meteor.updateVelocity();
        meteor.updateKineticEnergy();
        let xNext = meteor.positionArr[0] + meteor.velocityArr[0]*slowDownConst;
        let yNext = meteor.positionArr[1] + meteor.velocityArr[1]*slowDownConst;
        stroke(meteor.meteorColor[0],meteor.meteorColor[1],meteor.meteorColor[2],100);
        strokeWeight(meteor.meteorMass);
        line(meteor.positionArr[0],meteor.positionArr[1],xNext,yNext);
      }else{
        meteorArr.splice(i, 1);
      }
    }
  }
}

function insideCircle(x1, y1, r, x2, y2){
  let diffX = x2 - x1;
  let diffY = y2 - y1;
  if( r **2 > diffX ** 2 + diffY ** 2){
    return true;
  }
  return false;
}

function mouseReleased(){
  let posX = mouseX;
  let posY = mouseY;
  meteorArr.push(new meteor([mouseX,mouseY],[2,0],2,[255,255,255]));
}

function drawCenterMass(){
  noFill();
  for(let i = centerMass; 0<i; i -= 3){
    stroke(255,255,255,i**2);
    circle(centerMassX, centerMassY, i);
  }  
}

function giveMeColor(r,g,b){
  let newColor = [random(r),random(g),random(b)];
  return newColor;
}




