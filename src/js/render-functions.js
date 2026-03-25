import SimpleLightbox from 'simplelightbox';

const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');
const loadMoreBtnEl = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', {
	captionsData: 'alt',
	captionDelay: 250,
});

function createImageCardMarkup({
	webformatURL,
	largeImageURL,
	tags,
	likes,
	views,
	comments,
	downloads,
}) {
	return `<li class="gallery-item">
		<a class="gallery-link" href="${largeImageURL}">
			<img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
		</a>
		<div class="image-info">
			<p><b>Likes</b><span>${likes}</span></p>
			<p><b>Views</b><span>${views}</span></p>
			<p><b>Comments</b><span>${comments}</span></p>
			<p><b>Downloads</b><span>${downloads}</span></p>
		</div>
	</li>`;
}

export function createGallery(images) {
	const markup = images.map(createImageCardMarkup).join('');
	galleryEl.insertAdjacentHTML('beforeend', markup);
	lightbox.refresh();
}

export function clearGallery() {
	galleryEl.innerHTML = '';
}

export function showLoader() {
	loaderEl.classList.remove('is-hidden');
}

export function hideLoader() {
	loaderEl.classList.add('is-hidden');
}

export function showLoadMoreButton() {
	loadMoreBtnEl.classList.remove('is-hidden');
}

export function hideLoadMoreButton() {
	loadMoreBtnEl.classList.add('is-hidden');
}
