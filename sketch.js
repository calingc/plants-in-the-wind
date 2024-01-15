const rules = { X: "F+[[X]-X]-F[-FX]+X", F: "FF" };
const startingSentence = "X";
let sentence;

let bg

const numGenerations = 6;

const lineLength = 2;
const angle = Math.PI / 7.2;

let drawRules;
let windSpeed = 0;
let windDelta = 0.001;
const maxWindSpeed = 0.05;


function drawForward() {
  stroke(100, 50, 0);
  strokeWeight(2);
  line(0, 0, 0, -lineLength);
  translate(0, -lineLength);
}

function drawLeft() {
  rotate(-angle + windSpeed);
}

function drawRight() {
  rotate(angle + windSpeed);
}

function popStack() {
  pop();
}

function pushStack() {
  push();
}

function instantiateDrawRules() {
  drawRules = {
    "F": drawForward,
    "+": drawLeft,
    "-": drawRight,
    "[": pushStack,
    "]": popStack,
  };
}

function expandSentence(currentSentence) {
  let expandedSentence = "";
  for (let i = 0; i < currentSentence.length; i++) {
    if (rules[currentSentence[i]]) {
      expandedSentence += rules[currentSentence[i]];
    } else {
      expandedSentence += currentSentence[i];
    }
  }
  return expandedSentence;
}

function expandedSentenceForNumGenerations(numGenerations) {
  let sentenceToExpand = startingSentence;
  for (let i = 0; i < numGenerations; i++) {
    sentenceToExpand = expandSentence(sentenceToExpand);
  }
  return sentenceToExpand;
}

function parseSentence(sentence) {
  for (let i = 0; i < sentence.length; i++) {
    if (drawRules[sentence[i]]) {
      drawRules[sentence[i]]();
    }
  }
}

function setup() {
  bg = loadImage('assets/sunset.jpg');
  createCanvas(600, 600);
  instantiateDrawRules();
  sentence = expandedSentenceForNumGenerations(numGenerations);
  // console.log(sentence);
}

function drawPlant() {
  translate(width / 4, height);
  drawRules["-"]();
  parseSentence(sentence);
}

function updateWindSpeed(){
  // windSpeed += windDelta
  // if (abs(windSpeed) > maxWindSpeed)
  // {
  //   windDelta = -windDelta;
  // }
  // console.log(windSpeed);
  windSpeed = (-0.5 + noise(frameCount/200)) * 0.1;

}

function draw() {
  background(bg);
  sunset_color = color(255, 255, 255);
  updateWindSpeed();
  drawPlant();
}
