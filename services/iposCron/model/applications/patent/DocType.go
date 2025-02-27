package patent

type DocType struct {
	Description string `json:"description" bson:"description"`
	Code        string `json:"code" bson:"code"`
}
