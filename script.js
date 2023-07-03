// 'use strict';

// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnSett = document.querySelector('.btn--sett');
const btnRules = document.querySelector('.btn--rules');
const btnX = document.querySelector('.close-modal');
const btnXX = document.querySelector('.close-modalS');
const sliderButton = document.querySelector('.slider');

// Audio setup
let audioCtx;
let track;
let gainNode;

function initAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
  audioElement = document.querySelector('#myAudio'); // Assign HTML element here
  track = audioCtx.createMediaElementSource(audioElement);
  gainNode = audioCtx.createGain();

  track.connect(gainNode).connect(audioCtx.destination);
}

let scores, currentScore, activePlayer, playing, botTimer;

const init = function () {
  score0El.textContent = 0;
  score1El.textContent = 0;
  diceEl.classList.add('hidden');

  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');

  // Enable buttons for Player 0 and disable for Player 1
  btnRoll.disabled = false;
  btnHold.disabled = false;

  // If bot is playing, stop it
  if (botTimer) {
    clearTimeout(botTimer);
    botTimer = null;
  }
};
init();

function playAudioOnFirstClick() {
  // Play the audio
  const playPromise = audioElement.play();

  if (playPromise !== undefined) {
    playPromise
      .then(_ => {
        // Audio playback started
        console.log('Audio playback started');
      })
      .catch(error => {
        // Auto-play was prevented or any other error
        console.log('Audio playback was prevented or failed:', error);
      });
  }

  // Once the audio has started playing, remove this event listener
  document.removeEventListener('click', playAudioOnFirstClick);
}

// Attach the event listener to the document
document.addEventListener('click', playAudioOnFirstClick);

const audioClick = function () {
  let audio = new Audio('click.mp3');
  audio.play();
};

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');

  // if activePlayer is 1 (bot), disable buttons
  if (activePlayer === 1) {
    btnRoll.disabled = true;
    btnHold.disabled = true;
    botPlays();
  } else {
    btnRoll.disabled = false;
    btnHold.disabled = false;
  }
};
// Rolling dice functionality

btnRoll.addEventListener('click', function () {
  if (playing) {
    //1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1;

    //2. Display dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    //3. Check for rolled 1
    if (dice !== 1) {
      // Add dice to current score
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // Switch to next player
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', function () {
  if (playing) {
    //1. Add current score to active player's score is >= 100
    scores[activePlayer] += currentScore;
    // scores[1] = scores[1] + currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    //2. Check if player's score is >= 100
    if (scores[activePlayer] >= 100) {
      // Finish the game
      playing = false;
      diceEl.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      // Switch to the next player
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', init);

// Modal window rules

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--rules');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  // console.log(e.key);

  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Modal window settings

const modalSett = document.querySelector('.modalSett');
const btnsOpenModalS = document.querySelectorAll('.btn--sett');
const btnCloseModalS = document.querySelector('.close-modalS');

const openModalS = function () {
  modalSett.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalS = function () {
  modalSett.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModalS.length; i++)
  btnsOpenModalS[i].addEventListener('click', openModalS);

btnCloseModalS.addEventListener('click', closeModalS);
overlay.addEventListener('click', closeModalS);

document.addEventListener('keydown', function (e) {
  // console.log(e.key);

  if (e.key === 'Escape' && !modalSett.classList.contains('hidden')) {
    closeModalS();
  }
});

// Slider value
var slider = document.getElementById('myRange');
var output = document.getElementById('output');
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
  if (gainNode) {
    gainNode.gain.value = this.value / 100;
  }
};

// Function to handle user gesture and start AudioContext
function handleUserGesture() {
  if (!audioCtx) {
    initAudioContext();
  }
}

// Attach the handleUserGesture function to all button click events
btnRoll.addEventListener('click', handleUserGesture);
btnNew.addEventListener('click', handleUserGesture);
btnHold.addEventListener('click', handleUserGesture);
btnSett.addEventListener('click', handleUserGesture);
btnRules.addEventListener('click', handleUserGesture);
btnX.addEventListener('click', handleUserGesture);
btnXX.addEventListener('click', handleUserGesture);
btnRoll.addEventListener('click', audioClick);
btnNew.addEventListener('click', audioClick);
btnHold.addEventListener('click', audioClick);
btnSett.addEventListener('click', audioClick);
btnRules.addEventListener('click', audioClick);
btnX.addEventListener('click', audioClick);
btnXX.addEventListener('click', audioClick);

// Computer player

function botPlays() {
  // Bot will play after a delay
  botTimer = setTimeout(function () {
    audioClick(); // Play audio
    // Bot rolls the dice
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;

      // If current score and total score are equal or greater than 100, bot holds
      if (currentScore + scores[activePlayer] >= 100) {
        holdScore();
      } else if (currentScore >= 10 && currentScore < 15) {
        // Between 10 and 15, bot has a 30% chance of holding
        let decision = Math.random() < 0.3;
        if (decision) {
          holdScore();
        } else {
          botPlays();
        }
      } else if (currentScore >= 15 && currentScore <= 25) {
        // Between 15 and 25, bot has a 70% chance of holding
        let decision = Math.random() < 0.7;
        if (decision) {
          holdScore();
        } else {
          botPlays();
        }
      } else if (currentScore > 25 && currentScore <= 30) {
        // Between 25 and 30, bot has a 30% chance of holding
        let decision = Math.random() < 0.3;
        if (decision) {
          holdScore();
        } else {
          botPlays();
        }
      } else if (currentScore > 30) {
        // If current score is more than 30, bot holds
        holdScore();
      } else {
        botPlays();
      }
    } else {
      // If dice is 1, switch to the player
      switchPlayer();
    }
  }, 1000); // Bot will make a move every 1 second
}

function holdScore() {
  audioClick(); // Play audio
  scores[activePlayer] += currentScore;
  document.getElementById(`score--${activePlayer}`).textContent =
    scores[activePlayer];

  if (scores[activePlayer] >= 100) {
    // Bot wins the game
    playing = false;
    diceEl.classList.add('hidden');
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.add('player--winner');
    document
      .querySelector(`.player--${activePlayer}`)
      .classList.remove('player--active');
  } else {
    // Switch to the player
    switchPlayer();
  }
}
