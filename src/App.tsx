import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import CompanyGrid from './components/CompanyGrid';
import CompanyDetail from './components/CompanyDetail';
import { Company, IndustryOption } from './lib/types';
import './App.css';

interface HomePageProps {
  companies: Company[];
  filteredCompanies: Company[];
  industries: IndustryOption[];
  loading: boolean;
  error: string | null;
  handleSearch: (query: string) => void;
  handleIndustryChange: (industry: string) => void;
}

function HomePage({ filteredCompanies, industries, loading, error, handleSearch, handleIndustryChange }: HomePageProps) {
  return (
    <>
      <header className="header">
        <div className="logo-container">
          <img src="/images/minnesotadirectorylogo.png" alt="Minnesota Directory" className="logo-image" />
        </div>
      </header>
      
      <main className="main-content">
        <SearchBar 
          onSearch={handleSearch}
          onIndustryChange={handleIndustryChange}
          industries={industries}
          totalCompanies={filteredCompanies.length}
        />
        
        {error && (
          <div className="error-message">
            Error loading data: {error}
          </div>
        )}
        
        <CompanyGrid 
          companies={filteredCompanies}
          loading={loading}
        />
      </main>
    </>
  );
}

interface DetailPageWrapperProps {
  companies: Company[];
}

function DetailPageWrapper({ companies }: DetailPageWrapperProps) {
  const { id } = useParams<{ id: string }>();
  // Updated to use dunsNumber as the identifier if available, falling back to name
  const company = companies.find(c => 
    (c.dunsNumber && c.dunsNumber === id) || 
    c.name === decodeURIComponent(id || '')
  );
  
  if (!company) {
    return <div className="loading-container">Company not found</div>;
  }
  
  return <CompanyDetail company={company} />;
}

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<IndustryOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const jsonUrl = `/companies_data.json?t=${timestamp}`;
        
        console.log(`Fetching JSON data from: ${jsonUrl}`);
        
        // Fetch the JSON file
        const response = await fetch(jsonUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON data: ${response.status} ${response.statusText}`);
        }
        
        console.log('JSON fetch successful, parsing data...');
        const data = await response.json();
        
        if (!data || !data.companies || !Array.isArray(data.companies)) {
          throw new Error('Invalid JSON data format');
        }
        
        console.log(`Loaded ${data.companies.length} companies with ${data.companies.reduce((sum: number, company: Company) => sum + (company.contacts?.length || 0), 0)} contacts`);
        
        // Log a sample company if available
        if (data.companies.length > 0) {
          console.log('Sample company:', data.companies[0].name);
        }
        
        setCompanies(data.companies);
        setFilteredCompanies(data.companies);
        
        // Use industries from JSON if available, otherwise extract from companies
        if (data.industries && Array.isArray(data.industries)) {
          console.log(`Using ${data.industries.length} pre-extracted industries from JSON`);
          const industryOptions = data.industries.map((industry: string) => ({
            value: industry,
            label: industry
          }));
          setIndustries(industryOptions);
        } else {
          console.log('Extracting industries from companies data...');
          // Extract unique industries
          const uniqueIndustries = new Set<string>();
          data.companies.forEach((company: Company) => {
            if (company.industry) {
              uniqueIndustries.add(company.industry);
            }
          });
          
          const industryOptions = Array.from(uniqueIndustries).sort().map(industry => ({
            value: industry,
            label: industry
          }));
          
          console.log(`Extracted ${uniqueIndustries.size} unique industries`);
          setIndustries(industryOptions);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching or parsing data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error loading data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    // Filter companies based on search query and selected industry
    let filtered = [...companies];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(query) || 
        (company.description && company.description.toLowerCase().includes(query)) ||
        // Also search in contacts if available
        (company.contacts && company.contacts.some(contact => 
          contact.firstName.toLowerCase().includes(query) || 
          contact.lastName.toLowerCase().includes(query) ||
          contact.title.toLowerCase().includes(query)
        ))
      );
    }
    
    if (selectedIndustry) {
      filtered = filtered.filter(company => company.industry === selectedIndustry);
    }
    
    setFilteredCompanies(filtered);
  }, [searchQuery, selectedIndustry, companies]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
  };

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                companies={companies}
                filteredCompanies={filteredCompanies}
                industries={industries}
                loading={loading}
                error={error}
                handleSearch={handleSearch}
                handleIndustryChange={handleIndustryChange}
              />
            } 
          />
          <Route 
            path="/company/:id" 
            element={<DetailPageWrapper companies={companies} />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
