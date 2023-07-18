import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from './Store';
import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { useAppDispatch, FetchPositions, FetchEmployees } from './Store';
import TreeView from 'react-treeview';
import 'react-folder-tree/dist/style.css';
import "../index.css";
import { TiFolder, TiFolderOpen } from 'react-icons/ti';
import { GiPositionMarker } from 'react-icons/gi';
import { AiOutlineUser } from 'react-icons/ai';
import { UpdatePosition,UpdateEmployee } from "./Update";
import { DeleteEmployee,DeletePosition } from './Delete';
export interface Position {
  id: string;
  name: string;
  parentId: string | null;
  children: Position[];
  employees: Employee[];
}

export interface Employee {
  id: string;
  email: string;
  name: string;
  positionId: string;
}
export interface PositionsMap {
  [key: string]: Position;
}

export interface EmployeesMap {
  [key: string]: Employee;
}
const TreeNode: React.FC<{ position: Position }> = ({ position }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = () => {
    setCollapsed(!collapsed);
    setSelectedId(position.id);
  };

  return (
    <div className="p-2 m-2 rounded-md">
      <div 
        onClick={handleClick} 
        className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md w-11/12  ${selectedId === position.id ? 'bg-gray-400/50' : 'bg-white'}`}
      >
        {collapsed ? <TiFolder className="w-5 h-5 mr-5"/> : <TiFolderOpen className="w-5 h-5 mr-5"/>}
        
       <div className='flex justify-between items-center w-full'><div> {position.name} </div>
        <div className="flex item-center">
        <div className='cursor-pointer'><UpdatePosition /> </div> <div className="ml-3 cursor-pointer"> <DeletePosition /></div>
        </div>
        </div>
      </div>
      {!collapsed && (
        <>
          {position.employees?.map((employee) => (
            <div className="info ml-5 mr-5 flex items-center space-x-2 px-3 w-11/12" key={`employee-${employee.id}`}>
            <div className='mr-2'>
              <AiOutlineUser className="w-4 h-4 "/>
            </div>
            <div className='flex justify-between items-center w-full'>
              <div>{employee.name} </div>
              <div className='flex items-center'> 
                <div className='cursor-pointer'><UpdateEmployee /></div> 
                <div className="ml-3 cursor-pointer"> <DeleteEmployee /> </div>
              </div>
            </div>
          </div>

          ))}
          {position.children?.map((childPosition) => (
            <TreeNode key={childPosition.id} position={childPosition} />
          ))}
        </>
      )}
    </div>
  );
};

export const PositionTree: React.FC = () => {
  const positions = useSelector((state: RootState) => state.positions as Position[]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(FetchPositions());
  }, [dispatch]);

  return (
    <div className="mt-10">
      {positions.map((position: Position) => (
        <TreeNode key={position.id} position={position} />
      ))}
    </div>
  );
};




