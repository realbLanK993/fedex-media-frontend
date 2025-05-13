import { NextResponse } from "next/server"
import type { Article } from "@/lib/types"

// This would be replaced with actual data fetching logic
const articles: Article[] = [
  {
    url: "https://www.ndtv.com/india-news/aviation-ministry-gives-in-principle-nod-for-airports-in-rajasthan-odisha-8338794",
    title: "Aviation Ministry Gives In-Principle Nod For Airports In Rajasthan, Odisha",
    summary:
      "New Delhi: The civil aviation ministry on Monday granted in-principle approval for greenfield airports in Rajasthan's Kota and Puri in Odisha.",
    keywords: [
      "nod",
      "rajasthan",
      "aviation",
      "ministry",
      "airports",
      "in-principle",
      "odisha",
      "civil",
      "kota",
      "approval",
      "puri",
      "granted",
      "greenfield",
    ],
    publish_date: "2025-05-05 23:55:46+05:30",
    text: 'New Delhi:\n\nThe civil aviation ministry on Monday granted in-principle approval for greenfield airports in Rajasthan\'s Kota and Puri in Odisha.\n\nKota is the parliamentary constituency of Lok Sabha Speaker Om Birla.\n\n"His continued engagement with the Ministry of Civil Aviation has been one of the driving forces to expediting this approval.\n\n"The proposed airport will not only serve Kota city, known as a major educational and industrial hub, but will also cater to the growing population and economic activity in the Hadoti region," the ministry said in a release.\n\nAccording to the ministry, the decision to establish an airport in Puri will provide a major boost to religious tourism, regional development and the overall connectivity in the region.\n\nCivil Aviation Minister K Rammohan Naidu has granted the in-principle approval for the establishment of greenfield airports in Kota and Puri, the release said.\n\nIndia is one of the world\'s fastest-growing civil aviation markets and has more than 150 operational airports.',
    source: "ndtv",
    keyword: "aviation",
    relevancy_score: 0.8490566037735848,
    focus: "Business",
    sentiment: "Neutral",
    page_position: "Main",
    section_position: "Top",
    products_services: false,
    amea_apac_president_positioning: false,
    amea_apac_executive_present: false,
    local_leader_present: true,
    financial_performance: false,
    innovation: false,
    global_leadership: false,
    executive_leadership: true,
    regulatory: true,
    business_leadership: true,
    contributes_to_community: false,
    environmentally_responsible: false,
    socially_responsible: false,
    cares_about_markets_social_needs: false,
    sam: false,
    ecommerce: false,
    asia_eu_intra_amea: false,
  },
  // More articles would be here in a real implementation
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Get filter parameters
  const search = searchParams.get("search")
  const focus = searchParams.get("focus")
  const sentiment = searchParams.get("sentiment")

  // Apply filters
  let filteredArticles = [...articles]

  if (search) {
    const searchLower = search.toLowerCase()
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.text.toLowerCase().includes(searchLower) ||
        article.keywords.some((keyword) => keyword.toLowerCase().includes(searchLower)),
    )
  }

  if (focus) {
    filteredArticles = filteredArticles.filter((article) => article.focus === focus)
  }

  if (sentiment) {
    filteredArticles = filteredArticles.filter((article) => article.sentiment === sentiment)
  }

  // Get boolean filters
  const booleanFilters = [
    "products_services",
    "amea_apac_president_positioning",
    "amea_apac_executive_present",
    "local_leader_present",
    "financial_performance",
    "innovation",
    "global_leadership",
    "executive_leadership",
    "regulatory",
    "business_leadership",
    "contributes_to_community",
    "environmentally_responsible",
    "socially_responsible",
    "cares_about_markets_social_needs",
    "sam",
    "ecommerce",
    "asia_eu_intra_amea",
  ]

  // Apply boolean filters
  booleanFilters.forEach((filter) => {
    const value = searchParams.get(filter)
    if (value === "true") {
      filteredArticles = filteredArticles.filter((article) => article[filter as keyof Article] === true)
    }
  })

  return NextResponse.json(filteredArticles)
}
