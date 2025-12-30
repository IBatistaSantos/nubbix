"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { Progress } from "@nubbix/ui/progress";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    label: "Mínimo de 8 caracteres",
    test: (password) => password.length >= 8,
  },
  {
    label: "Pelo menos uma letra maiúscula",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Pelo menos uma letra minúscula",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Pelo menos um número",
    test: (password) => /[0-9]/.test(password),
  },
  {
    label: "Pelo menos um caractere especial",
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  },
];

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "", textColor: "" };

    const metRequirements = requirements.filter((req) => req.test(password)).length;
    const score = metRequirements;

    if (score === 0)
      return { score: 0, label: "Muito fraca", color: "bg-error", textColor: "text-error" };
    if (score === 1)
      return { score: 1, label: "Fraca", color: "bg-orange-500", textColor: "text-orange-500" };
    if (score === 2)
      return { score: 2, label: "Regular", color: "bg-yellow-500", textColor: "text-yellow-500" };
    if (score === 3)
      return { score: 3, label: "Boa", color: "bg-blue-500", textColor: "text-blue-500" };
    if (score === 4)
      return { score: 4, label: "Forte", color: "bg-green-500", textColor: "text-green-500" };
    return { score: 5, label: "Muito forte", color: "bg-green-600", textColor: "text-green-600" };
  }, [password]);

  const progress = (strength.score / requirements.length) * 100;

  if (!password) return null;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-text-secondary">
            Força da senha: <span className={strength.textColor}>{strength.label}</span>
          </span>
          <span className="text-xs text-text-muted">
            {strength.score}/{requirements.length}
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-gray-200"
          indicatorClassName={strength.color}
        />
      </div>

      <div className="space-y-2">
        {requirements.map((requirement, index) => {
          const isMet = requirement.test(password);
          return (
            <div
              key={index}
              className={`flex items-center gap-2 text-xs ${
                isMet ? "text-green-600" : "text-text-muted"
              }`}
            >
              {isMet ? (
                <Check className="w-4 h-4 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{requirement.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
