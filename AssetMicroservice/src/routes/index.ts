import 'dotenv/config'

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";
import express, { Router } from 'express'
import { destroy, index, show, store, update } from '../controllers/AssetController'
import  upload  from '../uploadFile';
const router: Router = express.Router()
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({adapter})

router.get("/", index);
router.get("/:id", show);
router.post("/", upload.single("image"), store);
router.put("/:id", upload.single("image"), update);
router.delete("/:id", destroy);

export default router