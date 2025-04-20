import React, { useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";

export const PlanComparisonModal: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        View Plan Comparison
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Free Trial vs Professional Version</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered hover responsive>
            <thead className="table-success">
              <tr>
                <th></th>
                <th>Free Trial</th>
                <th>Professional Version</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Pricing</th>
                <td>14-day free trial</td>
                <td>$40 SGD/month</td>
              </tr>
              <tr>
                <th>Search Limits</th>
                <td>5/day</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <th>Real-time alerts</th>
                <td>Weekly alert (up to 5 alerts)</td>
                <td>
                  Daily or weekly, as per the user’s preference (Unlimited)
                </td>
              </tr>
              <tr>
                <th>Competitor tracking</th>
                <td style={{ color: "red" }}>❌ No</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <th>
                  Dashboard updates <br />
                  <small>
                    (how often the analytics dashboard is refreshed)
                  </small>
                </th>
                <td>Daily</td>
                <td>Daily</td>
              </tr>
              <tr>
                <th>Viewing search history</th>
                <td style={{ color: "red" }}>❌ No</td>
                <td style={{ color: "green" }}>✅ Yes</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
