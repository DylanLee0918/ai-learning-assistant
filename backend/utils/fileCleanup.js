import fs from "fs/promises";
import path from "path";

export const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

export const deleteUploadedFile = (filename) => {
    const filePath = path.join(__dirname, "../uploads/documents", filename);
    deleteFile(filePath);
};
