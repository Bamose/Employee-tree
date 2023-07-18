import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import "../App.css";
import "../index.css";

const divContents = [
  {id: 1, content: 
    <div className="h-70 flex flex-col justify-center">
      <div className="flex items-center justify-center pt-6">
        <h1 className="border border-solid p-4 w-52 border-gray-700 rounded bg-transparent text-center"> Registration </h1>
      </div>
      <div className='items-center pt-6'>
        <p className='px-52'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quosLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quosLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quosLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos
        </p>
      </div>
      <div className="flex items-center justify-center  pt-12">
      <a href="#register" className="text-white-500 hover:text-white-700"> <button className="bg-amber-500 px-20 py-3 rounded hover:scale-115" > Register New Employee </button></a>
      </div>
    </div>
  },
  
  {id: 2, content:  <div className="h-70 flex flex-col justify-center">
  <div className="flex items-center justify-center pt-6">
    <h1 className="border border-solid p-4 w-52 border-gray-700 rounded bg-transparent text-center"> Employees </h1>
  </div>
  <div className='items-center pt-6'>
    <p className='px-52'>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quosLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quosLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quosLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos
    </p>
  </div>
  <div className="flex items-center justify-center  pt-12">
  <a href="#employee" className="text-white-500 hover:text-white-700"><button className="bg-amber-500 px-20 py-3 rounded hover:scale-115" >Employee-List </button></a>
  </div>
</div>},
{id: 3, content:  <div className="h-70 flex flex-col justify-center">
<div className="flex items-center justify-center pt-6">
  <h1 className="border border-solid p-4 w-52 border-gray-700 rounded bg-transparent text-center"> In Need Of Support </h1>
</div>
<div className='items-center pt-6'>
  <p className='px-52'>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quosLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quosLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quosLorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos
  </p>
</div>
<div className="flex items-center justify-center  pt-12">
  <button className="bg-amber-500 px-20 py-3 rounded hover:scale-115" > Get Help </button>
</div>
</div>}
];




export const SlideImages = () => {  const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
    autoplay: true,
    canSwipe: true,
    prevArrow: <div style={{/* width: "30px", marginRight: "0px" */}}><svg></svg></div>,
    nextArrow: <div style={{/* width: "30px", marginLeft: "0px" */}}><svg></svg></div>,
  }

  return (
    <div className="slide-container custom-slide-height">
      <Slide {...properties}>
        {divContents.map(({id, content}) => 
          <div key={id} className="each-slide custom-slide-height">
            {content}
          </div>
        )}
      </Slide>
    </div>
  );
  }
export default SlideImages;
