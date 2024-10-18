import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [reveal_pw, reveal_password] = useState('false')

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

    const handleGoogleLogin = async () => {
        // Here you would typically handle Google login logic
        window.location.replace(`${import.meta.env.VITE_AUTH_ROOT}/auth/login`)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px] h-[525px]">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center">Login</CardTitle>
                </CardHeader>
                <CardContent>
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
                                <Label htmlFor="password">Password</Label>
                            <div className='flex items-center'>
                                <Input
                                    id="password"
                                    type={reveal_pw ? 'password' : 'text'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className = "flex-grow"
                                />
                                <div>
                                <Button
                                    type = "button"
                                    onClick = {() => reveal_password(!reveal_pw)}
                                    value = "words"
                                    className = "ml-2"
                                >
                                     <FontAwesomeIcon icon={reveal_pw ? faEyeSlash : faEye} />
                                </Button>
                                </div>
                            </div>
                         </div>
                        </div>
                        <Button className="w-full mt-6" type="submit">
                            Log in
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                <div className="relative w-full mb-3">
                     <div className="flex items-center">
                         <span className="flex-grow border-t border-muted-foreground" />
                             <span className="px-2 text-xs uppercase text-muted-foreground">
                                     Or continue with
                             </span>
                         <span className="flex-grow border-t border-muted-foreground" />
                    </div>
                </div>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab"
                             data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor"
                                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Login with Google
                    </Button>
                    <br/>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab"
                             data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        </svg>
                        Placeholder
                    </Button>
                    <br/>
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab"
                             data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        </svg>
                        Placeholder
                    </Button>
                </CardFooter>


                <div className="relative w-full mb-6">
          <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Don't have an account?  <u><a href='/Registration'>Sign Up </a></u>
              </span>
             </div>
         </div>
            </Card>
        </div>
    )
}


