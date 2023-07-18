import React, { useState, useEffect } from 'react';
import { TextInput, Button, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { useAppDispatch, FetchPositions } from './Store';
import { PositionTree } from './PositionTree';
import { Position } from './PositionTree';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { AsyncThunkAction, AnyAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

  const handleToggle = () => {
    setShowCreatePosition(!showCreatePosition);
  };
  const handleCancel = () => {
    setShowCreatePosition(false);
  };

  const dispatch = useAppDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
 
  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'positions/')).then((snapshot) => {
      if (snapshot.exists()) {
        setPositions(Object.values(snapshot.val()));
        console.log(Object.values(snapshot.val())); // Log the positions data for debugging
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const form = useForm({
    initialValues: {
      id: '',
      name: '',
      parentId: '',
    },
  });

  const handleSubmit = () => {
    const position = {
      id: uuidv4(), // automatically generate a UUID
      name: form.values.name,
      parentId: form.values.parentId || null,
      children: [],
      employees: [],
    };

    set(ref(db, 'positions/' + position.id), position)
      .then(() => {
        console.log('Data write successful');
        form.reset();
        setIsSubmitted(true);
        dispatch(FetchPositions()); // trigger a re-fetch
      })
      .catch((error) => {
        console.error('Data write failed:', error);
      });
  };

  return (
    <>
     <div className="flex items-right justify-end z-10">
      {!showCreatePosition ? (
        <Button
          className="text-amber-500 hover:bg-slate-400/50 m-3"
          onClick={handleToggle}
        >
          Create New Position
        </Button>
      ) : (
        <div className="flex items-center">
         
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white w-1/2 rounded p-6">
            <h2>Register Position</h2>
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput label="Name" required {...form.getInputProps('name')} />
      <Select
        label="Parent ID"
        placeholder="Select a parent position"
        data={positions.map(position => ({ value: position.id, label: position.name }))}
        {...form.getInputProps('parentId')}
      />
      <Button variant="outline" type="submit">
        Register Position
      </Button>
      <Button
            className="text-amber-500 hover:bg-slate-400/50 m-3"
            onClick={handleCancel}
          >
            Cancel
          </Button>
   {/*    <button onClick={handleCancel}>Cancel</button> */}
    </form>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
  );
};
