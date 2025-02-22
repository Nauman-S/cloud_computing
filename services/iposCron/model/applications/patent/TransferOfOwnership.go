package patent

type TransferOfOwnership struct {
	CurrentApplicantProprietorDetails    ApplicantProprietorDetail `json:"currentApplicantProprietorDetails" bson:"currentApplicantProprietorDetails"`
	SubsequentApplicantProprietorDetails ApplicantProprietorDetail `json:"subsequentApplicantProprietorDetails" bson:"subsequentApplicantProprietorDetails"`
	DateOfTransferOfOwnership            string                    `json:"dateOfTransferOfOwnership" bson:"dateOfTransferOfOwnership"`
}
