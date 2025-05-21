# Dockerfile.dev (NestJS em modo dev)
FROM node:20-alpine

WORKDIR /app

# 1. Copia manifestos e instala deps exatamente como no lockfile
COPY package.json package-lock.json tsconfig*.json ./
RUN npm ci

# 2. Copia todo o código-fonte
COPY . .

# 3. Exponha a porta padrão do Nest em dev (3000)
EXPOSE 3001

# 4. Inicia em modo watch
CMD ["npm", "run", "start:dev"]