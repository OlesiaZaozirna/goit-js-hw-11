export const createCards = photos => {
  return photos
    .map(photo => {
      const {
        likes,
        views,
        comments,
        downloads,
        webformatURL,
        largeImageURL,
        tags,
      } = photo;
      return `
        <div class="photo-card">
          <a href='${largeImageURL}'>
            <div class="img-wrapper">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </div>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${downloads}
              </p>
            </div>
          </a>
        </div>
      `;
    })
    .join('');
};
