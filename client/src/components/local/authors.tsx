import { useForm } from "react-hook-form";
import Header from "./header";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { env } from "../../config";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface AuthorState {
  authorId: number;
  name: string;
  nationality: string;
}

export default function Authors() {
  const [authorData, setAuthorData] = useState<AuthorState[]>();

  const fetchAuthors = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Authors`).then((res) => {
      setAuthorData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const onDeleteAuthor = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Authors/${tableId}`).then(() => {
        fetchAuthors();
      });
    },
    [fetchAuthors]
  );

  return (
    <>
      <Header></Header>

      <div className="flex justify-end mb-6">
        <AddAuthorComponent fetchAuthors={fetchAuthors}></AddAuthorComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Author Name</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {authorData?.map((author) => (
              <TableRow key={author.authorId}>
                <TableCell>{author.authorId}</TableCell>
                <TableCell>{author.name}</TableCell>
                <TableCell>{author.nationality}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteAuthor(author.authorId)}
                  >
                    <Trash></Trash>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

interface AddAuthorComponentProps {
  fetchAuthors: () => void;
}

export function AddAuthorComponent(props: AddAuthorComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
    nationality: z
      .string({ required_error: "Nationality is required" })
      .min(1)
      .max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onAddAuthor = useCallback(async () => {
    const authorData = {
      name: form.getValues().name,
      nationality: form.getValues().nationality,
    };

    await axios.post(`${env.SERVER_URL}/api/Authors`, authorData);
    form.reset();
    form.setValue("name", "");
    form.setValue("nationality", "");
    props.fetchAuthors();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Author</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Author</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Author Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Nationality Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              onClick={onAddAuthor}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
