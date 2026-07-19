import { ApiResponse, Document } from "@/Types/ApiResponseType";
import { apiRequest } from "@/utils/ApiRequest";

export const getDocumentById = async (
  id: number
): Promise<ApiResponse<Document>> => {
  const response = await apiRequest<Document>("document/" + id, "GET");
  return response;
};
