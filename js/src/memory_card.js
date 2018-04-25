window.onload = function(){
    let currentLevel = 0;
    let gameContainer = this.document.querySelector(".game_container");
    console.log(gameContainer);

    let levels = [
        [ 0, 0, 1, 1, 2 ],
        [ 0, 0, 1, 2, 3 ],
        [ 0, 1, 2, 3, 4 ],
        [ 0, 1, 1, 2, 2, 3, 3, 4, 5 ]
    ];
    let cards = [];

    for(let i = 0; i < levels[currentLevel].length; i++){
        let currentNumber = levels[currentLevel][i];

        cards.push( new Card(gameContainer, currentNumber) );
        cards.push( new Card(gameContainer, currentNumber) );
    }
    cards = shuffle(cards);
    for(let i = 0; i < cards.length; i++){
        cards[i].generateHTML();
    }
};

class Card{
    constructor(p_parent, p_type){
        this.parent = p_parent;
        this.type = p_type;
        
        this.revealed = false;
        this.peared = false;
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
        if(this.revealed){

        }
        else{
            this.HTML.classList.add(revealClass(this.type));
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
        "yellow",
        "blue",
        "red",
        "green",
        "pink",
        "purple",
        "white"
    ];
    return classConnection[type];
}