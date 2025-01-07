type ColumnMapping = {
  [key: string]: string[];
};

export const columnMappings: ColumnMapping = {
  cost_per_result: [
    'cost per results',
    'cost per result',
    'cost_per_result',
    'cost per purchase'
  ],
  conversion_rate: [
    'website purchases',
    'conversion rate',
    'conversion_rate',
    'website purchase'
  ],
  cpc: [
    'cost per outbound click',
    'cost per link click',
    'cost per click',
    'cpc'
  ],
  ctr: [
    'outbound ctr',
    'click-through rate',
    'ctr',
    'outbound click-through rate'
  ],
  cpm: [
    'cpm',
    'cost per 1,000 impressions',
    'cost per thousand impressions'
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
    'impr'
  ],
  clicks: [
    'link clicks',
    'clicks',
    'outbound clicks'
  ],
  conversions: [
    'results',
    'conversions',
    'purchases',
    'website purchases'
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
      return cleanHeader.toLowerCase().includes(name.toLowerCase());
    });
    
    if (index !== -1) {
      return headers[index];
    }
  }
  
  return null;
}

export function extractDateRangeFromHeader(header: string): { isPrevious: boolean } {
  const cleanHeader = header.toLowerCase();
  
  // Check for date ranges in the format (Dec 10-23) vs (Dec 24-Jan 6)
  if (cleanHeader.includes('dec 10') || cleanHeader.includes('dec 23')) {
    return { isPrevious: true };
  }
  
  if (cleanHeader.includes('dec 24') || cleanHeader.includes('jan 6')) {
    return { isPrevious: false };
  }
  
  // Fallback to checking for previous period indicators
  const isPrevious = cleanHeader.includes('previous') || 
                    cleanHeader.includes('prior') || 
                    cleanHeader.includes('last');
  
  return { isPrevious };
}
