import { getArticles } from "@/app/api-service";
import { FilterState, FormData } from "@/lib/types/article";
import { create } from "zustand";

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
const d = await getArticles();
export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultValues,
  data: d,
  addFilter: (filter) =>
    set((state) => ({
      data: d
        //Country
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
        //Search
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
        //Sentiment
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
        //Start Date
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
        //End Date
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
        })
        //Attributes
        .filter((article) => {
          if (filter.financialPerformance) {
            return article.financial_performance;
          } else {
            return article;
          }
        })
        .filter((article) => {
          if (filter.innovation) {
            return article.innovation;
          } else {
            return article;
          }
        })
        .filter((article) => {
          if (filter.regulatory) {
            return article.regulatory;
          } else {
            return article;
          }
        })
        .filter((article) => {
          if (filter.environmentResponsibility) {
            return article.environment_responsibility;
          } else {
            return article;
          }
        })
        .filter((article) => {
          if (filter.socialResponsibility) {
            return article.social_responsibility;
          } else {
            return article;
          }
        })
        .filter((article) => {
          if (filter.communityResponsibility) {
            return article.community_responsibility;
          } else {
            return article;
          }
        }),
    })),
  clearFilters: () => set(() => ({ data: d, filterEnabled: false })),
  changeFilters: (filters: FormData) => set(() => ({ filters })),
  filterEnabled: false,
  enableFilter: (e: boolean) => set(() => ({ filterEnabled: e })),
}));
