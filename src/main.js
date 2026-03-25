import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
	createGallery,
	clearGallery,
	showLoader,
	hideLoader,
	showLoadMoreButton,
	hideLoadMoreButton,
} from './js/render-functions.js';

const formEl = document.querySelector('.search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

let currentQuery = '';
let page = 1;
let totalHits = 0;
let loadedHits = 0;

formEl.addEventListener('submit', onSearchSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreClick);

async function onSearchSubmit(event) {
	event.preventDefault();

	const query = event.currentTarget.elements.searchQuery.value.trim();

	hideLoadMoreButton();
	clearGallery();

	if (!query) {
		showWarning('Please enter a search query.');
		return;
	}

	currentQuery = query;
	page = 1;
	totalHits = 0;
	loadedHits = 0;

	showLoader();

	try {
		const data = await getImagesByQuery(currentQuery, page);

		if (data.hits.length === 0) {
			showError(
				'Sorry, there are no images matching your search query. Please try again!'
			);
			return;
		}

		totalHits = data.totalHits;
		loadedHits = data.hits.length;

		createGallery(data.hits);

		if (loadedHits < totalHits) {
			showLoadMoreButton();
		} else {
			hideLoadMoreButton();
			showInfo("We're sorry, but you've reached the end of search results.");
		}
	} catch (error) {
		showError(
			error?.message || 'Something went wrong. Please try again later.'
		);
	} finally {
		hideLoader();
	}
}

async function onLoadMoreClick() {
	page += 1;
	hideLoadMoreButton();
	showLoader();

	try {
		const data = await getImagesByQuery(currentQuery, page);
		loadedHits += data.hits.length;

		createGallery(data.hits);
		smoothScroll();

		if (loadedHits >= totalHits) {
			hideLoadMoreButton();
			showInfo("We're sorry, but you've reached the end of search results.");
			return;
		}

		showLoadMoreButton();
	} catch (error) {
		page -= 1;
		showError(
			error?.message || 'Something went wrong. Please try again later.'
		);

		if (loadedHits < totalHits) {
			showLoadMoreButton();
		}
	} finally {
		hideLoader();
	}
}

function smoothScroll() {
	const firstCard = galleryEl.firstElementChild;

	if (!firstCard) {
		return;
	}

	const { height: cardHeight } = firstCard.getBoundingClientRect();

	window.scrollBy({
		top: cardHeight * 2,
		behavior: 'smooth',
	});
}

function showError(message) {
	iziToast.error({ message, position: 'topRight' });
}

function showWarning(message) {
	iziToast.warning({ message, position: 'topRight' });
}

function showInfo(message) {
	iziToast.info({ message, position: 'topRight' });
}
