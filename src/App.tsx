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
/* import { UpdateEmployee, UpdatePosition } from "./components/Update";
import { DeletePosition,DeleteEmployee } from "./components/Delete";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; */
import { PositionTable } from "./components/Table";
import { CSSTransition } from 'react-transition-group';
import Scrollspy from 'react-scrollspy';
import { ToastContainer } from 'react-toastify';


function App() {
  const [currentSection, setCurrentSection] = useState('home');
  
  return (
    <MantineProvider>
      <ToastContainer />
      <Scrollspy
        items={['home', 'register', 'employee', 'footer']}
        currentClassName="is-current"
        onUpdate={(el) => setCurrentSection(el?.id)}
      >
        <div className="sticky top-0 bg-white/100  shadow-md  z-10">
          <Nav />
        </div>

        <CSSTransition in={currentSection === 'home'} classNames="fade-and-scale" timeout={500}>
          <section className="h-100vh" id="home">
            <SlideImages />
          </section>
        </CSSTransition>

        <CSSTransition in={currentSection === 'register'} classNames="fade-and-scale" timeout={500}>
        <section id="register">
  <Provider store={Store}>
    <div className="flex justify-center mt-16">
      <div className="bg-gray-50/75 shadow-lg rounded-lg w-4/6 pb-10 mx-5">

        <PositionTree />

        <div className="flex justify-center mt-5">
         
            <RegisterEmployee />
         
        </div>
        
        <div className="flex justify-center mt-5">
         
            <RegisterPosition  />
          
        </div>

      </div>
    </div>
  </Provider>
</section>

        </CSSTransition>
        
        <CSSTransition in={currentSection === 'employee'} classNames="fade-and-scale" timeout={500}>
          <section id="employee">
            <Provider store={Store}>
            <div className=" mt-7">
            <div className="flex items-center justify-center w-full mt-10 cursor-pointer hover:scale-110 ">
              <h1 className="border border-solid p-4 w-52 border-gray-700 rounded bg-transparent text-center"> Employee List </h1> 
            </div>
            <div className="flex items-center justify-center w-full" >
              <PositionTable />  
            </div>
          </div>
            </Provider>
          </section>
        </CSSTransition>
        
        
          <section id="footer">
          <div className=" flex items-center h-20 mt-10 bg-slate-400/25 shadow-md border-t border-gray">
          <div className="flex items-center justify-start">
            <h1 className="pl-20 text-slate-600"><i><span className="text-3xl font-bold text-amber-500 ">H</span></i>star PLC.</h1>
            <ul>
              <li></li>
            </ul>
          </div>
          </div>
          </section>
        
      </Scrollspy>
    </MantineProvider>
  );
}
export default App;