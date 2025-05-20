import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Company } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number): string {
  if (!value) return '$0';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '$0';
  
  // Format based on size
  if (numValue >= 1e9) {
    return `$${(numValue / 1e9).toFixed(1)}B`;
  } else if (numValue >= 1e6) {
    return `$${(numValue / 1e6).toFixed(1)}M`;
  } else if (numValue >= 1e3) {
    return `$${(numValue / 1e3).toFixed(1)}K`;
  } else {
    return `$${numValue.toFixed(2)}`;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export async function loadJSONData(): Promise<{companies: Company[], industries: string[]}> {
  try {
    // Add cache-busting timestamp to prevent browser caching
    const timestamp = new Date().getTime();
    const response = await fetch(`/companies_data.json?t=${timestamp}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON data: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading JSON data:', error);
    throw error;
  }
}

export function getUniqueIndustries(companies: Company[]): string[] {
  const industries = new Set<string>();
  
  companies.forEach(company => {
    if (company.industry) {
      industries.add(company.industry);
    }
  });
  
  return Array.from(industries).sort();
}
