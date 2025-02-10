package applications

import (
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"time"
)

type CustomDate time.Time

func (c *CustomDate) UnmarshalJSON(b []byte) error {
	// Unmarshal the input JSON into a string
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return fmt.Errorf("error unmarshalling date string: %w", err)
	}

	// Parse the date in "YYYY-MM-DD" format
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		return fmt.Errorf("error parsing date: %w", err)
	}

	*c = CustomDate(t)
	return nil
}

func (c *CustomDate) MarshalBSON() ([]byte, error) {
	dateString := time.Time(*c).Format("2006-01-02")
	return bson.Marshal(dateString)
}

func (c *CustomDate) UnmarshalBSON(data []byte) error {
	var dateString string
	if err := bson.Unmarshal(data, &dateString); err != nil {
		return err
	}

	t, err := time.Parse("2006-01-02", dateString)
	if err != nil {
		return fmt.Errorf("error parsing date: %w", err)
	}

	*c = CustomDate(t)
	return nil
}

func (c *CustomDate) String() string {
	return time.Time(*c).Format("2006-01-02")
}
