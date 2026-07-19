import { Card } from "reactstrap";
import { HoverButtons } from "./HoverButtons";
import { Document } from "@/Types/ApiResponseType";

export interface FileDataType {
  id: number;
  name: string;
  icon: string;
  title: string;
}

export interface DocumentItemProp {
  item: Document;
  setDataId: (id: number) => void;
  setOpenPreviewModal: (key: boolean) => void;
  setOpenEditModal: (key: boolean) => void;
}

const FileListItem: React.FC<DocumentItemProp> = ({
  item,
  setDataId,
  setOpenPreviewModal,
  setOpenEditModal,
}) => {
  return (
    <li
      className="folder-box d-flex align-items-center"
      title={item.originalName}
    >
      <Card className="rounded-4">
        <div className="product-box">
          <div className="product-img bg-img-cover">
            <img
              className="img-fluid"
              src={`${GetCloudinaryPdfFileFirstPageAsImange(item.url)}`}
              alt=""
              width={300}
              height={300}
            />
            <HoverButtons
              setDataId={setDataId}
              setOpenPreviewModal={setOpenPreviewModal}
              setOpenEditModal={setOpenEditModal}
              item={item}
            />
          </div>
        </div>
      </Card>
    </li>
  );
};

export const GetCloudinaryPdfFileFirstPageAsImange = (originalUrl: string) => {
  const transformation = "f_jpg/pg_1";
  const uploadIndex = originalUrl.indexOf("/upload/");

  if (uploadIndex === -1) {
    return "";
    throw new Error("Invalid Cloudinary URL: Missing '/upload/' segment.");
  }

  // Insert the transformation after '/upload/'
  const beforeUpload = originalUrl.slice(0, uploadIndex + 8); // Includes '/upload/'
  const afterUpload = originalUrl.slice(uploadIndex + 8);

  return `${beforeUpload}${transformation}/${afterUpload}`;
};

export default FileListItem;
