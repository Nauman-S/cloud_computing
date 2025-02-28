package storage

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"iposCron/config"
	"iposCron/constants"
	"time"
)

func FetchEarliestLodgementDate(ctx context.Context) (time.Time, error) {
	connection, _ := config.GetMongoConnection(nil)

	patentDate, err := fetchEarliestDateFromCollection(ctx, connection, COLLECTION_IPOS_PATENT, "lodgementDate")
	if err != nil {
		return time.Time{}, err
	}
	failureDate, err := fetchEarliestDateFromCollection(ctx, connection, COLLECTION_FAILURES, "date")
	if err != nil {
		return time.Time{}, err
	}
	var earliestDate time.Time
	if patentDate.IsZero() && failureDate.IsZero() {
		earliestDate = time.Now()
	} else if patentDate.IsZero() {
		earliestDate = failureDate
	} else if failureDate.IsZero() {
		earliestDate = patentDate
	} else if patentDate.Before(failureDate) {
		earliestDate = patentDate
	} else {
		earliestDate = failureDate
	}

	return earliestDate, nil
}

func InsertHistoricPatentFetchFailure(date string, err error) error {
	connection, _ := config.GetMongoConnection(nil)
	collection := connection.Client.Database(DATABASE_IPOS).Collection(COLLECTION_FAILURES)
	_, err = collection.InsertOne(context.Background(), bson.D{{"collection", COLLECTION_IPOS_PATENT}, {"date", date}, {"error", err.Error()}})
	if err != nil {
		return err
	}
	return nil
}

func fetchEarliestDateFromCollection(ctx context.Context, connection *config.MongoConnection, collectionName, dateField string) (time.Time, error) {
	collection := connection.Client.Database(DATABASE_IPOS).Collection(collectionName)
	opts := options.FindOne().SetSort(bson.D{{dateField, 1}}).SetProjection(bson.D{{dateField, 1}})

	var result bson.M

	err := collection.FindOne(ctx, bson.D{}, opts).Decode(&result)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return time.Time{}, nil
	}
	if err != nil {
		return time.Time{}, err
	}

	dateString, ok := result[dateField].(string)
	if !ok || dateString == "" {
		return time.Time{}, err
	}

	date, err := time.Parse(constants.DateFormat, dateString)
	if err != nil {
		return time.Time{}, err
	}

	return date, nil
}
