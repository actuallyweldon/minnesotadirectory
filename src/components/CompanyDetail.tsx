import { Company } from '../lib/types';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import './CompanyDetail.css';

interface CompanyDetailProps {
  company: Company;
}

const CompanyDetail = ({ company }: CompanyDetailProps) => {
  return (
    <div className="company-detail-container">
      <div className="back-button-container">
        <Link to="/" className="back-button">
          ← Back to Directory
        </Link>
      </div>
      
      <div className="company-detail-header">
        <h1 className="company-detail-name">
          {company.name}
          {company.isHeadquarters && <span className="hq-badge">HQ</span>}
        </h1>
        <div className="company-detail-industry">{company.industry}</div>
      </div>
      
      <div className="company-detail-content">
        {/* Description Section - Moved higher as requested */}
        {company.description && (
          <div className="company-detail-section">
            <h2 className="section-title">Description</h2>
            <p className="company-description">{company.description}</p>
          </div>
        )}
        
        {/* Company Location Section */}
        <div className="company-detail-section">
          <h2 className="section-title">Company Information</h2>
          
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Location</span>
              <span className="detail-value">
                {company.addressLine1}
                {company.addressLine2 && <span><br />{company.addressLine2}</span>}
                {company.addressLine3 && <span><br />{company.addressLine3}</span>}
                <br />
                {company.city}, {company.stateOrProvince} {company.postalCode}
                <br />
                {company.countryRegion}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Contact</span>
              <span className="detail-value">
                {company.phone && <div>Phone: {company.phone}</div>}
                {company.fax && <div>Fax: {company.fax}</div>}
                {company.companyEmail && <div>Email: {company.companyEmail}</div>}
                {company.url && <div>Website: <a href={company.url.startsWith('http') ? company.url : `http://${company.url}`} target="_blank" rel="noopener noreferrer">{company.url}</a></div>}
              </span>
            </div>
          </div>
        </div>
        
        {/* Financial Section with Emphasized Metrics */}
        <div className="company-detail-section">
          <h2 className="section-title">Financial Information</h2>
          
          <div className="financial-metrics">
            {company.salesUSD && (
              <div className="metric-card">
                <div className="metric-value">{formatCurrency(company.salesUSD)}</div>
                <div className="metric-label">Annual Sales</div>
              </div>
            )}
            
            {company.preTaxProfitUSD && (
              <div className="metric-card">
                <div className="metric-value">{formatCurrency(company.preTaxProfitUSD)}</div>
                <div className="metric-label">Pre-Tax Profit</div>
              </div>
            )}
            
            {company.assetsUSD && (
              <div className="metric-card">
                <div className="metric-value">{formatCurrency(company.assetsUSD)}</div>
                <div className="metric-label">Assets</div>
              </div>
            )}
            
            {company.liabilitiesUSD && (
              <div className="metric-card">
                <div className="metric-value">{formatCurrency(company.liabilitiesUSD)}</div>
                <div className="metric-label">Liabilities</div>
              </div>
            )}
            
            {company.employeesTotal && (
              <div className="metric-card">
                <div className="metric-value">{company.employeesTotal}</div>
                <div className="metric-label">Total Employees</div>
              </div>
            )}
            
            {company.employeesSingleSite && (
              <div className="metric-card">
                <div className="metric-value">{company.employeesSingleSite}</div>
                <div className="metric-label">Site Employees</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Organization Section */}
        <div className="company-detail-section">
          <h2 className="section-title">Organization</h2>
          
          <div className="organization-info">
            {company.ownershipType && (
              <div className="org-item">
                <div className="org-label">Ownership</div>
                <div className="org-value">{company.ownershipType}</div>
              </div>
            )}
            
            {company.legalStatusType && (
              <div className="org-item">
                <div className="org-label">Legal Status</div>
                <div className="org-value">{company.legalStatusType}</div>
              </div>
            )}
            
            {company.entityType && (
              <div className="org-item">
                <div className="org-label">Entity Type</div>
                <div className="org-value">{company.entityType}</div>
              </div>
            )}
            
            {company.ticker && (
              <div className="org-item">
                <div className="org-label">Ticker</div>
                <div className="org-value">{company.ticker}</div>
              </div>
            )}
            
            {company.dunsNumber && (
              <div className="org-item">
                <div className="org-label">D-U-N-S® Number</div>
                <div className="org-value">{company.dunsNumber}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Corporate Structure Section */}
        {(company.parentCompany || company.globalUltimateCompany) && (
          <div className="company-detail-section">
            <h2 className="section-title">Corporate Structure</h2>
            
            <div className="detail-grid">
              {company.parentCompany && (
                <div className="detail-item">
                  <span className="detail-label">Parent Company</span>
                  <span className="detail-value">
                    {company.parentCompany} ({company.parentCountryRegion})
                  </span>
                </div>
              )}
              
              {company.globalUltimateCompany && (
                <div className="detail-item">
                  <span className="detail-label">Global Ultimate</span>
                  <span className="detail-value">
                    {company.globalUltimateCompany} ({company.globalUltimateCountryRegion})
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Industry Classification Section */}
        <div className="company-detail-section">
          <h2 className="section-title">Industry Classification</h2>
          
          <div className="detail-grid">
            {company.sicCode && (
              <div className="detail-item">
                <span className="detail-label">SIC</span>
                <span className="detail-value">
                  {company.sicCode} - {company.sicDescription}
                </span>
              </div>
            )}
            
            {company.naicsCode && (
              <div className="detail-item">
                <span className="detail-label">NAICS</span>
                <span className="detail-value">
                  {company.naicsCode} - {company.naicsDescription}
                </span>
              </div>
            )}
            
            {company.ukSicCode && (
              <div className="detail-item">
                <span className="detail-label">UK SIC</span>
                <span className="detail-value">
                  {company.ukSicCode} - {company.ukSicDescription}
                </span>
              </div>
            )}
            
            {company.isicCode && (
              <div className="detail-item">
                <span className="detail-label">ISIC</span>
                <span className="detail-value">
                  {company.isicCode} - {company.isicDescription}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Contacts Section with LinkedIn buttons */}
        {company.contacts && company.contacts.length > 0 && (
          <div className="company-detail-section contacts-section">
            <h2 className="section-title">
              Contacts ({company.contacts.length})
              <a 
                href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(company.name)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="linkedin-company-button"
              >
                Search on LinkedIn
              </a>
            </h2>
            <div className="contacts-grid">
              {company.contacts.map((contact, index) => (
                <div key={index} className="contact-card">
                  <div className="contact-name">{contact.firstName} {contact.lastName}</div>
                  {contact.title && <div className="contact-title">{contact.title}</div>}
                  <div className="contact-details">
                    {contact.email && <div className="contact-email"><span>Email:</span> {contact.email}</div>}
                    {contact.directPhone && <div className="contact-phone"><span>Direct:</span> {contact.directPhone}</div>}
                    <a 
                      href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(`${contact.firstName} ${contact.lastName} ${company.name}`)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="linkedin-contact-button"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
