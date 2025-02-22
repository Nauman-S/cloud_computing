package config

import (
	"net/http"
	"sync"
	"time"
)

var (
	designClient *http.Client
	once         sync.Once
	timeout      = 10 * time.Second
)

func GetDesignClient() *http.Client {
	once.Do(func() {
		designClient = &http.Client{
			Timeout: timeout,
		}
	})
	return designClient
}
