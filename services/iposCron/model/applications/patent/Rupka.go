package patent

type Rupka struct {
	XukNum         string `json:"xuk_num" bson:"xuk_num"`
	XGazetteDate   string `json:"xgazette_date" bson:"xgazette_date"`
	XPatentNum     string `json:"xpatent_num" bson:"xpatent_num"`
	XIsSection261c bool   `json:"xIsSection261c" bson:"xIsSection261c"`
	XukGrantDate   string `json:"xuk_grant_date" bson:"xuk_grant_date"`
	XGazetteNum    string `json:"xgazette_num" bson:"xgazette_num"`
}
