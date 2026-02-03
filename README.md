# Supplier Rate Analyzer

A React-based CSV parser and data visualization tool that helps analyze Bill of Materials (BOM) supplier rates with advanced table features including heat map visualization, sorting, column freezing, and hiding.

## 📋 Features

### Core Functionality
- **CSV File Upload** - Parse and validate CSV files with predefined headers
- **Two-Page Navigation** - File upload page → Data visualization page
- **Heat Map Visualization** - Color-coded cells based on supplier rate values
  - 🟢 Green = Minimum rate (best price)
  - 🟡 Yellow = Mid-range rates
  - 🔴 Red = Maximum rate (highest price)
- **Percentage Difference** - Shows % difference from estimated rate for each supplier

### Advanced Table Features
- **Column Sorting** - Sort any column in ascending/descending order
- **Column Freezing** - Pin columns for horizontal scrolling (Excel-like)
- **Column Hiding** - Show/hide columns as needed
- **Responsive Design** - Works on desktop and tablet devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or create the project**
```bash
npx create-react-app supplier-rate-analyzer
cd supplier-rate-analyzer
```

2. **Install dependencies**
```bash
npm install papaparse
# or
yarn add papaparse
```

3. **Copy the source files**
- Place the component files in `src/components/`
- Place utility files in `src/utils/`
- Place hooks in `src/hooks/`
- Update `src/App.jsx` with the main application code

4. **Start the development server**
```bash
npm start
# or
yarn start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
supplier-rate-analyzer/
├── public/
├── src/
│   ├── components/
│   │   ├── FileUpload.jsx          # Page 1: CSV file selection
│   │   ├── DataTable.jsx           # Page 2: Data visualization
│   │   ├── TableHeader.jsx         # Table header with controls
│   │   └── TableCell.jsx           # Individual cell with heat map
│   ├── utils/
│   │   ├── csvParser.js            # CSV parsing logic
│   │   ├── heatMapCalculator.js    # Color interpolation for heat map
│   │   └── percentageCalculator.js # Percentage difference calculations
│   ├── hooks/
│   │   └── useTableFeatures.js     # Sorting, freezing, hiding logic
│   ├── App.jsx                     # Main application
│   └── index.js
├── package.json
└── README.md
```

## 📊 CSV File Format

Your CSV file must have the following headers (in order):

```csv
Item Code,Material,Quantity,Estimated Rate,Supplier 1 (Rate),Supplier 2 (Rate),Supplier 3 (Rate),Supplier 4 (Rate),Supplier 5 (Rate)
```

### Example Row
```csv
AER-001,Aerospace Parts,655,617.50,723.94,815.01,837.28,853.14,748.26
```

### Header Descriptions
- **Item Code** - Unique identifier for the item
- **Material** - Description of the material/part
- **Quantity** - Number of units required
- **Estimated Rate** - Your baseline/budget rate
- **Supplier 1-5 (Rate)** - Quoted rates from 5 different suppliers

## 🎯 Usage Guide

### Step 1: Upload CSV File
1. Click on the file upload area on Page 1
2. Select your CSV file (must match the required format)
3. File will be validated automatically
4. If valid, you'll be taken to Page 2

### Step 2: Analyze Data
Once on Page 2, you can:

#### View Heat Map
- Each supplier rate cell is color-coded
- Green cells = lowest rate in that row (best deal)
- Red cells = highest rate in that row (most expensive)
- Yellow/gradient = mid-range values

#### Check Percentage Differences
- Below each supplier rate, you'll see a percentage
- Positive (+%) = rate is higher than estimated
- Negative (-%) = rate is lower than estimated

#### Sort Columns
- Click the ↕️ icon in any column header
- First click = ascending order
- Second click = descending order

#### Freeze Columns
- Click the 🔒/🔓 icon to freeze/unfreeze a column
- Frozen columns stay visible when scrolling horizontally
- Default frozen: Item Code, Material

#### Hide Columns
- Click the 👁️ icon to hide a column
- Click again (or use show/hide menu) to reveal it

## 🧮 Heat Map Algorithm

The heat map uses a gradient calculation:

```javascript
For each row:
1. Find MIN and MAX supplier rates
2. Calculate normalized position: (value - min) / (max - min)
3. Interpolate color:
   - 0.0 to 0.5: Green → Yellow
   - 0.5 to 1.0: Yellow → Red
```

**Color Values:**
- Green: `rgb(134, 239, 172)`
- Yellow: `rgb(254, 240, 138)`
- Red: `rgb(252, 165, 165)`

## 🛠️ Technical Details

### Dependencies
- **React** - UI framework
- **Papaparse** - CSV parsing library
- **Lucide React** - Icon library (optional)

### Key Technologies
- React Hooks (useState, useMemo)
- CSS-in-JS / Tailwind CSS
- File API for CSV reading

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🧪 Testing

### Test Checklist
- [ ] Upload valid CSV file
- [ ] Upload invalid CSV (wrong headers)
- [ ] Verify heat map colors (green=min, red=max)
- [ ] Check percentage calculations
- [ ] Test sorting on multiple columns
- [ ] Freeze/unfreeze columns
- [ ] Hide/show columns
- [ ] Test with edge cases (empty values, identical rates)

### Sample Test Data
Use the included `sample_supplier_data.csv` file for testing.

## 🐛 Troubleshooting

### CSV Upload Fails
- Ensure headers match exactly (case-sensitive)
- Check for proper CSV formatting (commas, no extra spaces)
- Verify file is actually .csv format

### Heat Map Not Showing
- Ensure supplier rate values are numeric
- Check that values aren't all identical
- Verify parseFloat() is working correctly

### Frozen Columns Not Sticky
- Check CSS `position: sticky` support in browser
- Verify z-index values are correct
- Ensure parent container has proper overflow settings

## 📈 Future Enhancements

Potential features to add:
- [ ] Export filtered/sorted data back to CSV
- [ ] Save table configurations (frozen columns, hidden columns)
- [ ] Multi-file comparison
- [ ] Advanced filtering (price ranges, specific suppliers)
- [ ] Data visualization charts (bar charts, scatter plots)
- [ ] Dark mode support
- [ ] Print-friendly view
- [ ] Responsive mobile layout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is created for educational purposes.

## 👥 Authors

Your Name - Your Assignment

## 🙏 Acknowledgments

- Assignment requirements based on production UI evaluation criteria
- Heat map inspiration from Excel conditional formatting
- CSV parsing powered by Papaparse library

---

**Note:** This is a frontend assignment demonstrating CSV parsing, data visualization, and advanced table manipulation features. The evaluation criteria focuses on correctness, heat map logic, percentage calculations, and proper implementation of sorting, freezing, and hiding features.