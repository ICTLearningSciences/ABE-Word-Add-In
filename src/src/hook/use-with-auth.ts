import { useWithSpfxLogin } from "abe-client";
import React, { useEffect } from "react";
import { UserRole } from "../types";

export function useWithAuth() {
    const {setUser} = useWithSpfxLogin();
    useEffect(() => {
        setUser({
            accessToken: process.env.REACT_APP_ACCESS_TOKEN,
            expirationDate: new Date().toISOString(),
            user: {
                _id: "66f2156364d82c54c8d33f56",
                googleId: "microsoft-ashiel@ict.usc.edu",
                name: "Aaron Shiel",
                email: "ashiel@ict.usc.edu",
                userRole: UserRole.USER,
                lastLoginAt: new Date()
            }
        })

    }, []);

    async function getUserAuthToken(){
        
        try{
            console.log("using runtime")
            const accessToken = await OfficeRuntime.auth.getAccessToken({ allowSignInPrompt: true })
            return accessToken;
        } catch (error) {
            try{
                console.error(error);
                console.log("using office")
                const accessToken = await Office.auth.getAccessToken({ allowSignInPrompt: true })
                return accessToken;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }

    return {
        getUserAuthToken
    }
}

