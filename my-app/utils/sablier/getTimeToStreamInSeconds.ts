export function getTimeRemainingInSeconds(dueDate: number): number {
    const now = Date.now();
    const differenceMs = dueDate - now;
    
    console.log(differenceMs)
    console.log(Math.max(0, Math.floor(differenceMs / 1000)))
    return Math.max(0, Math.floor(differenceMs / 1000)); // Convert to seconds and ensure non-negative
  }