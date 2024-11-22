// // Sidebar.js
// import {useEffect, useState} from 'react';
// import {Pencil1Icon, CheckIcon} from '@radix-ui/react-icons';


// // eslint-disable-next-line react/prop-types
// export function Sidebar({title, setTitleInParent, editMode, isEditMode, children}) {
//     const [newTitle, set_title] = useState(title);


//     useEffect(() => {
//         set_title(title);
//     }, [title]);




//     const pencil_click = () => {
//         set_title("");
//         isEditMode(true);
//     };


//     const handle_save = () => {
//         if (newTitle.trim() === "") {
//             set_title("");
//         } else {
//             set_title(newTitle);
//         }
//         setTitleInParent(newTitle);
//         isEditMode(false);
//     };


//     return (
//         <div>
//             {editMode ? (
//                 <div className="flex items-center content-center justify-left mx-4">
//                     <input
//                         type="text"
//                         value={newTitle}
//                         onChange={(e) => set_title(e.target.value)}
//                         autoFocus={true}
//                         placeholder='Task 1'
//                         className="min-w-[344px] pl-3 mb-2 rounded-md border border-neutral-200 p-1 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white hover:bg-gray-300 transition-colors duration-300 mt-0.5 "
//                     />
//                     <button onClick={handle_save}>
//                         <CheckIcon className="h-5 w-5 hover:text-green-500 transition-colors duration-200"/>
//                     </button>
//                 </div>
//             ) : (
//                 <div className='flex items-center justify-between'>
//                     <h1 className="text-xl font-semibold mt-4 mb-4">{newTitle}</h1>
//                     <button onClick={pencil_click} className="focus:outline-none mt-2">
//                         <Pencil1Icon className="h-4 w-4 text-gray-500"/>
//                     </button>
//                 </div>
//             )}
//             <div>
//                 {children}
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';
import { Pencil1Icon, CheckIcon } from '@radix-ui/react-icons';
import { Label } from '@radix-ui/react-label';


export function Sidebar({ title, setTitleInParent, editMode, isEditMode, children }) {
    const [newTitle, setNewTitle] = useState(title);


    useEffect(() => {
        setNewTitle(title);
    }, [title]);


    const pencilClick = () => {
        isEditMode(true);
    };


    const handleSave = () => {
        if (newTitle.trim() === "") {
            setNewTitle("");
        } else {
            setNewTitle(newTitle);
        }
        setTitleInParent(newTitle);  
        isEditMode(false);  
    };


    return (
        <div
            style={{
                backgroundColor: '#F1F6F9',
                height: '100vh', // full page height
                width: '350px',  // sidebar width
                position: 'fixed', // fixes the sidebar to the page
                right: 0, // aligns sidebar to the rightmost part of the page
                top: 50, // start from top of the page
            }}
            className="p-4 shadow-lg"
        >
            <div className="text-xl flex justify-center mt-4">Task Detail</div>


            <div className="flex items-center justify-between">
                {editMode ? (
                    <div className="flex items-center content-center justify-left mx-4">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => {
                                setNewTitle(e.target.value); // Update local state
                                setTitleInParent(e.target.value); // Update parent state
                            }}
                            //onChange={(e) => setNewTitle(e.target.value)}
                            autoFocus
                            placeholder="Task Title"
                            className="min-w-[250px] pl-3 mb-4 mt-4 rounded-md border border-neutral-200 p-1 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white hover:bg-gray-300 transition-colors duration-300 mt-0.5 "
                        />
                        {/* <button onClick={handleSave}>
                            <CheckIcon className="h-5 w-5 hover:text-green-500 transition-colors duration-200" />
                        </button> */}
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <h1 className="mt-4 mb-4 ml-4 w-60 truncate">{newTitle}</h1>
                        {/* <h1 className="text-xl font-semibold mt-4 mb-4 ml-4 w-60 truncate">{newTitle}</h1> */}
                        <button onClick={pencilClick} className="focus:outline-none mt-2">
                            <Pencil1Icon className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>
                )}
            </div>


            <div>
                {children}
            </div>
        </div>
    );
}
