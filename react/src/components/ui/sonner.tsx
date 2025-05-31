import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#fff",
          "--normal-text": "#d42d2d",
          "--normal-border": "#ff9090",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
