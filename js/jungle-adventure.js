const screens = document.querySelector(".game").querySelectorAll(".screen");
const startBtn = document.querySelector(".start-btn");
const nameInput = document.querySelector(".input-name");
const pathButtons = document.querySelectorAll(".path");
const riddleQuestion = document.querySelector(".riddle-question");
const riddleAnswerInput = document.querySelector(".riddle-answer");
const submitAnswerBtn = document.querySelector(".submit-answer");
const finalMessage = document.querySelector(".final-message");
const stats = document.querySelector(".stats");
const replayBtn = document.querySelector(".replay-btn");

const statusPath = document.querySelector(".status-path");
const statusHealth = document.querySelector(".status-health");

let userName = "";
let health = 3;
let gameCount = 0;
let currentTheme = "";
let currentRiddle = null;
let correctCount = 0;
const maxHearts = 6;
const winRiddles = 6;

const jungleRiddles = [
  {
    question:
      "I swing from tree to tree, playful and free in the jungle canopy. What am I?",
    answer: "monkey",
  },
  {
    question:
      "My roar can shake the jungle floor, I’m the king that hunters fear and adore. What am I?",
    answer: "tiger",
  },
  {
    question:
      "I slither through leaves without a sound, with a flick of my tongue I sense the ground. What am I?",
    answer: "snake",
  },
  {
    question:
      "I stand tall and green with leaves galore, birds and monkeys call me home. What am I?",
    answer: "tree",
  },
  {
    question:
      "Colorful feathers, a beak that talks, I squawk from branches as the jungle walks. What am I?",
    answer: "parrot",
  },
  {
    question:
      "I hang upside down and sleep all day, when night arrives I’m ready to play. What am I?",
    answer: "bat",
  },
];

const riverRiddles = [
  {
    question:
      "I sparkle in the sun and ripple as I run, always flowing, never done. What am I?",
    answer: "river",
  },
  {
    question:
      "I swim with fins but have no feet, in the river’s current I’m quick and sleek. What am I?",
    answer: "fish",
  },
  {
    question:
      "I fall from a height with a thunderous sound, a curtain of water that crashes down. What am I?",
    answer: "waterfall",
  },
  {
    question:
      "I am small and wooden and ride the stream, carrying travelers and their dreams. What am I?",
    answer: "boat",
  },
  {
    question:
      "I grow by the water, tall and green, whispering softly where I’m seen. What am I?",
    answer: "reed",
  },
  {
    question:
      "I rise from the ground and start to flow, a tiny beginning before I grow. What am I?",
    answer: "spring",
  },
];

function updateStatusBar() {
  const pathLabel =
    currentTheme === "jungle"
      ? "Jungle"
      : currentTheme === "river"
        ? "River"
        : "none";

  statusPath.textContent = `Path: ${pathLabel}`;

  const clampedHealth = Math.max(0, Math.min(maxHearts, health));
  const hearts = "❤️".repeat(clampedHealth);
  statusHealth.textContent = `Hearts: ${hearts || "💀"}`;
}

function animateScreenChange(targetClass) {
  const $current = $(".screen.active");
  const $next = $("." + targetClass);

  $current.fadeOut(300, function () {
    $current.removeClass("active");
    $next.fadeIn(300).addClass("active");
  });
}

startBtn.addEventListener("click", () => {
  userName = nameInput.value.trim();
  if (userName) {
    health = 3;
    correctCount = 0;
    currentTheme = "";
    updateStatusBar();
    animateScreenChange("choice");
  } else {
    nameInput.placeholder = "Please enter your name!";
  }
});

pathButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentTheme = button.dataset.choice;
    updateStatusBar();
    startRiddleRound();
  });
});

function getRandomRiddle() {
  const source =
    currentTheme === "jungle"
      ? jungleRiddles
      : currentTheme === "river"
        ? riverRiddles
        : [];

  if (source.length === 0) return null;
  return source[Math.floor(Math.random() * source.length)];
}

function startRiddleRound() {
  animateScreenChange("riddle");
  currentRiddle = getRandomRiddle();
  if (!currentRiddle) return;
  riddleQuestion.textContent = currentRiddle.question;
  riddleAnswerInput.value = "";
}

submitAnswerBtn.addEventListener("click", () => {
  if (!currentRiddle) return;

  const answer = riddleAnswerInput.value.trim().toLowerCase();
  if (!answer) return;

  if (answer === currentRiddle.answer) {
    correctCount++;
    health = Math.min(maxHearts, health + 1);

    if (correctCount >= winRiddles) {
      updateStatusBar();
      const blessing =
        currentTheme === "jungle"
          ? "The jungle spirits celebrate your wisdom!"
          : "The river spirits flow gently in your honor!";
      endGame(
        `Amazing, ${userName}! You solved ${winRiddles} riddles! ${blessing}`,
      );
    } else {
      updateStatusBar();
      startRiddleRound();
    }
  } else {
    health--;
    updateStatusBar();

    if (health <= 0) {
      const message =
        currentTheme === "jungle"
          ? `${userName}, your hearts are gone. The jungle has claimed you...`
          : `${userName}, your hearts are gone. The river carried you away...`;
      endGame(message);
    } else {
      startRiddleRound();
    }
  }
});

function endGame(message) {
  gameCount++;
  finalMessage.textContent = message;
  stats.textContent = `Hearts remaining: ${Math.max(0, Math.min(maxHearts, health))} | Correct riddles: ${correctCount} | Games played this session: ${gameCount}`;
  animateScreenChange("result");
}

replayBtn.addEventListener("click", () => {
  health = 3;
  correctCount = 0;
  currentTheme = "";
  currentRiddle = null;
  riddleAnswerInput.value = "";
  updateStatusBar();
  animateScreenChange("intro");
});
