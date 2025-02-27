package patent

type CountryDetail struct {
	Code        string `json:"code" bson:"code"`
	Description string `json:"description" bson:"description"`
}
