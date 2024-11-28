import React from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { OpportunitySearch } from '../components/opportunities/OpportunitySearch';
import { OpportunityList } from '../components/opportunities/OpportunityList';
import { useOpportunityStore } from '../stores/opportunityStore';

export default function OpportunitiesScreen() {
  const [activeTab, setActiveTab] = React.useState(0);
  const { opportunities, savedOpportunities, rejectedOpportunities } = useOpportunityStore();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Contract Opportunities
      </Typography>

      <OpportunitySearch />

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab 
          label={`New (${opportunities.length})`}
          id="opportunities-tab-0"
        />
        <Tab 
          label={`Saved (${savedOpportunities.length})`}
          id="opportunities-tab-1"
        />
        <Tab 
          label={`Rejected (${rejectedOpportunities.length})`}
          id="opportunities-tab-2"
        />
      </Tabs>

      <Box role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && <OpportunityList opportunities={opportunities} />}
      </Box>

      <Box role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && <OpportunityList opportunities={savedOpportunities} />}
      </Box>

      <Box role="tabpanel" hidden={activeTab !== 2}>
        {activeTab === 2 && <OpportunityList opportunities={rejectedOpportunities} />}
      </Box>
    </Box>
  );
}