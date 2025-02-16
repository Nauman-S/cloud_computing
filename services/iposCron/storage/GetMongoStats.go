package storage

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
	"iposCron/config"
	"iposCron/model/applications/patent"
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

			if collectionName == COLLECTION_IPOS_PATENT {
				var collectionCount int64
				collection := db.Collection(collectionName)
				collectionCount, err = collection.CountDocuments(ctx, bson.D{})
				var earliestPatent patent.Application
				err = collection.FindOne(ctx, bson.D{}, options.FindOne().SetSort(bson.D{{"lodgementDate", 1}})).Decode(&earliestPatent)
				if err != nil {
					logger.Error(fmt.Sprintf("Error getting earliest patent for collection %s, database %s", collectionName, database.Name), zap.Error(err))
				} else {
					logger.Info(fmt.Sprintf("Earliest Patent Date: %s", earliestPatent.LodgementDate))
				}
				logger.Info(fmt.Sprintf("Collection %s Collection Count: %d", collectionName, collectionCount))
			}
		}
		return
	}
}
