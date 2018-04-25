  /*/////////////
 // VARIABLES //
/////////////*/

// Liste de mot (on se servira d'une fonction pour en choisir un au hasard)
let words = [
    "amicale",
    "amirale",
    "asteroide",
    "banale",
    "bonhomme",
    "camouflage",
    "cerisier",
    "charbonniere",
    "detritus",
    "dinosaure",
    "electronique",
    "esprit",
    "florilege",
    "gonfler",
    "gorille",
    "grillage",
    "guerre",
    "horloge",
    "idiome",
    "joie",
    "klaxon",
    "lumiere",
    "manoir",
    "miroir",
    "narcotique",
    "nenuphar",
    "nicotine",
    "opacite",
    "opercule",
    "ordinateur",
    "ordinaire",
    "paradis",
    "peuple",
    "pirate",
    "pouvoir",
    "querelle",
    "restaurant",
    "service",
    "sortilege",
    "tempete",
    "union",
    "unite",
    "univers",
    "usine",
    "vampire",
    "village",
    "wagon",
    "xenophobe",
    "xylophone",
    "zebre",
];

let wordToFind;
let finded;


/*/////////////
// FUNCTIONS //
/////////////*/

let formatLetter = (letter) =>{ // Fonction pour formatter la proposition du joueur...
    // ... on récupère uniquement la première lettre (au cas où l'utilisateur en rentre plusieurs d'un coup)...
    let formatedLetter = letter.charAt(0);

    // ... on la met en majuscule (comme ça, que l'utilisateur entre une majuscule ou une minuscule, le résultat est le même)...
    formatedLetter = formatedLetter.toUpperCase();

    // ... et on retourne le résultat.
    return formatedLetter;
};

let drawHangMan = (count) => { // Fonction servant à dessiner l'échaveaux et le petit bonhomme
    let hangman;

    switch(count){
        case 0:
        hangman = "               \n                \n               \n               \n               \n               \n               \n_______________";
        break;

        case 1: 
        hangman = "               \n                \n               \n               \n               \n               \n               \n_________TTTT__";
        break;

        case 2: 
        hangman = "               \n                \n               \n               \n               \n               \n          ==   \n_________TTTT__";
        break;

        case 3: 
        hangman = "               \n                \n               \n               \n               \n          ==   \n          ==   \n_________TTTT__";
        break;

        case 4: 
        hangman = "               \n                \n               \n               \n          ==   \n          ==   \n          ==   \n_________TTTT__";
        break;

        case 5: 
        hangman = "               \n                \n               \n          ==   \n          ==   \n          ==   \n          ==   \n_________TTTT__";
        break;

        case 6: 
        hangman = "               \n                \n          ==   \n          ==   \n          ==   \n          ==   \n          ==   \n_________TTTT__";
        break;

        case 7: 
        hangman = "               \n          ==   \n          ==   \n          ==   \n          ==   \n          ==   \n          ==   \n_________TTTT__";
        break;

        case 8: 
        hangman = "__________==   \n          ==   \n          ==   \n          ==   \n          ==   \n          ==   \n          ==   \n_________TTTT__";
        break;

        case 9: 
        hangman = "__________==   \n  !       ==   \n  !       ==   \n          ==   \n          ==   \n          ==   \n          ==   \n_________TTTT__";
        break;

        default: 
        hangman = "__________==   \n  !       ==   \n  o       ==   \n -|-      ==   \n / \\      ==   \n          ==   \n          ==   \n_________TTTT__";
        break;
    }

    if(count < 10){
        hangman += " x " + (9 - count);
    }

    console.log(hangman);
};

let restart = (word) => { 
    let def = "";
    while(def.length < word.length){
        def += "_";
    }
    return def;
};

let guessLetter = () => { // Fonction pour proposer une lettre
    let letter = null;

    while(letter == null){
        letter = prompt("Proposer une lettre : ");
    }
    letter = formatLetter(letter);
    console.clear();

    for(let i = 0; i < wordToFind.length; i++){
        if( wordToFind.charAt(i) == letter ){
            finded = finded.substr(0, i) + letter + finded.substr(i + 1);
        }

    }
    console.log(finded);
    return letter;
};

let drawWord = (listOfWord) => { // Fonction pour piocher un mot au hasard dans la liste de mots passée en paramètre
    let index = Math.floor(Math.random() * listOfWord.length);
    return listOfWord[index].toUpperCase();
};

let hangman = () => { // Fonction qui fait tourner le jeu du Pendu :)
    let replay;
    
    do{
        console.clear();
        console.log("\n=====================================");
        console.log("=        Le Jeu du Pendu !          =");
        console.log("= Arriverez-vous à deviner le mot ? =");
        console.log("=====================================\n");

        wordToFind = drawWord(words);
        finded = restart(wordToFind);

        let proposals = "";
        let wrongProposals = 0;
        console.log(finded);
    
        while(finded != wordToFind && wrongProposals < 10){

            let newGuess = guessLetter();
    
            if(proposals.indexOf(newGuess) == -1){
                proposals += newGuess;

                if(wordToFind.indexOf(newGuess) == -1){
                    wrongProposals++;
                }
            }
            console.log("Déjà proposé : " + proposals);
            drawHangMan(wrongProposals);
        }
        
        if(wrongProposals < 10){ // Conditifion de victoire
            console.log("Gagné !");
            console.log("Nombre d'essai : " + proposals.length);
            console.log("Tentatives ratés : " + wrongProposals);

            alert("Félicitation, vous avez gagnée ! Le mot à deviner était bien \"" + wordToFind + "\".");
            replay = prompt("Souhaitez-vous rejouer ? [O]ui / [N]on");
            replay = formatLetter(replay);
        }
        else{ // Défaites :'(
            console.log("Perdu... Et vous voilà pendu, pauvre bonhomme que vous êtes !");
            console.log("---------------");
            console.log("Le mot à deviner était \"" + wordToFind + "\".");

            replay = prompt("Souhaitez-vous réessayer ? [O]ui / [N]on");
            replay = formatLetter(replay);
        }
    
    } while(replay == 'O');

    console.log("\n=====================================");
    console.log("=         Fin de la partie          =");
    console.log("=        Merci d'avoir joué !       =");
    console.log("=====================================\n");
}; 