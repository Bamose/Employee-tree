import { MantineProvider, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from 'react';
import "./App.css";
import "./index.css";
import { Nav } from "./components/Nav";
import { RegisterEmployee } from "./components/RegisterEmployee";
import { RegisterPosition } from "./components/RegisterPosition";
import { Provider } from 'react-redux';
import { Store } from "./components/Store";
import { PositionTree } from "./components/PositionTree";
import SlideImages from "./components/Slideimages";
import { UpdateEmployee, UpdatePosition } from "./components/Update";
import { DeletePosition,DeleteEmployee } from "./components/Delete";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PositionTable } from "./components/Table";


// App component
function App() {
  return (
    <MantineProvider>
      <div className="sticky top-0 bg-white/100 border-b border-solid border-gray mb-2 z-10">
        <Nav />
      </div>

      <section id="home">
        <SlideImages />
      </section>

      <section id="register">
        <Provider store={Store}>
          <div className="flex justify-center  mt-28">
            <div className="bg-slate-400 bg-opacity-25 rounded w-2/4 pb-7 ">
              <div>
                <RegisterPosition  />
              </div>

               <PositionTree />
              <div className="flex min-h-min justify-center z-10">
                <RegisterEmployee />
              </div>
            </div>
          </div>
          
        </Provider>
      </section>
      
      <section id="employee">
        <Provider store={Store}>
          <div className=" border-t border-solid border-gray mt-16">
            <div className="flex items-center justify-center w-full mt-10">
              <h1 className="border border-solid p-4 w-52 border-gray-700 rounded bg-transparent text-center"> Employee List </h1> 
            </div>
            <div className="flex items-center justify-center w-full" >
              <PositionTable />  
            </div>
          </div>
        </Provider>
      </section>
      
      <section id="footer">
        <div className=" flex items-center h-20 mt-10 bg-slate-400/25 shadow-md border-t border-gray">
          <div className="flex items-center justify-start">
            <h1 className="text-slate-600"><span className="font-24 text-amber-500 ">H</span> abesha PLC.</h1>
            <ul>
              <li></li>
            </ul>
          </div>
          </div>
      </section>
    </MantineProvider>
  );
}


export default App;
