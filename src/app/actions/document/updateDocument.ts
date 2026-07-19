import {
  ApiResponse,
  Document,
} from "@/Types/ApiResponseType";
import { apiRequest } from "@/utils/ApiRequest";
import { FieldValues } from "react-hook-form";

export const updateDocument = async (
  id: number,
  fieldValues: FieldValues
): Promise<ApiResponse<Document>> => {
  const response = await apiRequest<Document>(
    "document/" + id,
    "POST",
    fieldValues
  );

  return response;
};
