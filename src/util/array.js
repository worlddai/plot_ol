export function swap(arr, index1, index2) {

    if (index1 >= arr.length || index2 >= arr.length)
        return null;

    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}
export function moveUp(arr, $index) {
    if ($index == arr.length - 1) {
        return;
    }
    swap(arr, $index, $index + 1);
}

export function moveDown(arr, $index) {
    if ($index == 0) {
        return;
    }
    swap(arr, $index, $index - 1);
}
export function moveToTop(arr, $index) {
    if ($index == arr.length - 1) {
        return;
    }
    swap(arr, $index, arr.length - 1);
}
export function moveToBottom(arr, $index) {
    if ($index == 0) {
        return;
    }
    swap(arr, $index, 0);
}
