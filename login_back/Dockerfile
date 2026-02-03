FROM gradle:8.10.2-jdk21 AS build
WORKDIR /app
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .
RUN ./gradlew dependencies --no-daemon || return 0
COPY src ./src
RUN ./gradlew build -x test --no-daemon

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]