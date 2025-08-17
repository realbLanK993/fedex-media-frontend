import { Article } from "@/lib/types/article";
import { NewsletterGroups, NewsletterPeople } from "@/lib/types/newsletter";
import { Hono } from "hono";

const API_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_RAG_API_URL is not set in environment variables."
  );
}

const articles = new Hono();

const getArticles: () => Promise<Article[] | undefined> = async () => {
  try {
    const res = await fetch(API_BASE_URL + "/articles");
    if (!res.ok) {
      throw new Error("Failed to fetch articles");
    } else {
      return await res.json();
    }
  } catch (err) {
    console.error(`Error fetching articles\n`, err);
  }
};

export const getPeopleData: (
  fail?: boolean
) => Promise<NewsletterPeople[]> = async () => {
  const response = await fetch(API_BASE_URL + "/people");
  return (await response.json()) as NewsletterPeople[];
};
export const getGroupData: (
  fail?: boolean
) => Promise<NewsletterGroups[]> = async () => {
  const response = await fetch(API_BASE_URL + "/email_groups");
  return (await response.json()) as NewsletterGroups[];
};

export const createPerson: (
  data: Omit<NewsletterPeople, "id">
) => Promise<Response> = async (data) => {
  return await fetch(API_BASE_URL + "/people", {
    method: "POST",
    body: JSON.stringify({ ...data }),
    headers: {
      "Content-Type": "Application/JSON",
    },
  });
};

export const createGroup: (
  data: Omit<NewsletterGroups, "id">
) => Promise<Response> = async (data) => {
  return await fetch(API_BASE_URL + "/email_groups", {
    method: "POST",
    body: JSON.stringify({ ...data }),
    headers: {
      "Content-Type": "Application/JSON",
    },
  });
};

export const sendEmail: (data: {
  group_ids: number[];
  person_ids: number[];
}) => Promise<Response> = async (data) => {
  return await fetch(API_BASE_URL + "/newsletter/email", {
    method: "POST",
    body: JSON.stringify({ ...data }),
    headers: {
      "Content-Type": "Application/JSON",
    },
  });
};

articles.get("/articles", async (c) => {
  const res = await getArticles();
  if (res) {
    return c.json([...res]);
  }
  return c.text("Something went wrong when fetching articles");
});

articles.post("/newsletter/email", async (c) => {
  const data: {
    group_ids: number[];
    person_ids: number[];
  } = await c.req.json();
  const res = await sendEmail(data);
  if (res.ok) {
    return c.text("Email successfully sent");
  }
  return c.text("Something went wrong when sending emails", 500);
});

articles
  .get("/email_groups", async (c) => {
    const res = await getGroupData();
    if (res) {
      return c.json([...res]);
    }
    return c.text("Something when getting group data");
  })
  .post(async (c) => {
    const data: Omit<NewsletterGroups, "id"> = await c.req.json();
    const res = await createGroup(data);
    if (res.ok) {
      const d = await res.json();
      console.log("d", d);

      return c.json({ ...d });
    }
    return c.text(`Something went wrong when creating group ${data.name}`);
  });

articles
  .get("/people", async (c) => {
    const res = await getPeopleData();
    if (res) {
      return c.json([...res]);
    }
    return c.text("Something when getting people data");
  })
  .post(async (c) => {
    const data: Omit<NewsletterPeople, "id"> = await c.req.json();
    const res = await createPerson(data);
    if (res.ok) {
      return c.json({ ...(await res.json()) });
    }
    return c.text(`Something went wrong when creating person ${data.name}`);
  });

export default articles;
