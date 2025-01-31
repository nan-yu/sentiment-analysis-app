#!/bin/bash

# export GCP_PROJECT=genkit-quickstart
export GCP_PROJECT=agent-demo-tj
export GCP_REGION=us-central1
export SERVICE_NAME=sentiment-analysis

gcloud run deploy --project=${GCP_PROJECT} --source $PWD --region=${GCP_REGION} --allow-unauthenticated ${SERVICE_NAME}