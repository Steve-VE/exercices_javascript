  /*///////////////////////////
 //        Variables        //
///////////////////////////*/


let rows;
let currentRow = 0;
let pieces;
let colors = ['blue', 'red', 'orange', 'green'];
let secretCode = [];
let nbreOfPieces = [0, 0, 0, 0];
let proposalCode = [-1, -1, -1, -1];


// Fonction à lancer une fois la page chargée
window.onload = () => {

    secretCode = newSecretCode();

    // On sélectionne les pièces interactives
    pieces = document.querySelectorAll(".interactive.piece");

    // On sélectionne les lignes
    rows = document.querySelectorAll(".row");
    rows[currentRow].classList.add("active");

    // Pour chacune de ces pièces...
    for(let i = 0; i < pieces.length; i++){
        // ... on ajoute un 'eventListener' sur le clique
        pieces[i].addEventListener('click', function(e){
            let value = e.target.getAttribute('data-id');
            addPiece(value);
        });
    }
};

let addPiece = (value) => { // Fonction à appeler lorsque l'on veut ajouter un nouveau pion sur la ligne
    let nextCase = document.querySelector(".row.active>.case:empty");

    if(nextCase != null){ // Ajoute la pièce dans le plateau
        
        let proposalNumber;
        // On garde en mémoire la réponse proposé par le joueur
        for(let i = 0; i < proposalCode.length; i++){
            if(proposalCode[i] == -1){
                proposalCode[i] = value;
                proposalNumber = i;
                break;
            }
        }

        // On crée la div...
        let newPiece = document.createElement("div");
        // On lui attribut ses classes CSS...
        newPiece.classList.add('piece', colors[value], 'interactive');
        // On lui attribut un titre...
        let title = document.createAttribute("title");
        title.value = "Cliquez pour supprimer";
        newPiece.setAttributeNode(title);

        let position = document.createAttribute("data-pos");
        position.value = proposalNumber;
        newPiece.setAttributeNode(position);

        newPiece.addEventListener("click", remove);
        nextCase.appendChild(newPiece);
        // Vérifie si la ligne est pleine
        // checkIfRowIsFull();
    }
};


let validation = () => { // Fonction à appeler lorsqu'une ligne est remplie afin de vérifier ce qui est correct ou non
    let nearPoints = 0;
    let validPoints = 0;
    let nbreOfPiecesProposed = [0, 0, 0, 0];

    console.log( proposalCode );
    // Vérification du nombre de bonne réponse
    for(let i = 0; i < secretCode.length; i++){
        nbreOfPiecesProposed[proposalCode[i]]++;

        if(secretCode[i] == proposalCode[i]){
            validPoints++;
        }
    }

    // Détermine le nombre de bonne pièce se trouvant au mauvais endroit
    for(let i = 0; i < nbreOfPieces.length; i++){
        for(let nbre = nbreOfPieces[i]; nbre > 0; nbre--){
            if(nbreOfPiecesProposed[i] > 0){
                nbreOfPiecesProposed[i]--;
                nearPoints++;
            }
            else{
                break;
            }
        }
    }
    nearPoints -= validPoints;

    console.log("Nbre de bonne réponse : " + validPoints);
    console.log("Nbre de bonne couleurs : " + nearPoints);
    console.log("------");

    for(let i = validPoints; i > 0; i--){
        let checkCase = rows[currentRow].querySelector(".clue:not(.valid):not(.near)");
        checkCase.classList.add("valid");
    }
    for(let i = nearPoints; i > 0; i--){
        let checkCase = rows[currentRow].querySelector(".clue:not(.valid):not(.near)");
        if(checkCase != null){
            checkCase.classList.add("near");
        }
    }
};

let checkIfRowIsFull = () => { // Vérifie si une ligne est pleine et si oui, passe à la suivante.
    if(currentRow < rows.length){
        let nextCase = document.querySelector(".row.active>.case:empty");
        if(nextCase == null){
            validation();
            
            let piecesToClean = rows[currentRow].querySelectorAll(".piece");
            for(let i = 0; i < piecesToClean.length; i++){
                piecesToClean[i].classList.remove('interactive');
                piecesToClean[i].removeEventListener("click", remove);
            }
            rows[currentRow].classList.remove("active");
            
            currentRow++;
            rows[currentRow].classList.add("active");
            
            proposalCode = [-1, -1, -1, -1];
        }
    }
};

let newSecretCode = () => { // Fonction qui génère et renvoit un nouveau code secret
    let newCode = [];
    nbreOfPieces = [0, 0, 0, 0];

    for(let i = 0; i < 4; i++){
        let randomValue =  Math.floor(Math.random() * 4);
        nbreOfPieces[randomValue]++;

        newCode.push(randomValue);
    }

    return newCode;
};

function remove(e){
    // On récupère la pièce
    let pieceToDelete = e.target;

    // On en récupère la position sur le plateau...
    let position = pieceToDelete.getAttribute("data-pos");
    // ... et on la réinitialise parmis les propositions déjà faites.
    proposalCode[position] = -1;

    // On suprime la pièce du DOM
    pieceToDelete.parentNode.removeChild(pieceToDelete);
}