# Stage 1: Build stage (opsional, jika menggunakan multi-stage build)
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Jika ada build step (e.g., untuk TypeScript)

# Stage 2: Runtime image
FROM node:18-alpine
WORKDIR /app

# Install dependencies untuk runtime
COPY package*.json ./
RUN npm install --production

# Copy hasil build dari stage sebelumnya (jika ada)
COPY --from=builder /app/dist ./dist

# Buat direktori untuk menyimpan secret
RUN mkdir -p /app/secrets

# Gunakan build arg untuk menerima secret
ARG KEY_CREDENTIALS

# Simpan secret sebagai file (format JSON)
RUN echo "$KEY_CREDENTIALS" > /app/secrets/key_credentials.json

# Copy file aplikasi (jika tidak menggunakan builder)
COPY . .

# Expose port aplikasi
EXPOSE 5000

# Jalankan aplikasi
CMD ["node", "dist/index.js"]  # Sesuaikan dengan entry point aplikasi