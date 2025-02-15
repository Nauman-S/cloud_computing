package patent

type DeclarationOfPriority struct {
	ApplicationNum string        `json:"applicationNum" bson:"applicationNum"`
	Country        CountryDetail `json:"country" bson:"country"`
	FilingDate     string        `json:"filingDate" bson:"filingDate"`
}
