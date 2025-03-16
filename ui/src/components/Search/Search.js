import { useState } from "react";
import axios from "axios";
import URLs from "../../constants/urls";
import Datagrid from "./Datagrid";
function SearchForm({ fields, formData, handleChange }) {
  return (
    <>
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
    </>
  );
}

export default function SearchComponent() {
  const fields = [
    { name: "applicationNum", label: "Application Number", type: "text" },
    { name: "applicationType", label: "Application Type", type: "text" },
    { name: "titleOfInvention", label: "Title Of Invention", type: "text" },
    { name: "dateOfPublication", label: "Publication Date", type: "date" },
    { name: "filingDate", label: "Filing Type", type: "date" },
    { name: "lodgementDate", label: "Lodgement Date", type: "date" },
  ];
  const initialFormData = fields.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  );
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setError("");
  };

  const handleSearch = async () => {
    console.log("Searching with:", formData);
    // Validation: Ensure all fields are filled
    if (Object.values(formData).every((value) => value.trim() === "")) {
      setError("At least 1 fields must be filled out");
      return;
    }
    setError("");

    try {
      const response = await axios.get(URLs.SEARCH, {
        params: formData,
      });
      console.log("Search Results:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch search results");
    }
  };
  //Mock data
  const data = [
    {
      applicationNum: "11202003147X",
      applicationType: "PCT-NP",
      titleOfInvention:
        "PERIODONTITIS VACCINE AND RELATED COMPOSITIONS AND METHOD OF USE",
      lodgementDate: "2020-04-05",
    },
  ];
  return (
    <>
      <div className="container mt-4 p-4 border rounded shadow-sm w-75">
        <SearchForm
          fields={fields}
          formData={formData}
          handleChange={handleChange}
        />
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
      <Datagrid data={data}></Datagrid>
    </>
  );
}
