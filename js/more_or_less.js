"use strict";

var moreOrLess = function moreOrLess() {
    // Fonction qui fait tourner le jeu du plus ou du moins

    // Minimum
    var min = 20;
    // Maximum
    var max = 80;

    // Le nombre à deviner
    var secretNumber = random(min, max);

    // La variable qui va stocker la proposition du joueur
    var myNumber = -1;

    //Le nombre d'essais
    var count = 0;

    // Variable qui va contenir le message à afficher
    var message = void 0;

    alert("Bienvenue étranger !\n\nTa tâche consistera à trouver un nombre compris entre " + min + " et " + max + " en faisant un minimum de proposition.\n\nBonne chance !");

    while (myNumber != secretNumber) {
        var rawPrompt = prompt("Quelle est ta proposition ?");
        myNumber = parseInt(rawPrompt);

        count++;

        message = "";

        if (myNumber > secretNumber) {
            message += "Ce n'est pas " + myNumber + ".\n";
            message += "Le nombre que nous cherchons est plus petit !";
        } else if (myNumber < secretNumber) {
            message += "Ce n'est pas " + myNumber + ".\n";
            message += "Le nombre que nous cherchons est plus grand !";
        } else if (myNumber == secretNumber) {
            message = "Bien joué ! Il s'agit bien du nombre " + secretNumber;

            if (count == 1) {
                message += "\nWhoa, incroyable ! Tu as réussi du premier coup !";
            } else if (count < 6) {
                message += "\nTu as trouvé en " + count + " coups, c'est plutôt bien joué !";
            } else if (count < 15) {
                message += "\nTu as trouvé en " + count + " coups.";
            } else if (count < 30) {
                message += "\nTu as trouvé  en " + count + " coups, je suis sûr que tu peux mieux faire.";
            } else if (count < max - min) {
                message += "\nTu as trouvé  en " + count + " coups, c'est franchement pas terrible fieu :/";
            } else {
                message += "\nTu as trouvé  en... " + count + " coups !? Tu l'as fais exprès, n'est-ce pas ?";
            }
        } else {
            message = "Que dis-tu !? \"" + rawPrompt + "\" n'est pas un nombre !";
        }

        alert(message);
    }
};

var random = function random(min, max) {
    // Fonction qui renvoit un nombre aléatoire compris entre un minimum et un maximum
    return Math.floor(Math.random() * (max - min)) + min;
};