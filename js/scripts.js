const gameContainer = document.getElementById('game-container');
const failElement = document.getElementById('fails-text');
let allCards;
let firstSelection = undefined;
let secondSelection = undefined;
let fails = 0;

const drawCards = allCards => {
  const fragment = document.createDocumentFragment();
  allCards.forEach(cardNumber => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.id = cardNumber;
    card.dataset.pokewin = false;
    const cardFront = document.createElement('div');
    cardFront.classList.add('card__front');
    const cardImage = document.createElement('img');
    cardImage.src = `assets/images/png/${cardNumber}.png`;
    cardImage.classList.add('card__img');
    cardFront.appendChild(cardImage);
    card.appendChild(cardFront);
    const cardBack = document.createElement('div');
    cardBack.classList.add('card__back');
    card.appendChild(cardBack);
    fragment.appendChild(card);
  });

  gameContainer.appendChild(fragment);
};

const getRandomNumber = (max = 149) => Math.floor(Math.random() * max + 1);

const generatePokeCards = () => {
  const currentCards = [
    ...new Set(Array.from({ length: 9 }).map(() => getRandomNumber()))
  ];

  allCards = [...currentCards, ...currentCards].sort(() => Math.random() - 0.5);

  currentCards.length < 9 ? generatePokeCards() : drawCards(allCards);
};

generatePokeCards();

const hidePokeCards = (a, b) => {
  a.classList.remove('card--show');
  b.classList.remove('card--show');
};

const setCardsSelected = (firstElementSelected, secondElementSelected) => {
  if (firstElementSelected.dataset.id === secondElementSelected.dataset.id) {
    firstElementSelected.dataset.pokewin = true;
    secondElementSelected.dataset.pokewin = true;
  } else {
    secondElementSelected.addEventListener(
      'transitionend',
      () => hidePokeCards(firstElementSelected, secondElementSelected),
      { once: true }
    );
    fails = fails + 1;
    failElement.textContent = `Fails: ${fails}`;
  }
  firstSelection = undefined;
  secondSelection = undefined;
};

gameContainer.addEventListener('click', e => {
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
});
