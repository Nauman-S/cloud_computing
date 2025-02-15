package cron

import (
	"context"
	"go.uber.org/zap"
	"sync"
	"sync/atomic"
	"time"
)

type ScheduledCron struct {
	executable func()
	frequency  time.Duration
	stopped    atomic.Bool
	ctx        context.Context
	cancel     context.CancelFunc
	name       string
	wg         sync.WaitGroup
	logger     *zap.Logger
}

func CreateScheduledCron(frequency time.Duration, parentCtx context.Context, executable func(), name string, logger *zap.Logger) *ScheduledCron {
	logger.Info("Starting Cron For Daily Run - ", zap.String("name", name))
	ctx, cancel := context.WithCancel(parentCtx)
	return &ScheduledCron{
		executable: executable,
		ctx:        ctx,
		cancel:     cancel,
		name:       name,
		logger:     logger,
		frequency:  frequency,
	}
}

func (s *ScheduledCron) scheduleRun(hour, minute int) time.Time {
	sgt, _ := time.LoadLocation("Asia/Singapore")
	now := time.Now().In(sgt)
	nextRun := time.Date(now.Year(), now.Month(), now.Day(), hour, minute, 0, 0, sgt)
	return s.scheduleNextRun(nextRun)
}

func (s *ScheduledCron) scheduleNextRun(currentRun time.Time) time.Time {
	sgt, _ := time.LoadLocation("Asia/Singapore")
	now := time.Now().In(sgt)
	for now.After(currentRun) {
		if s.frequency > 0 {
			currentRun = currentRun.Add(s.frequency)
		} else {
			currentRun = currentRun.Add(24 * time.Hour)
		}

	}
	return currentRun
}

func (s *ScheduledCron) Start(hour, minute int) {
	s.wg.Add(1)
	go func() {
		nextRun := s.scheduleRun(hour, minute)
		defer s.wg.Done()

		for {
			s.logger.Info("Next run scheduled", zap.String("name", s.name), zap.Time("time", nextRun))
			sleepDuration := time.Until(nextRun)
			timer := time.NewTimer(sleepDuration)
			select {
			case <-s.ctx.Done():
				s.Stop()
				return
			case <-timer.C:
				s.logger.Info("Executing job", zap.String("name", s.name))
				s.executable()

			}
			nextRun = s.scheduleNextRun(nextRun)
		}

	}()

}

func (s *ScheduledCron) Stop() {
	if s.stopped.CompareAndSwap(false, true) {
		s.cancel()
		s.wg.Wait()
		s.logger.Info("Cron stopped", zap.String("name", s.name))
	}
}
