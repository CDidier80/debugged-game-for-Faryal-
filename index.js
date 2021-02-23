
  /* This line was the major problem: 

    "let startingCardsCopy = startingCards"
    
    startingCardsCopy is a new variable pointing to the SAME array. 

    Equality works differently for arrays and objects than for primitive values, such as 
    integers and strings. Objects and arrays are containers for primitive values. 
    
    When you set a primitive value equal to another, you create a copy of the VALUE. 
    But when you set an object/array equal to another, you make a copy of the MEMORY POINTER -
    NOT the actual content inside. 
    
    The memory pointer is the "address" of where the collection is stored. 
    This means that when you can assign multiple variabes to the SAME array/object 

    You're not actually creating a copy - you're just giving the same array/object a new nickname
    Each variable name is just a different path back to the same array/object. 
    That means when you make changes to one variable, ALL variables will show the change
    In the course of a program's execution, misunderstood memory pointers can cause
    what looks like strange behavior in the developer console because you aren't
    console logging what you think you're logging

    This is a common beginner mistake and point of confusion

    To actually create a unique copy of an array/object, you need to copy the CONTENTS of 
    the array/object into a new array/object
    The easiest way to do this is destructing assignment.

    let copiedArray = [...originalArray] 

    or 

    let copiedObject = {...originalObject}    

    The ... placed before a variable holding an object or array selects the CONTENT of the
    array/object without selecting the container.

    ...someArray is the same as saying "extract the contents of some array"

    But the contents need a new place to live, which is why you dump them into a new object or array
    [...array] or {...object} creates a new array or object with the copied contents of the old

    This is no different than initializing any other array or object.

    let someObject = { K:"V" }
    let someArray = [1, 2, 3]

    You fill new arrays/objects with values all the time.

    "let newArray = [...someArray]" is no different and newArray will equal [1, 2, 3]

    This acheives the type of copy you're looking for.

    Your original code was always referencing the same array, and the same objects inside that array
    ...so three sets of false copies

  */

/**
 * ========================================================
 *            APP BEGINS HERE - global variabes
 * ========================================================
 */

console.log("welcome to the match game")


const board = document.querySelector('.game-board')

// great job using an array of objects! Daring? Foolish? Who knows...
let startingCards = [
    {
        name: 'bfwse',
        imgURL: 'https://www.applesfromny.com/wp-content/uploads/2020/05/Jonagold_NYAS-Apples2.png',
        flipped: false
    },
    {
        name: 'halo',
        imgURL: 'https://www.lgssales.com/wp-content/uploads/2017/07/darling-oranges-1.png',
        flipped: false
    }
]

// clickedCards now holds arrays containing 
// [ <clicked card object>, <the div>, <the image in the div> ]
// everything you need held together conveniently
let clickedCards = [],
cardsWon = []



/**
 * ===========================================
 *              APP HELPER FUNCTIONS
 * ===========================================
 */ // because repetition sucks alot and very much


//   helpers for clickedCards array 
// ===================================


 /* delete an image from card object and DOM */
const deleteImageNode = (cardArray) => cardArray.pop().remove()
// pop() returns the popped item. that means (cardArray.pop()) is actually the img tag. 
// that means you can use .remove() to take it out of the DOM

/* deletes all images when game resets */
const deleteImageNodes = () => clickedCards.forEach(card => deleteImageNode(card))


/* removes references between the card object and its Div */
const removeDivReferences = () => clickedCards.forEach(cardArray => cardArray.pop())


/* removes all associations between a card and its DOM elements */
const delDOMreferences = () => (deleteImageNodes(), removeDivReferences())
// this function "cleans up" the DOM and your data after each round
    
    
 //      array helpers
 // ========================


const clearArray = (arr) => { while (arr.length) arr.pop() }
// clean way of popping items out of an array until all items are gone. ==> []

const transferAllItems = (arrayToEmpty, arrayToFill) => arrayToEmpty.forEach(i => arrayToFill.push(arrayToEmpty.pop()))
// moves all items from an you want to empty into a new array. It's like pouring liquid back and forth between 2 cups. 


 //       DOM helpers
 // ========================

const deleteDOMNodes = (nodeList) => nodeList.forEach(node => node.remove())
// takes a list of html elements and removes them from the DOM


//  randomization helper
// =======================

const makeRandomIndex = (factor) => Math.floor(Math.random() * factor)
// this packs the randomization function you used into a clean, semantic 
// named function. Giving names to nested code improves readability


/**
 * ============================================
 *         CREATE CLEAN CARD COPIES
 * ============================================
 */

  // tip for you...
// create small, modular, carefully categorized functions that 
// have a single purpose. Try to make your code read like English.
// when things break it will be much easier to fix, and your fixes
// won't require that you refactor your entire app
// see if you can keep most functions to 5-10 lines
// 20 lines for the occasional heavy-lifter
// 40-max but you better have a damn good reason, and it better be the
// only one in the code

/* creates fresh copies for an array of cards */
const copyCards = (cards) => cards.map(card => ({...card}))
// iterate through your original cards and fill a NEW array
// with fresh, UNIQUE copies of the objects


/* creates 2 freshly copied matching pairs from starting cards */
const makeMatchingPairs = () => {
    const copiedCards = copyCards(startingCards)
    const matchingCopiedCards = copyCards(startingCards)
    return [...copiedCards, ...matchingCopiedCards]
}

// for a much simpler but "technically" more advanced approach
// look into JSON methods, like stringify, which can make clean
// copies on one line of code


/**
 * ============================================
 *              CREATE CARDS
 * ============================================
 */

 // tip for you...
// create small, modular, carefully categorized functions that 
// have a single purpose. Try to make your code read like English.
// when things break it will be much easier to fix, and your fixes
// won't require that you refactor your entire app


const createCards = () => {
    const matchingPairs = makeMatchingPairs(startingCards)
    const shuffledCards = shuffle(matchingPairs)
    const cardNodeList = shuffledCards.map((c, index) => addCardToDOM(index))
    return [ cardNodeList, shuffledCards ]
}


const addCardToDOM = () => {
    let div = document.createElement('div')
    board.appendChild(div)
    return div
}


/**
 * ============================================
 *             CONFIGURE CARDS
 * ============================================
 */

const configureCard = (div, index, cards) => {
    div.addEventListener('click', (event) => handleClick(event, cards)) 
    div.className = 'cell' 
    div.id = index 
}


const configureAllCards = (cardNodes, cards) => {
    cardNodes.forEach((div, index) => configureCard(div, index, cards))
}


const handleClick = ({target}, gameCards) => {
    const card = gameCards[target.id]
    if (!card.flipped) revealImage(card, target)
}


/**
 * =========================================
 *             IMAGE FUNCTIONS
 * =========================================
 */

const addImageToDiv = (div, url) => {
    const image = document.createElement('img')
    addImageProperties(image, url)
    div.appendChild(image)
    return image
}


const addImageProperties = (image, url) => {
    // these should probably just be in the css file
    image.style.borderRadius = '10px solid white'
    image.style.height = '100%'
    image.style.width = '100%'
    image.src = url
}


/**
 * =============================================
 *               SHUFFLE FUNCTION
 * =============================================
 */

 // great job making this work, but there are
 // much better ways of shuffling. The while 
 // loop implementation is not great because using
 // a decrementing index prevents all cards
 // from being shuffled each time, decreasing the
 // randomness of the shuffle on each iteration.
 // Better to use a for loop with a defined number of 
 // shuffles and a randomize function that doesn't 
 // accept a decrementing number as an argument.
 // Keep the random-range maxed out and find 
 // a different way to prevent cards from trying
 // to shuffle themselves

const shuffle = (arr) => {
  let currentIndex = arr.length
  let temporaryValue, randomIndex
  // no need for !== 0. 0 values are treated as "false"
  // When currentIndex = 0 the while loop will stop
  // just put current index right into the conditional
  while (currentIndex) {
    randomIndex = makeRandomIndex(currentIndex)
    currentIndex -= 1
    // nice swapping!
    temporaryValue = arr[currentIndex]
    arr[currentIndex] = arr[randomIndex]
    arr[randomIndex] = temporaryValue
  }
  return arr
}


/**
 * ==============================
 *     FLIPPING THE CARDS
 * ==============================
 */

const revealImage = (card, div) => {
    card.flipped = true
    const image = addImageToDiv(div, card.imgURL)
    // the clickedCards array now conveniently stores
    // arrays containing the card, the div, and the image.
    // This means we don't need to query for them again later
    clickedCards.push([card, div, image])
    if (clickedCards.length === 2) checkForMatch()
}


/**
 * ========================================
 *      Check for Wins and Losses
 * 
 *  comparing cards by name means you dont
 *  need to store indices in an array.
 * ========================================
 */

const getCardNames = () => clickedCards.map(array => array[0]["name"])
// creates a new array of 2 items - the names of each clicked card

const checkForMatch = () => setTimeout(() => {
    const [cardOneName, cardTwoName] = getCardNames()
    // you can pull the array items out of functions that return
    // arrays like this without having to name a variable
    // to hold both. Note that the returned array no longer exists.
    // Think of it like tearing open a package to see what's inside
    // the moment it arrives at your door. 
     cardOneName === cardTwoName ? awardWin() : playAgain()
     // if the names of each card match, the player wins
}, 900)



/**
 * ========================================
 *             GAME CONTROLS
 * ========================================
 */

const playGame = () => {
    // createCards returns an array containing 2 arrays.
    // The first contains references to the 4 divs
    // The second contains the card objects
    // Here you can unpack them ("destructure") directly from the 
    // returned value
    const [cardNodeList, shuffledCards] = createCards(startingCards)
    configureAllCards(cardNodeList, shuffledCards)
}

// functions can be wrapped in parentheses and will execute 
// from left to right. Only do this for clean/readable code when you
// have a small number of closely related processes that 
// should run in sequence. Note that in a chain of functions
// only the return value of the last function will escape. 
// These functions return nothing, so the use is appropriate
// and clean
const playAgain = () => (reset(), playGame())
    

// delete the original divs and empty your arrays for a 
// totally fresh start. This runs after every turn, no matter
// if you win/lose. It's good to wipe the slate clean and remake
// it as a failsafe against the memory issues you were running into.
const reset = () => {
    const cells = document.querySelectorAll(".cell")
    clearArray(clickedCards)
    deleteDOMNodes(cells)
}


const awardWin = () => {
    console.log("if your console is open, this is your congratulations")
    delDOMreferences()
    // before wiping the slate clean, move the cards you won into 
    // the cardsWon array. You can use that array to keep track of 
    // win count or whatever else you may wish to do
    transferAllItems(clickedCards, cardsWon)
    playAgain()
}


/**
 * ========================================
 *               LAUNCH GAME
 * ========================================
 */

document.addEventListener('DOMContentLoaded', () => playGame())

