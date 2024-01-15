const rules = { X: "F+[[X]-X]-F[-FX]+X", F: "FF" };
const startingSentence = "X";
let sentence;

let drawRules;
const numGenerations = 6;

let maxGrowthAllowed = 0;
let growthRate = 1;
let growthLeft = 0;
let hasFinishedGrowing;

const lineLength = 2.5;
const angle = Math.PI / 7.2;

let windSpeed = 0;

let bg;
let deadFramesCount = 0;

const PlantSubType = {
  LEAF: "LEAF",
  BRANCH: "BRANCH",
};

function computeGrowthAllowed(plantSubtype) {
  if(plantSubtype === PlantSubType.LEAF) {
    return computeGrowthAllowedForLeaf();
  } else if(plantSubtype === PlantSubType.BRANCH) {
    return computeGrowthAllowedForBranch();
  }
}

function computeGrowthAllowedForBranch() {
  if (growthLeft > lineLength) {
    lerp_percentage = 1.;
    growthLeft -= lineLength;
  } else if (growthLeft <= 0) {
    lerp_percentage = 0.;
  } else {
    lerp_percentage = growthLeft / lineLength;
    growthLeft -= lerp_percentage * lineLength;
  }
  return lerp_percentage;
}

function computeGrowthAllowedForLeaf() {
  if (growthLeft > lineLength) {
    lerp_percentage = 1.;
    growthLeft -= lineLength;
  } else if (growthLeft <= 0) {
    lerp_percentage = 0.;
  } else {
    lerp_percentage = growthLeft / lineLength;
    growthLeft -= lerp_percentage * lineLength;
  }
  return lerp_percentage;
}

function drawForward() {
  stroke(100, 50, 0);
  strokeWeight(2);
  lerp_percentage = computeGrowthAllowed(PlantSubType.BRANCH);
  if (lerp_percentage > 0) {
    line(0, 0, 0, -lineLength * lerp_percentage);

  }
  translate(0, -lineLength);
}

function drawLeft() {
  rotate(-angle + windSpeed);
}

function drawRight() {
  rotate(angle + windSpeed);
}

function popStack() {
  drawLeaf();
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

function updateWindSpeed() {
  let windSmooth = (frameCount-deadFramesCount) / 200; // the smaller the windSmoothParameter, the smoother the wind will change
  let windPower = 0.1; // the smaller the windPowerParameter, the less powerful the wind will be
  let windBias = -0.2; // controls left or right wind
  windSpeed = (windBias + noise(windSmooth)) * windPower;
}

function updateGrowthAllowed() {
  growthRate *= 1.05;
  // if not all growth has been used, it means the plant has finished growing
  if (growthLeft > 0) {
    hasFinishedGrowing = true;
  }
  if (!hasFinishedGrowing) {
    maxGrowthAllowed += growthRate;
  }
  growthLeft = maxGrowthAllowed;
}

function drawLeaf() {
  fill(0, 255, 0);
  noStroke();
  ellipse(0, 0, 2, 2);
}

function drawPlant() {
  translate(width / 4, height);
  drawRules["-"]();
  parseSentence(sentence);
}

function setup() {
  bg = loadImage("assets/sunset.jpg");
  createCanvas(600, 600);
  instantiateDrawRules();
  sentence = expandedSentenceForNumGenerations(numGenerations);
}

function draw() {
  background(bg);
  drawPlant();
  updateGrowthAllowed();
  updateWindSpeed();
}
