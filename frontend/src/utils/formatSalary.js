/**
 * Format salary amounts in Indian Rupees (INR)
 * @param {number} min - Minimum salary
 * @param {number} max - Maximum salary
 * @returns {string} Formatted salary string
 */
export const formatSalary = (min, max) => {
  if (!min && !max) return 'Salary not specified';
  
  const formatAmount = (amount) => {
    if (amount >= 10000000) { // 1 crore and above
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh and above
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) { // 1 thousand and above
      return `₹${(amount / 1000).toFixed(0)}K`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  if (min && max) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }
  if (min) {
    return `From ${formatAmount(min)}`;
  }
  if (max) {
    return `Up to ${formatAmount(max)}`;
  }
};

/**
 * Format salary for display with full number format
 * @param {number} min - Minimum salary
 * @param {number} max - Maximum salary
 * @returns {string} Formatted salary string with full numbers
 */
export const formatSalaryFull = (min, max) => {
  if (!min && !max) return 'Salary not specified';
  
  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (min && max) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }
  if (min) {
    return `From ${formatAmount(min)}`;
  }
  if (max) {
    return `Up to ${formatAmount(max)}`;
  }
};