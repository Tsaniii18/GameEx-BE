FROM node:22-alpine
WORKDIR /app

# Buat folder cred dan simpan file JSON
RUN mkdir -p /app/cred
ARG KEY_CREDENTIALS_JSON
RUN echo "$KEY_CREDENTIALS_JSON" > /app/cred/a-07-451003-c0771c698570.json

# Verifikasi file (untuk debugging)
RUN ls -la /app/cred && \
    head -n 2 /app/cred/a-07-451003-c0771c698570.json  # Tampilkan sebagian isi

COPY . .
RUN npm install

EXPOSE 5000
CMD ["node", "index.js"]