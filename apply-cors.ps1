# Run this AFTER installing gcloud CLI from https://cloud.google.com/sdk/docs/install
# Replace YOUR_BUCKET_NAME with your actual bucket (e.g. your-project-id.firebasestorage.app)

$bucket = "YOUR_BUCKET_NAME"
gcloud storage buckets update "gs://$bucket" --cors-file="cors.json"
Write-Host "CORS applied to gs://$bucket"
