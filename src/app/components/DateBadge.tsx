interface DateBadgeProps {
  date: string;
}

export function DateBadge({ date }: DateBadgeProps) {
  return (
    <div className="bg-secondary text-white px-2.5 py-1.5 rounded-lg text-center min-w-[50px]">
      <div className="text-xs font-semibold leading-tight">{date}</div>
    </div>
  );
}
