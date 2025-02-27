package patent

type License struct {
	LicenseType                                       string                        `json:"licenseType" bson:"licenseType"`
	IsLicensor                                        bool                          `json:"isLicensor" bson:"isLicensor"`
	LicenseStartDate                                  string                        `json:"licenseStartDate" bson:"licenseStartDate"`
	DetailsOfLicenceToBeRegisteredAmendedOrTerminated string                        `json:"detailsOfLicenceToBeRegisteredAmendedOrTerminated" bson:"detailsOfLicenceToBeRegisteredAmendedOrTerminated"`
	LicenseReferenceNum                               string                        `json:"licenseReferenceNum" bson:"licenseReferenceNum"`
	LicenseEndDate                                    string                        `json:"licenseEndDate" bson:"licenseEndDate"`
	ParticularsOfLicensorLicensee                     ParticularsOfLicensorLicensee `json:"particularsOfLicensorLicensee" bson:"particularsOfLicensorLicensee"`
}
