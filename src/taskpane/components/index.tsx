import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { useWithAnalyzeText } from "../../src/use-with-analyze-text";
import { useReduxHydration, ChatActivity, useWithPrompts, useWithCurrentGoalActivity, useWithState, useConfigLoader } from "abe-client";
import { useWithAuth } from "../../src/hook/use-with-auth";
import { getDocumentText } from "../taskpane";

export interface AppProps {
  title: string;
}

export const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});


const App: React.FC<AppProps> = () => {
  const styles = useStyles();
  const [aiRole, setAiRole] = React.useState("");
  const {output, analyzeText, loading, error } = useWithAnalyzeText();
  const usePrompts = useWithPrompts();
  const {updateCurrentDocId, state} = useWithState();
  const useCurrentGoalActivity = useWithCurrentGoalActivity();
  const {configLoaded, ConfigLoader} = useConfigLoader();
  useReduxHydration();
  useWithAuth();


    React.useEffect(() => {
        // TODO: get this from the document context
        updateCurrentDocId("0e04b774-a593-495a-8022-6a4e904f5b3b");
    }, []);


  if (!configLoaded) {
    return <ConfigLoader />;
  }
  return (
    <div className={styles.root}>
      <div style={{
        height:"800px",
        display:"flex",
        flexGrow:1,
      }}>
      <ChatActivity 
        getDocData={async ()=>{
          const docText = await getDocumentText();
          return {
            plainText: docText,
            lastChangedId: "123",
          title: "Test title",
          lastModifyingUser: "Test user",
          modifiedTime: "2024-09-27T21:55:42.534Z",
        }}}
        activityFromParams=""
        goalFromParams=""
        isNewDoc={false}
        useWithPrompts={usePrompts}
        useCurrentGoalActivity={useCurrentGoalActivity}
      />
      </div>
    </div>
  );
};

export default App;
