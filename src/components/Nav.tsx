import React, { useState } from "react";
import "../index.css";

export const Nav = () => {
  const [activeLink, setActiveLink] = useState('#home');

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveLink(event.currentTarget.getAttribute('href') as string);
  }

  return(
   <div className="flex justify-between p-5 pl-9 bg-white-500 opacity-100">
    <div className="flex items-start"><h1 className="pl-20 text-slate-600"><i><span className="text-3xl font-bold text-amber-500 ">H</span></i>star PLC.</h1></div>
    <div className="flex items-right"> 
     <ul className="flex items-right space-x-7 justify-end">
       <li>
         <a 
           href="#home" 
           className={`text-white-500 mt-2 py-1 hover:border-b-2 hover:border-amber-500 ${activeLink === '#home' ? 'border-b-2 border-amber-500' : ''}`}
           onClick={handleLinkClick}
         >
           Home
         </a>
       </li>
       <li>
         <a 
           href="#register" 
           className={`text-white-500  mt-2  py-1 hover:border-b-2 hover:border-amber-500 ${activeLink === '#register' ? 'border-b-2 border-amber-500' : ''}`}
           onClick={handleLinkClick}
         >
           Add Employee
         </a>
       </li>
       <li>
         <a 
           href="#employee" 
           className={`text-white-500 mt-2 py-1 hover:border-b-2 hover:border-amber-500 ${activeLink === '#employee' ? 'border-b-2 border-amber-500' : ''}`}
           onClick={handleLinkClick}
         >
           Employee-List
         </a>
       </li>
       <li>
         <button className="bg-amber-500 px-4 py-1 rounded hover:scale-115">
           <a 
             href="#login" 
             className={`text-black-500 hover:text-white-700 hover:border-b-2 hover:border-white-700 ${activeLink === '#login' ? 'border-b-2 border-amber-500' : ''}`}
             onClick={handleLinkClick}
           >
             Login
           </a>
         </button>
       </li>
     </ul>
     </div>
   </div>
  );
}
