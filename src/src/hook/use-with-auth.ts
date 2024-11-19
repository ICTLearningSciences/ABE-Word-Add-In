import { useWithSpfxLogin } from "abe-client";
import React, { useEffect } from "react";
import { UserRole } from "../types";

export function useWithAuth() {
    const {setUser} = useWithSpfxLogin();

    async function getUserAuthToken(){
        try{
            console.log("using runtime")
            const accessToken = await Office.auth.getAccessToken({ allowSignInPrompt: true, allowConsentPrompt: true })
            console.log(accessToken)
            return accessToken;
        } catch (error) {
            console.error(error);
            throw error;
            // try{
            //     console.error(error);
            //     console.log("using office")
            //     const accessToken = await Office.auth.getAccessToken({ allowSignInPrompt: true, allowConsentPrompt: true })
            //     return accessToken;
            // } catch (error) {
            //     console.error(error);
            //     throw error;
            // }
        }
    }

    async function initializeUser(){
        setUser({
            accessToken: process.env.REACT_APP_ACCESS_TOKEN,
            expirationDate: new Date().toISOString(),
            user: {
                _id: "672a7c23df15cbf286319a1b",
                googleId: "microsoft-e4a8994e-9444-4d30-96a4-cc219a98d5ae",
                name: "Aaron Shiel",
                email: "ashiel@ict.usc.edu",
                userRole: UserRole.USER,
                lastLoginAt: new Date()
            }
        })
    }

    return {
        getUserAuthToken,
        initializeUser
    }
}

