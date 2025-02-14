package storage

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"iposCron/config"
	"iposCron/model/applications/patent"
)

func InsertPatents(patent *patent.PatentApplicationResponse) error {
	connection, _ := config.GetMongoConnection(nil)
	collection := connection.Client.Database("ipos").Collection("patent")
	if patent.Count == 0 {
		return nil
	}
	interfaceSlice := make([]interface{}, len(patent.Applications))

	for i, app := range patent.Applications {
		hash := sha256.Sum256([]byte(app.ApplicationNum))
		app.ID = hex.EncodeToString(hash[:])
		app.LodgementDate = patent.LodgementDate
		interfaceSlice[i] = app
	}
	many, err := collection.InsertMany(context.Background(), interfaceSlice)
	if err != nil {
		return err
	}
	if many == nil || many.InsertedIDs == nil || len(many.InsertedIDs) != len(patent.Applications) {
		return errors.New(fmt.Sprintf("Patent Insertion Failed for some reason"))
	}

	return nil
}
