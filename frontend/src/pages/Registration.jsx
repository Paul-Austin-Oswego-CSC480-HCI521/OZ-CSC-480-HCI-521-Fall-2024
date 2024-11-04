import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [checkPassword, setCheckPassword] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [checkPasswordClass, setCheckPasswordClass] = useState('bg-white');
    const [isCheckPasswordDirty, setIsCheckPasswordDirty] = useState(false);
    const [reveal_pw, reveal_password] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        if(password === checkPassword) {
            // Passwords match, ok to submit
            console.log('Registration attempted with:', { email, password })
        }
        else {
            console.log('Cannot submit: Passwords do not match')
        }
    }

    const handleGithubRegistration = () => {
        console.log('GitHub Registration attempted')
    }

    const handleCheckPassword = (e) => {
        setCheckPassword(e.target.value);
        setIsCheckPasswordDirty(true);
    }

    useEffect(() => {
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-[350px] h-[525px]">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center">Sign up to continue</CardTitle>
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
                            <div >
                                <Label htmlFor="password">Password</Label>
                                <div className="flex items-center">
                                {/* TODO add checkmark or some status signifier that's not color-based */}
                                <Input
                                    id="password"
                                    type={reveal_pw ? 'text' : 'password'}
                                    placeholder="Create your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button
                                    type = "button"
                                    onClick = {() => reveal_password(!reveal_pw)}
                                    value = "words"
                                    className = "ml-2"
                                >
                                    <FontAwesomeIcon icon={reveal_pw ? faEye : faEyeSlash} />
                                </Button>
                                </div>
                                
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="flex items-center">
                                <Input 
                                    id="=confirmPassword" 
                                    type={reveal_pw ? 'text' : 'password'}
                                    placeholder="Confirm your password" 
                                    value={checkPassword} 
                                    onChange={handleCheckPassword} 
                                    className={checkPasswordClass}/>
                                <Button
                                    type = "button"
                                    onClick = {() => reveal_password(!reveal_pw)}
                                    value = "words"
                                    className = "ml-2"
                                >
                                    <FontAwesomeIcon icon={reveal_pw ? faEye : faEyeSlash} />
                                </Button>
                                </div>
                                
                            </div>
                            {showErrorMessage && isCheckPasswordDirty ? <p className='text-sm'> Passwords do not match </p> : ''}
                        </div>
                        <Button className="w-full mt-6" type="submit">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <div className="relative w-full mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-20 border-t"></span>
                            {/*</div>*/}
                            {/*<div className="relative flex justify-center text-xs uppercase">*/}
                            <span className="px-3 justify-center text-xs uppercase">
                                Or Sign up with
                            </span>
                            <span className="w-20 border-t"></span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleGithubRegistration}>
                        <svg className="mr-2" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                                fill="currentColor" fillRule="evenodd" clipRule="evenodd">
                            </path>
                        </svg>
                        Sign up with GitHub
                    </Button>
                </CardFooter>
                <div className="relative w-full mb-6">
                    <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Already have an account? <u><a href='/Login' color='blue'>Login </a> </u>
              </span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
