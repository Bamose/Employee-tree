import React from "react";
import "../index.css";
import { Button } from "@mantine/core";
// Nav component
export const Nav = () => {
  return(
   <div className="p-8 pl-9 bg-white-500 opacity-100">
     <ul className="flex items-right space-x-7 justify-end">
       <li><a href="#home" className="text-white-500 hover:text-white-700">Home</a></li>
       <li><a href="#register" className="text-white-500 hover:text-white-700">Register</a></li>
       <li><a href="#employee" className="text-white-500 hover:text-white-700">Employee-List</a></li>
       <li>
         <button className="bg-amber-500 px-4 py-1 rounded hover:scale-115">
           <a href="#employee" className="text-black-500 hover:text-white-700">Login</a>
         </button>
       </li>
     </ul>
   </div>
  );
 }
 