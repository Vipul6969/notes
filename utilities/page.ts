// Import necessary types from axios
import axios, { AxiosResponse, AxiosError } from 'axios';

// Define an interface for request options, specifically for headers
interface RequestOptions {
  headers?: { [key: string]: string };
}

// Asynchronous GET request function
async function getAsync<T>(url: string, options: RequestOptions = {}): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await axios.get<T>(url, { headers: options.headers });
    return response.data;
  } catch (error) {
    return handleAxiosError<T>(error);
  }
}

// Asynchronous POST request function
async function postAsync<T>(url: string, body: any = {}, headers: Record<string, string> = {}): Promise<T | undefined> {
  
  try {
    console.log("in try")
    const response = await axios.post<T>(url, body, { headers });
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error)
    console.error("Error occurred during POST request:", error);
    return undefined;
  }
}


// Asynchronous PUT request function
async function putAsync<T>(
  url: string,
  body: any = {},
  options: RequestOptions = {}
): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await axios.put<T>(url, body, {
      headers: options.headers,
    });
    return response.data;
  } catch (error) {
    return handleAxiosError<T>(error);
  }
}

// Asynchronous DELETE request function
async function deleteAsync<T>(url: string, options: RequestOptions = {}): Promise<T | undefined> {
  try {
    const response: AxiosResponse<T> = await axios.delete<T>(url, { headers: options.headers });
    return response.data;
  } catch (error) {
    return handleAxiosError<T>(error);
  }
}

// Function to handle and log errors from Axios requests
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

// Export functions for use in other parts of the application
export { getAsync, postAsync, putAsync, deleteAsync };
