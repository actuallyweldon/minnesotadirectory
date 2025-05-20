import { Company } from '../lib/types';
import { formatCurrency, truncateText } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import './CompanyCard.css';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/company/${company.dunsNumber}`);
  };
  
  return (
    <div 
      className="company-card" 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View details for ${company.name}`}
    >
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
          <span className="detail-label">Location:</span> 
          <span className="detail-value">{company.city}, {company.stateOrProvince}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Employees:</span> 
          <span className="detail-value">{company.employeesTotal}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Sales:</span> 
          <span className="detail-value">{formatCurrency(company.salesUSD)}</span>
        </div>
      </div>
      
      <div className="company-description">
        {truncateText(company.description, 200)}
      </div>
      
      <div className="view-details-link">
        View Details →
      </div>
    </div>
  );
};

export default CompanyCard;
