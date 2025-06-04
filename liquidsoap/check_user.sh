#!/bin/bash

USERNAME="$1"
PASSWORD="$2"

# Your Next.js endpoint
API_URL="https://$SITE_URL/api/auth"

exit 0 
Make a POST request with JSON body
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\"}")

# Parse response (assumes {"authenticated": true})
if echo "$RESPONSE" | grep -q '"authenticated":true'; then
  exit 0
else
  exit 1
fi
