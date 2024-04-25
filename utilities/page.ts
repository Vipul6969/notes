import axios, { AxiosResponse, AxiosError } from 'axios';

interface RequestOptions {
  [key: string]: string;
}

async function getAsync<T>(url: string, headers: RequestOptions = {}): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await axios.get<T>(url, { headers: headers });
    return response.data;
  } catch (error) {
    return handleAxiosError<T>(error);
  }
}

async function postAsync<T>(url: string, body: any = {}, headers: RequestOptions = {}): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await axios.post<T>(url, body, { headers: headers });
    return response.data;
  } catch (error) {
    return handleAxiosError<T>(error);
  }
}

async function putAsync<T>(url: string, body: any = {}, headers: RequestOptions = {}): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await axios.put<T>(url, body, { headers: headers });
    return response.data;
  } catch (error) {
    return handleAxiosError<T>(error);
  }
}

async function deleteAsync<T>(url: string, headers: RequestOptions = {}): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await axios.delete<T>(url, { headers: headers });
    return response.data;
  } catch (error) {
    return handleAxiosError<T>(error);
  }
}

function handleAxiosError<T>(error: unknown): T | undefined {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error('Error response:', axiosError.response.data);
      console.error('Status:', axiosError.response.status);
      console.error('Headers:', axiosError.response.headers);
    } else if (axiosError.request) {
      console.error('Error request:', axiosError.request);
    } else {
      console.error('Error:', axiosError.message);
    }
  } else {
    console.error('Unknown error:', error);
  }
  return undefined;
}

export { getAsync, postAsync, putAsync, deleteAsync };
