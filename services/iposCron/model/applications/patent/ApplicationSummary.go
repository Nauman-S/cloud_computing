package patent

import (
	"iposCron/model/applications"
)

type ApplicationSummary struct {
	ApplicationNum                string                  `json:"applicationNum"`
	FilingDate                    applications.CustomDate `json:"filingDate"`
	ClassSubClass                 string                  `json:"classSubClass"`
	Status                        string                  `json:"status"`
	ApprovedDate                  applications.CustomDate `json:"approvedDate"`
	UkDesignNum                   string                  `json:"ukDesignNum"`
	UkRegistrationDate            applications.CustomDate `json:"ukRegistrationDate"`
	InternationalRegistrationNum  string                  `json:"internationalRegistrationNum"`
	InternationalRegistrationDate applications.CustomDate `json:"internationalRegistrationDate"`
	RenewalDueDate                applications.CustomDate `json:"renewalDueDate"`
	ExpiryDate                    applications.CustomDate `json:"expiryDate"`
	LodgementDate                 applications.CustomDate `json:"lodgementDate"`
}
