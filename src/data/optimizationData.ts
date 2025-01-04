export const categories = [
  "Creative",
  "Targeting",
  "Bidding Strategy",
  "Budget Allocation",
  "Audience",
  "Conversion Setup",
  "Ad Copy",
  "Landing Page",
];

export const kpisByPlatform = {
  facebook: ["CPC", "CPM", "CTR", "ROAS", "CPA"],
  google: ["CPC", "Impression Share", "Quality Score", "CTR", "Conversion Rate"],
};

export const optimizationSuggestions = {
  facebook: {
    CPM: [
      "Broaden audience targeting to increase reach and lower CPM",
      "Optimize ad placements to focus on lower-cost inventory",
      "Adjust campaign schedule to off-peak hours",
    ],
    CPC: [
      "Improve ad relevance score through better creative-audience matching",
      "Test different ad formats to find most cost-effective option",
      "Optimize bidding strategy based on click-through rate patterns",
    ],
    CTR: [
      "Test different ad creatives with compelling call-to-actions",
      "Refine audience targeting based on engagement metrics",
      "Optimize ad placement and format for better visibility",
    ],
    ROAS: [
      "Implement value-based lookalike audiences",
      "Adjust campaign budget based on top-performing demographics",
      "Optimize creative elements based on conversion data",
    ],
    CPA: [
      "Optimize targeting based on historical conversion data",
      "Test different bidding strategies to lower acquisition costs",
      "Refine audience segments based on conversion propensity",
    ],
  },
  google: {
    CPC: [
      "Improve keyword quality scores through ad relevance",
      "Optimize bid adjustments based on performance data",
      "Test different match types for better targeting",
    ],
    "Quality Score": [
      "Improve ad relevance by aligning keywords with ad copy",
      "Optimize landing page experience for selected keywords",
      "Structure ad groups with tighter keyword themes",
    ],
    "Impression Share": [
      "Review and adjust bid strategy for key terms",
      "Expand budget for high-performing campaigns",
      "Optimize ad scheduling for peak performance periods",
    ],
    CTR: [
      "Test different ad copy variations and extensions",
      "Improve keyword-to-ad relevance",
      "Optimize ad position through bid adjustments",
    ],
    "Conversion Rate": [
      "Optimize landing page experience for better conversions",
      "Test different call-to-action variations",
      "Implement audience targeting based on conversion data",
    ],
  },
};