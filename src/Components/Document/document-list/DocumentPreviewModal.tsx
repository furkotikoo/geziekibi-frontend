import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { Document } from "@/Types/ApiResponseType";
import { getDocumentById } from "@/app/actions/document/getDocumentById";
import ShowError from "@/Components/Toast/Error/ShowError";
import { useTranslation } from "react-i18next";

export interface DocumentModalInterfaceType {
  value: boolean;
  setOpenModal: (value: boolean) => void;
  dataId: number;
}

const DocumentPreviewModal: React.FC<DocumentModalInterfaceType> = ({
  value,
  setOpenModal,
  dataId,
}) => {
  const [open, setOpen] = useState(value);
  const [_document, setDocument] = useState<Document>();

  const { t: tForm } = useTranslation("form");

  const onCloseModal = () => {
    setOpen(false);
    setOpenModal(false);
  };

  const fetchDocumentById = async () => {
    const response = await getDocumentById(dataId);
    if ("errorType" in response) {
      ShowError(tForm, response.errorMessage);
      onCloseModal();
    } else {
      setDocument(response.data);
    }
  };

  useEffect(() => {
    fetchDocumentById();
  }, [dataId]);

  useEffect(() => {
    // Function to dynamically load a script
    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });

    // Array of scripts to load
    const scripts = [
      "assets/js/jquery.min.js",
      "assets/js/html2canvas.min.js",
      "assets/js/three.min.js",
      "assets/js/pdf.min.js",
      "assets/js/3dflipbook.min.js",
    ];

    // Load all scripts sequentially
    const loadAllScripts = async () => {
      try {
        for (const script of scripts) {
          await loadScript(script);
        }
        console.log("All scripts loaded successfully.");
      } catch (error) {
        console.error(error);
      }
    };

    loadAllScripts();

    // Cleanup: Optionally remove scripts when the component unmounts
    return () => {
      scripts.forEach((src) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          existingScript.remove();
        }
      });
    };
  }, []);

  useEffect(() => {
    const removeDemoMessage = () => {
      const iframe = document.querySelector("iframe"); // Find the iframe element
      if (iframe && iframe.contentWindow) {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          const demoMsg = iframeDoc.querySelector(".demo-msg"); // Find the element in the iframe
          if (demoMsg) {
            demoMsg.remove(); // Remove the element
            console.log("Demo message removed");
          }
        }
      }
    };

    // Attempt to remove the message after a delay to ensure iframe content loads
    const timer = setTimeout(removeDemoMessage, 2000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal
      centered
      size="lg"
      className="product-box"
      isOpen={open}
      toggle={onCloseModal}
    >
      <ModalHeader className="position-relative">
        <Button close onClick={onCloseModal}></Button>
      </ModalHeader>
      <ModalBody>
        <Row className="product-box align-items-center">
          <Col lg="12" className="product-img">
            <div
              className="flip-book-container"
              style={{ height: "500px" }}
              // @ts-ignore
              src={_document?.secureUrl}
            ></div>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default DocumentPreviewModal;
