#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Define a writable path for the dump
DUMP_PATH="./dump"

# Create the dump directory if it doesn't exist
mkdir -p $DUMP_PATH

# Dump the local database
mongodump --uri="$LOCAL_URI" --out=$DUMP_PATH > mongodump.log 2>&1

# Restore the dump to your Atlas cluster
mongorestore --uri="$ATLAS_URI" --nsInclude="cinedelicesdb.*" $DUMP_PATH/cinedelicesdb > mongorestore.log 2>&1