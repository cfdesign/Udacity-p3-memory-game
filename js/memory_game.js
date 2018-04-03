
let symbols = ["dessert", "island", "mountain", "rail", "ship", "stadium", "trail", "woods", "dessert", "island", "mountain", "rail", "ship", "stadium", "trail", "woods"];

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
    const container = document.querySelector('.game-container').children;
    let childNumber = 0;
    for (const symbol of symbols) {
        container[childNumber].children[0].className += ` ${symbol}`;
        childNumber ++;
    }
}

const gameContainer = document.querySelector('.game-container');
gameContainer.addEventListener('click', clickAnimation); 

let noTimer = true,
target;
function clickAnimation(evt) {
    if (evt.target.className === 'back') {  // ← verifies target is desired element
        target = evt.target
        target.parentElement.classList.toggle('clicked');
        if (noTimer) {
            noTimer = false;
            timer = setInterval(addTime, 1000);
        }
       // cardCheck();
        clickLog();
        //rating();
    } 
}

let clicks = 0;
function clickLog() {
    document.querySelector('.count').textContent = ++clicks;
}

let seconds = 0,
minutes = 0,
formatSec;
function addTime() {
	if (seconds < 59) {
    	++seconds;
        formatSec = seconds;
        if (seconds < 10) {
			formatSec = "0"+seconds;
        }
	} else {
    	++minutes;
    	seconds=0;
    }
    document.querySelector('.duration').innerHTML= minutes+":"+formatSec;
}

//let firstCardClick,
//secondCardClick, firstClass, secondClass;
//function cardCheck () {
   // if (firstCardClick) {
       // secondCardClick = target;
       // firstClass = firstCardClick.nextElementSibling.className,
       // secondClass = secondCardClick.nextElementSibling.className;
        //if (firstClass == secondClass) {

//}
   // } else {
     //   firstCardClick = target;
    //}

//}