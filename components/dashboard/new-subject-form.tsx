import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Props = {};

const schema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Nazwa podmiotu musi mieć minimum 3 znaki.",
    })
    .max(255, {
      message: "Nazwa podmiotu może mieć maksymalnie 255 znaków.",
    }),
  plan: z.string({
    required_error: "Wybierz okres dostępu.",
  }),
});

const NewSubjectForm = (props: Props) => {
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      plan: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const response = await axiosInstance.post("/api/subjects", {
        name: values.name,
        plan: values.plan,
      });
      if (response.data.status === 200) {
        form.reset();
        toast({
          title: "Sukces",
          description: "Podmiot został dodany.",
        });
        router.push(`/admin/subjects/${response.data.subjectId}`);
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Coś poszło nie tak.",
      });
    }
  };

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Dodaj podmiot</DialogTitle>
            <DialogDescription>
              Dodaj podmiot, aby móc zarządzać jej kontem.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Nazwa podmiotu</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormDescription>Podaj nazwę podmiotu</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Czas dostępu</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz okres dostępu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">
                              <span className="font-medium">30 dni</span> -{" "}
                              <span className="text-muted-foreground">
                                Miesięczny
                              </span>
                            </SelectItem>
                            <SelectItem value="half-year">
                              <span className="font-medium">6 miesięcy</span> -{" "}
                              <span className="text-muted-foreground">
                                Półroczny
                              </span>
                            </SelectItem>
                            <SelectItem value="year">
                              <span className="font-medium">1 rok</span> -{" "}
                              <span className="text-muted-foreground">
                                Roczny
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Wybierz czas dostępu dla podmiotu
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Anuluj</Button>
            <Button type="submit">Dodaj</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default NewSubjectForm;
