package storage

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.uber.org/zap"
	"iposCron/config"
)

func LogMongoStats(ctx context.Context) {
	logger := config.LoggerDBStats
	connection, _ := config.GetMongoConnection(ctx)
	result, err := connection.Client.ListDatabases(ctx, bson.D{}, config.GetListDatabaseOptions())
	if err != nil {
		logger.Error("Failed to List Databases: %v", zap.Error(err))
	}

	var collectionNames []string
	for _, database := range result.Databases {
		logger.Info(fmt.Sprintf("Database name: %s, size ond disk %d bytes (%.2f MB)", database.Name, database.SizeOnDisk, float64(database.SizeOnDisk)/(1024*1024)))
		db := connection.Client.Database(database.Name)
		collectionNames, err = db.ListCollectionNames(ctx, bson.D{})
		if err != nil {
			logger.Error(fmt.Sprintf("Error listing collections for database %s", database.Name), zap.Error(err))
			continue
		}

		var collectionCount int64
		for _, collectionName := range collectionNames {
			commandResult := db.RunCommand(ctx, bson.M{"collStats": collectionName})
			var document bson.M
			err = commandResult.Decode(&document)
			if err != nil {
				logger.Error(fmt.Sprintf("Error getting collection stats for collection %s, database %s", collectionName, database.Name), zap.Error(err))
				continue
			}
			logger.Info(fmt.Sprintf("Collection %s Storage size: %d bytes (%.2f MB)\n", collectionName, document["storageSize"], float64(document["storageSize"].(int32))/(1024*1024)))
			logger.Info(fmt.Sprintf("Collection %s size: %d bytes (%.2f MB) \n", collectionName, document["size"], float64(document["size"].(int32))/(1024*1024)))
			collectionCount, err = db.Collection(collectionName).CountDocuments(ctx, bson.D{})
			if err != nil {
				logger.Error(fmt.Sprintf("Error getting collection Count for collection %s, database %s", collectionName, database.Name), zap.Error(err))
			}
			logger.Info(fmt.Sprintf("Collection %s Collection Count: %d", collectionName, collectionCount))
		}
	}
}
