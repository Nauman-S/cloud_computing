import React, { useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { PatentDetailsModal } from "../PatentDetails";

const ResultsCards = ({ data }) => {
  const [selectedPatentId, setSelectedPatentId] = useState(null);
  const handleOpen = (id) => setSelectedPatentId(id);
  const handleClose = () => setSelectedPatentId(null);

  const selectedPatent = data.find(
    (p) => p.applicationNum === selectedPatentId
  );
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Search Results</h2>
      <Accordion defaultActiveKey="-1">
        {data.map((item, index) => {
          // Parse the applicationSummary JSON string
          let summary = {};
          try {
            summary = item.applicationSummary
              ? JSON.parse(item.applicationSummary)
              : {};
          } catch (e) {
            console.error("Error parsing applicationSummary:", e);
          }

          return (
            <Card key={item._id} className="mb-3 shadow-sm">
              <Accordion.Item eventKey={index.toString()}>
                <Accordion.Header>
                  <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <span className="fs-5 fw-bold">
                      {summary.TitleOfInvention || "No Title"}
                    </span>
                    <span>
                      <small className="text-muted me-3">
                        App No:{" "}
                        {item.applicationNum || summary.applicationNum || "—"}
                      </small>
                      <small className="text-muted">
                        Lodgement: {item.lodgementDate || "—"}
                      </small>
                    </span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="mb-2">
                    <strong>Application Type:</strong>{" "}
                    {summary.applicationType || "—"}
                  </div>
                  <div className="mb-3">
                    <strong>Title Of Invention:</strong>{" "}
                    {summary.TitleOfInvention || "—"}
                  </div>
                  {item.documentList && item.documentList.length > 0 && (
                    <div className="mb-3">
                      <strong>Documents:</strong>
                      <ul className="list-unstyled ms-3">
                        {item.documentList.map((doc, idx) => (
                          <li key={idx}>
                            <small>
                              {doc.fileName} (Lodgement: {doc.lodgementDate})
                            </small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleOpen(item.applicationNum)}
                  >
                    View More Details
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          );
        })}
      </Accordion>
      {selectedPatent && (
        <PatentDetailsModal
          show={!!selectedPatentId}
          handleClose={handleClose}
          data={selectedPatent}
        />
      )}
    </div>
  );
};

export default ResultsCards;
