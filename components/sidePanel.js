import React from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { styled } from '@mui/material/styles';
import styles from '../styles/sidepanel.module.scss'

const StyledAccordionSummary = styled(AccordionSummary)({
  flexDirection: 'column',
  "& .MuiAccordionSummary-content": {
    width: '100%'
  }
});

const StyledAccordionDetails = styled(AccordionDetails)({
  padding: '8px',
});

const StyledButton = styled(Button)({
  borderColor: '#89CC25',
  color: "#89CC25",
  "&:hover": {
    borderColor: '#4F7515'
  }
});

export default function SidePanel(props) {
  return (
    <div className={styles.panel}>
      <Accordion>
        <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h3 className={styles.spWrap}>
            <span className={styles.sp}>SP: </span>
            <span className={styles.stockSp}>{props.stockSp}</span>
            <div
              className={styles.meter}
              style={{ width: `${(props.stockSp/props.availableSp)*100}%`}}
            ></div>
          </h3>
        </StyledAccordionSummary>
        <StyledAccordionDetails>
          <div className={styles.activeMesh}>
            <h3 className={styles.activeAbilityTitle}>
              <span className={styles.activeAbilityTitleText}>発動アビリティ</span>
              <IconButton
                aria-label="activeAbilityReset"
                size="small"
                onClick={() => props.activeAbilityReset()}
              >
                <RestartAltIcon fontSize="small"/>
              </IconButton>
            </h3>
            {props.sumActiveAbilityArray.map((activeMesh, i) =>
              activeMesh.abilityTypeLabel ?
              <h4
                className={styles.activeAbility}
                key={i}
              >
                <span className={styles.abilityTypeLabel}>{activeMesh.abilityTypeLabel}: </span>
                <span className={styles.abilityTypeValue}>{activeMesh.abilityType === 'boostEvocationDamage' ? activeMesh.level : activeMesh.value}</span>
                <div
                  className={styles.thinMeter}
                  style={{ width: `${(activeMesh.value/activeMesh.maxValue)*100}%`}}
                ></div>
              </h4>:
              <span key={i}>-</span>
            )}
          </div>
          <menu className={styles.controlButtons}>
            <h3 className={styles.cameraPositionTitle}>
              <span className={styles.cameraPositionTitleText}>カメラ位置</span>
              <IconButton
                aria-label="cameraPositionReset"
                size="small"
                onClick={() => props.cameraPositionReset()}
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="zoomIn"
                size="small"
                onClick={() => props.zoomIn()}
              >
                <ZoomInIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="zoomOut"
                size="small"
                onClick={() => props.zoomOut()}
              >
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </h3>
            <div>
              <div className={styles.menuRow}>
                <StyledButton
                  variant="outlined"
                  aria-label="moveTop"
                  size="small"
                  onClick={() => props.moveTop()}
                >
                  <ArrowDropUpIcon />
                </StyledButton>
              </div>
              <div className={styles.menuRow}>
                <StyledButton
                  variant="outlined"
                  aria-label="moveLeft"
                  size="small"
                  onClick={() => props.moveLeft()}
                >
                  <ArrowLeftIcon />
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  aria-label="moveBottom"
                  size="small"
                  onClick={() => props.moveBottom()}
                >
                  <ArrowDropDownIcon />
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  aria-label="moveRight"
                  size="small"
                  onClick={() => props.moveRight()}
                >
                  <ArrowRightIcon />
                </StyledButton>
              </div>
            </div>
          </menu>
        </StyledAccordionDetails>
      </Accordion>
    </div>
  );
}
