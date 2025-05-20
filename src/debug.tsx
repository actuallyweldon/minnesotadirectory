import { useState, useEffect } from 'react';
import { loadJSONData } from './lib/utils';

function DebugDataLoader() {
  const [loading, setLoading] = useState(true);
  const [companyCount, setCompanyCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Starting data fetch...");
        
        // Fetch JSON data
        console.log("Fetching JSON data...");
        const data = await loadJSONData();
        
        console.log(`JSON data loaded, companies count: ${data.companies.length}`);
        
        // Count total contacts
        const totalContacts = data.companies.reduce((sum, company) => sum + company.contacts.length, 0);
        console.log(`Total contacts: ${totalContacts}`);
        
        setCompanyCount(data.companies.length);
        setContactCount(totalContacts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : String(error));
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Data Loading Debug</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <div style={{ color: 'red' }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <h2>Data Loaded Successfully</h2>
          <p>Total unique companies: {companyCount}</p>
          <p>Total contacts: {contactCount}</p>
        </div>
      )}
    </div>
  );
}

export default DebugDataLoader;
