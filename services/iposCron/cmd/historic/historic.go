package historic

import (
	"fmt"
	"github.com/spf13/cobra"
	"iposCron/config"
	"iposCron/constants"
	"iposCron/storage"
	"time"
)

var (
	startDate string
	interval  int
	count     int
)

const (
	dateFlag     = "date"
	intervalFlag = "interval"
	countFlag    = "count"
	NODATEWASSET = "NO DATE WAS SET"
)

var HistoricCmd = &cobra.Command{
	Use:   "historic [flags]",
	Short: "Fetch historical patent data from data.gov.sg",
	PreRunE: func(cmd *cobra.Command, args []string) error {
		var err error
		if startDate, err = cmd.Flags().GetString(dateFlag); err != nil {
			return err
		}

		if interval, err = cmd.Flags().GetInt(intervalFlag); err != nil {
			return err
		}
		if interval < 1 {
			return fmt.Errorf("interval in seconds between each fetch. Must be > 0")
		}

		if count, err = cmd.Flags().GetInt(countFlag); err != nil {
			return err
		}

		if count < 1 {
			return fmt.Errorf("count of days to fetch per run. Must be > 0")
		}

		if err = config.CreateLogger("historic"); err != nil {
			return err
		}

		if _, err = config.GetMongoConnection(cmd.Context()); err != nil {
			return err
		}

		if startDate == NODATEWASSET {
			var time time.Time
			if time, err = storage.FetchEarliestLodgementDate(cmd.Context()); err != nil {
				return err
			}
			time = time.AddDate(0, 0, -1)
			startDate = time.Format(constants.DateFormat)
		}

		if _, err = time.Parse(constants.DateFormat, startDate); err != nil {
			return fmt.Errorf("start date format is invalid it should be YYYY-MM-DD format")
		}

		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		Run(startDate, interval, count, cmd.Context())
	},
}

func init() {
	flagSet := HistoricCmd.PersistentFlags()
	flagSet.StringP(dateFlag, "d", NODATEWASSET, fmt.Sprintf("Provide a date with following format YYYY-MM-DD (e.g. %s)", constants.DateFormat))
	flagSet.IntP(intervalFlag, "i", 5, "Interval in seconds between each fetch")
	flagSet.IntP(countFlag, "c", 10, "How many days to fetch per run")
}
