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

export interface GenreState {
  genreId: number;
  genreName: string;
}

export default function Genres() {
  const [genreData, setGenreData] = useState<GenreState[]>();

  const fetchGenres = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Genres`).then((res) => {
      setGenreData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const onDeleteGenre = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Genres/${tableId}`).then(() => {
        fetchGenres();
      });
    },
    [fetchGenres]
  );

  return (
    <>
      <Header></Header>

      <div className="flex justify-end mb-6">
        <AddGenreComponent fetchGenres={fetchGenres}></AddGenreComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Genre Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {genreData?.map((genre) => (
              <TableRow key={genre.genreId}>
                <TableCell>{genre.genreId}</TableCell>
                <TableCell>{genre.genreName}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteGenre(genre.genreId)}
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

interface AddGenreComponentProps {
  fetchGenres: () => void;
}

export function AddGenreComponent(props: AddGenreComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onAddGenre = useCallback(async () => {
    const genreData = {
      genreName: form.getValues().name,
    };
    await axios.post(`${env.SERVER_URL}/api/Genres`, genreData);
    form.reset();
    form.setValue("name", "");
    props.fetchGenres();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Genre</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Genre</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Genre Name" {...field} />
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
              onClick={onAddGenre}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
