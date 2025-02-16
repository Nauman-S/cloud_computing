package patent

type ParticularsOfLicensorLicensee struct {
	RepresentationType   RepresentationType `json:"representationType" bson:"representationType"`
	Address              string             `json:"address" bson:"address"`
	LicensorlicenseeName string             `json:"licensorlicenseeName" bson:"licensorlicenseeName"`
	LicensorlicenseeCode string             `json:"licensorlicenseeCode" bson:"licensorlicenseeCode"`
}
