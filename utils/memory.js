class Memory {
  constructor() {
    const FileSet = require("file-set");
    this.files = new FileSet("static/images/*.jpg");

    this.files = this.files.files.map(file => {
      const words = file.split("/");
      return {
        name: words[2].substring(0, words[2].length - 4),
        img: words[1] + "/" + words[2]
      };
    });

    this.cardBack = this.files.find(file => file.name === "cardBack");
    this.files = this.files.filter(file => file.name !== "cardBack");
    // console.log(this.files);

    this.cards = this.files;

    /*
    this.cards = [
      {
        name: "bird",
        img: "images/bird.jpg"
      },
      {
        name: "cat",
        img: "images/cat.jpg"
      },
      {
        name: "dandelion",
        img: "images/dandelion.jpg"
      },
      {
        name: "deer",
        img: "images/deer.jpg"
      },
      {
        name: "dove",
        img: "images/dove.jpg"
      },
      {
        name: "fox",
        img: "images/fox.jpg"
      },
      {
        name: "lion",
        img: "images/lion.jpg"
      },
      {
        name: "parrot",
        img: "images/parrot.jpg"
      },
      {
        name: "snowfox",
        img: "images/snowfox.jpg"
      },
      {
        name: "swan",
        img: "images/swan.jpg"
      },
      {
        name: "tiger",
        img: "images/tiger.jpg"
      },
      {
        name: "turtle",
        img: "images/turtle.jpg"
      }
    ];
    /*
    this.cardBack = {
      name: "cardBack",
      img: "images/cardBack.jpg"
    };*/

    this.cardsChosen = [];
    this.cardsArray = [];
  }

  getCardsChosen() {
    return this.cardsChosen;
  }

  getFiles() {
    return this.files;
  }

  initCardsArray(amount) {
    var cardsArray = [];
    this.cards.sort(() => 0.5 - Math.random());
    const max = amount < this.cards.length ? amount : this.cards.length;
    for (let index = 0; index < max; index++) {
      cardsArray.push(this.cards[index]);
      cardsArray.push(this.cards[index]);
    }
    cardsArray.sort(() => 0.5 - Math.random());
    cardsArray = cardsArray.map((card, index) => ({
      ...card,
      index: index,
      imgOrigin: card.img,
      img: this.cardBack.img
    }));

    this.cardsArray = cardsArray;
    return this.cardsArray;
  }

  flipCard(flippedCard) {
    console.log("flipCard: ", flippedCard);
    //const foundCard = this.cardsArray[flippedCard.index];
    flippedCard.img = flippedCard.imgOrigin;
    this.cardsChosen.push(flippedCard);
    this.cardsArray[flippedCard.index] = flippedCard;
    // console.log("flippedCard cardArray: ", this.cardsArray);
    return { cards: this.cardsArray, cardsChosen: this.cardsChosen };
  }

  checkForMatch() {
    var result = false;
    // console.log("checkForMatch: ", this.cardsChosen);
    const firstId = this.cardsChosen[0].index;
    const secondId = this.cardsChosen[1].index;

    if (this.cardsChosen[0].name === this.cardsChosen[1].name) {
      //alert("Match found!");
      this.cardsArray[firstId].found = true;
      this.cardsArray[secondId].found = true;
      result = true;
    } else {
      this.cardsArray[firstId].img = this.cardBack.img;
      this.cardsArray[secondId].img = this.cardBack.img;
      //alert("Sorry, try again!");
      result = false;
    }

    this.cardsChosen = [];
    return {
      result: result,
      cards: this.cardsArray,
      cardsChosen: this.cardsChosen
    };
  }
}

module.exports = () => {
  return new Memory();
};
/*
const cardArray = [
  {
    name: "cat",
    img: "images/cat.jpg"
  },
  {
    name: "cat",
    img: "images/cat.jpg"
  },
  {
    name: "dove",
    img: "images/dove.jpg"
  },
  {
    name: "dove",
    img: "images/dove.jpg"
  },
  {
    name: "lion",
    img: "images/lion.jpg"
  },
  {
    name: "lion",
    img: "images/lion.jpg"
  },
  {
    name: "parrot",
    img: "images/parrot.jpg"
  },
  {
    name: "parrot",
    img: "images/parrot.jpg"
  },
  {
    name: "snowfox",
    img: "images/snowfox.jpg"
  },
  {
    name: "snowfox",
    img: "images/snowfox.jpg"
  },
  {
    name: "turtle",
    img: "images/turtle.jpg"
  },
  {
    name: "turtle",
    img: "images/turtle.jpg"
  }
];

var cardsChosen = [];
var cardsChosenId = [];
var cardsWon = [];

export function createBoard(grid) {
  for (let index = 0; index < cardArray.length; index++) {
    var card = document.createElement("img");
    card.setAttribute("src", "images/cover.jpg");
    card.setAttribute("data-id", index);
    card.addEventListener("click", flipCard);
    grid.appendChild(card);
  }
}

function checkForMatch() {
  var cards = document.querySelectorAll("img");

  const firstId = cardsChosenId[0];
  const secondId = cardsChosenId[1];

  if (cardsChosen[0] === cardsChosen[1]) {
    alert("Match found!");
    cards[firstId].setAttribute("src", "images/blank.jpg");
    cards[secondId].setAttribute("src", "images/blank.jpg");
    cardsWon.push(cardsChosen);
  } else {
    cards[firstId].setAttribute("src", "images/cover.jpg");
    cards[secondId].setAttribute("src", "images/cover.jpg");
    alert("Sorry, try again!");
  }

  cardsChosen = [];
  cardsChosenId = [];
  resultDisplay.textContent = cardsWon.length
  if(cardsWon.length === cardArray.length / 2) {
      resultDisplay.textContent = 'Congratulations!'
  }
}

function flipCard() {
  var cardId = this.getAttribute("data-id");
  cardsChosen.push(cardArray[cardId].name);
  cardsChosenId.push(cardId);
  this.setAttribute("src", cardArray[cardId].img);
  if (cardsChosen.length === 2) {
    setTimeout(checkForMatch, 500);
  }
}
*/
