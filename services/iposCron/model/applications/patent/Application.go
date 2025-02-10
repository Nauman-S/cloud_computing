package patent

type Application struct {
	Summary    ApplicationSummary `json:"summary"`
	Applicants []Applicant        `json:"applicants"`
}
