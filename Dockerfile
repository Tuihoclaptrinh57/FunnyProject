# SmartTobi Multi-stage Dockerfile (backend + web)
# Stage 1: backend build (skip if no pom yet)
FROM eclipse-temurin:25-jdk AS backend-build
WORKDIR /build
COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src
RUN if [ -f "backend/pom.xml" ]; then cd backend && ./mvnw -B package -DskipTests || mvn -B package -DskipTests; else echo "no backend pom, skip"; mkdir -p /build/backend/target; fi

# Stage 2: web build
FROM node:20-alpine AS web-build
WORKDIR /build
COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci --ignore-scripts || npm install || echo "no web package, skip"
COPY apps/web ./apps/web
RUN if [ -f "apps/web/package.json" ]; then npm run build --workspace=apps/web 2>/dev/null || (cd apps/web && npm run build) || echo "web build skip"; else echo "no web"; fi

# Stage 3: runtime
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=backend-build /build/backend/target/*.jar app.jar 2>/dev/null || echo "no jar yet"
COPY --from=web-build /build/apps/web/.next ./web/.next 2>/dev/null || echo "no web build yet"
EXPOSE 8080 3000
CMD ["java","-jar","app.jar"]
