#!/bin/bash
set -e

# Render the config file to a writable path
envsubst < /etc/icecast2/icecast_template.xml > /tmp/icecast.xml

# Run icecast with that config file
exec icecast2 -c /tmp/icecast.xml