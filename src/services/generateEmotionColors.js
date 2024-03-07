import { getValenceFromEmotion } from "nexa-js-sentimotion-mapper";

export function generateEmotionColors(emotions) {



    // Retrieve valence for each emotion and store in an object
    const valences = emotions.reduce((acc, emotion) => {
        acc[emotion] = getValenceFromEmotion(emotion);
        return acc;
    }, {});

    // Define a sorting function that compares the valences of two emotions
    const compareValences = (a, b) => {
        const valenceOrder = { "pos": 1, "neu": 2, "neg": 3 };
        const valenceA = valences[a] ? valenceOrder[valences[a]] : 0; // Fallback to 0 if undefined
        const valenceB = valences[b] ? valenceOrder[valences[b]] : 0; // Fallback to 0 if undefined
        return valenceA - valenceB;
    };

    // Sort the emotions array based on their valences
    const sortedEmotions = [...emotions].sort(compareValences);

    const colors = {};
    const hueStep = 360 / sortedEmotions.length;
    const alpha = 0.8;  // Set the desired opacity level

    sortedEmotions.forEach((emotion, index) => {
        const hue = index * hueStep;
        const lightness = valences[emotion] === "neg" ? "35%" : valences[emotion] === "pos" ? "65%" : "50%";
        const saturation = valences[emotion] === "neu" ? "0%" : "80%";

        colors[emotion] = `hsla(${hue}, ${saturation}, ${lightness}, ${alpha})`;
    });

    return colors;
}
