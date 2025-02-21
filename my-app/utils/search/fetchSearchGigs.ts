import { GigData } from '@/types/types';

export async function fetchRecentGigs(
    page: number,
    search: string,
    setRecentGigs: (gigs: GigData[]) => void,
    setTotalPages: (pages: number) => void,
    setCurrentPage: (page: number) => void,
    setIsLoading: (loading: boolean) => void,
    toast: any
) {
    setIsLoading(true);
    try {
        const response = await fetch(`/api/get-recent-gigs?page=${page}&limit=9&search=${encodeURIComponent(search)}`);
        if (response.status === 404) {
            toast({
                title: "No gigs found",
                description: `We couldn't find gigs containing the keyword "${search}"`,
                variant: "default",
            });
            setRecentGigs([]);
            setTotalPages(0);
            setCurrentPage(1);
            return;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch recent gigs');
        }
        const data = await response.json();
        setRecentGigs(data.gigs);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
    } catch (error) {
        console.error('Error fetching recent gigs:', error);
        toast({
            title: "Error",
            description: `${error}`,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
}