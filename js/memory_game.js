const gameContainer = document.querySelector('.game-container'),
ratingBox = document.querySelector('.stars');
let target, firstCard, secondCard, firstClass, secondClass, moves=0, match = 0,
symbols = ["dessert", "island", "mountain", "rail", "ship", "stadium", "trail", "woods", "dessert", "island", "mountain", "rail", "ship", "stadium", "trail", "woods"];

shuffle();

function shuffle() {
    let currentIndex = symbols.length, 
    temporaryValue, 
    randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
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
    return arrayToCss();
} 

function arrayToCss() {
    const container = gameContainer.children;
    let childNumber = 0;
    for (const symbol of symbols) {
        container[childNumber].children[0].className += ` ${symbol}`;
        childNumber ++;
    }
}

gameContainer.addEventListener('click', findCardClass); 

function findCardClass(evt) {
    if (evt.target.className === 'back') { // ← verifies target is desired 
        gameContainer.removeEventListener('click', findCardClass); 
        target = evt.target;
        if (secondCard) {
        animateFlip(firstCard);//toggleCard(); ?
        animateFlip(secondCard);
        firstCard = undefined;
        secondCard = undefined;    
        }
        if (!firstCard) {
            firstCard = target  
            firstClass = firstCard.previousElementSibling.className;
            if (moves===0) {
                timer(); // timer(); swap for
            }
            animateFlip(target);
            setTimeout(function(){
                gameContainer.addEventListener('click', findCardClass); 
            }, 200); // too long but also does not need to be applied to first click
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
     return gameComplete();
    } 
    return moveLog();
}

function timer() {
    timer = setInterval(addTime, 1000);
    let seconds = 0, ///should condense this into timer function - declare variables local or global?
    minutes = 0,
    formatSec;
    function addTime() {
        if (seconds < 59) {
            ++seconds;
            if (seconds < 10) {
                seconds = "0"+seconds;
            }
        } else {
            ++minutes;
            seconds=0;
        }
        document.querySelector('.duration').innerHTML= minutes+":"+seconds;
    }
}

function moveLog() {
    document.querySelector('.count').textContent = ++moves;
    return rating();
}

function rating() {
    const threeStar = "0 0",
    twoStar = "50% 0",
    oneStar = "100% 0";
    if (moves < 16) {
        ratingBox.style.backgroundPosition=threeStar;
    } else if (moves > 15 && moves < 21) {
        ratingBox.style.backgroundPosition= twoStar;
    } else {
        ratingBox.style.backgroundPosition= oneStar;
    }
    setTimeout(function(){
        gameContainer.addEventListener('click', findCardClass); 
    }, 600); // too long but also does not need to be applied to first click
}

function gameComplete() {
    yourRating = document.querySelector('.stars').outerHTML;
    yourTime = document.querySelector('.duration').innerHTML;
    //restartGame = restart();
    clearInterval(timer)
    setTimeout(function() { alert("congratulations, you took "+yourTime); }, 1000);
}
