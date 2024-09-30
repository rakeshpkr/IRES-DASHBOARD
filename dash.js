async function fetchData() {
    try {
        const response = await fetch('https://2peg9jbx36.execute-api.us-east-1.amazonaws.com/default/IRES_lambda'); // Replace with your Lambda endpoint
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log the fetched data for debugging
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('data-output').innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
}

function updateDashboard(data) {
    const dataOutput = document.getElementById('data-output');
    const alertsList = document.getElementById('alerts-list');
    const energySource = document.getElementById('energy-source');

    // Clear previous data
    dataOutput.innerHTML = '';
    alertsList.innerHTML = '';
    energySource.innerText = '';

    // Check if the data is defined and valid
    if (data && data.message === "Data processed successfully!") {
        dataOutput.innerHTML = `
            <p><strong>Temperature:</strong> ${data.Temperature} °C</p>
            <p><strong>Humidity:</strong> ${data.Humidity} %</p>
            <p><strong>Wind:</strong> ${data.Wind} km/h</p>
            <p><strong>Solar:</strong> ${data.Solar} kW</p>
            <p><strong>Precipitation:</strong> ${data.Precipitation} mm</p>
        `;

        // Update alerts
        if (data.Alerts && data.Alerts.length > 0) {
            data.Alerts.forEach(alert => {
                const li = document.createElement('li');
                li.textContent = alert;
                alertsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No alerts.';
            alertsList.appendChild(li);
        }

        // Update recommended energy source
        energySource.innerText = data['Recommended Energy Source'] || 'No source recommended.';
    } else {
        dataOutput.innerHTML = '<p>Error: No data available.</p>';
    }
}



// Event listener for refresh button
document.getElementById('refresh-btn').addEventListener('click', fetchData);

// Initial data fetch
fetchData();
