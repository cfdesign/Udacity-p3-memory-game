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
//Another for the 16 cards
gameContainer.addEventListener('click', findCardClass); 

//Function activates once a click has been placed within the card container
//this starts a 'function chain' 
function findCardClass(evt) {
    if (evt.target.className === 'back') {// ← verifies card 'back' side has been clicked
        //remove the card click listeners to prevent further moves
        gameContainer.removeEventListener('click', findCardClass);
        target = evt.target;
        //This will only come into play by the third click & determines if two cards are currently flipped
        if (secondCard) {
        //then returns the cards face down
        animateFlip(firstCard);
        animateFlip(secondCard);
        //and removes their values
        firstCard = undefined;
        secondCard = undefined;    
        }
        if (!firstCard) {
            //if firstCard undefined, assign event.target to the firstCard variable
            firstCard = target  
            //then find out what classname-symbol its sibling holds on the 'front' face.
            firstClass = firstCard.previousElementSibling.className;
            //Timer will only start once after first click
            if (moves===0) {
                startTimer();
            }
            animateFlip(target);
            //give some delay for the flip to complete before excepting further clicks
            setTimeout(function() {
                gameContainer.addEventListener('click', findCardClass); 
            }, 200);
        } else {
            //assign event.target the secondCard variable
            secondCard = target
            //then find out what classname-symbol its sibling holds on the 'front' face.
            secondClass = secondCard.previousElementSibling.className;
            animateFlip(target);
            //give some delay for the flip to complete before moving to next function
            setTimeout(function(){
                // go to compare classname-symbols
                return matchCheck();
            }, 400);
        }
    }
}

//transform (flip)
//takes in arguement of either first or second card
function animateFlip(toFlip) {
    toFlip.parentElement.classList.toggle('clicked');
}
//animate (jump)
//takes in arguement of either first or second card
function animateMatch(toMatch) {
    toMatch.parentElement.classList.toggle('match');
}
//animate (shake)
//takes in arguement of either first or second card
function animateMiss(toMiss) {
    toMiss.parentElement.classList.toggle('mismatch');
}

function matchCheck() {
    // Compare classname-symbols
    if (firstClass == secondClass) {
        animateMatch(firstCard);
        animateMatch(secondCard);
        //reset values to allow firstCard and secondCard to be reassigned
        firstCard = undefined;
        secondCard = undefined; 
        //match made must be recorded   
        return matchLog();
    } else {
        animateMiss(firstCard);
        animateMiss(secondCard);
        //after delay remove shake animation class.
        setTimeout(function () { 
            animateMiss(firstCard);
            animateMiss(secondCard);
        }, 500);
        //match was not made, record move
        return moveLog();
    }
}

function matchLog() {
    match++;
    //keep track and record matches made.
    if (match === 8) {
        moveLog();
        return gameComplete();
    } 
    //if game is not complete record moves.
    return moveLog();
}
//Started once, only after first click
function startTimer() {
    timer = setInterval(addTime, 1000);
    let seconds = 0,
    minutes = 0;
    function addTime() {
        if (seconds < 59) {
            ++seconds;
            if (seconds < 10) {
                //add a leading zero digit to stop displayed time jumping after 9 seconds
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
    //record moves first, then evaluate star rating displayed
    return rating();
}
//rating logic positions an image sprite of stars
function rating() {
    if (moves < 16) {
        yourRating.style.backgroundPosition= '0% 0%';
    } else if (moves > 15 && moves < 21) {
        yourRating.style.backgroundPosition= '50% 0%';
    } else {
        yourRating.style.backgroundPosition= '100% 0%';
    }
    //rating(); is the final function in the chain, add delay to listen for further clicks
    setTimeout(function(){
        gameContainer.addEventListener('click', findCardClass); 
    }, 600);
}

function gameComplete() { 
    // stop the timer
    clearInterval(timer);
    //evaluate a reaction based on rating
    reaction();
    //give a short delay to allow 'jump' match animation to complete
    setTimeout(function() { 
        const completeContainer = document.querySelector('.complete-container');
        let resultMoves = document.querySelector('.end-count'),
        resultTime = document.querySelector('.end-duration'),
        resultRating = document.querySelector('.end-stars');
        //obtain game score    
        completeContainer.style.display = 'block';
        paragraphOne.innerHTML = reactionOne;
        resultMoves.innerHTML = yourMoves.innerHTML;
        resultTime.innerHTML = yourTime.innerHTML;
        resultRating.style.backgroundPosition = yourRating.style.backgroundPosition;
        paragraphTwo.innerHTML = reactionTwo;
        //add event listener to close modal
        completeContainer.addEventListener('click', function() {
            completeContainer.style.display = 'none';
            restart();
        });
    }, 1000);
}

function reaction() { //Additional functionality which evaluates an appropriate modal response, based on rating.
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

//resets all values to default
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