window.onload = function(){
    // Config
    let currentLevel = 0;
    let revealSpeed = 10;
    let levels = [
        [ 0, 0, 1, 1 ],
        [ 0, 1, 2, 3 ],
        [ 1, 1, 2, 2, 3, 3 ],
        [ 0, 1, 2, 2, 3, 4 ],
        [ 0, 1, 2, 3, 4, 5 ],
        [ 0, 1, 1, 2, 2, 3, 4, 5 ],
        [ 0, 1, 2, 3, 4, 5, 6, 7 ]
    ];
    let fps = 33;

    let selectedCard;
    let cards;
    let maxTime = seconde(30) / fps;
    let score;
    let remainingTime;
    let gameLoop;
    
    // Booleans
    let canSelectCard;   // Player can select a card ?
    let gameStarted; // Game's started ?
    let returnTimeOut; // Need to know if two revealed cards need to be returned
    
    // HTML elements
    let gameContainer = document.querySelector(".game_container");
    let timeAmount = document.querySelector(".amount");
    let btnStart, infoScore, infoTime;

    init();

    function init(){
        resetVariables();

        btnStart = document.createElement("div");
        btnStart.innerHTML = "<strong>Start</strong> a new <strong>Game</strong>";
        btnStart.classList.add("button-start");
        btnStart.addEventListener("click", gameStart);

        infoScore = document.getElementById("score");
        infoTime = document.getElementById("time");

        gameContainer.appendChild(btnStart);
    }
    
    function resetVariables(){
        gameLoop = null;
        score = 0;
        cards = [];

        selectedCard = [null, null];
        remainingTime = maxTime;

        canSelectCard = true;   // Player can select a card ?
        gameStarted = false; // Game's started ?
        returnTimeOut = false; // Need to know if two revealed cards need to be returned
    }

    function gameStart(){
        if(gameLoop == null){
            for(let i = 0; i < levels[currentLevel].length; i++){
                let currentNumber = levels[currentLevel][i];
        
                cards.push( new Card(gameContainer, currentNumber) );
                cards.push( new Card(gameContainer, currentNumber) );
            }
            cards = shuffle(cards);

            gameStarted = true;
            gameLoop = window.setInterval(update, fps);
            btnStart.removeEventListener("click", gameStart);

            infoTime.style.display = "block";
            infoScore.style.display = "block";
            infoScore.innerHTML = score;
        }
        for(let i = 0; i < cards.length; i++){
            cards[i].generateHTML();
        }
    }

    function update(){
        if(gameStarted){
            if(getOpacity(btnStart) > 0){
                btnStart.style.opacity = getOpacity(btnStart) - 0.1;
                if(getOpacity(btnStart) == 0){
                    btnStart.style.display = "none";
                }
            }

            for(let i = cards.length - 1; i >= 0; i--){
                cards[i].update();
            }
            
            if(selectedCard[0] != null && selectedCard[1] != null){
                // console.clear();
                let cardA = selectedCard[0];
                let cardB = selectedCard[1];
                
                if(cardA.type == cardB.type){ // Good pair !
                    cardA.paired = true;
                    cardB.paired = true;
                    
                    selectedCard = [null, null];
                    canSelectCard = true;
                    score += 2;
                    infoScore.innerHTML = score;
                }
                else if(cardA.rotateValue >= 180 && cardB.rotateValue >= 180){ // Bad pair...
                    if(returnTimeOut == false){
                        returnTimeOut = true;
                        
                        setTimeout(function(){
                            cardA.reverse();
                            cardB.reverse();
                            selectedCard = [null, null];
                            canSelectCard = true;
                            returnTimeOut = false;
                        }, 500);
                    }
                }
            }
            
            
            if(remainingTime > 0){
                remainingTime--;
                let percent = (( remainingTime / maxTime) * 100);
                let secondes =  Math.round(remainingTime / fps);
                // timeAmount.title = secondes + " secondes.";

                if(infoTime.innerHTML != secondes + "s"){
                    let newValue = secondes + "s";
                    if(secondes < 10){
                        newValue = "0" + newValue;
                    }
                    infoTime.innerHTML = newValue;
                }
                
                if(window.innerWidth < window.innerHeight && window.innerWidth < 840){
                    timeAmount.style.width = (( remainingTime / maxTime) * 100) + "%";
                    timeAmount.style.height = "100%";
                }
                else{
                    timeAmount.style.width = "100%";
                    timeAmount.style.height = (( remainingTime / maxTime) * 100) + "%";
                }
            }
            else{
                // alert("You lose :(");
                gameEnd();
            }
        }
    }

    class Card{
        constructor(p_parent, p_type){
            this.parent = p_parent;
            this.type = p_type;
            
            this.selected = false;
            this.revealed = false;
            this.paired = false;
    
            this.rotateValue = 0;
        }
    
        generateHTML(){
            let HTML = document.createElement("div");
            HTML.classList.add("card");
    
            const self = this;
            HTML.addEventListener("click", () => {
                self.click();
            });
    
            this.HTML = HTML;
            this.parent.appendChild(HTML);
        }
    
        click(){
            if(gameStarted){
                if(canSelectCard && !this.selected && !this.revealed){
                    if(selectedCard[0] == null){
                        selectedCard[0] = this;
                    }
                    else if(selectedCard[1] == null){
                        selectedCard[1] = this;
                        canSelectCard = false;
                    }
                    this.selected = true;
                }
            }
        }
    
        reverse(){
            this.selected = false;
        }
    
        update(){
            if(this.selected){
                if(this.rotateValue < 180){
                    this.rotateValue += revealSpeed;
                    this.HTML.style.transform = "rotateY(" + this.rotateValue + "deg)";
                }
    
                if(this.revealed == false){
                    if(this.rotateValue >= 90){
                        this.revealed = true;
                        this.HTML.classList.add(revealClass(this.type));
                    }
                }
            }
            else if(this.revealed){
                if(this.rotateValue > 0){
                    this.rotateValue -= revealSpeed;
                    this.HTML.style.transform = "rotateY(" + this.rotateValue + "deg)";
    
                    if(this.rotateValue <= 90){
                        this.HTML.classList.remove(revealClass(this.type));
                    }
                }
                else{
                    this.revealed = false;
                }
            }
        }
    }

    function revealClass(type){
        let classConnection = [
            "green",
            "white",
            "blue",
            "brown",
            "yellow",
            "red",
            "pink",
            "gray"
        ];
        return classConnection[type];
    }

    function gameEnd(){
        console.log("Game Ended...");
        clearInterval(gameLoop);
        gameLoop = null;

        infoTime.style.display = "none";
        infoScore.style.display = "none";
        btnStart.style.display = "block";
        gameContainer.innerHTML = "";
        gameContainer.appendChild(btnStart);
        btnStart.style.opacity = 1;
        btnStart.addEventListener("click", gameStart);

        resetVariables();
    }

    function gameComplete(){
        let response = true;
        for(let i = 0; i < cards.length; i++){
            if(!cards[i].paired){
                response = false;
                break;
            }
        }
        return response;
    }
};


function shuffle(p_array){ // Shuffle an return an array
    for(let i = p_array.length - 1; i >= 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [p_array[i], p_array[j]] = [p_array[j], p_array[i]];
    }
    return p_array;
}
function getOpacity(p_HTMLElement){ // Get the opacity of an HTMLElement (WARNING: set it to 1 if can't get it)
    let c_opacity = p_HTMLElement.style.opacity;
    if(c_opacity == ""){
        c_opacity = 1;
        p_HTMLElement.style.opacity = c_opacity;
    }

    return c_opacity;
}
function seconde(p_sec){ // Retourne un nombre de millisecondes correspondant aux secondes demandées
    return p_sec * 1000;
}