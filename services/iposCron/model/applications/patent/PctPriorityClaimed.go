package patent

type PctPriorityClaimed struct {
	PriorityApplicationNum string        `json:"priorityApplicationNum" bson:"priorityApplicationNum"`
	Country                CountryDetail `json:"country" bson:"country"`
	FilingDate             string        `json:"filingDate" bson:"filingDate"`
}
