import 'dotenv/config'

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";
import express, { Router } from 'express'
import { index, show, store, storeFeedback } from '../controllers/DesignController'
const router: Router = express.Router()
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({adapter})

router.post('/', store);
router.get('/', index);
router.get('/:id', show);
router.post('/:id/feedback', storeFeedback);

export default router