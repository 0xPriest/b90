
var pollingInterval; // Variable to hold the interval ID
var previousCO2 = 0; // Variable to store previous CO2 level

function fetchData() {
    const sensorId = document.getElementById('sensorId').value;
    if (!sensorId) {
        document.getElementById('result').innerHTML = '<p>Please enter a sensor ID.</p>';
        return;
    }
    fetch(`/data/${sensorId}`)
        .then(response => response.json())
        .then(data => {
            const payload = data.payload;
            const currentCO2 = payload.mq2_1;
            document.getElementById('result').innerHTML = `
                <table>
                    <tr><th>ID</th><td>${payload.id}</td></tr>
                    <tr><th>CO2 Levels</th><td class="${currentCO2 <= 2 ? 'danger' : ''}">${currentCO2} PPM</td></tr>
                    <tr><th>Temperature</th><td>${payload.temperature} ${payload.temperatureUnit}</td></tr>
                    <tr><th>Humidity</th><td>${payload.humidity}%</td></tr>
                    <tr><th>Dew Point</th><td>${payload.dewPoint}</td></tr>
                    <tr><th>Date</th><td>${payload.timestamp.split('T')[0]}</td></tr>
                    <tr><th>Time</th><td>${payload.timestamp.replace('T', ' ').substring(11, 19)}</td></tr>
                </table>
            `;
            if (currentCO2 - previousCO2 >= 5) {
                sendWebhook(`There was a sudden increase from ${previousCO2} to ${currentCO2} PPM if levels persist to increase, please contact someone`);
            }
            previousCO2 = currentCO2;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('result').textContent = 'Failed to fetch data.';
        });
}

function startPolling() {
    fetchData(); // Fetch immediately
    clearInterval(pollingInterval); // Clear existing interval if any
    pollingInterval = setInterval(fetchData, 6000); // Set up the polling every 5 seconds
}

function sendWebhook(message) {
    const webhookUrl = 'https://discord.com/api/webhooks/1235291903856214036/ZW-kzdFSDh9G3lCG_BlCVQGTZtqm0SI-C28ueFv3PPjVcIsuzRvAOSY3zgHVMy-szW0S';
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message })
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send webhook:', response.status);
        }
    })
    .catch(error => {
        console.error('Error sending webhook:', error);
    });
}


