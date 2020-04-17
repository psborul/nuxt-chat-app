class Games {
  constructor() {
    //Bilder einsammeln
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
    this.cards = this.files.filter(file => file.name !== "cardBack");
    //Bilder einsammeln/

    this.games = [];
  }

  // getCardsChosen(room) {
  //   return this.getGameInRoom(room).cardsChosen;
  // }

  getGameInRoom(room) {
    return this.games.find(game => game.room === room);
  }

  setGame(room, game) {
    const index = this.games.findIndex(game => game.room === room);
    this.games[index] = game;
  }

  newGame(room, pairAmount) {
    const cardsArray = this.initCardsArray(pairAmount);
    const gameInRoom = this.getGameInRoom(room);
    const newGame = {
      room: room,
      cards: cardsArray,
      cardsChosen: [],
      cardsWon: []
    };
    console.log("gameInRoom: ", gameInRoom, " newGame: ", newGame);
    if (gameInRoom) {
      this.setGame(room, newGame);
    } else {
      this.games = [...this.games, newGame];
    }
    console.log("this.games: ", this.games);
  }

  initCardsArray(amount) {
    var cardsArray = [];
    this.cards.sort(() => 0.5 - Math.random());
    const max = Math.min(amount, this.cards.length);
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

  flipCard(room, flippedCard) {
    console.log("flipCard: ", room, flippedCard);
    const game = this.getGameInRoom(room);
    flippedCard.img = flippedCard.imgOrigin;
    game.cardsChosen.push(flippedCard);
    game.cards[flippedCard.index] = flippedCard;
    this.setGame(room, game);
    console.log("flippedCard game: ", game);
    return game;
  }

  checkForMatch(room) {
    const game = this.getGameInRoom(room);
    var result = false;
    // console.log("checkForMatch: ", this.cardsChosen);
    const firstId = game.cardsChosen[0].index;
    const secondId = game.cardsChosen[1].index;

    if (game.cardsChosen[0].name === game.cardsChosen[1].name) {
      //alert("Match found!");
      game.cards[firstId].found = true;
      game.cards[secondId].found = true;
      result = true;
      game.cardsWon.push(game.cardsChosen[0]);
      game.cardsWon.push(game.cardsChosen[1]);
    } else {
      game.cards[firstId].img = this.cardBack.img;
      game.cards[secondId].img = this.cardBack.img;
      //alert("Sorry, try again!");
      result = false;
    }
    game.cardsChosen = [];
    this.setGame(room, game);
    return {
      result: result,
      game
    };
  }
  removeGame(room) {
    this.games = this.games.filter(game => game.room !== room);
  }
}

module.exports = () => {
  return new Games();
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
