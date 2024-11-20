import * as React from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { useReduxHydration, ChatActivity, useWithPrompts, useWithCurrentGoalActivity, useConfigLoader } from "abe-client";
import { useWithAuth } from "../../src/hook/use-with-auth";
import { getCreationDate, getDocumentCustomProperties, getDocumentText } from "../taskpane";
import { useWithInitialize } from "../../src/hook/use-with-initialize";
import { getMsalToken } from "../../src/hook/use-with-msal-auth";
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
  const usePrompts = useWithPrompts();
  const useCurrentGoalActivity = useWithCurrentGoalActivity();
  const {configLoaded, ConfigLoader} = useConfigLoader();
  const {getUserAuthToken, loginUser} = useWithAuth();
  useReduxHydration();
  useWithInitialize();

  if (!configLoaded) {
    return <ConfigLoader />;
  }
  return (
    <div className={styles.root}>
      <div style={{
        height:"800px",
        width:"800px",
        display:"flex",
        flexGrow:1,
      }}>
        <Button
        onClick={()=>{
          loginUser().catch((error)=>{
            console.error(error);
          })
        }}
        >Login with MSAL</Button>
      {/* <ChatActivity 
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
      /> */}
      </div>
    </div>
  );
};

export default App;
