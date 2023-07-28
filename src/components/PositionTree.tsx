import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from './Store';
import { useAppDispatch, FetchPositions} from './Store';
import 'react-folder-tree/dist/style.css';
import "../index.css";
import { TiFolder, TiFolderOpen,TiFolderAdd } from 'react-icons/ti';
import { AiOutlineUser, AiOutlineTeam } from 'react-icons/ai';
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
const TreeNode: React.FC<{ position: Position, searchTerm: string }> = ({ position, searchTerm }) => {
  const [collapsed, setCollapsed] = useState(true); // Initially collapsed
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [manuallyToggled, setManuallyToggled] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false); // New state variable

  // Check if the current position matches the search term.
  const positionMatchesSearch = (position: Position): boolean => {
    const match = searchTerm !== '' && position.employees.some(employee => employee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const childMatch = position.children.some(positionMatchesSearch);

    console.log("Position:", position.name, "Match:", match || childMatch);  // Check if matching correctly

    return match || childMatch;
};
  

  const matchesSearch = positionMatchesSearch(position);

  useEffect(() => {
    console.log("Use effect running");  // Check if useEffect is running
    if (!manuallyToggled && matchesSearch) {
      setCollapsed(false);
    } else if (!manuallyToggled && !matchesSearch) {
      setCollapsed(true);
    }
}, [position, searchTerm, manuallyToggled, matchesSearch]);
  const handleClick = () => {
   
    setCollapsed(prev => !prev);
    setManuallyToggled(true);
    setSelectedId(position.id);
  };
  const handleShowEmployeesClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowEmployees(prev => !prev);
  };
  useEffect(() => {
    if (matchesSearch) {
        setShowEmployees(true);
    } else {
        setShowEmployees(false);
    }
}, [matchesSearch]);

  return (
    <div className="p-4 m-2 rounded-md pl-4 bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
      <div 
        onClick={handleClick} 
        className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-200 transition-colors ml-2${selectedId === position.id ? 'bg-blue-100' : ''}`}
      >
        {collapsed ? <TiFolder className="w-6 h-6 mr-4 text-gray-500"/> : <TiFolderOpen className="w-6 h-6 mr-4  text-blue-500"/>}
        {matchesSearch && <TiFolderAdd className="w-6 h-6 mr-4 text-red-500"/>}
        
        <div className='flex justify-between items-center w-full'>
          <div className="text-gray-700 font-semibold flex items-center"> {position.name} 
          {position.employees && position.employees.length > 0 && (
              <div className="pl-7 cursor-pointer hover:text-blue-600 transition-colors flex items-center" onClick={handleShowEmployeesClick}>
                <AiOutlineTeam />
              </div>
            )}</div>
       
          <div className="flex item-center space-x-3">
            <div className='cursor-pointer hover:text-blue-600 transition-colors'>
              <UpdatePosition position={position} />
            </div>
            <div className="cursor-pointer hover:text-red-600 transition-colors"> 
              <DeletePosition position={position} />
            </div>
          </div>
        </div>
      </div>
      {!collapsed && (
          <>
            {showEmployees && position.employees?.map((employee) => (
              <div className="mt-2 bg-white shadow-md rounded-lg p-3 pl-3 ml-10 flex items-center justify-between space-x-3" key={`employee-${employee.id}`}>
                <div className='mr-2 ml-2'>
                  <AiOutlineUser className="w-5 h-5 text-gray-500"/>
                </div>
                <div className='flex justify-between items-center w-full'>
                  <div className="text-gray-600">{employee.name} </div>
                  <div className='flex items-center space-x-3'> 
                    <div className='cursor-pointer hover:text-blue-600 transition-colors'>
                      <UpdateEmployee employee={employee} />
                    </div> 
                    <div className="cursor-pointer hover:text-red-600 transition-colors"> 
                      <DeleteEmployee employee={employee}/> 
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {position.children?.map((childPosition) => (
              <TreeNode key={childPosition.id} position={childPosition} searchTerm={searchTerm} />
            ))}
          </>
        )}
      </div>
    );
};

export const PositionTree: React.FC = () => {
  const positions = useSelector((state: RootState) => state.positions as Position[]);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    dispatch(FetchPositions());
  }, [dispatch]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const term = (event.target as HTMLInputElement).value;
      console.log("Search term:", term);  // Log the searchTerm
      setSearchTerm(term);
    }
  }
  

  return (
    <div className="mt-10 px-4 py-6">
      <div className="mb-6 flex justify-center ">
        <input 
          type="text" 
          placeholder="Search employees..." 
          className="border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none"
          onKeyPress={handleKeyPress} 
        />
      </div>
      {positions.map((position: Position) => (
        <TreeNode key={position.id} position={position} searchTerm={searchTerm} />
      ))}
    </div>
  );
};



