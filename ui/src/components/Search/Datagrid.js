import React from 'react';
import { Table } from 'react-bootstrap';

const DataTable = ({ data }) => {
  return (
    <div className="container mt-4">
      <h2>Search Results</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Application No.</th>
            <th>Application Type</th>
            <th>Title Of Invention</th>
            <th>Lodgement Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.applicationNum}>
              <td>{item.applicationNum}</td>
              <td>{item.applicationType}</td>
              <td>{item.titleOfInvention}</td>
              <td>{item.lodgementDate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
