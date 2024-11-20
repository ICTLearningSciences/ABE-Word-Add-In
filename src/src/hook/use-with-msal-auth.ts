import * as msal from "@azure/msal-browser";
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: "cb525eb7-b2b8-4057-a684-390a38398577",
        authority: "https://login.microsoftonline.com/8d72fbfc-6717-444c-8802-45ba651d8fa2",
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

let initializedInstance = undefined;

export async function getMsalToken(){
    if(!initializedInstance){
        await msalInstance.initialize();
        initializedInstance = msalInstance;
    }
    const accounts = msalInstance.getAllAccounts();
    // Follow this flow:
    // https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/images/msaljs-boot-flow.png
    if(!accounts.length){
        // SSO Silent --> Interaction required ? should return token, else need to acquireTokenRedirect or acquireTokenPopup
        try{
            const res = await msalInstance.ssoSilent({
                scopes: ["User.Read"],
            })  
            console.log(res);
            return res.accessToken;
        } catch (error) {
            console.error(error);
            const res = await msalInstance.acquireTokenPopup({
                scopes: ["User.Read"],
            });
            console.log(res);
            return res.accessToken;
        }
    }else if (accounts.length === 1){
        // use single account silently
        const res = await msalInstance.acquireTokenSilent({
            scopes: ["User.Read"],
            account: accounts[0],
        });
        console.log(res);
        return res.accessToken;
    }else{
        // Multiple accounts - ask user to select one
        const res = await msalInstance.acquireTokenPopup({
            scopes: ["User.Read"],
        });
        console.log(res);
        return res.accessToken;
    }
}