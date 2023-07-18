import React, { useState, useEffect } from 'react';
import { TextInput, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { getDatabase, ref, set, child, remove } from 'firebase/database';
import { useAppDispatch, FetchPositions,FetchEmployees } from './Store';
import { PositionTree } from './PositionTree';
import { Position,Employee } from './PositionTree';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { AsyncThunkAction, AnyAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';
import { query, orderByChild, equalTo, get } from "firebase/database";
 import { Select, SelectItem } from '@mantine/core';
 import { AiOutlineDelete } from 'react-icons/ai';
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


// ... other code

export const DeletePosition = () => {
  const dispatch = useAppDispatch();
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [showDeletePosition, setShowDeletePosition] = useState(false);

  const handleToggle = () => {
    setShowDeletePosition(!showDeletePosition);
  };
  const handleCancel = () => {
    setShowDeletePosition(false);
  };

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

  const handlePositionSelect = (positionId: string | null) => {
    setSelectedPositionId(positionId);
  };

  const handleDelete = () => {
    if (selectedPositionId) {
      remove(ref(db, 'positions/' + selectedPositionId))
        .then(() => {
          console.log('Position deleted successfully');
          setSelectedPositionId(null); // Reset selected position
          dispatch(FetchPositions()); // Refresh positions
        })
        .catch((error) => {
          console.error('Failed to delete position:', error);
        });
    } else {
      alert('Please select a position first.');
    }
  };
  

  return (
    <div className="flex items-right justify-end z-10">
{!showDeletePosition ? (
  <AiOutlineDelete
   
    onClick={handleToggle}
  >
    
  </AiOutlineDelete>
) : (
  <div className="flex items-center">
   
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-1/2 rounded p-6">
      <h2>Delete Position</h2>
      <Select
        label="Select a position to delete"
        placeholder="Select a position"
        data={positions.map(position => ({ value: position.id, label: position.name }))}
        onChange={handlePositionSelect}
        value={selectedPositionId}
      />
      <Button variant="outline" onClick={handleDelete}>
        Delete Position
      </Button>
      <Button
            className="text-amber-500 hover:bg-slate-400/50 m-3"
            onClick={handleCancel}
          >
            Cancel
          </Button>
      </div>
    </div>
  </div>
)}
</div>
  );
};


export const DeleteEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [showDeleteEmployee, setShowDeleteEmployee] = useState(false);

  const handleToggle = () => {
    setShowDeleteEmployee(!showDeleteEmployee);
  };
  const handleCancel = () => {
    setShowDeleteEmployee(false);
  };
  useEffect(() => {
    const dbRef = ref(getDatabase());
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

  useEffect(() => {
    if (!employees.find(e => e.id === selectedEmployeeId)) {
      setSelectedEmployeeId(null);
    }
  }, [employees, selectedEmployeeId]);

  const handleDelete = () => {
    if (selectedEmployeeId) {
      remove(ref(db, 'employees/' + selectedEmployeeId))
        .then(() => {
          console.log('Employee deleted successfully');
          setSelectedEmployeeId(null); // Reset selected employee
          dispatch(FetchPositions()); // Refresh positions
          dispatch(FetchEmployees());
        })
        .catch((error) => {
          console.error('Failed to delete employee:', error);
        });
    } else {
      alert('Please select an employee first.');
    }
  };

  return (
    <div className="flex items-right justify-end z-10">
  {!showDeleteEmployee ? (
   <AiOutlineDelete
   
   onClick={handleToggle}
 >
   
 </AiOutlineDelete>
  ) : (
  <div className="flex items-center">
   
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-1/2 rounded p-6">
      <h2>Delete Employee</h2>
      <Select
          label="Employee"
          placeholder="Select an employee"
          required
          data={employees.map(employee => ({ value: employee.id, label: employee.name }))}
          onChange={(value) => setSelectedEmployeeId(value)}
        />
        <Button variant="outline" onClick={handleDelete}>
          Delete Employee
        </Button>
      <Button
            className="text-amber-500 hover:bg-slate-400/50 m-3"
            onClick={handleCancel}
          >
            Cancel
          </Button>
      </div>
    </div>
  </div>
  )}
  </div>
  );
  };