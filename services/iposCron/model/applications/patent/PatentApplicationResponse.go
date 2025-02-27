package patent

import (
	"fmt"
)

type PatentApplicationResponse struct {
	LodgementDate string        `json:"lodgement_date" bson:"lodgement_date"`
	Count         int           `json:"count" bson:"count"`
	Applications  []Application `json:"items" bson:"items"`
}

func (p *PatentApplicationResponse) String() string {
	return fmt.Sprintf("PatentApplicationResponse: %+v", *p)
}
