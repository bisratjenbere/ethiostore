"use client";

import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { z } from "zod";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { saveGuestCheckoutData } from "@/lib/actions/guest-checkout.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CheckOutSteps from "@/components/shared/checkout-steps";
import Link from "next/link";

// Extend schema with optional email for guests
const guestShippingSchema = shippingAddressSchema.extend({
  email: z.string().email("Valid email required").optional(),
});

type FormValues = z.infer<typeof guestShippingSchema>;

const ShippingAddressForm = ({
  address,
  isGuest,
  guestEmail,
}: {
  address: ShippingAddress | null;
  isGuest: boolean;
  guestEmail?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FormValues>({
    mode: "onBlur",
    resolver: zodResolver(
      isGuest
        ? guestShippingSchema.extend({
            email: z.string().email("Valid email required"),
          })
        : shippingAddressSchema
    ),
    defaultValues: {
      ...(address || shippingAddressDefaultValues),
      email: guestEmail ?? "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    startTransition(async () => {
      if (isGuest) {
        const { email, ...addressFields } = value;
        await saveGuestCheckoutData({ email, address: addressFields });
        router.push("/payment-method");
      } else {
        const res = await updateUserAddress(value);
        if (!res.success) {
          toast.error(res.message);
          return;
        }
        router.push("/payment-method");
      }
    });
  };

  return (
    <div className="wrapper py-8">
      <CheckOutSteps current={1} />
      <div className="space-y-6 max-w-2xl mx-auto mt-8">
        <div className="space-y-2">
          <h1 className="h2-bold">Shipping Address</h1>
          <p className="text-muted-foreground">
            Please enter the address where you want to ship to
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                method="post"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email — guests only */}
                {isGuest && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<FormValues, "email">;
                    }) => (
                      <FormItem>
                        <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          For order confirmation and tracking
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormValues, "fullName">;
                  }) => (
                    <FormItem>
                      <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormValues, "streetAddress">;
                  }) => (
                    <FormItem>
                      <FormLabel>Street Address <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter street address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField
                    name="city"
                    control={form.control}
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<FormValues, "city">;
                    }) => (
                      <FormItem>
                        <FormLabel>City <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<FormValues, "postalCode">;
                    }) => (
                      <FormItem>
                        <FormLabel>Postal Code <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="country"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<FormValues, "country">;
                  }) => (
                    <FormItem>
                      <FormLabel>Country <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  <Link href="/cart" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Back to Cart
                    </Button>
                  </Link>
                  <Button disabled={isPending} type="submit" className="flex-1">
                    {isPending ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Continue to Payment
                      </>
                    )}
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

export default ShippingAddressForm;
