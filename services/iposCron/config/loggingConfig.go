package config

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"sync/atomic"
	"time"
)

var createdLogger atomic.Bool

var logger *zap.Logger

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

func GetLogger() (*zap.Logger, error) {
	if createdLogger.CompareAndSwap(false, true) {
		var err error
		logger, err = createLogger()
		logger.Info("Logger created")
		return logger, err
	}
	return logger, nil
}

func createLogger() (*zap.Logger, error) {
	config := zap.Config{
		Level:       zap.NewAtomicLevelAt(zap.InfoLevel),
		Development: false,
		Sampling: &zap.SamplingConfig{
			Initial:    100,
			Thereafter: 100,
		},
		Encoding:         "json",
		EncoderConfig:    getZapEncoderConfig(),
		OutputPaths:      []string{"logs/app.log"},
		ErrorOutputPaths: []string{"stderr"},
	}

	loggerInstance, err := config.Build()
	if err != nil {
		return nil, err
	}
	return loggerInstance, nil
}
