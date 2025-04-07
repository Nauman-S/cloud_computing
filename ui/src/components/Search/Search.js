import { useState } from "react";
import axios from "axios";
import URLs from "../../constants/urls";
import ResultsCards from "./ResultsCards"; // Import the new component

export default function SearchComponent() {
  const fields = [
    { name: "applicationNum", label: "Application Number", type: "text" },
    { name: "applicationType", label: "Application Type", type: "text" },
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
    const hasAnyValue = Object.values(formData).some(
      (value) => value.trim() !== ""
    );

    if (!hasAnyValue) {
      setError("At least 1 field must be filled out");
      return;
    }

    setError("");

    try {
      const queryParams = {};
      if (formData.applicationNum)
        queryParams.applicationNum = formData.applicationNum;
      if (formData.applicationType)
        queryParams.applicationType = formData.applicationType;
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
      setError("Failed to fetch search results");
    }
  };

  return (
    <>
      <div className="container mt-4 p-4 border rounded shadow-sm w-75">
        {/* Render your search form here */}
        {fields.map(({ name, label, type }) => (
          <div key={name} className="mb-3 row">
            <label className="col-sm-3 col-form-label">{label}</label>
            <div className="col-sm-9">
              <input
                type={type}
                name={name}
                placeholder={`Enter ${label}`}
                value={formData[name]}
                onChange={handleChange}
                className="form-control form-control-lg"
              />
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

      {/* Use the ResultsCards component to show the results */}
      {searchResults.length > 0 ? (
        <ResultsCards data={searchResults} />
      ) : (
        <p className="text-muted text-center mt-4">No results to display.</p>
      )}
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
