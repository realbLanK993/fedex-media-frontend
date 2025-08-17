"use client";
import { Button } from "@/components/ui/button";
import NewsletterGroupBtn from "./group";
import { useState } from "react";
import { NewsletterGroups, NewsletterPeople } from "@/lib/types/newsletter";
import NewsletterPeopleBtn from "./people";
import { sendEmail } from "@/app/api-service";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function NewsletterNavbar() {
  const [selectedGroups, setSelectedGroups] = useState<NewsletterGroups[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<NewsletterPeople[]>([]);
  const [loading, setLoading] = useState(false);
  const handleGroupSelection = (data: NewsletterGroups[]) => {
    setSelectedGroups([...data]);
  };
  const handlePeopleSelection = (data: NewsletterPeople[]) => {
    setSelectedPeople([...data]);
  };

  const handleSendMail = () => {
    const finalData = {
      group_ids: selectedGroups.map((e) => e.id),
      person_ids: selectedPeople.map((e) => e.id),
    };
    setLoading(true);
    sendEmail(finalData)
      .then(async (res) => {
        if (res.ok) {
          toast.success(await res.text());
        } else {
          toast.error(await res.text());
        }
      })
      .catch(() => {
        toast.error("Server error while sending emails");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <header className="flex justify-between gap-2 ">
      <div className="flex gap-2">
        <NewsletterGroupBtn set={handleGroupSelection} />
        <NewsletterPeopleBtn set={handlePeopleSelection} />
      </div>
      <Button disabled={loading} onClick={handleSendMail}>
        {loading ? "Sending..." : "Send"} <Mail />
      </Button>
    </header>
  );
}
