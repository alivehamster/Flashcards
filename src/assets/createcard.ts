export const cardClass =
  "flex flex-col w-2/3 min-h-40 p-3 m-3 bg-gray-400 rounded-2xl card";

export function cardHTML(num: number) {
  return `
        <div>
          <h1>${num}</h1>
        </div>
        <div class="flex w-full h-full justify-between">
          <textarea
            placeholder="Side 1"
            class="p-3 mr-2 min-h-24 w-1/2 rounded-2xl bg-gray-600 resize-none overflow-hidden text-white"
            rows="3" maxLength="500"></textarea>
          <textarea
            placeholder="Side 2"
            class="p-3 ml-2 min-h-24 w-1/2 rounded-2xl bg-gray-600 resize-none overflow-hidden text-white"
            rows="3" maxLength="500"></textarea>
        </div>
      `;
}
