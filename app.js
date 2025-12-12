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
        errorLoading: "Could not load medicines database. Please refresh the page.",
        uploadLabel: "Upload Excel Database",
        uploadHint: "Upload an Excel file to use as medicine database, or use the default database",
        fileUploaded: "File uploaded: {0}",
        usingDefaultDatabase: "Using default database",
        errorParsingFile: "Error parsing file. Please make sure it's a valid Excel file with columns: Name, Generic Name, Category, Description, Dosage, Side Effects"
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
        errorLoading: "Не удалось загрузить базу данных лекарств. Пожалуйста, обновите страницу.",
        uploadLabel: "Загрузить Excel Базу Данных",
        uploadHint: "Загрузите файл Excel для использования в качестве базы данных лекарств или используйте базу данных по умолчанию",
        fileUploaded: "Файл загружен: {0}",
        usingDefaultDatabase: "Используется база данных по умолчанию",
        errorParsingFile: "Ошибка разбора файла. Убедитесь, что это правильный файл Excel со столбцами: Название, Общее название, Категория, Описание, Дозировка, Побочные эффекты"
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
        errorLoading: "Dorilar bazasi yuklanmadi. Iltimos, sahifani yangilang.",
        uploadLabel: "Excel Ma'lumotlar Bazasini Yuklash",
        uploadHint: "Dorilar ma'lumotlar bazasi sifatida foydalanish uchun Excel faylini yuklang yoki standart ma'lumotlar bazasidan foydalaning",
        fileUploaded: "Fayl yuklandi: {0}",
        usingDefaultDatabase: "Standart ma'lumotlar bazasi ishlatilmoqda",
        errorParsingFile: "Faylni tahlil qilishda xato. Iltimos, bu to'g'ri Excel fayli ekanligiga ishonch hosil qiling. Ustunlar: Nomi, Umumiy nomi, Kategoriya, Tavsif, Doza, Yon ta'sirlar"
    }
};

// DOM Elements
const medicineInput = document.getElementById('medicineInput');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');
const suggestionsDiv = document.getElementById('suggestions');
const totalMedicinesSpan = document.getElementById('totalMedicines');
const fileInput = document.getElementById('fileInput');
const fileNameSpan = document.getElementById('fileName');
const databaseSourceP = document.getElementById('databaseSource');
const uploadLabel = document.querySelector('.upload-label');

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
    
    // Update total medicines count if database is loaded
    if (medicinesDatabase.length > 0) {
        totalMedicinesSpan.textContent = medicinesDatabase.length;
    }
}

// Load medicines data from default JSON
async function loadMedicines() {
    try {
        const response = await fetch('medicines.json');
        if (!response.ok) {
            throw new Error('Failed to load medicines database');
        }
        medicinesDatabase = await response.json();
        totalMedicinesSpan.textContent = medicinesDatabase.length;
        databaseSourceP.textContent = t('usingDefaultDatabase');
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

// Parse Excel file and load medicines
function parseExcelFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get the first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // Map Excel columns to our medicine object structure
            // Expected columns: Name, Generic Name, Category, Description, Dosage, Side Effects
            medicinesDatabase = jsonData.map(row => ({
                name: row['Name'] || row['name'] || '',
                genericName: row['Generic Name'] || row['generic name'] || row['genericName'] || '',
                category: row['Category'] || row['category'] || '',
                description: row['Description'] || row['description'] || '',
                dosage: row['Dosage'] || row['dosage'] || row['Typical Dosage'] || '',
                sideEffects: row['Side Effects'] || row['side effects'] || row['sideEffects'] || row['Common Side Effects'] || ''
            })).filter(med => med.name); // Filter out empty entries
            
            // Update UI
            totalMedicinesSpan.textContent = medicinesDatabase.length;
            fileNameSpan.textContent = t('fileUploaded', file.name);
            databaseSourceP.textContent = t('fileUploaded', file.name);
            
            // Clear result div
            resultDiv.innerHTML = `
                <div class="result-card found">
                    <h3>✓ ${t('fileUploaded', file.name)}</h3>
                    <p>${t('databaseContains', medicinesDatabase.length)}</p>
                </div>
            `;
            
            console.log('Excel file loaded:', medicinesDatabase.length, 'medicines');
        } catch (error) {
            console.error('Error parsing Excel file:', error);
            resultDiv.innerHTML = `
                <div class="error">
                    <strong>Error:</strong> ${t('errorParsingFile')}
                </div>
            `;
            // Fallback to default database
            loadMedicines();
        }
    };
    
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        resultDiv.innerHTML = `
            <div class="error">
                <strong>Error:</strong> ${t('errorParsingFile')}
            </div>
        `;
        // Fallback to default database
        loadMedicines();
    };
    
    reader.readAsArrayBuffer(file);
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

// File upload handling
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        parseExcelFile(file);
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
