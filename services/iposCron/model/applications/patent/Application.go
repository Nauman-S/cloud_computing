package patent

type Application struct {
	Summary             ApplicationSummary `json:"summary" bson:"summary"`
	Applicants          []Applicant        `json:"applicant" bson:"applicant"`
	HmgStatus           string             `json:"hmgStatus" bson:"hmgStatus"`
	TransferOfOwnership string             `json:"transferOfOwnership" bson:"transferOfOwnership"`
	Inventors           []Inventor         `json:"inventors" bson:"inventors"`
}
