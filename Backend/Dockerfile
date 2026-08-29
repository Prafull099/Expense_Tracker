# ── Stage 1: Build JAR using Maven ──
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ── Stage 2: Minimal Production JRE Runtime ──
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Security: Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy built jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose backend REST API port
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
