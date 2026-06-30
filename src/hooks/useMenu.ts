import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { MenuItemType, Category } from "../types";
import { menu as defaultMenu } from "../data/menu";

export function useMenu(sessionId: string | null) {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(defaultMenu);

  useEffect(() => {
    if (!sessionId || !supabase) return;

    supabase
      .from("menu_items")
      .select("*")
      .eq("session_id", sessionId)
      .order("id", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setMenuItems(data as MenuItemType[]);
        }
      });

    const channel = supabase
      .channel(`menu-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_items",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMenuItems((prev) => [...prev, payload.new as MenuItemType]);
          } else if (payload.eventType === "UPDATE") {
            setMenuItems((prev) =>
              prev.map((item) =>
                item.id === (payload.new as MenuItemType).id
                  ? (payload.new as MenuItemType)
                  : item,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setMenuItems((prev) =>
              prev.filter(
                (item) => item.id !== (payload.old as MenuItemType).id,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, [sessionId]);

  const seedDefaultMenu = useCallback(
    async () => {
      if (!sessionId || !supabase) return;

      const items = defaultMenu.map((item) => ({
        session_id: sessionId,
        name: item.name,
        description: item.description,
        emoji: item.emoji,
        price: item.price,
        category: item.category,
      }));

      const { data } = await supabase
        .from("menu_items")
        .insert(items)
        .select();

      if (data) setMenuItems(data as MenuItemType[]);
    },
    [sessionId],
  );

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
      return data as MenuItemType;
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
    }
  }, []);

  return {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    seedDefaultMenu,
  };
}
