import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { Order, OrderStatus, CartItem } from "../types";

export function useOrders(sessionId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!sessionId || !supabase) return;

    supabase
      .from("orders")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
      });

    const channel = supabase
      .channel(`orders-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [...prev, payload.new as Order]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === (payload.new as Order).id
                  ? (payload.new as Order)
                  : o,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) =>
              prev.filter((o) => o.id !== (payload.old as Order).id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, [sessionId]);

  const placeOrder = useCallback(
    async (
      cart: CartItem[],
      orderNumber: number,
      amountPaid: number,
      changeDue: number,
    ) => {
      if (!sessionId || !supabase) return null;

      const items = cart.map((item) => ({
        name: item.name,
        emoji: item.emoji,
        price: item.price,
        quantity: item.quantity,
      }));

      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const { data, error } = await supabase
        .from("orders")
        .insert({
          session_id: sessionId,
          order_number: orderNumber,
          items,
          total,
          status: "pending" as OrderStatus,
          amount_paid: amountPaid,
          change_due: changeDue,
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to place order:", error);
        return null;
      }

      return data as Order;
    },
    [sessionId],
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      if (!supabase) return;
      await supabase.from("orders").update({ status }).eq("id", orderId);
    },
    [],
  );

  return { orders, placeOrder, updateOrderStatus };
}
