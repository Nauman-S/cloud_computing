import { useEffect, useState } from "react";
import axios from "axios";
import URLs from "../../constants/urls";
import ResultsCards from "./ResultsCards";
import FormField, { FormFieldProps } from "../elements/FormField";
import { useError } from "../../services/ErrorProvider";
import Loading from "../elements/Loading";
import { SearchFormDataType } from "../../modals/PatentSearchForm";
import { WIPNotice } from "../elements/WorkInProgress";
import { PatentSearchResponse } from "../../modals/PatentSearchResponse";

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
  {
    name: "titleOfInvention",
    label: "Title Of Invention",
    type: "text",
    tooltipText:
      "Enabling the smart search will retrieve results that not only match the title of invention keyword, but are also semantically similar in meaning.",
  },
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
  // const [searchResults, setSearchResults] = useState([]);

  const [searchResults, setSearchResults] = useState<PatentSearchResponse[]>(
    []
  );
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [activeTab, setActiveTab] = useState("patents");
  const [smartSearchEnabled, setSmartSearchEnabled] = useState(false);
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
    // const hasAnyValue = Object.values(formData).some(
    //   (value) => value.trim() !== ""
    // );

    // if (!hasAnyValue) {
    //   showError("At least 1 field must be filled out");
    //   return;
    // }

    // setError("");
    setLoading(true);

    const queryParams = Object.entries(formData)
      .filter(([_, value]) => value)
      .reduce((acc: Record<string, string>, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    const hasOnlyTitle =
      Object.keys(queryParams).length === 1 &&
      "titleOfInvention" in queryParams;

    try {
      if (activeTab === "patents") {
        const title = formData.titleOfInvention.trim();
        // Smart case: combine both APIs
        if (smartSearchEnabled && title.length >= 2) {
          const [basicRes, smartRes] = await Promise.all([
            axios.get(URLs.SEARCH, {
              params: queryParams,
              headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
              withCredentials: true,
            }),
            axios.get(URLs.SEARCH_SMART, {
              params: { queryText: title, similarityThreshold: 0.68, k: 200 },
              headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
              withCredentials: true,
            }),
          ]);
          const basicData: PatentSearchResponse[] = basicRes.data ?? [];
          const smartData: PatentSearchResponse[] = smartRes.data ?? [];
          // dedupe by applicationNum
          if (hasOnlyTitle) {
            const combined = [...basicData, ...smartData];
            const unique = combined.filter(
              (item, i, arr) =>
                arr.findIndex(
                  (t) => t.applicationNum === item.applicationNum
                ) === i
            );
            setSearchResults(unique);
          } else {
            const smartNums = new Set(
              smartData.map((item) => item.applicationNum)
            );

            const intersection = basicData.filter((item) =>
              smartNums.has(item.applicationNum)
            );
            setSearchResults(intersection);
          }
        } else {
          // regular basic search
          const res = await axios.get(URLs.SEARCH, {
            params: queryParams,
            headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
            withCredentials: true,
          });
          setSearchResults(res.data ?? []);
        }
      } else {
        // Smart tab (left empty in UI, but still callable if user switches)
        const res = await axios.get(URLs.SEARCH_SMART, {
          params: { queryText: formData.titleOfInvention },
          headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
          withCredentials: true,
        });
        setSearchResults(res.data ?? []);
      }
    } catch (err: any) {
      const msg =
        err?.response?.status === 404
          ? "No results found"
          : "System unable to process the request. Please try again later!";
      showError(msg);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  const handleTabChange = (tabName: "patents" | "trademarks") => {
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
      tooltipText={field.tooltipText}
    />
  );
  return (
    <>
      <div className="container mt-4 w-75">
        <div className="container  mb-4 p-4 border rounded shadow-sm">
          <ul className="nav nav-tabs custom-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "patents" ? "active" : ""
                }`}
                onClick={() => handleTabChange("patents")}
              >
                Patents
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "trademarks" ? "active" : ""
                }`}
                onClick={() => handleTabChange("trademarks")}
              >
                Trademarks
              </button>
            </li>
          </ul>
          <div className="tab-content p-3 border border-top-0">
            {activeTab === "patents" &&
              fields.map((field) =>
                field.name === "titleOfInvention" ? (
                  <div
                    key={field.name}
                    className="d-flex align-items-center gap-3"
                  >
                    {searchFormMapper(field)}
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="smartSearchToggle"
                        checked={smartSearchEnabled}
                        onChange={() => setSmartSearchEnabled((prev) => !prev)}
                      />
                      <label
                        className="form-check-label d-flex align-items-center gap-1"
                        htmlFor="smartSearchToggle"
                      >
                        Enable Smart Search for Title of Invention
                      </label>
                    </div>
                  </div>
                ) : (
                  searchFormMapper(field)
                )
              )}
            {activeTab === "trademarks" && (
              // smartSearchFields.map((field) => (
              //   <FormField
              //     key={field.name}
              //     name={field.name}
              //     label={field.label}
              //     type={field.type}
              //     value={
              //       formData[
              //         `${field.name}Start` as keyof SearchFormDataType
              //       ] ||
              //       formData[field.name as keyof SearchFormDataType] ||
              //       ""
              //     }
              //     valueEnd={
              //       formData[`${field.name}End` as keyof SearchFormDataType] ||
              //       ""
              //     }
              //     onChange={handleChange}
              //     onChangeEnd={handleChange}
              //     placeholder={field.label}
              //     // error={errors[field.name]}
              //     options={field.options}
              //   />
              <WIPNotice />
            )}
          </div>
          <p className="mt-2 text-muted fst-italic">
            If no fields are filled, Search will retrieve all results.
          </p>
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
