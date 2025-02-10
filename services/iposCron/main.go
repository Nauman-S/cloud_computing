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

//TIP <p>To run your code, right-click the code and select <b>Run</b>.</p> <p>Alternatively, click
// the <icon src="AllIcons.Actions.Execute"/> icon in the gutter and select the <b>Run</b> menu item from here.</p>

func main() {

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)

	ctx, cancel := context.WithCancel(context.Background())

	logger := initializeLogger()
	initializeMongoDB(ctx, logger)

	logger.Info("Cron Application Successfully Started")

	c := cron.DailyDesignCron(ctx, logger)
	c.Start()

	<-stop
	cancel()
	c.Stop()
	if err := logger.Sync(); err != nil {
		logger.Error("Error syncing all logs", zap.Error(err))
	}

	logger.Info("Cron Application stopped")
}

func initializeMongoDB(ctx context.Context, logger *zap.Logger) {
	_, err := config.GetMongoConnection(ctx)
	if err != nil {
		logger.Fatal("error connecting to mongodb", zap.Error(err))
		_ = logger.Sync()
		os.Exit(1)
	}

	err = config.CheckMongoConnection()

	if err != nil {
		logger.Fatal("error connecting to mongodb", zap.Error(err))
		_ = logger.Sync()
		os.Exit(1)
	}

}

func initializeLogger() *zap.Logger {
	logger, err := config.GetLogger()
	if err != nil {
		logger.Fatal("error initializing logger", zap.Error(err))
		_ = logger.Sync()
		os.Exit(1)
	}
	return logger
}
