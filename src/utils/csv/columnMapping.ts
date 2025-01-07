type ColumnMapping = {
  [key: string]: string[];
};

export const columnMappings: ColumnMapping = {
  date: [
    'reporting starts',
    'reporting ends',
    'date range',
    'day',
    'reporting date',
    'start date',
    'end date',
    'period'
  ],
  spend: [
    'cost',
    'amount spent',
    'total spend',
    'ad spend',
    'campaign spend',
    'budget spent',
    'investment',
    'media cost',
    'media spend'
  ],
  impressions: [
    'impr.',
    'impr',
    'total impressions',
    'ad impressions',
    'views',
    'total views',
    'reach',
    'total reach',
    'served impressions'
  ],
  clicks: [
    'total clicks',
    'ad clicks',
    'link clicks',
    'all clicks',
    'click-through',
    'click through',
    'clickthrough',
    'total link clicks'
  ],
  conversions: [
    'conv.',
    'conv',
    'total conversions',
    'results',
    'total results',
    'conversion',
    'purchases',
    'total purchases',
    'actions',
    'total actions'
  ]
};

export function findMatchingColumn(headers: string[], targetColumn: string): string | null {
  // Convert headers to lowercase for case-insensitive matching
  const lowerHeaders = headers.map(h => h.toLowerCase());
  
  // First try exact match
  const exactMatch = lowerHeaders.find(h => h === targetColumn);
  if (exactMatch) {
    return headers[lowerHeaders.indexOf(exactMatch)];
  }
  
  // Then check mappings
  const possibleNames = columnMappings[targetColumn] || [];
  for (const name of possibleNames) {
    // Find any header that contains the mapping name, ignoring date ranges in parentheses
    const index = lowerHeaders.findIndex(h => {
      // Remove date ranges in parentheses before matching
      const cleanHeader = h.replace(/\([^)]*\)/g, '').trim();
      return cleanHeader.includes(name.toLowerCase());
    });
    
    if (index !== -1) {
      return headers[index];
    }
  }
  
  // For spend/cost columns, also check for currency indicators
  if (targetColumn === 'spend') {
    const index = lowerHeaders.findIndex(h => {
      const cleanHeader = h.replace(/\([^)]*\)/g, '').trim();
      return cleanHeader.includes('aud') && 
             (cleanHeader.includes('amount') || 
              cleanHeader.includes('cost') || 
              cleanHeader.includes('spend'));
    });
    if (index !== -1) {
      return headers[index];
    }
  }
  
  return null;
}