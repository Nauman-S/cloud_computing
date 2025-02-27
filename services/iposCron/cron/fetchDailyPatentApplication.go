package cron

import (
	"context"
	"go.uber.org/zap"
	"iposCron/config"
	"iposCron/service/patent"
	"iposCron/storage"
	"time"
)

func DailyPatentCron(parentCtx context.Context) *ScheduledCron {
	return CreateScheduledCron(24*time.Hour, parentCtx, func() time.Duration { return fetchDailyPatentApplication() }, "daily patent application", config.LoggerDailyPatent)
}

func fetchDailyPatentApplication() time.Duration {
	var logger = config.LoggerDailyPatent
	t, _ := time.Parse("2006-01-02", "2019-10-10")

	designApplication, err := patent.FetchPatentApplications(t, logger)
	if err != nil {
		logger.Error("fetch patent application failed", zap.Error(err))
		return 0
	}
	logger.Info("fetch patent success: ", zap.Any("patentApplication - ", designApplication))

	err = storage.InsertPatents(designApplication)
	if err != nil {
		logger.Error("insert patent application failed", zap.Error(err))
		return 0
	}
	logger.Info("insert success")
	return 0
}
