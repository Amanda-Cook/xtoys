var debugPhrase = '';
var totalWords = 0;


/* ******************************************************************************************************
** Function: updateTrackedWords2
** Input - results from Speech Recognition {trigger-1} and {trigger-2}
** Description: Feed any input words to the scoring function
**
** Notes: This function was added to address #1 and #2 below 
**        3-5 are not addressed in this code
**
**
** Testing notes on the speech recognition block
**      1. Global trigger for a single word was not fast enough, and words would frequently be missed
**      2. Speech recognition with current pattern occasionally duplicates a word at the end of a sentence
**      3. Speech recognition occasionally inserts the word 'period' at the end of a sentence
**      4. Speech recognition may insert the word 'mark' after saying 'question'
**      5. Speech recognition may insert the word 'point' after saying 'exclaimation'
**
****************************************************************************************************** */
function updateTrackedWords2 (word1,word2) {

    //DEBUG ONLY - Used to display the word and translated string for scoring
        debugPhrase = debugPhrase+" "+word1+" "+word2;
        //debugPhrase = debugPhrase+" "+word1+" "+word2+" "+String(word1).replace(/[aeiouy']+/g,"a").replace(/[bcdfghjklmnpqrstvwxz]/g,"").replace(/^[0-9]/,"11")+" "+String(word2).replace(/[aeiouy']+/g,"a").replace(/[bcdfghjklmnpqrstvwxz]/g,"").replace(/^[0-9]/,"11");
        
        
        callAction({"type":"updateScript","action":"setText","text":debugPhrase});
    //


    scoreWord(word1);
    if (word1 != word2) { //Ignore case where Speech Recognition duplicated a word
        scoreWord(word2);
    }

}


/* ******************************************************************************************************
** Function: scoreWord
** Input - Recognied word from speech recognition block
** Description: Execute Punish job if the word is more complex than threshold
**              Otherwise, If enough words were spoken - increase the intensity
**                         Invoke the main job to keep the pleasure block alive
**
**  1. Cast input to string as most numbers are sent as a numeric value e.g. 30 instead of 'thirty'
**  2. Approximate syllable count for a word by counting the number of non-consecutive vowels
**     i.  convert all consecutive vowels to a single vowel
**     ii. drop all consonant 
**  3. If the word has a digit in it, insert an additional digit
**  4. Compare the length of the above steps against the allowed syllable limit
**  
**
****************************************************************************************************** */
function scoreWord(word) {
    var intensity =0;
    if(String(word).replace(/[aeiouy']+/g,"a").replace(/[bcdfghjklmnpqrstvwxz]/g,"").replace(/^[0-9]/,"11").length > getVariable('SyllableThreshold')) {
        callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});

    }
    else {
        intensity = getVariable('Intensity');
        if(++totalWords >= (intensity / 5) * getVariable('ProgressionMultiplier') ) {
                totalWords = 0;
                setVariable("Intensity", intensity + 5);
        }
        callAction({"type":"updateJob","job":"Main","action":"start","restart":true});
    }
    
    
}