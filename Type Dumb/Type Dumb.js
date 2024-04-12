var currentLetter = 0;
var targetWord = '';
var targetWordLength = 0;
var forbiddenLetters = '';
var totalKeypresses = 0;
var originalPhrase = '';
var statusPrefix = '';
var statusSuffix = '';

function updateTrackedWords () {
    targetWord = '';
    forbiddenLetters = getVariable('ForbiddenLetters').toUpperCase();
    
    /*Choose at random one phrase for the reward*/
    var newValidWords = getVariable('Phrases').split('\n');
    var totalWords = newValidWords.length;
    var pick = Math.random();
    pick = pick * totalWords;
    pick = Math.floor(pick);

    //TODO: Add handling for punctuation, case
        //Punctuation: consider both main key-presses in addition to shift+key-press e.g. !@#...
        //Case: will need toggle function for shift press and for caps lock. Need to consider when both are enabled
    /*Strips unhandled characters from the phrase*/
    originalPhrase = newValidWords[pick];
    targetWord = newValidWords[pick].toUpperCase().replace(/[^0-9 a-zA-Z]/gi, '');
    
    
    //Initialize variables for comparison
    targetWordLength = targetWord.length;
    totalKeypresses = 0;
    currentLetter = 0;
    findNextValidLetter();
    setVariable("currentWord", originalPhrase);
    statusPrefix = originalPhrase+": ";
    callAction({"type":"updateScript","action":"setText","text":statusPrefix+statusSuffix});

}

function onKeyPressed (key) {
    statusSuffix = '';


    /* Complexity based punishment: Punish for edits and overlong words*/
    if(key === "Space" || key === "Enter") {
        totalKeypresses = 0;
    } else if (++totalKeypresses > getVariable('KeypressThreshold')) {
        callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});
        statusSuffix = "\nShort words only! Show how dumb you are!";
    } else if ( key === "Backspace" || key === "ArrowLeft") {
        callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});
        statusSuffix = "\nDon't revise! Show how dumb you are!";
    }



    //TODO: Add handling for punctuation, case
    if (key.lastIndexOf('Key') === 0 || key.lastIndexOf('Digit') === 0 || key === 'Space') {

        key = key.replace('Key','');
        key = key.replace('Digit','');
        key = key.replace('Space',' ');
        
        
        /*Punish for typing any disallowed letter*/
        if (forbiddenLetters.lastIndexOf(key) > -1 ) {
            callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});
            statusSuffix = statusSuffix + "\nYou're not allowed to use the letter \'"+key+"\'";
        }
        
        
        /*Current keypress matches expected key in phrase*/
        if (key === targetWord.substring(currentLetter,currentLetter +1)) {
            statusPrefix = statusPrefix + key;
            statusSuffix = statusSuffix + "\nCorrect Letter";
            currentLetter++;

            /*Positive reward on a successful completion. Then choose next phrase*/            
            if (currentLetter === targetWordLength) {
                callAction({"type":"updateJob","job":"Vibrate","action":"start","restart":true});
                updateTrackedWords();
                statusSuffix = "\n\nCompleted Phrase!";
            }
            else {
                findNextValidLetter();
            }

        }
        /*Restart tracking from the beginning of the phrase if the expected letter wasn't typed*/
        else if (targetWordLength > 0) { //Ignore case where no phrases are defined
            statusPrefix = originalPhrase+": ";
            statusSuffix = statusSuffix + "\n Incorrect Letter - Start over";
            currentLetter = 0;
            findNextValidLetter();
        }

    }
    callAction({"type":"updateScript","action":"setText","text":statusPrefix+statusSuffix});
}

function findNextValidLetter() {
    while(forbiddenLetters.lastIndexOf(targetWord.substring(currentLetter,currentLetter +1)) > -1) { //Find the next 'correct' letter in the current phrase
        statusPrefix = statusPrefix + targetWord.substring(currentLetter,currentLetter +1);
        currentLetter++;
    }
    //setVariable("nextLetter", targetWord.substring(currentLetter,currentLetter+1));
}


updateTrackedWords();
