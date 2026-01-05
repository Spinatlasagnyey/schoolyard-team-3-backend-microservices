import { Request, Response } from "express";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

//import { storeDesignSchema } from "./validation/storeDesignSchema";
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({adapter})

export async function index(req: Request, res: Response) {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { id: "asc" },
    });

    return res.json(assets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function show(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    return res.json(asset);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function store(req: Request, res: Response) {
  try {
    const { label, width, height } = req.body;
    const file = req.file;

    if (!label || !width || !height || !file) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    const slug = label.toLowerCase().replace(/\s+/g, "_");

    const asset = await prisma.asset.create({
      data: {
        label,
        slug,
        width: Number(width),
        height: Number(height),
        image_url: `/storage/assets/${file.filename}`,
        is_available: true,
      },
    });

    return res.status(201).json(asset);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
import fs from "fs";
import path from "path";

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const asset = await prisma.asset.findUnique({ where: { id } });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    const data: any = {};
    const { label, width, height, is_available } = req.body;

    if (label) {
      data.label = label;
      data.slug = label.toLowerCase().replace(/\s+/g, "_");
    }

    if (width !== undefined) data.width = Number(width);
    if (height !== undefined) data.height = Number(height);
    if (is_available !== undefined) data.is_available = Boolean(is_available);

    if (req.file) {
      // delete old image
      const oldPath = path.join(
        "public",
        asset.image_url.replace("/storage/", "")
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      data.image_url = `/storage/assets/${req.file.filename}`;
    }

    const updated = await prisma.asset.update({
      where: { id },
      data,
    });

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function destroy(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const asset = await prisma.asset.findUnique({ where: { id } });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    const filePath = path.join(
      "public",
      asset.image_url.replace("/storage/", "")
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.asset.delete({ where: { id } });

    return res.json({ message: "Asset deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}