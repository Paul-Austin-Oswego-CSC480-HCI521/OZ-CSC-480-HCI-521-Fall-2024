// import React, {useState} from 'react'
import {Login} from "@/src/pages/Login.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {TaskPage} from "@/src/pages/TaskPage.jsx";
import {Register} from './pages/Registration'
import PageLayout from './pages/Layout'
import ProjectPage from './pages/ProjectPage';
import RecentlyDeleted from "@/src/pages/RecentlyDeleted.jsx";
import ProjectProvider from "@/components/ProjectProvider";

export default function Component() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ProjectProvider><PageLayout/></ProjectProvider>}>
                        <Route index element={<TaskPage/>}/>
                        <Route path="deleted" element={<RecentlyDeleted/>}/>
                        {/*<Route path="project" element={<ProjectPage/>}/>*/}
                        <Route path="project/:projectID" element={<ProjectPage/>}/>
                    </Route>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path="/Registration" element={<Register/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}
