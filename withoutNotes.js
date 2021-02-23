console.log("welcome to the match game")
const board = document.querySelector('.game-board')

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

let clickedCards = [],
cardsWon = []

/* -------------------------- helper functions ------------------------- */

const deleteImageNode = (cardArray) => {
    const imageNode = cardArray.pop()
    imageNode.remove() 
}

const deleteImageNodes = () => clickedCards.forEach(card => deleteImageNode(card))

const removeDivReferences = () => clickedCards.forEach(cardArray => cardArray.pop())

const delDOMreferences = () => {
    deleteImageNodes()
    removeDivReferences()
}

const clearArray = (arr) => { while (arr.length) arr.pop() }

const transferOneItem = (losingArray, gainingArray) => gainingArray.push(losingArray.pop())

const transferAllItems = (arrayToEmpty, arrayToFill) => arrayToEmpty.forEach(item => transferOneItem(arrayToEmpty, arrayToFill))

const deleteDOMNodes = (nodeList) => nodeList.forEach(node => node.remove())

const makeRandomIndex = (factor) => Math.floor(Math.random() * factor)

/* ------------------------ end helper functions ----------------------- */

const copyCards = (cards) => cards.map(card => ({...card}))


const makeMatchingPairs = () => {
    const copiedCards = copyCards(startingCards)
    const matchingCopiedCards = copyCards(startingCards)
    return [...copiedCards, ...matchingCopiedCards]
}


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


const configureCard = (div, index, cards) => {
    div.addEventListener('click', (event) => handleClick(event, cards)) 
    div.className = 'cell' 
    div.id = index 
}


const configureAllCards = (cardNodes, cards) => cardNodes.forEach((div, index) => configureCard(div, index, cards))


const handleClick = ({target}, gameCards) => {
    const card = gameCards[target.id]
    if (!card.flipped) revealImage(card, target)
}


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


const shuffle = (arr) => {
  let currentIndex = arr.length
  let temporaryValue, randomIndex
  while (currentIndex) {
    randomIndex = makeRandomIndex(currentIndex)
    currentIndex -= 1
    temporaryValue = arr[currentIndex]
    arr[currentIndex] = arr[randomIndex]
    arr[randomIndex] = temporaryValue
  }
  return arr
}


const revealImage = (card, div) => {
    card.flipped = true
    const image = addImageToDiv(div, card.imgURL)
    clickedCards.push([card, div, image])
    if (clickedCards.length === 2) checkForMatch()
}


const getCardNames = () => clickedCards.map(array => array[0]["name"])


const checkForMatch = () => setTimeout(() => {
    const [cardOneName, cardTwoName] = getCardNames()
     cardOneName === cardTwoName ? awardWin() : playAgain()
}, 900)


const playGame = () => {
    const [cardNodeList, shuffledCards] = createCards(startingCards)
    configureAllCards(cardNodeList, shuffledCards)
}


const playAgain = () => (reset(), playGame())


const reset = () => {
    const cells = document.querySelectorAll(".cell")
    clearArray(clickedCards)
    deleteDOMNodes(cells)
}


const awardWin = () => {
    console.log("if your console is open, this is your congratulations")
    delDOMreferences()
    transferAllItems(clickedCards, cardsWon)
    playAgain()
}


document.addEventListener('DOMContentLoaded', () => playGame())

