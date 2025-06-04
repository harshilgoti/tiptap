import { IMAGE_UPLOAD_OPTIONS } from "../constants/editorConfig";

export const uploadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!IMAGE_UPLOAD_OPTIONS.ACCEPTED_FILE_TYPES.includes(file.type)) {
      reject(
        new Error(
          `Invalid file type. Accepted types: ${IMAGE_UPLOAD_OPTIONS.ACCEPTED_FILE_TYPES.join(
            ", "
          )}`
        )
      );
      return;
    }

    if (file.size > IMAGE_UPLOAD_OPTIONS.MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(
        new Error(
          `File is too large. Max size: ${IMAGE_UPLOAD_OPTIONS.MAX_FILE_SIZE_MB}MB`
        )
      );
      return;
    }

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(new Error("Error reading file for preview."));
      };
      reader.readAsDataURL(file);
    }, 1000);
  });
};
