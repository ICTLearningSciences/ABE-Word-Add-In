import { useWithSpfxLogin, useWithState } from "abe-client";
import { useEffect } from "react";
import { getDocumentCustomProperties } from "../../taskpane/taskpane";
import { DOCUMENT_UNIQUE_ID_KEY } from "../constants";
import { useWithAuth } from "./use-with-auth";

export function useWithInitialize() {

    const {state: userState} = useWithSpfxLogin();
    const user = userState.user;
    const {updateCurrentDocId, state} = useWithState();
    const {initializeUser} = useWithAuth();
    const userGoogleDocs = state.userGoogleDocs;
    const googleDocsLoaded = state.userGoogleDocsLoadStatus === 2

    useEffect(() => {
        initializeUser();
    }, []);

    useEffect(() => {
        if(!user?._id || !googleDocsLoaded) return;
        getDocumentCustomProperties().then((curDocProperties) => {
            console.log(curDocProperties);
            const curDocId = curDocProperties.items.find((property) => property.key === DOCUMENT_UNIQUE_ID_KEY)?.value;
            console.log(curDocId);
            if(curDocId){
                const userGoogleDoc = userGoogleDocs.find((doc) => doc.wordDocId === curDocId)
                console.log(userGoogleDoc);
                if(userGoogleDoc){
                    console.log(`updating current doc id: ${userGoogleDoc.googleDocId}`);
                    updateCurrentDocId(userGoogleDoc.googleDocId);
                }else{
                    throw new Error("No document unique id found");
                }
            }else{
                throw new Error("No document unique id found");
            }
        });
    }, [user?._id, googleDocsLoaded]);

}