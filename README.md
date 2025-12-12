# 💊 Medicine Checker Web Application

A simple, user-friendly web application that allows users to search and verify medicines from a comprehensive database. The application is built with pure HTML, CSS, and JavaScript, making it perfect for GitHub Pages deployment.

## 🌟 Features

- **Real-time Search**: Instant medicine lookup with autocomplete suggestions
- **Comprehensive Information**: View detailed medicine information including:
  - Generic names
  - Category/Classification
  - Description and usage
  - Typical dosage
  - Common side effects
- **User-friendly Interface**: Clean, modern design with responsive layout
- **Fast and Efficient**: Client-side processing for instant results
- **No Dependencies**: Pure vanilla JavaScript - no frameworks needed

## 🚀 Live Demo

Visit the live application: [https://mj11rock.github.io/prescriptions/](https://mj11rock.github.io/prescriptions/)

## 📋 Database

The application includes a database of 20 common medicines covering various categories:
- Analgesics (Pain relievers)
- Antibiotics
- Anti-inflammatory drugs
- Blood pressure medications
- Diabetes medications
- And more...

### Data Sources

- **medicines.json**: JSON format used by the web application
- **medicines.xlsx**: Excel format for easy editing and viewing
- **medicines.csv**: CSV format for compatibility with spreadsheet applications

## 🎯 How to Use

1. Visit the web application
2. Type the medicine name in the search box
3. Select from autocomplete suggestions or press Enter/click Search
4. View detailed information about the medicine

## 💻 Local Development

To run this application locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/mj11rock/prescriptions.git
   cd prescriptions
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On Linux/Mac
   open index.html
   
   # On Windows
   start index.html
   
   # Or use a local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 📝 Updating the Medicine Database

To add or modify medicines in the database:

1. **Edit the Excel file** (`medicines.xlsx`):
   - Open the file in Excel or any spreadsheet application
   - Add/modify medicine information
   - Save the file

2. **Convert to JSON**:
   - You can manually update `medicines.json` following the same format
   - Or use a converter tool/script to convert Excel to JSON

3. **JSON Format**:
   ```json
   {
       "name": "Medicine Name",
       "genericName": "Generic Name",
       "category": "Category",
       "description": "Description",
       "dosage": "Dosage information",
       "sideEffects": "Side effects"
   }
   ```

## 🔒 Disclaimer

**IMPORTANT**: This application is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add more medicines to the database
- Improve the UI/UX
- Add new features
- Report bugs or suggest improvements

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.