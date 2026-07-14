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
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CreditCard, Loader, Shield } from "lucide-react";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { saveGuestCheckoutData } from "@/lib/actions/guest-checkout.actions";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PaymentMethodForm = ({
  preferredPaymentMethod,
  isGuest,
}: {
  preferredPaymentMethod: string | null;
  isGuest: boolean;
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
      if (isGuest) {
        await saveGuestCheckoutData({ paymentMethod: values.type });
        router.push("/place-order");
      } else {
        const res = await updateUserPaymentMethod(values);
        if (!res.success) toast.error(res.message);
        else router.push("/place-order");
      }
    });
  }

  return (
    <div className="wrapper py-8">
      <CheckOutSteps current={2} />
      <div className="max-w-2xl mx-auto mt-8 space-y-6">
        <div className="space-y-2">
          <h1 className="h2-bold">Payment Method</h1>
          <p className="text-muted-foreground">
            Please select your preferred payment method
          </p>
        </div>

        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <p className="text-sm">
                <span className="font-medium">Secure Payment</span>
                <span className="text-muted-foreground">
                  {" "}
                  - Your payment information is safe and encrypted
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                method="post"
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          className="grid gap-4"
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          {PAYMENT_METHODS.map((paymentMethod) => (
                            <FormItem key={paymentMethod}>
                              <FormLabel className="cursor-pointer">
                                <Card
                                  className={cn(
                                    "cursor-pointer transition-all hover:border-primary",
                                    field.value === paymentMethod &&
                                      "border-primary bg-primary/5"
                                  )}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                      <FormControl>
                                        <RadioGroupItem
                                          value={paymentMethod}
                                          checked={
                                            field.value === paymentMethod
                                          }
                                        />
                                      </FormControl>
                                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                                      <span className="font-medium">
                                        {paymentMethod}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  <Link href="/shipping-address" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Shipping
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isPending} className="flex-1">
                    {isPending ? (
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    Continue to Review
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethodForm;
