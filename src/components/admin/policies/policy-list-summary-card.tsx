"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PolicyListSummaryCard({
  title,
  value,
  active = false,
  tone = "default",
  onClick,
}: {
  title: string
  value: number
  active?: boolean
  tone?: "default" | "green" | "gray" | "red"
  onClick: () => void
}) {
  const toneClass =
    tone === "green"
      ? "text-green-600"
      : tone === "gray"
        ? "text-gray-600"
        : tone === "red"
          ? "text-red-600"
          : "text-gray-900"

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition hover:border-blue-200 hover:shadow-sm ${
        active ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${toneClass}`}>{value}</div>
      </CardContent>
    </Card>
  )
}
