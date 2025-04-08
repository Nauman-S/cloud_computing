import React, { useEffect, useState } from "react";
import axios from "axios";
import URLs from "../../constants/urls";
import ResultsCards from "./ResultsCards";

export default function SearchComponent() {
  const fields = [
    { name: "applicationNum", label: "Application Number", type: "text" },
    {
      name: "applicationStatus",
      label: "Application Status",
      type: "select",
      options: [
        { value: "", label: "Select status" },
        { value: "Pending (Not Published)", label: "Pending (Not Published)" },
        { value: "Pending (Published)", label: "Pending (Published)" },
        { value: "Patent In Force", label: "Patent In Force" },
        { value: "Abandoned ", label: "Abandoned" },
        {
          value: "Abandoned (Extension of Time Possible)",
          label: "Abandoned (Extension of Time Possible)",
        },
        { value: "Refused ", label: "Refused" },
        {
          value: "Refused (Extension of Time Possible)",
          label: "Refused (Extension of Time Possible)",
        },
        { value: "Withdrawn", label: "Withdrawn" },
      ],
    },
    { name: "titleOfInvention", label: "Title Of Invention", type: "text" },
    { name: "filingDateStart", label: "Filing Date Start", type: "date" },
    { name: "filingDateEnd", label: "Filing Date End", type: "date" },
    { name: "lodgementDateStart", label: "Lodgement Date Start", type: "date" },
    { name: "lodgementDateEnd", label: "Lodgement Date End", type: "date" },
  ];

  const initialFormData = fields.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  );

  const [formData, setFormData] = useState(initialFormData);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);

  // Reset page to 1 whenever results change or perPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults, resultsPerPage]);

  // Calculate pagination boundaries
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(
    indexOfFirstResult,
    indexOfLastResult
  );
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setSearchResults([]);
    setError("");
  };

  const handleSearch = async () => {
    // const hasAnyValue = Object.values(formData).some(
    //   (value) => value.trim() !== ""
    // );

    // if (!hasAnyValue) {
    //   setError("At least 1 field must be filled out");
    //   return;
    // }

    setError("");
    setLoading(true);

    try {
      const queryParams = {};
      if (formData.applicationNum)
        queryParams.applicationNum = formData.applicationNum;
      // if (formData.applicationType)
      //   queryParams.applicationType = formData.applicationType;
      if (formData.applicationStatus)
        queryParams.applicationStatus = formData.applicationStatus;
      if (formData.titleOfInvention)
        queryParams.titleOfInvention = formData.titleOfInvention;
      if (formData.filingDateStart)
        queryParams.filingDateStart = formData.filingDateStart;
      if (formData.filingDateEnd)
        queryParams.filingDateEnd = formData.filingDateEnd;
      if (formData.lodgementDateStart)
        queryParams.lodgementDateStart = formData.lodgementDateStart;
      if (formData.lodgementDateEnd)
        queryParams.lodgementDateEnd = formData.lodgementDateEnd;

      const response = await axios.get(URLs.SEARCH, {
        params: queryParams,
        headers: {
          "X-TESTER-REQUEST": "tester_secret_api_key",
        },
        withCredentials: true,
      });
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      // If the error is 404, clear any previous search results and do not set an error
      if (error.response && error.response.status === 404) {
        setSearchResults([]);
      } else {
        setError("Failed to fetch search results");
        setSearchResults([]); // Also clear any previous results for other errors
      }
    } finally {
      setLoading(false); // Stop loading no matter what.
    }
  };

  return (
    <>
      <div className="container mt-4 p-4 border rounded shadow-sm w-75">
        {fields.map(({ name, label, type, options }) => (
          <div key={name} className="mb-3 row">
            <label className="col-sm-3 col-form-label">{label}</label>
            <div className="col-sm-9">
              {type === "select" ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                >
                  {options.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  placeholder={`Enter ${label}`}
                  value={formData[name]}
                  onChange={handleChange}
                  className="form-control form-control-lg"
                />
              )}
            </div>
          </div>
        ))}

        {error && <div className="text-danger mb-2">{error}</div>}
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center my-3">
          <span
            className="spinner-border"
            role="status"
            aria-hidden="true"
          ></span>
          <span className="ms-2">Searching results...</span>
        </div>
      )}

      {searchResults.length > 0 ? (
        <>
          <p style={{ fontSize: "1.5rem" }} className=" text-center mt-2">
            {searchResults.length} results found
          </p>
          {/* <ResultsCards data={searchResults} /> */}
          <ResultsCards data={currentResults} />
        </>
      ) : (
        // <p className="text-muted text-center mt-4">No results to display.</p>
        <p style={{ fontSize: "1.5rem" }} className=" text-center mt-2">
          {searchResults.length} results found
        </p>
      )}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 my-4">
          {/* Pagination Buttons */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline-secondary ms-2"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {/* Results per page selector */}
          <div className="d-flex align-items-center">
            <label className="me-2 mb-0">Results per page:</label>
            <select
              value={resultsPerPage}
              onChange={(e) => setResultsPerPage(Number(e.target.value))}
              className="form-select w-auto"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}

      {/* {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center my-3">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="d-flex justify-content-end align-items-center mb-2 me-4">
          <label className="me-2">Results per page:</label>
          <select
            value={resultsPerPage}
            onChange={(e) => setResultsPerPage(Number(e.target.value))}
            className="form-select w-auto"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )} */}
    </>
  );
}

// import { useState } from "react";
// import axios from "axios";
// import URLs from "../../constants/urls";
// import Datagrid from "./Datagrid";

// function SearchForm({ fields, formData, handleChange }) {
//   return (
//     <>
//       {fields.map(({ name, label, type }) => (
//         <div key={name} className="mb-3 row">
//           <label className="col-sm-3 col-form-label">{label}</label>
//           <div className="col-sm-9">
//             <input
//               type={type}
//               name={name}
//               placeholder={`Enter ${label}`}
//               value={formData[name]}
//               onChange={handleChange}
//               className="form-control form-control-lg"
//             />
//           </div>
//         </div>
//       ))}
//     </>
//   );
// }

// export default function SearchComponent() {
//   // Updated fields to include date ranges for filing and lodgement dates
//   const fields = [
//     { name: "applicationNum", label: "Application Number", type: "text" },
//     { name: "applicationType", label: "Application Type", type: "text" },
//     { name: "titleOfInvention", label: "Title Of Invention", type: "text" },
//     { name: "filingDateStart", label: "Filing Date Start", type: "date" },
//     { name: "filingDateEnd", label: "Filing Date End", type: "date" },
//     { name: "lodgementDateStart", label: "Lodgement Date Start", type: "date" },
//     { name: "lodgementDateEnd", label: "Lodgement Date End", type: "date" },
//   ];

//   const initialFormData = fields.reduce(
//     (acc, field) => ({ ...acc, [field.name]: "" }),
//     {}
//   );

//   const [formData, setFormData] = useState(initialFormData);
//   const [searchResults, setSearchResults] = useState([]);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleClear = () => {
//     setFormData(initialFormData);
//     setSearchResults([]);
//     setError("");
//   };

//   const handleSearch = async () => {
//     const hasAnyValue = Object.values(formData).some(
//       (value) => value.trim() !== ""
//     );

//     if (!hasAnyValue) {
//       setError("At least 1 field must be filled out");
//       return;
//     }

//     setError("");

//     try {
//       const queryParams = {};
//       if (formData.applicationNum)
//         queryParams.applicationNum = formData.applicationNum;
//       if (formData.applicationType)
//         queryParams.applicationType = formData.applicationType;
//       if (formData.titleOfInvention)
//         queryParams.titleOfInvention = formData.titleOfInvention;
//       if (formData.filingDateStart)
//         queryParams.filingDateStart = formData.filingDateStart;
//       if (formData.filingDateEnd)
//         queryParams.filingDateEnd = formData.filingDateEnd;
//       if (formData.lodgementDateStart)
//         queryParams.lodgementDateStart = formData.lodgementDateStart;
//       if (formData.lodgementDateEnd)
//         queryParams.lodgementDateEnd = formData.lodgementDateEnd;

//       const response = await axios.get(URLs.SEARCH, {
//         params: queryParams,
//         headers: {
//           "X-TESTER-REQUEST": "tester_secret_api_key",
//         },
//         withCredentials: true, // sends cookies like JSESSIONID
//       });

//       console.log("Search Results:", response.data);
//       setSearchResults(response.data || []);
//     } catch (error) {
//       console.error("Error fetching search results:", error);
//       setError("Failed to fetch search results");
//     }
//   };

//   return (
//     <>
//       <div className="container mt-4 p-4 border rounded shadow-sm w-75">
//         <SearchForm
//           fields={fields}
//           formData={formData}
//           handleChange={handleChange}
//         />
//         {error && <div className="text-danger mb-2">{error}</div>}
//         <div className="d-flex justify-content-between">
//           <button className="btn btn-secondary" onClick={handleClear}>
//             Clear
//           </button>
//           <button className="btn btn-primary" onClick={handleSearch}>
//             Search
//           </button>
//         </div>
//       </div>
//       <div className="container mt-4">
//         {searchResults.length > 0 ? (
//           <Datagrid data={searchResults} />
//         ) : (
//           <p className="text-muted">No results to display.</p>
//         )}
//       </div>
//     </>
//   );
// }
