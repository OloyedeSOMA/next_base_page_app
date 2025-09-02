'use client'
import Image from "next/image"




const NavBar = () => {
  return (
    <>
        <div className="w-full flex h-[60px] justify-center p-5 mb-10 bg-white shadow-md text-align-center rounded-xl">
            <ul className="w-full flex mx-auto p-auto justify-self-center ">
                <li className="mx-auto text-xl font-bold flex"><Image src="/logo.png" alt="logo" width="20" height="30"/>Todo</li>
                
            </ul>
            
        </div>
    
    </>
  )
}

export default NavBar
