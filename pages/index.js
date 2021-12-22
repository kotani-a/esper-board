// import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from 'next/link'

import espers from 'constants/espers.json'


export default function Home() {
  return (
    <div>
      test fix
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
      </Table>
    </div>
  )
}
