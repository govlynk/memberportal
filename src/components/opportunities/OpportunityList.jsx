import React from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { OpportunityCard } from './OpportunityCard';
import { useOpportunityStore } from '../../stores/opportunityStore';

export function OpportunityList() {
  const { opportunities, loading } = useOpportunityStore();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!opportunities.length) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
        No opportunities found. Try adjusting your search criteria.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {opportunities.map((opportunity) => (
        <Grid item xs={12} md={6} lg={4} key={opportunity.noticeId}>
          <OpportunityCard opportunity={opportunity} />
        </Grid>
      ))}
    </Grid>
  );
}