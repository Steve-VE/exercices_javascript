'use strict';

/*///////////////////////////
//        Variables        //
///////////////////////////*/

var rows = void 0;
var currentRow = 0;
var pieces = void 0;
var colors = ['green', 'red', 'blue', 'orange'];
var secretCode = [];
var nbreOfPieces = [0, 0, 0, 0];
var proposalCode = [-1, -1, -1, -1];
var gameFinished = false;

// Fonction à lancer une fois la page chargée
window.onload = function () {

    secretCode = newSecretCode();

    // On sélectionne les pièces interactives
    pieces = document.querySelectorAll(".interactive.piece");

    // On sélectionne les lignes
    rows = document.querySelectorAll(".row");
    rows[currentRow].classList.add("active");

    // Pour chacune de ces pièces...
    for (var i = 0; i < pieces.length; i++) {
        // ... on ajoute un 'eventListener' sur le clique
        pieces[i].addEventListener('click', function (e) {
            var value = e.target.getAttribute('data-id');
            addPiece(value);
        });
    }
};

window.addEventListener('keydown', function (e) {
    console.log(e.key);
    if (e.key) {
        checkIfRowIsFull();
    }
});

var addPiece = function addPiece(value) {
    // Fonction à appeler lorsque l'on veut ajouter un nouveau pion sur la ligne
    var nextCase = document.querySelector(".row.active>.case:empty");

    if (nextCase != null) {
        // Ajoute la pièce dans le plateau

        var proposalNumber = void 0;
        // On garde en mémoire la réponse proposé par le joueur
        for (var i = 0; i < proposalCode.length; i++) {
            if (proposalCode[i] == -1) {
                proposalCode[i] = value;
                proposalNumber = i;
                break;
            }
        }

        // On crée la div...
        var newPiece = document.createElement("div");
        // On lui attribut ses classes CSS...
        // newPiece.classList.add('piece', colors[value], 'interactive'); // Pas supporter par IE
        newPiece.classList.add('piece');
        newPiece.classList.add(colors[value]);
        newPiece.classList.add('interactive');
        // On lui attribut un titre...
        var title = document.createAttribute("title");
        title.value = "Cliquez pour supprimer";
        newPiece.setAttributeNode(title);

        var position = document.createAttribute("data-pos");
        position.value = proposalNumber;
        newPiece.setAttributeNode(position);

        newPiece.addEventListener("click", remove);
        nextCase.appendChild(newPiece);
        // Vérifie si la ligne est pleine
        // checkIfRowIsFull();
    }
};

var validation = function validation() {
    // Fonction à appeler lorsqu'une ligne est remplie afin de vérifier ce qui est correct ou non
    var nearPoints = 0;
    var validPoints = 0;
    var nbreOfPiecesProposed = [0, 0, 0, 0];

    // Vérification du nombre de bonne réponse
    for (var i = 0; i < secretCode.length; i++) {
        nbreOfPiecesProposed[proposalCode[i]]++;

        if (secretCode[i] == proposalCode[i]) {
            validPoints++;
        }
    }
    // On les affiche en HTML
    for (var _i = validPoints; _i > 0; _i--) {
        var checkCase = rows[currentRow].querySelector(".clue:not(.valid):not(.near)");
        checkCase.classList.add("valid");
    }

    if (validPoints < 4) {
        // Détermine le nombre de bonne pièce se trouvant au mauvais endroit
        for (var _i2 = 0; _i2 < nbreOfPieces.length; _i2++) {
            for (var nbre = nbreOfPieces[_i2]; nbre > 0; nbre--) {
                if (nbreOfPiecesProposed[_i2] > 0) {
                    nbreOfPiecesProposed[_i2]--;
                    nearPoints++;
                } else {
                    break;
                }
            }
        }
        nearPoints -= validPoints;
        // On les affiche en HTML
        for (var _i3 = nearPoints; _i3 > 0; _i3--) {
            var _checkCase = rows[currentRow].querySelector(".clue:not(.valid):not(.near)");
            if (_checkCase != null) {
                _checkCase.classList.add("near");
            }
        }
    } else {
        gameFinished = true;
        alert("Tu as craqué le code secret, bravo à toi, Maître de l'Esprit !");
    }
};

var checkIfRowIsFull = function checkIfRowIsFull() {
    // Vérifie si une ligne est pleine et si oui, passe à la suivante.
    if (currentRow < rows.length) {
        var nextCase = document.querySelector(".row.active>.case:empty");
        if (nextCase == null) {
            validation();

            var piecesToClean = rows[currentRow].querySelectorAll(".piece");
            for (var i = 0; i < piecesToClean.length; i++) {
                piecesToClean[i].classList.remove('interactive');
                piecesToClean[i].removeEventListener("click", remove);
                piecesToClean[i].removeAttribute("title");
            }
            rows[currentRow].classList.remove("active");

            // On passe à la ligne suivante (s'il y en a une)
            if (currentRow < rows.length - 1) {
                currentRow++;
                rows[currentRow].classList.add("active");

                proposalCode = [-1, -1, -1, -1];
            }
        }
    }
};

var newSecretCode = function newSecretCode() {
    // Fonction qui génère et renvoit un nouveau code secret
    var newCode = [];
    nbreOfPieces = [0, 0, 0, 0];

    for (var i = 0; i < 4; i++) {
        var randomValue = Math.floor(Math.random() * 4);
        nbreOfPieces[randomValue]++;

        newCode.push(randomValue);
    }

    return newCode;
};

function remove(e) {
    // Retire la pièce sur laquelle on a cliqué
    // On récupère la pièce
    var pieceToDelete = e.target;

    // On en récupère la position sur le plateau...
    var position = pieceToDelete.getAttribute("data-pos");
    // ... et on la réinitialise parmis les propositions déjà faites.
    proposalCode[position] = -1;

    // On suprime la pièce du DOM
    pieceToDelete.parentNode.removeChild(pieceToDelete);
}
function removeAll() {
    // Retire toutes les pièces de la lignes actives
    if (rows[currentRow] != null && rows[currentRow].classList.contains("active")) {
        var piecesToClean = rows[currentRow].querySelectorAll(".piece");
        console.log(piecesToClean);

        for (var i = piecesToClean.length - 1; i >= 0; i--) {
            var currentPiece = piecesToClean[i];
            currentPiece.parentNode.removeChild(currentPiece);
        }

        proposalCode = [-1, -1, -1, -1];
    }
}

var draw_function = window.setInterval(draw, 1000 / 12);

function draw() {
    // console.log("-- draw function");
    // console.log(buttonsPressed);

    gamepadUpdateHandler();

    if (gamepadButtonPressedHandler(0)) {
        // A
        addPiece(0);
    } else if (gamepadButtonPressedHandler(1)) {
        // B
        addPiece(1);
    } else if (gamepadButtonPressedHandler(2)) {
        // X
        addPiece(2);
    } else if (gamepadButtonPressedHandler(3)) {
        // Y
        addPiece(3);
    } else if (gamepadButtonPressedHandler(8)) {
        // Select
        removeAll();
    } else if (gamepadButtonPressedHandler(9)) {
        // Start
        checkIfRowIsFull();
    }
}