import React from 'react'

const Button = (props) => {
  return (
    <button className= "px-3 py-1 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200" onClick={props.onClick}>{props.children}</button>
  )
}

export default Button