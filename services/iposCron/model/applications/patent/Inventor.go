package patent

type Inventor struct {
	Name               string `json:"name" bson:"name"`
	Address            string `json:"address" bson:"address"`
	CountryOfResidence string `json:"countryOfResidence" bson:"countryOfResidence"`
	Nationality        string `json:"nationality" bson:"nationality"`
}
