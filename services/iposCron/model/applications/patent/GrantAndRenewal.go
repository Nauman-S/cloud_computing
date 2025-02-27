package patent

type GrantAndRenewal struct {
	ExpiryDate                                        string `json:"expiryDate" bson:"expiryDate"`
	DivisionalParentOfUKEUPatentNum                   string `json:"divisionalParentOfUKEUPatentNum" bson:"divisionalParentOfUKEUPatentNum"`
	DateOfGrantOfUKEUPatentNum                        string `json:"dateOfGrantOfUKEUPatentNum" bson:"dateOfGrantOfUKEUPatentNum"`
	DateOfLastRenewal                                 string `json:"dateOfLastRenewal" bson:"dateOfLastRenewal"`
	DateOfRenewal                                     string `json:"dateOfRenewal" bson:"dateOfRenewal"`
	YearOfLastRenewal                                 int    `json:"yearOfLastRenewal" bson:"yearOfLastRenewal"`
	GrantDate                                         string `json:"grantDate" bson:"grantDate"`
	DateOfIssueOfCertificateOfRegistrationInSingapore string `json:"dateOfIssueOfCertificateOfRegistrationInSingapore" bson:"dateOfIssueOfCertificateOfRegistrationInSingapore"`
	NextRenewalDate                                   string `json:"nextRenewalDate" bson:"nextRenewalDate"`
}
