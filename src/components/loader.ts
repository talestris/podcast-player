export function toggleLoader(isLoading: boolean) {
  const loader = document.querySelector("#loader") as HTMLElement;

  if (loader) {
    loader.style.display = isLoading ? "block" : "none";
  }
}
