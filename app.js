// Medicine Checker Application
let medicinesDatabase = [];

// DOM Elements
const medicineInput = document.getElementById('medicineInput');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');
const suggestionsDiv = document.getElementById('suggestions');
const totalMedicinesSpan = document.getElementById('totalMedicines');

// Safely escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load medicines data
async function loadMedicines() {
    try {
        const response = await fetch('medicines.json');
        if (!response.ok) {
            throw new Error('Failed to load medicines database');
        }
        medicinesDatabase = await response.json();
        totalMedicinesSpan.textContent = medicinesDatabase.length;
        console.log('Medicines database loaded:', medicinesDatabase.length, 'medicines');
    } catch (error) {
        console.error('Error loading medicines:', error);
        resultDiv.innerHTML = `
            <div class="error">
                <strong>Error:</strong> Could not load medicines database. Please refresh the page.
            </div>
        `;
    }
}

// Search medicine in database
function searchMedicine(medicineName) {
    if (!medicineName || medicineName.trim() === '') {
        resultDiv.innerHTML = `
            <div class="result-card">
                <p>Please enter a medicine name to search.</p>
            </div>
        `;
        return;
    }

    const searchTerm = medicineName.trim().toLowerCase();
    
    // Exact match first
    let medicine = medicinesDatabase.find(med => 
        med.name.toLowerCase() === searchTerm || 
        med.genericName.toLowerCase() === searchTerm
    );

    // If no exact match, try partial match
    if (!medicine) {
        medicine = medicinesDatabase.find(med => 
            med.name.toLowerCase().includes(searchTerm) || 
            med.genericName.toLowerCase().includes(searchTerm)
        );
    }

    if (medicine) {
        displayMedicineFound(medicine);
    } else {
        displayMedicineNotFound(searchTerm);
    }
}

// Display medicine found
function displayMedicineFound(medicine) {
    resultDiv.innerHTML = `
        <div class="result-card found">
            <h3>✓ Medicine Found</h3>
            <p><strong>Name:</strong> ${escapeHtml(medicine.name)}</p>
            <p><strong>Generic Name:</strong> ${escapeHtml(medicine.genericName)}</p>
            <p><strong>Category:</strong> ${escapeHtml(medicine.category)}</p>
            <p><strong>Description:</strong> ${escapeHtml(medicine.description)}</p>
            <p><strong>Typical Dosage:</strong> ${escapeHtml(medicine.dosage)}</p>
            <p><strong>Common Side Effects:</strong> ${escapeHtml(medicine.sideEffects)}</p>
        </div>
    `;
}

// Display medicine not found
function displayMedicineNotFound(searchTerm) {
    resultDiv.innerHTML = `
        <div class="result-card not-found">
            <h3>✗ Medicine Not Found</h3>
            <p>The medicine "<strong>${escapeHtml(searchTerm)}</strong>" was not found in our database.</p>
            <p>Please check the spelling or try searching with the generic name.</p>
            <p>Our database contains ${medicinesDatabase.length} medicines.</p>
        </div>
    `;
}

// Show suggestions as user types
function showSuggestions(input) {
    const searchTerm = input.trim().toLowerCase();
    
    if (searchTerm.length < 2) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('show');
        return;
    }

    const matches = medicinesDatabase.filter(med => 
        med.name.toLowerCase().includes(searchTerm) || 
        med.genericName.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit to 5 suggestions

    if (matches.length > 0) {
        suggestionsDiv.innerHTML = matches.map(med => 
            `<div class="suggestion-item" data-name="${escapeHtml(med.name)}">${escapeHtml(med.name)} (${escapeHtml(med.genericName)})</div>`
        ).join('');
        suggestionsDiv.classList.add('show');
    } else {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.classList.remove('show');
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    searchMedicine(medicineInput.value);
    suggestionsDiv.classList.remove('show');
});

medicineInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMedicine(medicineInput.value);
        suggestionsDiv.classList.remove('show');
    }
});

medicineInput.addEventListener('input', (e) => {
    showSuggestions(e.target.value);
});

// Handle suggestion clicks
suggestionsDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion-item')) {
        const medicineName = e.target.getAttribute('data-name');
        medicineInput.value = medicineName;
        searchMedicine(medicineName);
        suggestionsDiv.classList.remove('show');
    }
});

// Click outside to close suggestions
document.addEventListener('click', (e) => {
    if (!medicineInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.classList.remove('show');
    }
});

// Initialize app
loadMedicines();
