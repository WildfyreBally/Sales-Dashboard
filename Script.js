// Function to calculate the sales projection and commission
function salesProjection(target, totalDays, currentDay, currentSales) {
    const dailyTarget = target / totalDays;
    const targetByNow = dailyTarget * currentDay;
    const aheadBehind = currentSales - targetByNow;
    const dailyAverage = currentSales / currentDay;
    const remainingDays = totalDays - currentDay;
    const projectedRemaining = dailyAverage * remainingDays;
    const projectedTotal = currentSales + projectedRemaining;
    const surplusShortfall = projectedTotal - target;

    const commissionPercentage = 0.05;  // Assuming 5% commission
    const commission85Percent = projectedTotal * commissionPercentage * 0.85;  // 85% of commission
    const commission100Percent = projectedTotal * commissionPercentage;  // 100% commission

    return {
        dailyTarget: dailyTarget,
        targetByNow: targetByNow,
        currentSales: currentSales,
        difference: aheadBehind,
        dailyAverage: dailyAverage,
        projectedTotal: projectedTotal,
        surplusShortfall: surplusShortfall,
        commission85Percent: commission85Percent,
        commission100Percent: commission100Percent
    };
}

// Function to update the results on the page
function updateResults() {
    const target = parseFloat(document.getElementById("target").value);
    const currentSales = parseFloat(document.getElementById("current_sales").value);
    const currentDay = parseInt(document.getElementById("current_day").value);
    const totalDays = parseInt(document.getElementById("total_days").value);

    const results = salesProjection(target, totalDays, currentDay, currentSales);

    // Display results
    const resultList = document.getElementById("result-list");
    resultList.innerHTML = `
        <li>Daily Target: £${results.dailyTarget.toFixed(2)}</li>
        <li>Target by Day ${currentDay}: £${results.targetByNow.toFixed(2)}</li>
        <li>Current Sales: £${results.currentSales.toFixed(2)}</li>
        <li>Difference: £${results.difference.toFixed(2)}</li>
        <li>Current Daily Average: £${results.dailyAverage.toFixed(2)}</li>
        <li>Projected Total: £${results.projectedTotal.toFixed(2)}</li>
        <li>Surplus/Shortfall: £${results.surplusShortfall.toFixed(2)}</li>
        <li>85% Commission: £${results.commission85Percent.toFixed(2)}</li>
        <li>100% Commission: £${results.commission100Percent.toFixed(2)}</li>
    `;

    // Update the chart
    updateChart(results);
}

// Function to update the chart
function updateChart(results) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    const chartData = {
        labels: Array.from({ length: 30 }, (_, i) => i + 1), // Days of the month
        datasets: [{
            label: 'Projected Sales',
            borderColor: 'blue',
            data: Array.from({ length: 30 }, (_, i) => results.dailyAverage * (i + 1)),
            fill: false,
        },
        {
            label: 'Actual Sales',
            borderColor: 'orange',
            data: Array.from({ length: 30 }, (_, i) => {
                return i < currentDay ? results.currentSales : results.currentSales + (results.dailyAverage * (i - currentDay));
            }),
            fill: false,
        }]
    };

    if (window.chart) {
        window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", function() {
    // Add event listeners
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", updateResults);
    });
    
    // Initial load
    updateResults();
});
