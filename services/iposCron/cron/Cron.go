package cron

import (
	"context"
	"go.uber.org/zap"
	"sync"
	"sync/atomic"
	"time"
)

type Cron struct {
	executable func()
	ticker     *time.Ticker
	frequency  time.Duration
	stopped    atomic.Bool
	ctx        context.Context
	cancel     context.CancelFunc
	name       string
	wg         sync.WaitGroup
	logger     *zap.Logger
}

func StartCron(frequency time.Duration, parentCtx context.Context, executable func(), name string, logger *zap.Logger) *Cron {
	logger.Info("Starting Cron", zap.String("name", name))
	ctx, cancel := context.WithCancel(parentCtx)
	return &Cron{
		executable: executable,
		frequency:  frequency,
		ctx:        ctx,
		cancel:     cancel,
		name:       name,
		logger:     logger,
	}
}

func (s *Cron) Start() {
	s.wg.Add(1)
	go func() {
		defer s.wg.Done()
		s.ticker = time.NewTicker(s.frequency)

		for {
			select {
			case <-s.ctx.Done():
				s.Stop()
				return
			case <-s.ticker.C:
				s.logger.Info("Executing job", zap.String("name", s.name))
				s.executable()
			}
		}
	}()

}

func (s *Cron) Stop() {
	if s.stopped.CompareAndSwap(false, true) {
		if s.ticker != nil {
			s.ticker.Stop()
		}

		s.cancel()
		s.wg.Wait()
		s.logger.Info("Cron stopped", zap.String("name", s.name))
	}
}
