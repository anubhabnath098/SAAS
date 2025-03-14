const compactNumberFormatter = new Intl.NumberFormat("en-US", { notation: "compact" });

export function formatCompactNumber(number:number){
    return compactNumberFormatter.format(number)
}