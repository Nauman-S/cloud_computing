package patent

type Event struct {
	Description string `json:"description" bson:"description"`
	Code        string `json:"code" bson:"code"`
	EventDate   string `json:"eventDate" bson:"eventDate"`
}
