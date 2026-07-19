import { ApiResponse, Document } from "@/Types/ApiResponseType";
import { apiRequest } from "@/utils/ApiRequest";

export const getDocumentList = async (): Promise<ApiResponse<Document[]>> => {
  const response = await apiRequest<Document[]>("document/", "GET");
  return response;
};
