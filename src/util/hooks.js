import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (e)=>{
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }

  // here we are no doing any client side validation, 
  // cause we already did server side validation
  const onSubmit = (e) => {
    e.preventDefault();
    callback();
  }
  
  return {
    onChange, 
    onSubmit,
    values
  };
}