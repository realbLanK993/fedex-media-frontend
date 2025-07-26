"use client";

import { NewsletterPeople } from "@/lib/types/newsletter";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { createPerson, getPeopleData } from "@/app/api-service";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Filter, User } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";

const CreateNewPeople = ({
  create,
}: {
  create: (data: NewsletterPeople) => void;
}) => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name == "") {
      toast.error("Name is empty");
      return;
    }
    if (email == "") {
      toast.error("Email is empty");
      return;
    }
    if (designation == "") {
      toast.error("Designation is empty");
      return;
    }
    const newPeople: NewsletterPeople = {
      id: new Date().getTime(),
      name,
      designation,
      email,
    };
    createPerson({
      name: newPeople.name,
      designation: newPeople.designation,
      email: newPeople.email,
    })
      .then(async (res) => {
        if (res.ok) {
          const data = (await res.json()) as NewsletterPeople;
          create(data);

          toast("Created new person");
        } else {
          toast("Error creating new person");
        }
      })
      .catch((err) => {
        toast("Error creating new person");
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-0 text-base" variant={"link"}>
          create one
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="sticky border-b flex justify-between p-4">
          <DialogTitle>Create Person</DialogTitle>
        </DialogHeader>

        <div className="max-h-[600px] px-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Enter name"
                id="name"
                name="name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter email"
                id="email"
                name="email"
                type="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                onChange={(e) => setDesignation(e.target.value)}
                value={designation}
                placeholder="Enter designation"
                id="designation"
                name="designation"
              />
            </div>
            <DialogFooter className="p-4">
              <DialogClose asChild>
                <Button type="submit">Create</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function NewsletterPeopleBtn({
  set,
}: {
  set: (data: NewsletterPeople[]) => void;
}) {
  const [people, setPeople] = useState<NewsletterPeople[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<NewsletterPeople[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<NewsletterPeople[]>([]);

  const disableInput = people.length < 1;
  const handleSelect = (id: number) => {
    if (!people) {
      console.error("People array does not exist");
      return;
    }
    const selected = selectedPeople.find((e) => e.id == id);
    if (selected) {
      setSelectedPeople((prev) => prev.filter((e) => e.id !== id));
    } else {
      const currentSelect = people.find((e) => e.id == id);
      if (currentSelect) {
        console.log("selecting");

        setSelectedPeople((prev) => [...prev, currentSelect]);
      }
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(selectedPeople, "people");

    set(selectedPeople);
  };
  const handleSearch = (search: string) => {
    if (search == "") {
      setFilteredPeople(people);
    }
    if (people && search != "") {
      const filtered = people.filter((p) => {
        if (
          p.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          p.designation
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          p.email.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        ) {
          return p;
        }
      });
      setFilteredPeople(filtered);
    }
  };
  useEffect(() => {
    startTransition(async () => {
      await getPeopleData()
        .then((data) => {
          setPeople(data);
          setFilteredPeople(data);
        })
        .catch((err) => {
          toast.error("Error fetching people's data");
        });
    });
  }, []);
  const createNewPeople = (data: NewsletterPeople) => {
    console.log("create", people);
    setFilteredPeople((prev) => [...prev, { ...data }]);
    setPeople((prev) => [...prev, { ...data }]);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>People</Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="sticky border-b flex justify-between p-4">
          <DialogTitle>Manage People</DialogTitle>
          <DialogClose></DialogClose>
        </DialogHeader>
        <p className="px-4">
          Select existing person or <CreateNewPeople create={createNewPeople} />
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-4">
          <Label htmlFor="people">People</Label>
          <Input
            disabled={disableInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search"
          />
          {isPending ? (
            <ScrollArea className="h-[300px]">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[100px] w-full"></Skeleton>
                <Skeleton className="h-[100px] w-full"></Skeleton>
                <Skeleton className="h-[100px] w-full"></Skeleton>
                <Skeleton className="h-[100px] w-full"></Skeleton>
              </div>
            </ScrollArea>
          ) : error ? (
            <div>{error.message}</div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center w-full">
                <div className="flex justify-start items-center">
                  {selectedPeople.map((e, i) => {
                    return (
                      i < 15 && (
                        <HoverCard key={`selected-people-${e.id}`}>
                          <HoverCardTrigger asChild>
                            <div
                              className={`flex rounded-full bg-background cursor-default justify-center items-center border w-10 h-10 ${
                                i !== 0 && "-ml-5"
                              }`}
                            >
                              {e.name[0]}
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent asChild>
                            <div className="px-4 w-fit">
                              <div className="flex flex-col">
                                <span className="text-sm text-primary">
                                  {e.designation}
                                </span>
                                <span className="text-xl font-light">
                                  {e.name}
                                </span>
                              </div>
                              <span className="text-gray-400">{e.email}</span>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )
                    );
                  })}
                  {selectedPeople.length > 15 && (
                    <span className="ml-2 text-primary">15 +</span>
                  )}
                </div>

                {selectedPeople.length > 0 && (
                  <Button
                    className="rounded-full w-10 h-10"
                    variant={"link"}
                    onClick={() => setSelectedPeople([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[300px]">
                <ul className="flex flex-col gap-2">
                  {people.length > 0 ? (
                    filteredPeople.length > 0 ? (
                      filteredPeople.map((person) => (
                        <li key={`person-btn-${person.id}`} className="border">
                          <button
                            type="button"
                            onClick={() => handleSelect(person.id)}
                            data-select={
                              selectedPeople.find((e) => e.id == person.id)
                                ? true
                                : false
                            }
                            className="w-full p-4 text-left flex flex-col gap-4 transition-colors duration-200 data-[select=true]:bg-accent data-[select=true]:ring-primary data-[select=true]:ring-1 hover:bg-accent "
                          >
                            <div className="flex flex-col">
                              <span className="text-sm text-primary">
                                {person.designation}
                              </span>
                              <span className="text-xl font-light">
                                {person.name}
                              </span>
                            </div>
                            <span className="text-gray-400">
                              {person.email}
                            </span>
                          </button>
                        </li>
                      ))
                    ) : (
                      <EmptyState
                        icon={Filter}
                        title="Adjust your filter"
                        description="Your current filter settings are applied. Modify
                                them to see different articles."
                      />
                    )
                  ) : (
                    <EmptyState
                      icon={User}
                      title="No person created"
                      description="Create a person to see them listed here"
                    />
                  )}
                </ul>
              </ScrollArea>
            </div>
          )}
          <DialogFooter className="p-4">
            <DialogClose asChild>
              <Button disabled={selectedPeople.length < 1} type="submit">
                Select
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
