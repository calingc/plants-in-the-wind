const rules = { X: "F+[[X]-X]-F[-FX]+X", F: "FF" };
const startingSentence = "X";
let sentence;

const numGenerations = 7;

const lineLength = 2;
const angle = Math.PI / 7.2;

let drawRules;

function expandedSentenceForNumGenerations(numGenerations) {
  let sentenceToExpand = startingSentence;
  for (let i = 0; i < numGenerations; i++) {
    sentenceToExpand = expandSentence(sentenceToExpand);
  }
  return sentenceToExpand;
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

function parseSentence(sentence) {
  for (let i = 0; i < sentence.length; i++) {
    if (drawRules[sentence[i]]) {
      drawRules[sentence[i]]();
    }
  }
}

function drawForward() {
  stroke(100, 50, 0);
  strokeWeight(2);
  line(0, 0, 0, -lineLength);
  translate(0, -lineLength);
}

function drawLeft() {
  rotate(-angle);
}

function drawRight() {
  rotate(angle);
}

function popStack() {
  pop();
}

function pushStack() {
  push();
}

function instantiateDrawRules() {
  drawRules = {
    F: drawForward,
    "+": drawLeft,
    "-": drawRight,
    "[": pushStack,
    "]": popStack,
  };
}

function setup() {
  createCanvas(600, 600);
  instantiateDrawRules();
  sentence = expandedSentenceForNumGenerations(numGenerations);
  console.log(sentence);
}

function drawPlant() {
  translate(width / 4, height);
  drawRules["-"]();
  parseSentence(sentence);
}

function draw() {
  background(220);
  drawPlant();
}
