package historic

import (
	"context"
	"fmt"
	"go.uber.org/zap"
	"iposCron/config"
	"iposCron/cron"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func Run(startDate string, interval int, count int, cmdCtx context.Context) {
	var err error
	var c *cron.ScheduledCron
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)

	ctx, cancel := context.WithCancel(cmdCtx)
	config.Logger.Info(fmt.Sprintf("Starting Historic Cron with startDate: %s, fetching interval: %d seconds, for last %d days", startDate, interval, count))
	c, err = cron.HistoricalPatentCron(ctx, interval, startDate, count, stop)

	if err != nil {
		config.Logger.Fatal("Error running Historic Cron", zap.Error(err))
		_ = config.Logger.Sync()
	}
	sgt, _ := time.LoadLocation("Asia/Singapore")
	t := time.Now().In(sgt)
	c.Start(t.Hour(), t.Minute())

	<-stop
	cancel()
	c.Stop()

	_ = config.Logger.Sync()
}
