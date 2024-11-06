// Delete task button with trashcan icon
// TODO move dialog popup to different component
import React, { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { DialogDemo } from "./Dialog";

export function TaskDeleteButton({task}){
    const [deletePopup, setDeletePopup] = useState({ isOpen: false, taskId: null });

    const handleDeletePopup = (action, taskId) => {
        setDeletePopup({ isOpen: false, taskId: null }); // Close dialog after action
        if (action === "delete") {
            deleteTask(taskId);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
            if (response.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } else {
                console.log(`Error deleting task ${taskId}`);
            }
        } catch (e) {
            console.error(e.message);
        }
    };

    return(
        <>
        {/* TODO Move dialog to new component */}
         <DialogDemo
                onAction={(action) => handleDeletePopup(action, deletePopup.taskId)}
                isOpen={deletePopup.isOpen}
            />
            <Button variant="ghost" size="icon" onClick={() => setDeletePopup({ isOpen: true, taskId: task.id })}>
                <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </Button>
        </>
       
    )

}