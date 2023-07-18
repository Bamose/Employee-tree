import React, { useState, useEffect } from 'react';
import { TextInput, Button, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';
/* import { PositionTree } from "./PositionTree"; */
import { useAppDispatch, FetchPositions } from './Store';
import { Position,PositionTree,Employee } from './PositionTree';
import { v4 as uuidv4 } from 'uuid';
const config = {
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
  app = initializeApp(config);
} else {
  app = getApp();
}

const db = getDatabase(app);

export const RegisterEmployee = () => {
  const [showRegisteEmployee, setShowRegisteEmployee] = useState(false);

  const handleToggle = () => {
    setShowRegisteEmployee(!showRegisteEmployee);
  };
  const handleCancel = () => {
    setShowRegisteEmployee(false);
  };

  const dispatch = useAppDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
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

  const form = useForm({
    initialValues: {
      id: '',
      email: '',
      name: '',
      positionId: '', // this will now hold the position id
    },
  });

  const handleSubmit = () => {
    const employee = {
      id:  uuidv4(),
      email: form.values.email,
      name: form.values.name,
      positionId: form.values.positionId,
    };

    set(ref(db, 'employees/' + employee.id), employee)
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
    <div className="flex items-right justify-end">
{!showRegisteEmployee ? (
  <button
    className="bg-amber-500  min-h-32 text-black px-16 py-2  rounded hover:scale-90 hover:bg-amber-500 "
    onClick={handleToggle}
  >
   Register New Employee
  </button>
) : (
  <div className="flex items-center">
   
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-1/2  rounded p-6">
      <h2>Register Position</h2>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Email" required {...form.getInputProps('email')} />
        <TextInput label="Name" required {...form.getInputProps('name')} />
        <Select
          label="Position"
          placeholder="Select a position"
          required
          data={positions.map(position => ({ value: position.id, label: position.name }))}
          {...form.getInputProps('positionId')}
        />
        <Button variant="outline" type="submit">
          Register Employee
        </Button>
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
    </>
  );
};
