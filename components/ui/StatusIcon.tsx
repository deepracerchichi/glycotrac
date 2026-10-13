import { CircleCheck, Clock, TriangleAlert } from "lucide-react";

const icons = { taken: CircleCheck, due: Clock, low: TriangleAlert };

export type StatusKind = keyof typeof icons;

export default function StatusIcon({
  kind,
  className = "size-4",
}: {
  kind: StatusKind;
  className?: string;
}) {
  const Icon = icons[kind];
  return <Icon className={`shrink-0 ${className}`} aria-hidden="true" />;
}