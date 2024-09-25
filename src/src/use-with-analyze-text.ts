import { useState } from "react";
import { AzureServiceModel, GenericLlmRequest, PromptConfiguration, PromptOutputTypes, PromptRoles } from "./types";
import { syncLlmRequest } from "./hook/use-with-sync-polling";
import { AiServicesResponseTypes } from "./ai-services/ai-service-types";

export function useWithAnalyzeText() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analyzeText = async (userDocText: string, llmRole: string): Promise<void> => {
    try{
      setLoading(true);
      setError(null);
      const llmRequest: GenericLlmRequest = {
          prompts: [],
          targetAiServiceModel: AzureServiceModel,
          outputDataType: PromptOutputTypes.TEXT,
          responseFormat: "",
          systemRole: "You are analyzing a students document."
        };
        const promptConfig: PromptConfiguration = {
          promptText: `You are analyzing the following text: ${userDocText}\n\n
          
          ${llmRole}`,
          promptRole: PromptRoles.USER,
          includeEssay: false
        };
        llmRequest.prompts.push(promptConfig);
      const res = await syncLlmRequest(llmRequest)
        setOutput(res.answer);
        setLoading(false);
    }catch (error) {
      setError(`Error: ${error}`);
      setLoading(false);
    }finally {
      setLoading(false);
    }

  };

  return { output, analyzeText, loading, error };
}