import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { MenuItemType, Category } from "../types";
import { menu as defaultMenu } from "../data/menu";

export function useMenu(sessionId: string | null) {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!sessionId || !supabase) return;

    supabase
      .from("menu_items")
      .select("*")
      .eq("session_id", sessionId)
      .order("id", { ascending: true })
      .then(async ({ data, error }) => {
        if (!error && data && data.length > 0) {
          setMenuItems(data as MenuItemType[]);
        } else if (!error && (!data || data.length === 0)) {
          const seeds = defaultMenu.map((item) => ({
            session_id: sessionId,
            name: item.name,
            description: item.description,
            emoji: item.emoji,
            price: item.price,
            category: item.category,
          }));
          const { data: seeded } = await supabase
            .from("menu_items")
            .insert(seeds)
            .select();
          if (seeded) setMenuItems(seeded as MenuItemType[]);
        }
      });

    const channel = supabase
      .channel(`menu-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "menu_items",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newItem = payload.new as MenuItemType;
          setMenuItems((prev) =>
            prev.some((item) => item.id === newItem.id)
              ? prev
              : [...prev, newItem],
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "menu_items",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const updated = payload.new as MenuItemType;
          setMenuItems((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item)),
          );
        },
      )
      .on("broadcast", { event: "menu_item_deleted" }, (payload) => {
        const deletedId = payload.payload.id as number;
        setMenuItems((prev) => prev.filter((item) => item.id !== deletedId));
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channelRef.current = null;
      supabase!.removeChannel(channel);
    };
  }, [sessionId]);

  const addMenuItem = useCallback(
    async (item: {
      name: string;
      description: string;
      emoji: string;
      price: number;
      category: Category;
    }) => {
      if (!sessionId || !supabase) return null;

      const { data, error } = await supabase
        .from("menu_items")
        .insert({ ...item, session_id: sessionId })
        .select()
        .single();

      if (error) {
        console.error("Failed to add menu item:", error);
        return null;
      }
      const newItem = data as MenuItemType;
      setMenuItems((prev) =>
        prev.some((item) => item.id === newItem.id)
          ? prev
          : [...prev, newItem],
      );
      return newItem;
    },
    [sessionId],
  );

  const updateMenuItem = useCallback(
    async (
      id: number,
      updates: Partial<{
        name: string;
        description: string;
        emoji: string;
        price: number;
        category: Category;
      }>,
    ) => {
      if (!supabase) return;
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      );
      const { error } = await supabase.from("menu_items").update(updates).eq("id", id);
      if (error) {
        console.error("Failed to update menu item:", error);
      }
    },
    [],
  );

  const deleteMenuItem = useCallback(async (id: number) => {
    if (!supabase) return;
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete menu item:", error);
      return;
    }
    channelRef.current?.send({
      type: "broadcast",
      event: "menu_item_deleted",
      payload: { id },
    });
  }, []);

  return {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  };
}
