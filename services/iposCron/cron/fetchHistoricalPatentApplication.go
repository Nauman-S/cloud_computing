package cron

import (
	"context"
	"errors"
	"fmt"
	"go.uber.org/zap"
	"iposCron/config"
	"iposCron/constants"
	"iposCron/service/patent"
	"iposCron/storage"
	"net/url"
	"os"
	"syscall"
	"time"
)

var (
	date           time.Time
	failedFetch                  = make(map[string]int)
	skip                         = 3
	delay          time.Duration = 0
	delayIncrement               = 1 * time.Minute
	count                        = 0
)

func HistoricalPatentCron(parentCtx context.Context, interval int, fromDate string, runCount int, stop chan os.Signal) (c *ScheduledCron, err error) {
	count = runCount
	date, err = time.Parse(constants.DateFormat, fromDate)
	if err != nil {
		return nil, err
	}

	return CreateScheduledCron(time.Duration(interval)*time.Second, parentCtx, func() time.Duration {
		runCount--
		if runCount < 0 {
			stop <- os.Signal(syscall.SIGTERM)
		}
		return fetchHistoricPatentApplication()
	}, "Historic Patent Cron", config.Logger), nil
}

func fetchHistoricPatentApplication() time.Duration {
	var logger = config.Logger
	dateStr := date.Format(constants.DateFormat)
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
				logger.Error(fmt.Sprintf("Failed Fetching %d times for Patent Application on Date %s,Recording issue and Skipping to date %s", skip, dateStr, date.Format(constants.DateFormat)), zap.Error(err))
				if err = storage.InsertHistoricPatentFetchFailure(dateStr, err); err != nil {
					logger.Fatal("Failed to record failure", zap.Error(err))
				}
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
		if err = storage.InsertHistoricPatentFetchFailure(dateStr, fmt.Errorf("no patents exist :(")); err != nil {
			logger.Fatal("Failed to record failure", zap.Error(err))
		}
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
				logger.Error(fmt.Sprintf("Failed Inserting into Mongo DB %d times for Patent Application on Date %s,Skipping to date %s", skip, dateStr, date.Format(constants.DateFormat)), zap.Error(err))
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
