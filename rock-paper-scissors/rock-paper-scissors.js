let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  loses: 0,
  ties: 0
};

updateScoreElement();

let isAutoPlaying = false;
let intervalId;

function autoPlay() {
  const autoPlayButton = document.getElementById('auto-play-button');

  if (!isAutoPlaying) {
    intervalId = setInterval(function () {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
    if (autoPlayButton) {
      autoPlayButton.textContent = 'Stop Auto Play';
    }
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
    if (autoPlayButton) {
      autoPlayButton.textContent = 'Auto Play';
    }
  }
}

function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = '';

  if (playerMove === 'scissors') {
    if (computerMove === 'scissors') {
      result = 'Tie';
    } else if (computerMove === 'rock') {
      result = 'You lose';
    } else {
      result = 'You win';
    }
  } else if (playerMove === 'paper') {
    if (computerMove === 'rock') {
      result = 'You win';
    } else if (computerMove === 'paper') {
      result = 'Tie';
    } else {
      result = 'You lose';
    }
  } else {
    if (computerMove === 'rock') {
      result = 'Tie';
    } else if (computerMove === 'paper') {
      result = 'You lose';
    } else {
      result = 'You win';
    }
  }

  if (result === 'You win') {
    score.wins += 1;
  } else if (result === 'You lose') {
    score.loses += 1;
  } else if (result === 'Tie') {
    score.ties += 1;
  }

  localStorage.setItem('score', JSON.stringify(score));

  document.querySelector('.js-result').innerHTML = result;

  document.querySelector('.js-moves').innerHTML = `You
    <img src="../photo/rock-paper-scissors/${playerMove}-emoji.png" alt="player-move" class="move-icon">
    <img src="../photo/rock-paper-scissors/${computerMove}-emoji.png" alt="computer-move" class="move-icon">
    Computer
  `;

  updateScoreElement();
}

function updateScoreElement() {
  document.querySelector('.js-score').innerHTML =
    `Wins: ${score.wins}, Loses: ${score.loses}, Ties: ${score.ties}`;
}

function pickComputerMove() {
  const randomNumber = Math.random();
  let computerMove = '';

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else {
    computerMove = 'scissors';
  }

  return computerMove;
}
