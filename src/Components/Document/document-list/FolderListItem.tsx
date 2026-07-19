import { FileFolderItemProp } from "@/Types/FileManagerType";
import React from "react";

const FolderListItem: React.FC<FileFolderItemProp> = ({ item }) => {
  return (
    <li className="folder-box">
      <div className="d-block">
        <i className={`fa-solid fa-${item.folderClass} text-secondary fs-1`} />
        <i className="fa-solid fa-ellipsis-vertical ellips me-0" />
        <div className="mt-3">
          <h6 className="mb-2">{item.title}</h6>
          <p>
            {item.folderFiles}
            <span className="pull-right">
              <i className="fa-solid fa-clock" />
              {item.folderTime}
            </span>
          </p>
        </div>
      </div>
    </li>
  );
};

export default FolderListItem
