package historic

import (
	"fmt"
	"github.com/spf13/cobra"
	"iposCron/config"
	"iposCron/cron"
	"time"
)

var (
	startDate string
	interval  int
)

const (
	dateFlag     = "date"
	intervalFlag = "interval"
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

		if _, err = time.Parse(cron.DateFormat, startDate); err != nil {
			return fmt.Errorf("start date format is invalid it should be YYYY-MM-DD format")
		}

		if err = config.CreateLogger("historic"); err != nil {
			return err
		}
		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		Run(startDate, interval)
	},
}

func init() {
	flagSet := HistoricCmd.PersistentFlags()
	flagSet.StringP(dateFlag, "d", time.Now().Format(cron.DateFormat), fmt.Sprintf("Provide a date with following format YYYY-MM-DD (e.g. %s)", cron.DateFormat))
	flagSet.IntP(intervalFlag, "i", 10, "Interval in seconds between each fetch")
}
