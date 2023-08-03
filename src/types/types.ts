// Define the request body type for the POST request
export interface CreateLinkRequest {
  link: string;
}

// Define the response type for the API route
export interface ApiResponse<T> {
  data: T;
}

export interface ErrorResponse {
  message: string;
}
