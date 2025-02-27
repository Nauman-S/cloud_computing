package patent

type AgentCorrespondenceDetail struct {
	RepresentationType           string `json:"representationType" bson:"representationType"`
	Agent                        Agent  `json:"agent" bson:"agent"`
	ActionRepresenting           string `json:"actionRepresenting" bson:"actionRepresenting"`
	RepresentativeName           string `json:"representativeName" bson:"representativeName"`
	AddressForServiceInSingapore string `json:"addressForServiceInSingapore" bson:"addressForServiceInSingapore"`
}
