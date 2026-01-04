// import { z } from "zod";

// export const storeDesignSchema = z.object({
//   rows: z.number().int().min(1),
//   cols: z.number().int().min(1),
//   backgroundImage: z.string().nullable().optional(),

//   class_id: z.number().int().nullable().optional(),
//   student_name: z.string().max(255).nullable().optional(),

//   placedAssets: z.array(
//     z.object({
//       instanceId: z.number().int(),
//       assetId: z.number().int(),
//       label: z.string(),
//       row: z.number().int().min(0),
//       col: z.number().int().min(0),
//       width: z.number().int().min(1),
//       height: z.number().int().min(1),
//       rotation: z.number().int(),
//     })
//   ),
// });