package patent

type Applicant struct {
	UenCompanyCode                    string        `json:"uenCompanyCode"`
	Name                              string        `json:"name"`
	Address                           string        `json:"address"`
	CountryOfIncorporationOrResidence CountryDetail `json:"countryOfIncorporationOrResidence"`
	StateOfIncorporation              CountryDetail `json:"stateOfIncorporation"`
	Nationality                       CountryDetail `json:"nationality"`
	SoleproprietorPartnerName         string        `json:"soleproprietorPartnerName"`
	Articles                          []Article     `json:"articles"`
}
