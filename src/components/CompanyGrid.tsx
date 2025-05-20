import { Company } from '../lib/types';
import { Link } from 'react-router-dom';
import { formatCurrency, truncateText } from '../lib/utils';

interface CompanyGridProps {
  companies: Company[];
  loading: boolean;
}

const CompanyGrid = ({ companies, loading }: CompanyGridProps) => {
  if (loading) {
    return <div className="loading-container">Loading companies...</div>;
  }

  if (companies.length === 0) {
    return <div className="no-results">No companies found matching your criteria.</div>;
  }

  return (
    <div className="company-grid">
      {companies.map((company, index) => (
        <div key={index} className="company-card">
          <div className="company-header">
            <h2 className="company-name">{company.name}</h2>
            {company.isHeadquarters && <span className="hq-badge">HQ</span>}
            {company.contacts && company.contacts.length > 0 && 
              <span className="contacts-badge">{company.contacts.length} {company.contacts.length === 1 ? 'Contact' : 'Contacts'}</span>
            }
          </div>
          <div className="company-industry">{company.industry}</div>
          <div className="company-details">
            <div className="detail-item">
              <span className="detail-label">Location:</span> {company.city}, {company.stateOrProvince}
            </div>
            <div className="detail-item">
              <span className="detail-label">Employees:</span> {company.employeesTotal}
            </div>
            <div className="detail-item">
              <span className="detail-label">Sales:</span> {formatCurrency(company.salesUSD)}
            </div>
          </div>
          <div className="company-description">
            {truncateText(company.description, 200)}
          </div>
          <div className="view-details">
            <Link 
              to={`/company/${company.dunsNumber}`} 
              className="view-details-link"
            >
              View Details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyGrid;
