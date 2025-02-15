package cron

import (
	"context"
	"go.uber.org/zap"
	"iposCron/config"
	"iposCron/model/applications"
	"iposCron/service/patent"
	"iposCron/storage"
	"time"
)

func DailyPatentCron(parentCtx context.Context, logger *zap.Logger) *ScheduledCron {
	return CreateScheduledCron(10*time.Second, parentCtx, fetchDailyPatentApplication, "patent application", logger)
}

func fetchDailyPatentApplication() {
	logger, _ := config.GetLogger()
	t, _ := time.Parse("2006-01-02", "2019-10-10")
	appDate := applications.CustomDate(t)

	designApplication, err := patent.FetchPatentApplications(appDate)
	if err != nil {
		logger.Error("fetch patent application failed", zap.Error(err))
		return
	}
	logger.Info("fetch patent success: ", zap.Any("patentApplication - ", designApplication))
	err = storage.InsertPatents(designApplication)
	if err != nil {
		logger.Error("insert patent application failed", zap.Error(err))
		return
	}
	logger.Info("insert success")
}
