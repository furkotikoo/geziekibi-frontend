import { DOCUMENT_SCHEMA } from "@/app/lib/definitions";
import {
  ApiErrorResponse,
  ApiResponse,
  Document,
  ErrorValidation,
} from "@/Types/ApiResponseType";
import { apiRequest } from "@/utils/ApiRequest";
import { ZodError } from "zod";

export const uploadDocumentFile = async (
  file: File
): Promise<ApiResponse<Document>> => {
  try {
    const data = DOCUMENT_SCHEMA.parse(file);

    const formData = new FormData();
    formData.append("documentFile", data);

    return await apiRequest<Document>("document/upload", "POST", formData);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.errors[0]?.message ?? "Invalid document file";
      return {
        errorMessage: message,
        errorType: "BAD REQUEST",
        errorsValidation: [{ documentFile: message } as ErrorValidation],
      } as ApiErrorResponse;
    }
    throw error;
  }
};
