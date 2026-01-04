-- CreateTable
CREATE TABLE "Design" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rows" INTEGER NOT NULL,
    "cols" INTEGER NOT NULL,
    "background_image" TEXT,
    "student_name" TEXT,
    "class" TEXT,
    "feedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GridCell" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "rotation" INTEGER NOT NULL,
    "assetId" INTEGER,
    "designId" INTEGER,
    CONSTRAINT "GridCell_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GridCell_designId_x_y_key" ON "GridCell"("designId", "x", "y");
