FROM maven:3.9.9-eclipse-temurin-17 AS build

ARG SERVICE

# backend
COPY pom.xml /

# auth service
COPY auth-service/ /auth-service/

# database
COPY database/ /database/

# make backend pom.xml happy
COPY database-service/ /database-service/

RUN mvn install -DskipTests

RUN mvn -pl ${SERVICE} package -DskipTests

FROM icr.io/appcafe/open-liberty:kernel-slim-java17-openj9-ubi

ARG VERSION=1.0
ARG REVISION=SNAPSHOT
ARG SERVICE

COPY --chown=1001:0 --from=build /${SERVICE}/src/main/liberty/config /config/

RUN features.sh

COPY --chown=1001:0 --from=build /${SERVICE}/target/*.war /config/apps

USER root
RUN mkdir /usr/share/checkmate
RUN chown 1001:0 /usr/share/checkmate
RUN mkdir -p /etc/checkmate/ssl/certs
RUN chown 1001:0 /etc/checkmate/ssl/certs
USER 1001:0

RUN configure.sh