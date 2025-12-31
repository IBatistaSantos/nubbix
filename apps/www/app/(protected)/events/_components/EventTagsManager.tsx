"use client";

import { useState } from "react";
import { Button } from "@nubbix/ui/button";
import { Input } from "@nubbix/ui/input";
import { Badge } from "@nubbix/ui/badge";
import { AlertCircle, X } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import type { CreateEventFormInput } from "../../../../src/modules/events/application/dtos/CreateEventDTO";

interface EventTagsManagerProps {
  tags: string[];
  errors: FieldErrors<CreateEventFormInput>;
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export function EventTagsManager({ tags, errors, onAdd, onRemove }: EventTagsManagerProps) {
  const [tagInput, setTagInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim()) {
        onAdd(tagInput);
        setTagInput("");
      }
    }
  };

  const handleAddClick = () => {
    if (tagInput.trim()) {
      onAdd(tagInput);
      setTagInput("");
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Tags</h3>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="Digite uma tag e pressione Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-11"
          />
          <Button type="button" onClick={handleAddClick} variant="secondary" className="h-11 px-6">
            Adicionar
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1.5 pr-1.5 py-1.5 bg-slate-200 text-slate-700"
              >
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(tag)}
                  className="h-4 w-4 p-0 hover:bg-slate-300 rounded-sm"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {errors.tags && (
          <p className="text-sm text-red-600 flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3" />
            {errors.tags.message}
          </p>
        )}

        <p className="text-xs text-slate-500 leading-relaxed">
          Tags são usadas para organização, busca e filtros.
        </p>
      </div>
    </div>
  );
}
