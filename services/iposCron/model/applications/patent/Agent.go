package patent

type Agent struct {
	UenCompanyCode string `json:"uenCompanyCode" bson:"uenCompanyCode"`
	Name           string `json:"name" bson:"name"`
}
