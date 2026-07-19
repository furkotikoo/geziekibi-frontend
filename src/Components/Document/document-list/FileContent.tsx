import { Card, CardHeader } from "reactstrap";
import SearchNotFoundClass from "@/Components/SearchNotFound/SearchNotFoundClass";
import { FileListData } from "@/Data/FileManager/FileManagerData";
import { ChangeEvent, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import AddUploadMedia from "./AddUploadMedia";
import FileManagerBody from "./FileManagerBody";
import FileListItem from "./FileListItem";
import DocumentPreviewModal from "./DocumentPreviewModal";
import DocumentEditModal from "./DocumentEditModal";
import { getDocumentList } from "@/app/actions/document/getDocumentList";
import ShowError from "@/Components/Toast/Error/ShowError";
import { Document } from "@/Types/ApiResponseType";
import { useTranslation } from "react-i18next";

const FileContent = () => {
  const [searchFile, setSearchFile] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [myFile, setMyFile] = useState(FileListData);
  const [openPreviewModal, setOpenPreviewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [dataId, setDataId] = useState<number>(0);

  const [existingFiles, setExistingFiles] = useState<Document[]>([]);

  const { t: tForm } = useTranslation("form");

  const onFileUpload = () => {
    fetchExistingFiles();
  };

  const fileList = existingFiles
    .filter(
      (data) =>
        searchFile === "" ||
        data.originalName.toLowerCase().includes(searchFile.toLowerCase())
    )
    .map((item, i) => (
      <FileListItem
        setDataId={setDataId}
        setOpenPreviewModal={setOpenPreviewModal}
        setOpenEditModal={setOpenEditModal}
        key={i}
        item={item}
      />
    ));

  const fetchExistingFiles = async () => {
    const response = await getDocumentList();
    if ("errorMessage" in response) {
      ShowError(tForm, response.errorMessage);
    } else {
      setExistingFiles(response.data);
    }
  };

  useEffect(() => {
    fetchExistingFiles();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="d-flex flex-column flex-md-row gap-3">
          <SearchBar searchFile={searchFile} setSearchFile={setSearchFile} />
          <AddUploadMedia onFileUpload={onFileUpload} />
        </div>
      </CardHeader>
      {fileList.length ? (
        <FileManagerBody
          myFile={myFile}
          fileList={fileList}
          searchFile={searchFile}
        />
      ) : (
        <SearchNotFoundClass word="File" />
      )}
      {openPreviewModal && (
        <DocumentPreviewModal
          value={openPreviewModal}
          setOpenModal={setOpenPreviewModal}
          dataId={dataId}
        />
      )}

      {openEditModal && (
        <DocumentEditModal
          value={openEditModal}
          setOpenModal={setOpenEditModal}
          dataId={dataId}
        />
      )}
    </Card>
  );
};

export default FileContent;
