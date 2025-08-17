"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { NewsletterGroups, NewsletterPeople } from "@/lib/types/newsletter";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, User, Users } from "lucide-react";
import { createGroup, getGroupData, getPeopleData } from "@/app/api-service";
import { toast } from "sonner";
import EmptyState from "@/components/ui/empty-state";

const CreateNewGroup = ({
  create,
}: {
  create: (data: NewsletterGroups) => void;
}) => {
  const [people, setPeople] = useState<NewsletterPeople[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<NewsletterPeople[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error] = useState<Error | null>(null);
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
        setSelectedPeople((prev) => [...prev, currentSelect]);
      }
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (groupName == "") {
      console.error("Group name is empty");
      return;
    }
    const newGroup: NewsletterGroups = {
      id: new Date().getTime(),
      name: groupName,
      person_ids: [...selectedPeople.map((e) => e.id)],
    };
    createGroup({ name: newGroup.name, person_ids: newGroup.person_ids })
      .then(async (res) => {
        if (res.ok) {
          toast.success("New group created");
          create((await res.json()) as NewsletterGroups);
        }
      })
      .catch(() => {
        toast.error("Error creating group");
      })
      .finally(() => {
        setSelectedPeople([]);
      });
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
        .catch(() => {
          toast.error("Error fetching people's data");
        });
    });
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-0 text-base" variant={"link"}>
          create one
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="sticky border-b flex justify-between p-4">
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>

        <div className="max-h-[600px] px-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                disabled={disableInput}
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                placeholder="Enter group name"
                id="name"
                name="name"
              />
            </div>
            <div className="flex flex-col gap-2">
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
                                  <span className="text-gray-400">
                                    {e.email}
                                  </span>
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
                            <li
                              key={`person-btn-${person.id}`}
                              className="border"
                            >
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
                          title="No people created"
                          description="Create new people before creating groups."
                        />
                      )}
                    </ul>
                  </ScrollArea>
                </div>
              )}
            </div>
            <DialogFooter className="p-4">
              <DialogClose asChild>
                <Button type="submit" disabled={selectedPeople.length < 1}>
                  Create
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function NewsletterGroupBtn({
  set,
}: {
  set: (data: NewsletterGroups[]) => void;
}) {
  // const fetchGroups =
  const [group, setGroup] = useState<NewsletterGroups[]>([]);
  const [filteredGroup, setFilteredGroup] = useState<NewsletterGroups[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<NewsletterGroups[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);
  // const [search, setSearch] = useState("");
  const createNewGroup = (data: NewsletterGroups) => {
    setGroup((prev) => [...prev, { ...data }]);
    setFilteredGroup((prev) => [...prev, { ...data }]);
  };

  const disableInput = group.length < 1;

  const handleGroupSelection = (id: number) => {
    const selected = selectedGroups.find((e) => e.id == id);
    if (selected) {
      setSelectedGroups((prev) => prev.filter((e) => e.id !== id));
    } else {
      const g = group.find((e) => e.id == id);
      if (g) {
        setSelectedGroups((prev) => [...prev, { ...g }]);
      }
    }
  };

  const handleSearch = (search: string) => {
    const filtered = group.filter((e) => {
      if (search == "") {
        return e;
      } else {
        if (e.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
          return e;
        }
      }
    });
    setFilteredGroup(filtered);
  };

  const handleSubmit = () => {
    if (selectedGroups.length < 1) {
      console.error("Select atleast one group");
      return;
    }
    set(selectedGroups);
  };

  useEffect(() => {
    startTransition(async () => {
      await getGroupData()
        .then((g) => {
          setGroup(g);
          setFilteredGroup(g);
        })
        .catch((err) => {
          setError(err);
        });
    });
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Group</Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <DialogHeader className="sticky border-b flex justify-between p-4">
          <DialogTitle>Manage Groups</DialogTitle>
          <DialogClose></DialogClose>
        </DialogHeader>
        <p className="px-4">
          Select existing groups or <CreateNewGroup create={createNewGroup} />
        </p>
        <div className="px-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <Label>Groups</Label>
            {selectedGroups.length > 0 && (
              <Button variant={"link"} onClick={() => setSelectedGroups([])}>
                Clear all
              </Button>
            )}
          </div>
          <Input
            disabled={disableInput}
            onChange={(e) => handleSearch(e.target.value)}
            name="search"
          />
        </div>

        <ScrollArea className="h-[400px]">
          {isPending ? (
            <div className="flex flex-col gap-2 px-4 pb-4">
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
              <Skeleton className="h-[100px] w-full" />
            </div>
          ) : error ? (
            <div>{error.message}</div>
          ) : (
            <ul className="flex flex-col gap-2 px-4 pb-4">
              {group.length > 0 ? (
                filteredGroup.length > 0 ? (
                  filteredGroup.map((dept) => {
                    return (
                      <li key={`group-${dept.id}`}>
                        <button
                          onClick={() => handleGroupSelection(dept.id)}
                          data-select={
                            selectedGroups.find((e) => e.id == dept.id)
                              ? "true"
                              : "false"
                          }
                          className="border w-full flex flex-col items-start p-4 gap-4 t=true]:bg-accent data-[select=true]:ring-primary data-[select=true]:bg-accent data-[select=true]:ring-1 hover:bg-accent"
                        >
                          <p className="text-xl font-light">{dept.name}</p>
                          <span className="text-primary">
                            {dept.person_ids.length} people included in this
                            group
                          </span>
                        </button>
                        {/* <div>
                    <Button variant={"outline"} className="w-1/2">
                      View
                    </Button>
                    <Button className="w-1/2" variant={"outline"}>
                      Edit
                    </Button>
                  </div> */}
                      </li>
                    );
                  })
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
                  icon={Users}
                  title="No groups created"
                  description="Create new groups to see them listed here."
                />
              )}
            </ul>
          )}
        </ScrollArea>
        <DialogFooter className="p-4">
          <DialogClose asChild>
            <Button onClick={handleSubmit}>Select</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
