import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  jaJP
} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { jaJP as coreJaJP } from '@mui/material/locale';
import BuffsPopOver from 'components/buffsPopOver';
import EsperMagicPopOver from 'components/esperMagicPopOver';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles';

import styles from '../styles/home.module.scss'

import espers from 'constants/espers.json'

const StyledDataGrid = styled(DataGrid)({
  // "& .MuiDataGrid-cell[data-field='name'], .MuiDataGrid-columnHeader[data-field='name']": {
  //   backgroundColor: 'white',
  //   position: 'sticky',
  //   left: '0'
  // }
});

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function elementLabel (element) {
  let label
  switch (element) {
    case 'fire':
      label = '火属性';
    break;
    case 'ice':
      label = '氷属性';
    break;
    case 'wind':
      label = '風属性';
    break;
    case 'soil':
      label = '土属性';
    break;
    case 'thunder':
      label = '雷属性';
    break;
    case 'water':
      label = '水属性';
    break;
    case 'light':
      label = '光属性';
    break;
    case 'dark':
      label = '闇属性';
    break;
    default:
      label = '無属性'
  }
  return label
}

function rarityLabel (rarity) {
  let label
  switch (rarity) {
    case 5:
      label = 'UR';
    break;
    case 4:
      label = 'SSR';
    break;
    case 3:
      label = 'SR';
    break;
    default:
      label = 'SR'
  }
  return label
}

const columns = [
  {
    field: 'name',
    headerName: '名前',
    width: 200,
    editable: false,
    popover: false,
    hide: false,
    renderCell: (params) =>
      <>
        <Link href={`/board/${params.row.id}`}>
          <a style={{textDecoration: 'underline'}} target="_blank">
            {params.row.name}
            <OpenInNewIcon style={{verticalAlign: 'middle', marginLeft: '4px'}} />
          </a>
        </Link>
      </>
  },
  {
    field: 'element',
    headerName: '属性',
    width: 80,
    editable: false,
    popover: false,
    hide: false,
    valueGetter: (params) => elementLabel(params.row.element)
  },
  {
    field: 'rarity',
    headerName: 'レア度',
    type: 'number',
    width: 80,
    editable: false,
    popover: false,
    hide: false,
    renderCell: (params) =>(<>{rarityLabel(params.row.rarity)}</>)
  },
  {
    field: 'cost',
    headerName: 'コスト',
    type: 'number',
    width: 80,
    editable: false,
    popover: false,
    hide: false
  },
  {
    field: 'awakening',
    headerName: '覚醒',
    type: 'number',
    width: 80,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'elementResist',
    headerName: '属性耐性',
    width: 120,
    editable: false,
    popover: false,
    hide: false,
    renderCell: (params) => <div>{`${params.row.elementResist[0].name}耐性${params.row.elementResist[0].value}`}</div>
  },
  {
    field: 'elementResist2',
    headerName: '属性耐性2',
    width: 120,
    editable: false,
    popover: false,
    hide: false,
    renderCell: (params) => <div>{`${(params.row.elementResist[1].name)}耐性${params.row.elementResist[1].value}`}</div>
  },
  {
    field: 'debuffResist',
    headerName: '状態異常耐性',
    width: 120,
    editable: false,
    popover: false,
    hide: false,
    renderCell: (params) =>
      <div>
        <Tooltip title={params.row.debuffResist[0].conditions}>
          <div>{`${params.row.debuffResist[0].name}耐性${params.row.debuffResist[0].value}`}</div>
        </Tooltip>
      </div>
  },
  {
    field: 'maxHp',
    headerName: '最大HP',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: false
  },
  {
    field: 'hp',
    headerName: 'HP',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'maxTp',
    headerName: '最大TP',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'tp',
    headerName: 'TP',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'maxAp',
    headerName: '最大AP',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'ap',
    headerName: 'AP',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'maxPower',
    headerName: '最大攻撃',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: false
  },
  {
    field: 'power',
    headerName: '攻撃',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'maxMagic',
    headerName: '最大魔力',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: false
  },
  {
    field: 'magic',
    headerName: '魔力',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'maxSpeed',
    headerName: '最大スピード',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: false
  },
  {
    field: 'speed',
    headerName: 'スピード',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'maxDexterity',
    headerName: '最大器用さ',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'dexterity',
    headerName: '器用さ',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'maxLuck',
    headerName: '最大運',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'luck',
    headerName: '運',
    type: 'number',
    width: 120,
    editable: false,
    popover: false,
    hide: true
  },
  {
    field: 'boardBuffs',
    headerName: '習得アビリティ',
    width: 350,
    editable: false,
    popover: true,
    valueGetter: (params) => [...params.row.boardBuffs.map(boardBuffs => boardBuffs.buffs)],
    hide: false
  },
  {
    field: 'esperMagic',
    headerName: '召喚魔法',
    width: 120,
    editable: false,
    popover: true,
    valueGetter: (params) => params.row.esperMagic.name,
    hide: false
  },
  {
    field: 'limited',
    headerName: '限定',
    type: 'boolean',
    width: 80,
    editable: false,
    popover: false,
    hide: true
  }
];

function QuickSearchToolbar(props) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <GridToolbarColumnsButton sx={{ mr: 1.5 }} />
        <GridToolbarFilterButton sx={{ mr: 1 }} />
        <GridToolbarDensitySelector />
      </div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="検索"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            mr: 0.5,
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      />
    </Box>
  );
}

export default function Home() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [buffsPopOverValue, setBuffsPopOverValue] = useState('');
  const [esperMagicPopOverValue, setEsperMagicPopOverValue] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState(espers);
  const [documentHeight, setDocumentHeight] = useState();

  function onResizeHandler() {
    setDocumentHeight(document.documentElement.clientHeight);
  }

  useEffect(() => {
    onResizeHandler();
    window.addEventListener('resize', onResizeHandler);
    return () => window.removeEventListener('resize', onResizeHandler);
  },[]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = espers.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(JSON.stringify(row[field]));
      });
    });
    setRows(filteredRows);
  };

  const handlePopoverOpen = (event) => {
    const field = event.currentTarget.dataset.field;
    const popover = columns.find(r => r.field === field).popover;
    if (!popover) return; 
    const id = event.currentTarget.parentElement.dataset.id;
    const row = rows.find((r) => r.id === id);
    if (field === 'esperMagic') {
      setEsperMagicPopOverValue(row[field]);
    } else {
      setBuffsPopOverValue(row[field]);
    }
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setEsperMagicPopOverValue('');
    setBuffsPopOverValue('');
  };

  const theme = createTheme(
    {
      palette: {
        primary: { main: '#89CC25' },
      },
    },
    jaJP,
    coreJaJP,
  );

  return (
    <div style={{ height: `${documentHeight}px`, width: '100%' }}>
      <ThemeProvider theme={theme}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          componentsProps={{
            cell: {
              onMouseEnter: handlePopoverOpen,
              onMouseLeave: handlePopoverClose,
            },
            toolbar: {
              value: searchText,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(''),
            },
          }}
          components={{
            Toolbar: QuickSearchToolbar,
          }}
        />
      </ThemeProvider>
      <BuffsPopOver
        open={Boolean(buffsPopOverValue)}
        anchorEl={anchorEl}
        value={buffsPopOverValue}
        onClose={handlePopoverClose}
      />
      <EsperMagicPopOver
        open={Boolean(esperMagicPopOverValue)}
        anchorEl={anchorEl}
        value={esperMagicPopOverValue}
        onClose={handlePopoverClose}
      />
    </div>
  )
}
