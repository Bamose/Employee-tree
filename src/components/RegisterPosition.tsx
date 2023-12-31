import React, { useState, useEffect } from 'react';
import { TextInput, Button, Select } from '@mantine/core';
import { useForm, isNotEmpty, isEmail } from '@mantine/form';
import { getDatabase, ref, set, get, child,onValue, off } from 'firebase/database';
import { useAppDispatch, FetchPositions } from './Store';
import { PositionTree } from './PositionTree';
import { Position } from './PositionTree';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { AsyncThunkAction, AnyAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Config = {
  apiKey: "AIzaSyAeqfuDaABRKYvdgneWiptC0fMrQsOepw4",
  authDomain: "employee-list-d5b9f.firebaseapp.com",
  databaseURL: "https://employee-list-d5b9f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "employee-list-d5b9f",
  storageBucket: "employee-list-d5b9f.appspot.com",
  messagingSenderId: "505041054295",
  appId: "1:505041054295:web:9ca64a4f39d829f9acd112",
  measurementId: "G-XN8H9BGXS7"
};

let app;
if (!getApps().length) {
  app = initializeApp(Config);
} else {
  app = getApp();
}

const db = getDatabase(app);

export const RegisterPosition = () => {
  const [showCreatePosition, setShowCreatePosition] = useState(false);
  const dispatch = useAppDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);

  
  useEffect(() => {
    const dbRef = ref(getDatabase());
    const listener = onValue(child(dbRef, 'positions/'), (snapshot) => {
      if (snapshot.exists()) {
        setPositions(Object.values(snapshot.val()));
      } else {
        console.log("No data available");
      }
    }, (error) => {
      console.error(error);
    });
  
    // Cleanup the listener when the component unmounts
    return () => off(dbRef, 'value', listener);
  }, []);

  const form = useForm({
    initialValues: {
      id: '',
      name: '',
      parentId: '',
    },
    validate: {
    
      name: isNotEmpty('Enter your current job'),
      
      
    },
  });

  const handleSubmit = () => {
    const position = {
      id: uuidv4(),
      name: form.values.name,
      parentId: form.values.parentId || null,
      children: [],
      employees: [],
    };
  
    set(ref(db, 'positions/' + position.id), position)
      .then(() => {
        toast.success('Data write successful');
        form.reset();
        setIsSubmitted(true);
        dispatch(FetchPositions()); // trigger a re-fetch
  
        // Fetch the latest positions after successfully writing a new position
        const dbRef = ref(getDatabase());
        get(child(dbRef, 'positions/')).then((snapshot) => {
          if (snapshot.exists()) {
            setPositions(Object.values(snapshot.val()));
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
      })
      .catch((error) => {
      toast.error('Data write failed:', error);
      });
      setShowCreatePosition(false);
  };
  
  return (
    <>
    <div className='flex items-center justify-center z-10'>
      { !showCreatePosition ? (
   <div>   <div className='flex items-center justify-center w-full m-2'> <Button className='text-amber-500 bg-slate-400/25 hover:bg-slate-400/50  ' onClick={() => setShowCreatePosition(true)}>Add Position</Button></div> </div>
        
      ) : (
        <div className="flex items-center">
   
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white w-1/2  rounded p-6">
          <h2>Register Position</h2>
          <form onSubmit={form.onSubmit(handleSubmit)}>
           
           <TextInput label="Name" {...form.getInputProps('name')} />
           <Select
             label="Parent ID"
             placeholder="Select a parent position"
             data={positions
              .sort((a, b) => a.name.localeCompare(b.name)) 
              .map(position => ({ value: position.id, label: position.name }))}
             {...form.getInputProps('parentId')}
           />
             <Button variant="outline" type="submit">Register Position</Button>
             <Button className="text-amber-500 hover:bg-slate-400/50 m-3" onClick={() => setShowCreatePosition(false)}>Cancel</Button>
           </form>
       
          </div>
        </div>
      </div>
     
     
      )}
      </div>
    </>
    
  );
};

export default RegisterPosition;



