//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  Box
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
//
//  Pages
//
import RowEntry from './RowEntry'
//
//  Controls
//
import MyActionButton from '../components/controls/MyActionButton'
import MyButton from '../components/controls/MyButton'
import MyInput from '../components/controls/MyInput'
import MySelect from '../components/controls/MySelect'
//
//  Components
//
import Notification from '../components/Notification'
import ConfirmDialog from '../components/ConfirmDialog'
import Popup from '../components/Popup'
import PageHeader from '../components/PageHeader'
import useMyTable from '../components/useMyTable'
//
//  Services
//
import MyQueryPromise from '../services/MyQueryPromise'
import rowUpsert from '../services/rowUpsert'
import rowUpdate from '../services/rowUpdate'
import rowDelete from '../services/rowDelete'
import rowSelectAll from '../services/rowSelectAll'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(2),
    padding: theme.spacing(3)
  },
  searchInput: {
    width: '40%'
  },
  searchInputTypeBox: {
    width: '10%',
    margin: `0 0 0 ${theme.spacing(2)}`
  },
  newButton: {
    position: 'absolute',
    right: '10px'
  }
}))
//
//  Table Heading
//
const headCells = [
  { id: 'qid', label: 'ID' },
  { id: 'qowner', label: 'Owner' },
  { id: 'qkey', label: 'Key' },
  { id: 'qdetail', label: 'Question' },
  { id: 'qgroup1', label: 'Group 1' },
  { id: 'qgroup2', label: 'Group 2' },
  { id: 'qgroup3', label: 'Group 3' },
  { id: 'actions', label: 'Actions', disableSorting: true }
]
const searchTypeOptions = [
  { id: 'qid', title: 'ID' },
  { id: 'qowner', title: 'Owner' },
  { id: 'qkey', title: 'Key' },
  { id: 'qdetail', title: 'Question' },
  { id: 'qgroup1', title: 'Group 1' },
  { id: 'qgroup2', title: 'Group 2' },
  { id: 'qgroup3', title: 'Group 3' }
]
//
// Debug Settings
//
const g_log1 = debugSettings(true)
//=====================================================================================
export default function RowList() {
  if (g_log1) console.log('Start RowList')
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  const getRowAllData = () => {
    //
    //  Process promise
    //
    if (g_log1) console.log('getRowAllData')
    var myPromiseGet = MyQueryPromise(rowSelectAll())
    //
    //  Initial status
    //
    if (g_log1)
      console.log('myPromiseGet Initial pending:', myPromiseGet.isPending())
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (data) {
      if (g_log1) console.log('myPromiseGet ', myPromiseGet)
      if (g_log1)
        console.log('myPromiseGet Final fulfilled:', myPromiseGet.isFulfilled())
      if (g_log1) console.log('myPromiseGet data ', data)
      //
      //  Update Table
      //
      setRecords(data)
      //
      //  Return Data
      //
      return data
    })
    //
    //  Return Promise
    //
    return myPromiseGet
  }
  //.............................................................................
  //.  DELETE
  //.............................................................................
  const deleteRowData = qid => {
    //
    //  Process promise
    //
    if (g_log1) console.log('deleteRowData')
    var myPromiseDelete = MyQueryPromise(rowDelete(qid))
    //
    //  Initial status
    //
    if (g_log1)
      console.log(
        'myPromiseDelete Initial pending:',
        myPromiseDelete.isPending()
      )
    //
    //  Resolve Status
    //
    myPromiseDelete.then(function (data) {
      if (g_log1) console.log('myPromiseDelete myPromise ', myPromiseDelete)
      if (g_log1)
        console.log(
          'myPromiseDelete Final fulfilled:',
          myPromiseDelete.isFulfilled()
        )
      if (g_log1) console.log('myPromiseDelete data ', data)
      //
      //  Update State - refetch data
      //
      getRowAllData()
      //
      //  Return Data
      //
      return data
    })
    //
    //  Return Promise
    //
    return myPromiseDelete
  }
  //.............................................................................
  //.  INSERT
  //.............................................................................
  const insertRowData = data => {
    //
    //  Data Received
    //
    if (g_log1) console.log('Upsert Row ', data)
    //
    //  Strip out qid as it will be populated by Insert
    //
    let { qid, ...rowData } = data
    if (g_log1) console.log('Upsert Database rowData ', rowData)
    //
    //  Process promise
    //
    if (g_log1) console.log('rowUpsert')
    var myPromiseInsert = MyQueryPromise(rowUpsert(rowData))
    //
    //  Initial status
    //
    if (g_log1)
      console.log(
        'myPromiseInsert Initial pending:',
        myPromiseInsert.isPending()
      )
    //
    //  Resolve Status
    //
    myPromiseInsert.then(function (data) {
      if (g_log1) console.log('myPromiseInsert ', myPromiseInsert)
      if (g_log1)
        console.log(
          'myPromiseInsert Final fulfilled:',
          myPromiseInsert.isFulfilled()
        )
      if (g_log1) console.log('myPromiseInsert data ', data)
      //
      //  No data returned
      //
      if (!data) {
        console.log('No Data returned')
        throw Error
      } else {
        //
        //  Get ID
        //
        const rtn_qid = data[0].qid
        if (g_log1) console.log(`Row (${rtn_qid}) UPSERTED in Database`)
      }
      //
      //  Update State - refetch data
      //
      getRowAllData()
      //
      //  Return Data
      //
      return data
    })
    //
    //  Return Promise
    //
    return myPromiseInsert
  }
  //.............................................................................
  //.  UPDATE
  //.............................................................................
  const updateRowData = data => {
    //
    //  Data Received
    //
    if (g_log1) console.log('updateRow Row ', data)
    //
    //  Process promise
    //
    if (g_log1) console.log('rowUpdate')
    var myPromiseUpdate = MyQueryPromise(rowUpdate(data))
    //
    //  Initial status
    //
    if (g_log1)
      console.log(
        'myPromiseUpdate Initial pending:',
        myPromiseUpdate.isPending()
      ) //true
    //
    //  Resolve Status
    //
    myPromiseUpdate.then(function (data) {
      if (g_log1) console.log('myPromiseUpdate ', myPromiseUpdate)
      if (g_log1)
        console.log(
          'myPromiseUpdate Final fulfilled:',
          myPromiseUpdate.isFulfilled()
        ) //true
      if (g_log1) console.log('myPromiseUpdate data ', data)
      //
      //  No data
      //
      if (!data) {
        console.log('No Data returned')
        throw Error
      } else {
        //
        //  Get QID
        //
        const rtn_qid = data[0].qid
        if (g_log1) console.log(`Row (${rtn_qid}) UPDATED in Database`)
      }
      //
      //  Update State - refetch data
      //
      getRowAllData()
      //
      //  Return Data
      //
      return data
    })
    //
    //  Return Promise
    //
    return myPromiseUpdate
  }
  //.............................................................................
  //
  //  Styles
  //
  const classes = useStyles()
  //
  //  State
  //
  const [recordForEdit, setRecordForEdit] = useState(null)
  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({
    fn: items => {
      return items
    }
  })
  const [openPopup, setOpenPopup] = useState(false)
  const [searchType, setSearchType] = useState('qdetail')
  //.............................................................................
  //
  //  Notification
  //
  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    severity: 'info'
  })
  //.............................................................................
  //
  //  Confirm Delete dialog box
  //
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subTitle: ''
  })
  //.............................................................................
  //
  //  Search/Filter
  //
  const handleSearch = e => {
    const searchValue = e.target.value.toLowerCase()
    console.log(searchValue)
    setFilterFn({
      fn: items => {
        //
        //  Nothing to search, return rows
        //
        if (searchValue === '') return items
        //
        //  Filter
        //
        let itemsFilter = items
        switch (searchType) {
          case 'qid':
            itemsFilter = items.filter(x => x.qid === parseInt(searchValue))
            break
          case 'qowner':
            itemsFilter = items.filter(x =>
              x.qowner.toLowerCase().includes(searchValue)
            )
            break
          case 'qkey':
            itemsFilter = items.filter(x =>
              x.qkey.toLowerCase().includes(searchValue)
            )
            break
          case 'qdetail':
            itemsFilter = items.filter(x =>
              x.qdetail.toLowerCase().includes(searchValue)
            )
            break
          case 'qgroup1':
            itemsFilter = items.filter(x =>
              x.qgroup1.toLowerCase().includes(searchValue)
            )
            break
          case 'qgroup2':
            itemsFilter = items.filter(x =>
              x.qgroup2.toLowerCase().includes(searchValue)
            )
            break
          case 'qgroup3':
            itemsFilter = items.filter(x =>
              x.qgroup3.toLowerCase().includes(searchValue)
            )
            break
          default:
        }
        return itemsFilter
      }
    })
  }
  //.............................................................................
  //
  //  Update Database
  //
  const addOrEdit = (row, resetForm) => {
    row.qid === 0 ? insertRowData(row) : updateRowData(row)
    resetForm()
    setRecordForEdit(null)
    setOpenPopup(false)
    setNotify({
      isOpen: true,
      message: 'Submitted Successfully',
      severity: 'success'
    })
  }
  //.............................................................................
  //
  //  Data Entry Popup
  //
  const openInPopup = row => {
    setRecordForEdit(row)
    setOpenPopup(true)
  }
  //.............................................................................
  //
  //  Delete Row
  //
  const onDelete = qid => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
    deleteRowData(qid)
    setNotify({
      isOpen: true,
      message: 'Deleted Successfully',
      severity: 'error'
    })
  }
  //...................................................................................
  //
  //  Initial Data Load
  //
  useEffect(() => {
    getRowAllData()
    // eslint-disable-next-line
  }, [])
  //.............................................................................
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useMyTable(records, headCells, filterFn)
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader
        title='Questions'
        subTitle='Data Entry and Maintenance'
        icon={<PeopleOutlineTwoToneIcon fontSize='large' />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <MyInput
            label='Search'
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            onChange={handleSearch}
            onClick={handleSearch}
          />
          <Box className={classes.searchInputTypeBox}>
            <MySelect
              fullWidth={true}
              name='SearchType'
              label='Column Heading'
              value={searchType}
              onChange={e => setSearchType(e.target.value)}
              options={searchTypeOptions}
            />
          </Box>
          <MyButton
            text='Add New'
            variant='outlined'
            startIcon={<AddIcon />}
            className={classes.newButton}
            onClick={() => {
              setOpenPopup(true)
              setRecordForEdit(null)
            }}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.qid}>
                <TableCell>{row.qid}</TableCell>
                <TableCell>{row.qowner}</TableCell>
                <TableCell>{row.qkey}</TableCell>
                <TableCell>{row.qdetail}</TableCell>
                <TableCell>{row.qgroup1}</TableCell>
                <TableCell>{row.qgroup2}</TableCell>
                <TableCell>{row.qgroup3}</TableCell>
                <TableCell>
                  <MyActionButton
                    color='primary'
                    onClick={() => {
                      openInPopup(row)
                    }}
                  >
                    <EditOutlinedIcon fontSize='small' />
                  </MyActionButton>
                  <MyActionButton
                    color='secondary'
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Are you sure to delete this record?',
                        subTitle: "You can't undo this operation",
                        onConfirm: () => {
                          onDelete(row.qid)
                        }
                      })
                    }}
                  >
                    <CloseIcon fontSize='small' />
                  </MyActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      <Popup
        title='Question Form'
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <RowEntry recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
      </Popup>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
    </>
  )
}
