const recommendation = document.getElementById("recommendationResults");
const btnSearch = document.getElementById('btnSearch');


/*
    fetch('./travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching data:', error));
*/
function searchDestinations() {
    const input = document.getElementById('conditionInput').value.trim().toLowerCase();
    const resultDiv = document.getElementById('recommendationResults');
    resultDiv.innerHTML = ''; // Clear previous results

    fetch('./travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            // Gather all possible destinations into one array
            const beachList = data.beaches || [];
            const templeList = data.temples || [];
            // Flatten all cities from all countries
            const countryCities = (data.countries || []).flatMap(country => country.cities.map(city => ({
                ...city,
                country: country.name // Optionally keep the country name
            })));

            // Combine all destinations
            const allDestinations = [
                ...beachList.map(item => ({...item, category: 'beach'})),
                ...templeList.map(item => ({...item, category: 'temple'})),
                ...countryCities.map(item => ({...item, category: 'country'}))
            ];

            // Normalize input for keyword matching
            let keyword = input;
            if (keyword.endsWith('es')) keyword = keyword.slice(0, -2); // beaches -> beach, countries -> country
            else if (keyword.endsWith('s')) keyword = keyword.slice(0, -1); // temples -> temple

            // Find matches by keyword in name or description or category
            const matchedDestinations = allDestinations.filter(destination => 
                destination.name.toLowerCase().includes(input) ||
                (destination.description && destination.description.toLowerCase().includes(input)) ||
                (destination.category && destination.category.includes(keyword))
            );

            if (matchedDestinations.length > 0) {
                matchedDestinations.forEach(destination => {
                    resultDiv.innerHTML += `
                        <div class="recommendation-card">
                            <img src="${destination.imageUrl}" alt="${destination.name}">
                            <div class="recommendation-card-content">
                                <h2 style="font-size: 1.3rem; margin-bottom: 0.4em;">
                                    ${destination.name}
                                </h2>
                                <p style="color: #6c757d; font-size: 1rem;">
                                    ${destination.description}
                                </p>
                                <button class="visit-btn">Visit</button>
                            </div>
                        </div>
                    `;
                });
            } else {
                resultDiv.innerHTML = '<p>No destinations found for your search.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p>An error occurred while fetching data.</p>';
        });
}

// Attach the function to your search button
document.getElementById('btnSearch').addEventListener('click', searchDestinations);

// Optional: clear results on clear button
document.getElementById('btnClear').addEventListener('click', function() {
    document.getElementById('conditionInput').value = '';
    document.getElementById('recommendationResults').innerHTML = '';
});