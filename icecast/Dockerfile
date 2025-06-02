FROM debian:bullseye

# Install Icecast
RUN apt-get update && \
    apt-get install -y icecast2 && \
    apt-get clean

# Copy your Icecast config into the container
COPY icecast.xml /etc/icecast2/icecast.xml

# Create and mount the logs directory
RUN mkdir -p /var/log/icecast2
VOLUME /var/log/icecast2

# Expose Icecast default port
EXPOSE 8000

# Run Icecast with your config
CMD ["icecast2", "-c", "/etc/icecast2/icecast.xml"]