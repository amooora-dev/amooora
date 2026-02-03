interface TagProps {
  children: React.ReactNode;
  color?: string;
}

export function Tag({ children, color = '#932d6f' }: TagProps) {
  return (
    <span 
      className="px-3 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}