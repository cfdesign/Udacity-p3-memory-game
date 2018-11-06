# Memory Game

The Memory Game Project is all about demonstrating HTML, CSS, and JavaScript. A complete browser-based card matching game (also known as Concentration).

### How The Game Works

The game board consists of sixteen "cards" arranged in a grid. The deck is made up of eight different pairs of cards, each with different symbols on one side. The cards are arranged randomly on the grid with the symbol face down. The gameplay rules are very simple: flip over two hidden cards at a time to locate the ones that match!

### Each turn:

The player flips one card over to reveal its underlying symbol.
The player then turns over a second card, trying to find the corresponding card with the same symbol.
If the cards match, both cards stay flipped over.
If the cards do not match, both cards are flipped face down.
The game ends once all cards have been correctly matched.
Game Functionality
The real-life game, players flip over cards to locate the pairs that match The goal is to recreate this effect in your project.

Interactions required:
Flipping the cards
What happens when cards match
What happens when cards do not match
When the game finishes

### Dependencies

Javascript enabled, up-to-date web browser.

## Game Behavior Specifications

**Memory Game Logic**
The game randomly shuffles the cards. A user wins once all cards have successfully been matched.

**Congratulations Popup**
When a user wins the game, a modal appears to congratulate the player and ask if they want to play again. It should also tell the user how much time it took to win the game, and what the star rating was.

**Restart Button**
A restart button allows the player to reset the game board, the timer, and the star rating.

**Star Rating**
The game displays a star rating (from 1-3) that reflects the player's performance. At the beginning of a game, it should display 3 stars. After some number of moves, it should change to a 2 star rating. After a few more moves, it should change to a 1 star rating.

The number of moves needed to change the rating is not defined, but it should happen at some point.

**Timer**
When the player starts a game, a displayed timer should also start. Once the player wins the game, the timer stops.

**Move Counter**
Game displays the current number of moves a user has made.