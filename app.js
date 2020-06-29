/*
RULES OF PIG DICE GAME:

-- The game has 2 players, playing in rounds
-- During their turn, player rolls dice as many times as they wish. The result get added to their 'Round Score'
-- If the player rolls a 1, the 'Round Score' is reset to 0 and its the next players turn.
-- A player can choose to 'Hold', which means that his Round Score gets added to their global (total) score. 
  When a player chooses to Hold, it is then the next player's turn.
-- The first player to reach 100 points total score, OR the number they have set in the input, wins the game.

*/

//Declare some variables we will use throughout the game
var scores, roundScore, activePlayer, gamePlaying, prevRoll;

//initial set-up when the page is loaded or a new game begins
init();

//When roll button is clicked, we display the dice

document.querySelector(".btn-roll").addEventListener("click", function () {
  console.log("Previous roll was a  " + prevRoll);
  //prevRoll = 0;
  if (gamePlaying) {
    //1. get a random number
    var dice1 = Math.floor(Math.random() * 6) + 1;
    var dice2 = Math.floor(Math.random() * 6) + 1;

    //2. display the result - using the dice pics we have saved
    document.getElementById('dice-1').style.display = 'block';    
    document.getElementById('dice-2').style.display = 'block';    
    document.getElementById('dice-1').src = 'dice-' + dice1 + '.png';
    document.getElementById('dice-2').src = 'dice-' + dice2 + '.png';

    //update the round score if  neither roll was a 1

    if (dice1 !== 1 && dice2 !== 1) {
      //Add score
      roundScore += dice1 + dice2;
      document.querySelector('#current-' + activePlayer).textContent = roundScore;
  } else {
      //implemented DRY principle - put this code into a
      //separate function to switch the current player      
      nextPlayer();
  }

/*
    The below code is used if we want to change the game so that two sixes in a row
    resets a player's points and switches turn to other player

    if (dice === 6 && prevRoll === 6) {
        console.log("Double sixes");
        scores[activePlayer] = 0;
        document.querySelector("#score-" + activePlayer).textContent = '0';
        nextPlayer();
      }
    //update the round score IF the rolled number was NOT a 1
    else if (dice > 1 && dice2 > 1) {
      //add score to current
      roundScore += (dice + dice2);
      //store the roll, to use for prev roll
      document.querySelector("#current-" + activePlayer).textContent = roundScore;
    } 
    else {
      console.log("Oops. You rolled a " + dice + " . Next players turn.");
      //implemented DRY principle - put this code into a
      //separate function to switch the current player
      nextPlayer();
      }
      //storing the previous roll
      prevRoll = dice;
*/
    }
  }
);

//When hold button is clicked, update player's score accordingly and switch the turn
document.querySelector(".btn-hold").addEventListener("click", function () {

  if (gamePlaying) {
    //add current round score to this players global score using scores array
    scores[activePlayer] += roundScore;

    //update the UI
    document.querySelector("#score-" + activePlayer).textContent = scores[activePlayer];

    //If user has entered a score they want to play up to, set that value here
    var input = document.querySelector('.final-score').value;
    var winningScore;

    //undefined, 0, null, or '' are COERCED to false
    //anything else is coerced to true
    //if user has entered a score, use that, otherwise default to 100
    if (input) {
        winningScore = input;
    } else {
        winningScore = 100;
    }

    //Check if player won the game
    if (scores[activePlayer] >= winningScore) {

      document.querySelector("#name-" + activePlayer).textContent = "WINNER!!!";

      //styling -- apply Winner class to the whole player panel
      document.getElementById('dice-1').style.display = 'none';    
      document.getElementById('dice-2').style.display = 'none'; 

      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      gamePlaying = false;
    } else {
      //if player has not won yet, keep switching player
      nextPlayer();
    }
  }
});

//This function is called any time we need to switch turns
function nextPlayer() {
  //switch the active player
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);

  //after switching the player, have to reset the round score
  roundScore = 0;

  //both scores reset - beginning of new turn
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  //change active class - based on which one was active + which now should be
  //using TOGGLE instead of the following:
  //document.querySelector('.player-0-panel').classList.remove('active');
  //document.querySelector('.player-1-panel').classList.remove('active');
  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");

  //also want to hide the dice when turn changes
  document.getElementById('dice-1').style.display = 'none';    
  document.getElementById('dice-2').style.display = 'none'; 

}

//handle new game button
document.querySelector(".btn-new").addEventListener("click", init);

function init() {

  gamePlaying = true;
  scores = [0, 0];
  roundScore = 0;

  //first player is zero, second player is 1
  activePlayer = 0;

  //Hiding the dice when the game first begins
  document.getElementById('dice-1').style.display = 'none';    
  document.getElementById('dice-2').style.display = 'none'; 

  //set all scores to 0
  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  //make sure correct names are displayed
  document.getElementById("name-0").textContent = "Player 1";
  document.getElementById("name-1").textContent = "Player 2";

  //remove winner and active classes, set player 1 to active
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");

  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");

  //had to remove it before then adding it again so theres no potential duplicate
  document.querySelector(".player-0-panel").classList.add("active");
}

