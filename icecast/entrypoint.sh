#!/bin/bash
set -e

# Default to localhost dev origin if not provided
: "${ICECAST_CORS_ORIGIN:=http://localhost:3000}"

# Render the config file to a writable path
envsubst < /etc/icecast2/icecast_template.xml > /tmp/icecast.xml

# Run icecast with that config file
exec icecast2 -c /tmp/icecast.xml
