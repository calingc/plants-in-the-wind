const rules = {
  X: [
    { rule: "F+[[X]-X]-F[-FX]+X", prob: 0.8 },
    { rule: "F+[[X]-X]-F[-FX]-X", prob: 0.18 },
    { rule: "F+[[X]-X]-F[-FX]", prob: 0.02 },
  ],
  F: [
    { rule: "FF", prob: 0.85 },
    { rule: "FFF", prob: 0.05 },
    { rule: "F", prob: 0.1 },
  ],
};
let shouldGenerateSentence = true;
const startingSentence = "X";
let sentence;

let drawRules;
const numGenerations = 6;

let maxGrowthAllowed = 0;
let growthRate = 1;
let growthLeft = 0;
let hasFinishedGrowing;

const PlantSubType = {
  leaf: "LEAF",
  branch: "BRANCH",
};
const branchLength = 2.5;
const LeafSize = {
  width: branchLength * 1,
  height: branchLength * 2.5,
};
let plantColor;

const angle = Math.PI / 7.2;
let windSpeed = 0;
let windPower = 0.1; // the smaller the windPowerParameter, the less powerful the wind will be

let bg;

function createUI() {
  let button = createButton("New plant");
  button.position(520, 5);
  button.mousePressed(() => {
    shouldGenerateSentence = true;
  });

  let slider = createSlider(0, 1.5, 1, 0.1);
  slider.position(525, 50);
  slider.style("width", "50px");
  slider.input(() => {
    windPower = slider.value() / 10;
  });
}

function updateUI() {
  textSize(14);
  noStroke();
  text("Wind power", 520, 45);
}

function computeGrowthAllowed(plantSubtype) {
  if (plantSubtype === PlantSubType.leaf) {
    return computeGrowthAllowedForLeaf();
  } else if (plantSubtype === PlantSubType.branch) {
    return computeGrowthAllowedForBranch();
  }
}

function computeGrowthAllowedForBranch() {
  if (growthLeft > branchLength) {
    lerp_percentage = 1;
    growthLeft -= branchLength;
  } else if (growthLeft <= 0) {
    lerp_percentage = 0;
  } else {
    lerp_percentage = growthLeft / branchLength;
    growthLeft -= lerp_percentage * branchLength;
  }
  return lerp_percentage;
}

function computeGrowthAllowedForLeaf() {
  if (growthLeft > branchLength) {
    lerp_percentage = 1;
    growthLeft -= branchLength;
  } else if (growthLeft <= 0) {
    lerp_percentage = 0;
  } else {
    lerp_percentage = growthLeft / branchLength;
    growthLeft -= lerp_percentage * branchLength;
  }
  return lerp_percentage;
}

function drawForward() {
  stroke(plantColor.branch);
  strokeWeight(2);
  lerp_percentage = computeGrowthAllowed(PlantSubType.branch);
  if (lerp_percentage > 0) {
    line(0, 0, 0, -branchLength * lerp_percentage);
  }
  translate(0, -branchLength);
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

function insntatiateColors() {
  plantColor = {
    leaf: color(61, 201, 42),
    branch: color(115, 52, 8),
  };
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

function sampleRule(rules) {
  let rand = random();
  let sum = 0;
  for (let i = 0; i < rules.length; i++) {
    sum += rules[i].prob;
    if (rand < sum) {
      return rules[i].rule;
    }
  }
}

function expandSentence(currentSentence) {
  let expandedSentence = "";
  for (let i = 0; i < currentSentence.length; i++) {
    if (rules[currentSentence[i]]) {
      expandedSentence += sampleRule(rules[currentSentence[i]]);
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
  let windSmooth = frameCount / 200; // the smaller the windSmoothParameter, the smoother the wind will change
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
  fill(plantColor.leaf);
  noStroke();
  lerp_percentage = computeGrowthAllowed(PlantSubType.leaf);
  if (lerp_percentage > 0) {
    ellipse(
      0,
      0,
      LeafSize.width * lerp_percentage,
      LeafSize.height * lerp_percentage
    );
  }
}

function drawPlant() {
  translate(width / 4, height);
  drawRules["-"]();
  parseSentence(sentence);
}

function setup() {
  createUI();
  bg = loadImage("assets/sunset.jpg");
  createCanvas(600, 600);
  instantiateDrawRules();
  insntatiateColors();
}

if (shouldGenerateSentence) {
  sentence = expandedSentenceForNumGenerations(numGenerations);
}

function generateSentenceIfNeeded() {
  if (shouldGenerateSentence) {
    sentence = expandedSentenceForNumGenerations(numGenerations);
    shouldGenerateSentence = false;
  }
}

function draw() {
  generateSentenceIfNeeded();
  background(bg);
  updateUI();
  drawPlant();
  updateGrowthAllowed();
  updateWindSpeed();
}
