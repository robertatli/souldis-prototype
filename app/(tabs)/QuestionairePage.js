import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuestionnairePage = ({ navigation }) => {
    const questions = [
        { question: "Little interest or pleasure in doing things", options: [0, 1, 2, 3] },
        { question: "Feeling down, depressed or hopeless", options: [0, 1, 2, 3] }
    ];

    const [responses, setResponses] = useState(Array(questions.length).fill(0));

    const handleSelectOption = (questionIndex, option) => {
        const newResponses = [...responses];
        newResponses[questionIndex] = option;
        setResponses(newResponses);
    };

    const calculateSymptomScore = (responses) => {
        let score = responses.reduce((acc, current) => acc + current, 0);
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
        return { category, score };
    };

    const handleSubmit = () => {
        const result = calculateSymptomScore(responses);
        console.log(`Your symptom severity is categorized as ${result.category} with a score of ${result.score}.`);
        // Here you might want to navigate to a different screen with the result
        // For example: navigation.navigate('ResultScreen', { result });
    };

    return (
        <View style={styles.container}>
            {questions.map((q, index) => (
                <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{q.question}</Text>
                    {q.options.map((option, oIndex) => (
                        <TouchableOpacity key={oIndex} style={styles.optionButton} onPress={() => handleSelectOption(index, option)}>
                            <Text>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    questionContainer: {
        marginBottom: 20,
    },
    questionText: {
        marginBottom: 10,
    },
    optionButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 5,
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 10,
    }
});

export default QuestionnairePage;
