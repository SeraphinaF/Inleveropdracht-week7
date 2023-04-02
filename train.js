import { createChart, updateChart } from "./scatterplot.js"

let saveButton = document.getElementById('saveButton').addEventListener("click", function() {saveModel(nn)});
function loadData(){
    Papa.parse("./data/utrecht-houseprices.csv", {
        download:true,
        header:true, 
        dynamicTyping:true,
        complete: results => checkData(results.data)
    })
}

function checkData(data) {
    data.sort(() => (Math.random() - 0.5))
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    const chartdata = trainData.map(house => ({
        x: house.gardensize,
        y: house.retailvalue,
    }))

    console.log(chartdata)
    createChart(chartdata, "gardensize", "retailvalue")

    neuralNetwork(trainData, testData);
}

function neuralNetwork(trainData, testData) {
    const nn = ml5.neuralNetwork({ task: 'regression', debug: true })
    for (let house of trainData) {
        nn.addData({ gardensize: house.gardensize, LotLen: house.LotLen, LotWidth: house.LotWidth }, { retailvalue: house.retailvalue })
    }
    nn.normalizeData()
    
    nn.train({ epochs: 10 }, () => finishedTraining(nn, testData)) 
}

async function finishedTraining(nn, testData){
    console.log("Finished training!")

    makePrediction(nn, testData);
}

async function makePrediction(nn, testData) {
    const testHouse = { gardensize: testData[0].gardensize, LotLen: testData[0].LotLen, LotWidth: testData[0].LotWidth }
    const results =  await nn.predict(testHouse);
    console.log(`Geschatte Verkoop Prijs: ${results[0].retailvalue}`)

    let predictions = []
    for (let i = 0; i < testData.length; i += 1) {
        const prediction = await nn.predict({ gardensize: testData[i].gardensize, LotLen: testData[i].LotLen, LotWidth: testData[i].LotWidth })
        predictions.push({x: testData[i].gardensize, y: prediction[0].retailvalue})
    }
    
    updateChart("Predictions", predictions)
}

function saveModel(nn) {
    nn.save()
}
loadData();