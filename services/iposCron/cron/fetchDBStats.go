package cron

import (
	"context"
	"iposCron/config"
	"iposCron/storage"
	"time"
)

func DBStatsCron(parentCtx context.Context) *ScheduledCron {
	return CreateScheduledCron(30*time.Second, parentCtx, func() { fetchDBStats(parentCtx) }, "MongoDB stats", config.LoggerDBStats)
}

func fetchDBStats(ctx context.Context) {
	storage.LogMongoStats(ctx)
}
