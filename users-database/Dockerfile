FROM postgres:15.1-alpine

VOLUME [ "/data" ]

ENV POSTGRES_DB ff-users
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD admin

# Add healthcheck
# HEALTHCHECK CMD curl --fail http://localhost:5432/ || exit 1
