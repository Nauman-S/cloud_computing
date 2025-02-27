package patent

type ApplicantProprietorDetail struct {
	Name                   string `json:"name" bson:"name"`
	Code                   string `json:"code" bson:"code"`
	Address                string `json:"address" bson:"address"`
	CountryOfIncorporation string `json:"countryOfIncorporation" bson:"countryOfIncorporation"`
}
