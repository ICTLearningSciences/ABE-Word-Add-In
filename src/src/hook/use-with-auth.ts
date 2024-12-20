import { useWithSpfxLogin } from "abe-client";
import React, { useEffect } from "react";
import form from "form-urlencoded";
import * as jwt_decode from 'jwt-decode';
import { UserRole } from "../types";
import { getMsalToken } from "./use-with-msal-auth";

export function useWithAuth() {
    const {setUser, loginWithMicrosoft, state, logout} = useWithSpfxLogin();

    

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

    return {
        getUserAuthToken,
        loginUser,
        userLoggedIn: state.loginStatus === 3,
        loginState: state,
        logout
    }
}

