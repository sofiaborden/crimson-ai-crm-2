import { useState, useCallback } from 'react';

interface SearchFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
  label: string;
}

interface SearchConfig {
  type: 'people' | 'money' | 'events' | 'pledges';
  filters: SearchFilter[];
  context: string;
}

export const useSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchConfig, setSearchConfig] = useState<SearchConfig>({
    type: 'people',
    filters: [],
    context: ''
  });

  const openSearch = useCallback((config: SearchConfig) => {
    setSearchConfig(config);
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  // Helper functions to create searches from dashboard cards
  const searchFromCard = useCallback((cardType: string, cardData: any) => {
    let config: SearchConfig;

    switch (cardType) {
      case 'total-people':
        config = {
          type: 'people',
          filters: [],
          context: `All People (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'donors-only':
        config = {
          type: 'people',
          filters: [{
            id: 'donor-filter',
            field: 'Donor Status',
            operator: 'equals',
            value: 'true',
            label: 'Is Donor'
          }],
          context: `Donors Only (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'major-donors':
        config = {
          type: 'people',
          filters: [
            {
              id: 'donor-filter',
              field: 'Donor Status',
              operator: 'equals',
              value: 'true',
              label: 'Is Donor'
            },
            {
              id: 'amount-filter',
              field: 'Total Gifts',
              operator: '>=',
              value: '1000',
              label: 'Total Gifts >= $1,000'
            }
          ],
          context: `Major Donors >$1K (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'lapsed-donors':
        config = {
          type: 'people',
          filters: [
            {
              id: 'donor-filter',
              field: 'Donor Status',
              operator: 'equals',
              value: 'true',
              label: 'Is Donor'
            },
            {
              id: 'lapsed-filter',
              field: 'Last Gift Date',
              operator: '<',
              value: '365 days ago',
              label: 'Last Gift > 1 year ago'
            }
          ],
          context: `Lapsed Donors (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'active-voters':
        config = {
          type: 'people',
          filters: [{
            id: 'voter-filter',
            field: 'Voter Status',
            operator: 'equals',
            value: 'Active',
            label: 'Active Voter'
          }],
          context: `Active Voters (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'republican-voters':
        config = {
          type: 'people',
          filters: [
            {
              id: 'voter-filter',
              field: 'Voter Status',
              operator: 'equals',
              value: 'Active',
              label: 'Active Voter'
            },
            {
              id: 'party-filter',
              field: 'Party',
              operator: 'equals',
              value: 'Republican',
              label: 'Republican'
            }
          ],
          context: `Republican Voters (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'missing-emails':
        config = {
          type: 'people',
          filters: [{
            id: 'email-filter',
            field: 'Email',
            operator: 'is empty',
            value: '',
            label: 'Missing Email'
          }],
          context: `Missing Emails (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'missing-phones':
        config = {
          type: 'people',
          filters: [{
            id: 'phone-filter',
            field: 'Phone',
            operator: 'is empty',
            value: '',
            label: 'Missing Phone'
          }],
          context: `Missing Phones (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'total-donations':
        config = {
          type: 'money',
          filters: [],
          context: `All Donations ($${cardData.amount?.toLocaleString() || '0'})`
        };
        break;

      case 'monthly-donations':
        config = {
          type: 'money',
          filters: [{
            id: 'date-filter',
            field: 'Gift Date',
            operator: 'within',
            value: 'current month',
            label: 'This Month'
          }],
          context: `Monthly Donations ($${cardData.amount?.toLocaleString() || '0'})`
        };
        break;

      case 'large-gifts':
        config = {
          type: 'money',
          filters: [{
            id: 'amount-filter',
            field: 'Gift Amount',
            operator: '>=',
            value: '1000',
            label: 'Amount >= $1,000'
          }],
          context: `Large Gifts >$1K ($${cardData.amount?.toLocaleString() || '0'})`
        };
        break;

      case 'recurring-gifts':
        config = {
          type: 'money',
          filters: [{
            id: 'recurring-filter',
            field: 'Gift Type',
            operator: 'equals',
            value: 'Recurring',
            label: 'Recurring Gift'
          }],
          context: `Recurring Gifts ($${cardData.amount?.toLocaleString() || '0'})`
        };
        break;

      case 'ai-segment':
        config = {
          type: 'people',
          filters: [{
            id: 'segment-filter',
            field: 'AI Segment',
            operator: 'equals',
            value: cardData.segmentId || 'unknown',
            label: `AI Segment: ${cardData.segmentId || 'Unknown'}`
          }],
          context: `AI Segment (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'new-donors':
        config = {
          type: 'people',
          filters: [
            {
              id: 'donor-filter',
              field: 'Donor Status',
              operator: 'equals',
              value: 'true',
              label: 'Is Donor'
            },
            {
              id: 'new-filter',
              field: 'First Gift Date',
              operator: 'within',
              value: 'current month',
              label: 'First Gift This Month'
            }
          ],
          context: `New Donors This Month (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'pledges-outstanding':
        config = {
          type: 'pledges',
          filters: [{
            id: 'status-filter',
            field: 'Status',
            operator: 'equals',
            value: 'Outstanding',
            label: 'Outstanding'
          }],
          context: `Outstanding Pledges ($${cardData.amount?.toLocaleString() || '220,510'})`
        };
        break;

      case 'pledges-overdue':
        config = {
          type: 'pledges',
          filters: [{
            id: 'status-filter',
            field: 'Status',
            operator: 'equals',
            value: 'Overdue',
            label: 'Overdue'
          }],
          context: `Overdue Pledges (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'pledges-due-soon':
        config = {
          type: 'pledges',
          filters: [{
            id: 'due-filter',
            field: 'Due Date',
            operator: 'within',
            value: '30 days',
            label: 'Due within 30 days'
          }],
          context: `Pledges Due Soon (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'large-pledges':
        config = {
          type: 'pledges',
          filters: [{
            id: 'amount-filter',
            field: 'Pledge Amount',
            operator: '>=',
            value: '1000',
            label: 'Pledge Amount >= $1,000'
          }],
          context: `Large Pledges >$1K (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'missing-contact':
        config = {
          type: 'people',
          filters: [{
            id: 'contact-filter',
            field: 'Contact Info',
            operator: 'is incomplete',
            value: '',
            label: 'Missing Contact Information'
          }],
          context: `Missing Contact Info (${cardData.percentage ? cardData.count + '%' : cardData.count?.toLocaleString() || '0'})`
        };
        break;

      // Geographic searches
      case 'location-state':
        config = {
          type: 'people',
          filters: [{
            id: 'state-filter',
            field: 'State',
            operator: 'equals',
            value: cardData.locationName || '',
            label: `State = ${cardData.locationName || 'Unknown'}`
          }],
          context: `People in ${cardData.locationName || 'Unknown'} (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'location-county':
        config = {
          type: 'people',
          filters: [{
            id: 'county-filter',
            field: 'County',
            operator: 'equals',
            value: cardData.locationName || '',
            label: `County = ${cardData.locationName || 'Unknown'}`
          }],
          context: `People in ${cardData.locationName || 'Unknown'} County (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'location-city':
        config = {
          type: 'people',
          filters: [{
            id: 'city-filter',
            field: 'City',
            operator: 'equals',
            value: cardData.locationName || '',
            label: `City = ${cardData.locationName || 'Unknown'}`
          }],
          context: `People in ${cardData.locationName || 'Unknown'} (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      // Category searches
      case 'category-flag':
        config = {
          type: 'people',
          filters: [{
            id: 'flag-filter',
            field: 'Flags',
            operator: 'contains',
            value: cardData.categoryName || '',
            label: `Flag: ${cardData.categoryName || 'Unknown'}`
          }],
          context: `People with ${cardData.categoryName || 'Unknown'} Flag (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'category-keyword':
        config = {
          type: 'people',
          filters: [{
            id: 'keyword-filter',
            field: 'Keywords',
            operator: 'contains',
            value: cardData.categoryName || '',
            label: `Keyword: ${cardData.categoryName || 'Unknown'}`
          }],
          context: `People with ${cardData.categoryName || 'Unknown'} Keyword (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      case 'category-club':
        config = {
          type: 'people',
          filters: [{
            id: 'club-filter',
            field: 'Clubs',
            operator: 'contains',
            value: cardData.categoryName || '',
            label: `Club: ${cardData.categoryName || 'Unknown'}`
          }],
          context: `People in ${cardData.categoryName || 'Unknown'} (${cardData.count?.toLocaleString() || '0'})`
        };
        break;

      default:
        config = {
          type: 'people',
          filters: [],
          context: 'Search Results'
        };
    }

    openSearch(config);
  }, [openSearch]);

  return {
    isSearchOpen,
    searchConfig,
    openSearch,
    closeSearch,
    searchFromCard
  };
};

export default useSearch;
