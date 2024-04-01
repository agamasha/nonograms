let gameWrapper = document.createElement('div');
let startButton = document.createElement('div');
let playFieldWrapper = document.createElement('div');
let squareAndTopWrapper = document.createElement('div'); //пустой квадрат и верхние подсказки
let nonogramAndLeftWrapper = document.createElement('div'); //нонограмма и левые подсказки
let nonogramSquare = document.createElement('div'); //квадрат около подсказок
let hintsTop = document.createElement('div'); //подсказки сверху
let hintsLeft = document.createElement('div'); //подсказки слева
let nonogram = document.createElement('div'); //сама нонограмма
let cellsCountField = document.createElement('div'); //счётчик отмеченных клеток в верхней части поля
let modalCongrats = document.createElement('div');
let timer = document.createElement('div');

document.body.append(gameWrapper);
gameWrapper.appendChild(startButton);
gameWrapper.appendChild(playFieldWrapper);
playFieldWrapper.appendChild(squareAndTopWrapper);
playFieldWrapper.appendChild(nonogramAndLeftWrapper);
squareAndTopWrapper.appendChild(nonogramSquare);
squareAndTopWrapper.appendChild(hintsTop);
nonogramAndLeftWrapper.appendChild(hintsLeft);
nonogramAndLeftWrapper.appendChild(nonogram);
gameWrapper.appendChild(cellsCountField);
gameWrapper.appendChild(timer);

gameWrapper.classList.add('game-wrapper');
startButton.classList.add('start-button');
playFieldWrapper.classList.add('play-field-wrapper');
squareAndTopWrapper.classList.add('square-and-top-wrapper');
nonogramAndLeftWrapper.classList.add('nonogram-and-left-wrapper');
nonogramSquare.classList.add('nonogram-square');
hintsTop.classList.add('hints-top');
hintsLeft.classList.add('hints-left');
nonogram.classList.add('nonogram');
cellsCountField.classList.add('cells-count-field');
modalCongrats.classList.add('modal-congrats');
timer.classList.add('timer');

startButton.innerHTML = 'Start game!'
cellsCountField.innerHTML = 'Black cells: 0/0';
timer.innerHTML = 'Time: 00:00';

var picChoiceButtons = [];
var chosenNonogram;
var nonogramArray = [];
var isGameStarted = false;
var seconds = 0;
var audioNonogram = new Audio('./snap.mp3');
var audioCross = new Audio('./cross.mp3');
var audioWin = new Audio('./win.mp3');

startButton.addEventListener('click', function () {
  displayNoneFunc(startButton);

  let modalDifficulty = document.createElement('div');
  let difficultyButtonsWrapper = document.createElement('div');
  let simpleDifficultyButton = document.createElement('button');
  let mediumDifficultyButton = document.createElement('button');
  let hardDifficultyButton = document.createElement('button');
  var modalDifficultyText = document.createElement('div');

  gameWrapper.appendChild(modalDifficulty);
  modalDifficulty.appendChild(modalDifficultyText);
  modalDifficulty.appendChild(difficultyButtonsWrapper);
  difficultyButtonsWrapper.appendChild(simpleDifficultyButton);
  difficultyButtonsWrapper.appendChild(mediumDifficultyButton);
  difficultyButtonsWrapper.appendChild(hardDifficultyButton);

  modalDifficulty.classList.add('modal-difficulty');
  modalDifficultyText.classList.add('modal-difficulty-text');
  difficultyButtonsWrapper.classList.add('difficulty-buttons-wrapper');
  simpleDifficultyButton.classList.add('difficulty-button');
  mediumDifficultyButton.classList.add('difficulty-button');
  hardDifficultyButton.classList.add('difficulty-button');

  modalDifficultyText.innerText = 'Choose difficulty level:';
  simpleDifficultyButton.innerHTML = 'Simple';
  mediumDifficultyButton.innerHTML = 'Medium';
  hardDifficultyButton.innerHTML = 'Hard';

  //выбор уровня сложности
  simpleDifficultyButton.addEventListener('click', function() {
    picChoice(1);
    displayNoneFunc(simpleDifficultyButton);
    displayNoneFunc(mediumDifficultyButton);
    displayNoneFunc(hardDifficultyButton);
  })

  mediumDifficultyButton.addEventListener('click', function() {
    picChoice(2);
    displayNoneFunc(simpleDifficultyButton);
    displayNoneFunc(mediumDifficultyButton);
    displayNoneFunc(hardDifficultyButton);
  })

  hardDifficultyButton.addEventListener('click', function() {
    picChoice(3);
    displayNoneFunc(simpleDifficultyButton);
    displayNoneFunc(mediumDifficultyButton);
    displayNoneFunc(hardDifficultyButton);
  })

  //выбор картинки
  const picChoice = (n) => {
    modalDifficultyText.innerText = 'Choose picture:';
    switch(n) {
      case 1:
        picChoiceButtonsFunc(simpleNonograms);
        break;
      case 2:
        picChoiceButtonsFunc(mediumNonograms);
        break;
      case 3:
        picChoiceButtonsFunc(hardNonograms);
        break;
    }
  }
  //генерация поля и игра
  const picChoiceButtonsFunc = (dif) => {
    var resetButton = document.createElement('div');
    gameWrapper.appendChild(resetButton);
    resetButton.classList.add('reset-button');
    resetButton.innerHTML = 'Reset game';
    for (let i = 0; i < dif.length; i++) {
      picChoiceButtons[i] = document.createElement('button');
      picChoiceButtons[i].classList.add('difficulty-button');
      difficultyButtonsWrapper.appendChild(picChoiceButtons[i]);
      picChoiceButtons[i].innerHTML = dif[i].name;
      picChoiceButtons[i].addEventListener('click', function() {
        chosenNonogram = dif[i];
        var nonogramBlackCells = 0;
        for (let q = 0; q < chosenNonogram.nonogram.length; q ++) {
          for (let p = 0; p < chosenNonogram.nonogram[q].length; p ++) {
            if (chosenNonogram.nonogram[q][p] === 1) {
              nonogramBlackCells ++;
            }
          }
        }
        cellsCountField.innerHTML = `Black cells: 0/${nonogramBlackCells}`;
        displayNoneFunc(modalDifficulty);
        cellsCountField.style.display = 'block';
        timer.style.display = 'block';
        playFieldWrapper.style.display = 'flex';
        resetButton.style.display = 'block';
        nonogramArray = new Array(chosenNonogram.nonogram.length);
        for (let m = 0; m < nonogramArray.length; m ++) {
          nonogramArray[m] = new Array(chosenNonogram.nonogram.length);
        }
        var userNonogramArray = new Array(chosenNonogram.nonogram.length).fill(0); //массив с нонограммой, которую нарисует пользователь, будем ее сравнивать с ответом
        for (let m = 0; m < nonogramArray.length; m ++) {
          userNonogramArray[m] = new Array(chosenNonogram.nonogram.length).fill(0);
        }
        let linesArray = new Array(dif.length);
        for (let k = 0; k < chosenNonogram.nonogram.length; k++) {
          linesArray[k] = document.createElement('div');
          linesArray[k].classList.add('nonogram-line');
          nonogram.appendChild(linesArray[k]);
          for (let j = 0; j < chosenNonogram.nonogram[i].length; j ++) {
            nonogramArray[k][j] = document.createElement('div');
            nonogramArray[k][j].classList.add('nonogram-cell-light');
            nonogramArray[k][j].classList.add('nonogram-cell');
            linesArray[k].appendChild(nonogramArray[k][j]);
            var blackCellsGameCount = 0;
            nonogramArray[k][j].addEventListener('click', function(event) {
              isGameStarted = true;
              event.currentTarget.classList.toggle('nonogram-cell-light');
              event.currentTarget.classList.toggle('nonogram-cell-dark');
              audioNonogram.play();
              if (event.currentTarget.classList.contains('nonogram-cell-dark')) {
                userNonogramArray[k][j] = 1;
                blackCellsGameCount++;
                event.currentTarget.innerHTML = '';
              } else {
                blackCellsGameCount--;
                userNonogramArray[k][j] = 0;
              }
              cellsCountField.innerHTML = `Black cells: ${blackCellsGameCount}/${nonogramBlackCells}`;
              if (nonogramBlackCells === blackCellsGameCount) {
                gameOver();
                gameWrapper.removeChild(resetButton);
              }
            });
            nonogramArray[k][j].addEventListener('contextmenu', function(event) {
              event.preventDefault();
              if (nonogramArray[k][j].classList.contains('nonogram-cell-light')) {
                if (!nonogramArray[k][j].innerHTML) {
                  nonogramArray[k][j].innerHTML = 'x';
                  audioCross.play();
                }
                else {
                  nonogramArray[k][j].innerHTML = '';
                  audioCross.play();
                }
              }
              return false;
            });
            if ((j + 1) % 5 === 0 && j !== chosenNonogram.nonogram.length - 1) {
              nonogramArray[k][j].style = 'border-right: 2px solid #2e1a1e';
            }
            if ((k + 1) % 5 === 0 && k !== chosenNonogram.nonogram.length - 1) {
              linesArray[k].style = 'border-bottom: 1px solid #2e1a1e';
            }
          }
        }
        resetButton.addEventListener('click', function () {
          isGameStarted = false;
          blackCellsGameCount = 0;
          seconds = 0;
          timer.innerHTML = 'Time: 00:00';
          for (let k = 0; k < chosenNonogram.nonogram.length; k++) {
            for (let j = 0; j < chosenNonogram.nonogram[i].length; j ++) {
              nonogramArray[k][j].classList.remove('nonogram-cell-dark');
              nonogramArray[k][j].classList.add('nonogram-cell-light');
              nonogramArray[k][j].innerHTML = '';
              userNonogramArray[k][j] = 0;
            }
          }
          cellsCountField.innerHTML = `Black cells: ${blackCellsGameCount}/${nonogramBlackCells}`;
        });
        nonogramSquare.style.display = 'block';
        squareAndTopWrapper.style.display = 'flex';
        nonogramAndLeftWrapper.style.display = 'flex';
        let hintsTopLines = new Array(chosenNonogram.nonogram.length);
        for (let m = 0; m < nonogramArray.length; m ++) {
          hintsTopLines[m] = new Array(5);
        }
        let hintsLeftLines = new Array(chosenNonogram.nonogram.length);
        for (let m = 0; m < nonogramArray.length; m ++) {
          hintsLeftLines[m] = new Array(5);
        }
        for (let i = 0; i < chosenNonogram.nonogram.length; i ++) {
          hintsTopLines[i] = document.createElement('div');
          hintsTop.appendChild(hintsTopLines[i]);
          hintsTopLines[i].classList.add('hints-top-line');
          hintsLeftLines[i] = document.createElement('div');
          hintsLeft.appendChild(hintsLeftLines[i]);
          hintsLeftLines[i].classList.add('hints-left-line');
          for (let j = 0; j < 5; j ++) {
            hintsTopLines[i][j] = document.createElement('div');
            hintsTopLines[i].appendChild(hintsTopLines[i][j]);
            hintsTopLines[i][j].classList.add('nonogram-cell-light');
            hintsLeftLines[i][j] = document.createElement('div');
            hintsLeftLines[i].appendChild(hintsLeftLines[i][j]);
            hintsLeftLines[i][j].classList.add('nonogram-cell-light');
            if (j === 4) {
              hintsLeftLines[i][j].style = 'border-right: 2px solid #2e1a1e';
              hintsTopLines[i][j].style = 'border-bottom: 2px solid #2e1a1e';
            }
            if ((i + 1) % 5 === 0 && i !== chosenNonogram.nonogram.length - 1) {
              hintsLeftLines[i].style.borderBottom = '1px solid #2e1a1e';
              hintsTopLines[i][j].style.borderRight = '2px solid #2e1a1e';
            }
          }
        }
        //for (let i = 0; i < 5; i ++) {
        //  hintsTopLines[chosenNonogram.nonogram.length - 1][i].style = 'border-right: none';
        //}
        //hintsTopLines[chosenNonogram.nonogram.length - 1][4].style = 'border-bottom: 2px solid';

        //добавляем подсказки
        for (let i = 0; i < chosenNonogram.nonogram.length; i ++) {
          let blackCellsCount = 0;
          let blackFieldsCount = 0; //это куски, которые будут закрашены, нужны, чтобы вписывать числа в подсказки
          for (let j = chosenNonogram.nonogram.length - 1; j >= 0; j --) {
            if (chosenNonogram.nonogram[i][j] === 1 && chosenNonogram.nonogram[i][j - 1] === 1) {
              blackCellsCount ++;
            }
            else if (chosenNonogram.nonogram[i][j] === 1 && chosenNonogram.nonogram[i][j - 1] !== 1) {
              blackCellsCount ++;
              blackFieldsCount ++;
              hintsLeftLines[i][5 - blackFieldsCount].innerHTML = blackCellsCount;
              blackCellsCount = 0;
            }
          }
        }
        for (let j = 0; j < chosenNonogram.nonogram.length; j ++) {
          let blackCellsCount = 0;
          let blackFieldsCount = 0; //это куски, которые будут закрашены, нужны, чтобы вписывать числа в подсказки
          for (let i = chosenNonogram.nonogram.length - 1; i >= 0; i --) {
            if (i === 0 && chosenNonogram.nonogram[i][j] === 1) {
              blackCellsCount ++;
              blackFieldsCount ++;
              hintsTopLines[j][5 - blackFieldsCount].innerHTML = blackCellsCount;
              blackCellsCount = 0;
            }
            else if (chosenNonogram.nonogram[i][j] === 1 && chosenNonogram.nonogram[i - 1][j] === 1) {
              blackCellsCount ++;
            }
            else if (chosenNonogram.nonogram[i][j] === 1 && chosenNonogram.nonogram[i - 1][j] !== 1) {
              blackCellsCount ++;
              blackFieldsCount ++;
              hintsTopLines[j][5 - blackFieldsCount].innerHTML = blackCellsCount;
              blackCellsCount = 0;
            }
          }
        }
      })
    }
  }

})

setInterval(() => {
  if (isGameStarted) {
    seconds++;
  }
  let sec = seconds % 60;
  let min = (seconds - (seconds % 60)) / 60;
  if (sec < 10) {
    sec = '0' + sec;
  }
  if (min < 10) {
    min = '0' + min;
  }
  timer.innerHTML = `Time: ${min}:${sec}`;
}, 1000);


const gameOver = () => {
  audioWin.play();
  isGameStarted = false;
  gameWrapper.removeChild(playFieldWrapper);
  gameWrapper.removeChild(cellsCountField);
  gameWrapper.removeChild(timer);
  gameWrapper.appendChild(modalCongrats);
  modalCongrats.innerHTML = `Great! You have solved the nonogram in ${seconds} seconds`;
}

//функция прячет блок
const displayNoneFunc = (block) => {
  block.style.display = 'none';
}






