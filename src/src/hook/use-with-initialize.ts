import { useWithSpfxLogin, useWithState } from "abe-client";
import { useEffect, useState } from "react";
import { getDocumentCustomProperties } from "../../taskpane/taskpane";
import { DOCUMENT_UNIQUE_ID_KEY } from "../constants";
import { useWithAuth } from "./use-with-auth";


export enum InitializeDocumentStatus{
    Loading,
    Loaded,
    Error
}
export interface InitializeDocumentState{
    status: InitializeDocumentStatus,
    error?: string
}

export function useWithInitialize() {
    const [initializeDocumentState, setInitializeDocumentState] = useState<InitializeDocumentState>({status: InitializeDocumentStatus.Loading});
    const {state: userState} = useWithSpfxLogin();
    const user = userState.user;
    const {updateCurrentDocId, state} = useWithState();
    const userGoogleDocs = state.userGoogleDocs;
    const googleDocsLoaded = state.userGoogleDocsLoadStatus === 2
    const {loginUser} = useWithAuth();
    
    useEffect(() => {
        loginUser();
    }, []);

    useEffect(() => {
        if(!user?._id || !googleDocsLoaded) return;
        getDocumentCustomProperties().then((curDocProperties) => {
            const curDocId = curDocProperties.items.find((property) => property.key === DOCUMENT_UNIQUE_ID_KEY)?.value;
            if(curDocId){
                const userGoogleDoc = userGoogleDocs.find((doc) => doc.wordDocId === curDocId)
                if(userGoogleDoc){
                    updateCurrentDocId(userGoogleDoc.googleDocId);
                    setInitializeDocumentState({status: InitializeDocumentStatus.Loaded});
                }else{
                    setInitializeDocumentState({status: InitializeDocumentStatus.Error, error: "This document does not belong to the user."});
                }
            }else{
                setInitializeDocumentState({status: InitializeDocumentStatus.Error, error: "This add-in only supports documents created through the ABE interface."});
            }
        }).catch((error) => {
            setInitializeDocumentState({status: InitializeDocumentStatus.Error, error: error.message});
        });
    }, [user?._id, googleDocsLoaded]);

    return {
        initializeDocumentState
    }
}