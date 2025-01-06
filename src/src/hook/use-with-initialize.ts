import { useWithSpfxLogin, useWithState } from "abe-client";
import { useEffect, useState } from "react";
import { getDocumentCustomProperties } from "../../taskpane/taskpane";
import { DOCUMENT_UNIQUE_ID_KEY } from "../constants";
import { useWithAuth } from "./use-with-auth";


export enum InitializeDocumentStatus{
    VERIFYING_ABE_DOC,
    WAITING_FOR_LOGIN,
    LOCATING_DB_DOC,
    Loaded,
    Error
}
export interface InitializeDocumentState{
    status: InitializeDocumentStatus,
    error?: string
}

export function useWithInitialize() {
    const [initializeDocumentState, setInitializeDocumentState] = useState<InitializeDocumentState>({status: InitializeDocumentStatus.VERIFYING_ABE_DOC});
    const [customDocId, setCustomDocId] = useState<string>();
    const {state: userState} = useWithSpfxLogin();
    const user = userState.user;
    const {updateCurrentDocId, state} = useWithState();
    const userGoogleDocs = state.userGoogleDocs;
    const googleDocsLoaded = state.userGoogleDocsLoadStatus === 2
    const {loginUser} = useWithAuth();
    console.log(initializeDocumentState.status)
    useEffect(() => {
        loginUser();
    }, []);

    useEffect(() => {
        if(initializeDocumentState.status !== InitializeDocumentStatus.VERIFYING_ABE_DOC) return;
        getDocumentCustomProperties().then((curDocProperties) => {
            const curDocId = curDocProperties.items.find((property) => property.key === DOCUMENT_UNIQUE_ID_KEY)?.value;
            if(curDocId){
                setCustomDocId(curDocId);
                setInitializeDocumentState({status: InitializeDocumentStatus.WAITING_FOR_LOGIN});
            }else{
                setInitializeDocumentState({status: InitializeDocumentStatus.Error, error: "This add-in only supports documents created through the SharePoint ABE interface."});
            }
        }).catch((error) => {
            setInitializeDocumentState({status: InitializeDocumentStatus.Error, error: error.message});
        });
    }, []);

    useEffect(() => {
        if(initializeDocumentState.status !== InitializeDocumentStatus.WAITING_FOR_LOGIN) return;
        if(user?._id && googleDocsLoaded && customDocId){
            setInitializeDocumentState({status: InitializeDocumentStatus.LOCATING_DB_DOC});
        }
    }, [user?._id, googleDocsLoaded, customDocId, initializeDocumentState.status]);

    useEffect(() => {
        if(initializeDocumentState.status !== InitializeDocumentStatus.LOCATING_DB_DOC) return;
        const userGoogleDoc = userGoogleDocs.find((doc) => doc.wordDocId === customDocId)
        if(userGoogleDoc){
            updateCurrentDocId(userGoogleDoc.googleDocId);
            setInitializeDocumentState({status: InitializeDocumentStatus.Loaded});
        }else{
            setInitializeDocumentState({status: InitializeDocumentStatus.Error, error: "This document does not belong to the user."});
        }
    }, [initializeDocumentState.status]);

    return {
        initializeDocumentState,
    }
}