import * as React from "react";
import { Button, makeStyles, Spinner } from "@fluentui/react-components";
import { useReduxHydration, ChatActivity, useWithPrompts, useWithCurrentGoalActivity, useConfigLoader, LoginUI } from "abe-client";
import { useWithAuth } from "../../src/hook/use-with-auth";
import { InitializeDocumentStatus, useWithInitialize } from "../../src/hook/use-with-initialize";
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
  const {configLoaded, ConfigLoader} = useConfigLoader("army");
  const {userLoggedIn, loginState, loginUser, logout} = useWithAuth();
  useReduxHydration();
  const {initializeDocumentState} = useWithInitialize();
  const docLoading = initializeDocumentState.status === InitializeDocumentStatus.VERIFYING_ABE_DOC || initializeDocumentState.status === InitializeDocumentStatus.LOCATING_DB_DOC;
  const docError = initializeDocumentState.status === InitializeDocumentStatus.Error;

  if(docError){
    return <ColumnCenterDiv style={{
      height:"100vh",
    }}>
      <div>{initializeDocumentState.error}</div>
    </ColumnCenterDiv>;
  }

  if(docLoading || usePrompts.isLoading){
    return <ColumnCenterDiv style={{
      height:"100vh",
    }}>
      {docLoading && <Spinner />}
    </ColumnCenterDiv>;
  }

  if (!configLoaded || !userLoggedIn) {
    return <ColumnCenterDiv style={{
      height:"100vh",
    }}>
      {!configLoaded && <ConfigLoader />}
      {(configLoaded && !userLoggedIn)
      && <LoginUI
      loginState={loginState}
      login={loginUser}
      loginText="Login With Microsoft"
      orgName="AWE"
      />}
    </ColumnCenterDiv>;
  }

  return (
    <div className={styles.root}>
      <div style={{
        height:"100vh",
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
