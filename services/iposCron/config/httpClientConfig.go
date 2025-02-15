package config

import (
	"net/http"
	"time"
)

func GetDesignClient() *http.Client {
	return &http.Client{
		Timeout: 10 * time.Second,
	}
}
