import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import TextField from 'material-ui/TextField'

const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    {...custom}
  />
)

  const AddQuestion = props => {
    const { handleSubmit, pristine, reset, submitting } = props
    return (
        <form onSubmit={handleSubmit}>
        <div className='container col-md-12 row' >   
            <div className='col-md-4'>
                <Field  name="indice1" component={renderTextField} label="Indice 1" />
            </div>

            <div  className='col-md-4'>
                <Field name="indice2" component={renderTextField} label="Indice 2" />
            </div>

            <div  className='col-md-4'>
                <Field name="indice3" component={renderTextField} label="Indice 3" />
            </div>
        </div>
        <div>
        <div  className='col-md-5'></div>
        <Field name="answer" component={renderTextField} label="answer" />
    
        </div>
{/*         <div className='container col-md-12 row' >   
            <div className='col-md-4'>
                <Field  name="indice4" component={renderTextField} label="Indice 4" />
            </div>

            <div  className='col-md-4'>
                <Field name="indice5" component={renderTextField} label="Indice 5" />
            </div>

            <div  className='col-md-4'>
                <Field name="indice6" component={renderTextField} label="Indice " />
            </div>
        </div> */}
        
    <button type="submit">Submit</button>

    </form>
    )
}

export default reduxForm ({
    form: 'MaterialUiForm' // a unique identifier for this form

  })(AddQuestion)