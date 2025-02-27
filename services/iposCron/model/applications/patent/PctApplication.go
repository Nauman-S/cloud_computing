package patent

type PctApplication struct {
	PctPublicationNum                         string               `json:"pctPublicationNum" bson:"pctPublicationNum"`
	PctApplicationNu                          string               `json:"pctApplicationNu" bson:"pctApplicationNu"`
	DateOfPublicationOfEntryIntoNationalPhase string               `json:"dateOfPublicationOfEntryIntoNationalPhase" bson:"dateOfPublicationOfEntryIntoNationalPhase"`
	PctPriorityClaimed                        []PctPriorityClaimed `json:"pctPriorityClaimed" bson:"pctPriorityClaimed"`
	PctPublicationDate                        string               `json:"pctPublicationDate" bson:"pctPublicationDate"`
	PctEntryDate                              string               `json:"pctEntryDate" bson:"pctEntryDate"`
}
