package patent

import (
	"encoding/json"
	"fmt"
	"go.uber.org/zap"
	"io"
	"iposCron/config"
	"iposCron/model/applications"
	"iposCron/model/applications/patent"
	"net/http"
	"net/url"
)

const PatentApplicationUri = "https://api.data.gov.sg/v1/technology/ipos/patents"

func FetchPatentApplications(date applications.CustomDate) (*patent.PatentApplicationResponse, error) {
	var logger = config.LoggerDailyPatent
	logger.Info("FetchPatentApplications")

	client := config.GetDesignClient()

	var req *http.Request
	var err error
	baseURL, err := url.Parse(PatentApplicationUri)
	if err != nil {
		logger.Error("FetchPatentApplications error parsing URL", zap.Error(err))
		return nil, err
	}
	query := baseURL.Query()
	query.Set("lodgement_date", date.String())
	baseURL.RawQuery = query.Encode()

	if req, err = http.NewRequest("GET", baseURL.String(), nil); err != nil {
		logger.Error("FetchPatentApplications error", zap.Error(err))
		return nil, err
	}

	req.Header.Set("Accept", "application/json")

	var resp *http.Response
	if resp, err = client.Do(req); err != nil {
		logger.Error("FetchPatentApplications error making request", zap.Error(err))
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logger.Error("FetchDesignApplications error reading response body", zap.Error(err))
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		logger.Error("FetchDesignApplications error", zap.Any("StatusCode", resp.StatusCode))
		logger.Error("FetchDesignApplications error", zap.Any("Body", string(body)))
		return nil, fmt.Errorf(string(body))
	}
	logger.Info("FetchDesignApplications response", zap.Any("Body", string(body)))

	var designApplication patent.PatentApplicationResponse
	if err = json.Unmarshal(body, &designApplication); err != nil {
		logger.Error("FetchDesignApplications error unmarshalling response body", zap.Error(err))
	}

	return &designApplication, err
}
