"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import type {
  TaxonomyConfig,
  TaxonomyFormValue,
  TaxonomyItem,
  TaxonomySortKey,
  TaxonomyStatus,
} from "./types";
import {
  DEFAULT_TAXONOMY_LIMIT,
  isValidTaxonomyForm,
  normalizeTaxonomyItems,
} from "./utils";

const EMPTY_FORM: TaxonomyFormValue = { name: "", description: "" };

export function useTaxonomyManagement(config: TaxonomyConfig) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { toast } = useToast();

  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | TaxonomyStatus>("all");
  const [sort, setSort] = useState<TaxonomySortKey>("updatedAt.desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_TAXONOMY_LIMIT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [savingAdd, setSavingAdd] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [newItem, setNewItem] = useState<TaxonomyFormValue>(EMPTY_FORM);
  const [editItem, setEditItem] = useState<TaxonomyItem | null>(null);

  const canAdd = isValidTaxonomyForm(newItem);
  const canEdit = !!editItem && isValidTaxonomyForm(editItem);
  const endpoint = apiUrl ? `${apiUrl}${config.apiPath}` : "";

  const fetchItems = useCallback(async () => {
    if (!endpoint) {
      setError("NEXT_PUBLIC_API_URL is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [sortBy, sortDir] = sort.split(".") as [string, "asc" | "desc"];
      const response = await axios.get(endpoint, {
        withCredentials: true,
        params: {
          page,
          limit,
          search: search.trim() || undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
          sortBy,
          sortDir,
        },
      });

      if (Array.isArray(response.data)) {
        setItems(normalizeTaxonomyItems(response.data));
        setServerTotal(response.data.length);
      } else {
        const normalized = normalizeTaxonomyItems(response.data);
        setItems(normalized);
        setServerTotal(Number((response.data as any)?.total ?? normalized.length));
      }
    } catch (error) {
      console.error(`fetch ${config.itemLabel} error:`, error);
      setError(`Failed to load ${config.itemLabel.toLowerCase()}s`);
      toast({
        title: `Failed to load ${config.itemLabel.toLowerCase()}s`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [config.itemLabel, endpoint, filterStatus, limit, page, search, sort, toast]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, sort, limit]);

  const total = serverTotal;
  const pageCount = Math.max(1, Math.ceil(total / limit));

  const handleAddItem = async () => {
    if (!endpoint || !canAdd) return;

    setSavingAdd(true);
    try {
      const response = await axios.post(
        endpoint,
        {
          name: newItem.name.trim(),
          description: newItem.description.trim(),
          status: config.createStatus ?? "normal",
        },
        { withCredentials: true },
      );

      toast({ title: `${config.itemLabel} added successfully` });
      setIsAddDialogOpen(false);
      setNewItem(EMPTY_FORM);
      if (Array.isArray(response.data) || response.data?.items) {
        setItems(normalizeTaxonomyItems(response.data));
      } else {
        await fetchItems();
      }
    } catch (error) {
      console.error(`Error adding ${config.itemLabel}:`, error);
      toast({
        title: `Failed to add ${config.itemLabel.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setSavingAdd(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!endpoint || !editItem || !canEdit) return;

    setSavingEdit(true);
    try {
      const payload = {
        name: editItem.name.trim(),
        description: editItem.description.trim(),
        status: editItem.status,
      };

      if (config.updateMethod === "put") {
        await axios.put(`${endpoint}/${editItem._id}`, payload, {
          withCredentials: true,
        });
      } else {
        await axios.patch(`${endpoint}/${editItem._id}`, payload, {
          withCredentials: true,
        });
      }

      toast({ title: `${config.itemLabel} updated successfully` });
      setIsEditDialogOpen(false);
      setEditItem(null);
      await fetchItems();
    } catch (error) {
      console.error(`Error updating ${config.itemLabel}:`, error);
      toast({
        title: `Failed to update ${config.itemLabel.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const openEditDialog = (item: TaxonomyItem) => {
    setEditItem(item);
    setIsEditDialogOpen(true);
  };

  return {
    canAdd,
    canEdit,
    editItem,
    error,
    fetchItems,
    filterStatus,
    handleAddItem,
    handleUpdateItem,
    isAddDialogOpen,
    isEditDialogOpen,
    items,
    limit,
    loading,
    newItem,
    openEditDialog,
    page,
    pageCount,
    savingAdd,
    savingEdit,
    search,
    setEditItem,
    setFilterStatus,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setLimit,
    setNewItem,
    setPage,
    setSearch,
    setSort,
    sort,
    total,
  };
}

export type TaxonomyManagementState = ReturnType<typeof useTaxonomyManagement>;
