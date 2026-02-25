export function getSuggestions(currentSearchTerm: string | undefined, searchHistory: string[] | undefined) {
  if (currentSearchTerm == null || searchHistory == null) {
    return [];
  }
  const suggestions = searchHistory.filter(previousSearchTerm =>
    currentSearchTerm.length > 0
    && previousSearchTerm.includes(currentSearchTerm)
    && previousSearchTerm !== currentSearchTerm
    && previousSearchTerm.length > 2
  );

  return suggestions;
}
