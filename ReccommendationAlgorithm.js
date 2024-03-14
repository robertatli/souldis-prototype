let q1 = ["Little interest or pleasure in doing things", [0,1,2,3]]
let q2 = ["Feeling down, depressed or hopeless", [0,1,2,3]]


function calculateSymptomScore(responses) {
    // responses is an array of integers corresponding to user answers
    // For example: [2, 3] for the two questions
    let score = responses.reduce((acc, current) => acc + current, 0); // Sum up the responses
    
    let category;
    if (score <= 3) {
        category = "Minimal";
    } else if (score <= 8) {
        category = "Mild";
    } else if (score <= 14) {
        category = "Moderate";
    } else {
        category = "Severe";
    }
    
    return {category, score};
}

// Example usage:
let responses = [2, 3]; // User's responses
let result = calculateSymptomScore(responses);
console.log(`Your symptom severity is categorized as ${result.category} with a score of ${result.score}.`);
