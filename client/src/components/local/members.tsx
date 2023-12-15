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
import { CalendarIcon, Trash } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Calendar } from "../ui/calendar";

export interface MemberState {
  memberId: number;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  address: string;
}

export default function Members() {
  const [memberData, setMemberData] = useState<MemberState[]>();

  const fetchMembers = useCallback(() => {
    axios.get(`${env.SERVER_URL}/api/Members`).then((res) => {
      setMemberData(res.data);
    });
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const onDeleteMember = useCallback(
    (tableId: number) => {
      axios.delete(`${env.SERVER_URL}/api/Members/${tableId}`).then(() => {
        fetchMembers();
      });
    },
    [fetchMembers]
  );

  return (
    <>
      <Header></Header>

      <div className="flex justify-end mb-6">
        <AddMemberComponent fetchMembers={fetchMembers}></AddMemberComponent>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Member Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
            {memberData?.map((member) => (
              <TableRow key={member.memberId}>
                <TableCell>{member.memberId}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phoneNumber}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteMember(member.memberId)}
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

interface AddMemberComponentProps {
  fetchMembers: () => void;
}

export function AddMemberComponent(props: AddMemberComponentProps) {
  const formSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(25),
    email: z.string({ required_error: "Name is required" }).min(1).max(25),
    phoneNumber: z
      .string({ required_error: "Name is required" })
      .min(5)
      .max(25),
    birthDate: z.date(),
    address: z.string({ required_error: "Name is required" }).min(1).max(25),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onAddMember = useCallback(async () => {
    const memberData = {
      name: form.getValues().name,
      email: form.getValues().email,
      phoneNumber: form.getValues().phoneNumber,
      birthDate: form.getValues().birthDate,
      address: form.getValues().address,
    };

    await axios.post(`${env.SERVER_URL}/api/Members`, memberData);
    form.reset();
    form.setValue("name", "");
    form.setValue("email", "");
    form.setValue("phoneNumber", "");
    form.setValue("address", "");
    props.fetchMembers();
  }, [form, props]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Member Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      onSelect={field.onChange}
                      selected={field.value}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Address" {...field} />
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
              onClick={onAddMember}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
