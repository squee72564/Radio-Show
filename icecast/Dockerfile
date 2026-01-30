FROM debian:bullseye

# Install Icecast and envsubst (via gettext package)
RUN apt-get update && \
    apt-get install -y icecast2 gettext media-types && \
    apt-get clean

# Copy Icecast config template
COPY icecast_template.xml /etc/icecast2/icecast_template.xml

# Copy entrypoint script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# Create log directory and make it writable for the runtime user
RUN mkdir -p /var/log/icecast2 && chown -R icecast2 /var/log/icecast2

# Expose default Icecast port
EXPOSE 8000
