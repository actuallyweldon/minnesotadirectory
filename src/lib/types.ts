export interface Contact {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  directPhone: string;
}

export interface Company {
  name: string;
  dunsNumber: string;
  tradestyle: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  countryRegion: string;
  phone: string;
  companyEmail: string;
  fax: string;
  url: string;
  salesUSD: string;
  preTaxProfitUSD: string;
  assetsUSD: string;
  liabilitiesUSD: string;
  employeesSingleSite: string;
  employeesTotal: string;
  description: string;
  ownershipType: string;
  legalStatusType: string;
  entityType: string;
  isHeadquarters: boolean;
  ticker: string;
  parentCompany: string;
  parentCountryRegion: string;
  globalUltimateCompany: string;
  globalUltimateCountryRegion: string;
  industry: string;
  sicCode: string;
  sicDescription: string;
  sicCode1987: string;
  sicDescription1987: string;
  naicsCode: string;
  naicsDescription: string;
  ukSicCode: string;
  ukSicDescription: string;
  isicCode: string;
  isicDescription: string;
  naceCode: string;
  naceDescription: string;
  anzsicCode: string;
  anzsicDescription: string;
  contacts: Contact[];
}

export interface IndustryOption {
  value: string;
  label: string;
}
