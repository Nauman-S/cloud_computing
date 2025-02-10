package patent

import (
	"fmt"
	"iposCron/model/applications"
)

type PatentApplicationResponse struct {
	LodgementDate applications.CustomDate `json:"lodgement_date" bson:"lodgement_date"`
	Count         int                     `json:"count" bson:"count"`
	Applications  []Application           `json:"items" bson:"items"`
}

func (p *PatentApplicationResponse) String() string {
	return fmt.Sprintf("PatentApplicationResponse: LodgementDate: %v, Count: %d, items:%v", p.LodgementDate.String(), p.Count, p.Applications)
}
