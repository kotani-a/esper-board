import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export default function BuffsPopOver(props) {
  return (
    <>
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={props.open}
        anchorEl={props.anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={props.handlePopoverClose}
        disableRestoreFocus
      >
        {props.value && props.value.map((buffs, i) => {
          return (
            <div key={i} style={{ padding: '8px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{`${buffs.type}`}</Typography>
              {buffs.buffs.map((buff, i) => {
                return (
                  <Chip
                    key={i}
                    label={`${buff}`}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )
              })}
            </div>
          )
        })}
      </Popover>
    </>
  )
}
