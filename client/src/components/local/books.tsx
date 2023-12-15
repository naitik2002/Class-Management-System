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
import { AuthorState } from "./authors";
import { GenreState } from "./genres";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface BookState {
  bookId: number;
  name: string;
  author: {
    name: string;
  };
  genre: {
    genreName: string;
  };
}

export default function Books() {
  const [bookData, setBookData] = useState<BookState[]>();

  const fetchBooks = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Books`).then((res) => {
      setBookData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const onDeleteBook = useCallback(
    (bookId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Books/${bookId}`).then(() => {
        fetchBooks();
      });
    },
    [fetchBooks]
  );

  return (
    <>
      <Header></Header>

      <div className="flex justify-end mb-6">
        <AddBookComponent fetchBooks={fetchBooks}></AddBookComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Book Name</TableHead>
              <TableHead>Author Name</TableHead>
              <TableHead>Genre Name</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {bookData?.map((book) => (
              <TableRow key={book.bookId}>
                <TableCell>{book.bookId}</TableCell>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.author.name}</TableCell>
                <TableCell>{book.genre.genreName}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteBook(book.bookId)}
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

interface AddBookComponentProps {
  fetchBooks: () => void;
}

export function AddBookComponent(props: AddBookComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
    authorId: z.string({ required_error: "Author is required" }).min(1).max(25),
    genreId: z.string({ required_error: "Genre is required" }).min(1).max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [authorData, setAuthorData] = useState<AuthorState[]>();
  const [genreData, setGenreData] = useState<GenreState[]>();

  useEffect(() => {
    axios.get(`${env.SERVER_URL}/api/Authors`).then((res) => {
      setAuthorData(res.data);
    });

    axios.get(`${env.SERVER_URL}/api/Genres`).then((res) => {
      setGenreData(res.data);
    });
  }, []);

  const onAddBook = useCallback(async () => {
    const bookData = {
      name: form.getValues().name,
      authorId: form.getValues().authorId,
      genreId: form.getValues().genreId,
    };

    await axios.post(`${env.SERVER_URL}/api/Books`, bookData);
    form.reset();
    form.setValue("name", "");
    form.setValue("authorId", "");
    form.setValue("genreId", "");
    props.fetchBooks();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Book</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Book</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Book Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genreId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genreData?.map((genre) => (
                      <SelectItem
                        key={genre.genreId}
                        value={genre.genreId.toString()}
                      >
                        {genre.genreName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Author" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {authorData?.map((author) => (
                      <SelectItem
                        key={author.authorId}
                        value={author.authorId.toString()}
                      >
                        {author.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              onClick={onAddBook}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
