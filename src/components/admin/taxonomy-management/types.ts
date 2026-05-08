export type TaxonomyStatus = "normal" | "hide" | (string & {});
export type TaxonomySortKey = "updatedAt.desc" | "name.asc" | "name.desc";

export type TaxonomyItem = {
  _id: string;
  name: string;
  description: string;
  status: TaxonomyStatus;
  updatedAt?: string;
  storiesCount?: number;
};

export type TaxonomyFormValue = {
  name: string;
  description: string;
};

export type TaxonomyConfig = {
  apiPath: string;
  createStatus?: string;
  emptyDescription: string;
  itemLabel: string;
  listDescription: string;
  listTitle: string;
  pageDescription: string;
  pageTitle: string;
  showStoriesCount?: boolean;
  updateMethod?: "patch" | "put";
};

export type TaxonomyApiResponse =
  | TaxonomyItem[]
  | {
      items?: TaxonomyItem[];
    };
