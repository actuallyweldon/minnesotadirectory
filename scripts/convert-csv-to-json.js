const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Path to the CSV file
const csvFilePath = path.join(__dirname, '../public/6kcompanieswithcontacts.csv');
// Path to save the JSON file
const jsonFilePath = path.join(__dirname, '../public/companies_data.json');

// Create a map to store unique companies by DUNS number
const companiesMap = new Map();

// Process the CSV file
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const dunsNumber = row['D-U-N-S® Number'] || '';
    
    if (!dunsNumber) return; // Skip rows without DUNS number
    
    // Create or update company
    if (!companiesMap.has(dunsNumber)) {
      // Create new company
      companiesMap.set(dunsNumber, {
        name: row['Company Name'] || '',
        dunsNumber,
        tradestyle: row['Tradestyle'] || '',
        addressLine1: row['Address Line 1'] || '',
        addressLine2: row['Address Line 2'] || '',
        addressLine3: row['Address Line 3'] || '',
        city: row['City'] || '',
        stateOrProvince: row['State Or Province'] || '',
        postalCode: row['Postal Code'] || '',
        countryRegion: row['Country/Region'] || '',
        phone: row['Phone'] || '',
        companyEmail: row['Company Email'] || '',
        fax: row['Fax'] || '',
        url: row['URL'] || '',
        salesUSD: row['Sales (USD)'] || '',
        preTaxProfitUSD: row['Pre Tax Profit (USD)'] || '',
        assetsUSD: row['Assets (USD)'] || '',
        liabilitiesUSD: row['Liabilities (USD)'] || '',
        employeesSingleSite: row['Employees (Single Site)'] || '',
        employeesTotal: row['Employees (Total)'] || '',
        description: row['Business Description'] || '',
        ownershipType: row['Ownership Type'] || '',
        legalStatusType: row['D&B Legal Status Type'] || '',
        entityType: row['Entity Type'] || '',
        isHeadquarters: row['Is Headquarters']?.toLowerCase() === 'true',
        ticker: row['Ticker'] || '',
        parentCompany: row['Parent Company'] || '',
        parentCountryRegion: row['Parent Country/Region'] || '',
        globalUltimateCompany: row['Global Ultimate Company'] || '',
        globalUltimateCountryRegion: row['Global Ultimate Country/Region'] || '',
        industry: row['D&B Hoovers Industry'] || '',
        sicCode: row['US 8-Digit SIC Code'] || '',
        sicDescription: row['US 8-Digit SIC Description'] || '',
        sicCode1987: row['US SIC 1987 Code'] || '',
        sicDescription1987: row['US SIC 1987 Description'] || '',
        naicsCode: row['NAICS 2022 Code'] || '',
        naicsDescription: row['NAICS 2022 Description'] || '',
        ukSicCode: row['UK SIC 2007 Code'] || '',
        ukSicDescription: row['UK SIC 2007 Description'] || '',
        isicCode: row['ISIC Rev 4 Code'] || '',
        isicDescription: row['ISIC Rev 4 Description'] || '',
        naceCode: row['NACE Rev 2 Code'] || '',
        naceDescription: row['NACE Rev 2 Description'] || '',
        anzsicCode: row['ANZSIC 2006 Code'] || '',
        anzsicDescription: row['ANZSIC 2006 Description'] || '',
        contacts: []
      });
    }
    
    // Add contact information if available
    if (row['First Name'] || row['Last Name']) {
      const contact = {
        firstName: row['First Name'] || '',
        lastName: row['Last Name'] || '',
        title: row['Title'] || '',
        email: row['Email'] || '',
        directPhone: row['Direct Phone'] || ''
      };
      
      const company = companiesMap.get(dunsNumber);
      if (company) {
        company.contacts.push(contact);
      }
    }
  })
  .on('end', () => {
    // Convert map to array
    const companies = Array.from(companiesMap.values());
    
    // Get unique industries
    const industries = new Set();
    companies.forEach(company => {
      if (company.industry) {
        industries.add(company.industry);
      }
    });
    
    // Create the final data object
    const data = {
      companies,
      industries: Array.from(industries).sort()
    };
    
    // Write to JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
    
    console.log(`Conversion complete! ${companies.length} companies with ${companies.reduce((sum, company) => sum + company.contacts.length, 0)} contacts saved to ${jsonFilePath}`);
  });
