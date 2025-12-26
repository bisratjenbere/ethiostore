"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { useTransition } from "react";
import CheckOutSteps from "@/components/shared/checkout-steps";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();
  async function onSubmit(values: z.infer<typeof paymentMethodSchema>) {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);
      if (!res.success) toast.error(res.message);
      return;
    });
    router.push("/place-order");
  }

  return (
    <>
      <CheckOutSteps current={2} />
      <div className="max-w-md mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            method="post"
            className="space-y-4"
          >
            <h1 className="h2-bold mt-4">Payment Method</h1>
            <p className="text-sm text-muted-foreground">
              Please select your preferred payment method
            </p>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        className="flex flex-col space-y-2"
                        onValueChange={field.onChange}
                      >
                        {PAYMENT_METHODS.map((paymentMethod) => (
                          <FormItem
                            className="flex space-x-3 space-y-0 items-center"
                            key={paymentMethod}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={paymentMethod}
                                checked={field.value === paymentMethod}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {paymentMethod}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  <ArrowRight className=" h-4 w-4" />
                )}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PaymentMethodForm;
