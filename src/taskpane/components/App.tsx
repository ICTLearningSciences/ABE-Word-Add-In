import * as React from "react";
import { Button, Input, makeStyles } from "@fluentui/react-components";
import { ColumnDiv } from "../../styled-components";
import { getDocumentText } from "../taskpane";
import { useWithAnalyzeText } from "../../src/use-with-analyze-text";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App: React.FC<AppProps> = () => {
  const styles = useStyles();
  const [aiRole, setAiRole] = React.useState("");
  const {output, analyzeText, loading, error } = useWithAnalyzeText();
  return (
    <div className={styles.root}>
      <ColumnDiv style={{
        alignItems: "center"
      }}>
        <h3>Abe Test</h3>
        <span>AI Role Test 2</span>
        <input placeholder="Enter what you would like for the "
        multiple
        defaultValue={"Please provide 1 sentence feedback on the following text."}
        aria-multiline
        onChange={
          (e) => setAiRole(e.target.value)
        } />
        <Button onClick={async ()=>{
          const res = await getDocumentText();
          await analyzeText(res, aiRole);
        }}>
          Analyze Text
        </Button>
        <p> {error ? error : loading ? "Loading..." : output}</p>
      </ColumnDiv>
    </div>
  );
};

export default App;
