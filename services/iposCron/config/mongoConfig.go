package config

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"sync/atomic"
)

var mongoConnection *MongoConnection
var initialized atomic.Bool

type MongoConnection struct {
	Client *mongo.Client
}

func initMongoConnection(ctx context.Context) error {
	Logger.Info("Connecting to Mongo DB")
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb+srv://adminuser:3jfe0FxS41OwumgZ@cluster0.jqvde.mongodb.net/"))
	if err != nil {
		return err
	}
	mongoConnection = &MongoConnection{
		Client: client,
	}
	return nil
}

func CheckMongoConnection() error {
	if !initialized.Load() {
		return errors.New("MongoDB not initialized")
	}
	err := mongoConnection.Client.Ping(context.Background(), readpref.Primary())
	if err != nil {
		return err
	}
	return nil
}

func GetMongoConnection(ctx context.Context) (*MongoConnection, error) {
	if initialized.CompareAndSwap(false, true) {
		if ctx == nil {
			ctx = context.Background()
		}
		err := initMongoConnection(ctx)
		if err != nil {
			return nil, err
		}
		return mongoConnection, nil
	}
	return mongoConnection, nil
}

func GetListDatabaseOptions() *options.ListDatabasesOptions {
	NameOnly := false
	AuthorizedDatabases := false
	return &options.ListDatabasesOptions{
		NameOnly:            &NameOnly,
		AuthorizedDatabases: &AuthorizedDatabases,
	}
}
