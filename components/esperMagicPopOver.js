import React, {useState, useEffect} from 'react'
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

export default function EsperMagicPopOver(props) {
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
        <Typography variant="h6" sx={{ px: 1, pt: 1, fontWeight: 'bold' }}>{`${props.value.name}`}</Typography>
        <Typography sx={{ px: 1 }}>{`${props.value.effect}`}</Typography>
      </Popover>
    </>
  )
}
