import { useState, useEffect } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { PasswordInput } from '@/components/PasswordInput'
import { LoginRegisterShell } from '@/components/LoginRegisterShell'

import PageTitle from '@/components/PageTitle'

export function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [checkPasswordClass, setCheckPasswordClass] = useState('bg-white');
    const [isCheckPasswordDirty, setIsCheckPasswordDirty] = useState(false);

    // Handle password data from input component
    const handlePasswordFromChild = (data) => {
        setPassword(data)
    }
    // Handle password data from password check input component
    const handlePasswordCheckFromChild = (data) => {
        setCheckPassword(data);
        setIsCheckPasswordDirty(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(password !== checkPassword) {
            // Passwords do not match
            // TODO: give feedback to the user
            console.log('passwords do not match')
            return
        }
        const loginData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_AUTH_ROOT}/auth/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = '/login'
            }

            else
                //Handle more visual error logging here for duplicate email
                console.log('Registration failed:', response.statusText);
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleGithubRegistration = () => {
        console.log('GitHub Registration attempted')
    }

    useEffect(() => {
        // Check if password check field has been modified and change input styles based on state
        if (isCheckPasswordDirty) {
            if (password === checkPassword) {
                setShowErrorMessage(false);
                setCheckPasswordClass('border-green-500')
            } else {
                setShowErrorMessage(true)
                setCheckPasswordClass('border-red-500')
            }
        }
    }, [checkPassword])

    return (
        <LoginRegisterShell 
        title={"Sign Up"}
        type={"register"}
        dividerText={"OR SIGN UP WITH"}
        githubText={"Sign up with GitHub"}
        githubMethod={handleGithubRegistration}
        > 
            <PageTitle title="Register | Checkmate" />
            <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <PasswordInput id={"password"} name={"password"} label={"Password"} onChildPasswordData={handlePasswordFromChild}/>
                    <PasswordInput id={"confirmPassword"} name={"confirmPassword"} label={"Confirm Password"} onChildPasswordData={handlePasswordCheckFromChild} inputClassName={checkPasswordClass}/>
                    {showErrorMessage && isCheckPasswordDirty ? <p className='text-sm'> Passwords do not match </p> : ''}
                </div>
                <Button className="w-full mt-6" type="submit">
                    Sign Up
                </Button>
            </form>
        </LoginRegisterShell>
    )
}
