const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score-points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  button: document.getElementById("nextDuel"),
};

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";
const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    loseOf: [1],
  },
];

function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

function createCardImage(randomIdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", `${pathImages}card-back.png`);
  cardImage.setAttribute("data-id", randomIdCard);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("mouseover", function () {
      drawSelectCard(randomIdCard);
    });
  }
  cardImage.addEventListener("click", function () {
    setCardsField(cardImage.getAttribute("data-id"));
  });

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.cardSprites.name = "";
  state.cardSprites.type = "";


  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = checkDuelResults(cardId, computerCardId);

  updateScore();
  drawButton(duelResults);
}

function drawButton(text) {
  state.button.innerText = text;
  state.button.style.display = "block";
}

function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "DRAW";
  let playerCard = cardData[playerCardId];

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "Win";
    playAudio("win");
    state.score.playerScore++;
  } else if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "Lose";
    playAudio("lose");
    state.score.computerScore++;
  }

  return duelResults;
}

function removeAllCardsImages() {
  let cards = document.querySelector("#computer-cards");
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  cards = document.querySelector("#player-cards");
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = getRandomCardId();
    const cardImage = createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}
async function playAudio(status) {
  // DENTRO DA FUNÇÃO playAudio

  const audio = new Audio(`src/assets/audios/${status}.wav`); // "audios" no plural
  try {
    audio.play();
  } catch (error) {
    console.error(`Error playing audio: ${status}.mp3`, error);
  }
}

function init() {
  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
  bgm.volume = 0.05;
  bgm.loop = true;
}

init();
