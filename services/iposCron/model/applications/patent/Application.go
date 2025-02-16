package patent

type Application struct {
	Summary                           ApplicationSummary                 `json:"summary" bson:"summary"`
	Applicants                        []Applicant                        `json:"applicant" bson:"applicant"`
	HmgStatus                         string                             `json:"hmgStatus" bson:"hmgStatus"`
	TransferOfOwnerships              []TransferOfOwnership              `json:"transferOfOwnership" bson:"transferOfOwnership"`
	Inventors                         []Inventor                         `json:"inventors" bson:"inventors"`
	DeclarationOfPriorities           []DeclarationOfPriority            `json:"declarationOfPriority" bson:"declarationOfPriority"`
	SecurityInterest                  string                             `json:"securityInterest" bson:"securityInterest"`
	OtherEntries                      []Entry                            `json:"otherEntries" bson:"otherEntries"`
	PctApplications                   []PctApplication                   `json:"pctApplication" bson:"pctApplication"`
	GrantAndRenewal                   GrantAndRenewal                    `json:"grantAndRenewal" bson:"grantAndRenewal"`
	Rupka                             []Rupka                            `json:"rupka" bson:"rupka"`
	Documents                         []Document                         `json:"documents" bson:"documents"`
	License                           string                             `json:"license" bson:"license"`
	AgentCorrespondenceDetails        []AgentCorrespondenceDetail        `json:"agentCorrespondenceDetails" bson:"agentCorrespondenceDetails"`
	CurrentApplicantProprietorDetails []CurrentApplicantProprietorDetail `json:"currentApplicantProprietorDetails" bson:"currentApplicantProprietorDetails"`
	ApplicationNum                    string                             `json:"applicationNum" bson:"applicationNum"`
	LodgementDate                     string                             `bson:"lodgementDate"`
	ID                                string                             `bson:"_id"`
}
