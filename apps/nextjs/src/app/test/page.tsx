"use client";

import { TestButton } from "../testButton";

export default function TestPage() {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  nums.map(() => {
    console.log(num);
  });

  return (
    <>
      <button
        onClick={() => {
          // а тут не прокатує. Помилка в косолі випадає, а як її відловити - поки що не можу зрозуміти
          console.log("test");
          throw new Error("test kkk");
        }}
      >
        test
      </button>
    </>
  );
}
