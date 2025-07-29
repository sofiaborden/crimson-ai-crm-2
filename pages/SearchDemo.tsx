import React, { useState } from 'react';
import PeopleSearch from '../components/search/PeopleSearch';
import PledgesSearch from '../components/search/PledgesSearch';
import SearchModal from '../components/search/SearchModal';
import { useSearch } from '../hooks/useSearch';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  MagnifyingGlassIcon,
  UsersIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ClockIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CalendarIcon
} from '../constants';

const SearchDemo: React.FC = () => {
  const { isSearchOpen, searchConfig, closeSearch, searchFromCard } = useSearch();
  const [showInlineSearch, setShowInlineSearch] = useState(false);
  const [showInlinePledges, setShowInlinePledges] = useState(false);

  // Mock dashboard cards data
  const dashboardCards = [
    {
      id: 'total-people',
      title: 'Total People',
      value: '245,678',
      icon: UsersIcon,
      count: 245678,
      description: 'All people in your database'
    },
    {
      id: 'donors-only',
      title: 'All-Time Donors',
      value: '199,138',
      icon: CurrencyDollarIcon,
      count: 199138,
      description: 'People who have made donations'
    },
    {
      id: 'major-donors',
      title: 'Major Donors >$1K',
      value: '12,847',
      icon: SparklesIcon,
      count: 12847,
      description: 'High-value donors'
    },
    {
      id: 'lapsed-donors',
      title: 'Lapsed Donors',
      value: '8,923',
      icon: ClockIcon,
      count: 8923,
      description: 'Donors who haven\'t given recently'
    },
    {
      id: 'republican-voters',
      title: 'Republican Voters',
      value: '156,234',
      icon: MapPinIcon,
      count: 156234,
      description: 'Registered Republican voters'
    },
    {
      id: 'missing-emails',
      title: 'Missing Emails',
      value: '58,912',
      icon: EnvelopeIcon,
      count: 58912,
      description: 'People without email addresses'
    },
    {
      id: 'missing-phones',
      title: 'Missing Phones',
      value: '93,346',
      icon: PhoneIcon,
      count: 93346,
      description: 'People without phone numbers'
    },
    {
      id: 'active-voters',
      title: 'Active Voters',
      value: '189,567',
      icon: ExclamationTriangleIcon,
      count: 189567,
      description: 'Actively registered voters'
    },
    {
      id: 'pledges-outstanding',
      title: 'Outstanding Pledges',
      value: '$220,510',
      icon: CalendarIcon,
      count: 220510,
      description: 'Pledges awaiting payment'
    },
    {
      id: 'pledges-overdue',
      title: 'Overdue Pledges',
      value: '23',
      icon: ExclamationTriangleIcon,
      count: 23,
      description: 'Pledges past due date'
    }
  ];

  const DashboardCard: React.FC<{
    card: typeof dashboardCards[0];
  }> = ({ card }) => (
    <Card 
      className="p-4 hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-crimson-blue"
      onClick={() => searchFromCard(card.id, { count: card.count })}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 group-hover:text-crimson-blue transition-colors">
            {card.title}
          </p>
          <p className="text-2xl font-bold text-gray-900 group-hover:text-crimson-blue transition-colors">
            {card.value}
          </p>
          <p className="text-xs text-gray-500 mt-1">{card.description}</p>
        </div>
        <div className="flex flex-col items-end">
          <card.icon className="w-8 h-8 text-crimson-blue mb-2 group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center text-xs text-crimson-blue bg-blue-50 px-2 py-1 rounded">
          <MagnifyingGlassIcon className="w-3 h-3 mr-1" />
          Click to search this segment
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 Enhanced Search System Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the new AI-powered search that seamlessly connects dashboard insights to intelligent search results. 
            Click any card below to see contextual search in action.
          </p>
        </div>

        {/* Demo Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setShowInlineSearch(!showInlineSearch)}
            variant={showInlineSearch ? "primary" : "secondary"}
          >
            {showInlineSearch ? 'Hide' : 'Show'} People Search
          </Button>
          <Button
            onClick={() => setShowInlinePledges(!showInlinePledges)}
            variant={showInlinePledges ? "primary" : "secondary"}
          >
            {showInlinePledges ? 'Hide' : 'Show'} Pledges Search
          </Button>
        </div>

        {/* Inline Search Demo */}
        {showInlineSearch && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">People Search Experience</h2>
            <PeopleSearch />
          </Card>
        )}

        {/* Inline Pledges Search Demo */}
        {showInlinePledges && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pledges Search Experience</h2>
            <PledgesSearch />
          </Card>
        )}

        {/* Dashboard Cards Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Interactive Dashboard Cards
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Click any card to trigger a contextual search with pre-applied filters
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {dashboardCards.map((card) => (
              <DashboardCard key={card.id} card={card} />
            ))}
          </div>
        </div>

        {/* Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">AI-Powered Suggestions</h3>
              <p className="text-sm text-blue-800">
                Smart search suggestions and contextual filters based on your query patterns and data insights.
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Contextual Search</h3>
              <p className="text-sm text-green-800">
                Dashboard cards automatically trigger relevant searches with pre-applied filters for instant insights.
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Smart Segments</h3>
              <p className="text-sm text-purple-800">
                Create and save intelligent segments with AI-suggested criteria for maximum fundraising impact.
              </p>
            </div>
          </Card>
        </div>

        {/* Key Improvements */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Improvements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 UI/UX Enhancements</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Modern Crimson brand colors throughout</li>
                <li>• Rounded, clean card designs</li>
                <li>• Hover animations and visual feedback</li>
                <li>• Responsive design for all devices</li>
                <li>• Intuitive filter management</li>
                <li>• Quick action buttons with tooltips</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Smart search suggestions as you type</li>
                <li>• AI-powered result summaries</li>
                <li>• Predictive segment creation</li>
                <li>• CrimsonGPT natural language queries</li>
                <li>• Contextual insights and recommendations</li>
                <li>• Automated filter suggestions</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-gradient-to-r from-crimson-blue/10 to-blue-100 border-crimson-blue/20">
          <h3 className="text-lg font-semibold text-crimson-blue mb-3">💡 Try It Out!</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>1.</strong> Click any dashboard card above to see contextual search in action</p>
            <p><strong>2.</strong> Use the "Show Inline Search" button to explore the full search interface</p>
            <p><strong>3.</strong> Try the AI suggestions and advanced filtering options</p>
            <p><strong>4.</strong> Notice how filters are automatically applied based on the card you clicked</p>
          </div>
        </Card>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        searchType={searchConfig.type}
        initialFilters={searchConfig.filters}
        searchContext={searchConfig.context}
      />
    </div>
  );
};

export default SearchDemo;
