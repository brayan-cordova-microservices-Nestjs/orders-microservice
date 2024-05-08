# Orders Microservice

Initializes Prisma `npx prisma init`
Migrate Prisma `npx prisma migrate dev --name init`
Run prisma migration with the command `npx prisma migrate dev` and if you want to add a column type `npx prisma migrate dev --name (name it)`

## Develop Mode

1. Clone repository
2. Install dependencies with the command `npm install` or `npm i` on your terminal
3. Create an `.env` file based on `.env.template`
4. Docker database up `docker-compose up -d`
5. Docker database down `docker-compose down`
6. Then execute the command `npm run start:dev` on your terminal to run the server in development mode
7. This Orders Microservice is running on port `3002`
