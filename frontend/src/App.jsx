import React, {useState} from 'react'
import {Login} from "@/src/pages/Login.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {TaskPage} from "@/src/pages/TaskPage.jsx";
import { Register } from './pages/Registration'
import PageLayout from './pages/Layout'
import {CompletedPage} from './pages/CompletedPage'
import {RecentlyDeleted} from './pages/RecentlyDeleted'
import SharedWithMe from './pages/SharedWithMe'

export default function Component() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                     <Route path="/" element={<PageLayout />}>
                        <Route index element={<TaskPage />}/>
                        <Route path="completed" element={<CompletedPage/>}/>
                        <Route path="deleted" element={<RecentlyDeleted/>}/>
                        <Route path="shared" element={<SharedWithMe/>}/>
                     </Route>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path = "/Registration" element = {<Register/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}
