package patent

type ApplicationSummary struct {
	ApplicationNum                        string `json:"applicationNum" bson:"applicationNum"`
	ApplicationType                       string `json:"applicationType" bson:"applicationType"`
	ApplicationStatus                     string `json:"applicationStatus" bson:"applicationStatus"`
	PublicationPatentNumForOldApplication string `json:"PublicationPatentNumForOldApplication" bson:"PublicationPatentNumForOldApplication"`
	TitleOfInvention                      string `json:"TitleOfInvention" bson:"TitleOfInvention"`
	FilingDate                            string `json:"filingDate" bson:"filingDate"`
	LodgementDate                         string `json:"lodgementDate" bson:"lodgementDate"`
	DateOfPublication                     string `json:"dateOfPublication" bson:"dateOfPublication"`
	IPC                                   string `json:"ipc" bson:"ipc"`
}
