// Define the interface for the parameters
interface CalculateUSDCPerSecondParams {
    dueDate: string;
    amount: number;
}

// Export the function with the interface as parameter
export function calculateUSDCPerSecond(dueDate: string, amount: number): number {


    // dueDateTimestamp: Math.floor(new Date('2024-12-31T23:59:59Z').getTime() / 1000), // Example due date in Unix timestamp
    const dueDateTimestamp = Math.floor(new Date(dueDate).getTime() / 1000)
    const todayTimestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds

    // Calculate the difference in seconds
    const differenceInSeconds = dueDateTimestamp - todayTimestamp;

    // Ensure the due date is in the future
    if (differenceInSeconds <= 0) {
        throw new Error("The due date must be in the future");
    }

    // Calculate USDC per second
    const usdcPerSecond = amount / differenceInSeconds;

    return usdcPerSecond;
}

// Example usage: