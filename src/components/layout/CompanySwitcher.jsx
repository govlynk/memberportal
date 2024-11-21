import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Chip,
} from '@mui/material';
import { Building2 } from 'lucide-react';
import { useUserCompanyStore } from '../../stores/userCompanyStore';

export function CompanySwitcher() {
  const { 
    userCompanies, 
    activeCompanyId,
    setActiveCompany,
    loading 
  } = useUserCompanyStore();

  if (loading || userCompanies.length === 0) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 2,
      minWidth: 300,
      maxWidth: 400
    }}>
      <Building2 size={20} />
      <FormControl fullWidth size="small">
        <Select
          value={activeCompanyId || ''}
          onChange={(e) => setActiveCompany(e.target.value)}
          displayEmpty
          renderValue={(selected) => {
            const company = userCompanies.find(c => c.id === selected);
            if (!company) return <Typography color="text.secondary">Select a company</Typography>;
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" noWrap>
                  {company.legalBusinessName}
                </Typography>
                <Chip
                  label={company.roleId}
                  size="small"
                  sx={{ ml: 'auto' }}
                />
              </Box>
            );
          }}
          sx={{ 
            '& .MuiSelect-select': { 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 1
            }
          }}
        >
          {userCompanies.map((company) => (
            <MenuItem 
              key={company.id} 
              value={company.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Typography variant="body2" noWrap>
                {company.legalBusinessName}
              </Typography>
              <Chip
                label={company.roleId}
                size="small"
                sx={{ ml: 'auto' }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}