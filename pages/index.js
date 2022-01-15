// import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  jaJP
} from '@mui/x-data-grid';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { jaJP as coreJaJP } from '@mui/material/locale';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useState } from 'react';

import espers from 'constants/espers.json'

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

function debuffLabel (debuff) {
  let label
  switch (debuff) {
    case 'immobilize':
      label = 'ドンムブ';
    break;
    case 'stop':
      label = 'ストップ';
    break;
    default:
      label = ''
  }
  return label
}

const columns = [
  {
    field: 'name',
    headerName: '名前',
    width: 180,
    editable: false,
    popover: false,
    hide: false,
    renderCell: (params) =>
      <Link href={`/board/${params.row.id}`}>
        <a style={{textDecoration: 'underline'}} target="_blank">{params.row.name}</a>
      </Link>
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
    hide: false
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
    valueGetter: (params) => [...params.row.boardBuffs],
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
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
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

// const rows = espers;

export default function Home() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState('');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState(espers);

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
      setValue(row[field].effect);
    } else {
      setValue(row[field]);
    }
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const theme = createTheme(
    {
      palette: {
        primary: { main: '#1976d2' },
      },
    },
    jaJP,
    coreJaJP,
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
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
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{`${value}`}</Typography>
      </Popover>
      {/* <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">id</TableCell>
            <TableCell align="right">name</TableCell>
            <TableCell align="right">rarity</TableCell>
            <TableCell align="right">cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {espers.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">
                <Link href={`/board/${row.id}`}>
                  <a target="_blank">{row.name}</a>
                </Link>
              </TableCell>
              <TableCell align="right">{row.rarity}</TableCell>
              <TableCell align="right">{row.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  )
}
