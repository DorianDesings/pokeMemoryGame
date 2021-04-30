const gameContainer = document.getElementById('game-container');
const failElement = document.getElementById('fails-text');
const pointsElement = document.getElementById('points-element');
const comboElement = document.getElementById('combo-element');
const scoreboardElement = document.getElementById('scoreboard-element');
const modalElement = document.getElementById('modal');
const formElement = document.getElementById('form');
let allCards;
let firstSelection = undefined;
let secondSelection = undefined;
let fails = 0;
let canPlay = false;
let combo = 1;
let points = 0;
const ranking = [];
const ls = localStorage;
let rankingData = ls.getItem('rankingData');

const drawRanking = rankingData => {
  const fragment = document.createDocumentFragment();
  const dataField = document.createElement('p');
  for (position of rankingData) {
    const data = dataField.cloneNode();
    data.textContent = `${position.name} - ${position.points}`;
    fragment.appendChild(data);
  }
  scoreboardElement.appendChild(fragment);
};

const getDataFromLocalStorage = () => {
  if (!rankingData) {
    ls.setItem('rankingData', JSON.stringify(ranking));
  }
  drawRanking(JSON.parse(rankingData));
};

const saveUserData = (name, points) => {
  const newDataForLocalStorage = { name, points };
  console.log(JSON.stringify());
  ls.setItem('rankingData', JSON.stringify([newDataForLocalStorage]));
  rankingData = ls.getItem('rankingData');
  drawRanking(JSON.parse(rankingData));
};

const showAllCards = allCardsElements => {
  allCardsElements.forEach(card => {
    card.classList.add('card--show');
  });
};

const hideAllCards = allCardsElements => {
  allCardsElements.forEach(card => {
    card.classList.remove('card--show');
  });
  canPlay = true;
};

const drawCards = allCards => {
  const fragment = document.createDocumentFragment();
  allCards.forEach(cardNumber => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = cardNumber;
    card.dataset.pokewin = false;
    const cardBack = document.createElement('div');
    cardBack.classList.add('card__back');
    card.appendChild(cardBack);
    const cardFront = document.createElement('div');
    cardFront.classList.add('card__front');
    const cardImage = document.createElement('img');
    cardImage.src = `assets/images/png/${cardNumber}.png`;
    cardImage.classList.add('card__img');
    cardFront.appendChild(cardImage);
    card.appendChild(cardFront);
    fragment.appendChild(card);
  });

  gameContainer.appendChild(fragment);

  const allCardsElements = document.querySelectorAll('.card');

  setTimeout(() => showAllCards(allCardsElements), 1000);
  setTimeout(() => hideAllCards(allCardsElements), 4000);
  getDataFromLocalStorage();
};

const getRandomNumber = (max = 149) => Math.floor(Math.random() * max + 1);

const generatePokeCards = () => {
  const currentCards = [
    ...new Set(Array.from({ length: 9 }).map(() => getRandomNumber()))
  ];

  allCards = [...currentCards, ...currentCards].sort(() => Math.random() - 0.5);

  currentCards.length < 9 ? generatePokeCards() : drawCards(allCards);
};

const hidePokeCards = (a, b) => {
  a.classList.remove('card--show');
  b.classList.remove('card--show');
};

const setPoints = (error = false) => {
  if (!error) {
    points = points + combo * 10;
    combo = combo + 1;
    pointsElement.textContent = `Total points: ${points}`;
  } else {
    combo = 1;
    fails = fails + 1;
    failElement.textContent = `Fails: ${fails}`;
  }
};

const setCardsSelected = (firstElementSelected, secondElementSelected) => {
  if (firstElementSelected.dataset.id === secondElementSelected.dataset.id) {
    firstElementSelected.dataset.pokewin = true;
    secondElementSelected.dataset.pokewin = true;
    setPoints();
  } else {
    secondElementSelected.addEventListener(
      'transitionend',
      () => hidePokeCards(firstElementSelected, secondElementSelected),
      { once: true }
    );
    setPoints(true);
  }
  firstSelection = undefined;
  secondSelection = undefined;
  comboElement.textContent = `X ${combo}`;
};

gameContainer.addEventListener('click', e => {
  if (canPlay) {
    if (
      e.target.parentElement.classList.contains('card') &&
      e.target.parentElement.dataset.pokewin === 'false'
    ) {
      e.target.parentElement.classList.add('card--show');
      if (firstSelection === undefined) {
        firstSelection = e.target.parentElement;
      } else {
        if (firstSelection !== e.target.parentElement) {
          secondSelection = e.target.parentElement;
          setCardsSelected(firstSelection, secondSelection);
        }
      }
    }
  }
});

formElement.addEventListener('submit', e => {
  e.preventDefault();
  saveUserData(e.target.name.value, 0);
  formElement.remove();
  generatePokeCards();
  modalElement.classList.remove('modal--show');
});

window.addEventListener('load', () => {
  modalElement.classList.add('modal--show');
});
