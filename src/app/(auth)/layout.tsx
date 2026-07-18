import { ThemeProvider } from '@/components/theme/ThemeProvider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
