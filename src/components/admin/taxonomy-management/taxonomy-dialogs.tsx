"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { TaxonomyConfig, TaxonomyFormValue, TaxonomyItem } from "./types";

type AddDialogProps = {
  config: TaxonomyConfig;
  canAdd: boolean;
  isOpen: boolean;
  saving: boolean;
  value: TaxonomyFormValue;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onValueChange: (value: TaxonomyFormValue) => void;
};

export function TaxonomyAddDialog({
  config,
  canAdd,
  isOpen,
  onOpenChange,
  onSave,
  onValueChange,
  saving,
  value,
}: AddDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add {config.itemLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Add New {config.itemLabel}</DialogTitle>
          <DialogDescription>
            Create a new {config.itemLabel.toLowerCase()} for the system.
          </DialogDescription>
        </DialogHeader>

        <TaxonomyForm
          itemLabel={config.itemLabel}
          value={value}
          onValueChange={onValueChange}
        />

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!canAdd || saving}>
            {saving ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TaxonomyEditDialog({
  canEdit,
  config,
  item,
  isOpen,
  onItemChange,
  onOpenChange,
  onSave,
  saving,
}: {
  canEdit: boolean;
  config: TaxonomyConfig;
  item: TaxonomyItem | null;
  isOpen: boolean;
  onItemChange: (item: TaxonomyItem) => void;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  saving: boolean;
}) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Edit {config.itemLabel}</DialogTitle>
          <DialogDescription>
            Update {config.itemLabel.toLowerCase()} information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-taxonomy-name">{config.itemLabel} Name</Label>
              <Input
                id="edit-taxonomy-name"
                value={item.name}
                onChange={(event) =>
                  onItemChange({ ...item, name: event.target.value })
                }
              />
              {item.name.trim().length === 0 && (
                <p className="text-sm text-destructive">Name is required.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={item.status}
                onValueChange={(status: "normal" | "hide") =>
                  onItemChange({ ...item, status })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[90]">
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hide">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DescriptionField
            id="edit-taxonomy-description"
            value={item.description}
            onChange={(description) => onItemChange({ ...item, description })}
          />
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!canEdit || saving}>
            {saving ? "Saving..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TaxonomyForm({
  itemLabel,
  onValueChange,
  value,
}: {
  itemLabel: string;
  onValueChange: (value: TaxonomyFormValue) => void;
  value: TaxonomyFormValue;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="taxonomy-name">{itemLabel} Name</Label>
        <Input
          id="taxonomy-name"
          value={value.name}
          onChange={(event) =>
            onValueChange({ ...value, name: event.target.value })
          }
          placeholder={`Enter ${itemLabel.toLowerCase()} name...`}
        />
        {value.name.trim().length === 0 && (
          <p className="text-sm text-destructive">Name is required.</p>
        )}
      </div>

      <DescriptionField
        id="taxonomy-description"
        value={value.description}
        onChange={(description) => onValueChange({ ...value, description })}
      />
    </div>
  );
}

function DescriptionField({
  id,
  onChange,
  value,
}: {
  id: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Description</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="At least 10 characters..."
      />
      {value.trim().length > 0 && value.trim().length < 10 && (
        <p className="text-sm text-destructive">
          Description must be at least 10 characters.
        </p>
      )}
    </div>
  );
}
