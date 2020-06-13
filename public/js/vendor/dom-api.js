export const $ = (query, container = document) => {
  return container.querySelector(query);
};

export const $$ = (query, container = document) => {
  return container.querySelectorAll(query);
};
