import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { formEl, galleryListEl, simpleLiteBox, infiniteScroll } from './refs';
import { createGalleryCardsTemplate } from './markup';
import { PixabayAPI } from './pixabay-api';

const pixabayAPI = new PixabayAPI();

pixabayAPI.page = 1;

const options = {
  root: null,
  rootMargin: '0px 0px 200px 0px',
  threshold: 1.0,
};

//infinite scroll

const onInfiniteLoad = async (entries, observer) => {
  if (!entries[0].isIntersecting) {
    return;
  }
  pixabayAPI.page += 1;
  try {
    const { data } = await pixabayAPI.fetchPhotosByQuery();
    const lastPage = Math.ceil(data.totalHits / pixabayAPI.perPage);

    if (lastPage === pixabayAPI.page) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      infiniteScrollObserver.unobserve(infiniteScroll);
    }

    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCardsTemplate(data.hits)
    );
    simpleLiteBox.refresh();
  } catch (err) {
    console.log(err);
  }
};

const infiniteScrollObserver = new IntersectionObserver(
  onInfiniteLoad,
  options
);

// Функція для пошуку з інпуту
const onSearchFormElSubmit = async event => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements['searchQuery'].value.trim();
  pixabayAPI.query = searchQuery;

  //Очищаємо розмітку галереї та скидаємо сторінку до першої перед новим пошуком
  galleryListEl.innerHTML = '';
  pixabayAPI.page = 1;

  if (!searchQuery) {
    Notify.info('Empty search');
    return;
  }

  try {
    const { data } = await pixabayAPI.fetchPhotosByQuery();

    if (data.totalHits === 0) {
      Report.info(
        'Sorry,',
        'there are no images matching your search query.',
        'Please try again.'
      );
    }

    if (data.totalHits > 0) {
      Notify.success(`we found ${data.totalHits} pictures`);
    }

    // Якщо знайдено лише одне зображення, вставляємо HTML повністю
    if (data.total === 1) {
      galleryListEl.innerHTML = createGalleryCardsTemplate(data.hits);
      return;
    }

    // Вставляємо HTML в кінець галереї для кількох знайдених зображень
    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCardsTemplate(data.hits)
    );
    simpleLiteBox.refresh();

    // Запускаємо обсервер для скролу, якщо є більше зображень, ніж на одну сторінку
    if (data.totalHits > pixabayAPI.perPage) {
      infiniteScrollObserver.observe(infiniteScroll);
    }
  } catch (err) {
    Report.failure('Oops! Something went wrong! Try reloading the page!');
  }
};

formEl.addEventListener('submit', onSearchFormElSubmit);
