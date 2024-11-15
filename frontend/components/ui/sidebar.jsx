import { useEffect, useState } from 'react';

// eslint-disable-next-line react/prop-types
export function Sidebar({ title, setTitleInParent, children }) {
    const [newTitle, setTitle] = useState(title);

    useEffect(() => {
        setTitle(title);
    }, [title]);

    // Handle real-time title change
    const handleTitleChange = (e) => {
        const updatedTitle = e.target.value;
        setTitle(updatedTitle);
        setTitleInParent(updatedTitle);
    };

    return (
        <div>
            <div className="flex items-center content-center justify-left mx-4">
                <input
                    type="text"
                    value={newTitle}
                    onChange={handleTitleChange}
                    autoFocus={true}
                    placeholder="Task 1"
                    className="min-w-[344px] pl-3 mb-2 rounded-md border border-neutral-200 p-1 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white hover:bg-gray-300 transition-colors duration-300 mt-0.5 "
                />
            </div>

            <div>
                {children}
            </div>
        </div>
    );
}
