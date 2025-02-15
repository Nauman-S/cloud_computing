package main

import (
	"context"
	"go.uber.org/zap"
	"iposCron/config"
	"iposCron/cron"
	"os"
	"os/signal"
	"syscall"
)

func main() {

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)

	ctx, cancel := context.WithCancel(context.Background())

	initializeLoggers()
	initializeMongoDB(ctx)

	config.Logger.Info("Cron Application Successfully Started")

	c := cron.DailyPatentCron(ctx)
	c.Start(19, 20)

	historicStartDate := "2025-02-15"
	hc, err := cron.HistoricalPatentCron(ctx, historicStartDate)
	if err != nil {
		config.Logger.Fatal("Error running Historic Cron", zap.Error(err))
		_ = config.Logger.Sync()
	}
	hc.Start(19, 18)

	dc := cron.DBStatsCron(ctx)
	dc.Start(19, 20)

	<-stop
	cancel()
	c.Stop()
	hc.Stop()
	dc.Stop()
	if err := config.Logger.Sync(); err != nil {
		config.Logger.Error("Error syncing all logs", zap.Error(err))
	}

	config.Logger.Info("Cron Application stopped")
}

func initializeMongoDB(ctx context.Context) {
	_, err := config.GetMongoConnection(ctx)
	if err != nil {
		config.Logger.Fatal("error connecting to mongodb", zap.Error(err))
		_ = config.Logger.Sync()
		os.Exit(1)
	}

	err = config.CheckMongoConnection()

	if err != nil {
		config.Logger.Fatal("error connecting to mongodb", zap.Error(err))
		_ = config.Logger.Sync()
		os.Exit(1)
	}

}
func initializeLoggers() {
	err := config.CreateLoggers()
	if err != nil {
		config.Logger.Fatal("error initializing logger", zap.Error(err))
		_ = config.Logger.Sync()
		os.Exit(1)
	}
}
