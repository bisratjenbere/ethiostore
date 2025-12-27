import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cart } from "@/types";
import Image from "next/image";
import Link from "next/link";
const UserOrderItems = ({ userCart }: { userCart: Cart }) => {
  return (
    <Card>
      <CardContent>
        <h2 className="text-xl pb-4">Order Items</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userCart.items.map((item) => {
              return (
                <TableRow key={item.slug}>
                  <TableCell>
                    <Link
                      className="flex items-center"
                      href={`/product/${item.slug}`}
                    >
                      <Image
                        height={50}
                        width={50}
                        alt={item.name}
                        src={item.image}
                      />
                      <span className="px-2">{item.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="px-2">{item.qty}</span>
                  </TableCell>
                  <TableCell className="text-right">${item.price}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Link href="/cart">
          <Button variant="outline">Edit</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default UserOrderItems;
