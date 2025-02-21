import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "../ui/progress"
import { useToast } from "../ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "../ui/calendar"
import { format, isBefore, startOfTomorrow, addDays } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, XIcon } from "lucide-react"
import Image from "next/image"
import { getChainOptions } from "@/utils/multi-chain/MultiChainSelectOptions"





type PaymentDetailsProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  paymentDetails: {
    receiverAddress: string;
    chain: string;
    currency: string;
    dueDate: Date | undefined | number;
    invoiceItems: InvoiceItem[];
  };
  updatePaymentDetails: (newDetails: Partial<PaymentDetailsProps['paymentDetails']>) => void;
};

type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

export function PaymentDetails({
  setStep,
  paymentDetails,
  updatePaymentDetails
}: PaymentDetailsProps) {
  const [newItem, setNewItem] = React.useState<InvoiceItem>({ name: "", quantity: 0, price: 0 });
  const [formError, setFormError] = React.useState("");
  // const [date, setDate] = React.useState<Date | undefined | number>(paymentDetails.dueDate);

  const { toast } = useToast();

  const grandTotal = React.useMemo(() => {
    return paymentDetails.invoiceItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  }, [paymentDetails.invoiceItems]);

  const disablePastDates = (date: Date) => {
    return isBefore(date, startOfTomorrow());
  };

  React.useEffect(() => {
    const tomorrow = startOfTomorrow();
    if (!paymentDetails.dueDate || isBefore(paymentDetails.dueDate, tomorrow)) {
      updatePaymentDetails({ dueDate: tomorrow });
    }
  }, []);

  function validateAndProceed() {
    if (paymentDetails.receiverAddress.trim() === "" ||
      paymentDetails.invoiceItems.length === 0 ||
      paymentDetails.dueDate === undefined ||
      paymentDetails.chain === "" ||
      paymentDetails.currency === "") {
      setFormError("Please fill in all required fields.");
      toast({
        variant: "destructive",
        title: "Please fill out all required forms",
      })
    } else {
      setFormError("");
      setStep(2);
    }
  }

  function goBack() {
    setStep(0);
  }

  function addInvoiceItem() {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      updatePaymentDetails({
        invoiceItems: [...paymentDetails.invoiceItems, newItem]
      });
      setNewItem({ name: "", quantity: 0, price: 0 });
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    updatePaymentDetails({ [id]: value });
  };


  const removeInvoiceItem = (index: number) => {
    const newInvoiceItems = [...paymentDetails.invoiceItems];
    newInvoiceItems.splice(index, 1);
    updatePaymentDetails({ invoiceItems: newInvoiceItems });
  };

  const chainOptions = getChainOptions(); // Get the chain options



  return (
    <div className=" lg:w-[85%] xl:w-[65%]" >
      <Progress value={66} className="my-8" />
      <Card className="">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Please input the payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="receiverAddress">Customer's EVM Address<span className="text-red-600">*</span></Label>
                <Input
                  id="receiverAddress"
                  placeholder="EVM Address"
                  value={paymentDetails.receiverAddress}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="chain">Chain<span className="text-red-600">*</span></Label>

                <Select
                  value={paymentDetails.chain}
                  onValueChange={(value) => updatePaymentDetails({ chain: value })}
                >

                  <SelectTrigger>
                    <SelectValue placeholder="Select a chain" />
                  </SelectTrigger>
                  <SelectContent>

                    {chainOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center font-semibold">
                          {option.icon}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="currency">Currency<span className="text-red-600">*</span></Label>
                <Select value={paymentDetails.currency} onValueChange={(value) => updatePaymentDetails({ currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">
                      <div className="flex items-center font-semibold">
                        <Image src="/usdc.png" alt="USDC" className="w-6 h-6 mr-2" width={24} height={24} />
                        USDC
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5 mt-4">
                <Label htmlFor="dueDate">Due Date<span className="text-red-600">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !paymentDetails.dueDate && "text-muted-foreground"
                      )}
                    >
                      {paymentDetails.dueDate ? (
                        format(paymentDetails.dueDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={paymentDetails.dueDate as Date | undefined}
                      onSelect={(date) => updatePaymentDetails({ dueDate: date })}
                      disabled={disablePastDates}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Invoice Items section remains the same */}
            {/* Invoice Items section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Invoice Items<span className="text-red-600">*</span></h3>
              <div className="grid grid-cols-1 lg:flex space-y-2 lg:space-y-0 lg:space-x-2 mt-2">
                <Input
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity || ''}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newItem.price || ''}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                />
                <Button onClick={addInvoiceItem}>Add</Button>
              </div>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Item Name</TableHead>
                    <TableHead className="text-right w-1/6">Quantity</TableHead>
                    <TableHead className="text-right w-1/6">Price</TableHead>
                    <TableHead className="text-right w-1/6">Total</TableHead>
                    <TableHead className="w-1/12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentDetails.invoiceItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{(item.quantity * item.price).toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <XIcon
                          className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors mx-auto"
                          size={18}
                          onClick={() => removeInvoiceItem(index)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="font-semibold">Grand Total</TableCell>
                    <TableCell className="text-right font-semibold">{grandTotal.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={goBack}>Back</Button>
          <Button onClick={validateAndProceed}>Next</Button>
        </CardFooter>
      </Card>
    </div>
  )
}