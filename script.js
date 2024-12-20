
let currentScore = 0;
let tilesOnBoard = [];
let currentTiles = [];

const ScrabbleTiles = {
    "A": { "value": 1, "original-distribution": 9, "number-remaining": 9 },
    "B": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
    "C": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
    "D": { "value": 2, "original-distribution": 4, "number-remaining": 4 },
    "E": { "value": 1, "original-distribution": 12, "number-remaining": 12 },
    "F": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
    "G": { "value": 2, "original-distribution": 3, "number-remaining": 3 },
    "H": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
    "I": { "value": 1, "original-distribution": 9, "number-remaining": 9 },
    "J": { "value": 8, "original-distribution": 1, "number-remaining": 1 },
    "K": { "value": 5, "original-distribution": 1, "number-remaining": 1 },
    "L": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
    "M": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
    "N": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
    "O": { "value": 1, "original-distribution": 8, "number-remaining": 8 },
    "P": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
    "Q": { "value": 10, "original-distribution": 1, "number-remaining": 1 },
    "R": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
    "S": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
    "T": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
    "U": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
    "V": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
    "W": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
    "X": { "value": 8, "original-distribution": 1, "number-remaining": 1 },
    "Y": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
    "Z": { "value": 10, "original-distribution": 1, "number-remaining": 1 }
};

const boardConfig = [
    ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW'],
    ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', ''],
    ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
    ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL'],
    ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', ''],
    ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
    ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', ''],
    ['TW', '', '', 'DL', '', '', '', 'DW', '', '', '', 'DL', '', '', 'TW'],
    ['', '', 'DL', '', '', '', 'DL', '', 'DL', '', '', '', 'DL', '', ''],
    ['', 'TL', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'TL', ''],
    ['', '', '', '', 'DW', '', '', '', '', '', 'DW', '', '', '', ''],
    ['DL', '', '', 'DW', '', '', '', 'DL', '', '', '', 'DW', '', '', 'DL'],
    ['', '', 'DW', '', '', '', 'DL', '', 'DL', '', '', '', 'DW', '', ''],
    ['', 'DW', '', '', '', 'TL', '', '', '', 'TL', '', '', '', 'DW', ''],
    ['TW', '', '', 'DL', '', '', '', 'TW', '', '', '', 'DL', '', '', 'TW']
];

$(document).ready(() => {
    createBoard();
    initializeGame();
    
    $('#newGameBtn').click(initializeGame);
    $('#submitWordBtn').click(submitWord);
});

function createBoard() {
    const board = $('#board');
    boardConfig.forEach((row, i) => {
        row.forEach((square, j) => {
            const squareDiv = $('<div>')
                .addClass('board-square')
                .attr('data-row', i)
                .attr('data-col', j);
            
            switch(square) {
                case 'DL': squareDiv.addClass('double-letter'); break;
                case 'TL': squareDiv.addClass('triple-letter'); break;
                case 'DW': squareDiv.addClass('double-word'); break;
                case 'TW': squareDiv.addClass('triple-word'); break;
            }
            
            board.append(squareDiv);
        });
    });

    $('.board-square').droppable({
        accept: '.tile',
        drop: handleTileDrop,
        over: function(event, ui) {
            $(this).addClass('highlight');
        },
        out: function(event, ui) {
            $(this).removeClass('highlight');
        }
    });
}

function initializeGame() {
    currentScore = 0;
    tilesOnBoard = [];
    $('#score').text('0');
    $('#message').text('');
    $('.board-square').empty();
    $('#rack').empty();
    Object.keys(ScrabbleTiles).forEach(letter => {
        ScrabbleTiles[letter]["number-remaining"] = ScrabbleTiles[letter]["original-distribution"];
    });
    
    // Deal new tiles
    dealTiles();
}

// Deal tiles to the rack
function dealTiles() {
    while($('#rack .tile').length < 7) {
        const letter = getRandomTile();
        if(letter) {
            const tile = $('<div>')
                .addClass('tile')
                .attr('data-letter', letter)
                .append($('<img>', {
                    src: `graphics_data/Scrabble_Tiles/Scrabble_Tile_${letter}.jpg`,
                    alt: letter
                }));
            
            $('#rack').append(tile);
            
            tile.draggable({
                revert: 'invalid',
                start: function(event, ui) {
                    $(this).addClass('dragging');
                },
                stop: function(event, ui) {
                    $(this).removeClass('dragging');
                }
            });
        } else {
            // No more tiles available
            break;
        }
    }
}

// Get a random tile from remaining tiles
function getRandomTile() {
    const availableLetters = Object.keys(ScrabbleTiles).filter(
        letter => ScrabbleTiles[letter]["number-remaining"] > 0
    );
    
    if(availableLetters.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    const letter = availableLetters[randomIndex];
    ScrabbleTiles[letter]["number-remaining"]--;
    return letter;
}

// Handle tile drop on board
function handleTileDrop(event, ui) {
    const square = $(this);
    const tile = ui.draggable;
    const letter = tile.data('letter');
    
    // Check if square is already occupied
    if(square.children().length > 0) {
        tile.draggable('option', 'revert', true);
        return;
    }
    tile.detach().css({position: 'relative', top: '0px', left: '0px'});
    square.append(tile);
    
    tilesOnBoard.push({
        letter: letter,
        row: parseInt(square.data('row')),
        col: parseInt(square.data('col')),
        square: square.attr('class')
    });
}
function submitWord() {
    if(tilesOnBoard.length === 0) {
        $('#message').text('Please place some tiles on the board first!');
        return;
    }
    if(!validateWordPlacement()) {
        $('#message').text('Invalid tile placement. Tiles must be connected and in a line.');
        return;
    }
    
    const word = getWordFromBoard();

    const score = calculateScore();
    currentScore += score;
    $('#score').text(currentScore);
    tilesOnBoard.forEach(tile => {
        $(`.board-square[data-row="${tile.row}"][data-col="${tile.col}"]`).empty();
    });
    
    tilesOnBoard = [];
    dealTiles();
    
    $('#message').text(`Word "${word}" scored ${score} points!`);
}

// Validate word placement
function validateWordPlacement() {
    if(tilesOnBoard.length === 0) return false;
    
    // Check if tiles are in a line
    const rows = tilesOnBoard.map(tile => tile.row);
    const cols = tilesOnBoard.map(tile => tile.col);
    
    const isHorizontal = rows.every(row => row === rows[0]);
    const isVertical = cols.every(col => col === cols[0]);
    
    if(!isHorizontal && !isVertical) return false;
    
    if(isHorizontal) {
        const minCol = Math.min(...cols);
        const maxCol = Math.max(...cols);
        for(let col = minCol; col <= maxCol; col++) {
            if(!tilesOnBoard.some(tile => tile.col === col)) return false;
        }
    } else {
        const minRow = Math.min(...rows);
        const maxRow = Math.max(...rows);
        for(let row = minRow; row <= maxRow; row++) {
            if(!tilesOnBoard.some(tile => tile.row === row)) return false;
        }
    }
    
    return true;
}

function getWordFromBoard() {
    const sortedTiles = [...tilesOnBoard].sort((a, b) => {
        if(a.row === b.row) return a.col - b.col;
        return a.row - b.row;
    });
    
    return sortedTiles.map(tile => tile.letter).join('');
}

function calculateScore() {
    let wordMultiplier = 1;
    let score = 0;
    
    tilesOnBoard.forEach(tile => {
        let letterScore = ScrabbleTiles[tile.letter].value;
        if(tile.square.includes('double-letter')) {
            letterScore *= 2;
        } else if(tile.square.includes('triple-letter')) {
            letterScore *= 3;
        }
        if(tile.square.includes('double-word')) {
            wordMultiplier *= 2;
        } else if(tile.square.includes('triple-word')) {
            wordMultiplier *= 3;
        }
        
        score += letterScore;
    });
    
    return score * wordMultiplier;
}
async function checkWordValidity(word) {
    try {
        const response = await fetch('/usr/share/dict/words');
        const dictionary = await response.text();
        const words = dictionary.toLowerCase().split('\n');
        return words.includes(word.toLowerCase());
    } catch(error) {
        console.error('Error checking word validity:', error);
        return true;
    }
}