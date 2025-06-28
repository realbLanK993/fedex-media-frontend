"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { FormData } from "@/lib/types/article";
import { useFilterStore } from "@/store/filterStore";
import { SetStateAction } from "react";

export default function FilterBar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const addFilters = useFilterStore((state) => state.addFilter);
  const filters = useFilterStore((state) => state.filters);
  const changeFilters = useFilterStore((state) => state.changeFilters);
  const enableFilter = useFilterStore((state) => state.enableFilter);
  const form = useForm<FormData>({
    defaultValues: { ...filters },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    addFilters(data);
    changeFilters(data);
    enableFilter(true);
    setOpen(false);
  };
  return (
    <div className=" p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          aria-label="Filter the articles"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel htmlFor="search">Search Articles</FormLabel>
                  <FormControl>
                    <Input
                      id="search"
                      placeholder="Type search query..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2" id="date-picker">
              <FormLabel>Select Dates</FormLabel>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-sm text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Start Date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) =>
                              field.onChange(date ?? undefined)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-sm text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "End Date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) =>
                              field.onChange(date ?? undefined)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <small className="text-sm">
                  Start and end dates can be the same
                </small>
              </div>
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel htmlFor="country">Select Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" id="country">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="malaysia">Malaysia</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sentiment"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel htmlFor="sentiment">Select Sentiment</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" id="sentiment">
                        <SelectValue placeholder="Select sentiment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Sentiments</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <hr className="border-primary border-1 my-4" />

          <h6 className="text-xl">Article Attributes</h6>
          {[
            { id: "financialPerformance", label: "Financial Performance" },
            { id: "innovation", label: "Innovation" },
            { id: "regulatory", label: "Regulatory" },
            {
              id: "environmentResponsibility",
              label: "Environment Responsibility",
            },
            { id: "socialResponsibility", label: "Social Responsibility" },
            {
              id: "communityResponsibility",
              label: "Community Responsibility",
            },
            { id: "eCommerce", label: "E Commerce" },
          ].map(({ id, label }) => (
            <FormField
              key={id}
              control={form.control}
              name={id as keyof FormData}
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormData, keyof FormData>;
              }) => (
                <FormItem className="flex items-center gap-2 mt-4">
                  <FormControl>
                    <Checkbox
                      id={id}
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel htmlFor={id} className="">
                    {label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="w-full mt-4">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
