package applications

import (
	"encoding/json"
	"fmt"
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

func (c *CustomDate) String() string {
	return time.Time(*c).Format("2006-01-02")
}
