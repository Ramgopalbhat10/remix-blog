import { PrismaClient } from "@prisma/client";
import { Redis } from "@upstash/redis";

let prisma: PrismaClient;
let redis: Redis;

declare global {
  var __db__: PrismaClient;
  var __redis__: Redis;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  redis = Redis.fromEnv();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  if (!global.__redis__) {
    global.__redis__ = Redis.fromEnv();
  }
  prisma = global.__db__;
  prisma.$connect();
  redis = global.__redis__;
}

export { prisma, redis };
