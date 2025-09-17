import { useWithCurrentGoalActivity, useWithRawTextDocVersions } from "abe-client";
import { getDocumentText } from "../../taskpane/taskpane";
import { useEffect, useState } from "react";
import { useWithAuth } from "./use-with-auth";

export interface DocData {
    plainText: string;
    markdownText: string;
    lastChangedId: string;
    title: string;
    lastModifyingUser: string;
    modifiedTime: string;
  }

export function useWithDocVersioning() {
    const useCurrentGoalActivity = useWithCurrentGoalActivity();
    const selectedActivityId = useCurrentGoalActivity?.goalActivityState?.selectedActivity?._id;
    const user = useWithAuth()
    const [docData, setDocData] = useState<DocData | null>(null);
    const useRawTextDocVersions = useWithRawTextDocVersions(selectedActivityId || "", docData);

    useEffect(() => {
        if(!user?.loginState.user?._id){
            return;
        }
        const interval = setInterval(() => {
            getDocumentText(user?.loginState.user?._id || "").then((docData) => {
                setDocData(docData);
            });
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [user?.loginState.user?._id]);

    return {useRawTextDocVersions};
}