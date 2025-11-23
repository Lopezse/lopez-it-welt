# 🐳 Lopez IT Welt - Dockerfile
# Multi-Stage Build für optimierte Images

# ========================================
# 🏗️ BUILD STAGE
# ========================================
FROM node:18-alpine AS builder

# 🏷️ Labels für Security und Wartung
LABEL maintainer="Lopez IT Welt Team"
LABEL description="Lopez IT Welt Enterprise++ Application"
LABEL version="1.0.0"

# 🔐 Security: Non-root User erstellen
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001

# 📦 Arbeitsverzeichnis setzen
WORKDIR /app

# 🔐 Security: Package-Lock kopieren für deterministische Builds
COPY package*.json ./

# 📦 Dependencies installieren
RUN npm ci --only=production && npm cache clean --force

# 📁 Source Code kopieren
COPY . .

# 🏗️ Application bauen
RUN npm run build

# ========================================
# 🚀 PRODUCTION STAGE
# ========================================
FROM node:18-alpine AS runner

# 🔐 Security: Non-root User erstellen
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001

# 📦 Arbeitsverzeichnis setzen
WORKDIR /app

# 🔐 Security: Environment-Variablen setzen
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 📦 Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 🔐 Security: Berechtigungen setzen
RUN chown -R nextjs:nodejs /app

# 👤 User wechseln
USER nextjs

# 🌐 Port exponieren
EXPOSE 3000

# 🔐 Security: Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 🚀 Application starten
CMD ["node", "server.js"]

# ========================================
# 📋 METADATA
# ========================================
# Build-Argumente für verschiedene Umgebungen
ARG BUILD_ENV=production
ARG BUILD_VERSION=1.0.0

# Labels für Container-Management
LABEL org.opencontainers.image.title="Lopez IT Welt"
LABEL org.opencontainers.image.description="Enterprise++ Application"
LABEL org.opencontainers.image.version="${BUILD_VERSION}"
LABEL org.opencontainers.image.vendor="Lopez IT Welt"
LABEL org.opencontainers.image.source="https://github.com/lopez-it-welt"
LABEL org.opencontainers.image.licenses="MIT"

# 🔐 Security: Scan-Informationen
LABEL security.scan="true"
LABEL security.vulnerability.scan="true"
LABEL security.compliance="DSGVO,ISO27001,GDPR" 