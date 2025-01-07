type ColumnMapping = {
  [key: string]: string[];
};

export const columnMappings: ColumnMapping = {
  cost_per_result: [
    'cost per results',
    'cost per result',
    'cost_per_result',
    'cost per results (dec'
  ],
  conversion_rate: [
    'conversion rate',
    'conversion_rate',
    'website purchases',
    'purchases'
  ],
  cpc: [
    'cost per outbound click',
    'cost per click',
    'cpc',
    'cost per link click'
  ],
  ctr: [
    'outbound ctr',
    'ctr',
    'click-through rate',
    'outbound click-through rate'
  ],
  cpm: [
    'cpm',
    'cost per 1,000 impressions',
    'cost per thousand impressions',
    'cpm (cost per'
  ],
  spend: [
    'amount spent',
    'spend',
    'cost',
    'amount spent (aud)'
  ],
  impressions: [
    'impressions',
    'impr.',
    'impr',
    'impressions ('
  ],
  clicks: [
    'clicks',
    'link clicks',
    'outbound clicks',
    'link clicks ('
  ],
  conversions: [
    'results',
    'conversions',
    'total conversions',
    'results ('
  ]
};

export function findMatchingColumn(headers: string[], targetColumn: string): string | null {
  const lowerHeaders = headers.map(h => h.toLowerCase().trim());
  
  // First try exact match
  const exactMatch = lowerHeaders.find(h => h === targetColumn.toLowerCase());
  if (exactMatch) {
    return headers[lowerHeaders.indexOf(exactMatch)];
  }
  
  // Then check mappings
  const possibleNames = columnMappings[targetColumn] || [];
  for (const name of possibleNames) {
    const index = lowerHeaders.findIndex(h => {
      // Remove date ranges and parentheses before matching
      const cleanHeader = h.replace(/\([^)]*\)/g, '').trim();
      return cleanHeader.includes(name.toLowerCase());
    });
    
    if (index !== -1) {
      return headers[index];
    }
  }
  
  // For spend columns, also check for currency indicators
  if (targetColumn === 'spend') {
    const index = lowerHeaders.findIndex(h => {
      const cleanHeader = h.replace(/\([^)]*\)/g, '').trim();
      return (cleanHeader.includes('aud') || cleanHeader.includes('$')) && 
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

export function extractDateRangeFromHeader(header: string): { isPrevious: boolean } {
  const cleanHeader = header.toLowerCase();
  
  // Check for explicit date ranges
  const previousDatePattern = /(dec 10|december 10)/i;
  const currentDatePattern = /(dec 24|december 24)/i;
  
  if (previousDatePattern.test(header)) {
    return { isPrevious: true };
  }
  
  if (currentDatePattern.test(header)) {
    return { isPrevious: false };
  }
  
  // Fallback to checking for previous period indicators
  const isPrevious = cleanHeader.includes('previous') || 
                    cleanHeader.includes('prior') || 
                    cleanHeader.includes('last') ||
                    /\([^)]*previous[^)]*\)/i.test(header);
  
  return { isPrevious };
}