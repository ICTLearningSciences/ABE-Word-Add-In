import axios, { AxiosResponse, AxiosRequestConfig, Method, CancelToken } from 'axios';
import { AiPromptStep, GenericLlmRequest, UserActions } from './types';
import { OpenAiServiceJobStatusResponseType } from './ai-services/open-ai-service';
import { AiServicesJobStatusResponseTypes } from './ai-services/ai-service-types';
const API_ENDPOINT = "https://api-dev.abewriting.org/docs";
const GRAPHQL_ENDPOINT = "https://api-dev.abewriting.org/graphql/graphql";
export const LLM_API_ENDPOINT = "https://api-dev.abewriting.org/docs"

const REQUEST_TIMEOUT_GRAPHQL_DEFAULT = 30000;
const accessToken = process.env.REACT_APP_ACCESS_TOKEN || "";
// https://github.com/axios/axios/issues/4193#issuecomment-1158137489
interface MyAxiosRequestConfig extends Omit<AxiosRequestConfig, 'headers'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: any; // this was "any" at v0.21.1 but now broken between 0.21.4 >= 0.27.2
}

interface GQLQuery {
  query: string; // the query string passed to graphql, which should be a static query
  variables?: Record<string, unknown>; // variables (if any) for the static query
}

interface HttpRequestConfig {
  accessToken?: string; // bearer-token http auth
  axiosConfig?: MyAxiosRequestConfig; // any axios config for the request
//   axiosMiddleware?: AxiosMiddleware; // used (for example) to extract accessToken from response headers
  /**
   * When set, will use this prop (or array of props) to extract return data from a json response, e.g.
   *
   * dataPath: ["foo", "bar"]
   *
   * // will extract "barvalue" for the return
   * { "foo": { "bar": "barvalue" } }
   */
  dataPath?: string | string[];
}

export async function execHttp<T>(
  method: Method,
  query: string,
  opts?: HttpRequestConfig
): Promise<T> {
  const optsEffective: HttpRequestConfig = opts || {};
  const axiosConfig = opts?.axiosConfig || {};
  const axiosInst = axios.create();
  const result = await axiosInst.request({
    url: query,
    method: method,
    ...axiosConfig,
    headers: {
      ...(axiosConfig.headers || {}), // if any headers passed in opts, include them
      ...(optsEffective && optsEffective.accessToken // if accessToken passed in opts, add auth to headers
        ? { Authorization: `bearer ${optsEffective.accessToken}` }
        : {}),
    },
  });
  return getDataFromAxiosResponse(result, optsEffective.dataPath || []);
}

export function throwErrorsInAxiosResponse(res: AxiosResponse): void {
  if (!(res.status >= 200 && res.status <= 299)) {
    throw new Error(`http request failed: ${res.data}`);
  }
  if (res.data.errors) {
    throw new Error(`errors in response: ${JSON.stringify(res.data.errors)}`);
  }
}

function getDataFromAxiosResponse(res: AxiosResponse, path: string | string[]) {
  throwErrorsInAxiosResponse(res);
  let data = res.data.data;
  if (!data) {
    throw new Error(`no data in reponse: ${JSON.stringify(res.data)}`);
  }
  const dataPath = Array.isArray(path)
    ? path
    : typeof path === 'string'
    ? [path]
    : [];
  dataPath.forEach((pathPart) => {
    if (!data) {
      throw new Error(
        `unexpected response data shape for dataPath ${JSON.stringify(
          dataPath
        )} and request ${res.request} : ${res.data}`
      );
    }
    data = data[pathPart];
  });
  return data;
}

export async function execGql<T>(
  query: GQLQuery,
  opts?: HttpRequestConfig
): Promise<T> {
  return execHttp<T>('POST', GRAPHQL_ENDPOINT, {
    ...(opts || {}),
    axiosConfig: {
      timeout: REQUEST_TIMEOUT_GRAPHQL_DEFAULT, // default timeout can be overriden by passed-in config
      ...(opts?.axiosConfig || {}),
      data: query,
    },
  });
}

export type OpenAiJobId = string;

export async function asyncOpenAiRequest(
  docsId: string,
  aiPromptSteps: AiPromptStep[],
  userId: string,
  cancelToken?: CancelToken
): Promise<OpenAiJobId> {
  const res = await execHttp<OpenAiJobId>(
    'POST',
    `${API_ENDPOINT}/async_open_ai_doc_question/?docId=${docsId}&userAction=${UserActions.MULTISTEP_PROMPTS}&userId=${userId}`,
    {
      accessToken,
      dataPath: ['response', 'jobId'],
      axiosConfig: {
        data: {
          aiPromptSteps: aiPromptSteps,
        },
        cancelToken: cancelToken,
      },
    }
  );
  return res;
}

export async function asyncOpenAiJobStatus(
  jobId: string,
  cancelToken?: CancelToken
): Promise<OpenAiServiceJobStatusResponseType> {
  const res = await execHttp<OpenAiServiceJobStatusResponseType>(
    'POST',
    `${API_ENDPOINT}/async_open_ai_doc_question_status/?jobId=${jobId}`,
    {
      accessToken,
      dataPath: ['response'],
      axiosConfig: {
        cancelToken: cancelToken,
      },
    }
  );
  return res;
}

export async function asyncLlmRequest(
  llmRequest: GenericLlmRequest,
  cancelToken?: CancelToken
): Promise<OpenAiJobId> {
  const res = await execHttp<OpenAiJobId>(
    'POST',
    `${LLM_API_ENDPOINT}/generic_llm_request/`,
    {
      dataPath: ['response', 'jobId'],
      axiosConfig: {
        data: {
          llmRequest,
        },
        cancelToken: cancelToken,
      },
    }
  );
  return res;
}

export async function asyncLlmRequestStatus(
  jobId: string,
  cancelToken?: CancelToken
): Promise<AiServicesJobStatusResponseTypes> {
  const res = await execHttp<AiServicesJobStatusResponseTypes>(
    'POST',
    `${LLM_API_ENDPOINT}/generic_llm_request_status/?jobId=${jobId}`,
    {
      dataPath: ['response'],
      axiosConfig: {
        cancelToken: cancelToken,
      },
    }
  );
  return res;
}