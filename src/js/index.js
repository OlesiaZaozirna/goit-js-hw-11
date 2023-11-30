import { getPhotos } from './pixabay-api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { formEl, loadMoreBtn, galleryListEl, input } from './refs';
import { createCards } from './markup';

let page = 1;
let perPage = 40;
let arrPhotos = [];
let totalPhotos = 0;
let userInput = null;

async function getData(userInput, page, perPage) {
  try {
    const response = await getPhotos(userInput, page, perPage);
    arrPhotos = response.hits;
    totalPhotos = response.totalHits;
    galleryListEl.insertAdjacentHTML('beforeend', createCards(arrPhotos));
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });

    const lastPage = Math.ceil(response.totalHits / perPage);
    if (lastPage === page) {
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
    Notify.failure(`Oops. Something went wrong.`);
  }
}
formEl.addEventListener('submit', async event => {
  event.preventDefault();
  galleryListEl.innerHTML = '';
  page = 1;

  userInput = input.value.trim();
  if (!userInput) {
    Notify.failure(`I'm sorry, but I can't process an empty request.`);
    loadMoreBtn.classList.add('is-hidden');
    return;
  }
  await getData(userInput, page, perPage);
  if (arrPhotos.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtn.classList.add('is-hidden');
  }
  if (arrPhotos.length < perPage) {
    Notify.success(`Hooray! We found ${totalPhotos} images.`);
    loadMoreBtn.classList.add('is-hidden');
  } else {
    Notify.success(`Hooray! We found ${totalPhotos} images.`);
    loadMoreBtn.classList.remove('is-hidden');
  }
  window.scrollTo({ top: 0 });
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  await getData(userInput, page, perPage);
  smoothScroll();
});

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
