package historic

import (
	"context"
	"go.uber.org/zap"
	"iposCron/config"
	"iposCron/cron"
	"os"
	"os/signal"
	"syscall"
)

func Run(startDate string, interval int) {
	var err error
	var c *cron.ScheduledCron
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)

	ctx, cancel := context.WithCancel(context.Background())

	c, err = cron.HistoricalPatentCron(ctx, interval, startDate)

	if err != nil {
		config.Logger.Fatal("Error running Historic Cron", zap.Error(err))
		_ = config.Logger.Sync()
	}

	c.Start(00, 30) //Fix this

	<-stop
	cancel()
	c.Stop()

	_ = config.Logger.Sync()
}
