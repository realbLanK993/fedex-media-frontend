import { sampleArticles } from "@/lib/dummy-data";
import { Article, FormData } from "@/lib/types/article";
import { create } from "zustand";

interface FilterState {
  filters: FormData;
  data: Article[];
  clearFilters: () => void;
  addFilter: (filter: FormData) => void;
  changeFilters: (filters: FormData) => void;
  filterEnabled: boolean;
  enableFilter: (e: boolean) => void;
}

const defaultValues = {
  search: "",
  start: undefined,
  end: undefined,
  country: "all",
  sentiment: "all",
  financialPerformance: false,
  innovation: false,
  regulatory: false,
  environmentResponsibility: false,
  socialResponsibility: false,
  communityResponsibility: false,
  eCommerce: false,
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultValues,
  data: sampleArticles,
  addFilter: (filter) =>
    set((state) => ({
      data: sampleArticles
        .filter((article) => {
          if (filter.country == "all") {
            return article;
          } else {
            if (
              filter.country.toLocaleLowerCase() ==
              article.country.toLocaleLowerCase()
            ) {
              return article;
            }
          }
        })
        .filter((article) => {
          if (filter.search == "") {
            return article;
          }
          if (
            article.headline
              .toLocaleLowerCase()
              .includes(filter.search.toLocaleLowerCase()) ||
            article.company
              .toLocaleLowerCase()
              .includes(filter.search.toLocaleLowerCase()) ||
            article.keyword
              .toLocaleLowerCase()
              .includes(filter.search.toLocaleLowerCase()) ||
            article.summary
              .toLocaleLowerCase()
              .includes(filter.search.toLocaleLowerCase())
          ) {
            return article;
          }
        })
        .filter((article) => {
          if (filter.sentiment == "all") {
            return article;
          } else {
            if (
              article.sentiment.toLocaleLowerCase() ==
              filter.sentiment.toLocaleLowerCase()
            ) {
              return article;
            }
          }
        })
        .filter((article) => {
          if (!filter.start) {
            return article;
          } else {
            try {
              if (new Date(article.date) > filter.start) {
                return article;
              }
            } catch (err) {
              console.log("Error in filtering start date: ", err);
            }
          }
        })
        .filter((article) => {
          if (!filter.end) {
            return article;
          } else {
            try {
              if (new Date(article.date) < filter.end) {
                return article;
              }
            } catch (err) {
              console.log("Error in filtering start date: ", err);
            }
          }
        }),
    })),
  clearFilters: () =>
    set(() => ({ data: sampleArticles, filterEnabled: false })),
  changeFilters: (filters: FormData) => set(() => ({ filters })),
  filterEnabled: false,
  enableFilter: (e: boolean) => set(() => ({ filterEnabled: e })),
}));
