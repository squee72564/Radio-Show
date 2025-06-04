FROM savonet/liquidsoap:v2.3.3

USER root

RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=liquidsoap:liquidsoap check_user.sh /app/check_user.sh
COPY --chown=liquidsoap:liquidsoap script.liq /app/script.liq

WORKDIR /app

USER liquidsoap
