function startGame(opponent) {

  if (opponent === 'human') {

    window.location.href = 'human_game.html';

  } else if (opponent === 'bot') {

    window.location.href = 'human_vs_bot.html';

  }
}


// Show rules modal dialog
function showRules() {
  var rulesModal = document.getElementById("rules-modal");
  rulesModal.style.display = "block";
}

// Hide rules modal dialog
function hideRules() {
  var rulesModal = document.getElementById("rules-modal");
  rulesModal.style.display = "none";
}

// Close rules modal dialog when user clicks outside of it
window.onclick = function(event) {
  var rulesModal = document.getElementById("rules-modal");
  if (event.target == rulesModal) {
    rulesModal.style.display = "none";
  }
}

/* Modal for end game */

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Show the modal when the game is over
modal.style.display = "block";

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}







  