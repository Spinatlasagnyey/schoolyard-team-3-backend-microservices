import { Request, Response } from "express";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

//import { storeDesignSchema } from "./validation/storeDesignSchema";
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({adapter})

export async function store(req: Request, res: Response) {
    try {
    //const data = storeDesignSchema.parse(req.body);
    const data = req.body

    const design = await prisma.design.create({
      data: {
        rows: data.rows,
        cols: data.cols,
        backgroundImage: data.backgroundImage ?? null,

        class: data.class ?? null,
        studentName: data.student_name ?? null,
      },
    });
    const gridCellOperations = data.placedAssets.map((asset: any) =>
         prisma.gridCell.upsert({
            where: {
            designId_x_y: {
                designId: design.id,
                x: asset.col,
                y: asset.row,
            },
            },
            update: {
            rotation: asset.rotation,
            assetId: asset.asset?.id ?? null,
            },
            create: {
            designId: design.id,
            x: asset.col,
            y: asset.row,
            rotation: asset.rotation,
            assetId: asset.asset?.id ?? null,
            },
        })
    );

    await prisma.$transaction(gridCellOperations);

    return res.status(201).json({
      success: true,
      id: design.id,
      design,
    });
  } catch (error: any) {
    // if (error.name === "ZodError") {
    //   return res.status(422).json({
    //     success: false,
    //     errors: error.errors,
    //   });
    // }

    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
export async function index(req: Request, res: Response) {
  try {
    const designs = await prisma.design.findMany({
      orderBy: { id: "desc" },
      include: {
        GridCell: true,
      },
    });

    return res.json(designs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function show(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const design = await prisma.design.findUnique({
      where: { id },
      include: {
        GridCell: true,
      },
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    return res.json(design);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function storeFeedback(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const  text  = req.body.feedback;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const design = await prisma.design.findUnique({
      where: { id },
    });

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    const updated = await prisma.design.update({
      where: { id },
      data: {
        feedback: text ?? null,
      },
    });

    return res.json({
      message: "Feedback saved",
      feedback: updated.feedback,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}