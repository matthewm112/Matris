//dom event listener makes sure code is read only after html code read
//putting script tag at the end of the html does the same thing
//doesnt wait for stuff like images and styles sheet
document.addEventListener('DOMContentLoaded', () =>{  
  
  //assigning grid to const by looking for classname with query selector
  const grid = document.querySelector('.grid')
    //setting variable
    const width = 10
    let timerId
    let nextRandom = 0
    let score = 0  
    const colours = [
      'orange',
      'red',
      'purple',
      'green',
      'blue',
      'pink',
      'yellow'
    ]

    //querrySelectorall finds all divs inside class
    //Array.from collects all divs and makies into an array
    let squares = Array.from(document.querySelectorAll('.grid div'))
    //#lets you know your looking for an id
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')


    // DRAWING EACH TETROMINO
    const iTetromino = [
      //for each piece, draw all for possible variations on the 10 by 20 grid
      //each index value in the array put together represents the tertemino
      [width, width +1, width +2, width +3  ],
      [2, width +2, width *2 +2, width *3 +2],
      [width*2, width*2 +1, width*2 +2, width*2 +3],
      [3, width +3, width *2 +3, width *3 +3]

  ]


  const lTetromino = [
      //for each piece, draw all for possible variations on the 10 by 20 grid
      //each index value in the array put together represents the tertemino
      [0, width, width +1, width +2 ],
      [1, width +1, width *2 +1, 2],
      [width, width +1, width +2, width *2 +2],
      [1, width +1, width*2 +1, width *2]

  ]

  const lFlipTetromino = [
      //for each piece, draw all for possible variations on the 10 by 20 grid
      //each index value in the array put together represents the tertemino
      [2, width, width +1, width +2 ],
      [1, width +1, width *2 +1, width *2 +2],
      [width, width +1, width +2, width *2],
      [1, width +1, width*2 +1, 0]

  ]

  const oTetromino = [
      //for each piece, draw all for possible variations on the 10 by 20 grid
      //each index value in the array put together represents the tertemino
      [1, 2, width +1, width +2 ],
      [1, 2, width +1, width +2 ],
      [1, 2, width +1, width +2 ],
      [1, 2, width +1, width +2 ]
    

  ]
  
  const sTetromino = [
      //for each piece, draw all for possible variations on the 10 by 20 grid
      //each index value in the array put together represents the tertemino
      [1, 2, width, width +1, ],
      [1, width +1, width +2, width *2 +2],
      [width +1 , width +2, width *2, width*2 +1],
      [0, width , width +1, width *2 +1]

  ]

  const tTetromino = [
      //for each piece, draw all for possible variations on the 10 by 20 grid
      //each index value in the array put together represents the tertemino
      [1, width, width +1,  width +2, ],
      [1, width +1, width*2 +1, width +2],
      [width, width +1 ,  width +2, width*2 +1],
      [1, width +1, width*2 +1, width]

  ]


  const zTetromino = [
      //for each piece, draw all for possible variations on the 10 by 20 grid
      //each index value in the array put together represents the tertemino
      [1, 0, width+2, width +1, ],
      [width*2 + 1, width +1, width +2, 2],
      [width +1 , width, width *2+2, width*2 +1],
      [width*2, width, width +1, 1]

  ]




  const theTetrominoes = [iTetromino, lTetromino, lFlipTetromino, oTetromino, sTetromino, tTetromino, zTetromino ]


  let currentPosition = 3
  let currentRotation = 0


  //randomly select a Tetrimino
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  //func to draw rotation
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      //setting colour
      squares[currentPosition + index].style.backgroundColor = colours[random]
    })
  }

  //func to undraw tetrimino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''

    })
  }

    //code to move Down all the way to the bottom
    function hardDrop(){
      while(1){
          undraw()
          currentPosition += width
          
          if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){

              draw()     
              freeze ()
              break       
              
          }

      }
      draw()        
  }

  
  //wasd and spacebar keycodes
  function control(e) {
    if(e.keyCode === 65) {
      moveLeft()
    } else if (e.keyCode === 87) {
      rotate()
    } else if (e.keyCode === 68) {
      moveRight()
    } else if (e.keyCode === 83) {
      moveDown()
    }
    //keycode for Spacebar
    else if (e.keyCode === 32) {
      hardDrop()
    } 
    
  }
  document.addEventListener('keyup', control)

    //func to have blocks move down every second
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

    //func to freeze blocks when they reach the bottom

  function freeze() {
        //if any block in the current terimiino shows up as taken (gone through the bottom) by the next cycle
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            //seting all bocks of tetrimino to class: taken
    
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new random tetrimino falling, reseting the position
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayNext()
      addScore()
      gameOver()
    }
  }

    //func for moving left unless edge or terimino interferes
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

    //func for moving right unless edge or terimino interferes
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }

//folloiwng 3 functions ensure proper rotations at edge 
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    //if no p provided defaults to current position
    P = P || currentPosition      
    //checks if near left or right edge, and adjusts current postion accordingly
    if ((P+1) % width < 4) {        
      if (isAtRight()){            
        currentPosition += 1    
        checkRotatedPosition(P)//recursively checking as longer block might need more than one moevement
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
  
    //function for rotating keystrokes
  function rotate() {
    undraw()
    currentRotation ++
    //RESETTING
    if(currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
  }
  

  
  
    //making next tetrimino show in smaller grid
  const displaySquares = document.querySelectorAll('.grid-next div')
  const displayWidth = 4
  const displayIndex = 0

  //list of tetriminos in base form for previews
  const upNextTetrominoes = [
    [displayWidth, displayWidth +1, displayWidth +2, displayWidth +3  ],//iTetrimino
    [0, displayWidth, displayWidth +1, displayWidth +2 ],//lTetrimino
    [2, displayWidth, displayWidth +1, displayWidth +2 ],//lFLipTetrimino
    [1, 2, displayWidth +1, displayWidth +2 ],//oTetrimino
    [1, 2, displayWidth, displayWidth +1, ],//sTetrimino
    [1, displayWidth, displayWidth +1,  displayWidth +2, ],//tTetrimino
    [1, 0, displayWidth+2, displayWidth +1, ] //zTetrimino



    ]

    //func for displaying shape in minigrid
  function displayNext() {
   //removing tetremino class from all squares in the grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom]
    })
  }

    //start button functionality
    startButton.addEventListener('click', () => {
    
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayNext()
    }
  })

  //function to add score
  function addScore() {
    //looping through each row
    for (let i = 0; i < 199; i +=width) {
      //indicates squres in current tow
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
      //if all squares in row have a block, add 10 points, change the class to make them able to pass through and background color
      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })

        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }



  console.log(random)

})
