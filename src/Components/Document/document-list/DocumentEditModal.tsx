/* eslint-disable @next/next/no-img-element */
import { getDocumentById } from "@/app/actions/document/getDocumentById";
import ShowError from "@/Components/Toast/Error/ShowError";
import { Document } from "@/Types/ApiResponseType";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  Row,
} from "reactstrap";
import { GetCloudinaryPdfFileFirstPageAsImange } from "./FileListItem";
import {
  Controller,
  FieldValues,
  Form,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { LoadingButton } from "@/Components/Button/Loading";
import { useTranslation } from "react-i18next";
import {
  EditDocumentFormSchema,
  EditDocumentSchema,
} from "@/app/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDocument } from "@/app/actions/document/updateDocument";
import ShowSuccess from "@/Components/Toast/Success/ShowSuccess";
import DisplayError from "@/utils/DisplayError";
import PublishDate from "@/Components/Common/PublishDate";
import { PublishStatusEnum } from "@/app/lib/enums";
import SelectPublishStatus from "@/Components/Common/SelectPublishStatus";
import { deleteDocument } from "@/app/actions/document/deleteDocument";

export interface DocumentModalInterfaceType {
  value: boolean;
  setOpenModal: (value: boolean) => void;
  dataId: number;
}

const DocumentEditModal: React.FC<DocumentModalInterfaceType> = ({
  value,
  setOpenModal,
  dataId,
}) => {
  const [open, setOpen] = useState(value);
  const [document, setDocument] = useState<Document>();

  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { t } = useTranslation("common");
  const { t: tForm } = useTranslation("form");

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<EditDocumentSchema>({
    resolver: zodResolver(EditDocumentFormSchema),
    defaultValues: {
      originalName: "",
      publishDate: new Date(),
      publishStatus: PublishStatusEnum.PUBLISH,
    },
  });

  const onSubmitForm = async (data: EditDocumentSchema) => {
    setIsLoading(true); // Set loading to true when form submission starts
    try {
      const response = await updateDocument(dataId, data);

      if ("errorType" in response) {
        ShowError(tForm, response.errorMessage!);
      } else {
        ShowSuccess(response.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false); // Set loading to false when form submission ends
    }
    return;
  };

  const fetchDocumentById = async () => {
    const response = await getDocumentById(dataId);
    if ("errorType" in response) {
      ShowError(tForm, response.errorMessage);
      onCloseModal();
    } else {
      setDocument({ ...response.data });
    }
  };

  useEffect(() => {
    fetchDocumentById();
  }, [dataId]);

  useEffect(() => {
    if (document) {
      reset({
        originalName: document.originalName,
        publishDate: document.publishDate,
        publishStatus: document.publishStatus,
      });
    }
  }, [document]);

  const onCloseModal = () => {
    setOpen(false);
    setOpenModal(false);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete:\r ${document?.originalName} ?`
      )
    ) {
      try {
        setIsLoading(true);

        await deleteDocument(document!.id);
      } catch (error) {
        ShowError(tForm, "Failed to delete document. Please try again.");
      } finally {
        setIsLoading(false);
        window.location.reload();
      }
    }
  };

  return (
    <Modal
      centered
      size="lg"
      className="product-box"
      isOpen={open}
      toggle={onCloseModal}
    >
      <ModalHeader className="position-relative">
        <div className="w-100 d-flex justify-content-end">
          <Button close onClick={onCloseModal}></Button>
        </div>
      </ModalHeader>
      <Row className="product-box align-items-center">
        <Col xs="12" lg="6" className="mb-3 mb-lg-0 product-img text-center">
          <img
            className="img-fluid"
            src={GetCloudinaryPdfFileFirstPageAsImange(document?.url || "")}
            alt="image"
          />
        </Col>
        <Col xs="12" lg="6" className="product-details text-start p-2">
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <FormGroup>
              <Col xs="12">
                <Label className="m-0" check>
                  {t("Original Name")}
                </Label>
              </Col>
              <Col xs="12">
                <Controller
                  name="originalName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      required
                      type="text"
                      invalid={!!errors["originalName"]}
                    />
                  )}
                />
                <DisplayError errorMessage={errors["originalName"]?.message} />
              </Col>
            </FormGroup>
            <FormGroup>
              <Controller
                key={document?.id}
                name="publishDate"
                control={control}
                render={({ field }) => {
                  return (
                    <PublishDate
                      onChange={(date) => {
                        console.log({
                          date,
                          formValue: getValues("publishDate"),
                        });
                        field.onChange(date);
                      }}
                      publishDate={document?.publishDate || new Date()}
                    />
                  );
                }}
              />
              <DisplayError
                errorMessage={errors["publishDate"]?.message}
                keyProp="publishDate"
              />{" "}
            </FormGroup>
            <FormGroup>
              <Controller
                key={document?.id}
                name="publishStatus"
                control={control}
                render={({ field }) => {
                  return (
                    <SelectPublishStatus
                      onChange={(id) => {
                        console.log({
                          id,
                          formValue: getValues("publishStatus"),
                        });
                        setValue("publishStatus", id as PublishStatusEnum);
                        field.onChange(id);
                      }}
                      publishStatus={
                        document?.publishStatus || PublishStatusEnum.DRAFT
                      }
                    />
                  );
                }}
              />
              <DisplayError
                errorMessage={errors["publishStatus"]?.message}
                keyProp="publishStatus"
              />{" "}
            </FormGroup>
            <Row>
              <Col xs="6">
                <Button type="submit" color="primary" className="w-100">
                  {isLoading ? <LoadingButton /> : t("Save")}
                </Button>
              </Col>
              <Col xs="6">
                <Button
                  type="button"
                  color="danger"
                  onClick={handleDelete}
                  className="w-100"
                >
                  {isLoading ? <LoadingButton /> : t("Delete")}
                </Button>
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </Modal>
  );
};
export default DocumentEditModal;
