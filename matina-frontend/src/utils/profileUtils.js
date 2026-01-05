export const calculatePersonalityTraits = (personality) => {
    const scores = { love: 50, care: 50, cute: 50 };

    // Care Score
    if (personality.q1_care === 'Listen and support') scores.care = 100;
    else if (personality.q1_care === 'Try to cheer them up') scores.care = 60;
    else if (personality.q1_care === 'Give them space') scores.care = 20;

    // Love Score
    if (personality.q2_love === 'A fancy, planned dinner') scores.love = 100;
    else if (personality.q2_love === 'A spontaneous adventure') scores.love = 70;
    else if (personality.q2_love === 'Chilling at home') scores.love = 40;
    
    // Cute Score
    if (personality.q3_cute === 'Goofy and playful') scores.cute = 100;
    else if (personality.q3_cute === 'Sarcastic and witty') scores.cute = 70;
    else if (personality.q3_cute === 'I am more serious') scores.cute = 20;

    return scores;
};