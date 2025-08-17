import { z } from "zod";

export const ArticleSchema = z.object({
  quarter: z.string(),
  company: z.string(),
  country: z.string(),
  date: z.string(),
  image: z.string().optional(),
  headline: z.string(),
  hyperlink: z.string(),
  outlet: z.string(),
  media_type: z.string(),
  headline_name_included: z.boolean(),
  sentiment: z.union([
    z.literal("Positive"),
    z.literal("Negative"),
    z.literal("Neutral"),
    z.string(),
  ]),
  financial_performance: z.union([z.literal(0), z.literal(1)]),
  innovation: z.union([z.literal(0), z.literal(1)]),
  regulatory: z.union([z.literal(0), z.literal(1)]),
  environment_responsibility: z.union([z.literal(0), z.literal(1)]),
  social_responsibility: z.union([z.literal(0), z.literal(1)]),
  community_responsibility: z.union([z.literal(0), z.literal(1)]),
  e_commerce: z.union([z.literal(0), z.literal(1)]),
  summary: z.string(),
  source: z.string(),
  keyword: z.string(),
  relevancy_score: z.number(),
  // New fields
  text: z.string(),
  AMEA_Leader: z.string().nullable().optional(),
  AMEA_Executive: z.string().nullable().optional(),
  Local_Leaders: z.string().nullable().optional(),
});

export const FormDataSchema = z.object({
  search: z.string(),
  start: z.date().optional(),
  end: z.date().optional(),
  country: z.string(),
  sentiment: z.string(),
  financialPerformance: z.boolean(),
  innovation: z.boolean(),
  regulatory: z.boolean(),
  environmentResponsibility: z.boolean(),
  socialResponsibility: z.boolean(),
  communityResponsibility: z.boolean(),
  eCommerce: z.boolean(),
});

export const FilterStateSchema = z.object({
  filters: FormDataSchema,
  data: z.array(ArticleSchema),
  clearFilters: z.function().args().returns(z.void()),
  addFilter: z.function().args(FormDataSchema).returns(z.void()),
  changeFilters: z.function().args(FormDataSchema).returns(z.void()),
  filterEnabled: z.boolean(),
  enableFilter: z.function().args(z.boolean()).returns(z.void()),
});
export type Article = z.infer<typeof ArticleSchema>;
export type FormData = z.infer<typeof FormDataSchema>;

export type FilterState = {
  filters: FormData;
  data: Article[] | null;
  setData: (data: Article[]) => void;
  setFilteredData: (data: Article[]) => void;
  filteredData: Article[] | null;
  clearFilters: () => void;
  addFilter: (filters: FormData) => void;
  changeFilters: (filters: FormData) => void;
  filterEnabled: boolean;
  enableFilter: (e: boolean) => void;
};
