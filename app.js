document.addEventListener('DOMContentLoaded', () => {
     const grid = document.querySelector('.grid')
     const personaje = document.createElement('div')
     let personajeLeftSpace = 50
     let puntoInicial = 150
     let personajeBottomSpace = puntoInicial
     let isGameOver = false
     let contadorPlataforma = 5
     let plataformas = []
     let upTimerId
     let downTimerId
     let isJumping = true
     let isIzq = false
     let isDer = false
     let leftTimerId
     let rightTimerId
     let puntaje = 0

     function crearPersonaje(){
         grid.appendChild(personaje)
         personaje.classList.add('personaje')
         personajeLeftSpace = plataformas[0].left
         personaje.style.left = personajeLeftSpace + 'px'
         personaje.style.bottom = personajeBottomSpace + 'px'

     }

     class Plataforma {
         constructor(newPlatBottom){
             this.bottom = newPlatBottom
             this.left = Math.random() * 315
             this.visual = document.createElement('div')

             const visual = this.visual
             visual.classList.add('plataforma')
             visual.style.left = this.left + 'px'
             visual.style.bottom = this.bottom + 'px'
             grid.appendChild(visual)

         }
     }

     function crearPlataforma(){
         for (let i = 0; i < contadorPlataforma; i++){
             let espacioPlataforma = 600 / contadorPlataforma
             let newPlatBottom = 100 + i * espacioPlataforma
             let newPlat = new Plataforma(newPlatBottom)
             plataformas.push(newPlat)
             //console.log(plataformas)
         }
     }

     function moverPlataforma(){
         if (personajeBottomSpace > 200){
             plataformas.forEach(plataforma => {
                 plataforma.bottom -= 4
                 let visual  = plataforma.visual
                 visual.style.bottom = plataforma.bottom + 'px'

                 if (plataforma.bottom < 10){
                      let firstPlatform = plataformas[0].visual
                      firstPlatform.classList.remove('plataforma')
                      plataformas.shift()
                      puntaje++
                      //console.log(plataformas)
                      let newPlat = new Plataforma(600)
                      plataformas.push(newPlat)
                 }
             })
         }

     }

     function brincar(){
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
             personajeBottomSpace += 20
             personaje.style.bottom = personajeBottomSpace + 'px'
             if (personajeBottomSpace > puntoInicial + 200){
                 caer()
             }
         },30)
     }

     function caer(){
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function(){
            personajeBottomSpace -= 5
            personaje.style.bottom = personajeBottomSpace + 'px'
            if (personajeBottomSpace <= 0){
                gameOver()
            }
            plataformas.forEach(plataforma => {
                if(
                    (personajeBottomSpace >= plataforma.bottom) &&
                    (personajeBottomSpace <= plataforma.bottom + 15) &&
                    ((personajeLeftSpace + 60) >= plataforma.left) &&
                    (personajeLeftSpace <= (plataforma.left + 85)) &&
                    !isJumping
                ) {
                    console.log('hecho')
                    puntoInicial = personajeBottomSpace
                    brincar()
                }
            })
        },30)
    }

    function gameOver(){
        //console.log('game over')
        isGameOver = true
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = puntaje
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)

    }

    function control(e){
        if(e.key === "ArrowLeft"){
            moverIzq()
        } else if (e.key === "ArrowRight"){
            moverDer()
        } else if (e.key === "ArrowUp"){
            movimientoRecto()
        }
    }

    function moverIzq(){
        if(isDer){
            clearInterval(rightTimerId)
            isDer = false
        }
        isIzq = true
        leftTimerId = setInterval(function(){
            if(personajeLeftSpace >= 0){
                personajeLeftSpace -= 5
                personaje.style.left = personajeLeftSpace + 'px'
            } else moverDer()
            
        },20)

    }
    
    function moverDer(){
        if(isIzq){
            clearInterval(leftTimerId)
            isIzq = false
        }
        isDer = true
        rightTimerId = setInterval(function (){
            if(personajeLeftSpace <= 340) {
                personajeLeftSpace += 5
                personaje.style.left = personajeLeftSpace + 'px'
            } else moverIzq()
        },20)
    }

    function movimientoRecto(){
        isDer = false
        isIzq = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }


     function comienzo(){
         if(!isGameOver){
             crearPlataforma() 
             crearPersonaje()
             setInterval(moverPlataforma,30)
             brincar()
             document.addEventListener('keyup',control)
         }
     }

     comienzo()
})