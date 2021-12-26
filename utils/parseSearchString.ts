enum SearchParams {
  YOUTUBE = "youtube.com",
  SPOTIFY = "spotify",
}

export const parseSearchString = (songSearchParams: string[]) => {
  if (songSearchParams[0].includes(SearchParams.YOUTUBE)) {
    return songSearchParams[0];
  }

  return songSearchParams.join(" ");
};
