import { useEffect } from 'react'

interface UsePageTitleProps {
  title: string
  prefix?: string
}

export const usePageTitle = ({ title, prefix = 'NGPRO Mantenimientos' }: UsePageTitleProps) => {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} - ${prefix}`
    
    return () => {
      document.title = previousTitle
    }
  }, [title, prefix])
}

export default usePageTitle
