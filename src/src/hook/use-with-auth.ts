import { useWithSpfxLogin } from "abe-client";
import React, { useEffect } from "react";
import form from "form-urlencoded";
import * as jwt_decode from 'jwt-decode';
import { UserRole } from "../types";
import { getMsalToken } from "./use-with-msal-auth";

export function useWithAuth() {
    const {setUser, loginWithMicrosoft, state} = useWithSpfxLogin();

    

    async function getUserAuthToken(){
        try{
            // console.log("using runtime")
            // const accessToken = await Office.auth.getAccessToken({ allowSignInPrompt: true, allowConsentPrompt: true })
            console.log("using msal")
            const accessToken = await getMsalToken();
            return accessToken;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function loginUser(){
        const accessToken = await getUserAuthToken();
        try{
            await loginWithMicrosoft(accessToken);
        }
        catch(error){
            console.error(error);
            throw error;
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
        loginUser,
        initializeUser
    }
}

