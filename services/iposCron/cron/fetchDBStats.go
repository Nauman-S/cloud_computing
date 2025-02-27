package cron

import (
	"context"
	"iposCron/config"
	"iposCron/storage"
	"time"
)

func DBStatsCron(parentCtx context.Context) *ScheduledCron {
	return CreateScheduledCron(2*time.Minute, parentCtx, func() time.Duration { return fetchDBStats(parentCtx) }, "MongoDB stats", config.LoggerDBStats)
}

func fetchDBStats(ctx context.Context) time.Duration {
	storage.LogMongoStats(ctx)
	return 0
}
