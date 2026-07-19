import { apiRequest } from "@/utils/ApiRequest";

export const deleteDocument = async (id: number): Promise<void> => {
  try {
    if (id) {
      await apiRequest<void>("document/" + id, "DELETE");
    }
  } catch (error) {
    // Handle any other errors (if necessary)
    throw error;
  }
};
