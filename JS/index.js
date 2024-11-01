/*///////////////////////////////////////////////////////////////////////
                     LES VARIABLES DU QUIZ
///////////////////////////////////////////////////////////////////////*/
// Extraits audio à utiliser dans l'interface du quiz
let audio = {
    succes: new Audio("media/audio/succes.mp3"),
    echec: new Audio("media/audio/echec.mp3"),
    click: new Audio("media/audio/click.wav"),
    // ambiance: new Audio("media/audio/audio.mp3")
};

/**
 * ACCEUIL
 */

let animDebut = document.querySelector(".animDebut");

let zoneAcceuil = document.querySelector(".intro");

// Titre et thème animé du quiz
let titreIntro = document.querySelector(".titreQuiz");
let themeIntro = document.querySelector(".themeQuiz");

// Bouton du début du quiz
let btnIntroQuiz = document.querySelector(".commencerQuiz");

/**
 * QUIZ
 */
// Numéro de la question courante
let noQuestion = 0; 

// emplacement du numéro de la question
let questionNum = document.querySelector(".noQuestion");

// Nombre de réponses justes
let nombreReponsesJustes = 0;

// Barre d'avancement du quiz
let barreAvancement = document.querySelector(".barreDavancement");

// Largeur de la barre à tout moment (initialement 0)
let largeurBarre = 0;

// Cible de largeur pour chaque étape d'avancement du quiz (calculée selon
// la progression dans les questions et le nombre total de questions)
let largeurCibleBarre = 0;

// Zone d'affichage du quiz
let zoneQuiz = document.querySelector(".quiz");

// Section contenant une question du quiz et sa position sur l'axe des X
let sectionQuestion = document.querySelector(".quiz > header");
let positionX = 100;

// Conteneurs des titres des questions et des choix de réponse
let titreQuestion = document.querySelector(".question");
let lesChoixDeReponses = document.querySelector(".choixDeReponse");

/**
 * RÉSULTAT
 */

let historique = recupererHistorique();

// Zone de resultat du quiz
let zoneResultat = document.querySelector(".resultat");

let letop = document.querySelector(".top");

// Bouton servant à recommencer le quiz
let btnRecommencer = document.querySelector(".btnRecommencer");

// Bouton servant à retouner à la page d'Acceuil
let btnAcceuil = document.querySelector(".btnAcceuil");

// Le texte du quiz fini
let quizFini = document.querySelector(".quizFini");

// Zone de Score 
let score = document.querySelector(".score");

// Pointage obtenu
let point = document.querySelector(".point");

// Temps obtenu
let temps = document.querySelector(".temps");

// Differents messages 
let messageResultat = document.querySelector(".messageResultat");
let messageNbrePartie = document.querySelector(".messageNbrePartie");



let lesPointages = document.querySelectorAll(".pointage");
    
message = {
    Bravo: "Incroyable, vous avez trouvé toutes les bonnes réponses!",
    Presque: "Bravo, vous avez presque tout bon!",
    Bon: "Cool! vous avez eu un bon résultat!",
    Moitie: "D'accord, vous avez au moins la moitié",
    Bas: "Bien essayer. Meilleur chance peut-être!",
    Rate: "Dommage, vous avez trouvé aucune bonne réponse",
};
/*///////////////////////////////////////////////////////////////////////
                            ÉVÉNEMENTS
///////////////////////////////////////////////////////////////////////*/
// Gérer la fin de l'animation d'intro
// titreIntro.addEventListener("animationend", introductionDuQuiz);

// Gestion du bouton de redémarrage du quiz (à la fin du quiz)
btnIntroQuiz.addEventListener("click", commencerLeQuiz);

btnRecommencer.addEventListener('click', recommencer);

// Gestion du bouton de redémarrage du quiz (à la fin du quiz)
btnAcceuil.addEventListener('click', RetourAcceuil);

window.addEventListener("click", sonClick);

/*///////////////////////////////////////////////////////////////////////
                            LES FONCTIONS
///////////////////////////////////////////////////////////////////////*/

animDebut.style.display = "flex";
zoneAcceuil.style.display = "none";
zoneQuiz.style.display = "none";
zoneResultat.style.display = "none";
// Page d'acceuil du Jeu
animDebut .addEventListener("animationend", introductionDuQuiz);

function sonClick(event) {
    let click = "click";
    audio[click].play();
}

function introductionDuQuiz(event) {
    //On affiche la consigne si c'est la fin de la deuxième animation: etirer-mot
    if (event.animationName == "screen-gameboy-text") {

        //On met un écouteur sur la fenêtre pour enlever l'intro et commencer le quiz
        animDebut.style.display = "none";
        zoneAcceuil.style.display = "flex";
        zoneQuiz.style.display = "none";
        zoneResultat.style.display = "none";
    }
    
    
}

// Transition pour passer de l'interface d'introduction à l'interface du quiz.
function commencerLeQuiz() {
    // [CODE LOCALSTORAGE]
    // (date formatée, et un tableau des réponses vide pour le moment) 
    historique.push({date: new Date().toLocaleDateString('fr-CA'), reponses:[]});

    // Modifier la valeur stockée dans localStorage
    sauvegarderHistorique(historique);

    console.log("le quiz commmence");
    //On enlève le conteneur de l'intro
    // let intro = document.querySelector("main.intro");
    // intro.parentNode.removeChild(intro);
    zoneAcceuil.style.display = "none";
    //On enlève l'écouteur qui gère le début du quiz
    window.removeEventListener("click", commencerLeQuiz);

    //On met le conteneur du quiz visible
    zoneQuiz.style.display = "flex";

    //On affiche la première question
    afficherQuestion();

    let ambiance = 'ambiance';
    
        audio[ambiance].play();
     
}

// Afficher la question courante.
function afficherQuestion() {
    
     //Récupérer l'objet de la question en cours
     let objetQuestion = questionnaire[noQuestion];
     //console.log(objetQuestion);
 
     //On affiche le titre de la question
     questionNum.innerText = "Question n."+ (noQuestion + 1);
     titreQuestion.innerText = objetQuestion.titre;
 
     //On crée et on affiche les balises des choix de réponse
     //Mais d'abord on enlève le contenu actuel
     lesChoixDeReponses.innerHTML = "";
 
     let unChoix;
     for (let i = 0; i < objetQuestion.choix.length; i++) {
         //On crée la balise et on y affecte une classe CSS
         unChoix = document.createElement("div");
         unChoix.classList.add("choix");
         unChoix.classList.add("toucheAnime");
         //On intègre la valeur du choix de réponse
         unChoix.innerText = objetQuestion.choix[i];
 
         //On affecte dynamiquement l'index de chaque choix
         unChoix.indexChoix = i;
 
         //On met un écouteur pour vérifier la réponse choisie
         unChoix.addEventListener("mousedown", verifierReponse);
 
         //Enfin on affiche ce choix
         lesChoixDeReponses.appendChild(unChoix);
     }
 
     // Modifier la valeur de la position de la section sur l'axe des X 
    // pour son animation
    positionX = 100;

    //Partir la première requête pour l'animation de la section
    requestAnimationFrame(animerSection);

    // Fixer la largeur cible de la barre d'avancement (en proportion du nombre
    // de questions disponibles, et du numéro de la question à venir)
    largeurCibleBarre = (noQuestion + 1) / questionnaire.length * 100;
 
     //Partir la première requête pour l'animation de la section
     requestAnimationFrame(animerBarreAvancement);
}

// Animation de la barre de défillement du quiz.
function animerBarreAvancement() {
    // Modifier la largeur de la barre d'avancement en l'augmentant de 1vw à 
    // chaque appel de cette fonction 
    largeurBarre++;
    barreAvancement.style.width = `${largeurBarre}vw`;
    console.log("largeur cible barre", largeurCibleBarre);

    if (largeurBarre < largeurCibleBarre) {
        requestAnimationFrame(animerBarreAvancement);
    }
}

// Animation de l'arrivée de la section
function animerSection() {
    //On décrémente la position de 2
    positionX -= 2;
    sectionQuestion.style.transform = `translateX(${positionX}vw)`;

    //On part une autre requête  d'animation si la position n'est pas atteinte
    if (positionX > 0) {
        requestAnimationFrame(animerSection);
    }
}

// Verification de la réponse et gérer la transition à la question suivante.
function verifierReponse(event) {
    lesChoixDeReponses.classList.toggle('desactiver');
    
    if (event.target.indexChoix == questionnaire[noQuestion].bonneReponse) {
        event.target.classList.add("reponseSucces");
        let etatVerif = 'succes';
        event.target.style.background = "green";
        audio[etatVerif].play();
        // + 1 bonneReponse
        nombreReponsesJustes++;
        console.log("bonne reponse juste : ", nombreReponsesJustes );

        console.log("Bonne réponse detecter");
    } else {
        event.target.classList.add("reponseEchec");
        event.target.style.background = "red";
        let etatVerif = 'echec';
        audio[etatVerif].play();
        console.log("Mauvaise réponse détecter");
    }

    historique[historique.length-1].reponses.push(event.target.indexChoix);
    // On sauvegarde le nouvel historique dans localStorage.
    sauvegarderHistorique(historique);
    
    event.target.addEventListener("animationend", gererProchaineQuestion);
    
    
}

// Transition pour passer d'une question à l'autre jusqu'à la fin du quiz.
function gererProchaineQuestion(event) {
    // On réactive les clics sur les choix de réponse
    lesChoixDeReponses.classList.toggle('desactiver');

    // On incrémente noQuestion pour la  prochaine question à afficher
    noQuestion++;

    //S'il reste une question on l'affiche, sinon c'est la fin du quiz...
    if (noQuestion < questionnaire.length) {
        afficherQuestion();
    } else {
        afficherFinQuiz();
    }
}

// Afficher l'interface de la fin du quiz.
function afficherFinQuiz() {

    // audio[ambiance].pause();
    
    // Retirer la zone du quiz de l'affichage
    zoneQuiz.style.display = "none";

    point.innerText = nombreReponsesJustes + " Points durant le quiz ";
    temps.innerText = "date du quiz : " + new Date().toLocaleDateString('fr-CA');

    if(nombreReponsesJustes == 10){
        messageResultat.innerHTML = message.Bravo;
    }else if(nombreReponsesJustes == 9){
        messageResultat.innerHTML = message.Presque;
    }else if(nombreReponsesJustes => 6 && nombreReponsesJustes <= 8 ){
        messageResultat.innerHTML = message.Bon;
    }else if(nombreReponsesJustes == 5){
        messageResultat.innerHTML = message.Moitie;
    }else if(nombreReponsesJustes => 1 && nombreReponsesJustes <= 4){
        messageResultat.innerHTML = message.Bas;
    }else{
        messageResultat.innerHTML = message.Rate;
    }

  // [CODE LOCALSTORAGE]
    // Obtenir la dernière version sauvegardée de l'historique
    historique = recupererHistorique();
    let nombreParties = historique.length;
    // letop = document.createElement("p");
    messageNbrePartie.innerHTML = `<p>Nombre de partie(s) jouée(s) : ${nombreParties}</p>`;
    // zoneResultat.innerHTML += `<p>Liste des réponses à toutes les parties jouées : </p>`;
    for(let partie of historique) {
        letop.innerHTML += `Date : ${partie.date} / ${nombreReponsesJustes} bonnes réponses <br>`;
    }


  // Remettre dans l'affichage la zone de "fin du quiz"
  zoneResultat.style.display = "flex";

 }

function recupererHistorique(){
    // On vérifie s'il y a un historique dans localStorage
    let histChaine = window.localStorage.getItem('super-quiz-historique');
    // On retourne l'historique décodé en JS ou un tableau vide
    // Remqrquez l'utilisation de l'opérateur OU au lieu d'une conditionnelle if..else
    return JSON.parse(histChaine) || [];
}

// Sauvegarde l'historique du quiz dans localStorage.
function sauvegarderHistorique() {
    window.localStorage.setItem('super-quiz-historique', JSON.stringify(historique));
}

// Afficher le top 5 des résultats quiz.
function name() {
    
}

// Modifier l'opacité des boutons.
function afficherBtnRecommencerEtAcceuil() {
    btnRecommencer.style.opacity = '1';
    btnAcceuil.style.opacity = "1";
}

// Recommencer le quiz.
function recommencer() {
    zoneAcceuil.style.display = "none";
    zoneQuiz.style.display = "flex";
    zoneResultat.style.display = "none";
    noQuestion = 0; 
    nombreReponsesJustes = 0;
    largeurBarre = 0;
    largeurCibleBarre = 0;
    commencerLeQuiz()
}

// Retourner à la page d'acceuil.
function RetourAcceuil() {
    zoneAcceuil.style.display = "flex";
    zoneQuiz.style.display = "none";
    zoneResultat.style.display = "none";
    noQuestion = 0; 
    nombreReponsesJustes = 0;
    largeurBarre = 0;
    largeurCibleBarre = 0;
}