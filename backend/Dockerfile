FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/livehub
ENV SPRING_DATASOURCE_USERNAME=livehub
ENV SPRING_DATASOURCE_PASSWORD=livehub123
ENV SPRING_DATA_REDIS_HOST=redis
CMD ["java","-jar","app.jar"]
