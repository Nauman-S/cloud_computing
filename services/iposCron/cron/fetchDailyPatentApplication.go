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

func DailyDesignCron(parentCtx context.Context, logger *zap.Logger) *Cron {
	return StartCron(5*time.Second, parentCtx, fetchDailyPatentApplication, "patent application", logger)
}

func fetchDailyPatentApplication() {
	logger, _ := config.GetLogger()
	dateStr := "2019-10-10"
	t, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		logger.Error("parse date failed", zap.String("dateStr", dateStr), zap.Error(err))
		return
	}
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
