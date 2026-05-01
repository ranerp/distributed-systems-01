type Props = {
  chapter: string
}

export function ChapterLabel({ chapter }: Props) {
  return (
    <span className="text-xs font-mono tracking-widest uppercase text-accent-blue opacity-70">
      {chapter}
    </span>
  )
}
