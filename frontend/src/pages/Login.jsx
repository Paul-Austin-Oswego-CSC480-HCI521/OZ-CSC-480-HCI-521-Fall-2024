import { useState } from 'react'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { PasswordInput } from '@/components/PasswordInput'
import { LoginRegisterShell } from '@/components/LoginRegisterShell'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Handle password data from PasswordInput
    const handlePasswordFromChild = (data) => {
        setPassword(data)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const loginData = {
            username: email,
            password: password,
        };
        try {
            const response = await fetch(`${import.meta.env.VITE_AUTH_ROOT}/auth/native-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
                credentials: 'include'
            });

            if (response.ok)
                window.location.href = '/'
            else
                console.log('Login failed:', response.statusText);
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleGithubLogin = async () => {
        // Here you would typically handle Google login logic
        window.location.replace(`${import.meta.env.VITE_AUTH_ROOT}/auth/login`)
    }

    return (
        // Shell to standardize login and register styling
        <LoginRegisterShell 
            title={"Log In"}
            type={"login"}
            dividerText={"OR LOG IN WITH"}
            githubText={"Log in with GitHub"}
            githubMethod={handleGithubLogin}
            >
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
                    <div className="flex flex-col space-y-1.5">
                        <PasswordInput id={"password"} name={"password"} label={"Password"} onChildPasswordData={handlePasswordFromChild}/>
                    </div>
                </div>
                <Button className="w-full mt-6" type="submit">
                    Log in
                </Button>
            </form>
        </LoginRegisterShell>
    )
}


