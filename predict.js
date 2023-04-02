const predictButton = document.getElementById('predictButton').addEventListener("click", function() {makePrediction()});
const inputGardensize = document.getElementById('inputGardensize');
const inputLotLen = document.getElementById('inputLotLen');
const inputLotWidth = document.getElementById('inputLotWidth');
const resultField =document.getElementById('retailValue');

const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
nn.load('./model/model.json', modelLoaded)

function modelLoaded() {
    console.log("Model loaded!")
}

async function makePrediction() {
    const predictionValues = {
        LotLen: parseInt(inputLotLen.value, 10),
        gardensize: parseInt(inputGardensize.value, 10),
        LotWidth: parseInt(inputLotWidth.value, 10)
    }
    const results = await nn.predict(predictionValues);
    console.log(`Geschatte Verkoop Prijs: ${results[0].retailvalue}`)

    currencyTransformer(results[0].retailvalue);
}

function currencyTransformer(result) {
    const fmt = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
    resultField.innerHTML = "Estimated selling price: " + fmt.format(result);
}