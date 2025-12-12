// Medicine Checker Application
let medicinesDatabase = [];
let allowedMedicines = {};
let currentLanguage = "en";

// Translations
const translations = {
  en: {
    title: "Medicine Checker",
    subtitle: "Verify medicines from our database",
    searchPlaceholder: "Search by name, manufacturer, reg. number...",
    searchButton: "Search",
    howToUseTitle: "How to Use:",
    howToUse1: "Type the medicine name, manufacturer, or registration number",
    howToUse2: 'Click "Search" or press Enter',
    howToUse3: "View the results and medicine details",
    totalMedicines: "Total medicines in database:",
    footer: "Data updated regularly",
    medicineFound: "Medicine Found",
    medicineNotFound: "Medicine Not Found",
    packId: "Pack ID:",
    mark: "Mark:",
    name: "Name:",
    manufacturer: "Manufacturer:",
    packName: "Pack Name:",
    regNum: "Registration Number:",
    currency: "Currency:",
    baseManPrice: "Manufacturer Price:",
    baseOptPrice: "Wholesale Price:",
    baseMarketPrice: "Market Price:",
    notFoundMessage: 'No medicine found matching "{0}".',
    checkSpelling: "Please check the spelling or try different keywords.",
    databaseContains: "Our database contains {0} medicines.",
    enterMedicineName: "Please enter search keywords.",
    errorLoading: "Could not load medicines database. Please refresh the page.",
    expiration: "Certificate Expiration:",
    markName: "Trade Name:",
    type: "Dosage Form:",
    owner: "Certificate Holder:",
    groupName: "Pharmacotherapeutic Group:",
    howToUse: "Route of Administration:",
    atxCode: "ATC Code:",
    atxName: "ATC Name:",
    condition: "Dispensing Condition:",
  },
  ru: {
    title: "Проверка Лекарств",
    subtitle: "Проверка выпускаемых лекарств по рецепту из нашей базы данных",
    searchPlaceholder: "Поиск по названию, производителю, рег. номеру...",
    searchButton: "Поиск",
    howToUseTitle: "Как использовать:",
    howToUse1:
      "Введите название лекарства, производителя или регистрационный номер",
    howToUse2: 'Нажмите "Поиск" или клавишу Enter',
    howToUse3: "Просмотрите результаты и подробную информацию",
    totalMedicines: "Всего лекарств в базе данных:",
    footer: "Данные регулярно обновляются",
    medicineFound: "Лекарство Найдено",
    medicineNotFound: "Лекарство Не Найдено",
    packId: "ID упаковки:",
    mark: "Марка:",
    name: "Название:",
    manufacturer: "Производитель:",
    packName: "Название упаковки:",
    regNum: "Регистрационный номер:",
    currency: "Валюта:",
    baseManPrice: "Цена производителя:",
    baseOptPrice: "Оптовая цена:",
    baseMarketPrice: "Рыночная цена:",
    notFoundMessage: 'Не найдено лекарство по запросу "{0}".',
    checkSpelling:
      "Пожалуйста, проверьте правописание или попробуйте другие ключевые слова.",
    databaseContains: "В нашей базе данных содержится {0} лекарств.",
    enterMedicineName: "Пожалуйста, введите ключевые слова для поиска.",
    errorLoading:
      "Не удалось загрузить базу данных лекарств. Пожалуйста, обновите страницу.",
    expiration: "Срок действия сертификата:",
    markName: "Торговое название:",
    type: "Лекарственная форма:",
    owner: "Владелец сертификата:",
    groupName: "Фармакотерапевтическая группа:",
    howToUse: "Способ введения:",
    atxCode: "АТХ код:",
    atxName: "АТХ наименование:",
    condition: "Условия отпуска:",
  },
  uz: {
    title: "Dori Tekshiruvchi",
    subtitle: "Bazamizdagi dorilarni tekshiring",
    searchPlaceholder:
      "Nomi, ishlab chiqaruvchi, reg. raqami bo'yicha qidirish...",
    searchButton: "Qidirish",
    howToUseTitle: "Qanday foydalanish:",
    howToUse1:
      "Dori nomi, ishlab chiqaruvchi yoki ro'yxatga olish raqamini kiriting",
    howToUse2: '"Qidirish" tugmasini bosing yoki Enter tugmasini bosing',
    howToUse3: "Natijalar va dori tafsilotlarini ko'ring",
    totalMedicines: "Ma'lumotlar bazasidagi dorilar soni:",
    footer: "Ma'lumotlar muntazam yangilanadi",
    medicineFound: "Dori Topildi",
    medicineNotFound: "Dori Topilmadi",
    packId: "Qadoq ID:",
    mark: "Belgi:",
    name: "Nomi:",
    manufacturer: "Ishlab chiqaruvchi:",
    packName: "Qadoq nomi:",
    regNum: "Ro'yxatga olish raqami:",
    currency: "Valyuta:",
    baseManPrice: "Ishlab chiqaruvchi narxi:",
    baseOptPrice: "Ulgurji narxi:",
    baseMarketPrice: "Bozor narxi:",
    notFoundMessage: "\"{0}\" so'rovi bo'yicha dori topilmadi.",
    checkSpelling:
      "Iltimos, imloni tekshiring yoki boshqa kalit so'zlarni sinab ko'ring.",
    databaseContains: "Bizning ma'lumotlar bazamizda {0} ta dori mavjud.",
    enterMedicineName: "Iltimos, qidirish uchun kalit so'zlarni kiriting.",
    errorLoading: "Dorilar bazasi yuklanmadi. Iltimos, sahifani yangilang.",
    expiration: "Guvohnoma amal qilish muddati:",
    markName: "Dori vositasining savdo nomi:",
    type: "Dori shakli:",
    owner: "Guvohnoma egasi:",
    groupName: "Farmakoterapevtik guruh nomi:",
    howToUse: "Yuborish usuli:",
    atxCode: "ATX - kod:",
    atxName: "ATX-nomi:",
    condition: "Dorixonada berish tartibi:",
  },
};

// DOM Elements
const medicineInput = document.getElementById("medicineInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");
const suggestionsDiv = document.getElementById("suggestions");
const totalMedicinesSpan = document.getElementById("totalMedicines");

// Safely escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
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
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });

  // Update placeholder
  const placeholderElements = document.querySelectorAll(
    "[data-i18n-placeholder]"
  );
  placeholderElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.placeholder = t(key);
  });

  // Update title
  document.title = t("title");

  // Update total medicines count if database is loaded
  if (medicinesDatabase.length > 0) {
    totalMedicinesSpan.textContent = medicinesDatabase.length;
  }
}

// Parse CSV data
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(";");
  const medicines = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(";");
    if (values.length === headers.length) {
      const medicine = {};
      headers.forEach((header, index) => {
        let value = values[index];

        // Handle the header name mapping
        let fieldName = header.toLowerCase().trim();

        // Parse numeric values (prices)
        if (fieldName.includes("price")) {
          // Remove spaces and convert to number
          const numericValue = parseFloat(
            value.replace(/\s+/g, "").replace(",", ".")
          );
          medicine[fieldName] = isNaN(numericValue) ? 0 : numericValue;
        } else if (fieldName === "pack_id") {
          // Convert pack_id to string to maintain consistency
          medicine[fieldName] = value.trim();
        } else {
          medicine[fieldName] = value.trim();
        }
      });
      medicines.push(medicine);
    }
  }

  return medicines;
}

// Load medicines data from CSV
async function loadMedicines() {
  try {
    // Load both databases in parallel
    const medicinesResponse = await fetch("medicines.csv");

    if (!medicinesResponse.ok) {
      throw new Error("Failed to load medicines database");
    }

    const csvText = await medicinesResponse.text();
    medicinesDatabase = parseCSV(csvText);

    // Update condition field based on allowed medicines
    medicinesDatabase.forEach((medicine) => {
      if (medicine.reg_num && allowedMedicines[medicine.reg_num]) {
        medicine.condition =
          allowedMedicines[medicine.reg_num].condition || medicine.condition;
      }
    });

    totalMedicinesSpan.textContent = medicinesDatabase.length;
    console.log(
      "Medicines database loaded:",
      medicinesDatabase.length,
      "medicines"
    );
  } catch (error) {
    console.error("Error loading medicines:", error);
    resultDiv.innerHTML = `
            <div class="error">
                <strong>Error:</strong> ${t("errorLoading")}
            </div>
        `;
  }
}

// Search medicine in database
function searchMedicine(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    resultDiv.innerHTML = `
            <div class="result-card">
                <p>${t("enterMedicineName")}</p>
            </div>
        `;
    return;
  }

  const term = searchTerm.trim().toLowerCase();

  // Search across all relevant fields
  const matches = medicinesDatabase.filter(
    (med) =>
      (med.pack_id && med.pack_id.toLowerCase().includes(term)) ||
      (med.mark && med.mark.toLowerCase().includes(term)) ||
      (med.name && med.name.toLowerCase().includes(term)) ||
      (med.manufacturer && med.manufacturer.toLowerCase().includes(term)) ||
      (med.pack_name && med.pack_name.toLowerCase().includes(term)) ||
      (med.reg_num && med.reg_num.toLowerCase().includes(term))
  );

  if (matches.length > 0) {
    // Sort matches: "Без рецепта" first, then "По рецепту", then others
    const sortedMatches = matches.sort((a, b) => {
      const conditionA = a.condition || "";
      const conditionB = b.condition || "";

      if (conditionA === "Без рецепта" && conditionB !== "Без рецепта") {
        return -1;
      }
      if (conditionA !== "Без рецепта" && conditionB === "Без рецепта") {
        return 1;
      }
      if (
        conditionA === "По рецепту" &&
        conditionB !== "По рецепту" &&
        conditionB !== "Без рецепта"
      ) {
        return -1;
      }
      if (
        conditionA !== "По рецепту" &&
        conditionA !== "Без рецепта" &&
        conditionB === "По рецепту"
      ) {
        return 1;
      }
      return 0;
    });

    displayMedicines(sortedMatches);
  } else {
    displayMedicineNotFound(searchTerm);
  }
}

// Display medicines found
function displayMedicines(medicines) {
  const medicinesHtml = medicines
    .map((medicine) => {
      const currency = escapeHtml(medicine.currency || "UZS");
      const condition = medicine.condition || "";

      // Determine border class based on condition
      let borderClass = "";
      if (condition === "По рецепту") {
        borderClass = "prescription-required";
      } else if (condition === "Без рецепта") {
        borderClass = "no-prescription";
      }

      return `
        <div class="result-card found ${borderClass}">
            <h3>✓ ${t("medicineFound")}</h3>
            <p><strong>${t("packId")}</strong> ${escapeHtml(
        medicine.pack_id || "N/A"
      )}</p>
            <p><strong>${t("mark")}</strong> ${escapeHtml(
        medicine.mark || "N/A"
      )}</p>
            <p><strong>${t("name")}</strong> ${escapeHtml(
        medicine.name || "N/A"
      )}</p>
            <p><strong>${t("manufacturer")}</strong> ${escapeHtml(
        medicine.manufacturer || "N/A"
      )}</p>
            <p><strong>${t("packName")}</strong> ${escapeHtml(
        medicine.pack_name || "N/A"
      )}</p>
            <p><strong>${t("regNum")}</strong> ${escapeHtml(
        medicine.reg_num || "N/A"
      )}</p>
            <p><strong>${t("currency")}</strong> ${currency}</p>
            <p><strong>${t("baseManPrice")}</strong> ${escapeHtml(
        (medicine.base_man_price || 0).toLocaleString()
      )} ${currency}</p>
            <p><strong>${t("baseOptPrice")}</strong> ${escapeHtml(
        (medicine.base_opt_price || 0).toLocaleString()
      )} ${currency}</p>
            <p><strong>${t("baseMarketPrice")}</strong> ${escapeHtml(
        (medicine.base_market_price || 0).toLocaleString()
      )} ${currency}</p>
            ${
              condition
                ? `<p><strong>Condition:</strong> <span class="condition-badge ${borderClass}">${escapeHtml(
                    condition
                  )}</span></p>`
                : ""
            }
        </div>
    `;
    })
    .join("");

  resultDiv.innerHTML = medicinesHtml;
}

// Display medicine not found
function displayMedicineNotFound(searchTerm) {
  resultDiv.innerHTML = `
        <div class="result-card not-found">
            <h3>✗ ${t("medicineNotFound")}</h3>
            <p>${t("notFoundMessage", escapeHtml(searchTerm))}</p>
            <p>${t("checkSpelling")}</p>
            <p>${t("databaseContains", medicinesDatabase.length)}</p>
        </div>
    `;
}

// Show suggestions as user types
function showSuggestions(input) {
  const searchTerm = input.trim().toLowerCase();

  if (searchTerm.length < 2) {
    suggestionsDiv.innerHTML = "";
    suggestionsDiv.classList.remove("show");
    return;
  }

  const matches = medicinesDatabase
    .filter(
      (med) =>
        (med.name && med.name.toLowerCase().includes(searchTerm)) ||
        (med.pack_name && med.pack_name.toLowerCase().includes(searchTerm)) ||
        (med.manufacturer &&
          med.manufacturer.toLowerCase().includes(searchTerm))
    )
    .slice(0, 5); // Limit to 5 suggestions

  if (matches.length > 0) {
    suggestionsDiv.innerHTML = matches
      .map(
        (med) =>
          `<div class="suggestion-item" data-name="${escapeHtml(
            med.name || ""
          )}">${escapeHtml(med.name || "")} - ${escapeHtml(
            med.manufacturer || ""
          )}</div>`
      )
      .join("");
    suggestionsDiv.classList.add("show");
  } else {
    suggestionsDiv.innerHTML = "";
    suggestionsDiv.classList.remove("show");
  }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
  searchMedicine(medicineInput.value);
  suggestionsDiv.classList.remove("show");
});

medicineInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchMedicine(medicineInput.value);
    suggestionsDiv.classList.remove("show");
  }
});

medicineInput.addEventListener("input", (e) => {
  showSuggestions(e.target.value);
});

// Handle suggestion clicks
suggestionsDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("suggestion-item")) {
    const medicineName = e.target.getAttribute("data-name");
    medicineInput.value = medicineName;
    searchMedicine(medicineName);
    suggestionsDiv.classList.remove("show");
  }
});

// Click outside to close suggestions
document.addEventListener("click", (e) => {
  if (!medicineInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
    suggestionsDiv.classList.remove("show");
  }
});

// Language switching
document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const lang = e.target.getAttribute("data-lang");
    currentLanguage = lang;

    // Update active button
    document
      .querySelectorAll(".lang-btn")
      .forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");

    // Update UI
    updateLanguage();

    // Save preference
    localStorage.setItem("preferredLanguage", lang);
  });
});

// Load saved language preference
const savedLang = localStorage.getItem("preferredLanguage");
if (savedLang && translations[savedLang]) {
  currentLanguage = savedLang;
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === savedLang);
  });
  updateLanguage();
}

// Initialize app
loadMedicines();
