import {ASSERT} from "../../core/Assertions";
/**
 *
 * @param allItems                   The order of this matters
 * @param currentSelection
 * @param chosen
 * @param firstSelected
 */

export function rangeSelect<T>(
    allItems: Array<T>,
    currentSelection: Array<T>,
    chosen: T,
    firstSelected: T = undefined): Array<T> {

    if (currentSelection.length === 0) {
        return [chosen];

    } else if (currentSelection.length === 1 && currentSelection.indexOf(chosen) !== -1) {
        return [];
    }

    ASSERT(firstSelected !== undefined, "for extending selections the item selected first must be provided");
    const firstIndex = allItems.indexOf(firstSelected);
    const chosenIndex = allItems.indexOf(chosen);

    const start = Math.min(firstIndex, chosenIndex);
    const end = Math.max(firstIndex, chosenIndex);

    return allItems.filter((a, i) => i >= start && i <= end);
}
