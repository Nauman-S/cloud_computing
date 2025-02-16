package cron

import (
	"context"
	"errors"
	"fmt"
	"go.uber.org/zap"
	"iposCron/config"
	"iposCron/service/patent"
	"iposCron/storage"
	"net/url"
	"time"
)

var (
	date           time.Time
	dateFormat                   = "2006-01-02"
	failedFetch                  = make(map[string]int)
	skip                         = 3
	delay          time.Duration = 0
	delayIncrement               = 1 * time.Minute
)

func HistoricalPatentCron(parentCtx context.Context, fromDate string) (c *ScheduledCron, err error) {
	date, err = time.Parse(dateFormat, fromDate)
	if err != nil {
		return nil, err
	}

	return CreateScheduledCron(10*time.Second, parentCtx, func() time.Duration { return fetchHistoricPatentApplication() }, "historic patent application", config.LoggerHistoricPatent), nil
}

func fetchHistoricPatentApplication() time.Duration {
	var logger = config.LoggerHistoricPatent
	dateStr := date.Format(dateFormat)
	logger.Info(fmt.Sprintf("Fetching Historic Patent Application For Date - %v", dateStr))

	designApplication, err := patent.FetchPatentApplications(date, logger)
	if err != nil {
		var urlErr *url.Error
		if errors.As(err, &urlErr) && urlErr.Timeout() {
			delay += delayIncrement
			logger.Error(fmt.Sprintf("Failed Fetching Historic Patent Application Due To Timeout For Date %s, Backoff Recommended", dateStr), zap.Error(err))

		} else {
			logger.Error(fmt.Sprintf("Failed Fetching Historic Patent Application For Date %s", dateStr), zap.Error(err))
			delay = 0
		}
		if c, exists := failedFetch[dateStr]; exists {
			if c == skip {
				date = date.AddDate(0, 0, -1)
				logger.Error(fmt.Sprintf("Failed Fetching %d times for Patent Application on Date %s,Skipping to date %s", skip, dateStr, date.Format(dateFormat)), zap.Error(err))
				delete(failedFetch, dateStr)
			} else {
				failedFetch[dateStr] = c + 1
			}
		} else {
			failedFetch[dateStr] = 1
		}
		return delay
	}
	if designApplication.Count == 0 {
		logger.Info(fmt.Sprintf("No Patent Application Found For Date %s", dateStr))
		date = date.AddDate(0, 0, -1)
		delay = 0
		return delay
	}

	logger.Info(fmt.Sprintf("Found %d Patent Application For Date %s", designApplication.Count, dateStr))

	err = storage.InsertPatents(designApplication)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed Insert Patent Application in MongoDB For Date %v", dateStr), zap.Error(err))
		if c, exists := failedFetch[dateStr]; exists {
			failedFetch[dateStr] = c + 1
			if c == skip {
				date = date.AddDate(0, 0, -1)
				logger.Error(fmt.Sprintf("Failed Inserting into Mongo DB %d times for Patent Application on Date %s,Skipping to date %s", skip, dateStr, date.Format(dateFormat)), zap.Error(err))
				delete(failedFetch, dateStr)
			}
		} else {
			failedFetch[dateStr] = 1
		}
		return delay
	}
	logger.Info(fmt.Sprintf("Success Insert Patent Application in MongoDB For Date %v", dateStr))
	date = date.AddDate(0, 0, -1)
	delay = 0
	return delay
}
