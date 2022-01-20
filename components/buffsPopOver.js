import React, {useState, useEffect} from 'react'
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

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
        {props.value && props.value.map(buffs => {
          return (
            <div>
              <Typography variant="h6" sx={{ px: 1, pt: 1, fontWeight: 'bold' }}>{`${buffs.type}`}</Typography>
              <Typography sx={{ px: 1 }}>{`${buffs.buffs}`}</Typography>
            </div>
          )
        })}
      </Popover>
    </>
  )
}
