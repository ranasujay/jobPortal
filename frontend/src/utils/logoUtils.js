/**
 * Utility functions for handling company logos
 */

/**
 * Generate a default logo URL based on company name
 * @param {string} companyName - The name of the company
 * @param {string} backgroundColor - Hex color code for background (default: blue)
 * @param {number} size - Size of the logo in pixels (default: 200)
 * @returns {string} - URL for the generated logo
 */
export const generateDefaultLogo = (companyName, backgroundColor = '3b82f6', size = 200) => {
  if (!companyName) {
    return `https://ui-avatars.com/api/?name=Company&size=${size}&background=${backgroundColor}&color=ffffff&bold=true&format=png`;
  }

  const encodedName = encodeURIComponent(companyName);
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=${backgroundColor}&color=ffffff&bold=true&format=png`;
};

/**
 * Generate a fallback logo URL (gray background)
 * @param {string} companyName - The name of the company
 * @param {number} size - Size of the logo in pixels (default: 200)
 * @returns {string} - URL for the fallback logo
 */
export const generateFallbackLogo = (companyName, size = 200) => {
  return generateDefaultLogo(companyName, '6b7280', size);
};

/**
 * Get company logo with proper fallbacks
 * @param {string} logoUrl - The original logo URL
 * @param {string} companyName - The name of the company
 * @param {number} size - Size of the logo in pixels (default: 200)
 * @returns {string} - URL for the logo to display
 */
export const getCompanyLogo = (logoUrl, companyName, size = 200) => {
  if (logoUrl && logoUrl !== '' && !logoUrl.includes('placeholder')) {
    return logoUrl;
  }
  
  return generateDefaultLogo(companyName, '3b82f6', size);
};

/**
 * Color palette for different company types
 */
export const LOGO_COLORS = {
  technology: '3b82f6', // Blue
  healthcare: '10b981', // Green
  finance: '8b5cf6',    // Purple
  education: 'f59e0b',  // Amber
  retail: 'ef4444',     // Red
  consulting: '6366f1', // Indigo
  manufacturing: '84cc16', // Lime
  default: '3b82f6'     // Blue
};

/**
 * Generate industry-specific logo color
 * @param {string} industry - The industry type
 * @returns {string} - Hex color code
 */
export const getIndustryColor = (industry) => {
  if (!industry) return LOGO_COLORS.default;
  
  const industryLower = industry.toLowerCase();
  
  if (industryLower.includes('tech') || industryLower.includes('software') || industryLower.includes('it')) {
    return LOGO_COLORS.technology;
  }
  if (industryLower.includes('health') || industryLower.includes('medical') || industryLower.includes('pharma')) {
    return LOGO_COLORS.healthcare;
  }
  if (industryLower.includes('finance') || industryLower.includes('bank') || industryLower.includes('investment')) {
    return LOGO_COLORS.finance;
  }
  if (industryLower.includes('education') || industryLower.includes('school') || industryLower.includes('university')) {
    return LOGO_COLORS.education;
  }
  if (industryLower.includes('retail') || industryLower.includes('ecommerce') || industryLower.includes('shop')) {
    return LOGO_COLORS.retail;
  }
  if (industryLower.includes('consulting') || industryLower.includes('advisory')) {
    return LOGO_COLORS.consulting;
  }
  if (industryLower.includes('manufacturing') || industryLower.includes('production')) {
    return LOGO_COLORS.manufacturing;
  }
  
  return LOGO_COLORS.default;
};