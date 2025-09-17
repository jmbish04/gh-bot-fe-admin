interface APIResponse {
  name?: string;
  example: any;
  description?: string;
}

interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  requestBody?: {
    example: any;
    description?: string;
  };
  responses: APIResponse[];
}

const apiEndpoints: APIEndpoint[] = [
  // GitHub Bot API endpoints will be added here
  {
    method: "GET",
    path: "/api/health",
    description: "Check the health status of the GitHub Bot API",
    responses: [
      {
        name: "Response",
        example: {
          status: "healthy",
          timestamp: "2024-01-01T00:00:00.000Z",
          version: "1.0.0"
        },
        description: "Returns the health status of the API",
      },
    ],
  },
];

export { apiEndpoints };
