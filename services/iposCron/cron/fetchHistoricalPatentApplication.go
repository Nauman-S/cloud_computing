package cron

import (
	"context"
	"fmt"
	"go.uber.org/zap"
	"iposCron/config"
	"iposCron/service/patent"
	"iposCron/storage"
	"time"
)

var date time.Time
var dateFormat = "2006-01-02"

func HistoricalPatentCron(parentCtx context.Context, fromDate string) (c *ScheduledCron, err error) {
	date, err = time.Parse(dateFormat, fromDate)
	if err != nil {
		return nil, err
	}

	return CreateScheduledCron(90*time.Second, parentCtx, fetchHistoricPatentApplication, "historic patent application", config.LoggerHistoricPatent), nil
}

func fetchHistoricPatentApplication() {
	var logger = config.LoggerHistoricPatent
	dateStr := date.Format(dateFormat)
	logger.Info(fmt.Sprintf("Fetching Historic Patent Application For Date - %v", dateStr))

	designApplication, err := patent.FetchPatentApplications(date, logger)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed Fetching Historic Patent Application For Date %v", dateStr), zap.Error(err))
		return
	}
	logger.Info(fmt.Sprintf("Success Fetching Historic Patent Application For Date %v\n", dateStr), zap.Any("PatentApplicationResponse = ", designApplication))
	err = storage.InsertPatents(designApplication)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed Insert Patent Application in MongoDB For Date %v\n", dateStr), zap.Error(err))
		return
	}
	logger.Info(fmt.Sprintf("Success Insert Patent Application in MongoDB For Date %v\n", dateStr))
	date = date.AddDate(0, 0, -1)
}
