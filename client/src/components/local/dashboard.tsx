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
import { Check, Trash } from "lucide-react";
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
import { Button } from "../ui/button";
import { BookState } from "./books";
import { MemberState } from "./members";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface DashboardState {
  borrowId: number;
  borrowedOn: Date;
  isReturned: boolean;
  member: {
    name: string;
  };
  book: {
    name: string;
  };
}

export default function Dashboards() {
  const [dashboardData, setDashboardData] = useState<DashboardState[]>();

  const fetchDashboards = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Borrows`).then((res) => {
      setDashboardData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchDashboards();
  }, [fetchDashboards]);

  const onDeleteDashboard = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Borrows/${tableId}`).then(() => {
        fetchDashboards();
      });
    },
    [fetchDashboards]
  );

  const onUpdateDashboard = useCallback(
    (tableId: number) => {
      axios.put(`${env.SERVER_URL}/api/Borrows/${tableId}`).then(() => {
        fetchDashboards();
      });
    },
    [fetchDashboards]
  );

  return (
    <>
      <Header></Header>

      <div className="flex justify-end mb-6">
        <AddDashboardComponent
          fetchDashboards={fetchDashboards}
        ></AddDashboardComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Member Name</TableHead>
              <TableHead>Book Name</TableHead>
              <TableHead className="text-right">Is Returned</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {dashboardData?.map((dashboard) => (
              <TableRow key={dashboard.borrowId}>
                <TableCell>{dashboard.borrowId}</TableCell>
                <TableCell>{dashboard.member.name}</TableCell>
                <TableCell>{dashboard.book.name}</TableCell>
                <TableCell className="text-right">
                  {dashboard.isReturned ? (
                    <></>
                  ) : (
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onUpdateDashboard(dashboard.borrowId)}
                    >
                      <Check></Check>
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteDashboard(dashboard.borrowId)}
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

interface AddDashboardComponentProps {
  fetchDashboards: () => void;
}

export function AddDashboardComponent(props: AddDashboardComponentProps) {
  const formSchema = z.object({
    memberId: z.string({ required_error: "member is required" }).min(1).max(25),
    bookId: z.string({ required_error: "book is required" }).min(1).max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [bookData, setBookData] = useState<BookState[]>();
  const [memberData, setMemberData] = useState<MemberState[]>();

  useEffect(() => {
    axios.get(`${env.SERVER_URL}/api/Members`).then((res) => {
      setMemberData(res.data);
    });

    axios.get(`${env.SERVER_URL}/api/Books`).then((res) => {
      setBookData(res.data);
    });
  }, []);

  const onAddDashboard = useCallback(async () => {
    const dashboardData = {
      memberId: form.getValues().memberId,
      bookId: form.getValues().bookId,
      borrowedOn: new Date(),
      isReturned: false,
    };

    await axios.post(`${env.SERVER_URL}/api/Borrows`, dashboardData);
    form.reset();
    form.setValue("bookId", "");
    form.setValue("memberId", "");
    props.fetchDashboards();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Borrow</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Borrow</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="memberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {memberData?.map((member) => (
                      <SelectItem
                        key={member.memberId}
                        value={member.memberId.toString()}
                      >
                        {member.name}
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
            name="bookId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Book" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bookData?.map((book) => (
                      <SelectItem
                        key={book.bookId}
                        value={book.bookId.toString()}
                      >
                        {book.name}
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
              onClick={onAddDashboard}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
