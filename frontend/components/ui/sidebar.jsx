// Sidebar.js
import React, {useEffect, useState} from 'react';
import {Pencil1Icon, CheckIcon} from '@radix-ui/react-icons';

export function Sidebar({title, setTitleInParent, editMode, isEditMode, children}) {
    const [newTitle, set_title] = useState(title);

    useEffect(() => {
        set_title(title);
    }, [title]);


    const pencil_click = () => {
        set_title("");
        isEditMode(true);
    };

    const handle_save = () => {
        if (newTitle.trim() === "") {
            set_title("");
        } else {
            set_title(newTitle);
        }
        setTitleInParent(newTitle);
        isEditMode(false);
    };

    return (
        <div
            style={{
                backgroundColor: '#F1F6F9',
                height: '100vh',
                width: '250px',
                position: 'fixed',
                right: 0,
                top: 0,
            }}
            className="p-4 shadow-lg"
        >
            {editMode ? (
                <div className="flex items-center justify-between mb-4 w-full">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => set_title(e.target.value)}
                        autoFocus={true}
                        className="w-3/4 rounded-md border border-neutral-200 p-2 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white hover:bg-gray-300 transition-colors duration-300 mt-0.5 "
                    />
                    <button onClick={handle_save}>
                        <CheckIcon className="h-5 w-5 mt-5 hover:text-green-500 transition-colors duration-200"/>
                    </button>
                </div>
            ) : (
                <div className='flex items-center justify-between'>
                    <h1 className="text-xl font-semibold mt-4 mb-4">{newTitle}</h1>
                    <button onClick={pencil_click} className="focus:outline-none mt-2">
                        <Pencil1Icon className="h-4 w-4 text-gray-500"/>
                    </button>
                </div>
            )}
            <div>
                {children}
            </div>
        </div>
    );
}
