#!/bin/bash

# GCP Deployment Script for The Nuts Game
# Make sure you have gsutil installed and authenticated

BUCKET_NAME="thenuts-game"  # Change this to your preferred bucket name
REGION="us-central1"  # Change to your preferred region

echo "🎲 Deploying The Nuts poker game to GCP..."

# Create bucket if it doesn't exist
if ! gsutil ls -b gs://${BUCKET_NAME} &>/dev/null; then
    echo "Creating bucket gs://${BUCKET_NAME}..."
    gsutil mb -l ${REGION} gs://${BUCKET_NAME}
else
    echo "Bucket gs://${BUCKET_NAME} already exists"
fi

# Enable public access
echo "Setting bucket permissions..."
gsutil iam ch allUsers:objectViewer gs://${BUCKET_NAME}

# Configure as static website
echo "Configuring static website..."
gsutil web set -m index.html -e index.html gs://${BUCKET_NAME}

# Upload the HTML file
echo "Uploading index.html..."
gsutil -h "Content-Type:text/html" \
       -h "Cache-Control:public, max-age=3600" \
       cp index.html gs://${BUCKET_NAME}/

# Set CORS if needed (for the CDN script)
cat > cors.json << EOF
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
EOF

gsutil cors set cors.json gs://${BUCKET_NAME}
rm cors.json

echo "✅ Deployment complete!"
echo "🌐 Your game is available at:"
echo "   https://storage.googleapis.com/${BUCKET_NAME}/index.html"
echo ""
echo "Optional: Set up a custom domain using Cloud Load Balancing"
echo "         or use Firebase Hosting for a nicer URL"
