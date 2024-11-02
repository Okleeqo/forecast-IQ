export interface ApiResponse {
  statusCode: number;
  headers: {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
    'Content-Type': string;
  };
  body: string;
}

export function createResponse(statusCode: number, data: any): ApiResponse {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
}

export function createErrorResponse(statusCode: number, message: string, error?: any): ApiResponse {
  return createResponse(statusCode, {
    error: message,
    details: error instanceof Error ? error.message : error
  });
}