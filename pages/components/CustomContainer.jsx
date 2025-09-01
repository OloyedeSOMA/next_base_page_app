import React from 'react'

const CustomContainer = (props) => {
  return (
    <div className={`max-w-full bg-white shadow-xl rounded-xl` + props.className}>
        {props.children}
    </div>
  )
}

export default CustomContainer