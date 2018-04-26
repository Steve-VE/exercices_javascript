let selectedCard = [null, null];
let canSelectCard = true;
let revealSpeed = 10;

window.onload = function(){
    let cards = [];
    let currentLevel = 0;
    let gameContainer = this.document.querySelector(".game_container");

    let levels = [
        [ 0, 1, 2, 3, 4, 5, 6, 7 ],
        [ 0, 0, 1, 1, 2 ],
        [ 0, 0, 1, 2, 3 ],
        [ 0, 1, 2, 3, 4 ],
        [ 0, 1, 1, 2, 2, 3, 3, 4, 5 ]
    ];

    for(let i = 0; i < levels[currentLevel].length; i++){
        let currentNumber = levels[currentLevel][i];

        cards.push( new Card(gameContainer, currentNumber) );
        cards.push( new Card(gameContainer, currentNumber) );
    }
    cards = shuffle(cards);
    for(let i = 0; i < cards.length; i++){
        cards[i].generateHTML();
    }


    let gameLoop = window.setInterval(update, 33);

    function update(){
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
            }
            else if(cardA.rotateValue >= 180 && cardB.rotateValue >= 180){ // Bad pair...
                cardA.reverse();
                cardB.reverse();
                selectedCard = [null, null];
                canSelectCard = true;
            }
        }
    }
};

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
        // console.log(this.type);
        if(canSelectCard){
            if(!this.revealed){
                this.selected = true;
                
                if(selectedCard[0] == null){
                    selectedCard[0] = this;
                }
                else if(selectedCard[1] == null){
                    selectedCard[1] = this;
                    canSelectCard = false;
                }
            }
        }
    }

    reverse(){
        this.selected = false;
        // this.revealed = false;
        // this.HTML.classList.remove(revealClass(this.type));
    }

    update(){
        if(this.selected){
            if(this.rotateValue < 180){
                this.rotateValue += revealSpeed;
                this.HTML.style.transform = "rotateY(" + this.rotateValue + "deg)";
            }

            if(this.revealed == false){

                if(this.rotateValue == 90){
                    this.revealed = true;
                    this.HTML.classList.add(revealClass(this.type));
                }
            }
        }
        else if(this.revealed){
            if(this.rotateValue > 0){
                this.rotateValue -= revealSpeed;
                this.HTML.style.transform = "rotateY(" + this.rotateValue + "deg)";

                if(this.rotateValue == 90){
                    this.HTML.classList.remove(revealClass(this.type));
                }
            }
            else{
                this.revealed = false;
            }
        }
    }
}


function shuffle(p_array){
    for(let i = p_array.length - 1; i >= 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [p_array[i], p_array[j]] = [p_array[j], p_array[i]];
    }
    return p_array;
}

function revealClass(type){
    let classConnection = [
        "green",
        "white",
        "blue",
        "yellow",
        "brown",
        "red",
        "pink",
        "gray"
    ];
    return classConnection[type];
}