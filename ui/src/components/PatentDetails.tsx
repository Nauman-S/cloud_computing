import React from "react";
import { Modal, Button } from "react-bootstrap";

type DocumentItem = {
  fileName: string;
  lodgementDate: string;
  url: string;
  docType: {
    description: string;
    code: string;
  };
};

type PatentDetails = {
  lodgementDate: string;
  applicationNum: string;
  documentList: DocumentItem[];
  applicantName: string | null;
  applicantUen: string | null;
  applicantCountry: string | null;
  grantDate: string | null;
  expiryDate: string | null;
  applicationSummary: string; // JSON string
};

type Props = {
  show: boolean;
  handleClose: () => void;
  data: PatentDetails;
};

export const PatentDetailsModal: React.FC<Props> = ({
  show,
  handleClose,
  data,
}) => {
  const summary = JSON.parse(data.applicationSummary || "{}");
  console.log(data);
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Patent Details - {data.applicationNum}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Application Type:</strong> {summary?.applicationType || "N/A"}
        </p>
        <p>
          <strong>Application Status:</strong>{" "}
          {summary.applicationStatus || "N/A"}
        </p>
        <p>
          <strong>Title of Invention:</strong>{" "}
          {summary.TitleOfInvention || "N/A"}
        </p>
        <p>
          <strong>Filing Date:</strong> {summary?.filingDate || "N/A"}
        </p>
        <p>
          <strong>Lodgement Date:</strong> {data.lodgementDate || "N/A"}
        </p>
        <p>
          <strong>Publication Date:</strong>{" "}
          {summary?.dateOfPublication || "N/A"}
        </p>
        <p>
          <strong>IPC:</strong> {summary?.ipc || "N/A"}
        </p>
        <hr />
        <p>
          <strong>Applicant Name:</strong> {data.applicantName || "N/A"}
        </p>
        <p>
          <strong>Applicant UEN:</strong> {data.applicantUen || "N/A"}
        </p>
        <p>
          <strong>Applicant Country:</strong> {data.applicantCountry || "N/A"}
        </p>
        <p>
          <strong>Grant Date:</strong> {data.grantDate || "N/A"}
        </p>
        <p>
          <strong>Expiry Date:</strong> {data.expiryDate || "N/A"}
        </p>
        <hr />
        {Array.isArray(data.documentList) && data.documentList.length > 0 && (
          <>
            <h5>Documents</h5>
            <ul>
              {data.documentList.map((doc, idx) => (
                <li key={idx}>
                  <strong>{doc.docType.description}</strong> –{" "}
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.fileName}
                  </a>{" "}
                  (Lodged on: {doc.lodgementDate})
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
