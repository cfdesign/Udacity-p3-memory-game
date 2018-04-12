const gameFrag = document.createDocumentFragment(), 
gameContainer = document.querySelector('.game-container'),
restartGame = document.querySelector('.restart'),
yourMoves = document.querySelector('.count'),
yourTime = document.querySelector('.duration'),
yourRating = document.querySelector('.stars'),
paragraphOne = document.querySelector('.reaction-1'),
paragraphTwo = document.querySelector('.reaction-2');

//symbols array represents card symbols.
//It contains 8 different classes, each class is duplicated to create an array of 16 strings altogther.
let symbols = ['dessert', 'island', 'mountain', 'rail', 'ship', 'stadium', 'trail', 'woods', 'dessert', 'island', 'mountain', 'rail', 'ship', 'stadium', 'trail', 'woods'],
target, firstCard, secondCard, firstClass, secondClass, timer, moves=0, match= 0, reactionOne, reactionTwo;

// this function call kicks-off initialisation of the game by randomly shuffling the symbols array
shuffle();

function shuffle() {
    let currentIndex = symbols.length, 
    temporaryValue, 
    randomIndex;
  
    while (0 !== currentIndex) {
  
    // While there remain elements to shuffle...
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex); // math floor rounds down so can select numbers between 0-3 //pick 1
      currentIndex -= 1; //4 -1 = 3
  
      // And swap it with the current element.
      temporaryValue = symbols[currentIndex]; 
      symbols[currentIndex] = symbols[randomIndex]; 
      symbols[randomIndex] = temporaryValue; 
    }
    //After shuffle is complete duplication(); is called
    return duplication();
}

//Addtional functionality which checks if the shuffled array has placed a pair of symbols side-by-side
function duplication() {
    for (let i = 1; i < symbols.length; i++) {
        let previous = symbols[i -1],
        current = symbols[i];
        if (previous === current) {
            //If there is duplication side-by-side, re-shuffle array.
            return shuffle();
        }
    }
    //Otherwise continue with next step
    return arrayToHtml();
} 

//old implementation of assigning array symbols to pre-made HTML card structure
    //Symbol array strings represent card CSS classes. These are inserted into the DOM one by one, 16 times.
//function arrayToCss() { 
    //const container = gameContainer.children;
    //let childNumber = 0;
    //for (const symbol of symbols) {
      //  container[childNumber].children[0].className += ` ${symbol}`;
        //childNumber ++;
    //}
//}

// New implementation uses a document fragment for improved performance.
function arrayToHtml() { 
    let newCard;
    for (const symbol of symbols) {
         //Creates HTML for 16 cards & inserts one of the 16 array strings to each card.
         //Array strings represent CSS classes, which include background images to be matched.
        const newCard = document.createElement('div');
        newCard.className = 'card'; 
        newCard.innerHTML = `<div class="front ${symbol}"></div>
                             <div class="back"></div>`;
        gameFrag.appendChild(newCard);
    }
    gameContainer.appendChild(gameFrag);
}

//Once game is set-up and ready, place 2 event listeners
//One to restart the game 
restartGame.addEventListener('click', restart);
//One for the 16 cards
gameContainer.addEventListener('click', findCardClass); 

//Function activates once a click has been placed within the card container
//this starts a 'function chain' 
function findCardClass(evt) {
    if (evt.target.className === 'back') {// ← verifies a card 'back' side has been clicked
        //remove the card click listeners to prevent further moves
        gameContainer.removeEventListener('click', findCardClass);
        target = evt.target;
        //determines how many cards have been flipped
        if (secondCard) {
        animateFlip(firstCard);
        animateFlip(secondCard);
        firstCard = undefined;
        secondCard = undefined;    
        }
        if (!firstCard) {
            firstCard = target  
            firstClass = firstCard.previousElementSibling.className;
            if (moves===0) {
                startTimer();
            }
            animateFlip(target);
            setTimeout(function() {
                gameContainer.addEventListener('click', findCardClass); 
            }, 200);
        } else {
            secondCard = target
            secondClass = secondCard.previousElementSibling.className;
            animateFlip(target);
            setTimeout(function(){
                return matchCheck();
            }, 400);
        }
    }
}

//animation functions
function animateFlip(toFlip) {
    toFlip.parentElement.classList.toggle('clicked');
}

function animateMatch(toMatch) {
    toMatch.parentElement.classList.toggle('match');
}

function animateMiss(toMiss) {
    toMiss.parentElement.classList.toggle('mismatch');
}

function matchCheck() {
    if (firstClass == secondClass) {
        animateMatch(firstCard);
        animateMatch(secondCard);
        firstCard = undefined;
        secondCard = undefined;    
        return matchLog();
    } else {
        animateMiss(firstCard);
        animateMiss(secondCard);
        setTimeout(function () { 
            animateMiss(firstCard);
            animateMiss(secondCard);
        }, 500);
        return moveLog();
    }
}

function matchLog() {
    match++;
    if (match === 8) {
        moveLog();
        return gameComplete();
    } 
    return moveLog();
}

function startTimer() {
    timer = setInterval(addTime, 1000);
    let seconds = 0,
    minutes = 0;
    function addTime() {
        if (seconds < 59) {
            ++seconds;
            if (seconds < 10) {
                seconds = '0'+seconds;
            }
        } else {
            seconds=0;
            seconds = '0'+seconds;
            ++minutes;
        }
        document.querySelector('.duration').innerHTML= minutes+':'+seconds;
    }
}

function moveLog() {
    document.querySelector('.count').textContent = ++moves;
    return rating();
}

function rating() {
    if (moves < 16) {
        yourRating.style.backgroundPosition= '0% 0%';
    } else if (moves > 15 && moves < 21) {
        yourRating.style.backgroundPosition= '50% 0%';
    } else {
        yourRating.style.backgroundPosition= '100% 0%';
    }
    setTimeout(function(){
        gameContainer.addEventListener('click', findCardClass); 
    }, 600);
}

function gameComplete() { 
    clearInterval(timer);
    reaction();
    setTimeout(function() { 
        const completeContainer = document.querySelector('.complete-container');
        let resultMoves = document.querySelector('.end-count'),
        resultTime = document.querySelector('.end-duration'),
        resultRating = document.querySelector('.end-stars');
    
        completeContainer.style.display = 'block';
        paragraphOne.innerHTML = reactionOne;
        resultMoves.innerHTML = yourMoves.innerHTML;
        resultTime.innerHTML = yourTime.innerHTML;
        resultRating.style.backgroundPosition = yourRating.style.backgroundPosition;
        paragraphTwo.innerHTML = reactionTwo;
        completeContainer.addEventListener('click', function() {
            completeContainer.style.display = 'none';
            restart();
        });
    }, 1000);
}

function reaction() { //Additional functionality which gives an appropriate modal response, based on rating.
    let ratingResult = yourRating.style.backgroundPosition;
    if (ratingResult === '0% 0%') {
        reactionOne = 'You did amazing!'
        reactionTwo = 'Now try to beat the clock, have another go!'
    } else if (ratingResult === '50% 0%') {
        reactionOne = 'You did very well!'
        reactionTwo = 'Strive for perfection, have another go!'
    } else {
        reactionOne = 'You did good!'
        reactionTwo = 'Practice makes pefect, have another go!'
    }
}

function restart() {
    firstCard = undefined;
    secondCard = undefined;    
    moves = 0
    match = 0
    rating();
    gameContainer.innerHTML ='';
    clearInterval(timer);
    document.querySelector('.duration').innerHTML= '0:00';
    document.querySelector('.count').textContent = '0';
    shuffle();
}