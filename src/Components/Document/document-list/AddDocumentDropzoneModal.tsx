import { useCallback, useEffect, useState } from "react";
import { Dropzone, ExtFile, FileMosaic } from "@dropzone-ui/react";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import Link from "next/link";
import { DragYourImageHere, Href, TourImage } from "@/Constant/constant";
import { Form, Modal } from "reactstrap";
import { setFormValue } from "@/Redux/Reducers/AddProductSlice";
import SVG from "@/Components/SVG/Svg";
import AlreadyUploadedDropzone from "@/Components/Dropzone/AlreadyUploadedDropzone";
import { CloudinaryImage, ErrorValidation } from "@/Types/ApiResponseType";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@/Components/Button/Loading";
import DisplayError from "@/utils/DisplayError";
import ShowError from "@/Components/Toast/Error/ShowError";
import ShowSuccess from "@/Components/Toast/Success/ShowSuccess";
import { uploadDocumentFile } from "@/app/actions/document/uploadDocumentFile";

interface AddDocumentDropzoneModalProps {
  value: boolean;
  setOpenModal: (value: boolean) => void;
  onFileUpload: () => void;
}

const AddDocumentDropzoneModal: React.FC<AddDocumentDropzoneModalProps> = ({
  value,
  setOpenModal,
  onFileUpload,
}) => {
  const [errorsValidation, setErrorsValidation] = useState<ErrorValidation[]>(
    []
  );
  const [open, setOpen] = useState(value);
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { t } = useTranslation("common");
  const { t: tForm } = useTranslation("form");

  const updateFiles = (files: ExtFile[]) => {
    setFiles(files);
  };

  const removeFile = (id: string | number | undefined) => {
    setFiles(files.filter((x: ExtFile) => x.id !== id));
  };

  const onCloseModal = () => {
    setOpen(false);
    setOpenModal(false);
  };

  const handleUploadFiles = async () => {
    setIsLoading(true); // Set loading to true when form submission starts
    setErrorsValidation([]);
    try {
      const response = await uploadDocumentFile(files[0].file!);

      if ("errorType" in response) {
        ShowError(tForm, response.errorMessage);
        setErrorsValidation(response.errorsValidation!);
      } else {
        ShowSuccess(response.message);
        onFileUpload();
        onCloseModal();
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false); // Set loading to false when form submission ends
    }
    return;
  };

  return (
    <Modal
      centered
      size="lg"
      className="product-box"
      isOpen={open}
      toggle={onCloseModal}
    >
      <div className="product-upload">
        <DisplayError
          errorsValidation={errorsValidation}
          keyProp="documentFile"
        />
        <Dropzone
          onChange={(files: ExtFile[]) => updateFiles(files)}
          value={files}
          maxFiles={1}
          multiple={true}
          header={false}
          footer={false}
          minHeight="80px"
          name="documentFile"
          accept="application/pdf"
        >
          {files.map((file: ExtFile) => (
            <FileMosaic
              key={file.id}
              {...file}
              imageUrl={URL.createObjectURL(file.file!)}
              onDelete={removeFile}
              info={true}
            />
          ))}
          {files.length === 0 && (
            <Form className="dropzone dropzone-light dz-clickable py-5">
              <div className="dz-message needsclick">
                <SVG iconId="file-upload" />
                <h6>
                  {t("DragYourFileHere")}
                  <Link className="txt-primary" href={Href}>
                    &nbsp;{t("browser")}
                  </Link>
                </h6>
                <span className="note needsclick">
                  {t("Only")} PDF
                </span>
              </div>
            </Form>
          )}
        </Dropzone>
        <div style={{ display: "flex", gap: "3%", justifyContent: "center" }}>
          {files.length > 0 && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUploadFiles}
            >
              {isLoading ? <LoadingButton /> : t("Upload")}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddDocumentDropzoneModal;
