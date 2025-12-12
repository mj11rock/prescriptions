// Medicine Checker Application
let medicinesDatabase = [];
let currentLanguage = 'en';

// Translations
const translations = {
    en: {
        title: "Medicine Checker",
        subtitle: "Verify medicines from our database",
        searchPlaceholder: "Enter medicine name...",
        searchButton: "Search",
        howToUseTitle: "How to Use:",
        howToUse1: "Type the medicine name in the search box",
        howToUse2: 'Click "Search" or press Enter',
        howToUse3: "View the results and medicine details",
        totalMedicines: "Total medicines in database:",
        footer: "Medicine Checker © 2024 | Data updated regularly",
        medicineFound: "Medicine Found",
        medicineNotFound: "Medicine Not Found",
        name: "Name:",
        genericName: "Generic Name:",
        category: "Category:",
        description: "Description:",
        dosage: "Typical Dosage:",
        sideEffects: "Common Side Effects:",
        notFoundMessage: 'The medicine "{0}" was not found in our database.',
        checkSpelling: "Please check the spelling or try searching with the generic name.",
        databaseContains: "Our database contains {0} medicines.",
        enterMedicineName: "Please enter a medicine name to search.",
        errorLoading: "Could not load medicines database. Please refresh the page."
    },
    ru: {
        title: "Проверка Лекарств",
        subtitle: "Проверьте лекарства из нашей базы данных",
        searchPlaceholder: "Введите название лекарства...",
        searchButton: "Поиск",
        howToUseTitle: "Как использовать:",
        howToUse1: "Введите название лекарства в поле поиска",
        howToUse2: 'Нажмите "Поиск" или клавишу Enter',
        howToUse3: "Просмотрите результаты и подробную информацию",
        totalMedicines: "Всего лекарств в базе данных:",
        footer: "Проверка Лекарств © 2024 | Данные регулярно обновляются",
        medicineFound: "Лекарство Найдено",
        medicineNotFound: "Лекарство Не Найдено",
        name: "Название:",
        genericName: "Общее название:",
        category: "Категория:",
        description: "Описание:",
        dosage: "Типичная дозировка:",
        sideEffects: "Общие побочные эффекты:",
        notFoundMessage: 'Лекарство "{0}" не найдено в нашей базе данных.',
        checkSpelling: "Пожалуйста, проверьте правописание или попробуйте поиск по общему названию.",
        databaseContains: "В нашей базе данных содержится {0} лекарств.",
        enterMedicineName: "Пожалуйста, введите название лекарства для поиска.",
        errorLoading: "Не удалось загрузить базу данных лекарств. Пожалуйста, обновите страницу."
    },
    uz: {
        title: "Dori Tekshiruvchi",
        subtitle: "Bazamizdagi dorilarni tekshiring",
        searchPlaceholder: "Dori nomini kiriting...",
        searchButton: "Qidirish",
        howToUseTitle: "Qanday foydalanish:",
        howToUse1: "Qidiruv maydoniga dori nomini kiriting",
        howToUse2: '"Qidirish" tugmasini bosing yoki Enter tugmasini bosing',
        howToUse3: "Natijalar va dori tafsilotlarini ko'ring",
        totalMedicines: "Ma'lumotlar bazasidagi dorilar soni:",
        footer: "Dori Tekshiruvchi © 2024 | Ma'lumotlar muntazam yangilanadi",
        medicineFound: "Dori Topildi",
        medicineNotFound: "Dori Topilmadi",
        name: "Nomi:",
        genericName: "Umumiy nomi:",
        category: "Kategoriya:",
        description: "Tavsif:",
        dosage: "Odatiy dozasi:",
        sideEffects: "Keng tarqalgan yon ta'sirlar:",
        notFoundMessage: '"{0}" dori bazamizda topilmadi.',
        checkSpelling: "Iltimos, imloni tekshiring yoki umumiy nom bilan qidirishga harakat qiling.",
        databaseContains: "Bizning ma'lumotlar bazamizda {0} ta dori mavjud.",
        enterMedicineName: "Iltimos, qidirish uchun dori nomini kiriting.",
        errorLoading: "Dorilar bazasi yuklanmadi. Iltimos, sahifani yangilang."
    }
};

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

// Get translation
function t(key, ...args) {
    let text = translations[currentLanguage][key] || translations.en[key] || key;
    args.forEach((arg, index) => {
        text = text.replace(`{${index}}`, arg);
    });
    return text;
}

// Update UI language
function updateLanguage() {
    document.documentElement.lang = currentLanguage;
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    // Update placeholder
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Update title
    document.title = t('title');
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
                <strong>Error:</strong> ${t('errorLoading')}
            </div>
        `;
    }
}

// Search medicine in database
function searchMedicine(medicineName) {
    if (!medicineName || medicineName.trim() === '') {
        resultDiv.innerHTML = `
            <div class="result-card">
                <p>${t('enterMedicineName')}</p>
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
            <h3>✓ ${t('medicineFound')}</h3>
            <p><strong>${t('name')}</strong> ${escapeHtml(medicine.name)}</p>
            <p><strong>${t('genericName')}</strong> ${escapeHtml(medicine.genericName)}</p>
            <p><strong>${t('category')}</strong> ${escapeHtml(medicine.category)}</p>
            <p><strong>${t('description')}</strong> ${escapeHtml(medicine.description)}</p>
            <p><strong>${t('dosage')}</strong> ${escapeHtml(medicine.dosage)}</p>
            <p><strong>${t('sideEffects')}</strong> ${escapeHtml(medicine.sideEffects)}</p>
        </div>
    `;
}

// Display medicine not found
function displayMedicineNotFound(searchTerm) {
    resultDiv.innerHTML = `
        <div class="result-card not-found">
            <h3>✗ ${t('medicineNotFound')}</h3>
            <p>${t('notFoundMessage', escapeHtml(searchTerm))}</p>
            <p>${t('checkSpelling')}</p>
            <p>${t('databaseContains', medicinesDatabase.length)}</p>
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

// Language switching
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        currentLanguage = lang;
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update UI
        updateLanguage();
        
        // Save preference
        localStorage.setItem('preferredLanguage', lang);
    });
});

// Load saved language preference
const savedLang = localStorage.getItem('preferredLanguage');
if (savedLang && translations[savedLang]) {
    currentLanguage = savedLang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLang);
    });
    updateLanguage();
}

// Initialize app
loadMedicines();
