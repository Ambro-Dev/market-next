"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import NewSubjectForm from "./new-subject-form";
import { axiosInstance } from "@/lib/axios";

type subjects = {
  id: string;
  name: string;
};

export default function SubjectSwitcher({
  subjectId,
}: {
  subjectId: string | undefined;
}) {
  const [subjects, setSubjects] = React.useState<subjects[]>([]);

  const router = useRouter();

  async function fetchsubjects() {
    try {
      const res = await axiosInstance.get(`/api/subjects`);
      const data = res.data;
      setSubjects(data.subjects);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  React.useEffect(() => {
    if (subjects?.length > 0) return;
    fetchsubjects();
  }, [subjectId, subjects]);

  const [open, setOpen] = React.useState(false);
  const [showNewSubjectDialog, setShowNewSubjectDialog] = React.useState(false);
  const [selectedsubject, setSelectedsubject] = React.useState(subjectId);

  return (
    <Dialog open={showNewSubjectDialog} onOpenChange={setShowNewSubjectDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Wybierz podmiot"
            className={cn("w-[200px] justify-between")}
          >
            {selectedsubject ? (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarFallback>
                    {subjects
                      .find((subject) => subject.id === selectedsubject)
                      ?.name.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>
                {
                  subjects.find((subject) => subject.id === selectedsubject)
                    ?.name
                }
              </>
            ) : (
              "Wybierz podmiot..."
            )}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Szukaj podmiotu..." />
              <CommandEmpty>Brak podmiotu.</CommandEmpty>
              {subjects.length > 0 && (
                <CommandGroup key="subjects" heading="Wszystkie podmiotu">
                  {subjects.map((subject) => (
                    <CommandItem
                      key={subject.id}
                      onSelect={() => {
                        setOpen(false);
                        router.push(`/admin/subjects/${subject.id}`);
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarFallback>
                          {subject.name.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      {subject.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedsubject === subject.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewSubjectDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Dodaj podmiot
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <NewSubjectForm />
    </Dialog>
  );
}
