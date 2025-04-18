import { useEffect, useState } from "react";
import axios from "axios";
import URLs from "../../constants/urls";
import ResultsCards from "./ResultsCards";
import FormField, { FormFieldProps } from "../elements/FormField";
import { useError } from "../../services/ErrorProvider";
import Loading from "../elements/Loading";
import { SearchFormDataType } from "../../modals/PatentSearchForm";

const smartSearchFields: FormFieldProps[] = [
  { name: "queryText", label: "Title Of Invention", type: "text" },
];
const fields: FormFieldProps[] = [
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
  {
    name: "filingDate",
    label: "Filing Date Range",
    type: "date-range",
  },
  {
    name: "lodgementDate",
    label: "Lodgement Date Range",
    type: "date-range",
  },
];
export default function SearchComponent() {
  const { showError, clearError } = useError();

  const initialFormData: SearchFormDataType = formFieldMapper([
    ...fields,
    ...smartSearchFields,
  ]);

  const [formData, setFormData] = useState(initialFormData);
  const [searchResults, setSearchResults] = useState([]);
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [activeTab, setActiveTab] = useState("basic");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setSearchResults([]);
    clearError();
    // setError("");
  };

  const handleSearch = async () => {
    clearError();
    const hasAnyValue = Object.values(formData).some(
      (value) => value.trim() !== ""
    );

    if (!hasAnyValue) {
      showError("At least 1 field must be filled out");
      return;
    }

    // setError("");
    setLoading(true);

    const queryParams = Object.entries(formData)
      .filter(([_, value]) => value)
      .reduce((acc: Record<string, string>, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    axios
      .get(activeTab === "basic" ? URLs.SEARCH : URLs.SEARCH_SMART, {
        params:
          activeTab === "basic"
            ? queryParams
            : { queryText: formData.queryText },
        headers: {
          "X-TESTER-REQUEST": "tester_secret_api_key",
        },
        withCredentials: true,
      })
      .then((response) => setSearchResults(response.data ?? []))
      .catch((error) => {
        const errorMessage =
          error?.response?.status === 404
            ? "Failed to fetch search results"
            : "System unable to process the request. Please try again later!";
        showError(errorMessage);
        setSearchResults([]);
      })
      .finally(() => setLoading(false));
  };
  const handleTabChange = (tabName: "basic" | "smart") => {
    setActiveTab(tabName);
  };
  const searchFormMapper = (field: FormFieldProps) => (
    <FormField
      key={field.name}
      name={field.name}
      label={field.label}
      type={field.type}
      value={
        formData[`${field.name}Start` as keyof SearchFormDataType] ||
        formData[field.name as keyof SearchFormDataType] ||
        ""
      }
      valueEnd={formData[`${field.name}End` as keyof SearchFormDataType] || ""}
      onChange={handleChange}
      onChangeEnd={handleChange}
      placeholder={field.label}
      // error={errors[field.name]}
      options={field.options}
    />
  );
  return (
    <>
      <div className="container mt-4 w-75">
        <div className="container  mb-4 p-4 border rounded shadow-sm">
          <ul className="nav nav-tabs custom-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "basic" ? "active" : ""}`}
                onClick={() => handleTabChange("basic")}
              >
                Basic Search
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "smart" ? "active" : ""}`}
                onClick={() => handleTabChange("smart")}
              >
                Smart Search
              </button>
            </li>
          </ul>
          <div className="tab-content p-3 border border-top-0">
            {activeTab === "basic" && fields.map(searchFormMapper)}
            {activeTab === "smart" &&
              smartSearchFields.map((field) => (
                <FormField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={
                    formData[
                      `${field.name}Start` as keyof SearchFormDataType
                    ] ||
                    formData[field.name as keyof SearchFormDataType] ||
                    ""
                  }
                  valueEnd={
                    formData[`${field.name}End` as keyof SearchFormDataType] ||
                    ""
                  }
                  onChange={handleChange}
                  onChangeEnd={handleChange}
                  placeholder={field.label}
                  // error={errors[field.name]}
                  options={field.options}
                />
              ))}
          </div>
        </div>
        <div className="d-flex justify-start gap-3">
          <button className="btn btn-secondary " onClick={handleClear}>
            Clear
          </button>
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      {loading && <Loading message="Searching results..." />}

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
    </>
  );
}
const formFieldMapper = (fields: FormFieldProps[]): SearchFormDataType => {
  return fields.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  ) as SearchFormDataType;
};
