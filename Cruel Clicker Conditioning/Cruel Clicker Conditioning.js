function rollOdds(RewardChance,PunishmentChance,AllowMultipleStimuli,AllowNullStimuli) {
    var rewardDie;
    var punishDie;
    
    rewardDie = Math.floor(Math.random() * 100);
    punishDie = Math.floor(Math.random() * 100);    
    
    if (AllowMultipleStimuli =="Multiple Allowed" && AllowNullStimuli == "Enabled") {
        //Indepentently check to see if each stimulus should be triggered.
        if (rewardDie < RewardChance) {
            callAction({"type":"updateJob","job":"Reward","action":"start","restart":true});
        }
        if (punishDie < PunishmentChance) {
            callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});
        } 

    
    } else if (AllowMultipleStimuli =="Multiple Allowed" && AllowNullStimuli == "Disabled") {
        //Requires 1 or more stimuli to be triggered
        if ((rewardDie > RewardChance) && (punishDie > PunishmentChance)) {

            //Handles case where neither stimuli would have been activated. Chooses based on which outcome is 'closer'
            if ((rewardDie - RewardChance) < (punishDie - PunishmentChance)) {
                callAction({"type":"updateJob","job":"Reward","action":"start","restart":true});
            }
            else if ((rewardDie - RewardChance) > (punishDie - PunishmentChance)) {
                callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});
            } else {
                //TODO: Consider if a wider range should be accepted for triggering both stimuli
                callAction({"type":"updateJob","job":"Reward","action":"start","restart":true});
                callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});
            }
        } else {
            //Indepentently check to see if each stimulus should be triggered.
            if (rewardDie < RewardChance) {
                callAction({"type":"updateJob","job":"Reward","action":"start","restart":true});
            }
            if (punishDie < PunishmentChance) {
                callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});
            }             
        }
        
        
        
    } else if (AllowMultipleStimuli =="Single Only" && AllowNullStimuli == "Enabled") {
        //Cascading checks to see if stimulus should be activated. 
        if (rewardDie < RewardChance) {
            callAction({"type":"updateJob","job":"Reward","action":"start","restart":true});
        }
        else if (punishDie < PunishmentChance) {
            callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});
        } 
        
        
    } else if (AllowMultipleStimuli =="Single Only" && AllowNullStimuli == "Disabled") {
        if (rewardDie < RewardChance) {
            callAction({"type":"updateJob","job":"Reward","action":"start","restart":true});
        }
        else {
            callAction({"type":"updateJob","job":"Punish","action":"start","restart":true});
        } 
        
    }

    
    
    
}
