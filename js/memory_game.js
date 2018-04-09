const gameFrag = document.createDocumentFragment(), 
gameContainer = document.querySelector('.game-container'),
restartGame = document.querySelector('.restart'),
yourMoves = document.querySelector('.count'),
yourTime = document.querySelector('.duration'),
yourRating = document.querySelector('.stars');

let symbols = ["dessert", "island", "mountain", "rail", "ship", "stadium", "trail", "woods", "dessert", "island", "mountain", "rail", "ship", "stadium", "trail", "woods"],
target, firstCard, secondCard, firstClass, secondClass, timer, moves=0, match= 0;

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
    return duplication();
}

function duplication() {
    for (let i = 1; i < symbols.length; i++) {
        let previous = symbols[i -1],
        current = symbols[i];
        if (previous === current) {
            return shuffle();
        }
    }
    return arrayToHtml();
} 

//function arrayToCss() { // old implementation of assigning cards/symbols
    //const container = gameContainer.children;
    //let childNumber = 0;
    //for (const symbol of symbols) {
      //  container[childNumber].children[0].className += ` ${symbol}`;
        //childNumber ++;
    //}
//}

function arrayToHtml() {
    let newCard;
    for (const symbol of symbols) {
        const newCard = document.createElement('div');
        newCard.className = 'card'; 
        newCard.innerHTML = `<div class="front ${symbol}"></div>
                             <div class="back"></div>`;
        gameFrag.appendChild(newCard);
    }
    gameContainer.appendChild(gameFrag);
}

restartGame.addEventListener('click', restart); 
gameContainer.addEventListener('click', findCardClass); 

function findCardClass(evt) {
    if (evt.target.className === 'back') { // ← verifies target is desired 
        gameContainer.removeEventListener('click', findCardClass); 
        target = evt.target;
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
            return matchCheck();
        }
    }
}

//animateFlip
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
                seconds = "0"+seconds;
            }
        } else {
            seconds=0;
            seconds = "0"+seconds;
            ++minutes;
        }
        document.querySelector('.duration').innerHTML= minutes+":"+seconds;
    }
}

function moveLog() {
    document.querySelector('.count').textContent = ++moves;
    return rating();
}

function rating() {
    if (moves < 16) {
        yourRating.style.backgroundPosition= "0 0";
    } else if (moves > 15 && moves < 21) {
        yourRating.style.backgroundPosition= "50% 0";
    } else {
        yourRating.style.backgroundPosition= "100% 0";
    }
    setTimeout(function(){
        gameContainer.addEventListener('click', findCardClass); 
    }, 600);
}

function gameComplete() { 
    clearInterval(timer)
    //reaction();
    setTimeout(function() { 
        const completeContainer = document.querySelector('.complete-container');
        let resultMoves = document.querySelector('.end-count'),
        resultTime = document.querySelector('.end-duration'),
        resultRating = document.querySelector('.end-stars');
    
        completeContainer.style.display = "block";
        resultMoves.innerHTML = yourMoves.innerHTML;
        resultTime.innerHTML = yourTime.innerHTML;
        resultRating.style.backgroundPosition = yourRating.style.backgroundPosition;
        completeContainer.addEventListener('click', function() {
            completeContainer.style.display = "none";
            restart();
        });
    }, 1000);
}

//function reaction(); {
    
//}

function restart() {
    firstCard = undefined;
    secondCard = undefined;    
    moves = 0
    match = 0
    rating();
    gameContainer.innerHTML ='';
    clearInterval(timer);
    document.querySelector('.duration').innerHTML= `0:00`;
    document.querySelector('.count').textContent = `0`;
    shuffle();
}
///restart normally works fine, restart after game complete and the new cards game won't click,flip - unresponsive.
    //removing innerHTML method - had to add event listener to gamecomplete - lets explore this
///think about order logic of moveLog > rating > matchLog
///move add.event listener to matchLog
///reset displayed stars rating

