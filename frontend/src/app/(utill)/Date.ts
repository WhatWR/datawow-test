export function timeAgo(date: Date | string | number): string {
    const now = new Date();
    const inputDate = typeof date === "string" || typeof date === "number" ? new Date(date) : date;

    const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
        y: 31536000,  // 365 days * 24 hours * 60 minutes * 60 seconds
        mo: 2592000,  // 30 days * 24 hours * 60 minutes * 60 seconds
        d: 86400,      // 24 hours * 60 minutes * 60 seconds
        h: 3600,      // 60 minutes * 60 seconds
        min: 60,
        s: 1,
    };

    for (const key in intervals) {
        const interval = Math.floor(seconds / intervals[key]);

        if (interval >= 1) {
            const unit = interval === 1 ? key : `${key}`;
            return `${interval} ${unit} ago`;
        }
    }

    return "just now";
}
