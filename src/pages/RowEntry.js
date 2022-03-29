//
//  Libraries
//
import { useEffect } from 'react'
import { Grid } from '@mui/material'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Controls
//
import MyButton from '../components/controls/MyButton'
import MyInput from '../components/controls/MyInput'
import MySelect from '../components/controls/MySelect'
import { useMyForm, MyForm } from '../components/useMyForm'
//
//  Data Services
//
import * as QuizServices from '../services/QuizServices'
//
//  Form Initial Values
//
const initialFValues = {
  qid: 0,
  qowner: '',
  qkey: '',
  qdetail: '',
  qhl1: '',
  qhl2: '',
  qcorrect: '',
  qbad1: '',
  qbad2: '',
  qbad3: '',
  qgroup1: '',
  qgroup2: ''
}
//
// Debug Settings
//
const g_log1 = debugSettings()
//=====================================================================================
export default function RowEntry(props) {
  const { addOrEdit, recordForEdit } = props

  //...................................................................................
  //
  // Validate the fields
  //
  const validate = (fieldValues = values) => {
    if (g_log1) console.log(fieldValues)
    //
    //  Load previous errors
    //
    let errorsUpd = { ...errors }
    //
    //  Validate current field
    //
    if ('qowner' in fieldValues)
      errorsUpd.qowner = fieldValues.qowner ? '' : 'This field is required.'

    if ('qkey' in fieldValues)
      errorsUpd.qkey = fieldValues.qkey ? '' : 'This field is required.'

    if ('qdetail' in fieldValues)
      errorsUpd.qdetail = fieldValues.qdetail ? '' : 'This field is required.'

    if ('qcorrect' in fieldValues)
      errorsUpd.qcorrect = fieldValues.qcorrect ? '' : 'This field is required.'

    if ('qbad1' in fieldValues)
      errorsUpd.qbad1 = fieldValues.qbad1 ? '' : 'This field is required.'

    if ('qgroup1' in fieldValues)
      errorsUpd.qgroup1 = fieldValues.qgroup1 ? '' : 'This field is required.'

    //
    //  Set the errors
    //
    setErrors({
      ...errorsUpd
    })
    //
    //  Check if every element within the errosUpd object is blank, then return true (valid), but only on submit when the fieldValues=values
    //
    if (fieldValues === values)
      return Object.values(errorsUpd).every(x => x === '')
  }
  //...................................................................................
  //
  //  UseMyForm
  //
  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useMyForm(initialFValues, true, validate)
  //...................................................................................
  //.  Submit form
  //...................................................................................
  const handleSubmit = e => {
    e.preventDefault()
    if (validate()) {
      addOrEdit(values, resetForm)
    }
  }
  //...................................................................................
  //.  Main Line
  //...................................................................................
  //
  //  On change of record, set State
  //
  useEffect(() => {
    if (g_log1) console.log('useEffect')
    if (recordForEdit !== null)
      setValues({
        ...recordForEdit
      })
    // eslint-disable-next-line
  }, [recordForEdit])
  //
  //  Disable entry of Owner/Key on update, allow for Entry
  //
  let disabled = false
  if (values.qid !== 0) disabled = true
  if (g_log1) console.log('disabled input ', disabled)
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <MyForm onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={5}>
          <MySelect
            name='qowner'
            label='Owner'
            value={values.qowner}
            onChange={handleInputChange}
            error={errors.qowner}
            disabled={disabled}
            options={QuizServices.getOwnerCollection()}
          />
        </Grid>

        <Grid item xs={5}>
          <MyInput
            name='qkey'
            label='Key'
            value={values.qkey}
            onChange={handleInputChange}
            error={errors.qkey}
            disabled={disabled}
          />
        </Grid>

        {disabled ? (
          <Grid item xs={2}>
            <MyInput name='qid' label='ID' value={values.qid} disabled={true} />
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <MyInput
            name='qdetail'
            label='Question'
            value={values.qdetail}
            onChange={handleInputChange}
            error={errors.qdetail}
          />
        </Grid>

        <Grid item xs={12}>
          <MyInput
            name='qcorrect'
            label='Correct Answer'
            value={values.qcorrect}
            onChange={handleInputChange}
            error={errors.qcorrect}
          />
        </Grid>

        <Grid item xs={12}>
          <MyInput
            name='qbad1'
            label='Bad Answer 1'
            value={values.qbad1}
            onChange={handleInputChange}
            error={errors.qbad1}
          />
        </Grid>

        <Grid item xs={12}>
          <MyInput
            name='qbad2'
            label='Bad Answer 2'
            value={values.qbad2}
            onChange={handleInputChange}
            error={errors.qbad2}
          />
        </Grid>

        <Grid item xs={12}>
          <MyInput
            name='qbad3'
            label='Bad Answer 3'
            value={values.qbad3}
            onChange={handleInputChange}
            error={errors.qbad3}
          />
        </Grid>

        <Grid item xs={12}>
          <MyInput
            name='qhl1'
            label='HyperLink 1'
            value={values.qhl1}
            onChange={handleInputChange}
            error={errors.qhl1}
          />
        </Grid>

        <Grid item xs={12}>
          <MyInput
            name='qhl2'
            label='HyperLink 2'
            value={values.qhl2}
            onChange={handleInputChange}
            error={errors.qhl2}
          />
        </Grid>

        <Grid item xs={6}>
          <MySelect
            name='qgroup1'
            label='Group 1'
            value={values.qgroup1}
            onChange={handleInputChange}
            error={errors.qgroup1}
            options={QuizServices.getGroup1Collection()}
          />
        </Grid>
        <Grid item xs={6}>
          <MySelect
            name='qgroup2'
            label='Group 2'
            value={values.qgroup2}
            onChange={handleInputChange}
            error={errors.qgroup2}
            options={QuizServices.getGroup2Collection()}
          />
        </Grid>

        <Grid item xs={6}>
          <div>
            <MyButton type='submit' text='Submit' />
          </div>
        </Grid>
      </Grid>
    </MyForm>
  )
}
