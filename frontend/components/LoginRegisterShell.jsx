// Shell for login and registration forms to standardize styling etc.

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import logoWhite from '@/src/assets/logo-white.svg'
import logo from '@/src/assets/logo.svg'

// Props:
// Children: React children components
// Title: title of form
// Type: login or registration, changes text and link at bottom of form
// Divider Text: text in between sign up or login options
// Github Text: text on github button
// Github Method: login or register function called on button click
export function LoginRegisterShell({children, title, type, dividerText, githubText, githubMethod}){
    let ctaText;
    if (type === "login"){
        ctaText = (
            <span className=" pt-8 uppercase text-xs bg-background px-2 text-muted-foreground">
                Don&apos;t have an account?  <u><a href='/Registration'>Sign Up </a></u>
            </span>
        )
    } else if (type==="register") {
        ctaText = (
            <span className=" pt-8 uppercase text-xs bg-background px-2 text-muted-foreground">
                Already have an account?  <u><a href='/Login'>Log In </a></u>
            </span>
        )
    }
    return(
        <div>
            <div className="grid grid-cols-2 items-center justify-center min-h-screen bg-white">
                <div className="min-h-screen flex flex-col justify-between bg-blueHighlight">
                    <div className="flex items-center gap-3 pt-4 pl-4">
                        <img className="p-0.5" width={32} height={32} src={logoWhite} alt=""></img>
                        <h1 className="text-2xl text-white font-bold">CheckMate</h1>
                    </div>
                    <img className="max-w-[550px] aspect-square mx-auto opacity-45" src={logo} alt=""></img>
                    <div className="text-white max-w-[600px] mx-auto pb-14 px-4 ">
                        <blockquote >
                        “Life is a constant juggle - I need something to balance everything, let me breathe, and help me stay on top of the game.”
                        </blockquote>
                        <p className="pt-4">- Paul Austin</p>
                    </div>
                </div>
                <Card className="w-[348px] min-h-[455px] mx-auto border-none shadow-none">
                    <CardHeader className={"mt-2"}>
                        <CardTitle className="flex items-center justify-center">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {children}
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <div className="relative w-full mb-4">
                            <div className="flex items-center mb-2">
                                <span className="flex-grow border-t border-muted-foreground"/>
                                <span className="mx-auto px-2 text-xs uppercase text-muted-foreground">
                                        {dividerText}
                                </span>
                                <span className="flex-grow border-t border-muted-foreground"/>
                            </div>
                        </div>
                        <div className={"flex flex-col gap-4 w-full"}>
                            <Button variant="outline" className="w-full" onClick={githubMethod}>
                                <svg className=" mr-2 " width="18" height="18" viewBox="0 0 15 15" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                                        fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                                {githubText}
                            </Button>
                        </div>
                        {ctaText}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}