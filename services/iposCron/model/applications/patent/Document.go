package patent

type Document struct {
	FileName      string  `json:"fileName" bson:"fileName"`
	LodgementDate string  `json:"lodgementDate" bson:"lodgementDate"`
	DocType       DocType `json:"docType" bson:"docType"`
	fileId        string  `json:"fileId" bson:"fileId"`
	Url           string  `json:"url" bson:"url"`
}
