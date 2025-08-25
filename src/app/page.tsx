"use client";

import React, { useState, useEffect, useRef } from "react";

type Algorithm = "bubbleSort" | "quickSort" | "mergeSort" | "insertionSort" | "selectionSort";
type BarState = "default" | "comparing" | "swapped" | "sorted";

const ALGORITHM_DELAY = 10;

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [barStates, setBarStates] = useState<BarState[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>("bubbleSort");
  const [isSorting, setIsSorting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const stopSortingRef = useRef(false);

  useEffect(() => {
    generateNewArray();
  }, []);

  const generateNewArray = () => {
    if (isSorting) return;
    const newArray = Array.from({ length: 50 }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setBarStates(new Array(50).fill("default"));
    setLogs(["Generated new array."]);
  };

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, message]);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bubbleSort = async (arr: number[], newBarStates: BarState[]) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopSortingRef.current) return;
        newBarStates[j] = "comparing";
        newBarStates[j + 1] = "comparing";
        setBarStates([...newBarStates]);
        addLog(`Comparing ${arr[j]} and ${arr[j + 1]}.`);
        await sleep(ALGORITHM_DELAY);

        if (arr[j] > arr[j + 1]) {
          newBarStates[j] = "swapped";
          newBarStates[j + 1] = "swapped";
          setBarStates([...newBarStates]);
          addLog(`Swapping ${arr[j]} and ${arr[j + 1]}.`);
          await sleep(ALGORITHM_DELAY);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
        newBarStates[j] = "default";
        newBarStates[j + 1] = "default";
      }
      newBarStates[n - 1 - i] = "sorted";
      setBarStates([...newBarStates]);
    }
    newBarStates[0] = "sorted";
    setBarStates([...newBarStates]);
  };

  const quickSort = async (arr: number[], low: number, high: number, newBarStates: BarState[]) => {
    if (low < high) {
      if (stopSortingRef.current) return;
      const pi = await partition(arr, low, high, newBarStates);
      await quickSort(arr, low, pi - 1, newBarStates);
      await quickSort(arr, pi + 1, high, newBarStates);
    }
    if (low >= 0 && low < arr.length) newBarStates[low] = "sorted";
    if (high >= 0 && high < arr.length) newBarStates[high] = "sorted";
  };

  const partition = async (arr: number[], low: number, high: number, newBarStates: BarState[]) => {
    const pivot = arr[high];
    let i = low - 1;
    newBarStates[high] = "comparing";
    addLog(`Pivot selected: ${pivot}`);
    for (let j = low; j < high; j++) {
      if (stopSortingRef.current) return i;
      newBarStates[j] = "comparing";
      setBarStates([...newBarStates]);
      addLog(`Comparing ${arr[j]} with pivot ${pivot}.`);
      await sleep(ALGORITHM_DELAY);
      if (arr[j] < pivot) {
        i++;
        newBarStates[i] = "swapped";
        newBarStates[j] = "swapped";
        setBarStates([...newBarStates]);
        addLog(`Swapping ${arr[i]} and ${arr[j]}.`);
        await sleep(ALGORITHM_DELAY);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        newBarStates[i] = "default";
      }
      newBarStates[j] = "default";
    }
    newBarStates[i + 1] = "swapped";
    newBarStates[high] = "swapped";
    setBarStates([...newBarStates]);
    addLog(`Swapping pivot ${arr[high]} with ${arr[i + 1]}.`);
    await sleep(ALGORITHM_DELAY);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    newBarStates[i + 1] = "default";
    newBarStates[high] = "default";
    setBarStates([...newBarStates]);
    return i + 1;
  };

  const mergeSort = async (arr: number[], l: number, r: number, newBarStates: BarState[]) => {
    if (l >= r) {
      if (l >= 0 && l < arr.length) newBarStates[l] = "sorted";
      return;
    }
    if (stopSortingRef.current) return;
    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m, newBarStates);
    await mergeSort(arr, m + 1, r, newBarStates);
    await merge(arr, l, m, r, newBarStates);
  };

  const merge = async (arr: number[], l: number, m: number, r: number, newBarStates: BarState[]) => {
    const n1 = m - l + 1, n2 = r - m;
    const L = new Array(n1), R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      if (stopSortingRef.current) return;
      newBarStates[l + i] = "comparing";
      newBarStates[m + 1 + j] = "comparing";
      setBarStates([...newBarStates]);
      addLog(`Comparing ${L[i]} and ${R[j]}.`);
      await sleep(ALGORITHM_DELAY);
      if (L[i] <= R[j]) {
        arr[k] = L[i]; i++;
      } else {
        arr[k] = R[j]; j++;
      }
      newBarStates[k] = "swapped";
      setArray([...arr]);
      setBarStates([...newBarStates]);
      await sleep(ALGORITHM_DELAY);
      newBarStates[k] = "sorted";
      k++;
    }
    while (i < n1) {
      if (stopSortingRef.current) return;
      arr[k] = L[i];
      newBarStates[k] = "sorted";
      setArray([...arr]); setBarStates([...newBarStates]);
      i++; k++;
      await sleep(ALGORITHM_DELAY);
    }
    while (j < n2) {
      if (stopSortingRef.current) return;
      arr[k] = R[j];
      newBarStates[k] = "sorted";
      setArray([...arr]); setBarStates([...newBarStates]);
      j++; k++;
      await sleep(ALGORITHM_DELAY);
    }
  };

  const insertionSort = async (arr: number[], newBarStates: BarState[]) => {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        newBarStates[i] = "comparing";
        setBarStates([...newBarStates]);
        addLog(`Selecting ${key} to insert.`);
        await sleep(ALGORITHM_DELAY);

        while (j >= 0 && arr[j] > key) {
            if (stopSortingRef.current) return;
            newBarStates[j] = "comparing";
            setBarStates([...newBarStates]);
            addLog(`Comparing ${arr[j]} with ${key}.`);
            await sleep(ALGORITHM_DELAY);

            newBarStates[j + 1] = "swapped";
            arr[j + 1] = arr[j];
            setArray([...arr]);
            setBarStates([...newBarStates]);
            addLog(`Moving ${arr[j]} to the right.`);
            await sleep(ALGORITHM_DELAY);
            newBarStates[j + 1] = "default";
            newBarStates[j] = "default";
            j = j - 1;
        }
        arr[j + 1] = key;
        newBarStates[i] = "default";
        newBarStates[j + 1] = "swapped";
        setArray([...arr]);
        setBarStates([...newBarStates]);
        await sleep(ALGORITHM_DELAY);
    }
    for(let k=0; k<n; k++) newBarStates[k] = "sorted";
    setBarStates([...newBarStates]);
  };

  const selectionSort = async (arr: number[], newBarStates: BarState[]) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        newBarStates[i] = "comparing"; // Current element being considered for minimum
        addLog(`Finding minimum from index ${i}.`);
        for (let j = i + 1; j < n; j++) {
            if (stopSortingRef.current) return;
            newBarStates[j] = "comparing";
            setBarStates([...newBarStates]);
            addLog(`Comparing ${arr[j]} with current minimum ${arr[min_idx]}.`);
            await sleep(ALGORITHM_DELAY);
            if (arr[j] < arr[min_idx]) {
                newBarStates[min_idx] = "default";
                min_idx = j;
                newBarStates[min_idx] = "comparing"; // New minimum found
            }
             if(j !== min_idx) newBarStates[j] = "default";
        }
        newBarStates[min_idx] = "swapped";
        newBarStates[i] = "swapped";
        setBarStates([...newBarStates]);
        addLog(`Swapping ${arr[i]} with minimum ${arr[min_idx]}.`);
        await sleep(ALGORITHM_DELAY);

        [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
        setArray([...arr]);

        newBarStates[min_idx] = "default";
        newBarStates[i] = "sorted";
        setBarStates([...newBarStates]);
    }
    newBarStates[n-1] = "sorted";
    setBarStates([...newBarStates]);
  };

  const startSorting = async () => {
    if (isSorting) return;
    setIsSorting(true);
    stopSortingRef.current = false;
    addLog(`Starting ${algorithm}.`);
    const arr = [...array];
    const newBarStates = new Array(arr.length).fill("default") as BarState[];
    switch (algorithm) {
      case "bubbleSort": await bubbleSort(arr, newBarStates); break;
      case "quickSort": await quickSort(arr, 0, arr.length - 1, newBarStates); break;
      case "mergeSort": await mergeSort(arr, 0, arr.length - 1, newBarStates); break;
      case "insertionSort": await insertionSort(arr, newBarStates); break;
      case "selectionSort": await selectionSort(arr, newBarStates); break;
    }
    if (!stopSortingRef.current) {
      addLog("Sorting finished.");
      setBarStates(new Array(array.length).fill("sorted"));
    } else {
      addLog("Sorting stopped by user.");
      setBarStates(new Array(array.length).fill("default"));
    }
    setIsSorting(false);
    stopSortingRef.current = false;
  };

  const stopSorting = () => { if (isSorting) stopSortingRef.current = true; };

  const getBarColor = (state: BarState) => {
    switch (state) {
      case "comparing": return "bg-yellow-400";
      case "swapped": return "bg-red-500";
      case "sorted": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Sorting Algorithm Visualizer</h1>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <button onClick={generateNewArray} disabled={isSorting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600">Generate New Array</button>
            <select value={algorithm} onChange={e => setAlgorithm(e.target.value as Algorithm)} disabled={isSorting} className="bg-gray-700 text-white font-bold py-2 px-4 rounded">
                <option value="bubbleSort">Bubble Sort</option>
                <option value="quickSort">Quick Sort</option>
                <option value="mergeSort">Merge Sort</option>
                <option value="insertionSort">Insertion Sort</option>
                <option value="selectionSort">Selection Sort</option>
            </select>
            <button onClick={startSorting} disabled={isSorting} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600">Sort</button>
            <button onClick={stopSorting} disabled={!isSorting} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600">Stop</button>
        </div>
        <div className="flex flex-col lg:flex-row w-full h-full gap-4">
            <div className="flex items-end justify-center h-96 lg:h-[500px] w-full lg:w-2/3 border-2 border-gray-600 p-2">
                {array.map((value, idx) => (
                    <div key={idx} className={`w-4 mx-0.5 transition-all duration-150 ${getBarColor(barStates[idx])}`} style={{ height: `${value * 4.5}px` }}></div>
                ))}
            </div>
            <div className="w-full lg:w-1/3 h-96 lg:h-[500px] bg-gray-800 rounded p-2 flex flex-col">
                <h2 className="text-lg font-semibold mb-2 text-center">Logs</h2>
                <textarea
                readOnly
                value={logs.join("\n")}
                className="w-full h-full bg-gray-900 text-gray-300 font-mono text-sm p-2 rounded resize-none" />
            </div>
        </div>
      </div>
    </div>
  );
}
