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

const ChangeParam = props => {
    const { handleSubmit, pristine, reset, submitting } = props
    return (
        <form onSubmit={handleSubmit}>
            <div className='container col-md-12 row' >
                <div className='col-md-4'>
                    <Field name="Time" component={renderTextField} label="Time" />
                </div>

                <div className='col-md-4'>
                    <Field name="Player_number" component={renderTextField} label="Player number" />
                </div>

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

            <button type="submit">Edit</button>

        </form>
    )
}

export default reduxForm({
    form: 'MaterialUiForm' // a unique identifier for this form

})(ChangeParam)