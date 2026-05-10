# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy source code
COPY . .

# Build NestJS app
RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# If you use Prisma/migrations/static files, copy them too:
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/public ./public

EXPOSE 9000

CMD ["npm", "run", "start:prod"]