#!/bin/sh
# Improved method to extract AZURE_STORAGE_KEY from .env
AZURE_STORAGE_KEY=$(grep -E '^AZURE_STORAGE_KEY=' .env | cut -d '=' -f2- | xargs)
AZURE_STORAGE_CONNECTION_STRING=$(grep -E '^AZURE_STORAGE_CONNECTION_STRING=' .env | cut -d '=' -f2- | xargs)
AZURE_STORAGE_ACCOUNT_NAME=$(grep -E '^AZURE_STORAGE_ACCOUNT_NAME=' .env | cut -d '=' -f2- | xargs)
AZURE_STORAGE_CONTAINER_NAME=$(grep -E '^AZURE_STORAGE_CONTAINER_NAME=' .env | cut -d '=' -f2- | xargs)
export AZURE_STORAGE_KEY=$AZURE_STORAGE_KEY
export AZURE_STORAGE_CONNECTION_STRING=$AZURE_STORAGE_CONNECTION_STRING

az storage blob upload-batch -d $AZURE_STORAGE_CONTAINER_NAME --account-name $AZURE_STORAGE_ACCOUNT_NAME -s ./dist --overwrite

exit 0