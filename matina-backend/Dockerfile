# ---- build stage ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copy project files
COPY . .

# Build using Maven Wrapper if present
RUN chmod +x mvnw || true
RUN ./mvnw -q -DskipTests package || mvn -q -DskipTests package

# ---- run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy built JAR
COPY --from=build /app/target/*.jar app.jar

# Runtime tuning
ENV PORT=8080
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75"

# Make Spring respect Render's PORT
ENV SPRING_APPLICATION_JSON='{"server":{"port":"'"$PORT"'"}}'

EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
