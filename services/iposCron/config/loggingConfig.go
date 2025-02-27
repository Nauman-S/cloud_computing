package config

import (
	"fmt"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"sync/atomic"
	"time"
)

var createdLogger atomic.Bool

var logLevel zapcore.Level
var Logger *zap.Logger
var LoggerHistoricPatent *zap.Logger
var LoggerDailyPatent *zap.Logger
var LoggerDBStats *zap.Logger

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

func CreateLogger(name string) (err error) {
	if createdLogger.CompareAndSwap(false, true) {
		config := zap.Config{
			Level:       zap.NewAtomicLevelAt(logLevel),
			Development: false,
			Sampling: &zap.SamplingConfig{
				Initial:    100,
				Thereafter: 100,
			},
			Encoding:         "json",
			EncoderConfig:    getZapEncoderConfig(),
			OutputPaths:      []string{"stdout"},
			ErrorOutputPaths: []string{"stderr"},
		}

		Logger, err = config.Build()
		if err != nil {
			return err
		}
	}
	return nil
}

func SetLogLevel(level int) error {
	logLevel = zapcore.Level(level)
	if logLevel == zapcore.InvalidLevel {
		return fmt.Errorf("invalid log level: %v:\n -1 Debug\n 0 Info\n 1 Warn\n 2 Error", level)
	}
	return nil
}
