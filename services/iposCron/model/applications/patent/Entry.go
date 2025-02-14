package patent

type Entry struct {
	Events Event `json:"events" bson:"events"`
}
