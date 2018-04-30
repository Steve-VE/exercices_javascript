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
    let beginingMaxTime = seconde(50) / fps;

    let completeLevel;
    let selectedCard;
    let cards;
    let maxTime;
    let score;
    let remainingTime;
    let gameLoop;
    let scoreBoard = null;
    
    // Booleans
    let canSelectCard;   // Player can select a card ?
    let gameStarted; // Game's started ?
    let returnTimeOut; // Need to know if two revealed cards need to be returned
    let timeRunning;
    
    // HTML elements
    let gameContainer = document.querySelector(".game_container");
    let timeAmount = document.querySelector(".amount");
    let menu;
    let btnStart, btnScoreBoard, infoScore, infoTime;
    let scoreModal;
    

    init();

    // Functions

    function init(){
        console.log("Init");
        resetVariables();
        getScoreBoard();

        menu = document.createElement("div");
        menu.classList.add("menu");

        btnStart = document.createElement("div");
        btnStart.innerHTML = "<strong>Start</strong> a new <strong>Game</strong>";
        btnStart.classList.add("button-start");
        btnStart.addEventListener("click", gameStart);
        
        btnScoreBoard = document.createElement("div");
        btnScoreBoard.innerHTML = "View the <strong>Scoreboard</strong>";
        btnScoreBoard.classList.add("button-scoreboard");
        btnScoreBoard.addEventListener("click", gameStart);

        infoScore = document.getElementById("score");
        infoTime = document.getElementById("time");

        gameContainer.appendChild(menu);
        menu.appendChild(btnStart);
        menu.appendChild(btnScoreBoard);
    }
    function resetVariables(){
        gameLoop = null;
        currentLevel = 0;
        score = 0;
        completeLevel = 0;
        cards = [];

        selectedCard = [null, null];
        maxTime = beginingMaxTime;
        remainingTime = maxTime;

        canSelectCard = true;   // Player can select a card ?
        gameStarted = false; // Game's started ?
        returnTimeOut = false; // Need to know if two revealed cards need to be returned
        timeRunning = false;
    }
    function nextLevel(){
        console.log("next Level");
        if(timeRunning){
            timeRunning = false;
        }

        if(allCardsVisible()){
            if(cards.length == 0){

                if(currentLevel < levels.length - 1){
                    currentLevel++;
                }
                
                clearInterval(gameLoop);
                gameLoop = null;
                
                gameContainer.innerHTML = "";
                completeLevel++;
                score += Math.floor((remainingTime / fps) / 5);
                score += completeLevel * 2;
                selectedCard = [null, null];
                canSelectCard = true; 
                
                cards = [];
                
                remainingTime += seconde(15) / fps;
                maxTime = remainingTime;
                
                gameStart();
            }
            else{
                if(cards[0].disappear()){
                    cards.splice(0, 1);
                }
            }
        }
    }
    function gameStart(){
        console.log("Game Started !");
        if(gameLoop == null){
            timeRunning = true;
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
            // Fade out of the Start Button
            // if(getOpacity(menu) > 0){
            //     menu.style.opacity = getOpacity(btnStart) - 0.1;
            //     if(getOpacity(menu) == 0){
            //         menu.style.display = "none";
            //     } 
            // }
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
                if(gameComplete()){
                    nextLevel();
                }
                else if(timeRunning){
                    remainingTime--;
                    let percent = (( remainingTime / maxTime) * 100);
                    let secondes =  Math.round(remainingTime / fps);
                    
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
            }
            else{
                gameEnd();
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
    function gameEnd(){ // Call it when the game is over
        console.log("Game Over");
        clearInterval(gameLoop);
        gameLoop = null;

        infoTime.style.display = "none";
        // infoScore.style.display = "none";
        btnStart.style.display = "block";
        gameContainer.innerHTML = "";
        gameContainer.appendChild(btnStart);
        btnStart.style.opacity = 1;
        btnStart.addEventListener("click", gameStart);

        if(scoreModal == null || scoreModal == "undefined"){
            scoreModal = document.createElement("div");
            scoreModal.innerHTML = "Your score :\n" + score;
            let body = document.getElementsByTagName("body")[0];
            body.appendChild(scoreModal);
            console.log(body);
            console.log(scoreModal);
        }

        resetVariables();
    }
    function gameComplete(){ // Return true if all pairs were found
        let response = true;
        for(let i = 0; i < cards.length; i++){
            if(!cards[i].paired){
                response = false;
                break;
            }
        }
        return response;
    }
    function allCardsVisible(){ // Return true if all cards was fully visible (it's usefull to not change level too abrutly)
        let response = true;
        for(let i = 0; i < cards.length; i++){
            if(!cards[i].fullyVisible()){
                response = false;
                break;
            }
        }
        return response;
    }

    function getScoreBoard(){
        let request = new XMLHttpRequest();
        request.open('GET', '/assets/data/memory_card_score.json');
        request.onreadystatechange = ()=>{
            if(request.readyState == 4 && request.status == "200"){
                let data = JSON.parse(request.response);
                scoreBoard = data;
            }
        };
        request.send();
    }

    // Class

    class Card{
        constructor(p_parent, p_type){
            this.parent = p_parent;
            this.type = p_type;
            
            this.selected = false;
            this.revealed = false;
            this.paired = false;
            this.size = 1;
    
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

        fullyVisible(){
            return (this.rotateValue >= 180);
        }

        disappear(){
            if(this.size > 0.05){
                this.size *= 0.66;
                this.rotateValue += 30;
                this.HTML.style.transform = "scale(" + this.size + ") rotateY(180deg) rotateZ(" + (this.rotateValue + 180) + "deg)";
                return false;
            }
            else{
                this.HTML.style.opacity = "0";
                return true;
            }
        }
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