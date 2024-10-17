import React, {useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {CheckIcon, ArchiveIcon} from '@radix-ui/react-icons'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Login} from "@/src/pages/Login.jsx";
import * as PropTypes from "prop-types";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {TaskPage} from "@/src/pages/TaskPage.jsx";
import { Register } from './pages/Registration'
import PageLayout from './pages/Layout'
import CompletedPage from './pages/CompletedPage'
import RecentlyDeleted from './pages/RecentlyDeleted'
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
