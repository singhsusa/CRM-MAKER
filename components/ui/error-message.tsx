interface ErrorMessageProps {
  message?: string
}

export function ErrorMessage({ message = "Something went wrong" }: ErrorMessageProps) {
  return (
    <div className="flex h-[450px] w-full items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive">{message}</h3>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </div>
    </div>
  )
} 