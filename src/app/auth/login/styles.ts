import { theme } from '@/styles/theme';

export const styles = {
  container: `min-h-screen flex items-center justify-center p-4 bg-${theme.colors.background.main}`,
  card: `w-full max-w-md p-8 space-y-6 bg-${theme.colors.background.card} rounded-lg shadow-md`,
  header: {
    container: 'text-center mb-6',
    title: `text-2xl font-bold text-${theme.colors.text.primary}`,
    subtitle: `mt-2 text-${theme.colors.text.secondary}`,
  },
  errorAlert: `p-3 bg-${theme.colors.error.light} border border-${theme.colors.error.main} text-${theme.colors.error.text} rounded`,
  form: 'space-y-5',
  formGroup: 'space-y-1',
  label: `block text-sm font-medium text-${theme.colors.text.primary}`,
  input: {
    base: `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-${theme.colors.border.focus}`,
    default: `border-${theme.colors.border.main}`,
    error: `border-${theme.colors.error.main}`,
  },
  errorMessage: `mt-1 text-sm text-${theme.colors.error.main}`,
  button: `w-full bg-${theme.colors.primary.main} text-${theme.colors.primary.text} hover:bg-${theme.colors.primary.dark} py-2 px-4 rounded-md transition-colors`,
  footer: {
    container: 'text-center mt-6',
    text: `text-${theme.colors.text.secondary}`,
    link: `text-${theme.colors.primary.main} hover:underline`,
  }
};