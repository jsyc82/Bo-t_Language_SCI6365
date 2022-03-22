var socket;
let video;
let poseNet;
let poses = [];
let easingSpeed=0.15;


let posMe = {
  NX:0,rWX:0,lWX:0,rEX:0,lEX:0,rSX:0,lSX:0,
  rAX:0,lAX:0,rKX:0,lKX:0,rHX:0,lHX:0,
  
  NY:0,rWY:0,lWY:0,rEY:0,lEY:0,rSY:0,lSY:0,
  rAY:0,lAY:0,rKY:0,lKY:0,rHY:0,lHY:0
}
let tarMe = {
  NX:0,rWX:0,lWX:0,rEX:0,lEX:0,rSX:0,lSX:0,
  rAX:0,lAX:0,rKX:0,lKX:0,rHX:0,lHX:0,
  
  NY:0,rWY:0,lWY:0,rEY:0,lEY:0,rSY:0,lSY:0,
  rAY:0,lAY:0,rKY:0,lKY:0,rHY:0,lHY:0
}

let posNew = {
  NX:0,rWX:0,lWX:0,rEX:0,lEX:0,rSX:0,lSX:0,
  rAX:0,lAX:0,rKX:0,lKX:0,rHX:0,lHX:0,
  
  NY:0,rWY:0,lWY:0,rEY:0,lEY:0,rSY:0,lSY:0,
  rAY:0,lAY:0,rKY:0,lKY:0,rHY:0,lHY:0
}

function preload() {
  soundFormats('mp3');
  whitney = loadSound("Somebody.mp3");
}

function setup() {

  createCanvas(windowWidth, windowHeight);
  background(0,0,0,200);

  socket = io.connect('localhost:3000'); //change to new host once you run ngrok
  socket.on('newPerson', newDrawing);
  socket.on('pauseMusic', pauseAll);
  socket.on('playMusic', playAll);
  
  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video);
  
  poseNet = ml5.poseNet(video, {
    flipHorizontal: true,
    outputStride: 16,
  });
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function startMusic() {
  var buttonText = document.getElementById("play");
  if (whitney.isPlaying() == true) {
      whitney.pause();
      buttonText.innerHTML = 'Play Music';
      var pamusic = true;
      socket.emit('pauseMusic', pamusic);
      console.log("Pausing//");
  }
  else {
      whitney.play();
      buttonText.innerHTML = 'Pause Music';
      var plmusic = false;
      socket.emit('playMusic', plmusic);
      console.log("Playing//");
  }
}

function playAll(plmusic) {
  if (plmusic == false) {
      whitney.play();
  }
  
}

function pauseAll(pamusic) {
  if (pamusic == true) {
      whitney.pause();
  }
}


function newDrawing(data) {
  //background(0,0,0,100);

  //easing+update
  posNew.NX += easingSpeed*(data.nX-posNew.NX);
  posNew.NY += easingSpeed*(data.nY-posNew.NY);
  posNew.rWX += easingSpeed*(data.rWX-posNew.rWX);
  posNew.rWY += easingSpeed*(data.rWY-posNew.rWY);
  posNew.lWX += easingSpeed*(data.lWX-posNew.lWX);
  posNew.lWY += easingSpeed*(data.lWY-posNew.lWY);
  posNew.rEX += easingSpeed*(data.rEX-posNew.rEX);
  posNew.rEY += easingSpeed*(data.rEY-posNew.rEY);
  posNew.lEX += easingSpeed*(data.lEX-posNew.lEX);
  posNew.lEY += easingSpeed*(data.lEY-posNew.lEY);
  posNew.rSX += easingSpeed*(data.rSX-posNew.rSX);
  posNew.rSY += easingSpeed*(data.rSY-posNew.rSY);
  posNew.lSX += easingSpeed*(data.lSX-posNew.lSX);
  posNew.lSY += easingSpeed*(data.lSY-posNew.lSY);
  posNew.rAX += easingSpeed*(data.rAX-posNew.rAX);
  posNew.rAY += easingSpeed*(data.rAY-posNew.rAY);
  posNew.lAX += easingSpeed*(data.lAX-posNew.lAX);
  posNew.lAY += easingSpeed*(data.lAY-posNew.lAY);
  posNew.rKX += easingSpeed*(data.rKX-posNew.rKX);
  posNew.rKY += easingSpeed*(data.rKY-posNew.rKY);
  posNew.lKX += easingSpeed*(data.lKX-posNew.lKX);
  posNew.lKY += easingSpeed*(data.lKY-posNew.lKY);
  posNew.rHX += easingSpeed*(data.rHX-posNew.rHX);
  posNew.rHY += easingSpeed*(data.rHY-posNew.rHY);
  posNew.lHX += easingSpeed*(data.lHX-posNew.lHX);
  posNew.lHY += easingSpeed*(data.lHY-posNew.lHY);
}

function draw() {
  push();
  fill(0,0,0,200);
  rect(0,0,width,height);
  pop();

    if (poses.length > 0) {
    let pose = poses[0].pose;
  // For one posengrok only (use a for loop for multiple poses!)
    fill(255, 0, 0);
    let nose = pose['nose'];
    let rWrist = pose['rightWrist'];
    let lWrist = pose['leftWrist'];
    let rElbow = pose['rightElbow'];
    let lElbow = pose['leftElbow'];
    let rShoulder = pose['rightShoulder'];
    let lShoulder = pose['leftShoulder'];
    let rAnkle = pose['rightAnkle'];
    let lAnkle = pose['leftAnkle'];
    let rKnee = pose['rightKnee'];
    let lKnee = pose['leftKnee'];
    let rHip = pose['rightHip'];
    let lHip = pose['leftHip'];  

    tarMe.NX = nose.x;
    tarMe.NY = nose.y;
    tarMe.rWX = rWrist.x;
    tarMe.rWY = rWrist.y;
    tarMe.lWX = lWrist.x;
    tarMe.lWY = lWrist.y;
    tarMe.rEX = rElbow.x;
    tarMe.rEY = rElbow.y;
    tarMe.lEX = lElbow.x;
    tarMe.lEY = lElbow.y;
    tarMe.rSX = rShoulder.x;
    tarMe.rSY = rShoulder.y;
    tarMe.lSX = lShoulder.x;
    tarMe.lSY = lShoulder.y;
    tarMe.rAX = rAnkle.x;
    tarMe.rAY = rAnkle.y;
    tarMe.lAX = lAnkle.x;
    tarMe.lAY = lAnkle.y;
    tarMe.rKX = rKnee.x;
    tarMe.rKY = rKnee.y;
    tarMe.lKX = lKnee.x;
    tarMe.lKY = lKnee.y;
    tarMe.rHX = rHip.x;
    tarMe.rHY = rHip.y;
    tarMe.lHX = lHip.x;
    tarMe.lHY = lHip.y;
      

  console.log('Sending: ' + nose.x + ',' + nose.y);
  var data = {
    nX: tarMe.NX,
    nY: tarMe.NY,
    rWX: tarMe.rWX,
    rWY: tarMe.rWY,
    lWX: tarMe.lWX,
    lWY: tarMe.lWY,
    rEX: tarMe.rEX,
    rEY: tarMe.rEY,
    lEX: tarMe.lEX,
    lEY: tarMe.lEY,
    rSX: tarMe.rSX,
    rSY: tarMe.rSY,
    lSX: tarMe.lSX,
    lSY: tarMe.lSY,
    rAX: tarMe.rAX,
    rAY: tarMe.rAY,
    lAX: tarMe.lAX,
    lAY: tarMe.lAY,
    rKX: tarMe.rKX,
    rKY: tarMe.rKY,
    lKX: tarMe.lKX,
    lKY: tarMe.lKY,
    rHX: tarMe.rHX,
    rHY: tarMe.rHY,
    lHX: tarMe.lHX,
    lHY: tarMe.lHY
    }

    //render me
    //head
    push();
    fill(130, 196, 233);
    ellipse(posMe.NX, posMe.NY, 30, 50);
    pop();
    
    //body
    push();
    noFill();
    strokeWeight(10);
    stroke(130, 196, 233);
    //upper body
    bezier(posMe.rWX-1,posMe.rWY-1,posMe.rWX,posMe.rWY,posMe.rEX,posMe.rEY,posMe.rSX,posMe.rSY);
    curve(posMe.rEX,posMe.rEY,posMe.rSX,posMe.rSY,posMe.lSX,posMe.lSY,posMe.lEX,posMe.lEY);
    bezier(posMe.lSX,posMe.lSY,posMe.lEX,posMe.lEY,posMe.lWX,posMe.lWY,posMe.lWX+1,posMe.lWY+1);
    //lower body
    curve(posMe.rKX,posMe.rKY,posMe.rHX,posMe.rHY,posMe.lHX,posMe.lHY,posMe.lKX,posMe.lKY);
    bezier(posMe.rAX-1,posMe.rAY-1,posMe.rAX,posMe.rAY,posMe.rKX,posMe.rKY,posMe.rHX,posMe.rHY);  
    bezier(posMe.lHX,posMe.lHY,posMe.lKX,posMe.lKY,posMe.lAX,posMe.lAY,posMe.lAX+1,posMe.lAY+1);
    pop();
    
    //render my guest
    //head
    noStroke();
    fill(255,255, 0);
    ellipse(posNew.NX, posNew.NY, 40, 50);
    
    //body
    push();
    noFill();
    strokeWeight(15);
    stroke(255, 255, 0);
    //upper body
    bezier(posNew.rWX-1,posNew.rWY-1,posNew.rWX,posNew.rWY,posNew.rEX,posNew.rEY,posNew.rSX,posNew.rSY);
    curve(posNew.rEX,posNew.rEY,posNew.rSX,posNew.rSY,posNew.lSX,posNew.lSY,posNew.lEX,posNew.lEY);
    bezier(posNew.lSX,posNew.lSY,posNew.lEX,posNew.lEY,posNew.lWX,posNew.lWY,posNew.lWX+1,posNew.lWY+1);
    //lower body
    curve(posNew.rKX,posNew.rKY,posNew.rHX,posNew.rHY,posNew.lHX,posNew.lHY,posNew.lKX,posNew.lKY);
    bezier(posNew.rAX-1,posNew.rAY-1,posNew.rAX,posNew.rAY,posNew.rKX,posNew.rKY,posNew.rHX,posNew.rHY);  
    bezier(posNew.lHX,posNew.lHY,posNew.lKX,posNew.lKY,posNew.lAX,posNew.lAY,posNew.lAX+1,posNew.lAY+1);
    pop();


    posMe.NX += easingSpeed*(tarMe.NX-posMe.NX);
    posMe.NY += easingSpeed*(tarMe.NY-posMe.NY);
    posMe.rWX += easingSpeed*(tarMe.rWX-posMe.rWX);
    posMe.rWY += easingSpeed*(tarMe.rWY-posMe.rWY);
    posMe.lWX += easingSpeed*(tarMe.lWX-posMe.lWX);
    posMe.lWY += easingSpeed*(tarMe.lWY-posMe.lWY);
    posMe.rEX += easingSpeed*(tarMe.rEX-posMe.rEX);
    posMe.rEY += easingSpeed*(tarMe.rEY-posMe.rEY);
    posMe.lEX += easingSpeed*(tarMe.lEX-posMe.lEX);
    posMe.lEY += easingSpeed*(tarMe.lEY-posMe.lEY);
    posMe.rSX += easingSpeed*(tarMe.rSX-posMe.rSX);
    posMe.rSY += easingSpeed*(tarMe.rSY-posMe.rSY);
    posMe.lSX += easingSpeed*(tarMe.lSX-posMe.lSX);
    posMe.lSY += easingSpeed*(tarMe.lSY-posMe.lSY);
    posMe.rAX += easingSpeed*(tarMe.rAX-posMe.rAX);
    posMe.rAY += easingSpeed*(tarMe.rAY-posMe.rAY);
    posMe.lAX += easingSpeed*(tarMe.lAX-posMe.lAX);
    posMe.lAY += easingSpeed*(tarMe.lAY-posMe.lAY);
    posMe.rKX += easingSpeed*(tarMe.rKX-posMe.rKX);
    posMe.rKY += easingSpeed*(tarMe.rKY-posMe.rKY);
    posMe.lKX += easingSpeed*(tarMe.lKX-posMe.lKX);
    posMe.lKY += easingSpeed*(tarMe.lKY-posMe.lKY);
    posMe.rHX += easingSpeed*(tarMe.rHX-posMe.rHX);
    posMe.rHY += easingSpeed*(tarMe.rHY-posMe.rHY);
    posMe.lHX += easingSpeed*(tarMe.lHX-posMe.lHX);
    posMe.lHY += easingSpeed*(tarMe.lHY-posMe.lHY);
    
    socket.emit('newPerson', data);
   
}

}

