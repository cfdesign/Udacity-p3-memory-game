const gameFrag = document.createDocumentFragment(), gameContainer = document.querySelector('.game-container'),
ratingBox = document.querySelector('.stars'), restartGame = document.querySelector('.restart');
let target, firstCard, secondCard, firstClass, secondClass, moves=0, match = 0, timer,
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
        animateFlip(firstCard);//toggleCard(); ?
        animateFlip(secondCard);
        firstCard = undefined;
        secondCard = undefined;    
        }
        if (!firstCard) {
            firstCard = target  
            firstClass = firstCard.previousElementSibling.className;
            if (moves===0) {
                startTimer(); // timer(); swap for
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

function matchLog() { //Move see notes below
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

function moveLog() { //Move see notes below
    document.querySelector('.count').textContent = ++moves;
    return rating();
}

function rating() { //Move see notes below
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
    }, 600);
}

function gameComplete() {
    yourRating = document.querySelector('.stars').outerHTML;
    yourTime = document.querySelector('.duration').innerHTML;
    //restartButton = restart();
    clearInterval(timer)
    setTimeout(function() { alert("congratulations, you took "+yourTime); }, 1000);
}

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

