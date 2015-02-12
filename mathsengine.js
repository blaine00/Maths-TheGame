//initialize the varibles
var i = 0;
var j = 0;
var x = 0;
var y = 0;
var answer = 0;
var problemNumber = 1;
var coins = 0;
var problemString = "";
var streak = 0;
var statusMsg = document.getElementById('statusMsg').innerHTML;
var inventoryStatus = document.getElementById('inventoryStatus').innerHTML;
var textboxDefaultString = document.getElementById('answerInput').value;
var streakMsg = "";
var firstKeyPressed = false;
var isShopOpen = false;
var shopOpenStatus = document.getElementById('shopOpenStatus').innerHTML;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var inventory = [];
var level = 1;
var exp = 0;
var arena = 0;


// Check for Enter key in textbox
document.getElementById('answerInput').addEventListener("keypress", function(e){
  if (e.keyCode === 13) {
    submitAnswer();
  } 
});

// Handle the erasing of default textbox string via keys
document.getElementById('answerInput').addEventListener("keydown", function(e){
    if (!firstKeyPressed){
        e.target.value = "";
    }
    firstKeyPressed = true;
});

// Handle the erasing of default textbox string via click
document.getElementById('answerInput').addEventListener("click", function(e){
  if (e.target.value === textboxDefaultString) {
    e.target.value = "";
  }
});

// Handle the purchase of shop items
var allImageElements = document.getElementsByTagName('img');
var numberOfImages = allImageElements.length;
for (i = 0; i < numberOfImages; i++)
{
  allImageElements[i].addEventListener("click", function(e){
    purchaseItem(e.target.id);
  });
}

function purchaseItem(itemID){
  switch(itemID) {
    case "shopitemMathbot":
      if (coins >= 10) {
        coins -= 10;
        inventory.push("shopitemMathbot");
        updateInventory();
        updateStrings();
      } else {
        alert("Not enough coins..."); // will implement differently later...
      }
      break;
  }
  
}

// builds the math problem and finds the answer and the string to draw on the canvas.
function generateProblem(){
  x = Math.floor((Math.random()*9)+1);
  y = Math.floor((Math.random()*9)+1);
  answer = x + y;
  problemString = x + "+" + y;
}

// randomly returns a positive string for statusMsg. 
function getSuccessString(){
  switch(Math.floor(Math.random()*5)) {
    case 0: return "That is correct!";
    case 1: return "Amazing!";
    case 2: return "Woo hoo!";
    case 3: return "That's another coin for you...";
    case 4: return "My god, you're a genius!";
  }
}

// randomly returns a negative string for statusMsg. 
function getFailureString(){
  switch(Math.floor(Math.random()*5)) {
    case 0: return "That is wrong!";
    case 1: return "Boo!";
    case 2: return "You suck!";
    case 3: return "Are you retarded?";
    case 4: return "smh...";
  }
}

// Accept the user input, process new values, and update the canvas and strings.
function submitAnswer(){
  var submittedAnswer = parseInt(document.getElementById('answerInput').value, 10);
  if (submittedAnswer === answer) { // CORRECT
    statusMsg = getSuccessString();
    coins++;
    streak++;
  } else { // INCORRECT
    statusMsg = getFailureString();
    streak = 0;
  }
  if (streak > 1) { // STREAK DISPLAY
    streakMsg = "Streak: " + streak;
  } else { // COMBO BREAKER
    streakMsg = "";
    // maybe close the shop here?
  }
  if (streak === 10) { // STREAK GOOD ENOUGH TO OPEN SHOP
      isShopOpen = true;
  }

  problemNumber++;
  generateProblem();
  
  if (isShopOpen) { openShop(); }
  clearAnswerTextbox();
  updateCanvas();
  updateStrings();
}

// open the shop so items can be purchased.
function openShop(){
  shopOpenStatus = ""; // previous: The shop is open for business!
  $('.hidden').show();
}

// clears all text from the answer textbox.
function clearAnswerTextbox(){
  document.getElementById('answerInput').value = "";
}

// clear then draw the problem string onto the canvas.
function updateCanvas(){
  ctx.clearRect(0,0,c.width, c.height);
  ctx.font = "60px PressStart2P";
  ctx.fillText(problemString, 200, 250);
}

// updates the HTML strings to display the most up-to-date data.
function updateStrings(){
  document.getElementById('problemString').innerHTML = "Problem: " + problemNumber;
  document.getElementById('coinsString').innerHTML = "Coins: " + coins;
  document.getElementById('statusMsg').innerHTML = statusMsg;
  document.getElementById('inventoryStatus').innerHTML = inventoryStatus;
  document.getElementById('streakMsg').innerHTML = streakMsg;
  document.getElementById('shopOpenStatus').innerHTML = shopOpenStatus;
}

// Updates and displays the inventory table, depending on what's bought from the shop.
function updateInventory(){
  $('#inventoryStatus').hide();

  /* different method for changing the table as is... dunno if I want to do that...
  var content = document.getElementById('inventoryTable').innerHTML;
  if (content === "") { // might need to compare to null instead...
    content = "<tr><th>Item</th><th>Quantity</th></tr>";
  }
  */

  var content = "<tr><th>Item</th><th>Qty</th></tr>";
  var item = [];
  var quantity = [];
  fillItemAndQuantity(inventory, item, quantity);

  var HtmlStringForImage = "";
  for (i = 0; i < item.length; i++) {
    HtmlStringForImage = getMatchingImageHtmlForItemType(item[i]);
    content += "<tr><td>"+HtmlStringForImage+"</td><td>"+quantity[i]+"</td>";
  }
  document.getElementById('inventoryTable').innerHTML = content;
}

function getMatchingImageHtmlForItemType(itemType) {
  switch (itemType) {
    case "shopitemMathbot": return '<img src="mathbot.jpg"></img>';
    default:
      alert("ERROR: could not add this item's picture into the inventory list!");
      break;
  }
}

function fillItemAndQuantity(inventory, item, quantity){
  for (i = 0; i < inventory.length; i++) {
    for (j = 0; j < item.length; j++) {
      if (inventory[i] === item[j]) { // we saw the same item
        quantity[j]++;
      } else { // we saw a new kind of item
        item.push(inventory[i]);
        quantity.push(1);
      }
    }
    if (item.length === 0) { // we're seeing the very first item
      item.push(inventory[i]);
      quantity.push(1);
    }
  }
}

// init some values for easier debug.
function lolImaBetaTester(){
  coins = 100;
  streak = 9;
}

// run init logic once the window is fully loaded.
$(window).load(function(){
  $('.hidden').hide();
  lolImaBetaTester(); // TESTING PURPOSES ONLY
  generateProblem();
  updateCanvas();
  document.getElementById('answerInput').focus();
});