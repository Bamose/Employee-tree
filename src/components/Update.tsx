import React, { useState, useEffect } from 'react';
import { TextInput, Button, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { getDatabase, ref, set, child, remove } from 'firebase/database';
import { useAppDispatch, FetchPositions } from './Store';
import { PositionTree } from './PositionTree';
import { Position, Employee } from './PositionTree';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { AsyncThunkAction, AnyAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineEdit } from 'react-icons/ai';
import { query, orderByChild, equalTo, get } from "firebase/database";

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
  
  const db = getDatabase(app)

  export const UpdatePosition = () => {
    const [showUpdatePosition, setShowUpdatePosition] = useState(false);

  const handleToggle = () => {
    setShowUpdatePosition(!showUpdatePosition);
  };
  const handleCancel = () => {
    setShowUpdatePosition(false);
  };
    const dispatch = useAppDispatch();
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

    const [positions, setPositions] = useState<Position[]>([]);
  
    const form = useForm({
      initialValues: {
        name: '',
        parentId: '',
        positionId: '',
      },
    });
  
    useEffect(() => {
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
    }, []);
  
    const handlePositionSelect = (value: any) => {
      const position = positions.find(p => p.id === value);
      if (position) {
        setSelectedPosition(position);
        form.setFieldValue('name', position.name);
        form.setFieldValue('positionId', position.id);  // add this line
      }
    };
    const handleParentSelect = (value: string) => {
      form.setFieldValue('parentId', value || '');
    };
  
    const handleSubmit = form.onSubmit((values) => {
      if (!values.positionId) {
        alert('Please select a position first.');
        return;
      }
  
      const updatedPosition = {
        id: values.positionId,
        name: values.name,
        parentId: values.parentId || null,
      };
  
      set(ref(getDatabase(), 'positions/' + updatedPosition.id), updatedPosition)
        .then(() => {
          console.log('Data updated successfully');
          form.reset();
          dispatch(FetchPositions());
        })
        .catch((error) => {
          console.error('Data update failed:', error);
        });
    });
  
    return (
      <div className="flex items-right justify-end">
      {!showUpdatePosition ? (
      < AiOutlineEdit onClick={handleToggle}></AiOutlineEdit>
        
      ) : (
        <div className="flex items-center">
         
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white w-1/2 rounded p-6">
            <h2>Update Position</h2>
        <Select
          data={positions.map(({name, id}) => ({label: name, value: id}))}
          onChange={handlePositionSelect}
          placeholder="Select a position"
          clearable
        />
        <form onSubmit={handleSubmit}>
        <TextInput 
  label="Name" 
  required 
  value={form.values.name} 
  onChange={(event) => form.setFieldValue('name', event.target.value)} 
/>

          <Select
            placeholder="Select a parent position"
            data={positions.map(({name, id}) => ({label: name, value: id}))}
            value={form.values.parentId}
            onChange={handleParentSelect}
            clearable
          />
           <Button variant="outline" type="submit">Update Position</Button>
          <Button
            className="text-amber-500 hover:bg-slate-400/50 m-3"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </form>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };
 
  export const UpdateEmployee = () => {
    const [showUpdateEmployee, setShowUpdateEmployee] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
    const handleToggle = () => {
      setShowUpdateEmployee(!showUpdateEmployee);
    };
    const handleCancel = () => {
      setShowUpdateEmployee(false);
    };
  
    const dispatch = useAppDispatch();
  
    useEffect(() => {
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
  
      get(child(dbRef, 'employees/')).then((snapshot) => {
        if (snapshot.exists()) {
          setEmployees(Object.values(snapshot.val()));
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
        email: '',
        name: '',
        positionId: '', // this will now hold the position id
      },
    });
  
    const handleEmployeeSelect = (value: any) => {
      const employee = employees.find(e => e.id === value);
      if (employee) {
        setSelectedEmployee(employee);
        form.setFieldValue('email', employee.email);
        form.setFieldValue('name', employee.name);
        form.setFieldValue('positionId', employee.positionId);
        form.setFieldValue('id', employee.id);
      }
    };
  
    const handleSubmit = () => {
      if (!selectedEmployee) {
        alert('Please select an employee to update');
        return;
      }
  
      const updatedEmployee = {
        id: selectedEmployee.id,
        email: form.values.email,
        name: form.values.name,
        positionId: form.values.positionId,
      };
  
      set(ref(db, 'employees/' + updatedEmployee.id), updatedEmployee)
        .then(() => {
          console.log('Data updated successfully');
          form.reset();
          setSelectedEmployee(null);
          dispatch(FetchPositions()); // trigger a re-fetch
        })
        .catch((error) => {
          console.error('Data update failed:', error);
        });
    };
  
    return (
      <div className="flex items-right justify-end">
      {!showUpdateEmployee ? (
      < AiOutlineEdit onClick={handleToggle}></AiOutlineEdit>
        
      ) : (
        <div className="flex items-center">
         
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white w-1/2 rounded p-6">
            <h2>Update Employee</h2>
            <form onSubmit={form.onSubmit(handleSubmit)}>
               <Select
                 data={employees.map(({name, id}) => ({label: name, value: id}))}
                 onChange={handleEmployeeSelect}
                 placeholder="Select an employee"
               />
               <TextInput label="Email" required {...form.getInputProps('email')} />
               <TextInput label="Name" required {...form.getInputProps('name')} />
               <Select
                 label="Position"
                 placeholder="Select a position"
                 required
                 data={positions.map(position => ({ value: position.id, label: position.name }))}
                 {...form.getInputProps('positionId')}
               />
               <Button  variant="outline" type="submit">Update Employee</Button>
               <Button  className="text-amber-500 hover:bg-slate-400/50 m-3" onClick={handleCancel}>Cancel</Button>
             </form>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };

 
  