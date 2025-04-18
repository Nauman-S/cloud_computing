package cmd

import (
	"github.com/spf13/cobra"
	"iposCron/cmd/historic"
	"iposCron/config"
	"os"
)

var (
	verbosity int
)

var rootCmd *cobra.Command

func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	//cobra.OnInitialize(initConfig)
	rootCmd = NewIposCommand()
}

//func initConfig() {}

func NewIposCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "ipos",
		Short: "Fetch Data from data.gov.sg IPOS APIs",
		Long:  `Fetch Data from data.gov.sg IPOS APIs and populate MongoDB`,
		PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
			var err error

			if err = config.SetLogLevel(verbosity); err != nil {
				return err
			}

			return err
		},
	}
	cmd.SetOut(os.Stdout)
	cmd.PersistentFlags().IntVarP(&verbosity, "verbosity", "v", 0, "-1 Debug\n 0 Info\n 1 Warn\n 2 Error")
	cmd.AddCommand(
		historic.HistoricCmd,
	)
	return cmd
}
