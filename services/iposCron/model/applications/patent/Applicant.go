package patent

type Applicant struct {
	UenCompanyCode                    string        `json:"uenCompanyCode" bson:"uenCompanyCode"`
	Name                              string        `json:"name" bson:"name"`
	Address                           string        `json:"address" bson:"address"`
	CountryOfIncorporationOrResidence CountryDetail `json:"countryOfIncorporationOrResidence" bson:"countryOfIncorporationOrResidence"`
	StateOfIncorporation              CountryDetail `json:"stateOfIncorporation" bson:"stateOfIncorporation"`
	Nationality                       CountryDetail `json:"nationality" bson:"nationality"`
	SoleproprietorPartnerName         string        `json:"soleproprietorPartnerName" bson:"soleproprietorPartnerName"`
}
