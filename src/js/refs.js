import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const formEl = document.querySelector('.search-form');
export const searchQueryEl = document.querySelector('[name=searchQuery]');
export const searchBtn = document.querySelector('#searchBtn');
export const loadMoreBtn = document.querySelector('.load-more');
export const galleryListEl = document.querySelector('.gallery');
export const simpleLiteBox = new SimpleLightbox('.gallery a');
export const infiniteScroll = document.querySelector(
  '#js-target-infinite-scroll'
);
