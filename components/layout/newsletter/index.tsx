"use client";
import { Button } from "@/components/ui/button";
import NewsletterGroupBtn from "./group";
import { useState } from "react";
import { NewsletterGroups, NewsletterPeople } from "@/lib/types/newsletter";
import NewsletterPeopleBtn from "./people";
import { sendEmail } from "@/app/api-service";
import { toast } from "sonner";

export default function NewsletterNavbar() {
  const [selectedGroups, setSelectedGroups] = useState<NewsletterGroups[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<NewsletterPeople[]>([]);
  const [loading, setLoading] = useState(false);
  const handleGroupSelection = (data: NewsletterGroups[]) => {
    console.log(data, "GROUP");

    setSelectedGroups([...data]);
  };
  const handlePeopleSelection = (data: NewsletterPeople[]) => {
    console.log(data, "PEOPLE");
    setSelectedPeople([...data]);
  };

  const handleSendMail = () => {
    const finalData = {
      group_ids: selectedGroups.map((e) => e.id),
      person_ids: selectedPeople.map((e) => e.id),
    };
    setLoading(true);
    sendEmail(finalData)
      .then((res) => {
        if (res.ok) {
          toast("Sent Emails Successfully");
        } else {
          toast("Error sending emails");
        }
      })
      .catch((err) => {
        toast("Server error while sending emails");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <header className=" p-4 flex justify-between gap-2 ">
      <div className="flex gap-2">
        <NewsletterGroupBtn set={handleGroupSelection} />
        <NewsletterPeopleBtn set={handlePeopleSelection} />
      </div>
      <Button disabled={loading} onClick={handleSendMail}>
        {loading ? "Sending..." : "Send"}
      </Button>
    </header>
  );
}
