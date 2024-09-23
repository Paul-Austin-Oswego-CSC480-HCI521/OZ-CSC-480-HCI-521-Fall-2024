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

export default function Component() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<TaskPage />}/>
                    <Route path="/Login" element={<Login/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}
