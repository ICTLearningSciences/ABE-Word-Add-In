import * as React from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { useReduxHydration, ChatActivity, useWithPrompts, useWithCurrentGoalActivity, useConfigLoader, LoginUI } from "abe-client";
import { useWithAuth } from "../../src/hook/use-with-auth";
import { useWithInitialize } from "../../src/hook/use-with-initialize";
import { ColumnCenterDiv } from "../../styled-components";
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
  const usePrompts = useWithPrompts();
  const useCurrentGoalActivity = useWithCurrentGoalActivity();
  const {configLoaded, ConfigLoader} = useConfigLoader();
  const {userLoggedIn, loginState, loginUser, logout} = useWithAuth();
  useReduxHydration();
  useWithInitialize();

  if (!configLoaded || !userLoggedIn) {
    return <ColumnCenterDiv style={{
      height:"100vh",
    }}>
      {!configLoaded && <ConfigLoader />}
      {(configLoaded && !userLoggedIn) && <LoginUI loginState={loginState} login={loginUser} loginText="Login With Microsoft" orgName="ABE" />}
    </ColumnCenterDiv>;
  }

  return (
    <div className={styles.root}>
      <div style={{
        height:"800px",
        display:"flex",
        flexGrow:1,
      }}>
        <Button style={{
          position:"absolute",
          top:0,
          right:0,
        }} onClick={()=>{
          logout();
        }}>Logout</Button>
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
