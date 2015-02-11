//initialize the varibles
var x = 0;
var y = 0;
var answer = 0;
var problemNumber = 1;
var coins = 0;
var problemString = "";
var streak = 0;
var feedbackMsg = document.getElementById('statusMsg').innerHTML;
var itemMsg = document.getElementById('itemDisplay').innerHTML;
var textboxDefaultString = document.getElementById('answerInput').value;
var streakMsg = "";
var firstKeyPressed = false;

//for our lovely canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

//listen for input from the input box
document.getElementById('answerInput').addEventListener("keypress", function(e){
  if (e.keyCode == 13) {
    submitClicked();
  } 
});

document.getElementById('answerInput').addEventListener("keydown", function(e){
    if (!firstKeyPressed){
        textboxDefaultString = "";
        updateStrings();
    }
    firstKeyPressed = true;
    
});


document.getElementById('answerInput').addEventListener("click", function(e){
  if (e.target.value == textboxDefaultString) {
    e.target.value = "";
  }
});

function generateProblem(){
  x = Math.floor((Math.random()*9)+1);
  y = Math.floor((Math.random()*9)+1);
  answer = x + y;
  problemString = x + "+" + y;
}

function getSuccessString(){
  switch(Math.floor(Math.random()*5)) {
    case 0: return "That is correct!";
    case 1: return "Amazing!";
    case 2: return "Woo hoo!";
    case 3: return "That's another coin for you...";
    case 4: return "My god, you're a genius!";
  }
}

function getFailureString(){
  switch(Math.floor(Math.random()*5)) {
    case 0: return "That is wrong!";
    case 1: return "Boo!";
    case 2: return "You suck!";
    case 3: return "Are you retarded?";
    case 4: return "smh...";
  }
}

function submitClicked(){
  var submittedAnswer = parseInt(document.getElementById('answerInput').value, 10);
  if (submittedAnswer == answer){
    feedbackMsg = getSuccessString();
    coins++;
    streak++;
  } else {
    feedbackMsg = getFailureString();
    streak = 0;
  }
  if (streak > 1) {
    streakMsg = "Streak: " + streak;
  } else {
    streakMsg = "";
  }

  problemNumber++;
  generateProblem();
  document.getElementById('answerInput').value = "";
  updateCanvas();
  updateStrings();
}

function updateCanvas(){
  ctx.clearRect(0,0,c.width, c.height);
  /*
  ctx.font = "20px PressStart2P";
  ctx.fillText("Problem " + problemNumber, 0, 20);
  ctx.fillText("Coins " + coins, 320, 20);
  ctx.fillText(feedbackMsg, 0, 440);
  */
  ctx.font = "60px PressStart2P";
  ctx.fillText(problemString, 200, 250);

  //This is currently not working correctly and needs to be revisted.
  //We will need to find a way to clear any old timers before setting a new
  //one.
  msgClear = setTimeout(function(){
    ctx.clearRect(0,420,640,480);
  }, 1500);
}

function updateStrings(){
  document.getElementById('problemString').innerHTML = "Problem: " + problemNumber;
  document.getElementById('coinsString').innerHTML = "Coins: " + coins;
  document.getElementById('statusMsg').innerHTML = feedbackMsg;
  document.getElementById('itemDisplay').innerHTML = itemMsg;
  document.getElementById('streakMsg').innerHTML = streakMsg;
}

//I had previously used the $( document ).ready event. The problem with this was,
//it would execute before the font had finished loading, meaning the first render
//of the canvas would produce default text. Apparently, the (window).load event
//actually waits for EVERYTHING to load... which is what I want.
$(window).load(function(){
  generateProblem();
  updateCanvas();
  document.getElementById('answerInput').focus();
});