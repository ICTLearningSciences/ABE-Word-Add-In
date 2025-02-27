import { useWithSpfxLogin } from "abe-client";
import { getMsalToken } from "./use-with-msal-auth";

export function useWithAuth() {
    const {setUser, loginWithMicrosoft, state, logout} = useWithSpfxLogin();

    

    async function getUserAuthToken(){
        try{
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

