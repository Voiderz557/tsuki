/**
 * GraphQL query documents for the AniList API. Kept in one place so no
 * component or page ever embeds a raw query string directly.
 */

const PAGE_INFO_FIELDS = /* GraphQL */ `
  pageInfo {
    total
    currentPage
    lastPage
    hasNextPage
    perPage
  }
`;

/** Fields needed to render a poster card (homepage, browse, search, seasonal). */
const MEDIA_CARD_FIELDS = /* GraphQL */ `
  id
  type
  title {
    english
    romaji
    native
  }
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  averageScore
  popularity
  episodes
  duration
  chapters
  volumes
  format
  status
  season
  seasonYear
  startDate {
    year
  }
  genres
`;

/** Full fields for the anime/manga detail page. */
const MEDIA_DETAIL_FIELDS = /* GraphQL */ `
  ${MEDIA_CARD_FIELDS}
  description(asHtml: false)
  meanScore
  favourites
  source
  tags {
    name
    isMediaSpoiler
  }
  studios(sort: [NAME]) {
    edges {
      isMain
      node {
        id
        name
      }
    }
  }
  characters(sort: [ROLE, RELEVANCE, ID], perPage: 12) {
    edges {
      role
      node {
        id
        name {
          full
        }
        image {
          large
          medium
        }
      }
      voiceActors(language: JAPANESE, sort: [RELEVANCE]) {
        id
        name {
          full
        }
        image {
          medium
        }
        languageV2
      }
    }
  }
  staff(sort: [RELEVANCE, ID], perPage: 8) {
    edges {
      role
      node {
        id
        name {
          full
        }
        image {
          large
          medium
        }
      }
    }
  }
  recommendations(sort: RATING_DESC, perPage: 10) {
    edges {
      node {
        mediaRecommendation {
          ${MEDIA_CARD_FIELDS}
        }
      }
    }
  }
  relations {
    edges {
      relationType
      node {
        ${MEDIA_CARD_FIELDS}
      }
    }
  }
  stats {
    scoreDistribution {
      score
      amount
    }
    statusDistribution {
      status
      amount
    }
  }
  trailer {
    id
    site
  }
`;

export const TRENDING_ANIME_QUERY = /* GraphQL */ `
  query TrendingAnime($perPage: Int, $page: Int) {
    Page(page: $page, perPage: $perPage) {
      ${PAGE_INFO_FIELDS}
      media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
        ${MEDIA_CARD_FIELDS}
      }
    }
  }
`;

export const SEASONAL_ANIME_QUERY = /* GraphQL */ `
  query SeasonalAnime(
    $season: MediaSeason
    $seasonYear: Int
    $sort: [MediaSort]
    $format: [MediaFormat]
    $page: Int
    $perPage: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      ${PAGE_INFO_FIELDS}
      media(
        type: ANIME
        season: $season
        seasonYear: $seasonYear
        sort: $sort
        format_in: $format
        isAdult: false
      ) {
        ${MEDIA_CARD_FIELDS}
      }
    }
  }
`;

export const BROWSE_MEDIA_QUERY = /* GraphQL */ `
  query BrowseMedia(
    $type: MediaType
    $search: String
    $genre_in: [String]
    $seasonYear: Int
    $season: MediaSeason
    $format_in: [MediaFormat]
    $status: MediaStatus
    $averageScore_greater: Int
    $sort: [MediaSort]
    $page: Int
    $perPage: Int
  ) {
    Page(page: $page, perPage: $perPage) {
      ${PAGE_INFO_FIELDS}
      media(
        type: $type
        search: $search
        genre_in: $genre_in
        seasonYear: $seasonYear
        season: $season
        format_in: $format_in
        status: $status
        averageScore_greater: $averageScore_greater
        sort: $sort
        isAdult: false
      ) {
        ${MEDIA_CARD_FIELDS}
      }
    }
  }
`;

export const MEDIA_BY_ID_QUERY = /* GraphQL */ `
  query MediaById($id: Int!, $type: MediaType) {
    Media(id: $id, type: $type) {
      ${MEDIA_DETAIL_FIELDS}
    }
  }
`;

export const SEARCH_MEDIA_QUERY = /* GraphQL */ `
  query SearchMedia($search: String!, $type: MediaType, $perPage: Int) {
    Page(perPage: $perPage) {
      media(search: $search, type: $type, sort: [SEARCH_MATCH, POPULARITY_DESC], isAdult: false) {
        ${MEDIA_CARD_FIELDS}
      }
    }
  }
`;
