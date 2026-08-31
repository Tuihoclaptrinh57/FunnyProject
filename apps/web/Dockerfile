FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps --ignore-scripts || npm install --legacy-peer-deps --ignore-scripts
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public 2>/dev/null || true
COPY --from=build /app/next.config.js ./next.config.js
EXPOSE 3000
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
CMD ["npm","run","start","--","--port","3000","--hostname","0.0.0.0"]
