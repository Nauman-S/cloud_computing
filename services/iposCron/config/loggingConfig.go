package config

import (
	"fmt"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"sync/atomic"
	"time"
)

var createdLogger atomic.Bool

var Logger *zap.Logger
var LoggerHistoricPatent *zap.Logger
var LoggerDailyPatent *zap.Logger
var LoggerDBSizeCron *zap.Logger

func getZapEncoderConfig() zapcore.EncoderConfig {
	return zapcore.EncoderConfig{
		LevelKey:      "level",
		TimeKey:       "ts",
		NameKey:       "logger",
		CallerKey:     zapcore.OmitKey,
		MessageKey:    "msg",
		StacktraceKey: "stacktrace",
		LineEnding:    zapcore.DefaultLineEnding,
		EncodeLevel:   zapcore.LowercaseLevelEncoder,
		EncodeTime: func(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
			// Custom timestamp format: yyyy-mm-dd:hh-mm-ss
			formattedTime := t.Format("2006-01-02:15-04-05")
			enc.AppendString(formattedTime)
		},
		EncodeCaller: zapcore.ShortCallerEncoder,
	}

}

func CreateLoggers() error {
	if createdLogger.CompareAndSwap(false, true) {
		var err error
		LoggerHistoricPatent, err = createLogger("historicPatent")
		if err != nil {
			return err
		}
		LoggerDailyPatent, err = createLogger("dailyPatent")
		if err != nil {
			return err
		}
		LoggerDBSizeCron, err = createLogger("db")
		if err != nil {
			return err
		}
		Logger, err = createLogger("app")
		if err != nil {
			return err
		}
		Logger.Info("Logger created")
		return nil
	}
	return nil
}

func createLogger(name string) (*zap.Logger, error) {
	config := zap.Config{
		Level:       zap.NewAtomicLevelAt(zap.InfoLevel),
		Development: false,
		Sampling: &zap.SamplingConfig{
			Initial:    100,
			Thereafter: 100,
		},
		Encoding:         "json",
		EncoderConfig:    getZapEncoderConfig(),
		OutputPaths:      []string{fmt.Sprintf("logs/%v.log", name)},
		ErrorOutputPaths: []string{"stderr"},
	}

	loggerInstance, err := config.Build()
	if err != nil {
		return nil, err
	}
	return loggerInstance, nil
}
