# Root Dockerfile for Render (Docker runtime) — builds the backend API
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .
EXPOSE 5000
CMD ["npm", "start"]
