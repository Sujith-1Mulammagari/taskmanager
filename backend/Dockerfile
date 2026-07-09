# ============================================================
# DOCKERFILE - Backend (Spring Boot)
# ============================================================
#
# A Dockerfile is a script of instructions to BUILD a Docker image
# 
# IMAGE vs CONTAINER:
#   Image   = a template/blueprint (like a class in Java)
#   Container = a running instance of an image (like an object)
#
# MULTI-STAGE BUILD - WHY?
#   Stage 1 (builder): compiles Java code → creates .jar file
#   Stage 2 (runtime): only takes the .jar, NOT the build tools
#   Result: final image is MUCH smaller (no Maven, no JDK source files)
# ============================================================

# ============================================================
# STAGE 1: BUILD STAGE
# ============================================================
# FROM: base image to start from
# maven:3.9-eclipse-temurin-17 = Maven 3.9 + Java 17 (Eclipse Temurin JDK)
FROM maven:3.9-eclipse-temurin-17 AS builder

# WORKDIR: sets the working directory inside the container
# All subsequent commands run from /app
WORKDIR /app

# COPY: copies files from host machine → container
# First, copy only pom.xml to cache Maven dependencies
# Docker caches each layer - if pom.xml didn't change, skip re-downloading deps
COPY pom.xml .

# Download all Maven dependencies (this layer gets cached)
RUN mvn dependency:go-offline -B

# Now copy the source code
COPY src ./src

# Build the application: compile + test + create .jar
# -DskipTests: skip tests for faster build (use -DskipTests=false in CI)
RUN mvn clean package -DskipTests

# ============================================================
# STAGE 2: RUNTIME STAGE
# ============================================================
# eclipse-temurin:17-jre = only JRE (Java Runtime), not full JDK
# JRE is smaller because it can't COMPILE code, only RUN it
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy ONLY the built .jar from Stage 1
# The wildcard *.jar matches the generated jar file
COPY --from=builder /app/target/*.jar app.jar

# EXPOSE: documents that the container listens on port 8080
# (This doesn't actually publish the port - that's done with -p flag)
EXPOSE 8080

# ENTRYPOINT: command to run when container starts
# This runs: java -jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
