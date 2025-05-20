const fs = require('fs');
const path = require('path');

// Function to parse CSV data
function parseCSV(csvData) {
  const rows = csvData.split('\n');
  const headers = rows[0].split(',').map(h => h.replace(/"/g, ''));
  
  console.log('Headers:', headers);
  
  // Create a map to store unique companies by DUNS number
  const companiesMap = new Map();
  
  // Process each row
  let rowCount = 0;
  let dunsCount = 0;
  let noDunsCount = 0;
  
  rows.slice(1).forEach(row => {
    if (!row.trim()) return;
    
    rowCount++;
    
    // Handle commas within quoted fields
    const values = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.replace(/"/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    values.push(currentValue.replace(/"/g, ''));
    
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = values[index] || '';
    });
    
    // Extract DUNS number as unique identifier
    const dunsNumber = rowData['D-U-N-S® Number'] || '';
    
    if (dunsNumber) {
      dunsCount++;
      companiesMap.set(dunsNumber, rowData);
    } else {
      noDunsCount++;
    }
  });
  
  console.log('Total rows processed:', rowCount);
  console.log('Rows with DUNS number:', dunsCount);
  console.log('Rows without DUNS number:', noDunsCount);
  console.log('Unique companies by DUNS:', companiesMap.size);
  
  return Array.from(companiesMap.values());
}

async function main() {
  try {
    console.log('Starting CSV analysis...');
    
    // Read company-only data
    console.log('\nAnalyzing companiesonly_6k_may20th2025.csv:');
    const companyPath = path.join(__dirname, '../public/companiesonly_6k_may20th2025.csv');
    const companyText = fs.readFileSync(companyPath, 'utf8');
    console.log('File size:', companyText.length, 'bytes');
    const companyData = parseCSV(companyText);
    
    // Read company-with-contacts data
    console.log('\nAnalyzing 6kcompanieswithcontacts.csv:');
    const contactPath = path.join(__dirname, '../public/6kcompanieswithcontacts.csv');
    const contactText = fs.readFileSync(contactPath, 'utf8');
    console.log('File size:', contactText.length, 'bytes');
    const contactData = parseCSV(contactText);
    
    // Merge the datasets
    console.log('\nMerging datasets:');
    const mergedData = [...companyData, ...contactData];
    console.log('Total merged records:', mergedData.length);
    
    // Remove duplicates based on DUNS number
    const uniqueCompanies = Array.from(
      new Map(mergedData.map(item => [item['D-U-N-S® Number'], item])).values()
    );
    console.log('Final unique companies count:', uniqueCompanies.length);
    
    // Check for the old dataset
    console.log('\nChecking old dataset:');
    const oldPath = path.join(__dirname, '../public/ForMinnesotacompanies.org $10M + 10+ ppl + MN Only.csv');
    const oldText = fs.readFileSync(oldPath, 'utf8');
    console.log('Old file size:', oldText.length, 'bytes');
    const oldData = parseCSV(oldText);
    console.log('Old dataset unique companies:', oldData.length);
    
    // Check which file is being loaded in the browser
    console.log('\nChecking file references in App.tsx:');
    const appPath = path.join(__dirname, 'App.tsx');
    const appCode = fs.readFileSync(appPath, 'utf8');
    console.log('File paths in App.tsx:');
    const fileMatches = appCode.match(/fetch\(['"]([^'"]+)['"]\)/g);
    if (fileMatches) {
      fileMatches.forEach(match => console.log(' -', match));
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
